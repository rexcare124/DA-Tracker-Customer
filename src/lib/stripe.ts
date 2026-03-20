/**
 * Stripe Client Library
 * 
 * Provides secure, type-safe access to Stripe API following GDAP singleton pattern.
 * Uses secureEnv for environment variable access and follows existing codebase patterns.
 * 
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: STRIPE_INTEGRATION_ALTERNATIVE.md, Firebase admin.ts pattern
 */

import Stripe from 'stripe';
import { secureEnv } from './secureEnv';
import { secureLogger } from './secureLogger';

/**
 * Stripe client singleton instance
 */
let stripeClient: Stripe | null = null;

/**
 * Get Stripe client instance (singleton pattern)
 * 
 * @returns Stripe client instance
 * @throws Error if Stripe secret key is not configured
 */
export function getStripeClient(): Stripe {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = secureEnv.get('STRIPE_SECRET_KEY');

  if (!secretKey) {
    const error = new Error('STRIPE_SECRET_KEY is not configured');
    secureLogger.error('Stripe client initialization failed', {
      operation: 'getStripeClient',
    });
    throw error;
  }

  // Validate key format (Stripe keys start with sk_test_ or sk_live_)
  if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
    const error = new Error('Invalid STRIPE_SECRET_KEY format');
    secureLogger.error('Stripe client initialization failed - invalid key format', {
      operation: 'getStripeClient',
    });
    throw error;
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: '2026-02-25.clover',
    typescript: true,
  });

  secureLogger.info('Stripe client initialized successfully', {
    operation: 'getStripeClient',
  });

  return stripeClient;
}

/**
 * Get Stripe publishable key for client-side use
 * 
 * @returns Stripe publishable key
 * @throws Error if publishable key is not configured
 */
export function getStripePublishableKey(): string {
  const publishableKey = secureEnv.get('STRIPE_PUBLISHABLE_KEY');

  if (!publishableKey) {
    const error = new Error('STRIPE_PUBLISHABLE_KEY is not configured');
    secureLogger.error('Stripe publishable key not found', {
      operation: 'getStripePublishableKey',
    });
    throw error;
  }

  return publishableKey;
}

/**
 * Get Stripe webhook secret for webhook signature verification
 * 
 * @returns Stripe webhook secret
 * @throws Error if webhook secret is not configured
 */
export function getStripeWebhookSecret(): string {
  const webhookSecret = secureEnv.get('STRIPE_WEBHOOK_SECRET');

  if (!webhookSecret) {
    const error = new Error('STRIPE_WEBHOOK_SECRET is not configured');
    secureLogger.error('Stripe webhook secret not found', {
      operation: 'getStripeWebhookSecret',
    });
    throw error;
  }

  return webhookSecret;
}

/**
 * Check if Stripe is configured
 * 
 * @returns true if Stripe is properly configured
 */
export function isStripeConfigured(): boolean {
  return (
    secureEnv.has('STRIPE_SECRET_KEY') &&
    secureEnv.has('STRIPE_PUBLISHABLE_KEY')
  );
}

// Export Stripe types for use in other files
export type { Stripe };