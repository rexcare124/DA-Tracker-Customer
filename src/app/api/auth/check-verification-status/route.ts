import { NextResponse } from "next/server";
import { z } from "zod";
import { getActiveVerificationSession } from "@/lib/emailVerificationSession";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
} from "@/lib/emailVerificationConfig";

// Validation schema for checking verification status
const checkStatusSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = checkStatusSchema.safeParse(body);
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

    // Check if there's an active verification session
    const activeSession = await getActiveVerificationSession(email);

    if (!activeSession) {
      return NextResponse.json({
        hasActiveSession: false,
        message: "No active verification session found."
      });
    }

    // Calculate time remaining
    const now = new Date();
    const timeRemaining = Math.max(0, Math.ceil((activeSession.expiresAt.getTime() - now.getTime()) / 1000));

    return NextResponse.json({
      hasActiveSession: true,
      sessionId: activeSession.sessionId,
      attempts: activeSession.attempts,
      timeRemaining,
      expiresAt: activeSession.expiresAt,
      message: `Active verification session found. ${timeRemaining} seconds remaining.`
    });

  } catch (error: any) {
    console.error("CHECK_VERIFICATION_STATUS_ERROR", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
} 