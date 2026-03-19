// RBCA User Data Structure - Production-Ready TypeScript Interfaces
// Standardized nested structure for consistent Firebase storage

export interface RBCAUserData {
  // Core Identity & Metadata
  onc: boolean; // onboardingComplete
  lut: string; // lastUpdated timestamp (ISO format)
  
  // Registration Status (for incomplete registrations requiring payment)
  reg?: {
    sts: 'pending_payment' | 'completed'; // registrationStatus
    cat: string; // registrationCreatedAt (ISO timestamp)
    lrs: 0 | 1 | 4 | 6 | null; // lastReminderSent (days since registration: 0, 1, 4, or 6)
    pra: number; // paymentRetryAttempts (0-3)
    msl?: {
      lvl: 'follower' | 'groupie' | 'insider' | 'bizleader' | 'dataseeker'; // membershipSelection.level
      bfr: 'monthly' | 'yearly'; // membershipSelection.billingFrequency
    }; // membershipSelection (stored for later checkout)
  };
  
  // SignIn Information
  sgn: {
    smt: 'email' | 'google' | 'facebook' | 'linkedin'; // signInMethod
    evf: boolean; // emailVerified
  };
  
  // Personal Information
  pin: {
    eml: string; // email
    fnm: string; // firstName
    lnm: string; // lastName
    unm: string; // username
    str: string; // stateOfResidence
    cty: string; // cityOfResidence
    zip: string; // zipCode
    pfx: number | null; // namePrefix (static option ID)
    sfx: number | null; // nameSuffix (static option ID)
    pvl: number | null; // privacyLevel (static option ID)
    ref: number | null; // referralSource (static option ID)
    rft: string; // referralText (custom text)
    sfxa?: boolean; // suffixDetectionAsked (boolean flag) - optional for backward compatibility
    // Email/password specific authentication fields (optional)
    pwd?: string; // hashedPassword (bcrypt)
    // Two-factor authentication fields (optional)
    twoFactorCode?: string; // hashed 2FA code (bcrypt)
    twoFactorCodeExpires?: string; // 2FA code expiration timestamp (ISO format)
    tfvA?: string; // 2FA verification timestamp (ISO format) - twoFactorVerifiedAt
    // Note: tfvE (expiration) is not stored - it's calculated from tfvA + 5 minutes when needed
  };
  
  // Data Interests & Motivations
  mot?: {
    rnk: number[]; // rankedMotivations (array of static option IDs)
    oth: string; // otherMotivationText (custom text)
  };
  
  // Government Interests
  gov?: {
    rnk: number[]; // rankedGovernments (array of static option IDs)
  };
  
  // Information Sources
  inf?: {
    rnk: number[]; // rankedInformationSources (array of static option IDs)
    oth: string; // otherInformationSourceText (custom text)
  };
  
  // Agreement Acceptance
  agr: {
    acc: boolean; // agreementAccepted
  };
  
}

// Legacy fields that should NOT be used (for migration reference only)
export interface LegacyRBCAUserFields {
  // These fields are redundant and should be removed
  agreementAccepted?: boolean; // Use agr.acc instead
  createdAt?: string; // Use cat instead
  lastUpdated?: string; // Use lut instead
  emailVerified?: boolean; // Use sgn.evf instead
  onboardingComplete?: boolean; // Use onc instead
  firstName?: string; // Use pin.fnm instead
  lastName?: string; // Use pin.lnm instead
  name?: string; // Derive from pin.fnm + pin.lnm
  email?: string; // Use pin.eml instead
  signInMethod?: string; // Use sgn.smt instead
  personalInfoReferralText?: string; // Use pin.rft instead
  provider?: string; // Use sgn.smt instead
  providerAccountId?: string; // OAuth specific, not needed in RBCA
  id?: string; // Firebase key is the ID
}

// Type for user data during authentication
export interface AuthUserData {
  id: string;
  email: string;
  password?: string;
  onboardingComplete: boolean;
  emailVerified: boolean;
  agreementAccepted: boolean;
  name: string;
  username?: string;
  signInMethod: string;
  provider: string;
  createdAt?: string;
  updatedAt?: string;
}

// Type guards for runtime validation
export function isValidRBCAUserData(data: any): data is RBCAUserData {
  return (
    typeof data === 'object' &&
    typeof data.onc === 'boolean' &&
    typeof data.sgn === 'object' &&
    ['email', 'google', 'facebook', 'linkedin'].includes(data.sgn.smt) &&
    typeof data.sgn.evf === 'boolean' &&
    typeof data.pin === 'object' &&
    typeof data.pin.eml === 'string' &&
    typeof data.pin.fnm === 'string' &&
    typeof data.pin.lnm === 'string' &&
    typeof data.agr === 'object' &&
    typeof data.agr.acc === 'boolean'
  );
}

// Utility function to extract user data safely
export function extractUserData(firebaseData: any): AuthUserData | null {
  if (!isValidRBCAUserData(firebaseData)) {
    console.warn('[SECURITY] Invalid RBCA user data structure detected');
    return null;
  }
  
  return {
    id: '', // Will be set by caller
    email: firebaseData.pin.eml,
    password: firebaseData.pin.pwd,
    onboardingComplete: firebaseData.onc,
    emailVerified: firebaseData.sgn.evf,
    agreementAccepted: firebaseData.agr.acc,
    name: `${firebaseData.pin.fnm} ${firebaseData.pin.lnm}`.trim(),
    username: firebaseData.pin.unm,
    signInMethod: firebaseData.sgn.smt,
    provider: firebaseData.sgn.smt,
    createdAt: undefined,
    updatedAt: undefined
  };
}
