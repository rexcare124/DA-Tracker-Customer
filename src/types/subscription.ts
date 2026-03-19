/**
 * Subscription and Membership Type Definitions
 * 
 * This file defines all TypeScript types and interfaces for the GDAP subscription model.
 * All types are 100% type-safe with no `any` types allowed.
 * 
 * Reference: `06_SUBSCRIPTION_MODEL.md`, `08_FIREBASE_SCHEMA.md`
 */

/**
 * Membership level names matching Firebase schema
 */
export type MembershipLevel = 'follower' | 'groupie' | 'insider' | 'bizleader' | 'dataseeker';

/**
 * Subscription status values from Stripe
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';

/**
 * Billing frequency options
 */
export type BillingFrequency = 'monthly' | 'yearly';

/**
 * Membership tier numeric values (1-5)
 */
export type MembershipTierNumber = 1 | 2 | 3 | 4 | 5;

/**
 * Subscription data structure matching Firebase schema
 */
export interface Subscription {
  membershipLevel: MembershipLevel;
  membershipTier: MembershipTierNumber;
  billingFrequency: BillingFrequency;
  priceId: string;
  amount: number;
  currency: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Membership tier configuration
 */
export interface MembershipTier {
  tier: MembershipTierNumber;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  stripePriceIdMonthly: string;
  stripePriceIdAnnual: string;
  features: string[];
  description: string;
  employeeRange?: string;
}

/**
 * Tier level mapping for access control
 */
export const TIER_LEVELS: Record<MembershipLevel, MembershipTierNumber> = {
  follower: 1,
  groupie: 2,
  insider: 3,
  bizleader: 4,
  dataseeker: 5,
} as const;

/**
 * Feature list for each tier
 * Reference: `06_SUBSCRIPTION_MODEL.md` Feature Access Matrix
 */
export const TIER_FEATURES: Record<MembershipTierNumber, readonly string[]> = {
  1: ['ad-free', 'home-zip-smrc-access', 'music-seeds-social-group'] as const,
  2: ['ad-free', 'home-work-zip-smrc-access', 'music-seeds-social-group'] as const,
  3: [
    'ad-free',
    'five-zip-smrc-access',
    'saved-searches',
    'priority-support-24h',
    'music-seeds-social-group',
  ] as const,
  4: [
    'ad-free',
    'all-zip-smrc-access',
    'saved-searches',
    'email-phone-directory',
    'custom-reports',
    'api-access',
    'premium-support-8h',
    'techsocial-social-group',
  ] as const,
  5: [
    'ad-free',
    'all-zip-smrc-access',
    'saved-searches',
    'email-phone-directory',
    'custom-reports',
    'api-access',
    'dataset-downloads',
    'document-library',
    'bulk-data-export',
    'elite-support-4h',
    'techsocial-social-group',
  ] as const,
} as const;

/**
 * Membership state for Redux store
 */
export interface MembershipState {
  isLoading: boolean;
  membershipLevel: MembershipLevel | null;
  membershipTier: MembershipTierNumber | 0; // 0 means no subscription
  hasActiveSubscription: boolean;
  features: string[]; // Mutable array for Redux state
  subscription: Subscription | null;
}

/**
 * Type guard to check if a value is a valid MembershipLevel
 */
export function isMembershipLevel(value: unknown): value is MembershipLevel {
  return (
    typeof value === 'string' &&
    (value === 'follower' ||
      value === 'groupie' ||
      value === 'insider' ||
      value === 'bizleader' ||
      value === 'dataseeker')
  );
}

/**
 * Type guard to check if a value is a valid SubscriptionStatus
 */
export function isSubscriptionStatus(value: unknown): value is SubscriptionStatus {
  return (
    typeof value === 'string' &&
    (value === 'active' ||
      value === 'canceled' ||
      value === 'past_due' ||
      value === 'unpaid' ||
      value === 'trialing')
  );
}

/**
 * Type guard to validate Subscription object structure
 */
export function isSubscription(value: unknown): value is Subscription {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    isMembershipLevel(obj.membershipLevel) &&
    typeof obj.membershipTier === 'number' &&
    obj.membershipTier >= 1 &&
    obj.membershipTier <= 5 &&
    (obj.billingFrequency === 'monthly' || obj.billingFrequency === 'yearly') &&
    typeof obj.priceId === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.currency === 'string' &&
    typeof obj.stripeCustomerId === 'string' &&
    typeof obj.stripeSubscriptionId === 'string' &&
    isSubscriptionStatus(obj.status) &&
    typeof obj.currentPeriodStart === 'string' &&
    typeof obj.currentPeriodEnd === 'string' &&
    typeof obj.cancelAtPeriodEnd === 'boolean' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
}

/**
 * Get features for a specific tier
 */
export function getFeaturesForTier(tier: MembershipTierNumber): readonly string[] {
  return TIER_FEATURES[tier] ?? [];
}
