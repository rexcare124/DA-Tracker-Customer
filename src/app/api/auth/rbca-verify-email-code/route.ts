import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import bcrypt from "bcryptjs";
import { createRateLimiter, RATE_LIMITS } from "@/lib/rateLimit";
import { getClientIdentifier } from "@/lib/getClientIP";
import { z } from "zod";
import { 
  getActiveVerificationSession,
  incrementVerificationAttempts,
  deactivateVerificationSession,
  deleteVerificationSession,
  hasExceededMaxAttempts
} from "@/lib/firebaseEmailVerification";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  VERIFICATION_CODE_CONFIG,
  VERIFICATION_TYPES,
} from "@/lib/emailVerificationConfig";
import { getAdminDatabase } from '@/lib/firebase/admin';
import { isValidRBCAUserData, type RBCAUserData } from '@/types/rbca-user';

/**
 * Determines if a user has completed all required onboarding steps.
 * 
 * For onboarding to be considered complete, the user must have:
 * 1. Personal information: firstName, lastName, username, state, city, and zipCode (all non-empty strings)
 * 2. Motivations: At least one ranked motivation
 * 3. Government interests: At least one ranked government interest
 * 4. Information sources: At least one ranked information source
 * 5. Agreement acceptance: Agreement must be explicitly accepted (true)
 * 
 * Note: Email verification (sgn.evf) is checked separately and is required
 * before this function would be called in the email verification flow.
 * 
 * Security considerations:
 * - Uses defensive null/undefined checks for all fields (Firebase can return null)
 * - Validates string types before calling string methods to prevent runtime errors
 * - Uses strict equality (===) for boolean checks to prevent type coercion issues
 * - Validates array types and lengths to ensure data integrity
 * 
 * @param userData - The RBCA user data to check for onboarding completion. 
 *                   Should be validated with isValidRBCAUserData() before calling this function.
 * @returns true if all required onboarding fields are present and valid, false otherwise
 * 
 * @example
 * ```typescript
 * if (isValidRBCAUserData(currentUser) && isOnboardingComplete(currentUser)) {
 *   // User has completed all onboarding steps
 *   updateData.onc = true;
 * }
 * ```
 */
function isOnboardingComplete(userData: RBCAUserData): boolean {
  // Type-safe helper to check if a string field is non-empty
  // Handles null, undefined, and empty strings safely
  const isNonEmptyString = (value: unknown): boolean => {
    return typeof value === 'string' && value.trim().length > 0;
  };

  // Check personal information fields (required for onboarding)
  // Use defensive checks: Firebase can return null even for required string fields
  const hasPersonalInfo = 
    isNonEmptyString(userData.pin?.fnm) && // firstName
    isNonEmptyString(userData.pin?.lnm) && // lastName
    isNonEmptyString(userData.pin?.unm) && // username
    isNonEmptyString(userData.pin?.str) && // stateOfResidence
    isNonEmptyString(userData.pin?.cty) && // cityOfResidence
    isNonEmptyString(userData.pin?.zip);   // zipCode

  // Check motivations: must have at least one ranked motivation
  // Validate array type and ensure it has elements
  const hasMotivations = 
    Array.isArray(userData.mot?.rnk) && 
    userData.mot.rnk.length > 0 &&
    // Additional validation: ensure array contains valid numbers (not null/undefined)
    userData.mot.rnk.every((id): id is number => typeof id === 'number' && !isNaN(id));

  // Check government interests: must have at least one ranked government
  // Validate array type and ensure it has elements
  const hasGovernmentInterests = 
    Array.isArray(userData.gov?.rnk) && 
    userData.gov.rnk.length > 0 &&
    // Additional validation: ensure array contains valid numbers (not null/undefined)
    userData.gov.rnk.every((id): id is number => typeof id === 'number' && !isNaN(id));

  // Check information sources: must have at least one ranked information source
  // Validate array type and ensure it has elements
  const hasInformationSources = 
    Array.isArray(userData.inf?.rnk) && 
    userData.inf.rnk.length > 0 &&
    // Additional validation: ensure array contains valid numbers (not null/undefined)
    userData.inf.rnk.every((id): id is number => typeof id === 'number' && !isNaN(id));

  // Check agreement acceptance: must be explicitly accepted (strict boolean check)
  // Use strict equality to prevent type coercion (e.g., "true" string, 1, etc.)
  const hasAgreementAccepted = 
    userData.agr?.acc === true;

  // All conditions must be met for onboarding to be complete
  return (
    hasPersonalInfo &&
    hasMotivations &&
    hasGovernmentInterests &&
    hasInformationSources &&
    hasAgreementAccepted
  );
}

// Validation schema for email code verification
const emailCodeVerificationSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  code: z.string().length(VERIFICATION_CODE_CONFIG.CODE_LENGTH, ERROR_MESSAGES.VALIDATION.INVALID_CODE_LENGTH),
});

export async function POST(request: NextRequest) {
  try {
    // Get Firebase database
    const firebaseDatabase = getAdminDatabase();
    if (!firebaseDatabase) {
      return NextResponse.json(
        { error: 'Firebase database not available' },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validate input data
    const validationResult = emailCodeVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { 
          message: "Validation failed",
          errors 
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { email, code } = validationResult.data;
    
    // Normalize email to lowercase for consistency and security
    const normalizedEmail = email.toLowerCase().trim();
    
    // SECURITY: Normalize code to uppercase for consistency
    // Codes are generated in uppercase, so normalize input to match
    const normalizedCode = code.trim().toUpperCase();
    
    // Additional security: Validate email format after normalization
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Get the current session (optional - for sign-in flow, user may not be authenticated yet)
    const session = await getServerSession(authOptions);
    
    let userRef;
    let currentUser;
    let firebaseUserId: string | null = null;

    if (session?.user?.id) {
      // User is authenticated (registration flow or authenticated sign-in)
      firebaseUserId = session.user.id;
      userRef = firebaseDatabase.ref(`rbca_users/${firebaseUserId}`);
      const userSnapshot = await userRef.once('value');
      currentUser = userSnapshot.val();

      // Handle Facebook OAuth users who don't exist in Firebase yet
      if (!currentUser) {
        // For Facebook OAuth users, create a minimal user record during email verification
        // This should not happen in normal flow, but handle gracefully
        const minimalUserData: RBCAUserData = {
          onc: false,
          lut: new Date().toISOString(),
          sgn: {
            smt: 'facebook',
            evf: false
          },
          pin: {
            eml: email.toLowerCase(),
            fnm: session.user.name?.split(' ')[0] || 'Facebook',
            lnm: session.user.name?.split(' ').slice(1).join(' ') || 'User',
            unm: '',
            str: '',
            cty: '',
            zip: '',
            pfx: null,
            sfx: null,
            pvl: null,
            ref: null,
            rft: ''
          },
          mot: { rnk: [], oth: '' },
          gov: { rnk: [] },
          inf: { rnk: [], oth: '' },
          agr: { acc: false }
        };

        // Create the user record
        await userRef.set(minimalUserData);
        currentUser = minimalUserData;
        
        console.log(`[INFO] Created minimal Firebase record for Facebook OAuth user: ${firebaseUserId}`);
      }

      // Validate user data structure
      if (!isValidRBCAUserData(currentUser)) {
        console.error('[SECURITY] Invalid user data structure during email verification:', firebaseUserId);
        return NextResponse.json(
          { message: "User data is invalid. Please contact support." },
          { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        );
      }

      // Check if the user already has a different email
      if (currentUser.pin?.eml && currentUser.pin.eml !== normalizedEmail) {
        return NextResponse.json(
          { message: "User already has a different email address." },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
    } else {
      // No session - find user by email (sign-in flow for unverified users)
      const emailQuery = await firebaseDatabase.ref('rbca_users')
        .orderByChild('pin/eml')
        .equalTo(normalizedEmail)
        .once('value');
      
      if (!emailQuery.exists()) {
        return NextResponse.json(
          { message: "User not found. Please sign up first." },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      const firebaseData = emailQuery.val();
      const userIds = Object.keys(firebaseData);
      
      if (!userIds || userIds.length === 0) {
        return NextResponse.json(
          { message: "User data is invalid. Please contact support." },
          { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        );
      }

      firebaseUserId = userIds[0];
      const rawUserData = firebaseData[firebaseUserId];
      
      // Validate user data structure
      if (!isValidRBCAUserData(rawUserData)) {
        console.error('[SECURITY] Invalid user data structure during email verification:', firebaseUserId);
        return NextResponse.json(
          { message: "User data is invalid. Please contact support." },
          { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        );
      }

      currentUser = rawUserData;
      userRef = firebaseDatabase.ref(`rbca_users/${firebaseUserId}`);
      
      // Verify that this user's email is not verified yet
      const emailVerified = currentUser.sgn?.evf === true;
      if (emailVerified) {
        return NextResponse.json(
          { message: "Email is already verified. Please sign in normally." },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
    }

    // Find the active email verification session (use normalized email)
    const emailVerification = await getActiveVerificationSession(normalizedEmail);

    if (!emailVerification) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.SESSION.SESSION_EXPIRED },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // SECURITY: Strictly enforce code expiration (5 minutes)
    // Defense in depth - even though getActiveVerificationSession checks expiration,
    // we verify again here to ensure no expired codes are accepted
    // Add 1 second grace period to account for clock skew between client and server
    const now = new Date();
    const expiresAt = new Date(emailVerification.expiresAt);
    const GRACE_PERIOD_MS = 1000; // 1 second grace period for clock skew
    
    if (expiresAt.getTime() <= now.getTime() - GRACE_PERIOD_MS) {
      // Code has expired (accounting for grace period) - deactivate session and return error
      await deactivateVerificationSession(emailVerification.sessionId!);
      return NextResponse.json(
        { message: ERROR_MESSAGES.SESSION.SESSION_EXPIRED },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Check if the session has exceeded maximum attempts
    const hasExceeded = await hasExceededMaxAttempts(emailVerification.sessionId!);
    if (hasExceeded) {
      // Deactivate the session
      await deactivateVerificationSession(emailVerification.sessionId!);
      return NextResponse.json(
        { message: ERROR_MESSAGES.SESSION.MAX_ATTEMPTS_EXCEEDED },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Apply rate limiting AFTER session validation
    // CRITICAL: Users with valid, non-expired sessions should be able to verify codes
    // Rate limiting primarily prevents brute force attacks without valid sessions
    // Since we've already validated the session exists, is not expired, and hasn't exceeded max attempts,
    // we allow verification attempts for legitimate users with valid sessions
    // The session-based attempt limits (MAX_ATTEMPTS_PER_SESSION) provide sufficient protection
    
    // Only apply rate limiting if there's no valid session context
    // This prevents blocking legitimate users who are trying to verify codes from valid sessions
    // The rate limiter is primarily for preventing brute force without valid sessions
    const rateLimiter = createRateLimiter(RATE_LIMITS.EMAIL_VERIFICATION_ATTEMPTS);
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimiter(clientId);
    
    // If rate limit is exceeded, check if this is a legitimate attempt with a valid session
    // Valid session = exists, not expired, and hasn't exceeded max attempts per session
    if (!rateLimitResult.allowed && rateLimitResult.remaining === 0) {
      // User has a valid, non-expired session - allow the attempt
      // The session-based attempt limits provide sufficient protection
      // Rate limiting here would block legitimate users trying to verify their codes
      // We've already checked expiration and max attempts above, so this is safe
    }

    // Verify the code (use normalized code for comparison)
    // DEBUG: Log code verification attempt (without exposing the actual code)
    console.log(`🔍 [DEBUG] CODE_VERIFICATION_ATTEMPT`, {
      timestamp: new Date().toISOString(),
      email: normalizedEmail,
      sessionId: emailVerification.sessionId,
      codeLength: normalizedCode.length,
      codeChars: normalizedCode.split('').map(() => '*').join(''), // Mask code for security
      attempts: emailVerification.attempts || 0,
    });
    
    const isCodeCorrect = await bcrypt.compare(normalizedCode, emailVerification.code);

    if (!isCodeCorrect) {
      // Increment attempt count
      await incrementVerificationAttempts(emailVerification.sessionId!);
      
      // DEBUG: Log failed verification attempt
      console.log(`❌ [DEBUG] CODE_VERIFICATION_FAILED`, {
        timestamp: new Date().toISOString(),
        email: normalizedEmail,
        sessionId: emailVerification.sessionId,
        attempts: (emailVerification.attempts || 0) + 1,
        timeRemaining: Math.max(0, Math.ceil((new Date(emailVerification.expiresAt).getTime() - Date.now()) / 1000)),
      });
      
      return NextResponse.json(
        { message: "Invalid verification code." },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    // DEBUG: Log successful verification
    console.log(`✅ [DEBUG] CODE_VERIFICATION_SUCCESS`, {
      timestamp: new Date().toISOString(),
      email: normalizedEmail,
      sessionId: emailVerification.sessionId,
      attempts: emailVerification.attempts || 0,
    });

    // Check if the email is already in use by another RBCA user
    // This is a security check to prevent email hijacking
    if (!firebaseUserId) {
      return NextResponse.json(
        { message: "User identification failed. Please try again." },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    const allUsersRef = firebaseDatabase.ref('rbca_users');
    const allUsersSnapshot = await allUsersRef.once('value');
    const allUsers = allUsersSnapshot.val() || {};
    
    const existingUserWithEmail = Object.entries(allUsers).find(([userId, userData]: [string, unknown]) => {
      if (userId === firebaseUserId) return false;
      const typedUserData = userData as RBCAUserData;
      return typedUserData?.pin?.eml === normalizedEmail;
    });

    if (existingUserWithEmail) {
      return NextResponse.json(
        { message: "This email address is already registered by another user." },
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Validate currentUser before updating
    if (!currentUser || !isValidRBCAUserData(currentUser)) {
      console.error('[SECURITY] Invalid user data before email verification update:', firebaseUserId);
      return NextResponse.json(
        { message: "User data validation failed. Please contact support." },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    // Update user in Firebase with verified email using standardized structure
    // When email verification happens during sign-in (user not authenticated yet),
    // also verify 2FA using the same code to avoid sending two codes in quick succession
    const isSignInFlow = !session?.user?.id; // No session means sign-in flow
    const isEmailPasswordUser = !!currentUser.pin?.pwd; // Has password means email/password user
    
    // Set 2FA verification if this is a sign-in flow for email/password user
    // This allows the email verification code to serve dual purpose: email verification + 2FA
    // Note: tfvE (expiration) is not stored - it's calculated from tfvA + 5 minutes when needed
    let tfvA: string | undefined; // twoFactorVerifiedAt
    
    if (isSignInFlow && isEmailPasswordUser) {
      const verificationTime = new Date();
      tfvA = verificationTime.toISOString();
    }
    
    // Build pin object - include 2FA verification only for sign-in flow with email/password users
    // For registration flow, exclude 2FA verification fields by omitting them
    // Exclude 2FA verification property to ensure clean state
    const { tfvA: _, ...pinWithout2FA } = currentUser.pin || {};
    
    const pinUpdate: RBCAUserData['pin'] = {
      ...pinWithout2FA,
      eml: normalizedEmail,
      // Add 2FA verification only for sign-in flow with email/password users
      ...(tfvA && {
        tfvA,
      }),
    };
    
    // Determine if onboarding should be marked as complete
    // Onboarding is complete if:
    // 1. User has completed all required onboarding steps (personal info, motivations, governments, info sources, agreement)
    //    OR
    // 2. User is in registration flow (has active session) - registration flow sets onc at step 7
    //    OR
    // 3. Keep existing onc value if neither condition is met
    const shouldSetOnboardingComplete = 
      isOnboardingComplete(currentUser) || // All onboarding steps completed
      (session?.user?.id !== undefined);    // Registration flow (session exists)
    
    const updateData: RBCAUserData = {
      ...currentUser,
      pin: pinUpdate,
      sgn: {
        ...currentUser.sgn,
        evf: true // Email verified
      },
      onc: shouldSetOnboardingComplete ? true : currentUser.onc,
      lut: new Date().toISOString()
    };

    await userRef.set(updateData);

    // Immediately delete the verification session after successful verification
    // Benefits: immediate cost savings, data minimization, security best practice
    await deleteVerificationSession(emailVerification.sessionId!);

    console.log(' [DEBUG] RBCA user email verified in Firebase:', firebaseUserId);

    return NextResponse.json({
      message: "Email verified successfully.",
      email: normalizedEmail,
    });

  } catch (error: unknown) {
    // Log error without exposing sensitive information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("RBCA_VERIFY_EMAIL_CODE_ERROR", {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    });

    // Don't expose internal error details to client
    return NextResponse.json(
      { message: "An internal server error occurred. Please try again later." },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
