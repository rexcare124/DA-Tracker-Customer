// /app/api/auth/send-email-verification/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { getAdminDatabase } from "@/lib/firebase/admin";
import bcrypt from "bcryptjs";
import { createRateLimiter, RATE_LIMITS } from "@/lib/rateLimit";
import { getClientIdentifier } from "@/lib/getClientIP";
import { z } from "zod";
import {
  createVerificationSession,
  hasActiveVerificationSession,
  getActiveVerificationSession,
  cleanupAllCompletedSessions,
  storeVerificationCode,
  incrementResendCount,
} from "@/lib/firebaseEmailVerification";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  VERIFICATION_CODE_CONFIG,
  EMAIL_TEMPLATE_CONFIG,
  VERIFICATION_TYPES,
} from "@/lib/emailVerificationConfig";
import { isValidRBCAUserData, type RBCAUserData } from "@/types/rbca-user";

// Validation schema for email verification request
const emailVerificationSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
});

/**
 * Type-safe helper to determine the appropriate email verification message
 * based on the user's sign-in method.
 *
 * Security considerations:
 * - Validates sign-in method against allowed values to prevent injection
 * - Uses type guards to ensure type safety
 * - Returns safe, pre-defined messages (no user input in messages)
 *
 * @param signInMethod - The user's sign-in method from Firebase (sgn.smt)
 * @returns The appropriate verification message based on authentication method
 */
function getEmailVerificationMessage(signInMethod: unknown): string {
  // Type-safe validation: only allow valid sign-in methods
  const validSignInMethods = ["email", "google", "facebook", "linkedin"] as const;
  type ValidSignInMethod = (typeof validSignInMethods)[number];

  // Type guard to ensure signInMethod is a valid string
  if (typeof signInMethod !== "string") {
    // Default to email/password message if sign-in method is invalid/unknown
    return "Please verify your email address to complete your registration.";
  }

  // Type guard to ensure signInMethod is one of the allowed values
  const normalizedMethod = signInMethod.toLowerCase().trim() as ValidSignInMethod;
  if (!validSignInMethods.includes(normalizedMethod)) {
    // Default to email/password message if sign-in method is not recognized
    return "Please verify your email address to complete your registration.";
  }

  // Return appropriate message based on sign-in method
  if (normalizedMethod === "email") {
    return "Please verify your email address to complete your registration.";
  }

  // For OAuth providers (google, facebook, linkedin), use social media message
  // Map provider names to user-friendly display names
  // Type-safe: normalizedMethod is guaranteed to be one of the valid methods at this point
  const providerDisplayNames: Record<Exclude<ValidSignInMethod, "email">, string> = {
    google: "Google",
    facebook: "Facebook",
    linkedin: "LinkedIn",
  };

  // Type assertion is safe here because we've already validated normalizedMethod
  // against validSignInMethods array, and we know it's not 'email' at this point
  const oauthMethod = normalizedMethod as Exclude<ValidSignInMethod, "email">;
  const providerName = providerDisplayNames[oauthMethod];

  // SECURITY: providerName is from a controlled mapping, not user input
  // This prevents injection attacks
  return `You successfully authenticated with ${providerName}, but we need to verify your email address to complete your registration.`;
}

export async function POST(request: Request) {
  try {
    // Clean up expired and inactive sessions first
    await cleanupAllCompletedSessions();

    // SendGrid configuration
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const sendgridSenderEmail = process.env.SENDGRID_SENDER_EMAIL;

    if (!sendgridApiKey || !sendgridSenderEmail) {
      console.error("Missing required environment variables for SendGrid (SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL)");
      return new NextResponse("Server is not configured for sending emails.", {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      });
    }

    // Set the API key for the SendGrid mail client
    sgMail.setApiKey(sendgridApiKey);

    const body = await request.json();

    // Validate input data
    const validationResult = emailVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          message: "Validation failed",
          errors,
        },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    const { email } = validationResult.data;

    // Normalize email to lowercase for consistency and security
    const normalizedEmail = email.toLowerCase().trim();

    // Additional security: Validate email format after normalization
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ message: "Invalid email format." }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    // Check if email is already in use by another RBCA user in Firebase
    const database = getAdminDatabase();
    const allUsersRef = database.ref("rbca_users");
    const allUsersSnapshot = await allUsersRef.once("value");
    const allUsers = allUsersSnapshot.val() || {};

    const existingUserWithEmail = Object.entries(allUsers).find(([userId, userData]: [string, unknown]) => {
      if (isValidRBCAUserData(userData)) {
        return userData.pin?.eml === normalizedEmail;
      }
      return false;
    });

    // Extract sign-in method from existing user data (if available) for email template personalization
    // This allows us to show the correct message based on authentication method (email/password vs OAuth)
    let userSignInMethod: unknown = undefined;

    // If user exists, check if email is already verified and extract sign-in method
    if (existingUserWithEmail) {
      const [, userData] = existingUserWithEmail;
      if (!isValidRBCAUserData(userData)) {
        // Invalid user data structure - skip this user
        return NextResponse.json(
          { message: "Invalid user data structure." },
          { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
        );
      }
      const emailVerified = userData.sgn?.evf === true;

      // Extract sign-in method for email template (type-safe: sgn.smt is validated by isValidRBCAUserData)
      userSignInMethod = userData.sgn?.smt;

      // If email is already verified, return conflict
      if (emailVerified) {
        return NextResponse.json(
          { message: "This email address is already registered and verified." },
          { status: HTTP_STATUS.CONFLICT },
        );
      }
      // If email exists but is not verified, allow sending verification code (for sign-in flow)
      // This allows users who failed verification during sign-up to retry during sign-in
    }

    // SMART RESEND LOGIC: Check for existing session and determine if resend should be allowed
    // CRITICAL: Don't send a new code if the previous one is still valid (>= 60 seconds remaining)
    // Allow resend if:
    // 1. User has made at least 1 failed attempt (they may not have received the code)
    // 2. Session has < 60 seconds remaining (code is about to expire)
    // 3. Session is expired (always allow)
    // Block resend if:
    // - Session has >= 60 seconds remaining AND no failed attempts

    // DEBUG: Log request to send verification code
    const requestTimestamp = new Date().toISOString();
    const clientId = getClientIdentifier(request);
    console.log(`🔍 [DEBUG] SEND_EMAIL_VERIFICATION_REQUEST`, {
      timestamp: requestTimestamp,
      email: normalizedEmail,
      clientId,
    });

    const existingSession = await getActiveVerificationSession(normalizedEmail);
    let shouldAllowResend = false;
    let sessionTimeRemaining = 0;
    let resendReason = "";

    if (existingSession) {
      // Session exists - check conditions for allowing resend
      const now = new Date();
      const expiresAt = new Date(existingSession.expiresAt);
      sessionTimeRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));
      const failedAttempts = existingSession.attempts || 0;
      const resendCount = existingSession.resendCount || 0;
      const MAX_RESENDS = 2;

      // DEBUG: Log existing session state
      console.log(`🔍 [DEBUG] EXISTING_SESSION_FOUND`, {
        timestamp: requestTimestamp,
        email: normalizedEmail,
        sessionId: existingSession.sessionId,
        timeRemaining: sessionTimeRemaining,
        failedAttempts,
        resendCount,
        expiresAt: expiresAt.toISOString(),
        createdAt: existingSession.createdAt,
      });

      // Check if session is expired
      if (sessionTimeRemaining <= 0) {
        shouldAllowResend = true;
        resendReason = "expired";
      }
      // Check if user has made failed attempts (indicates they may not have received code)
      else if (failedAttempts > 0) {
        shouldAllowResend = true;
        resendReason = "failed_attempts";
      }
      // Check if session has < 60 seconds remaining (code is about to expire)
      else if (sessionTimeRemaining < 60) {
        shouldAllowResend = true;
        resendReason = "expiring_soon";
      }
      // Otherwise, block resend - code is still valid with >= 60 seconds remaining
      else {
        shouldAllowResend = false;
        resendReason = "active_session";
      }

      // DEBUG: Log decision
      console.log(`🔍 [DEBUG] RESEND_DECISION`, {
        timestamp: requestTimestamp,
        email: normalizedEmail,
        sessionId: existingSession.sessionId,
        shouldAllowResend,
        resendReason,
        timeRemaining: sessionTimeRemaining,
        failedAttempts,
        resendCount,
      });

      // If resend is not allowed, return error with helpful message
      if (!shouldAllowResend) {
        const errorMessage = `A verification code was recently sent. Please check your inbox and spam folder. You can request a new code if you've made a failed attempt or if less than 60 seconds remain.`;

        // DEBUG: Log blocked resend
        console.log(`🚫 [DEBUG] RESEND_BLOCKED`, {
          timestamp: requestTimestamp,
          email: normalizedEmail,
          sessionId: existingSession.sessionId,
          reason: resendReason,
          timeRemaining: sessionTimeRemaining,
          failedAttempts,
          resendCount,
        });

        return NextResponse.json(
          {
            message: errorMessage,
            code: "ACTIVE_SESSION_EXISTS",
            timeRemaining: sessionTimeRemaining,
            expiresAt: expiresAt.toISOString(),
            attempts: failedAttempts,
            resendCount: resendCount,
          },
          { status: HTTP_STATUS.CONFLICT },
        );
      }

      // Resend is allowed - increment resend count if this is a resend (not initial send)
      if (resendReason !== "expired") {
        await incrementResendCount(existingSession.sessionId);
      }
    } else {
      // No active session exists - user needs a new code
      shouldAllowResend = true;
      resendReason = "no_session";

      // DEBUG: Log no session found
      console.log(`🔍 [DEBUG] NO_EXISTING_SESSION`, {
        timestamp: requestTimestamp,
        email: normalizedEmail,
        reason: resendReason,
      });
    }

    // Apply rate limiting AFTER session check
    // Be lenient if resend is allowed for legitimate reasons - user legitimately needs a new code
    // clientId already declared above for debugging
    const rateLimiter = createRateLimiter(RATE_LIMITS.EMAIL_VERIFICATION);
    const rateLimitResult = rateLimiter(clientId);

    // Only enforce strict rate limit if:
    // 1. Rate limit is exceeded AND
    // 2. Resend is not allowed (prevent abuse)
    // If resend is allowed for legitimate reasons, allow the request
    if (!rateLimitResult.allowed && !shouldAllowResend) {
      // Rate limit exceeded AND resend is not allowed - prevent abuse
      return NextResponse.json(
        {
          message: ERROR_MESSAGES.RATE_LIMIT.EMAIL_VERIFICATION,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: HTTP_STATUS.TOO_MANY_REQUESTS,
          headers: {
            "X-RateLimit-Limit": RATE_LIMITS.EMAIL_VERIFICATION.maxRequests.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        },
      );
    }
    // If rate limit is exceeded but resend is allowed for legitimate reasons, allow the request
    // This ensures users with expired codes, failed attempts, or expiring codes can get a new code

    // Generate a 6-digit alphanumeric code
    const generateCode = () => {
      const chars = VERIFICATION_CODE_CONFIG.CODE_CHARS;
      let result = "";
      for (let i = 0; i < VERIFICATION_CODE_CONFIG.CODE_LENGTH; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const verificationCode = generateCode();
    // SECURITY: Ensure code is uppercase before hashing for consistency
    // This ensures the stored hash matches what users will enter (normalized to uppercase)
    const normalizedVerificationCode = verificationCode.toUpperCase();
    const hashedCode = await bcrypt.hash(normalizedVerificationCode, VERIFICATION_CODE_CONFIG.BCRYPT_ROUNDS);

    // Create a new verification session (use normalized email)
    // CRITICAL: createVerificationSession calculates and stores expiresAt in Firebase
    console.log(`🔍 [DEBUG] CREATING_NEW_SESSION`, {
      timestamp: requestTimestamp,
      email: normalizedEmail,
      reason: resendReason,
    });

    const sessionId = await createVerificationSession(normalizedEmail);

    // Store the verification code in Firebase shared object
    await storeVerificationCode(sessionId, hashedCode);

    // DEBUG: Log code sent
    console.log(`✅ [DEBUG] VERIFICATION_CODE_SENT`, {
      timestamp: requestTimestamp,
      email: normalizedEmail,
      sessionId,
      reason: resendReason,
      codeLength: verificationCode.length,
    });

    // CRITICAL FIX: Fetch the session from Firebase to get the actual expiresAt that was stored
    // This ensures the frontend and backend use the exact same expiration timestamp
    // The expiresAt in Firebase is the authoritative source of truth
    const firebaseDatabase = getAdminDatabase();
    if (!firebaseDatabase) {
      return NextResponse.json(
        { message: "Database not available. Please try again." },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
      );
    }
    const sessionRef = firebaseDatabase.ref(`email_verifications/sessions/${sessionId}`);
    const sessionSnapshot = await sessionRef.once("value");
    const createdSession = sessionSnapshot.val();

    if (!createdSession || !createdSession.expiresAt) {
      console.error("[ERROR] Failed to retrieve created session from Firebase");
      return NextResponse.json(
        { message: "Failed to create verification session. Please try again." },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
      );
    }

    // Use the expiresAt from Firebase (the authoritative source)
    const expiresAt = new Date(createdSession.expiresAt);

    // Validate the expiration date
    if (isNaN(expiresAt.getTime())) {
      console.error("[ERROR] Invalid expiration date in created session:", createdSession.expiresAt);
      return NextResponse.json(
        { message: "Invalid session data. Please try again." },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
      );
    }

    // Get the appropriate verification message based on user's sign-in method
    // SECURITY: Message is generated from validated sign-in method, not user input
    // This prevents XSS attacks as the message is pre-defined and safe
    const verificationMessage = getEmailVerificationMessage(userSignInMethod);

    // SECURITY: Escape HTML in the verification code to prevent XSS
    // Although normalizedVerificationCode is generated server-side and should be safe,
    // we escape it as a defense-in-depth measure
    const escapeHtml = (text: string): string => {
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return text.replace(/[&<>"']/g, (char) => map[char] || char);
    };

    const escapedVerificationCode = escapeHtml(normalizedVerificationCode);
    const escapedVerificationMessage = escapeHtml(verificationMessage);

    // Send the email using SendGrid (use normalized email)
    const msg = {
      to: normalizedEmail,
      from: sendgridSenderEmail,
      subject: EMAIL_TEMPLATE_CONFIG.SUBJECT,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Complete Your Registration</h2>
          <p>${escapedVerificationMessage}</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Verification Code</h3>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb; text-align: center; padding: 10px;">
              ${escapedVerificationCode}
            </div>
          </div>
          
          <p><strong>Important:</strong></p>
          <ul>
            <li>This code will expire in 5 minutes</li>
            <li>Enter this code in the verification window to continue</li>
            <li>If you didn't request this code, please ignore this email</li>
          </ul>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This email was sent as part of your registration process. 
            If you have any questions, please contact our support team.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);

    // Calculate time remaining from the actual expiresAt stored in Firebase
    const now = new Date();
    const timeRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));

    return NextResponse.json({
      message: "Verification code sent successfully.",
      expiresAt: expiresAt.toISOString(),
      timeRemaining,
    });
  } catch (error: unknown) {
    // Log error without exposing sensitive information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("SEND_EMAIL_VERIFICATION_ERROR", {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    });

    if (error instanceof SyntaxError && error.message.includes("Unexpected end of JSON input")) {
      console.error("Possible cause: The request body was empty.");
      return new NextResponse("Request body is empty or invalid.", {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    // Don't expose internal error details to client
    return new NextResponse("Error sending verification code. Please try again later.", {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
  }
}
