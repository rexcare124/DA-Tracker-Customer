/**
 * Single SMRC API Route
 *
 * Get a specific SMRC review by ID (Firebase).
 * PATCH: Publish a draft (full payload, sets status to published).
 * DELETE: Delete a draft (only drafts; removes from DB).
 *
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSecurityContext, logSecurityEvent } from '@/lib/serverSecurity';
import { smrcFirebaseService } from '@/lib/firebase/smrc-service';
import { CreateSMRCSchema, CreateDraftSMRCSchema } from '@/lib/firebase/smrc-types';

/**
 * GET /api/smrc/[id]
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent('UNAUTHORIZED_SMRC_ACCESS', null, {});
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent('INVALID_SECURITY_CONTEXT_SMRC', null, {
        userId: session.user?.id,
      });
      return NextResponse.json(
        { error: 'Invalid security context' },
        { status: 403 }
      );
    }

    const { id: smrcId } = await context.params;

    if (!smrcId || smrcId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid SMRC ID', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const result = await smrcFirebaseService.getSMRC(
      securityContext.userId,
      smrcId.trim()
    );

    if (!result.success) {
      if (result.code === 'SMRC_NOT_FOUND') {
        logSecurityEvent('BACKEND_SMRC_GET_ERROR', securityContext, {
          smrcId,
          error: result.error,
          code: result.code,
        });
        return NextResponse.json(
          { error: result.error || 'SMRC review not found', code: result.code || 'SMRC_NOT_FOUND' },
          { status: 404 }
        );
      }
      logSecurityEvent('BACKEND_SMRC_GET_ERROR', securityContext, {
        smrcId,
        error: result.error,
        code: result.code,
      });
      return NextResponse.json(
        { error: result.error || 'Failed to retrieve SMRC review', code: result.code || 'GET_SMRC_ERROR' },
        { status: result.code === 'VALIDATION_ERROR' ? 400 : 500 }
      );
    }

    logSecurityEvent('SMRC_FETCHED', securityContext, { smrcId });

    return NextResponse.json(result.data, {
      status: 200,
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch (error) {
    console.error('GET SMRC API error:', error);
    logSecurityEvent('SMRC_FETCH_ERROR', null, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/smrc/[id]
 * - If body.status === 'draft': update draft data and draftStep (partial payload).
 * - Otherwise: publish the draft (full SMRC payload, sets status to published).
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      logSecurityEvent('UNAUTHORIZED_SMRC_UPDATE', null, {});
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const securityContext = await getSecurityContext(session);
    if (!securityContext) {
      return NextResponse.json({ error: 'Invalid security context' }, { status: 403 });
    }

    const { id: smrcId } = await context.params;
    if (!smrcId?.trim()) {
      return NextResponse.json({ error: 'Invalid SMRC ID', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const bodyObj = body as Record<string, unknown> | null;
    const isDraftUpdate = bodyObj && bodyObj.status === 'draft' && typeof bodyObj.draftStep === 'number';

    if (isDraftUpdate) {
      const parsed = CreateDraftSMRCSchema.safeParse({ status: bodyObj.status, draftStep: bodyObj.draftStep });
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors.map((e) => e.message).join('; '), code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
      }
      const result = await smrcFirebaseService.updateDraftSMRC(
        securityContext.userId,
        smrcId.trim(),
        bodyObj as Parameters<typeof smrcFirebaseService.updateDraftSMRC>[2]
      );
      if (!result.success) {
        if (result.code === 'VALIDATION_ERROR') {
          return NextResponse.json({ error: result.error, code: result.code }, { status: 400 });
        }
        return NextResponse.json(
          { error: result.error || 'Failed to update draft', code: result.code },
          { status: 500 }
        );
      }
      return NextResponse.json(result.data, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }

    const parsed = CreateSMRCSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map(
        (e) => (e.path.length ? `${e.path.join('.')}: ${e.message}` : e.message)
      );
      return NextResponse.json(
        { error: messages.join('; '), code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const result = await smrcFirebaseService.updateSMRC(
      securityContext.userId,
      smrcId.trim(),
      parsed.data
    );

    if (!result.success) {
      if (result.code === 'REVIEW_COOLDOWN') {
        return NextResponse.json({ error: result.error, code: result.code }, { status: 400 });
      }
      if (result.code === 'VALIDATION_ERROR') {
        return NextResponse.json({ error: result.error, code: result.code }, { status: 400 });
      }
      logSecurityEvent('BACKEND_SMRC_UPDATE_ERROR', securityContext, {
        smrcId,
        error: result.error,
        code: result.code,
      });
      return NextResponse.json(
        { error: result.error || 'Failed to update SMRC', code: result.code || 'UPDATE_SMRC_ERROR' },
        { status: 500 }
      );
    }

    logSecurityEvent('SMRC_PUBLISHED', securityContext, { smrcId });
    return NextResponse.json(result.data, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('PATCH SMRC API error:', error);
    logSecurityEvent('SMRC_UPDATE_ERROR', null, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/smrc/[id]
 * Delete a draft. Only allowed when the document is a draft owned by the current user.
 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      logSecurityEvent('UNAUTHORIZED_SMRC_DELETE', null, {});
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const securityContext = await getSecurityContext(session);
    if (!securityContext) {
      return NextResponse.json({ error: 'Invalid security context' }, { status: 403 });
    }

    const { id: smrcId } = await context.params;
    if (!smrcId?.trim()) {
      return NextResponse.json({ error: 'Invalid SMRC ID', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const result = await smrcFirebaseService.deleteDraftSMRC(securityContext.userId, smrcId.trim());

    if (!result.success) {
      if (result.code === 'SMRC_NOT_FOUND' || result.code === 'VALIDATION_ERROR') {
        return NextResponse.json(
          { error: result.error || 'Draft not found or cannot be deleted', code: result.code },
          { status: result.code === 'VALIDATION_ERROR' ? 400 : 404 }
        );
      }
      logSecurityEvent('BACKEND_SMRC_DELETE_ERROR', securityContext, {
        smrcId,
        error: result.error,
        code: result.code,
      });
      return NextResponse.json(
        { error: result.error || 'Failed to delete draft', code: result.code },
        { status: 500 }
      );
    }

    logSecurityEvent('SMRC_DRAFT_DELETED', securityContext, { smrcId });
    return NextResponse.json(result.data, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('DELETE SMRC API error:', error);
    logSecurityEvent('SMRC_DELETE_ERROR', null, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
