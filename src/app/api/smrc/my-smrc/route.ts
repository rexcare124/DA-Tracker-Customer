/**
 * My SMRCs API Route
 *
 * Get all SMRC reviews for the authenticated user with pagination (Firebase).
 *
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSecurityContext, logSecurityEvent } from '@/lib/serverSecurity';
import { smrcFirebaseService } from '@/lib/firebase/smrc-service';
import { GetMySmrcsSchema } from '@/lib/firebase/smrc-types';

/**
 * GET /api/smrc/my-smrc
 *
 * Query: page (default 1), perPage (default 10)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent('UNAUTHORIZED_MY_SMRC_ACCESS', null, {});
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent('INVALID_SECURITY_CONTEXT_MY_SMRC', null, {
        userId: session.user?.id,
      });
      return NextResponse.json(
        { error: 'Invalid security context' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('perPage') || '10';
    const state = searchParams.get('state') ?? undefined;
    const city = searchParams.get('city') ?? undefined;
    const status = searchParams.get('status') ?? undefined;

    const parsed = GetMySmrcsSchema.safeParse({ page, perPage, state, city, status });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const result = await smrcFirebaseService.getMySMRCs(
      securityContext.userId,
      parsed.data
    );

    if (!result.success) {
      logSecurityEvent('BACKEND_MY_SMRC_ERROR', securityContext, {
        error: result.error,
        code: result.code,
      });
      return NextResponse.json(
        { error: result.error || 'Failed to retrieve SMRC reviews', code: result.code || 'GET_MY_SMRCS_ERROR' },
        { status: 500 }
      );
    }

    logSecurityEvent('MY_SMRC_FETCHED', securityContext, {
      count: result.data.data?.length ?? 0,
      totalCount: result.data.totalCount ?? 0,
      page: result.data.page ?? 1,
    });

    return NextResponse.json(result.data, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=60',
        'X-Total-Count': String(result.data.totalCount ?? 0),
        'X-Page': String(result.data.page ?? 1),
        'X-Last-Page': String(result.data.lastPage ?? 1),
      },
    });
  } catch (error) {
    console.error('GET My SMRCs API error:', error);
    logSecurityEvent('MY_SMRC_FETCH_ERROR', null, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
