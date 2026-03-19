import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSecurityContext, hasPermission, logSecurityEvent } from '@/lib/serverSecurity';

/**
 * GET /api/government-entities/[id] - Fetch a single government entity by ID
 * Proxies to backend with auth and permission checks.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      logSecurityEvent('UNAUTHORIZED_ENTITY_VIEW_ATTEMPT', null, {});
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const securityContext = await getSecurityContext(session);
    if (!securityContext) {
      return NextResponse.json({ error: 'Invalid security context' }, { status: 403 });
    }

    if (!hasPermission(securityContext, 'canViewEntityDetails')) {
      logSecurityEvent('INSUFFICIENT_PERMISSIONS', securityContext, { action: 'viewEntityDetails' });
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const entityId = parseInt(id, 10);
    if (isNaN(entityId) || entityId < 1) {
      return NextResponse.json({ error: 'Invalid entity ID' }, { status: 400 });
    }

    const backendUrl = `${process.env.BACKEND_URL}/api/government-entities/${entityId}`;
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN}`,
        'X-User-ID': securityContext.userId,
        'X-User-Role': securityContext.userRole,
      },
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
      }
      return NextResponse.json(
        { error: 'Failed to load entity' },
        { status: backendResponse.status }
      );
    }

    const entity = await backendResponse.json();
    return NextResponse.json(entity, {
      status: 200,
      headers: { 'Cache-Control': 'private, max-age=60' },
    });
  } catch (error) {
    console.error('GET government entity error:', error);
    logSecurityEvent('ENTITY_FETCH_ERROR', null, {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
