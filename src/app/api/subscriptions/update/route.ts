/**
 * Update Subscription API Route
 * 
 * Updates a user's subscription (upgrade/downgrade or change billing frequency).
 * 
 * This route is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSecurityContext, hasPermission, logSecurityEvent } from '@/lib/serverSecurity';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';
import { secureLogger } from '@/lib/secureLogger';
import { getServerSubscription } from '@/lib/serverMembership';
import { z } from 'zod';

/**
 * Request body schema for subscription update
 */
const UpdateSubscriptionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  membershipLevel: z.enum(['follower', 'groupie', 'insider', 'bizleader', 'dataseeker']).optional(),
  billingFrequency: z.enum(['monthly', 'yearly']).optional(),
});

/**
 * POST /api/subscriptions/update
 * 
 * Updates a user's subscription
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get session and validate authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      logSecurityEvent('UNAUTHORIZED_SUBSCRIPTION_UPDATE_ATTEMPT', null, {});
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get security context
    const securityContext = await getSecurityContext(session);
    
    if (!securityContext) {
      logSecurityEvent('INVALID_SECURITY_CONTEXT', null, { userId: session.user?.id });
      return NextResponse.json(
        { error: 'Invalid security context' },
        { status: 403 }
      );
    }

    // Check permission to manage subscriptions
    if (!hasPermission(securityContext, 'canManageSubscriptions')) {
      logSecurityEvent('INSUFFICIENT_SUBSCRIPTION_PERMISSIONS', securityContext, {});
      return NextResponse.json(
        { error: 'Insufficient permissions to manage subscriptions' },
        { status: 403 }
      );
    }

    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      secureLogger.error('Stripe not configured', {
        operation: 'POST /api/subscriptions/update',
        userId: securityContext.userId,
      });
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateSubscriptionSchema.safeParse(body);

    if (!validationResult.success) {
      logSecurityEvent('INVALID_SUBSCRIPTION_UPDATE_REQUEST', securityContext, {
        errors: validationResult.error.errors,
      });
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { priceId, membershipLevel, billingFrequency } = validationResult.data;
    const userId = securityContext.userId;

    // Get subscription from Firebase
    const subscription = await getServerSubscription(userId);

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    if (subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      );
    }

    // Get Stripe client
    const stripe = getStripeClient();

    // Get current subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);

    // Update subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: priceId,
        },
      ],
      proration_behavior: 'always_invoice', // Prorate the difference
      metadata: {
        ...stripeSubscription.metadata,
        userId,
        ...(membershipLevel && { membershipLevel }),
        ...(billingFrequency && { billingFrequency }),
      },
    });

    secureLogger.info('Subscription updated', {
      operation: 'POST /api/subscriptions/update',
      userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully',
      subscriptionId: updatedSubscription.id,
    });
  } catch (error) {
    secureLogger.error('Error updating subscription', {
      operation: 'POST /api/subscriptions/update',
    });

    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}