// /app/api/auth/verify-email-code/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createRateLimiter, RATE_LIMITS } from "@/lib/rateLimit";
import { getClientIdentifier } from "@/lib/getClientIP";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
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

// Validation schema for email code verification
const emailCodeVerificationSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  code: z.string().length(VERIFICATION_CODE_CONFIG.CODE_LENGTH, ERROR_MESSAGES.VALIDATION.INVALID_CODE_LENGTH),
});

export async function POST(request: Request) {
  try {
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

    // Find the current user
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Check if the user already has an email (shouldn't happen in this flow, but safety check)
    if (currentUser.email) {
      return NextResponse.json(
        { message: "User already has an email address." },
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

    // Check if the email is already in use by another user
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== currentUser.id) {
      return NextResponse.json(
        { message: "This email address is already registered by another user." },
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Build selective update data - only include fields that have changed
    const updateData: any = {};
    
    if (email.toLowerCase() !== currentUser.email) {
      updateData.email = email.toLowerCase();
    }
    // Always update emailVerified when verifying
    updateData.emailVerified = new Date();

    // Performance logging and selective update
    const startTime = Date.now();
    await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
    });
    const queryTime = Date.now() - startTime;
    console.log(`🔍 [PERF] Email verification update: ${queryTime}ms, fields: ${Object.keys(updateData).length}`);

    // Deactivate the verification session
    await deactivateVerificationSession(emailVerification.sessionId!);

    // Clean up any other expired verification records for this email
    await prisma.emailVerification.deleteMany({
      where: {
        email: email.toLowerCase(),
        type: VERIFICATION_TYPES.SOCIAL_EMAIL_VERIFICATION,
        expiresAt: {
          lte: new Date()
        }
      }
    });

    return NextResponse.json({
      message: "Email verified successfully.",
      email: email.toLowerCase(),
    });

  } catch (error: any) {
    console.error("VERIFY_EMAIL_CODE_ERROR", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
} 