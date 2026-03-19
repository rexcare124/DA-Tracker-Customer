// /app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createRateLimiter, RATE_LIMITS } from "@/lib/rateLimit";
import { getClientIdentifier } from "@/lib/getClientIP";
import { otpVerificationSchema, sanitizeObject } from "@/lib/validationSchemas";
import { getAdminDatabase } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimiter = createRateLimiter(RATE_LIMITS.AUTH);
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimiter(clientId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          message: "Too many verification attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.AUTH.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }
    
    const rawBody = await request.json();
    
    // Sanitize input data
    const sanitizedBody = sanitizeObject(rawBody);
    
    // Validate input data
    const validationResult = otpVerificationSchema.safeParse(sanitizedBody);
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
        { status: 400 }
      );
    }
    
    const { email, otp } = validationResult.data;

    // Try Firebase first (for email/password registrations)
    let user = null;
    let isFirebaseUser = false;
    
    try {
      const database = getAdminDatabase();
      
      // First try querying by the new structure (pin/eml)
      let emailQuery = await database.ref('rbca_users')
        .orderByChild('pin/eml')
        .equalTo(email.toLowerCase())
        .once('value');
      
      // If not found, try the old structure (email)
      if (!emailQuery.exists()) {
        emailQuery = await database.ref('rbca_users')
          .orderByChild('email')
          .equalTo(email.toLowerCase())
          .once('value');
      }
      
      if (emailQuery.exists()) {
        const userKey = Object.keys(emailQuery.val())[0];
        const userData = Object.values(emailQuery.val())[0] as any;
        
        // Handle both old flat structure and new abbreviated structure
        let userId, otp, otpExpires, email;
        
        if (userData.pin) {
          // New abbreviated structure - OTP fields are in pin object
          userId = userKey; // Use Firebase key as ID
          otp = userData.pin.otp; // OTP is in pin.otp
          otpExpires = userData.pin.otpE; // OTP expiration is in pin.otpE
          email = userData.pin?.eml;
        } else {
          // Old flat structure (backward compatibility)
          userId = userData.id || userKey;
          otp = userData.otp;
          otpExpires = userData.otpExpires;
          email = userData.email;
        }
        
        user = {
          id: userId,
          otp: otp,
          otpExpires: otpExpires ? new Date(otpExpires) : null
        };
        isFirebaseUser = true;
        console.log(`🔍 [DEBUG] Found user in Firebase: ${userId}`);
      }
    } catch (firebaseError) {
      console.warn('Firebase lookup failed, trying Prisma:', firebaseError);
    }
    
    // Fallback to Prisma if not found in Firebase
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          otp: true,
          otpExpires: true
        },
      });
      console.log(`🔍 [DEBUG] Found user in Prisma: ${user?.id || 'not found'}`);
    }

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (!user.otp || !user.otpExpires) {
      return NextResponse.json({ message: "OTP not requested for this user." }, { status: 400 });
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json({ message: "OTP has expired." }, { status: 400 });
    }

    const isOtpCorrect = await bcrypt.compare(otp, user.otp);

    if (!isOtpCorrect) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    // OTP is correct, update the appropriate database
    const startTime = Date.now();
    
    if (isFirebaseUser) {
      // Update Firebase user - handle both old and new structures
      const database = getAdminDatabase();
      const userRef = database.ref(`rbca_users/${user.id}`);
      
      // Check if this is the new abbreviated structure
      const userSnapshot = await userRef.once('value');
      const userData = userSnapshot.val();
      
      if (userData && userData.pin) {
        // New abbreviated structure - update accordingly
        await userRef.update({
          'sgn/evf': true, // emailVerified in new structure
          onc: true, // onboardingComplete in new structure
          'pin/otp': null, // Clear OTP in pin object
          'pin/otpE': null, // Clear OTP expiration in pin object
          lut: new Date().toISOString() // lastUpdated in new structure
        });
      } else {
        // Old flat structure - update accordingly
        await userRef.update({
          emailVerified: new Date().toISOString(),
          onboardingComplete: true,
          otp: null,
          otpExpires: null,
          lastUpdated: new Date().toISOString()
        });
      }
      console.log(`🔍 [DEBUG] Updated Firebase user: ${user.id}`);
    } else {
      // Update Prisma user
      const updateData: any = {
        emailVerified: new Date(),
        onboardingComplete: true,
        otp: null,
        otpExpires: null,
      };
      
      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
      console.log(`🔍 [DEBUG] Updated Prisma user: ${user.id}`);
    }
    
    const queryTime = Date.now() - startTime;
    console.log(`🔍 [PERF] OTP verification update: ${queryTime}ms, database: ${isFirebaseUser ? 'Firebase' : 'Prisma'}`);

    return NextResponse.json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("VERIFY_OTP_ERROR", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
