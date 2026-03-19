/**
 * Stripe Price ID Constants
 * 
 * Maps membership tiers and billing frequencies to Stripe Price IDs.
 * These Price IDs are used to create Stripe Checkout Sessions.
 * 
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: STRIPE_SETUP_GUIDE.md, STRIPE_IMPLEMENTATION_SUMMARY.md
 */

import type { MembershipLevel, BillingFrequency } from '@/types/subscription';

/**
 * Stripe Price ID mapping
 * 
 * Maps each membership level and billing frequency to its corresponding Stripe Price ID.
 * Price IDs are obtained from the Stripe Dashboard after creating products and prices.
 */
export const STRIPE_PRICE_IDS: Record<
  MembershipLevel,
  Record<BillingFrequency, string>
> = {
  follower: {
    monthly: 'price_1Slv1005jjOOGFVnGGlBngnE',
    yearly: 'price_1Sm1Es05jjOOGFVnuEjsJmfj',
  },
  groupie: {
    monthly: 'price_1Sm1J905jjOOGFVnKia91p4L',
    yearly: 'price_1Sm1pW05jjOOGFVneGHQVmUg',
  },
  insider: {
    monthly: 'price_1Sm1sp05jjOOGFVnzXpF9WKC',
    yearly: 'price_1Sm1w405jjOOGFVnYIc6TXWH',
  },
  bizleader: {
    monthly: 'price_1Sm25q05jjOOGFVnmOGJ9vTw',
    yearly: 'price_1Sm2qz05jjOOGFVnT6RpnXOn',
  },
  dataseeker: {
    monthly: 'price_1Sm35z05jjOOGFVnJG5JdH6f',
    yearly: 'price_1Sm37k05jjOOGFVnnZ7yLwmY',
  },
} as const;

/**
 * Get Stripe Price ID for a membership level and billing frequency
 * 
 * @param membershipLevel - The membership level (follower, groupie, insider, bizleader, dataseeker)
 * @param billingFrequency - The billing frequency (monthly or yearly)
 * @returns The Stripe Price ID
 * @throws Error if the membership level or billing frequency is invalid
 */
export function getStripePriceId(
  membershipLevel: MembershipLevel,
  billingFrequency: BillingFrequency
): string {
  const priceId = STRIPE_PRICE_IDS[membershipLevel]?.[billingFrequency];

  if (!priceId) {
    throw new Error(
      `Invalid membership level or billing frequency: ${membershipLevel}, ${billingFrequency}`
    );
  }

  return priceId;
}

/**
 * Validate that a Price ID exists in the mapping
 * 
 * @param priceId - The Price ID to validate
 * @returns true if the Price ID exists in the mapping, false otherwise
 */
export function isValidPriceId(priceId: string): boolean {
  return Object.values(STRIPE_PRICE_IDS).some((frequencies) =>
    Object.values(frequencies).includes(priceId)
  );
}
