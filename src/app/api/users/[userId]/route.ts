// src/app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";
import { FormData } from "@/components/betaclient/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createRateLimiter, RATE_LIMITS } from "@/lib/rateLimit";
import { getClientIdentifier } from "@/lib/getClientIP";
import { userUpdateSchema, sanitizeObject } from "@/lib/validationSchemas";
import { StaticOptionsService } from "@/lib/staticOptionsService";
import { getAdminDatabase } from "@/lib/firebase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const database = getAdminDatabase();
    const { userId } = await params;
    
    // Get the current session to verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate userId parameter
    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Find the user by their database ID in Firebase
    const userSnapshot = await database.ref(`rbca_users/${userId}`).once('value');
    const userData = userSnapshot.val();
    
    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Extract only the fields we want to return (matching Prisma select)
    const user = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      stateOfResidence: userData.stateOfResidence,
      cityOfResidence: userData.cityOfResidence,
      zipCode: userData.zipCode,
      howDidYouHearAboutUs: userData.howDidYouHearAboutUs,
      onboardingComplete: userData.onboardingComplete || false,
      emailVerified: userData.emailVerified || false,
      createdAt: userData.createdAt,
      updatedAt: userData.lastUpdated,
    };


    // Return the user data
    return NextResponse.json(user);
  } catch (error) {
    // Log error without exposing sensitive data
    console.error("USER_GET_ERROR: Database operation failed");
    return NextResponse.json(
      { message: "An internal server error occurred while fetching user data." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Rate limiting
    const rateLimiter = createRateLimiter(RATE_LIMITS.API);
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimiter(clientId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          message: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.API.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }
    
    const database = getAdminDatabase();
    const { userId } = await params;
    
    // Validate userId parameter
    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const rawBody = await request.json();
    
    // Sanitize input data
    const sanitizedBody = sanitizeObject(rawBody);
    
    // Validate input data
    const validationResult = userUpdateSchema.safeParse(sanitizedBody);
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
    
    const body = validationResult.data;

    // Extract personalInfo and other data, excluding isRegistrationComplete
    const { personalInfo, isRegistrationComplete, signInMethod, ...otherData } = body;

    // Exclude fields that are not part of the User model or shouldn't be updated here
    const {
      confirmEmail,
      confirmPassword,
      password, // Don't update password via this route
      ...restOfPersonalInfo
    } = personalInfo || {};

    // Find the user in Firebase to ensure they exist and get current values for comparison
    const existingUserSnapshot = await database.ref(`rbca_users/${userId}`).once('value');
    const existingUser = existingUserSnapshot.val();

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Helper function to check if arrays are different
    const arraysAreDifferent = (arr1: any[], arr2: any[]) => {
      if (!arr1 && !arr2) return false;
      if (!arr1 || !arr2) return true;
      if (arr1.length !== arr2.length) return true;
      return arr1.some((item, index) => item !== arr2[index]);
    };

    // Build selective update data - only include fields that have changed
    const updateData: any = {};

    // Personal info fields - only update if changed
    if (restOfPersonalInfo.prefix !== existingUser.prefix) {
      updateData.prefix = restOfPersonalInfo.prefix;
    }
    if (restOfPersonalInfo.firstName !== existingUser.firstName) {
      updateData.firstName = restOfPersonalInfo.firstName;
    }
    if (restOfPersonalInfo.lastName !== existingUser.lastName) {
      updateData.lastName = restOfPersonalInfo.lastName;
    }
    if (restOfPersonalInfo.suffix !== existingUser.suffix) {
      updateData.suffix = restOfPersonalInfo.suffix;
    }
    if (restOfPersonalInfo.username && restOfPersonalInfo.username.toLowerCase() !== existingUser.username) {
      updateData.username = restOfPersonalInfo.username.toLowerCase();
    }
    if (restOfPersonalInfo.defaultPrivacyLevel !== existingUser.defaultPrivacyLevel) {
      updateData.defaultPrivacyLevel = restOfPersonalInfo.defaultPrivacyLevel;
    }
    if (restOfPersonalInfo.stateOfResidence !== existingUser.stateOfResidence) {
      updateData.stateOfResidence = restOfPersonalInfo.stateOfResidence;
    }
    if (restOfPersonalInfo.cityOfResidence !== existingUser.cityOfResidence) {
      updateData.cityOfResidence = restOfPersonalInfo.cityOfResidence;
    }
    if (restOfPersonalInfo.zipCode !== existingUser.zipCode) {
      updateData.zipCode = restOfPersonalInfo.zipCode;
    }
    if (restOfPersonalInfo.howDidYouHearAboutUs !== existingUser.howDidYouHearAboutUs) {
      updateData.howDidYouHearAboutUs = restOfPersonalInfo.howDidYouHearAboutUs;
    }
    if (restOfPersonalInfo.forumUrl !== existingUser.forumUrl) {
      updateData.forumUrl = restOfPersonalInfo.forumUrl;
    }
    if (restOfPersonalInfo.youtubeUrl !== existingUser.youtubeUrl) {
      updateData.youtubeUrl = restOfPersonalInfo.youtubeUrl;
    }
    if (restOfPersonalInfo.referredByUsername !== existingUser.referredByUsername) {
      updateData.referredByUsername = restOfPersonalInfo.referredByUsername;
    }
    if (restOfPersonalInfo.flyerPromoCode !== existingUser.flyerPromoCode) {
      updateData.flyerPromoCode = restOfPersonalInfo.flyerPromoCode;
    }
    if (restOfPersonalInfo.otherHeardAboutText !== existingUser.otherHeardAboutText) {
      updateData.otherHeardAboutText = restOfPersonalInfo.otherHeardAboutText;
    }
    if (!existingUser.agreementAccepted) {
      updateData.agreementAccepted = true;
    }

    // Custom text fields - only update if changed
    if (otherData.otherInterestText !== existingUser.otherInterestText) {
      updateData.otherInterestText = otherData.otherInterestText;
    }
    if (otherData.otherInformationSourceText !== existingUser.otherInformationSourceText) {
      updateData.otherInformationSourceText = otherData.otherInformationSourceText;
    }
    if (otherData.agreementAccepted !== existingUser.agreementAccepted) {
      updateData.agreementAccepted = otherData.agreementAccepted;
    }

    // Set onboarding as complete if not already
    if (!existingUser.onboardingComplete) {
      updateData.onboardingComplete = true;
    }

    // Update sign-in method if provided and different
    if (signInMethod && signInMethod !== existingUser.signInMethod) {
      updateData.signInMethod = signInMethod;
    }

    // Handle selection arrays - convert strings to IDs and update optimized arrays only
    if (otherData.dataInterests) {
      const currentDataInterests = await StaticOptionsService.idsToStrings('data_interests', existingUser.dataInterestIds || []);
      if (arraysAreDifferent(otherData.dataInterests, currentDataInterests)) {
        updateData.dataInterestIds = await StaticOptionsService.stringsToIds('data_interests', otherData.dataInterests);
      }
    }
    
    if (otherData.rankedMotivations) {
      const currentRankedMotivations = await StaticOptionsService.idsToStrings('motivations', existingUser.rankedMotivationIds || []);
      if (arraysAreDifferent(otherData.rankedMotivations, currentRankedMotivations)) {
        updateData.rankedMotivationIds = await StaticOptionsService.stringsToIds('motivations', otherData.rankedMotivations);
      }
    }
    
    if (otherData.rankedGovernments) {
      const currentRankedGovernments = await StaticOptionsService.idsToStrings('governments', existingUser.rankedGovernmentIds || []);
      if (arraysAreDifferent(otherData.rankedGovernments, currentRankedGovernments)) {
        updateData.rankedGovernmentIds = await StaticOptionsService.stringsToIds('governments', otherData.rankedGovernments);
      }
    }
    
    if (otherData.rankedInformationSources) {
      const currentRankedInformationSources = await StaticOptionsService.idsToStrings('information_sources', existingUser.rankedInformationSourceIds || []);
      if (arraysAreDifferent(otherData.rankedInformationSources, currentRankedInformationSources)) {
        updateData.rankedInformationSourceIds = await StaticOptionsService.stringsToIds('information_sources', otherData.rankedInformationSources);
      }
    }

    // Performance logging
    const fieldsToUpdate = Object.keys(updateData).length;
    const startTime = Date.now();
    
    // Only perform update if there are changes
    let updatedUser;
    if (fieldsToUpdate > 0) {
      // Add lastUpdated timestamp to update data
      updateData.lastUpdated = new Date().toISOString();
      
      // Update user in Firebase
      await database.ref(`rbca_users/${userId}`).update(updateData);
      
      // Get updated user data
      const updatedSnapshot = await database.ref(`rbca_users/${userId}`).once('value');
      updatedUser = updatedSnapshot.val();
    } else {
      // Return existing user data if no changes
      updatedUser = existingUser;
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    // Return the updated user data without the password field
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    // Log error without exposing sensitive data
    console.error("USER_UPDATE_ERROR: Database operation failed");
    
    // Handle Firebase-specific errors
    if (error.message?.includes('permission') || error.message?.includes('auth')) {
      return NextResponse.json(
        { message: "Database access denied. Please check your authentication." },
        { status: 403 }
      );
    }
    
    if (error.message?.includes('not found') || error.code === 'NOT_FOUND') {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      { message: "An internal server error occurred while updating user data." },
      { status: 500 }
    );
  }
}
