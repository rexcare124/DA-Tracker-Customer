// Firebase exports - centralized access point for Firebase services
// Re-export client-side Firebase services
export { database, auth } from './config';
export type { Database, Auth, FirebaseApp } from './config';

// Note: Admin services are not exported here as they should only be used server-side
// Import admin services directly from './admin' in API routes and server-side code only

// Strict type definitions for Firebase data structures
export interface RBCARegistration {
  readonly id: string;
  readonly userId: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly businessName: string;
  readonly businessType: string;
  readonly businessAddress: string;
  readonly businessCity: string;
  readonly businessState: string;
  readonly businessZip: string;
  readonly businessPhone: string;
  readonly businessWebsite?: string;
  readonly businessDescription: string;
  readonly ownershipPercentage: number;
  readonly yearsInBusiness: number;
  readonly annualRevenue: string;
  readonly numberOfEmployees: string;
  readonly certificationTypes: readonly string[];
  readonly minorityStatus?: string;
  readonly womanOwned: boolean;
  readonly veteranOwned: boolean;
  readonly disabilityOwned: boolean;
  readonly lgbtqOwned: boolean;
  readonly hubzoneEligible: boolean;
  readonly status: RBCAStatus;
  readonly submittedAt: string;
  readonly updatedAt: string;
  readonly reviewedBy?: string;
  readonly reviewedAt?: string;
  readonly rejectionReason?: string;
  readonly documents?: RBCADocuments;
}

// Strict status enum
export type RBCAStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// Document structure with validation
export interface RBCADocuments {
  readonly businessLicense?: string;
  readonly taxReturns?: string;
  readonly financialStatements?: string;
  readonly certificationDocs?: readonly string[];
}

// Input type for creating new registrations (without readonly modifiers)
export interface CreateRBCARegistration {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  businessPhone: string;
  businessWebsite?: string;
  businessDescription: string;
  ownershipPercentage: number;
  yearsInBusiness: number;
  annualRevenue: string;
  numberOfEmployees: string;
  certificationTypes: string[];
  minorityStatus?: string;
  womanOwned: boolean;
  veteranOwned: boolean;
  disabilityOwned: boolean;
  lgbtqOwned: boolean;
  hubzoneEligible: boolean;
  documents?: {
    businessLicense?: string;
    taxReturns?: string;
    financialStatements?: string;
    certificationDocs?: string[];
  };
}

// Update type for partial updates
export interface UpdateRBCARegistration {
  status?: RBCAStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  updatedAt: string;
}

// Firebase database paths - type-safe constants
export const FIREBASE_PATHS = {
  RBCA_REGISTRATIONS: 'rbca_registrations',
  ADMINS: 'admins', 
  USER_PROFILES: 'user_profiles',
} as const;

// Type for Firebase paths
export type FirebasePath = typeof FIREBASE_PATHS[keyof typeof FIREBASE_PATHS];

// Validation helpers
export const RBCA_VALIDATION = {
  MIN_OWNERSHIP_PERCENTAGE: 0,
  MAX_OWNERSHIP_PERCENTAGE: 100,
  MIN_YEARS_IN_BUSINESS: 0,
  MAX_YEARS_IN_BUSINESS: 100,
  REQUIRED_FIELDS: [
    'userId',
    'email', 
    'firstName',
    'lastName',
    'businessName',
    'businessType',
    'businessAddress',
    'businessCity',
    'businessState',
    'businessZip',
    'businessPhone',
    'businessDescription',
    'ownershipPercentage',
    'yearsInBusiness',
    'annualRevenue',
    'numberOfEmployees',
    'certificationTypes',
  ] as const,
  VALID_STATUSES: ['pending', 'approved', 'rejected', 'under_review'] as const,
} as const;

// Type guards for runtime validation
export function isValidRBCAStatus(status: string): status is RBCAStatus {
  return RBCA_VALIDATION.VALID_STATUSES.includes(status as RBCAStatus);
}

export function isValidOwnershipPercentage(percentage: number): boolean {
  return (
    typeof percentage === 'number' &&
    !isNaN(percentage) &&
    percentage >= RBCA_VALIDATION.MIN_OWNERSHIP_PERCENTAGE &&
    percentage <= RBCA_VALIDATION.MAX_OWNERSHIP_PERCENTAGE
  );
}

export function isValidYearsInBusiness(years: number): boolean {
  return (
    typeof years === 'number' &&
    !isNaN(years) &&
    Number.isInteger(years) &&
    years >= RBCA_VALIDATION.MIN_YEARS_IN_BUSINESS &&
    years <= RBCA_VALIDATION.MAX_YEARS_IN_BUSINESS
  );
}
