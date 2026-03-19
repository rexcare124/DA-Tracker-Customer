import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createRateLimiter, RATE_LIMITS } from '@/lib/rateLimit';
import { getClientIdentifier } from '@/lib/getClientIP';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimiter = createRateLimiter(RATE_LIMITS.OAUTH);
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimiter(clientId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          message: "Too many OAuth validation attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.OAUTH.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { social, provider } = body;

    // Validate OAuth state parameters
    if (!social || social !== 'true') {
      return NextResponse.json(
        { message: "Invalid OAuth state parameter" },
        { status: 400 }
      );
    }

    // Validate provider
    const allowedProviders = ['google', 'facebook', 'linkedin'];
    if (!provider || !allowedProviders.includes(provider)) {
      return NextResponse.json(
        { message: "Invalid OAuth provider" },
        { status: 400 }
      );
    }

    // Get current session to validate user state
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "No active session found" },
        { status: 401 }
      );
    }

    // Validate that the user is in the correct state for OAuth completion
    if (session.user.onboardingComplete) {
      return NextResponse.json(
        { message: "User has already completed onboarding" },
        { status: 400 }
      );
    }

    // Log OAuth state validation for security monitoring
    console.log('SECURITY: OAuth state validated', {
      userId: session.user.id,
      provider,
      timestamp: new Date().toISOString(),
      clientId
    });

    return NextResponse.json({
      valid: true,
      provider,
      userId: session.user.id
    });

  } catch (error) {
    console.error('OAUTH_STATE_VALIDATION_ERROR', error);
    
    return NextResponse.json(
      { message: "Internal server error during OAuth state validation" },
      { status: 500 }
    );
  }
}
