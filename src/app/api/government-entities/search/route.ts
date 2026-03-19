import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSecurityContext, hasPermission, logSecurityEvent } from "@/lib/serverSecurity";
import { URLSearchParamsSchema } from "@/lib/validationSchemas";

/**
 * Government Entities Search API Route
 *
 * Provides secure search functionality for government entities with
 * comprehensive validation, authorization, and security logging.
 *
 * Features:
 * - Role-based access control
 * - Input validation and sanitization
 * - Security logging and audit trails
 * - Error handling and proper HTTP status codes
 * - Support for various search parameters
 */
export async function GET(request: NextRequest) {
  try {
    // Get session and validate authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent("UNAUTHORIZED_SEARCH_ATTEMPT", null, {});
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get security context
    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent("INVALID_SECURITY_CONTEXT", null, { userId: session.user?.id });
      return NextResponse.json({ error: "Invalid security context" }, { status: 403 });
    }

    // Check permission to search entities
    if (!hasPermission(securityContext, "canSearchEntities")) {
      logSecurityEvent("INSUFFICIENT_SEARCH_PERMISSIONS", securityContext, {});
      return NextResponse.json(
        { error: "Insufficient permissions to search entities" },
        { status: 403 },
      );
    }

    // Parse and validate search parameters (normalize to strings; URL may be built from typed client state)
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const searchParamsObj: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v != null && v !== "") searchParamsObj[k] = String(v);
    }

    // Validate search parameters with Zod
    const validationResult = URLSearchParamsSchema.safeParse(searchParamsObj);

    if (!validationResult.success) {
      logSecurityEvent("INVALID_SEARCH_PARAMS", securityContext, {
        params: searchParamsObj,
        errors: validationResult.error.errors,
      });
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const validatedParams = validationResult.data;

    // Log search attempt
    logSecurityEvent("SEARCH_ATTEMPT", securityContext, {
      searchParams: validatedParams,
    });

    // Build search query for backend API
    const backendSearchParams = new URLSearchParams();

    // Add validated parameters to backend request
    if (validatedParams.searchQuery) {
      backendSearchParams.append("searchQuery", validatedParams.searchQuery);
    }
    if (validatedParams.location) {
      backendSearchParams.append("location", validatedParams.location);
    }
    if (validatedParams.governmentLevels && Array.isArray(validatedParams.governmentLevels)) {
      validatedParams.governmentLevels.forEach((level: string) => {
        backendSearchParams.append("governmentLevels", level);
      });
    }
    if (validatedParams.entityType) {
      backendSearchParams.append("entityType", validatedParams.entityType);
    }
    if (validatedParams.hasBusinessLicenses !== undefined) {
      backendSearchParams.append(
        "hasBusinessLicenses",
        validatedParams.hasBusinessLicenses.toString(),
      );
    }
    if (validatedParams.hasReviews !== undefined) {
      backendSearchParams.append("hasReviews", validatedParams.hasReviews.toString());
    }
    if (validatedParams.isActive !== undefined) {
      backendSearchParams.append("isActive", validatedParams.isActive.toString());
    }
    if (validatedParams.latitude && validatedParams.longitude) {
      backendSearchParams.append("latitude", validatedParams.latitude);
      backendSearchParams.append("longitude", validatedParams.longitude);
    }
    if (validatedParams.radiusKm) {
      backendSearchParams.append("radiusKm", validatedParams.radiusKm.toString());
    }
    if (validatedParams.useRadiusSearch !== undefined) {
      backendSearchParams.append("useRadiusSearch", validatedParams.useRadiusSearch.toString());
    }
    if (validatedParams.populationMin) {
      backendSearchParams.append("populationMin", validatedParams.populationMin);
    }
    if (validatedParams.populationMax) {
      backendSearchParams.append("populationMax", validatedParams.populationMax);
    }
    if (validatedParams.dateFrom) {
      backendSearchParams.append("dateFrom", validatedParams.dateFrom);
    }
    if (validatedParams.dateTo) {
      backendSearchParams.append("dateTo", validatedParams.dateTo);
    }
    if (validatedParams.page) {
      backendSearchParams.append("page", validatedParams.page.toString());
    }
    if (validatedParams.limit) {
      backendSearchParams.append("limit", validatedParams.limit.toString());
    }
    // Backend only accepts sortBy: entityName | createdAt | governmentLevelId
    const validSortBy = ["entityName", "createdAt", "governmentLevelId"] as const;
    const sortBy = validSortBy.includes(validatedParams.sortBy as (typeof validSortBy)[number])
      ? validatedParams.sortBy
      : "entityName";
    const sortOrder = validatedParams.sortOrder === "desc" ? "desc" : "asc";
    backendSearchParams.append("sortBy", sortBy);
    backendSearchParams.append("sortOrder", sortOrder);

    // Add user context for backend
    backendSearchParams.append("userId", securityContext.userId);
    backendSearchParams.append("userRole", securityContext.userRole);

    // Make request to backend API
    const backendUrl = `${process.env.BACKEND_URL}/api/government-entities/search?${backendSearchParams.toString()}`;

    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
        "X-User-ID": securityContext.userId,
        "X-User-Role": securityContext.userRole,
      },
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      logSecurityEvent("BACKEND_SEARCH_ERROR", securityContext, {
        status: backendResponse.status,
        error: errorText,
      });

      return NextResponse.json(
        { error: "Backend search failed" },
        { status: backendResponse.status },
      );
    }

    const searchResults = await backendResponse.json();

    // Validate response structure
    if (!searchResults || typeof searchResults !== "object") {
      logSecurityEvent("INVALID_SEARCH_RESPONSE", securityContext, {
        response: searchResults,
      });
      return NextResponse.json({ error: "Invalid search response from backend" }, { status: 500 });
    }

    // Log successful search
    logSecurityEvent("SEARCH_SUCCESS", securityContext, {
      resultCount: searchResults.entities?.length || 0,
      totalCount: searchResults.total || 0,
    });

    // Return search results
    return NextResponse.json(searchResults, {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=300", // Cache for 5 minutes
        "X-Search-Results-Count": (searchResults.entities?.length || 0).toString(),
        "X-Total-Count": (searchResults.total || 0).toString(),
      },
    });
  } catch (error) {
    console.error("Search API error:", error);

    // Log error
    logSecurityEvent("SEARCH_API_ERROR", null, {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST method for complex search queries
 * Allows for more complex search parameters that might not fit in URL
 */
export async function POST(request: NextRequest) {
  try {
    // Get session and validate authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent("UNAUTHORIZED_POST_SEARCH_ATTEMPT", null, {});
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get security context
    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent("INVALID_SECURITY_CONTEXT_POST", null, { userId: session.user?.id });
      return NextResponse.json({ error: "Invalid security context" }, { status: 403 });
    }

    // Check permission to search entities
    if (!hasPermission(securityContext, "canSearchEntities")) {
      logSecurityEvent("INSUFFICIENT_POST_SEARCH_PERMISSIONS", securityContext, {});
      return NextResponse.json(
        { error: "Insufficient permissions to search entities" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate search parameters with Zod
    const validationResult = URLSearchParamsSchema.safeParse(body);

    if (!validationResult.success) {
      logSecurityEvent("INVALID_POST_SEARCH_PARAMS", securityContext, {
        params: body,
        errors: validationResult.error.errors,
      });
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const validatedParams = validationResult.data;

    // Log search attempt
    logSecurityEvent("POST_SEARCH_ATTEMPT", securityContext, {
      searchParams: validatedParams,
    });

    // Add user context
    const searchPayload = {
      ...validatedParams,
      userId: securityContext.userId,
      userRole: securityContext.userRole,
    };

    // Make request to backend API
    const backendUrl = `${process.env.BACKEND_URL}/api/government-entities/search`;

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
        "X-User-ID": securityContext.userId,
        "X-User-Role": securityContext.userRole,
      },
      body: JSON.stringify(searchPayload),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      logSecurityEvent("BACKEND_POST_SEARCH_ERROR", securityContext, {
        status: backendResponse.status,
        error: errorText,
      });

      return NextResponse.json(
        { error: "Backend search failed" },
        { status: backendResponse.status },
      );
    }

    const searchResults = await backendResponse.json();

    // Log successful search
    logSecurityEvent("POST_SEARCH_SUCCESS", securityContext, {
      resultCount: searchResults.entities?.length || 0,
      totalCount: searchResults.total || 0,
    });

    // Return search results
    return NextResponse.json(searchResults, {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=300", // Cache for 5 minutes
        "X-Search-Results-Count": (searchResults.entities?.length || 0).toString(),
        "X-Total-Count": (searchResults.total || 0).toString(),
      },
    });
  } catch (error) {
    console.error("POST Search API error:", error);

    // Log error
    logSecurityEvent("POST_SEARCH_API_ERROR", null, {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
