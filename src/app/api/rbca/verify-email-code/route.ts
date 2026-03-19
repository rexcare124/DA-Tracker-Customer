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
  hasExceededMaxAttempts
} from "@/lib/emailVerificationSession";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  VERIFICATION_CODE_CONFIG,
  VERIFICATION_TYPES,
} from "@/lib/emailVerificationConfig";
import { getAdminDatabase } from '@/lib/firebase/admin';

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

    // Enhanced rate limiting for verification attempts
    const rateLimiter = createRateLimiter(RATE_LIMITS.EMAIL_VERIFICATION_ATTEMPTS);
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimiter(clientId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          message: ERROR_MESSAGES.RATE_LIMIT.EMAIL_VERIFICATION_ATTEMPTS,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: HTTP_STATUS.TOO_MANY_REQUESTS,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.EMAIL_VERIFICATION_ATTEMPTS.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
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

    // Get the current session to find the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required. Please sign in again." },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Find the current user in Firebase
    const userRef = firebaseDatabase.ref(`rbca_users/${session.user.id}`);
    const userSnapshot = await userRef.once('value');
    const currentUser = userSnapshot.val();

    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Check if the user already has an email (shouldn't happen in this flow, but safety check)
    if (currentUser.email && currentUser.email !== email.toLowerCase()) {
      return NextResponse.json(
        { message: "User already has a different email address." },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Find the active email verification session
    const emailVerification = await getActiveVerificationSession(email);

    if (!emailVerification) {
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

    // Verify the code
    const isCodeCorrect = await bcrypt.compare(code, emailVerification.code);

    if (!isCodeCorrect) {
      // Increment attempt count
      await incrementVerificationAttempts(emailVerification.sessionId!);
      
      return NextResponse.json(
        { message: "Invalid verification code." },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Check if the email is already in use by another RBCA user
    const allUsersRef = firebaseDatabase.ref('rbca_users');
    const allUsersSnapshot = await allUsersRef.once('value');
    const allUsers = allUsersSnapshot.val() || {};
    
    const existingUserWithEmail = Object.entries(allUsers).find(([userId, userData]: [string, any]) => 
      userData.email === email.toLowerCase() && userId !== session.user.id
    );

    if (existingUserWithEmail) {
      return NextResponse.json(
        { message: "This email address is already registered by another user." },
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Update user in Firebase with verified email using standardized nested structure
    const updateData = {
      ...currentUser,
      lut: new Date().toISOString(), // lastUpdated
      sgn: {
        ...currentUser.sgn,
        evf: true // emailVerified
      },
      pin: {
        ...currentUser.pin,
        eml: email.toLowerCase() // email
      }
    };

    await userRef.set(updateData);

    // Deactivate the verification session
    await deactivateVerificationSession(emailVerification.sessionId!);

    console.log(' [DEBUG] RBCA user email verified in Firebase:', session.user.id);

    return NextResponse.json({
      message: "Email verified successfully.",
      email: email.toLowerCase(),
    });

  } catch (error: any) {
    console.error("RBCA_VERIFY_EMAIL_CODE_ERROR", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
