import { AuthOptions, DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getAdminDatabase } from "@/lib/firebase/admin";

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
    onboardingComplete?: boolean;
    emailVerified?: boolean;
    twoFactorRequired?: boolean;
    twoFactorVerified?: boolean;
    twoFactorVerifiedAt?: number; // Timestamp in milliseconds
  }
}

export const authOptions: AuthOptions = {
  // Remove PostgreSQL adapter - using Firebase only for RBCA users
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

        console.log(
          "🔍 [DEBUG] Attempting RBCA login for email:",
          credentials.email.toLowerCase(),
        );

        // Check Firebase for RBCA users only
        const firebaseDatabase = getAdminDatabase();
        if (!firebaseDatabase) {
          console.error("🔍 [ERROR] Firebase database not available for login");
          throw new Error("Authentication service unavailable");
        }

        try {
          // Query Firebase by email
          const emailQuery = await firebaseDatabase
            .ref("rbca_users")
            .orderByChild("email")
            .equalTo(credentials.email.toLowerCase())
            .once("value");

          const firebaseUsers = emailQuery.val();
          console.log(
            "🔍 [DEBUG] Firebase query result:",
            firebaseUsers ? Object.keys(firebaseUsers) : null,
          );

          if (!firebaseUsers) {
            console.log("🔍 [DEBUG] RBCA user not found in Firebase");
            throw new Error("Invalid credentials");
          }

          // Get the first (and should be only) user
          const firebaseUserId = Object.keys(firebaseUsers)[0];
          const firebaseUser = firebaseUsers[firebaseUserId];

          console.log(
            "🔍 [DEBUG] Found RBCA user in Firebase:",
            firebaseUserId,
          );
          console.log("🔍 [DEBUG] User data structure:", {
            hasEmail: !!firebaseUser.email,
            hasEmailVerified: !!firebaseUser.emailVerified,
            hasAgreementAccepted: !!firebaseUser.agreementAccepted,
            hasPwd: !!firebaseUser.pwd,
          });

          // Check if user has completed onboarding and email verification
          if (!firebaseUser.agreementAccepted || !firebaseUser.emailVerified) {
            throw new Error(
              "Please complete the onboarding and verify your email to sign in.",
            );
          }

          // Verify password (Firebase stores hashed password in pwd field)
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            firebaseUser.pwd || "",
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          // Return user object compatible with NextAuth
          return {
            id: firebaseUserId,
            email: firebaseUser.pin?.eml || credentials.email,
            name: `${firebaseUser.pin?.pfx || ""} ${firebaseUser.pin?.fnm || ""} ${firebaseUser.pin?.lnm || ""} ${firebaseUser.pin?.sfx || ""}`.trim(),
            username: firebaseUser.pin?.unm,
            onboardingComplete: firebaseUser.aac || false,
            emailVerified: firebaseUser.evf || false,
          };
        } catch (firebaseError) {
          console.error(
            "🔍 [ERROR] Firebase query failed during login:",
            firebaseError,
          );
          throw new Error("Authentication service error");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // --- FIX: The signIn callback is removed. We will allow all social sign-ins
    // and use middleware to enforce onboarding completion. ---
    // --- FIX: The jwt callback is updated to include the onboarding status ---
    async jwt({ token, user }) {
      // The `user` object is only available on the first sign-in.
      if (user) {
        token.sub = user.id;
        // The user object from the provider may not have our custom fields.
        // We fetch the user from our database to get the `onboardingComplete` status.

        // Check Firebase for RBCA users only
        const firebaseDatabase = getAdminDatabase();
        if (firebaseDatabase) {
          try {
            const firebaseUserSnapshot = await firebaseDatabase
              .ref(`rbca_users/${user.id}`)
              .once("value");
            const firebaseUser = firebaseUserSnapshot.val();
            token.onboardingComplete = firebaseUser?.agreementAccepted || false;
            // Check email verification status from Firebase
            token.emailVerified =
              firebaseUser?.evf === true ||
              firebaseUser?.emailVerified === true ||
              false;
          } catch (error) {
            console.error(
              "🔍 [ERROR] Failed to fetch Firebase user in JWT callback:",
              error,
            );
            token.onboardingComplete = false;
            token.emailVerified = false;
          }
        } else {
          token.onboardingComplete = false;
          token.emailVerified = false;
        }
      }
      return token;
    },
    // --- FIX: The session callback is updated to pass the onboarding status to the client ---
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Pass the onboarding status to the session object.
        session.user.onboardingComplete = token.onboardingComplete;
        // Pass the email verification status to the session object.
        session.user.emailVerified = token.emailVerified ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    // Redirect to a custom error page to handle messages gracefully
    error: "/auth/error",
  },
};
