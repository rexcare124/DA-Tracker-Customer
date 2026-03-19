import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminDatabase } from '@/lib/firebase/admin';
import { StaticOptionsService } from '@/lib/staticOptionsService';
import { z } from 'zod';
import { personalInfoSchema } from '@/lib/validationSchemas';

// Configuration Constants
const RATE_LIMIT_CONFIG = {
  WINDOW_MINUTES: 15,
  MAX_ATTEMPTS: 5,
  MILLISECONDS_PER_MINUTE: 60 * 1000
} as const;

const SECURITY_CONFIG = {
  BCRYPT_SALT_ROUNDS: 12,
  FIRST_ELEMENT_INDEX: 0
  // Note: OTP constants removed - email verification now uses /api/auth/send-email-verification
} as const;

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

function isActiveRbcaUserRecord(record: any): boolean {
  if (!record || typeof record !== "object") return false;
  // New abbreviated schema: active means onboarding complete
  if (record.pin) return record.onc === true;
  // Legacy schema fallback
  return record.onboardingComplete === true || Boolean(record.emailVerified);
}

// Rate limiting helper function
function checkRateLimit(clientId: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const RATE_LIMIT_WINDOW = RATE_LIMIT_CONFIG.WINDOW_MINUTES * RATE_LIMIT_CONFIG.MILLISECONDS_PER_MINUTE; // 15 minutes
  const RATE_LIMIT_MAX_ATTEMPTS = RATE_LIMIT_CONFIG.MAX_ATTEMPTS;
  
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const record = rateLimitMap.get(clientId);
  
  if (!record || now > record.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitMap.set(clientId, { count: 1, resetTime });
    return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS - 1, resetTime };
  }
  
  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  rateLimitMap.set(clientId, record);
  return { allowed: true, remaining: RATE_LIMIT_MAX_ATTEMPTS - record.count, resetTime: record.resetTime };
}

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export async function POST(request: NextRequest) {
  try {
    // Basic rate limiting
    const clientId = getClientId(request);
    const rateLimitResult = checkRateLimit(clientId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          message: "Too many registration attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: HTTP_STATUS.TOO_MANY_REQUESTS,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }
    
    const body = await request.json();
    
    // Server-side validation for sign-in method
    const signInMethod = body.signInMethod;
    const validSignInMethods = ['email', 'google', 'facebook', 'linkedin'];
    
    if (signInMethod && !validSignInMethods.includes(signInMethod)) {
      console.warn(`[SECURITY] Invalid signInMethod attempted: ${signInMethod} from IP: ${clientId}`);
      return NextResponse.json(
        { message: 'Invalid sign-in method' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    // Only email sign-ups should use this endpoint
    if (signInMethod && signInMethod !== 'email') {
      console.warn(`[SECURITY] Non-email signInMethod attempted on /api/users: ${signInMethod} from IP: ${clientId}`);
      return NextResponse.json(
        { message: 'This endpoint is only for email registrations' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    const { personalInfo } = body;
    const { email, username, password } = personalInfo;

    // 2. Check if user already exists in Firebase
    const database = getAdminDatabase();
    
    // Check for existing ACTIVE RBCA account by email (new schema first, then legacy fallback)
    const normalizedEmail = email.toLowerCase();

    let emailQuery = await database.ref('rbca_users')
      .orderByChild('pin/eml')
      .equalTo(normalizedEmail)
      .once('value');

    if (!emailQuery.exists()) {
      emailQuery = await database.ref('rbca_users')
        .orderByChild('email')
        .equalTo(normalizedEmail)
        .once('value');
    }

    if (emailQuery.exists()) {
      const matches = emailQuery.val() as Record<string, any>;
      const hasActive = Object.values(matches).some((record) => isActiveRbcaUserRecord(record));
      if (hasActive) {
        return NextResponse.json(
          { message: `The e-mail address "${normalizedEmail}" is associated with an existing account. You will now be redirected to the Sign-In page.` },
          { status: HTTP_STATUS.CONFLICT }
        );
      }
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_SALT_ROUNDS);

    // Note: OTP generation removed - email verification now uses email_verifications/sessions/
    // The new system sends verification codes via /api/auth/send-email-verification

    // 5. Convert string selections to IDs using the same static objects as OAuth route
    const STATIC_OPTION_IDS = Object.freeze({
      name_prefixes: Object.freeze({
        'Dr.': 1, 'Mr.': 2, 'Mrs.': 3, 'Ms.': 4, 'Prof.': 5, 'Rev.': 6, 'The Hon.': 7
      } as const),
      name_suffixes: Object.freeze({
        'Jr.': 8, 'Sr.': 9, 'II': 10, 'III': 11, 'IV': 12, 'V': 13, 'Esq.': 14
      } as const),
      privacy_levels: Object.freeze({
        'Anonymous': 14, 'Username Only': 15, 'Your First Name & Last Initial': 16, 'Your Full Name': 17
      } as const),
      referral_sources: Object.freeze({
        'Search engine': 18, 'Social media': 19, 'LinkedIn': 20, 'Blog or publication': 21,
        'Referred by friend/colleague': 22, 'Online community forum': 23, 'YouTube personality': 24,
        'Referred By Existing Member/Guest User': 25, 'Community flyer': 26, 'Other': 27
      } as const),
      data_interests: Object.freeze({
        'Improve well-being': 28, 'Find community to live': 29, 'Manage personal risks': 30,
        'Career advancement': 31, 'Elect government leaders': 32, 'Protect friends/family': 33,
        'Enhance school experience': 34, 'Grow my business': 35, 'Plan for travel': 36, 'Other': 37
      } as const),
      governments: Object.freeze({
        'Federal': 38, 'State': 39, 'State Government': 39, 'County': 40, 'County Government': 40,
        'City': 41, 'City Government': 41, 'Other': 42
      } as const),
      information_sources: Object.freeze({
        'Social Media': 43, 'Traditional News Websites and Apps': 44, 'Television': 45,
        'Search Engines': 46, 'Podcasts': 47, 'Print Publications (e.g., Newspapers and Magazines)': 48,
        'Personal Connections (Word of Mouth)': 49, 'Books and eBooks': 50,
        'Scholarly Peer-Reviewed Articles and Journals': 51,
        'Reference Sources (Dictionaries, Encyclopedias, and Handbooks)': 52,
        'AI Chatbots and Interfaces': 53, 'Other': 54
      } as const)
    } as const);

    function convertToIds(category: keyof typeof STATIC_OPTION_IDS, values: string[], customTextValues: string[] = []): number[] {
      if (!values || values.length === 0) return [];
      const mapping = STATIC_OPTION_IDS[category];
      if (!mapping) return [];
      
      return values
        .map(value => {
          const id = (mapping as Record<string, number>)[value];
          if (id === undefined && !customTextValues.includes(value)) {
            console.warn(`[USERS] Unknown value "${value}" in category "${category}"`);
          }
          return id;
        })
        .filter((id): id is number => id !== undefined);
    }

    // Extract custom text values from arrays
    const extractCustomText = (values: string[], validOptions: Record<string, number>) => {
      const customTexts: string[] = [];
      values?.forEach(value => {
        if (validOptions[value] === undefined) {
          customTexts.push(value);
        }
      });
      return customTexts.join(', ');
    };

    const motivationIds = convertToIds('data_interests', body.rankedMotivations, [body.otherInterestText]);
    const governmentIds = convertToIds('governments', body.rankedGovernments);
    const informationSourceIds = convertToIds('information_sources', body.rankedInformationSources, [body.otherInformationSourceText]);
    
    const extractedMotivationText = extractCustomText(body.rankedMotivations, STATIC_OPTION_IDS.data_interests);
    const extractedOtherInfoSourceText = extractCustomText(body.rankedInformationSources, STATIC_OPTION_IDS.information_sources);

    // Convert name fields to IDs (using correct frontend field names)
    // Use nullish coalescing to ensure undefined values become null (Firebase doesn't allow undefined)
    const namePrefixIds = personalInfo.prefix ? convertToIds('name_prefixes', [personalInfo.prefix]) : [];
    const namePrefixId = namePrefixIds.length > 0 ? namePrefixIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const nameSuffixIds = personalInfo.suffix ? convertToIds('name_suffixes', [personalInfo.suffix]) : [];
    const nameSuffixId = nameSuffixIds.length > 0 ? nameSuffixIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const privacyLevelIds = personalInfo.defaultPrivacyLevel ? convertToIds('privacy_levels', [personalInfo.defaultPrivacyLevel]) : [];
    const privacyLevelId = privacyLevelIds.length > 0 ? privacyLevelIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const referralSourceIds = personalInfo.howDidYouHearAboutUs ? convertToIds('referral_sources', [personalInfo.howDidYouHearAboutUs]) : [];
    const referralSourceId = referralSourceIds.length > 0 ? referralSourceIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;

    // 6. Create the new user in Firebase Realtime Database using SAME structure as OAuth
    const firebaseUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Atomically reserve username using Firebase transaction (prevents race conditions)
    // Validate and normalize username format before attempting reservation
    const trimmedUsername = username.trim();
    if (!trimmedUsername || trimmedUsername.length < 3 || trimmedUsername.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      return NextResponse.json(
        { message: "Invalid username format. Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens." },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    const usernameLower = trimmedUsername.toLowerCase();
    const usernameIndexRef = database.ref(`rbca_usernames/${usernameLower}`);
    
    // Type-safe username reservation data structure
    interface UsernameReservation {
      userId: string;
      reservedAt: string;
    }
    
    try {
      const transactionResult = await usernameIndexRef.transaction((currentData: UsernameReservation | null): UsernameReservation | undefined => {
        // If username is already reserved, abort transaction
        if (currentData !== null) {
          return undefined; // Abort - username already taken
        }
        // Reserve username atomically
        return {
          userId: firebaseUserId,
          reservedAt: new Date().toISOString()
        };
      });

      // Transaction was aborted (username already exists)
      if (!transactionResult.committed) {
        return NextResponse.json(
          { message: "This username is already taken." },
          { status: HTTP_STATUS.CONFLICT }
        );
      }
    } catch (transactionError) {
      console.error('[ERROR] Username reservation transaction failed:', transactionError);
      return NextResponse.json(
        { message: "Failed to reserve username. Please try again." },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
    
    // Clean structure matching OAuth API with email-specific fields in pin object
    const firebaseUserData = {
      // Core Identity & Metadata
      onc: false, // onboardingComplete (false until email verified)
      lut: new Date().toISOString(), // lastUpdated
      
      // Step 1: SignIn
      sgn: {
        smt: body.signInMethod || 'email', // signInMethod
        evf: false // emailVerified (false until verified)
      },
      
      // Step 2: PersonalInformation (includes email-specific auth fields)
      pin: {
        eml: personalInfo.email.toLowerCase(), // email
        fnm: personalInfo.firstName || '', // firstName
        lnm: personalInfo.lastName || '', // lastName
        unm: usernameLower || '', // username (normalized: trimmed and lowercased)
        str: personalInfo.stateOfResidence || '', // stateOfResidence
        cty: personalInfo.cityOfResidence || '', // cityOfResidence
        zip: personalInfo.zipCode || '', // zipCode
        pfx: namePrefixId, // namePrefix (numeric ID)
        sfx: nameSuffixId, // nameSuffix (numeric ID)
        pvl: privacyLevelId, // privacyLevel (numeric ID)
        ref: referralSourceId, // referralSource (numeric ID)
        rft: personalInfo.otherHeardAboutText || '', // referralText (custom text)
        // Email/password specific authentication fields
        pwd: hashedPassword // password (hashed)
        // Note: otp and otpE removed - email verification uses email_verifications/sessions/
      },
      
      // Data Interests & Motivations
      mot: {
        rnk: motivationIds,
        oth: body.otherInterestText || extractedMotivationText || ''
      },
      
      // Step 5: GovernmentInterests
      gov: {
        rnk: governmentIds // rankedGovernments (Array of numeric IDs)
      },
      
      // Step 6: InformationSources
      inf: {
        rnk: informationSourceIds, // rankedInformationSources (Array of numeric IDs)
        oth: body.otherInformationSourceText || extractedOtherInfoSourceText || ''
      },
      
      // Step 7: Agreement Acceptance
      agr: {
        acc: body.agreementAccepted !== undefined ? body.agreementAccepted : true // agreementAccepted
      }
    };

    // Registration Status Tracking (for incomplete registrations requiring payment)
    // All registrations require membership selection, so track payment status
    if (body.membershipSelection) {
      (firebaseUserData as typeof firebaseUserData & { reg: {
        sts: 'pending_payment' | 'completed';
        cat: string;
        lrs: 0 | 1 | 4 | 6 | null;
        pra: number;
        msl: {
          lvl: 'follower' | 'groupie' | 'insider' | 'bizleader' | 'dataseeker';
          bfr: 'monthly' | 'yearly';
        };
      } }).reg = {
        sts: 'pending_payment', // registrationStatus - incomplete until payment
        cat: new Date().toISOString(), // registrationCreatedAt
        lrs: null, // lastReminderSent - no reminders sent yet
        pra: 0, // paymentRetryAttempts - start at 0
        msl: {
          lvl: body.membershipSelection.level, // membershipSelection.level
          bfr: body.membershipSelection.billingFrequency, // membershipSelection.billingFrequency
        },
      };
      // Set onboardingComplete to false until payment is completed
      firebaseUserData.onc = false;
    }

    // Create/update user in Firebase
    try {
      const userRef = database.ref(`rbca_users/${firebaseUserId}`);
      await userRef.set(firebaseUserData);
      
      console.log(' [DEBUG] Email/password user created in Firebase:', firebaseUserId);
    } catch (userCreationError) {
      // Rollback: Release username reservation if user creation fails
      try {
        await usernameIndexRef.remove();
        console.warn(`[ROLLBACK] Released username reservation "${usernameLower}" due to user creation failure`);
      } catch (rollbackError) {
        console.error(`[ERROR] Failed to release username reservation "${usernameLower}" after user creation failure:`, rollbackError);
      }
      
      console.error('[ERROR] Failed to create user in Firebase:', userCreationError);
      return NextResponse.json(
        { message: "Failed to create user account. Please try again." },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    // Also store in Supabase via server (Person table) - fire-and-forget; don't fail registration if Supabase fails
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl) {
      const personPayload = {
        firebaseUserId,
        firstName: personalInfo.firstName || '',
        lastName: personalInfo.lastName || '',
        prefix: personalInfo.prefix ?? null,
        suffix: personalInfo.suffix ?? null,
        middleName: personalInfo.middleName ?? null,
        email: personalInfo.email.toLowerCase(),
        username: usernameLower,
        stateOfResidence: personalInfo.stateOfResidence ?? null,
        cityOfResidence: personalInfo.cityOfResidence ?? null,
        zipCode: personalInfo.zipCode ?? null,
        namePrefixId: namePrefixId ?? null,
        nameSuffixId: nameSuffixId ?? null,
        privacyLevelId: privacyLevelId ?? null,
        referralSourceId: referralSourceId ?? null,
        referralText: personalInfo.otherHeardAboutText ?? null,
        hashedPassword,
        signInMethod: body.signInMethod || 'email',
        emailVerified: false,
        onboardingComplete: false,
        motivationIds,
        otherInterestText: body.otherInterestText || extractedMotivationText || null,
        governmentIds,
        informationSourceIds,
        otherInformationSourceText: body.otherInformationSourceText || extractedOtherInfoSourceText || null,
        agreementAccepted: body.agreementAccepted !== undefined ? body.agreementAccepted : true,
        registrationData: body.membershipSelection ? { sts: 'pending_payment', cat: new Date().toISOString(), msl: body.membershipSelection } : null,
        lastUpdatedFirebase: firebaseUserData.lut,
      };
      fetch(`${backendUrl}/api/persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personPayload),
      }).catch((supabaseErr) => {
        console.warn('[WARN] Failed to store user in Supabase (Person table):', supabaseErr);
      });
    }

    // Create legacy response format for backward compatibility
    const legacyResponse = {
      id: firebaseUserId,
      createdAt: firebaseUserData.lut,
      lastUpdated: firebaseUserData.lut,
      prefix: personalInfo.prefix,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      suffix: personalInfo.suffix,
      email: personalInfo.email.toLowerCase(),
      username: usernameLower,
      defaultPrivacyLevel: personalInfo.defaultPrivacyLevel,
      stateOfResidence: personalInfo.stateOfResidence,
      cityOfResidence: personalInfo.cityOfResidence,
      zipCode: personalInfo.zipCode,
      howDidYouHearAboutUs: personalInfo.howDidYouHearAboutUs,
      forumUrl: personalInfo.forumUrl,
      youtubeUrl: personalInfo.youtubeUrl,
      referredByUsername: personalInfo.referredByUsername,
      flyerPromoCode: personalInfo.flyerPromoCode,
      otherHeardAboutText: personalInfo.otherHeardAboutText,
      dataInterestIds: motivationIds,
      rankedMotivationIds: motivationIds,
      rankedGovernmentIds: governmentIds,
      rankedInformationSourceIds: informationSourceIds,
      selectionVersion: 1,
      schemaVersion: 2,
      otherInterestText: body.otherInterestText,
      otherInformationSourceText: body.otherInformationSourceText,
      agreementAccepted: body.agreementAccepted,
      signInMethod: body.signInMethod || "email"
      // Note: otp and otpExpires removed - email verification now uses /api/auth/send-email-verification
    };

    // Return user data (OTP is no longer returned - use /api/auth/send-email-verification instead)
    return NextResponse.json(legacyResponse);
  } catch (error: any) {
    console.error("USER_REGISTRATION_ERROR", error);

    // FIX: Check for JSON parsing errors and return a specific, structured error message.
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request format. Please provide valid JSON." },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // FIX: Return all other errors as a JSON object
    return NextResponse.json(
      { message: "An internal server error occurred during registration." },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
