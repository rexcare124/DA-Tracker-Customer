// /app/api/auth/verify-2fa-code/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAdminDatabase } from "@/lib/firebase/admin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // Verify user is authenticated (has valid session from email/password sign-in)
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { message: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }
    const { email, code } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    // Validate email format
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }

    // SECURITY: Normalize code to uppercase for consistency
    const normalizedCode = code.trim().toUpperCase();
    
    // Validate code format (must be exactly 6 alphanumeric characters)
    // Exclude "0" (zero), "O" (letter O), "1" (one), and "I" (letter I) to prevent confusion
    if (!normalizedCode || normalizedCode.length !== 6 || !/^[A-HJ-NP-Z2-9]{6}$/.test(normalizedCode)) {
      return NextResponse.json(
        { message: "A valid 6-character alphanumeric code is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify email matches session user
    if (session.user.email?.toLowerCase() !== normalizedEmail) {
      return NextResponse.json(
        { message: "Email does not match authenticated user." },
        { status: 403 }
      );
    }

    // Get user data from Firebase
    const database = getAdminDatabase();
    const userRef = database.ref(`rbca_users/${session.user.id}`);
    const userSnapshot = await userRef.once('value');

    if (!userSnapshot.exists()) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const userData = userSnapshot.val();

    // Check if user has 2FA code stored
    if (!userData.pin?.twoFactorCode || !userData.pin?.twoFactorCodeExpires) {
      return NextResponse.json(
        { message: "No verification code found. Please request a new code." },
        { status: 400 }
      );
    }

    // Check if code has expired
    const expiresAt = new Date(userData.pin.twoFactorCodeExpires);
    if (new Date() > expiresAt) {
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Verify the code (use normalized code for comparison)
    const isValid = await bcrypt.compare(normalizedCode, userData.pin.twoFactorCode);
    
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid verification code." },
        { status: 400 }
      );
    }

    // Code is valid - store verification timestamp in Firebase
    // Note: tfvE (expiration) is not stored - it's calculated from tfvA + 5 minutes when needed
    const verifiedAt = new Date().toISOString();

    await userRef.child('pin').update({
      tfvA: verifiedAt, // twoFactorVerifiedAt
      // Clear the code after successful verification
      twoFactorCode: null,
      twoFactorCodeExpires: null,
    });

    return NextResponse.json({
      message: "Verification successful.",
      verifiedAt,
    });
  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("VERIFY_2FA_CODE_ERROR", {
      message: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      { message: "Error verifying code." },
      { status: 500 }
    );
  }
}

