// User Profile Types - Type-safe definitions for user profile data
import type { AppUser } from './index';

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  prefix: string;
  suffix: string;
  state: string;
  city: string;
  county: string;
  cityOfResidence: string;
  zipCode: string;
  privacyLevel: string | null;
  privacyLevelText: string | null;
  location: string;
  hasPodiaMembership: boolean;
  podiaMembershipLevel: string | null;
  signInMethod: 'email' | 'google' | 'facebook' | 'linkedin';
  hasSeenPaymentSuccessModal?: boolean;
}

export interface UserProfileError {
  error: string;
  details?: string;
}

// Type guard for UserProfileResponse
export function isUserProfileResponse(data: unknown): data is UserProfileResponse {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.prefix === 'string' &&
    typeof obj.suffix === 'string' &&
    typeof obj.state === 'string' &&
    typeof obj.city === 'string' &&
    typeof obj.county === 'string' &&
    typeof obj.cityOfResidence === 'string' &&
    typeof obj.zipCode === 'string' &&
    (obj.privacyLevel === null || typeof obj.privacyLevel === 'string') &&
    (obj.privacyLevelText === null || typeof obj.privacyLevelText === 'string') &&
    typeof obj.location === 'string' &&
    typeof obj.hasPodiaMembership === 'boolean' &&
    (obj.podiaMembershipLevel === null || typeof obj.podiaMembershipLevel === 'string') &&
    ['email', 'google', 'facebook', 'linkedin'].includes(obj.signInMethod as string) &&
    (obj.hasSeenPaymentSuccessModal === undefined || typeof obj.hasSeenPaymentSuccessModal === 'boolean')
  );
}

// Type guard for UserProfileError
export function isUserProfileError(data: unknown): data is UserProfileError {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return typeof obj.error === 'string';
}

// Extended AppUser type that includes profile data
export interface AppUserWithProfile extends AppUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  prefix?: string;
  suffix?: string;
  state?: string;
  city?: string;
  county?: string;
  cityOfResidence?: string;
  zipCode?: string;
  privacyLevel?: string | null;
  privacyLevelText?: string | null;
  location?: string;
  hasPodiaMembership?: boolean;
  podiaMembershipLevel?: string | null;
  signInMethod?: 'email' | 'google' | 'facebook' | 'linkedin';
}

