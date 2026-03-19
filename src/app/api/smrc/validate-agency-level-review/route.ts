/**
 * Validate Agency Level Review API Route
 *
 * Validate if a user can review a specific agency (3-month cooldown) using Firebase.
 *
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSecurityContext, logSecurityEvent } from '@/lib/serverSecurity';
import { smrcFirebaseService } from '@/lib/firebase/smrc-service';
import { isValidAgencyLevel } from '@/lib/firebase/smrc-types';

/**
 * POST /api/smrc/validate-agency-level-review
 *
 * Body: { agencyLevel: string, agencyName: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent('UNAUTHORIZED_VALIDATE_AGENCY_ATTEMPT', null, {});
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent('INVALID_SECURITY_CONTEXT_VALIDATE_AGENCY', null, {
        userId: session.user?.id,
      });
      return NextResponse.json(
        { error: 'Invalid security context' },
        { status: 403 }
      );
    }

    let body: { agencyLevel?: string; agencyName?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'agencyLevel and agencyName are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const agencyLevel = body.agencyLevel;
    const agencyNameRaw = body.agencyName;
    const agencyName =
      typeof agencyNameRaw === 'string'
        ? agencyNameRaw
        : Array.isArray(agencyNameRaw)
          ? agencyNameRaw[0]
          : agencyNameRaw != null
            ? String(agencyNameRaw)
            : '';

    if (!agencyLevel || !agencyName || agencyName.trim().length === 0) {
      return NextResponse.json(
        { error: 'agencyLevel and agencyName are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!isValidAgencyLevel(agencyLevel)) {
      return NextResponse.json(
        { error: 'Invalid agencyLevel. Must be one of: county, city, state', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const result = await smrcFirebaseService.validateAgencyLevelReview(
      securityContext.userId,
      agencyLevel,
      agencyName.trim()
    );

    if (!result.success) {
      if (result.code === 'REVIEW_COOLDOWN') {
        return NextResponse.json(
          {
            valid: false,
            message: result.error || 'Agency was recently reviewed',
            code: 'REVIEW_COOLDOWN',
          },
          { status: 400 }
        );
      }
      logSecurityEvent('BACKEND_VALIDATE_AGENCY_ERROR', securityContext, {
        agencyLevel,
        agencyName,
        error: result.error,
        code: result.code,
      });
      return NextResponse.json(
        {
          error: result.error || 'Failed to validate agency review',
          code: result.code || 'VALIDATE_AGENCY_ERROR',
        },
        { status: 500 }
      );
    }

    logSecurityEvent('AGENCY_VALIDATION_SUCCESS', securityContext, {
      agencyLevel,
      agencyName,
      valid: result.data.valid,
    });

    return NextResponse.json(result.data, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('POST Validate Agency API error:', error);
    logSecurityEvent('VALIDATE_AGENCY_ERROR', null, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
