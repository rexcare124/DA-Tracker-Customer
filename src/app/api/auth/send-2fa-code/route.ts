// /app/api/auth/send-2fa-code/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import sgMail from "@sendgrid/mail";
import { getAdminDatabase } from "@/lib/firebase/admin";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const TWO_FA_CODE_EXPIRY_MINUTES = 5;

// Email validation regex (RFC 5322 compliant, simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generate a 6-character alphanumeric code (A-Z, 0-9, uppercase)
// Exclude "0" (zero), "O" (letter O), "1" (one), and "I" (letter I) to prevent confusion
function generate2FACode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate email format
function isValidEmail(email: string): boolean {
  if (typeof email !== "string" || email.length > 254) {
    return false;
  }
  return EMAIL_REGEX.test(email);
}

export async function POST(request: Request) {
  try {
    // Verify user is authenticated (must have signed in first)
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized. Please sign in first.", {
        status: 401,
      });
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const sendgridSenderEmail = process.env.SENDGRID_SENDER_EMAIL;

    if (!sendgridApiKey || !sendgridSenderEmail) {
      console.error(
        "Missing required environment variables for SendGrid (SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL)"
      );
      return new NextResponse("Server is not configured for sending emails.", {
        status: 500,
      });
    }

    sgMail.setApiKey(sendgridApiKey);

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return new NextResponse("Email is required.", { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new NextResponse("Invalid email format.", { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify email matches session user
    if (session.user.email?.toLowerCase() !== normalizedEmail) {
      return new NextResponse("Email does not match authenticated user.", {
        status: 403,
      });
    }

    // Find user in Firebase (use session user ID for security)
    const database = getAdminDatabase();
    const userRef = database.ref(`rbca_users/${session.user.id}`);
    const userSnapshot = await userRef.once('value');
    
    if (!userSnapshot.exists()) {
      return new NextResponse("User not found.", { status: 404 });
    }
    
    const userData = userSnapshot.val();
    
    // Verify email matches user's registered email
    if (userData.pin?.eml?.toLowerCase() !== normalizedEmail) {
      return new NextResponse("Email does not match user account.", {
        status: 403,
      });
    }

    // Only send 2FA for email/password users (those with pin.pwd)
    if (!userData.pin?.pwd) {
      // User is OAuth, no 2FA needed - but they shouldn't reach this endpoint
      return new NextResponse("Two-factor authentication is not required for your account type.", {
        status: 400,
      });
    }

    // Generate 6-character alphanumeric code
    const code = generate2FACode();
    // SECURITY: Normalize code to uppercase before hashing for consistency
    const normalizedCode = code.toUpperCase();
    const hashedCode = await bcrypt.hash(normalizedCode, 10);
    const expiresAt = new Date(Date.now() + TWO_FA_CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();

    // Store hashed code and expiry in Firebase
    await userRef.child('pin').update({
      twoFactorCode: hashedCode,
      twoFactorCodeExpires: expiresAt,
    });

    // Send email
    const msg = {
      to: normalizedEmail,
      from: sendgridSenderEmail,
      subject: "Your Two-Factor Authentication Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Two-Factor Authentication</h2>
          <p>Your 6-character verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 8px; margin: 0;">${code}</h1>
          </div>
          <p>This code will expire in ${TWO_FA_CODE_EXPIRY_MINUTES} minutes.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({
      message: "Verification code sent successfully.",
    });
  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorResponse = (error as { response?: { body?: unknown } })?.response?.body;
    
    console.error("SEND_2FA_CODE_ERROR", {
      message: errorMessage,
      stack: errorStack,
      response: errorResponse,
    });

    return new NextResponse("Error sending verification code.", {
      status: 500,
    });
  }
}

