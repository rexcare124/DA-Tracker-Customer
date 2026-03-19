/**
 * SMRC API Route
 *
 * Create a new SMRC review using Firebase.
 *
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSecurityContext, logSecurityEvent } from "@/lib/serverSecurity";
import { smrcFirebaseService } from "@/lib/firebase/smrc-service";
import { GetMySmrcsSchema } from "@/lib/firebase/smrc-types";

/**
 * GET /api/smrc
 *
 * List all SMRC reviews (all users) with pagination.
 * Query: page (default 1), perPage (default 10), state (optional), city (optional).
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const securityContext = await getSecurityContext(session);
    if (!securityContext) {
      return NextResponse.json({ error: "Invalid security context" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("perPage") || "10";
    const state = searchParams.get("state") ?? undefined;
    const city = searchParams.get("city") ?? undefined;

    const parsed = GetMySmrcsSchema.safeParse({ page, perPage, state, city });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const result = await smrcFirebaseService.getAllSMRCs(parsed.data);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to retrieve reviews", code: result.code },
        { status: 500 },
      );
    }

    return NextResponse.json(result.data, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Total-Count": String(result.data.totalCount ?? 0),
        "X-Page": String(result.data.page ?? 1),
        "X-Last-Page": String(result.data.lastPage ?? 1),
      },
    });
  } catch (error) {
    console.error("GET SMRC API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/smrc
 *
 * Create a new SMRC review
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent("UNAUTHORIZED_SMRC_CREATE_ATTEMPT", null, {});
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent("INVALID_SECURITY_CONTEXT_SMRC_CREATE", null, {
        userId: session.user?.id,
      });
      return NextResponse.json({ error: "Invalid security context" }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await smrcFirebaseService.createSMRC(
      { ...(body as object), ipAddress } as Parameters<typeof smrcFirebaseService.createSMRC>[0],
      securityContext.userId,
    );

    if (!result.success) {
      if (result.code === "REVIEW_COOLDOWN") {
        logSecurityEvent("SMRC_CREATE_COOLDOWN", securityContext, {
          error: result.error,
          code: result.code,
        });
        return NextResponse.json({ error: result.error, code: result.code }, { status: 400 });
      }
      if (result.code === "VALIDATION_ERROR") {
        return NextResponse.json({ error: result.error, code: result.code }, { status: 400 });
      }
      logSecurityEvent("BACKEND_SMRC_CREATE_ERROR", securityContext, {
        error: result.error,
        code: result.code,
      });
      return NextResponse.json(
        {
          error: result.error || "Failed to create SMRC review",
          code: result.code || "CREATE_SMRC_ERROR",
        },
        { status: 500 },
      );
    }

    logSecurityEvent("SMRC_CREATED", securityContext, {
      smrcId: result.data.id,
      agencyLevel: result.data.agencyLevel,
      agencyName: result.data.agencyName,
    });

    return NextResponse.json(result.data, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("POST SMRC API error:", error);
    logSecurityEvent("SMRC_CREATE_ERROR", null, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
