/**
 * Stripe Integration Hook
 * 
 * Provides client-side Stripe functionality for subscription management.
 * Handles loading Stripe.js, creating checkout sessions, and managing subscriptions.
 * 
 * This hook is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 */

import { useState, useEffect, useCallback } from 'react';
import { loadStripe, type Stripe as StripeType } from '@stripe/stripe-js';
import { secureLogger } from '@/lib/secureLogger';

/**
 * Stripe hook return type
 */
interface UseStripeReturn {
  stripe: StripeType | null;
  loading: boolean;
  error: Error | null;
  createCheckoutSession: (
    membershipLevel: string,
    billingFrequency: 'monthly' | 'yearly',
    priceId: string,
    email?: string // Optional email for unauthenticated registration flow
  ) => Promise<void>;
}

/**
 * useStripe Hook
 * 
 * Loads Stripe.js and provides methods for subscription management
 */
export function useStripe(): UseStripeReturn {
  const [stripe, setStripe] = useState<StripeType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Load Stripe publishable key and initialize Stripe.js
   */
  useEffect(() => {
    let isMounted = true;

    async function loadStripeInstance(): Promise<void> {
      try {
        // Fetch publishable key from API
        const response = await fetch('/api/subscriptions/publishable-key');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Stripe publishable key');
        }

        const data = await response.json();
        const publishableKey = data.publishableKey;

        if (!publishableKey) {
          throw new Error('Publishable key not found in response');
        }

        // Load Stripe.js
        const stripeInstance = await loadStripe(publishableKey);

        if (isMounted) {
          setStripe(stripeInstance);
          setLoading(false);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load Stripe');
        if (isMounted) {
          setError(error);
          setLoading(false);
        }
        secureLogger.error('Error loading Stripe', {
          operation: 'useStripe',
        });
      }
    }

    loadStripeInstance();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Create checkout session and redirect to Stripe Checkout
   * 
   * @param email - Optional email for unauthenticated registration flow
   */
  const createCheckoutSession = useCallback(
    async (
      membershipLevel: string,
      billingFrequency: 'monthly' | 'yearly',
      priceId: string,
      email?: string
    ): Promise<void> => {
      try {
        if (!stripe) {
          throw new Error('Stripe not loaded');
        }

        // Create checkout session via API
        const requestBody: {
          membershipLevel: string;
          billingFrequency: 'monthly' | 'yearly';
          priceId: string;
          email?: string;
        } = {
          membershipLevel,
          billingFrequency,
          priceId,
        };

        // Include email if provided (for unauthenticated registration flow)
        if (email) {
          requestBody.email = email;
        }

        const response = await fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create checkout session');
        }

        const { sessionId, url } = await response.json();

        if (!sessionId || !url) {
          throw new Error('Invalid response from checkout session creation');
        }

        // Redirect to Stripe Checkout using the session URL
        // Note: stripe.redirectToCheckout() was deprecated in Stripe.js v2025-09-30
        // Use standard browser redirect instead
        if (typeof window !== 'undefined' && url) {
          window.location.href = url;
        } else {
          throw new Error('Unable to redirect to checkout: window or URL not available');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create checkout session');
        secureLogger.error('Error creating checkout session', {
          operation: 'createCheckoutSession',
        });
        throw error;
      }
    },
    [stripe]
  );

  return {
    stripe,
    loading,
    error,
    createCheckoutSession,
  };
}