import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { getAdminDatabase } from '@/lib/firebase/admin';
import { secureLogger } from '@/lib/secureLogger';
import type { UserProfileResponse, UserProfileError } from '@/types/user-profile';
import type { RBCAUserData } from '@/types/rbca-user';
import { isValidRBCAUserData } from '@/types/rbca-user';

// Static option mappings (reverse lookup from IDs to text values)
type NamePrefixId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type NameSuffixId = 8 | 9 | 10 | 11 | 12 | 13 | 14;
type PrivacyLevelId = 14 | 15 | 16 | 17;

const STATIC_OPTION_IDS = {
  name_prefixes: {
    1: 'Dr.',
    2: 'Mr.',
    3: 'Mrs.',
    4: 'Ms.',
    5: 'Prof.',
    6: 'Rev.',
    7: 'The Hon.'
  } as const satisfies Record<NamePrefixId, string>,
  name_suffixes: {
    8: 'Jr.',
    9: 'Sr.',
    10: 'II',
    11: 'III',
    12: 'IV',
    13: 'V',
    14: 'Esq.'
  } as const satisfies Record<NameSuffixId, string>,
  privacy_levels: {
    14: 'Anonymous',
    15: 'Username Only',
    16: 'Your First Name & Last Initial',
    17: 'Your Full Name'
  } as const satisfies Record<PrivacyLevelId, string>
} as const;

// Reverse mapping: text values to numeric IDs
const REVERSE_PREFIX_MAP: Record<string, NamePrefixId> = {
  'Dr.': 1,
  'Mr.': 2,
  'Mrs.': 3,
  'Ms.': 4,
  'Prof.': 5,
  'Rev.': 6,
  'The Hon.': 7
};

// Reverse mapping for suffixes
const REVERSE_SUFFIX_MAP: Record<string, NameSuffixId> = {
  'Jr.': 8,
  'Sr.': 9,
  'II': 10,
  'III': 11,
  'IV': 12,
  'V': 13,
  'Esq.': 14
};

const REVERSE_PRIVACY_LEVEL_MAP: Record<string, PrivacyLevelId> = {
  'Anonymous': 14,
  'Username Only': 15,
  'Your First Name & Last Initial': 16,
  'Your Full Name': 17
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const database = getAdminDatabase();
    const firebaseUserId = session.user.id;

    console.log('[DEBUG] Fetching user profile for userId:', firebaseUserId);

    // Fetch user data from Firebase
    const userRef = database.ref(`rbca_users/${firebaseUserId}`);
    const snapshot = await userRef.once('value');
    const firebaseData: unknown = snapshot.val();


    if (!firebaseData || typeof firebaseData !== 'object') {
      secureLogger.warn('User not found in Firebase', {
        operation: 'GET /api/users/profile',
        userId: firebaseUserId,
      });
      return NextResponse.json(
        { error: 'User not found in Firebase' },
        { status: 404 }
      );
    }

    // Validate Firebase data structure with type guard
    if (!isValidRBCAUserData(firebaseData)) {
      console.warn('[WARN] Invalid RBCA user data structure in Firebase:', firebaseUserId);
      return NextResponse.json(
        { error: 'Invalid user data structure in Firebase' },
        { status: 500 }
      );
    }

    // Extract and convert data from Firebase structure with type safety
    const firebaseUserData: RBCAUserData = firebaseData;
    const pin = firebaseUserData.pin || {};
    const sgn = firebaseUserData.sgn || { smt: 'email' as const, evf: false };
    
    // Check if user has seen payment success modal (stored at root level of user data)
    const hasSeenPaymentSuccessModal = 
      typeof firebaseUserData === 'object' && 
      'hasSeenPaymentSuccessModal' in firebaseUserData &&
      firebaseUserData.hasSeenPaymentSuccessModal === true;
    
    // Convert numeric IDs to text values with type safety
    const prefixId = pin.pfx;
    const suffixId = pin.sfx;
    const privacyLevelId = pin.pvl;

    const prefix: string | null = prefixId && prefixId in STATIC_OPTION_IDS.name_prefixes
      ? STATIC_OPTION_IDS.name_prefixes[prefixId as NamePrefixId]
      : null;
    const suffix: string | null = suffixId && suffixId in STATIC_OPTION_IDS.name_suffixes
      ? STATIC_OPTION_IDS.name_suffixes[suffixId as NameSuffixId]
      : null;
    const privacyLevel: string | null = privacyLevelId && privacyLevelId in STATIC_OPTION_IDS.privacy_levels
      ? STATIC_OPTION_IDS.privacy_levels[privacyLevelId as PrivacyLevelId]
      : null;

    // Handle location - city might be stored as "County/City" format
    const cityOfResidence = pin.cty || '';
    const stateOfResidence = pin.str || '';
    const zipCode = pin.zip || '';

    // Parse city if it's in "County/City" format
    let city = cityOfResidence;
    let county = '';
    if (cityOfResidence.includes('/')) {
      const parts = cityOfResidence.split('/');
      county = parts[0] || '';
      city = parts[1] || cityOfResidence;
    }

    // Format location for display
    const locationParts = [stateOfResidence];
    if (county && city) {
      locationParts.push(`${county}/${city}`);
    } else if (city) {
      locationParts.push(city);
    }
    if (zipCode) {
      locationParts.push(zipCode);
    }

    // Map privacy level to the format expected by the frontend
    const privacyLevelMap: Record<string, string> = {
      'Anonymous': 'private',
      'Username Only': 'private',
      'Your First Name & Last Initial': 'first_name_only',
      'Your Full Name': 'full_name'
    };

    const mappedPrivacyLevel: string | null = privacyLevel 
      ? (privacyLevelMap[privacyLevel] || privacyLevel.toLowerCase().replace(/\s+/g, '_'))
      : null;

    // Return user profile data with proper typing
    const profileResponse: UserProfileResponse = {
      id: firebaseUserId,
      email: pin.eml || session.user.email || '',
      firstName: pin.fnm || '',
      lastName: pin.lnm || '',
      prefix: prefix || '',
      suffix: suffix || '',
      state: stateOfResidence,
      city: city,
      county: county,
      cityOfResidence: cityOfResidence, // Keep original format
      zipCode: zipCode,
      privacyLevel: mappedPrivacyLevel,
      privacyLevelText: privacyLevel,
      location: locationParts.filter(Boolean).join(', '),
      hasPodiaMembership: false, // TODO: Check subscription data
      podiaMembershipLevel: null,
      signInMethod: sgn.smt,
      hasSeenPaymentSuccessModal,
    };

    return NextResponse.json(profileResponse);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    secureLogger.error('Failed to fetch user profile', {
      operation: 'GET /api/users/profile',
    });
    const errorResponse: UserProfileError = {
      error: 'Failed to fetch user profile',
      details: errorMessage
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Request body type for PUT endpoint
interface UpdateProfileRequest {
  prefix?: string;
  suffix?: string;
  state?: string;
  cityOfResidence?: string;
  zipCode?: string;
  privacyLevel?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' } satisfies UserProfileError,
        { status: 401 }
      );
    }

    const database = getAdminDatabase();
    const firebaseUserId = session.user.id;

    // Parse request body
    const body: UpdateProfileRequest = await request.json().catch(() => ({}));


    // Fetch existing user data to ensure it exists
    const userRef = database.ref(`rbca_users/${firebaseUserId}`);
    const snapshot = await userRef.once('value');
    const existingData: unknown = snapshot.val();

    if (!existingData || typeof existingData !== 'object') {
      secureLogger.warn('User not found in Firebase', {
        operation: 'PUT /api/users/profile',
        userId: firebaseUserId,
      });
      return NextResponse.json(
        { error: 'User not found in Firebase' } satisfies UserProfileError,
        { status: 404 }
      );
    }

    // Validate existing data structure
    if (!isValidRBCAUserData(existingData)) {
      secureLogger.warn('Invalid RBCA user data structure in Firebase', {
        operation: 'PUT /api/users/profile',
        userId: firebaseUserId,
      });
      return NextResponse.json(
        { error: 'Invalid user data structure in Firebase' } satisfies UserProfileError,
        { status: 500 }
      );
    }

    // Prepare updates for Firebase
    const pinUpdates: Record<string, unknown> = {};

    // Convert prefix text to ID
    if (body.prefix !== undefined) {
      const prefixId = body.prefix ? REVERSE_PREFIX_MAP[body.prefix] : null;
      if (prefixId !== undefined) {
        pinUpdates.pfx = prefixId;
      } else if (body.prefix === '') {
        pinUpdates.pfx = null;
      }
    }

    // Convert suffix text to ID
    if (body.suffix !== undefined) {
      if (body.suffix === '') {
        pinUpdates.sfx = null;
      } else {
        const suffixId = REVERSE_SUFFIX_MAP[body.suffix];
        if (suffixId !== undefined) {
          pinUpdates.sfx = suffixId;
        } else {
          // Log warning if suffix is not found in mapping (e.g., "Esq." if not in static options)
          console.warn(`[WARN] Suffix "${body.suffix}" not found in REVERSE_SUFFIX_MAP. It may not be supported in Firebase static_option_registry.`);
          // Don't update the suffix if it's not in the mapping
        }
      }
    }

    // Update state
    if (body.state !== undefined) {
      pinUpdates.str = body.state || null;
    }

    // Update city of residence (keep "County/City" format if provided)
    if (body.cityOfResidence !== undefined) {
      pinUpdates.cty = body.cityOfResidence || null;
    }

    // Update zip code
    if (body.zipCode !== undefined) {
      pinUpdates.zip = body.zipCode || null;
    }

    // Convert privacy level text to ID
    if (body.privacyLevel !== undefined) {
      const privacyLevelId = body.privacyLevel ? REVERSE_PRIVACY_LEVEL_MAP[body.privacyLevel] : null;
      if (privacyLevelId !== undefined) {
        pinUpdates.pvl = privacyLevelId;
      } else if (body.privacyLevel === '') {
        pinUpdates.pvl = null;
      }
    }

    // Update Firebase if there are any changes
    if (Object.keys(pinUpdates).length > 0) {
      const pinRef = database.ref(`rbca_users/${firebaseUserId}/pin`);
      await pinRef.update(pinUpdates);
      console.log('[DEBUG] Updated Firebase with:', pinUpdates);
    }

    // Fetch updated data to return
    const updatedSnapshot = await userRef.once('value');
    const updatedData: unknown = updatedSnapshot.val();

    if (!updatedData || typeof updatedData !== 'object' || !isValidRBCAUserData(updatedData)) {
      secureLogger.error('Failed to fetch updated data after update', {
        operation: 'PUT /api/users/profile',
        userId: firebaseUserId,
      });
      return NextResponse.json(
        { error: 'Failed to fetch updated profile data' } satisfies UserProfileError,
        { status: 500 }
      );
    }

    // Convert updated Firebase data to response format (same logic as GET)
    const updatedFirebaseData: RBCAUserData = updatedData;
    const updatedPin = updatedFirebaseData.pin || {};
    const updatedSgn = updatedFirebaseData.sgn || { smt: 'email' as const, evf: false };
    
    // Check if user has seen payment success modal (stored at root level of user data)
    const updatedHasSeenPaymentSuccessModal = 
      typeof updatedFirebaseData === 'object' && 
      'hasSeenPaymentSuccessModal' in updatedFirebaseData &&
      (updatedFirebaseData as { hasSeenPaymentSuccessModal?: boolean }).hasSeenPaymentSuccessModal === true;
    
    const prefixId = updatedPin.pfx;
    const suffixId = updatedPin.sfx;
    const privacyLevelId = updatedPin.pvl;

    const prefix: string | null = prefixId && prefixId in STATIC_OPTION_IDS.name_prefixes
      ? STATIC_OPTION_IDS.name_prefixes[prefixId as NamePrefixId]
      : null;
    const suffix: string | null = suffixId && suffixId in STATIC_OPTION_IDS.name_suffixes
      ? STATIC_OPTION_IDS.name_suffixes[suffixId as NameSuffixId]
      : null;
    const privacyLevel: string | null = privacyLevelId && privacyLevelId in STATIC_OPTION_IDS.privacy_levels
      ? STATIC_OPTION_IDS.privacy_levels[privacyLevelId as PrivacyLevelId]
      : null;

    const cityOfResidence = updatedPin.cty || '';
    const stateOfResidence = updatedPin.str || '';
    const zipCode = updatedPin.zip || '';

    let city = cityOfResidence;
    let county = '';
    if (cityOfResidence.includes('/')) {
      const parts = cityOfResidence.split('/');
      county = parts[0] || '';
      city = parts[1] || cityOfResidence;
    }

    const locationParts = [stateOfResidence];
    if (county && city) {
      locationParts.push(`${county}/${city}`);
    } else if (city) {
      locationParts.push(city);
    }
    if (zipCode) {
      locationParts.push(zipCode);
    }

    const privacyLevelMap: Record<string, string> = {
      'Anonymous': 'private',
      'Username Only': 'private',
      'Your First Name & Last Initial': 'first_name_only',
      'Your Full Name': 'full_name'
    };

    const mappedPrivacyLevel: string | null = privacyLevel 
      ? (privacyLevelMap[privacyLevel] || privacyLevel.toLowerCase().replace(/\s+/g, '_'))
      : null;

    const responseData: UserProfileResponse = {
      id: firebaseUserId,
      email: updatedPin.eml || session.user.email || '',
      firstName: updatedPin.fnm || '',
      lastName: updatedPin.lnm || '',
      prefix: prefix || '',
      suffix: suffix || '',
      state: stateOfResidence,
      city: city,
      county: county,
      cityOfResidence: cityOfResidence,
      zipCode: zipCode,
      privacyLevel: mappedPrivacyLevel,
      privacyLevelText: privacyLevel,
      location: locationParts.filter(Boolean).join(', '),
      hasPodiaMembership: false,
      podiaMembershipLevel: null,
      signInMethod: updatedSgn.smt,
      hasSeenPaymentSuccessModal: updatedHasSeenPaymentSuccessModal,
    };

    return NextResponse.json(responseData);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    secureLogger.error('Failed to update user profile', {
      operation: 'PUT /api/users/profile',
    });
    return NextResponse.json(
      { error: 'Failed to update user profile', details: errorMessage } satisfies UserProfileError,
      { status: 500 }
    );
  }
}

