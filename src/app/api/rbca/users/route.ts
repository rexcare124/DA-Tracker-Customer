import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { getAdminDatabase } from '@/lib/firebase/admin';
import { type RBCAUserData } from '@/types/rbca-user';

// Configuration Constants
const SECURITY_CONFIG = {
  BCRYPT_SALT_ROUNDS: 12,
  FIRST_ELEMENT_INDEX: 0
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
  if (record.pin) return record.onc === true;
  return record.onboardingComplete === true || Boolean(record.emailVerified);
}

const RBCA_STEPS = {
  SIGN_IN: 1,
  PERSONAL_INFO: 2,
  DATA_INTERESTS: 3,
  RANK_MOTIVATIONS: 4,
  GOVERNMENT_INTERESTS: 5,
  INFORMATION_SOURCES: 6,
  AGREEMENT: 7
} as const;

// Static objects for instant ID conversion (no database calls)
// Data from Firebase static_option_registry with correct IDs
// Using frozen objects for optimal performance and 100% type safety
const STATIC_OPTION_IDS = Object.freeze({
  name_prefixes: Object.freeze({
    'Dr.': 1,
    'Mr.': 2,
    'Mrs.': 3,
    'Ms.': 4,
    'Prof.': 5,
    'Rev.': 6,
    'The Hon.': 7
  } as const),
  name_suffixes: Object.freeze({
    'Jr.': 8,
    'Sr.': 9,
    'II': 10,
    'III': 11,
    'IV': 12,
    'V': 13,
    'Esq.': 14
  } as const),
  privacy_levels: Object.freeze({
    'Anonymous': 14,
    'Username Only': 15,
    'Your First Name & Last Initial': 16,
    'Your Full Name': 17
  } as const),
  referral_sources: Object.freeze({
    'Search engine': 18,
    'Social media': 19,
    'LinkedIn': 20,
    'Blog or publication': 21,
    'Referred by friend/colleague': 22,
    'Online community forum': 23,
    'YouTube personality': 24,
    'Referred By Existing Member/Guest User': 25,
    'Community flyer': 26,
    'Other': 27
  } as const),
  data_interests: Object.freeze({
    'Improve well-being': 28,
    'Find community to live': 29,
    'Manage personal risks': 30,
    'Career advancement': 31,
    'Elect government leaders': 32,
    'Protect friends/family': 33,
    'Enhance school experience': 34,
    'Grow my business': 35,
    'Plan for travel': 36,
    'Other': 37
  } as const),
  governments: Object.freeze({
    'Federal': 38,
    'State': 39,
    'State Government': 39, // Alias for State
    'County': 40,
    'County Government': 40, // Alias for County
    'City': 41,
    'City Government': 41, // Alias for City
    'Other': 42
  } as const),
  information_sources: Object.freeze({
    'Social Media': 43,
    'Traditional News Websites and Apps': 44,
    'Television': 45,
    'Search Engines': 46,
    'Podcasts': 47,
    'Print Publications (e.g., Newspapers and Magazines)': 48,
    'Personal Connections (Word of Mouth)': 49,
    'Books and eBooks': 50,
    'Scholarly Peer-Reviewed Articles and Journals': 51,
    'Reference Sources (Dictionaries, Encyclopedias, and Handbooks)': 52,
    'AI Chatbots and Interfaces': 53,
    'Other': 54
  } as const)
} as const);

// Type-safe value types for each category
type NamePrefixValue = keyof typeof STATIC_OPTION_IDS.name_prefixes;
type NameSuffixValue = keyof typeof STATIC_OPTION_IDS.name_suffixes;
type PrivacyLevelValue = keyof typeof STATIC_OPTION_IDS.privacy_levels;
type ReferralSourceValue = keyof typeof STATIC_OPTION_IDS.referral_sources;
type DataInterestValue = keyof typeof STATIC_OPTION_IDS.data_interests;
type GovernmentValue = keyof typeof STATIC_OPTION_IDS.governments;
type InformationSourceValue = keyof typeof STATIC_OPTION_IDS.information_sources;

// Union type for all valid values by category
type ValidValuesByCategory = {
  name_prefixes: NamePrefixValue;
  name_suffixes: NameSuffixValue;
  privacy_levels: PrivacyLevelValue;
  referral_sources: ReferralSourceValue;
  data_interests: DataInterestValue;
  governments: GovernmentValue;
  information_sources: InformationSourceValue;
};

/**
 * Convert text values to IDs using static objects (type-safe with validation)
 * @param category - The option category (strictly typed)
 * @param values - Array of text values for the category
 * @returns Array of numeric IDs
 */
function convertToIds(category: keyof typeof STATIC_OPTION_IDS, values: string[], customTextValues: string[] = []): number[] {
  if (!values || values.length === 0) return [];
  
  const mapping = STATIC_OPTION_IDS[category];
  if (!mapping) {
    console.warn(`[RBCA] Unknown category: ${category}`);
    return [];
  }
  
  return values
    .map(value => {
      // Type-safe access with runtime validation
      const id = (mapping as Record<string, number>)[value];
      if (id === undefined) {
        // Skip warning if this is a custom text value (not a static option)
        if (!customTextValues.includes(value)) {
          console.warn(`[RBCA] Unknown value "${value}" in category "${category}"`);
        }
      }
      return id;
    })
    .filter((id): id is number => id !== undefined);
}

/**
 * Convert suffix ID to text value (minimal reverse lookup for form pre-filling)
 * @param suffixId - The suffix ID (e.g., 11)
 * @returns The suffix text value (e.g., "III") or null if not found
 */
function convertSuffixIdToText(suffixId: number | null | undefined): string | null {
  if (suffixId === null || suffixId === undefined) return null;
  
  const suffixMapping = STATIC_OPTION_IDS.name_suffixes;
  const entry = Object.entries(suffixMapping).find(([_, id]) => id === suffixId);
  return entry ? entry[0] : null;
}


// Use centralized Firebase Admin SDK

export async function GET(request: NextRequest) {
  try {
    // Get Firebase database instance
    const database = getAdminDatabase();

    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const firebaseUserId = session.user.id;

    // Get existing user data
    const userRef = database.ref(`rbca_users/${firebaseUserId}`);
    const snapshot = await userRef.once('value');
    const existingData = snapshot.val();

    if (!existingData) {
      return NextResponse.json(
        { error: 'RBCA user not found in Firebase' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Convert Firebase data to form-friendly format
    const userData = {
      personalInfo: {
        email: existingData.pin?.eml || '',
        firstName: existingData.pin?.fnm || '',
        lastName: existingData.pin?.lnm || '',
        suffix: convertSuffixIdToText(existingData.pin?.sfx) || '',
        prefix: existingData.pin?.pfx ? Object.entries(STATIC_OPTION_IDS.name_prefixes).find(([_, id]) => id === existingData.pin.pfx)?.[0] || '' : '',
        username: existingData.pin?.unm || '',
        stateOfResidence: existingData.pin?.str || '',
        cityOfResidence: existingData.pin?.cty || '',
        zipCode: existingData.pin?.zip || '',
        defaultPrivacyLevel: existingData.pin?.pvl ? Object.entries(STATIC_OPTION_IDS.privacy_levels).find(([_, id]) => id === existingData.pin.pvl)?.[0] || '' : '',
        howDidYouHearAboutUs: existingData.pin?.ref ? Object.entries(STATIC_OPTION_IDS.referral_sources).find(([_, id]) => id === existingData.pin.ref)?.[0] || '' : '',
        suffixDetectionAsked: existingData.pin?.sfxa ?? false, // suffixDetectionAsked flag
      },
      onboardingComplete: existingData.onc || false,
      signInMethod: existingData.sgn?.smt || null, // Return sign-in method to determine if OAuth user
    };

    return NextResponse.json(userData, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('[ERROR] Firebase RBCA user fetch failed:', error);
    return NextResponse.json(
      {
        error: 'Firebase user fetch failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get Firebase database instance
    const database = getAdminDatabase();

    const body = await request.json();
    
    // Server-side validation: Verify signInMethod and authentication requirements
    const signInMethod = body.signInMethod;
    const validSignInMethods = ['email', 'google', 'facebook', 'linkedin'];
    
    if (signInMethod && !validSignInMethods.includes(signInMethod)) {
      console.warn(`[SECURITY] Invalid signInMethod attempted: ${signInMethod}`);
      return NextResponse.json(
        { error: 'Invalid sign-in method' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    
    // OAuth users (google, facebook, linkedin) must be authenticated
    const isOAuthUser = signInMethod && signInMethod !== 'email';
    if (isOAuthUser && !session?.user?.id) {
      console.warn(`[SECURITY] Unauthenticated ${signInMethod} user attempted RBCA access`);
      return NextResponse.json(
        { error: 'OAuth users must be authenticated' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    
    // Email users without authentication are allowed (for registration flow)
    if (!session?.user?.id && (!signInMethod || signInMethod === 'email')) {
      console.log(`[DEBUG] Processing unauthenticated email registration request`);
    }
    // Process RBCA user creation request

    // Use session ID as Firebase user identifier or generate new one
    const firebaseUserId = body.sessionId || session?.user?.id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Enforce: prevent completing/creating RBCA flow with an email tied to an ACTIVE RBCA account
    const requestedEmailRaw = (body.personalInfo?.email || session?.user?.email || "").toString();
    const requestedEmail = requestedEmailRaw.trim().toLowerCase();

    if (requestedEmail) {
      // Query new schema first
      let emailQuery = await database.ref('rbca_users')
        .orderByChild('pin/eml')
        .equalTo(requestedEmail)
        .once('value');

      if (!emailQuery.exists()) {
        // Legacy fallback
        emailQuery = await database.ref('rbca_users')
          .orderByChild('email')
          .equalTo(requestedEmail)
          .once('value');
      }

      if (emailQuery.exists()) {
        const matches = emailQuery.val() as Record<string, any>;
        const hasConflict = Object.entries(matches).some(([userId, record]) => {
          if (userId === firebaseUserId) return false; // allow current user
          return isActiveRbcaUserRecord(record);
        });

        if (hasConflict) {
          return NextResponse.json(
            { message: `The e-mail address "${requestedEmail}" is associated with an existing account. You will now be redirected to the Sign-In page.` },
            { status: HTTP_STATUS.CONFLICT }
          );
        }
      }
    }
    
    // Extract custom text values from arrays and filter out non-static options
    const extractCustomText = (values: string[], validOptions: Record<string, number>) => {
      const customTexts: string[] = [];
      const staticOptions: string[] = [];
      
      values?.forEach(value => {
        if (validOptions[value] !== undefined) {
          staticOptions.push(value);
        } else {
          customTexts.push(value);
        }
      });
      
      return { customTexts, staticOptions };
    };

    // Data interests are now handled through motivations only - no separate processing needed

    // Process motivations (uses same mapping as data interests) - extract custom text from array
    const motivationExtraction = extractCustomText(body.rankedMotivations || [], STATIC_OPTION_IDS.data_interests);
    const motivationIds = convertToIds('data_interests', motivationExtraction.staticOptions);
    const extractedMotivationText = motivationExtraction.customTexts.join(', ') || body.otherInterestText || '';

    // Process governments
    const governmentIds = convertToIds('governments', body.rankedGovernments || []);

    // Process information sources - extract custom text from array AND dedicated field
    const infoSourceExtraction = extractCustomText(body.rankedInformationSources || [], STATIC_OPTION_IDS.information_sources);
    const informationSourceIds = convertToIds('information_sources', infoSourceExtraction.staticOptions);
    const extractedOtherInfoSourceText = infoSourceExtraction.customTexts.join(', ') || body.otherInformationSourceText || '';
    
    // Convert personal information static options (using frontend field names)
    // Use nullish coalescing to ensure undefined values become null (Firebase doesn't allow undefined)
    const namePrefixIds = body.personalInfo?.prefix ? convertToIds('name_prefixes', [body.personalInfo.prefix]) : [];
    const namePrefixId = namePrefixIds.length > 0 ? namePrefixIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const nameSuffixIds = body.personalInfo?.suffix ? convertToIds('name_suffixes', [body.personalInfo.suffix]) : [];
    const nameSuffixId = nameSuffixIds.length > 0 ? nameSuffixIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const privacyLevelIds = body.personalInfo?.defaultPrivacyLevel ? convertToIds('privacy_levels', [body.personalInfo.defaultPrivacyLevel]) : [];
    const privacyLevelId = privacyLevelIds.length > 0 ? privacyLevelIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const referralSourceIds = body.personalInfo?.howDidYouHearAboutUs ? convertToIds('referral_sources', [body.personalInfo.howDidYouHearAboutUs]) : [];
    const referralSourceId = referralSourceIds.length > 0 ? referralSourceIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    // Validate and normalize username BEFORE creating firebaseUserData
    const requestedUsername = body.personalInfo?.username;
    let normalizedUsername: string | undefined;
    
    if (requestedUsername) {
      // Validate username format before attempting reservation
      const trimmedUsername = requestedUsername.trim();
      if (trimmedUsername.length < 3 || trimmedUsername.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
        return NextResponse.json(
          { 
            error: 'Invalid username format',
            field: 'username',
            details: 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens'
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
      
      normalizedUsername = trimmedUsername.toLowerCase();
    }
    
    // Prepare Firebase user data with type-safe standardized structure
    const firebaseUserData: RBCAUserData = {
      // Core Identity & Metadata
      onc: body.onboardingComplete || false, // onboardingComplete
      lut: new Date().toISOString(), // lastUpdated
      
      // Step 1: SignIn
      sgn: {
        smt: (body.signInMethod as 'email' | 'google' | 'facebook' | 'linkedin') || 'google', // signInMethod
        evf: body.emailVerified || true // emailVerified (OAuth users pre-verified)
      },
      
      // Step 2: PersonalInformation
      pin: {
        eml: body.personalInfo?.email || session?.user?.email || '', // email
        fnm: body.personalInfo?.firstName || '', // firstName
        lnm: body.personalInfo?.lastName || '', // lastName
        unm: normalizedUsername || body.personalInfo?.username?.toLowerCase() || '', // username (normalized: trimmed and lowercased)
        str: body.personalInfo?.stateOfResidence || '', // stateOfResidence
        cty: body.personalInfo?.cityOfResidence || '', // cityOfResidence
        zip: body.personalInfo?.zipCode || '', // zipCode
        pfx: namePrefixId ?? null, // namePrefix (numeric ID) - use null instead of undefined
        sfx: nameSuffixId ?? null, // nameSuffix (numeric ID) - use null instead of undefined
        pvl: privacyLevelId ?? null, // privacyLevel (numeric ID) - use null instead of undefined
        ref: referralSourceId ?? null, // referralSource (numeric ID) - use null instead of undefined
        rft: body.personalInfo?.otherHeardAboutText || body.personalInfo?.referralText || '', // referralText (custom text)
        sfxa: body.personalInfo?.suffixDetectionAsked ?? false // suffixDetectionAsked (boolean flag)
      },
      
      // Data Interests & Motivations
      mot: {
        rnk: motivationIds || [], // Ensure array is never undefined
        oth: extractedMotivationText || '' // Ensure string is never undefined
      },
      
      // Step 5: GovernmentInterests
      gov: {
        rnk: governmentIds || [] // rankedGovernments (Array of numeric IDs) - ensure array is never undefined
      },
      
      // Step 6: InformationSources
      inf: {
        rnk: informationSourceIds || [], // rankedInformationSources (Array of numeric IDs) - ensure array is never undefined
        oth: extractedOtherInfoSourceText || '' // otherInformationSourceText - ensure string is never undefined
      },
      
      // Step 7: AgreementAcceptance
      agr: {
        acc: body.agreementAccepted !== undefined ? body.agreementAccepted : true // agreementAccepted
      }
    };

    // Registration Status Tracking (for incomplete registrations requiring payment)
    // All registrations require membership selection, so track payment status
    if (body.membershipSelection) {
      firebaseUserData.reg = {
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

    // Add password for email/password users only
    if (body.signInMethod === 'email' && body.password) {
      const hashedPassword = await bcrypt.hash(body.password, SECURITY_CONFIG.BCRYPT_SALT_ROUNDS);
      // Type-safe password addition
      const userDataWithPassword: RBCAUserData & { pwd: string } = {
        ...firebaseUserData,
        pwd: hashedPassword
      };
      Object.assign(firebaseUserData, userDataWithPassword);
    }

    // Custom text values extracted and validated

    // CRITICAL: Atomically reserve username using Firebase transaction (prevents race conditions)
    if (normalizedUsername) {
      const usernameIndexRef = database.ref(`rbca_usernames/${normalizedUsername}`);
      
      // Type-safe username reservation data structure
      interface UsernameReservation {
        userId: string;
        reservedAt: string;
      }
      
      try {
        const transactionResult = await usernameIndexRef.transaction((currentData: UsernameReservation | null): UsernameReservation | undefined => {
          // If username is already reserved by a different user, abort transaction
          if (currentData !== null) {
            // Type guard: ensure currentData has expected structure
            if (typeof currentData === 'object' && 'userId' in currentData && typeof currentData.userId === 'string') {
              const existingUserId = currentData.userId;
              // Allow if it's the same user (updating their own username)
              if (existingUserId === firebaseUserId) {
                return currentData; // Keep existing reservation
              }
            }
            return undefined; // Abort - username already taken by different user
          }
          // Reserve username atomically
          return {
            userId: firebaseUserId,
            reservedAt: new Date().toISOString()
          };
        });

        // Transaction was aborted (username already exists for different user)
        if (!transactionResult.committed) {
          console.error(`[SECURITY] Username collision detected: "${requestedUsername}" already exists for different user`);
          return NextResponse.json(
            { 
              error: 'Username already exists',
              field: 'username',
              available: false,
              username: requestedUsername
            },
            { status: HTTP_STATUS.CONFLICT }
          );
        }
      } catch (transactionError) {
        console.error('[ERROR] Username reservation transaction failed:', transactionError);
        return NextResponse.json(
          { 
            error: 'Username validation service unavailable',
            details: 'Please try again later'
          },
          { status: HTTP_STATUS.SERVICE_UNAVAILABLE }
        );
      }
    }

    // Create/update user in Firebase - use .update() to merge data
    try {
      const userRef = database.ref(`rbca_users/${firebaseUserId}`);
      await userRef.update(firebaseUserData);

      // RBCA user created successfully
      return NextResponse.json({
        success: true,
        userId: firebaseUserId,
        message: 'RBCA user created successfully in Firebase'
      });
    } catch (userCreationError) {
      // Rollback: Release username reservation if user creation fails
      if (normalizedUsername) {
        try {
          const usernameIndexRef = database.ref(`rbca_usernames/${normalizedUsername}`);
          await usernameIndexRef.remove();
          console.warn(`[ROLLBACK] Released username reservation "${normalizedUsername}" due to user creation failure`);
        } catch (rollbackError) {
          console.error(`[ERROR] Failed to release username reservation "${normalizedUsername}" after user creation failure:`, rollbackError);
        }
      }
      
      // Log detailed error for debugging
      const errorMessage = userCreationError instanceof Error ? userCreationError.message : String(userCreationError);
      const errorStack = userCreationError instanceof Error ? userCreationError.stack : undefined;
      console.error('[ERROR] Failed to create/update user in Firebase:', {
        error: errorMessage,
        stack: errorStack,
        userId: firebaseUserId,
        signInMethod: body.signInMethod
      });
      
      return NextResponse.json(
        { 
          error: 'Firebase user creation failed',
          message: 'Failed to update user data. Please try again.',
          details: errorMessage
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

  } catch (error: any) {
    // Log error without exposing sensitive data
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('RBCA user creation failed: Database operation error', {
      error: errorMessage,
      stack: errorStack
    });
    return NextResponse.json(
      { 
        error: 'Firebase user creation failed',
        message: 'Failed to update user data. Please try again.',
        details: errorMessage
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get Firebase database instance
    const database = getAdminDatabase();

    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await request.json();
    const firebaseUserId = body.sessionId || session.user.id;

    // Process RBCA user update request

    // Get existing user data
    const userRef = database.ref(`rbca_users/${firebaseUserId}`);
    const snapshot = await userRef.once('value');
    const existingData = snapshot.val();

    if (!existingData) {
      return NextResponse.json(
        { error: 'RBCA user not found in Firebase' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Convert text values to IDs for static options if provided
    const dataInterestIds = body.dataInterests ? convertToIds('data_interests', body.dataInterests) : null;
    const motivationIds = body.rankedMotivations ? convertToIds('data_interests', body.rankedMotivations) : null;
    const governmentIds = body.rankedGovernments ? convertToIds('governments', body.rankedGovernments) : null;
    const informationSourceIds = body.rankedInformationSources ? convertToIds('information_sources', body.rankedInformationSources) : null;
    
    // Convert personal information static options for updates (using frontend field names)
    // Use nullish coalescing to ensure undefined values become null (Firebase doesn't allow undefined)
    const namePrefixIds = body.personalInfo?.prefix ? convertToIds('name_prefixes', [body.personalInfo.prefix]) : [];
    const namePrefixId = namePrefixIds.length > 0 ? namePrefixIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const nameSuffixIds = body.personalInfo?.suffix ? convertToIds('name_suffixes', [body.personalInfo.suffix]) : [];
    const nameSuffixId = nameSuffixIds.length > 0 ? nameSuffixIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const privacyLevelIds = body.personalInfo?.defaultPrivacyLevel ? convertToIds('privacy_levels', [body.personalInfo.defaultPrivacyLevel]) : [];
    const privacyLevelId = privacyLevelIds.length > 0 ? privacyLevelIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    const referralSourceIds = body.personalInfo?.howDidYouHearAboutUs ? convertToIds('referral_sources', [body.personalInfo.howDidYouHearAboutUs]) : [];
    const referralSourceId = referralSourceIds.length > 0 ? referralSourceIds[SECURITY_CONFIG.FIRST_ELEMENT_INDEX] : null;
    
    // Prepare step-based updates with unique acronym keys
    const stepUpdates: any = {};
    
    // Update specific steps based on provided data
    if (body.personalInfo) {
      // CRITICAL: Atomically reserve username if username is being updated
      const requestedUsername = body.personalInfo.username;
      const currentUsername = existingData.pin?.unm;
      let normalizedUsername: string | undefined;
      
      if (requestedUsername) {
        // Validate username format before attempting reservation
        const trimmedUsername = requestedUsername.trim();
        if (trimmedUsername.length < 3 || trimmedUsername.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
          return NextResponse.json(
            { 
              error: 'Invalid username format',
              field: 'username',
              details: 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens'
            },
            { status: HTTP_STATUS.BAD_REQUEST }
          );
        }
        
        normalizedUsername = trimmedUsername.toLowerCase();
        const usernameLower = normalizedUsername;
        const currentUsernameLower = currentUsername?.toLowerCase()?.trim();
        
        // Only process if username is actually changing
        if (usernameLower !== currentUsernameLower) {
          const usernameIndexRef = database.ref(`rbca_usernames/${usernameLower}`);
          
          // Type-safe username reservation data structure
          interface UsernameReservation {
            userId: string;
            reservedAt: string;
          }
          
          try {
            // Atomically reserve new username FIRST (safer: don't release old until new is confirmed)
            const transactionResult = await usernameIndexRef.transaction((currentData: UsernameReservation | null): UsernameReservation | undefined => {
              // If username is already reserved by a different user, abort transaction
              if (currentData !== null) {
                // Type guard: ensure currentData has expected structure
                if (typeof currentData === 'object' && 'userId' in currentData && typeof currentData.userId === 'string') {
                  const existingUserId = currentData.userId;
                  // Allow if it's the same user (edge case: updating to same username)
                  if (existingUserId === firebaseUserId) {
                    return currentData; // Keep existing reservation
                  }
                }
                return undefined; // Abort - username already taken by different user
              }
              // Reserve username atomically
              return {
                userId: firebaseUserId,
                reservedAt: new Date().toISOString()
              };
            });

            // Transaction was aborted (username already exists for different user)
            if (!transactionResult.committed) {
              console.error(`[SECURITY] Username update collision detected: "${requestedUsername}" already exists for different user`);
              return NextResponse.json(
                { 
                  error: 'Username already exists',
                  field: 'username',
                  available: false,
                  username: requestedUsername
                },
                { status: HTTP_STATUS.CONFLICT }
              );
            }
            
            // Only release old username AFTER new one is successfully reserved
            if (currentUsernameLower && currentUsernameLower !== usernameLower) {
              try {
                const oldUsernameRef = database.ref(`rbca_usernames/${currentUsernameLower}`);
                await oldUsernameRef.remove();
              } catch (cleanupError) {
                // Log but don't fail - old username cleanup is non-critical
                console.warn(`[WARN] Failed to cleanup old username reservation "${currentUsernameLower}":`, cleanupError);
              }
            }
          } catch (transactionError) {
            console.error('[ERROR] Username update reservation transaction failed:', transactionError);
            return NextResponse.json(
              { 
                error: 'Username validation service unavailable',
                details: 'Please try again later'
              },
              { status: HTTP_STATUS.SERVICE_UNAVAILABLE }
            );
          }
        }
      }

      stepUpdates.pin = {
        ...existingData.pin,
        eml: body.personalInfo.email || existingData.pin?.eml, // email
        fnm: body.personalInfo.firstName || existingData.pin?.fnm || '', // firstName
        lnm: body.personalInfo.lastName || existingData.pin?.lnm || '', // lastName
        unm: normalizedUsername || existingData.pin?.unm || '', // username (normalized: trimmed and lowercased)
        str: body.personalInfo.stateOfResidence || existingData.pin?.str || '', // stateOfResidence
        cty: body.personalInfo.cityOfResidence || existingData.pin?.cty || '', // cityOfResidence
        zip: body.personalInfo.zipCode || existingData.pin?.zip || '', // zipCode
        pfx: namePrefixId !== null ? namePrefixId : (existingData.pin?.pfx ?? null), // namePrefix (use null instead of undefined)
        sfx: nameSuffixId !== null ? nameSuffixId : (existingData.pin?.sfx ?? null), // nameSuffix (use null instead of undefined)
        pvl: privacyLevelId !== null ? privacyLevelId : (existingData.pin?.pvl ?? null), // privacyLevel (use null instead of undefined)
        ref: referralSourceId !== null ? referralSourceId : (existingData.pin?.ref ?? null), // referralSource (use null instead of undefined)
        rft: body.personalInfo.referralText !== undefined ? body.personalInfo.referralText : (existingData.pin?.rft || ''), // referralText
        sfxa: body.personalInfo.suffixDetectionAsked !== undefined ? body.personalInfo.suffixDetectionAsked : (existingData.pin?.sfxa ?? false) // suffixDetectionAsked (preserve existing or default to false)
      };
    }
    
    // Data interests now handled through motivations only - no separate din object
    
    if (motivationIds) {
      stepUpdates.mot = {
        ...existingData.mot,
        rnk: motivationIds // rankedMotivations
      };
    }
    
    if (governmentIds) {
      stepUpdates.gov = {
        ...existingData.gov,
        rnk: governmentIds // rankedGovernments
      };
    }
    
    if (informationSourceIds) {
      stepUpdates.inf = {
        ...existingData.inf,
        rnk: informationSourceIds, // rankedInformationSources
        oth: body.otherInformationSourceText || existingData.inf?.oth || '' // otherInformationSourceText
      };
    }
    
    if (body.agreementAccepted !== undefined) {
      stepUpdates.agr = {
        ...existingData.agr,
        acc: body.agreementAccepted // agreementAccepted
      };
    }
    
    if (body.onboardingComplete !== undefined) {
      stepUpdates.onc = body.onboardingComplete; // onboardingComplete
    }
    
    // Merge updates with existing data
    const updateData = {
      ...existingData,
      ...stepUpdates
    };

    // Update user in Firebase - use .update() to merge data
    await userRef.update(updateData);

    console.log(' [DEBUG] RBCA user updated in Firebase:', firebaseUserId);

    return NextResponse.json({
      success: true,
      userId: firebaseUserId,
      message: 'RBCA user updated successfully in Firebase'
    });

  } catch (error: any) {
    console.error(' [ERROR] Firebase RBCA user update failed:', error);
    return NextResponse.json(
      { 
        error: 'Firebase user update failed',
        details: error.message 
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
