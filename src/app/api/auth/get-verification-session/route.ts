// /app/api/auth/get-verification-session/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getActiveVerificationSession } from "@/lib/firebaseEmailVerification";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
} from "@/lib/emailVerificationConfig";

// Validation schema for checking verification session
const getSessionSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = getSessionSchema.safeParse(body);
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

    const { email } = validationResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Get active verification session
    const activeSession = await getActiveVerificationSession(normalizedEmail);

    if (!activeSession) {
      return NextResponse.json({
        hasActiveSession: false,
        message: "No active verification session found."
      });
    }

    // Calculate time remaining
    const now = new Date();
    const expiresAt = new Date(activeSession.expiresAt);
    
    // Validate date is valid
    if (isNaN(expiresAt.getTime())) {
      console.error("Invalid expiration date in session:", activeSession.expiresAt);
      return NextResponse.json(
        { message: "Invalid session data." },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
    
    const timeRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));

    return NextResponse.json({
      hasActiveSession: true,
      sessionId: activeSession.sessionId,
      attempts: activeSession.attempts,
      timeRemaining,
      expiresAt: expiresAt.toISOString(),
      message: `Active verification session found. ${timeRemaining} seconds remaining.`
    });

  } catch (error: unknown) {
    // Log error without exposing sensitive information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("GET_VERIFICATION_SESSION_ERROR", {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

