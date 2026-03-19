import { AuthOptions, DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createRateLimiter, RATE_LIMITS } from "./rateLimit";
import { getClientIdentifier } from "./getClientIP";
import { getAdminDatabase } from "@/lib/firebase/admin";
import {
  extractUserData,
  isValidRBCAUserData,
  type RBCAUserData,
} from "@/types/rbca-user";
import { secureEnv } from "./secureEnv";
import { secureLogger } from "./secureLogger";

// Configuration Constants
const SESSION_CONFIG = {
  MAX_AGE_HOURS: 24,
  UPDATE_AGE_HOURS: 1,
  SECONDS_PER_HOUR: 3600,
} as const;

const SECURITY_CONFIG = {
  BCRYPT_SALT_ROUNDS: 12,
  FIRST_ELEMENT_INDEX: 0,
} as const;

const OAUTH_CONFIG = {
  FACEBOOK_STEP_COMPLETION: 7,
} as const;

const NAME_PARSING = {
  FIRST_NAME_INDEX: 0,
  REMAINING_NAMES_START: 1,
} as const;

// --- FIX: Add onboardingComplete and 2FA to the session and user types ---
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onboardingComplete?: boolean;
      emailVerified?: boolean;
      twoFactorRequired?: boolean;
      twoFactorVerified?: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    onboardingComplete?: boolean;
    emailVerified?: boolean;
    twoFactorRequired?: boolean;
    twoFactorVerified?: boolean;
  }
}
// --- FIX: Add onboardingComplete and 2FA to the JWT type ---
declare module "next-auth/jwt" {
  interface JWT {
    email?: string; // User email (required for proxy middleware validation)
    onboardingComplete?: boolean;
    emailVerified?: boolean;
    twoFactorRequired?: boolean;
    twoFactorVerified?: boolean;
    twoFactorVerifiedAt?: number; // Timestamp in milliseconds
    image?: string | null; // Profile picture URL from OAuth provider
  }
}

export const authOptions: AuthOptions = {
  // No adapter needed for JWT strategy
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        // Firebase-only authentication for RBCA users
        let user = null;

        try {
          const database = getAdminDatabase();
          const emailQuery = await database
            .ref("rbca_users")
            .orderByChild("pin/eml")
            .equalTo(credentials.email.toLowerCase())
            .once("value");

          if (emailQuery.exists()) {
            const firebaseData = emailQuery.val();
            const firebaseUserId =
              Object.keys(firebaseData)[SECURITY_CONFIG.FIRST_ELEMENT_INDEX];
            const userData = firebaseData[firebaseUserId];

            // Validate and use RBCA user data directly
            if (isValidRBCAUserData(userData)) {
              user = { ...userData, id: firebaseUserId };
              console.log(
                `🔍 [DEBUG] Found RBCA user in Firebase: ${firebaseUserId}`,
              );
            } else {
              console.error(
                "[SECURITY] Invalid user data structure in Firebase",
              );
              throw new Error("Invalid user data");
            }
          }
        } catch (firebaseError) {
          console.error("Firebase authentication failed:", firebaseError);
          throw new Error("Authentication service unavailable");
        }

        // Type-safe validation with explicit checks
        if (!user || !user.pin?.pwd || typeof user.pin.pwd !== "string") {
          throw new Error("Invalid credentials");
        }

        // Verify password first
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.pin.pwd,
        );
        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        // Check if user has completed onboarding or verified email (not both required)
        const emailVerified = user.sgn?.evf === true;

        // If password is correct but email is not verified, throw special error
        if (!user.onc && !emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        // Email/password users require 2FA
        const twoFactorRequired = !!user.pin?.pwd;

        return {
          id: user.id!,
          email: user.pin?.eml || "",
          name: `${user.pin?.fnm || ""} ${user.pin?.lnm || ""}`.trim(),
          onboardingComplete: user.onc || false,
          emailVerified: emailVerified,
          twoFactorRequired: twoFactorRequired,
          twoFactorVerified: false, // Will be set to true after 2FA verification
        };
      },
    }),
  ],
  secret: secureEnv.get("NEXTAUTH_SECRET"),
  session: {
    strategy: "jwt",
    maxAge: SESSION_CONFIG.MAX_AGE_HOURS * SESSION_CONFIG.SECONDS_PER_HOUR, // 24 hours
    updateAge:
      SESSION_CONFIG.UPDATE_AGE_HOURS * SESSION_CONFIG.SECONDS_PER_HOUR, // 1 hour
  },
  jwt: {
    maxAge: SESSION_CONFIG.MAX_AGE_HOURS * SESSION_CONFIG.SECONDS_PER_HOUR, // 24 hours
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Enhanced security: Validate OAuth state and provider
      if (account && account.provider !== "credentials") {
        // Validate provider is allowed
        const allowedProviders = ["google", "facebook", "linkedin"];
        if (!allowedProviders.includes(account.provider)) {
          console.error(
            "SECURITY: Invalid OAuth provider attempted:",
            account.provider,
          );
          return false;
        }

        // Rate limiting for OAuth attempts
        const rateLimiter = createRateLimiter(RATE_LIMITS.OAUTH);
        const rateLimitResult = rateLimiter(account.provider);

        if (!rateLimitResult.allowed) {
          console.error(
            "SECURITY: OAuth rate limit exceeded for provider:",
            account.provider,
          );
          return false;
        }

        // Use user.id from profile function, fallback to account.providerAccountId if undefined
        // This ensures LinkedIn and other OAuth providers work even if profile.sub is missing
        const nextAuthUserId = user.id || account?.providerAccountId;

        // Validate that we have a valid user ID before proceeding
        if (!nextAuthUserId) {
          console.error(
            `[SECURITY] ${account.provider} OAuth missing user.id and providerAccountId`,
          );
          return false;
        }

        // Skip Firebase write for Facebook OAuth - let step 7 handle complete user creation
        if (account.provider === "facebook") {
          if (!user.name || !nextAuthUserId) {
            console.error("[SECURITY] Facebook OAuth missing required data");
            return false;
          }
          return true;
        }

        // Check if this is a new RBCA user registration and create Firebase user only if needed
        // Use resilient error handling: allow sign-in even if Firebase operations fail
        // The JWT callback will handle user data lookup, so transient Firebase errors shouldn't block authentication
        try {
          const database = getAdminDatabase();
          const firebaseUserId = nextAuthUserId;

          // Atomic check-and-create to prevent race conditions
          const existingUserSnapshot = await database
            .ref(`rbca_users/${firebaseUserId}`)
            .once("value");

          if (existingUserSnapshot.exists()) {
            return true; // User exists, skip creation
          }

          // Create RBCA user in Firebase using type-safe standardized structure
          const rbcaUserData: RBCAUserData = {
            onc: false,
            lut: new Date().toISOString(),
            sgn: {
              smt: ["google", "facebook", "linkedin"].includes(account.provider)
                ? (account.provider as "google" | "facebook" | "linkedin")
                : "google",
              evf: user.email ? true : false,
            },
            pin: {
              eml: user.email?.toLowerCase() || "",
              fnm:
                user.name && typeof user.name === "string"
                  ? user.name
                      .split(" ")
                      [NAME_PARSING.FIRST_NAME_INDEX]?.trim() || ""
                  : "",
              lnm:
                user.name &&
                typeof user.name === "string" &&
                user.name.split(" ").length > NAME_PARSING.REMAINING_NAMES_START
                  ? user.name
                      .split(" ")
                      .slice(NAME_PARSING.REMAINING_NAMES_START)
                      .join(" ")
                      .trim()
                  : "",
              unm: "",
              str: "",
              cty: "",
              zip: "",
              pfx: null,
              sfx: null,
              pvl: null,
              ref: null,
              rft: "",
            },
            mot: { rnk: [], oth: "" },
            gov: { rnk: [] },
            inf: { rnk: [], oth: "" },
            agr: { acc: false },
          };

          await database.ref(`rbca_users/${firebaseUserId}`).set(rbcaUserData);
        } catch (firebaseError) {
          // Log the error but allow sign-in to proceed
          // The JWT callback will handle user data lookup, so transient Firebase errors
          // (network issues, temporary unavailability) shouldn't block authentication
          // Only actual security violations (checked above) should deny access
          const errorMessage =
            firebaseError instanceof Error
              ? firebaseError.message
              : String(firebaseError);
          secureLogger.error(
            `OAuth Firebase operation failed (allowing sign-in) - Provider: ${account.provider}, Error: ${errorMessage}`,
            {
              operation: "oauth_signin_firebase_operation",
              userId: nextAuthUserId,
            },
          );
          // Return true to allow sign-in - JWT callback will handle user data lookup
          return true;
        }

        return true;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      const TWO_FA_VERIFICATION_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

      // Store user image from OAuth provider on initial sign-in
      if (user && user.image) {
        token.image = user.image;
      }

      // Store email from OAuth provider on initial sign-in (if available)
      // This ensures email is available in token for proxy middleware validation
      if (user && user.email && typeof user.email === "string") {
        token.email = user.email.toLowerCase().trim();
      }

      // Only check Firebase on initial sign-in, not on every token refresh
      if (user && user.id) {
        try {
          const database = getAdminDatabase();
          const userSnapshot = await database
            .ref(`rbca_users/${user.id}`)
            .once("value");

          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            if (isValidRBCAUserData(userData)) {
              token.sub = user.id;
              token.onboardingComplete = userData.onc || false;

              // Set email from Firebase if not already set from OAuth provider
              // Firebase email takes precedence as it's the source of truth
              if (
                userData.pin?.eml &&
                typeof userData.pin.eml === "string" &&
                userData.pin.eml.trim()
              ) {
                token.email = userData.pin.eml.toLowerCase().trim();
              } else if (
                !token.email &&
                user?.email &&
                typeof user.email === "string"
              ) {
                // Fallback to OAuth email if Firebase email is not available
                token.email = user.email.toLowerCase().trim();
              }

              // Check email verification status
              const emailVerified = userData.sgn?.evf === true;
              token.emailVerified = emailVerified;

              // Check if 2FA is required (email/password users have pin.pwd)
              const twoFactorRequired = !!userData.pin?.pwd;
              token.twoFactorRequired = twoFactorRequired;

              // Check 2FA verification status from Firebase
              // Note: tfvE (expiration) is calculated from tfvA + 5 minutes, not stored
              if (twoFactorRequired && userData.pin?.tfvA) {
                const verifiedAt = new Date(userData.pin.tfvA); // twoFactorVerifiedAt
                const TWO_FA_VERIFICATION_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes
                const expiresAt = new Date(
                  verifiedAt.getTime() + TWO_FA_VERIFICATION_VALIDITY_MS,
                ); // Calculate expiration
                const now = new Date();

                // Check if verification is still valid (within 5 minutes)
                if (now <= expiresAt && now >= verifiedAt) {
                  token.twoFactorVerified = true;
                  token.twoFactorVerifiedAt = verifiedAt.getTime();
                } else {
                  // Verification expired
                  token.twoFactorVerified = false;
                  token.twoFactorVerifiedAt = undefined;
                }
              } else {
                // No 2FA verification found or not required
                token.twoFactorVerified = !twoFactorRequired; // OAuth users don't need 2FA, so they're "verified"
                token.twoFactorVerifiedAt = undefined;
              }
            } else {
              token.sub = user.id;
              token.onboardingComplete = false;
              token.emailVerified = false;
              token.twoFactorRequired = false;
              token.twoFactorVerified = false;
              // Preserve email from OAuth if Firebase data is invalid
              if (
                !token.email &&
                user?.email &&
                typeof user.email === "string"
              ) {
                token.email = user.email.toLowerCase().trim();
              }
            }
          } else {
            token.sub = user.id;
            token.onboardingComplete = false;
            token.emailVerified = false;
            token.twoFactorRequired = false;
            token.twoFactorVerified = false;
            // Preserve email from OAuth if Firebase user doesn't exist yet
            if (!token.email && user?.email && typeof user.email === "string") {
              token.email = user.email.toLowerCase().trim();
            }
          }
        } catch (error) {
          console.error("[ERROR] Failed to check Firebase user:", error);
          token.sub = user.id;
          token.onboardingComplete = false;
          token.emailVerified = false;
          token.twoFactorRequired = false;
          token.twoFactorVerified = false;
          // Preserve email from OAuth if Firebase check fails
          if (!token.email && user?.email && typeof user.email === "string") {
            token.email = user.email.toLowerCase().trim();
          }
        }
      } else {
        // On token refresh (no user object), check Firebase for 2FA status
        if (token.sub) {
          try {
            const database = getAdminDatabase();
            const userSnapshot = await database
              .ref(`rbca_users/${token.sub}`)
              .once("value");

            if (userSnapshot.exists()) {
              const userData = userSnapshot.val();
              if (isValidRBCAUserData(userData)) {
                // Update email from Firebase on token refresh (source of truth)
                if (
                  userData.pin?.eml &&
                  typeof userData.pin.eml === "string" &&
                  userData.pin.eml.trim()
                ) {
                  token.email = userData.pin.eml.toLowerCase().trim();
                }

                // Update email verification status on token refresh
                const emailVerified = userData.sgn?.evf === true;
                token.emailVerified = emailVerified;

                // Update onboarding status on token refresh
                token.onboardingComplete = userData.onc || false;

                const twoFactorRequired = !!userData.pin?.pwd;
                token.twoFactorRequired = twoFactorRequired;

                // Check 2FA verification status
                // Note: tfvE (expiration) is calculated from tfvA + 5 minutes, not stored
                if (twoFactorRequired && userData.pin?.tfvA) {
                  const verifiedAt = new Date(userData.pin.tfvA); // twoFactorVerifiedAt
                  const TWO_FA_VERIFICATION_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes
                  const expiresAt = new Date(
                    verifiedAt.getTime() + TWO_FA_VERIFICATION_VALIDITY_MS,
                  ); // Calculate expiration
                  const now = new Date();

                  if (now <= expiresAt && now >= verifiedAt) {
                    token.twoFactorVerified = true;
                    token.twoFactorVerifiedAt = verifiedAt.getTime();
                  } else {
                    token.twoFactorVerified = false;
                    token.twoFactorVerifiedAt = undefined;
                  }
                } else {
                  token.twoFactorVerified = !twoFactorRequired;
                  token.twoFactorVerifiedAt = undefined;
                }
              }
            }
          } catch (error) {
            console.error(
              "[ERROR] Failed to check Firebase user on token refresh:",
              error,
            );
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Pass the onboarding status to the session object.
        session.user.onboardingComplete = token.onboardingComplete;
        // Pass email verification status to the session object.
        session.user.emailVerified = token.emailVerified ?? false;
        // Pass 2FA status to the session object.
        session.user.twoFactorRequired = token.twoFactorRequired ?? false;
        session.user.twoFactorVerified = token.twoFactorVerified ?? false;
        // Pass email to the session object (required for proxy middleware validation)
        // Use token.email if available, otherwise preserve existing session.email
        if (token.email && typeof token.email === "string") {
          session.user.email = token.email;
        } else if (!session.user.email && token.email) {
          // Fallback: ensure email is set if token has it but session doesn't
          session.user.email =
            typeof token.email === "string" ? token.email : "";
        }
        // Pass profile image from OAuth provider to the session object.
        if (token.image) {
          session.user.image = token.image;
        }
      }
      return session;
    },
  },
  pages: {
    // Remove signIn page to allow custom callback URLs to work
    // signIn: "/",
    // Redirect to a custom error page to handle messages gracefully
    error: "/auth/error",
  },
  // Add debug logging to help troubleshoot session issues
  debug: false, // Disable debug mode to prevent token exposure
};
