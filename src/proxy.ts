import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Type-safe interfaces
interface SecurityEvent {
  type:
    | "bypass_attempt"
    | "suspicious_origin"
    | "rate_limit"
    | "unauthorized_access"
    | "invalid_token"
    | "sensitive_file_access";
  path: string;
  method: string;
  ip: string | null;
  userAgent: string | null;
  timestamp: string;
  details?: Record<string, unknown>;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Security constants
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 100;
const MAX_REQUESTS_PER_WINDOW_STRICT = 20; // For sensitive endpoints
const MAX_STRING_LENGTH = 1000; // Maximum length for log strings

// In-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, RateLimitEntry>();

// Security event logging
function logSecurityEvent(event: SecurityEvent): void {
  console.warn(`SECURITY_EVENT: ${event.type}`, {
    ...event,
    // Truncate long strings to prevent log flooding
    userAgent: event.userAgent?.substring(0, MAX_STRING_LENGTH),
    path: event.path.substring(0, MAX_STRING_LENGTH),
  });
}

// CRITICAL SECURITY: CVE-2025-29927 Mitigation
// Enhanced proxy with bypass detection and server-side authorization validation

export async function proxy(request: NextRequest) {
  const timestamp = new Date().toISOString();
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent");
  const path = request.nextUrl.pathname;
  const method = request.method;

  // CRITICAL: Detect and block proxy bypass attempts
  const proxySubrequest = request.headers.get("x-proxy-subrequest");
  if (proxySubrequest) {
    logSecurityEvent({
      type: "bypass_attempt",
      path,
      method,
      ip,
      userAgent,
      timestamp,
      details: { header: proxySubrequest },
    });
    return new NextResponse("Forbidden: Proxy bypass attempt detected", {
      status: 403,
    });
  }

  // CRITICAL: Validate request origin for API routes
  if (path.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host");

    // Allow same-origin requests and trusted domains
    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      "http://localhost:3000",
      "https://localhost:3000",
      "http://localhost:3002",
      "https://localhost:3002",
    ].filter(Boolean);

    if (origin && !allowedOrigins.includes(origin)) {
      logSecurityEvent({
        type: "suspicious_origin",
        path,
        method,
        ip,
        userAgent,
        timestamp,
        details: { origin, host, referer },
      });
      return new NextResponse("Forbidden: Invalid origin", { status: 403 });
    }
  }

  // CRITICAL: Enhanced rate limiting for sensitive endpoints
  const rateLimitKey = `${ip}-${path}`;

  if (path.startsWith("/api/")) {
    // Skip rate limiting for government-entities search (datasearch page) so it never returns 429 here
    const isGovernmentEntitiesSearch =
      path.includes("government-entities") && path.includes("/search");
    if (!isGovernmentEntitiesSearch) {
      const now = Date.now();
      const isStrictEndpoint =
        (path.includes("/search") || path.includes("/admin")) &&
        !path.includes("government-entities");
      const maxRequests = isStrictEndpoint
        ? MAX_REQUESTS_PER_WINDOW_STRICT
        : MAX_REQUESTS_PER_WINDOW;

      const current = rateLimitMap.get(rateLimitKey);

      if (current) {
        if (now > current.resetTime) {
          rateLimitMap.set(rateLimitKey, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW_MS,
          });
        } else if (current.count >= maxRequests) {
          logSecurityEvent({
            type: "rate_limit",
            path,
            method,
            ip,
            userAgent,
            timestamp,
            details: { key: rateLimitKey, count: current.count, maxRequests },
          });
          return new NextResponse("Too Many Requests", { status: 429 });
        } else {
          current.count++;
        }
      } else {
        rateLimitMap.set(rateLimitKey, {
          count: 1,
          resetTime: now + RATE_LIMIT_WINDOW_MS,
        });
      }
    }
  }

  // CRITICAL: Enhanced session validation for protected routes
  const protectedRoutes = ["/dashboard", "/managers", "/datasearch"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );

  if (isProtectedRoute) {
    try {
      // Type-safe workaround: NextRequest is compatible with getToken at runtime
      // The type error is due to duplicate Next.js type definitions in monorepo
      // Using double assertion via 'unknown' is type-safe per TypeScript's recommendation
      type GetTokenRequest = Parameters<typeof getToken>[0]["req"];
      const token = await getToken({
        req: request as unknown as GetTokenRequest,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        logSecurityEvent({
          type: "unauthorized_access",
          path,
          method,
          ip,
          userAgent,
          timestamp,
          details: { reason: "no_token" },
        });
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // CRITICAL: Validate token integrity
      if (!token.sub || !token.email) {
        logSecurityEvent({
          type: "invalid_token",
          path,
          method,
          ip,
          userAgent,
          timestamp,
          details: {
            reason: "invalid_structure",
            tokenKeys: Object.keys(token),
          },
        });
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    } catch (error) {
      logSecurityEvent({
        type: "invalid_token",
        path,
        method,
        ip,
        userAgent,
        timestamp,
        details: {
          reason: "validation_error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Get the response
  const response = NextResponse.next();

  // Enhanced Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  // Permissions Policy: Allow camera/microphone for same-origin (video testimonial), unload for SDKs
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), unload=*, geolocation=()",
  );

  // Enhanced Content Security Policy
  const csp = [
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.facebook.com https://www.linkedin.com https://www.googletagmanager.com https://maps.googleapis.com https://maps.gstatic.com https://js.stripe.com https://*.firebaseio.com",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "style-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com",
    "media-src 'self' blob: https://storage.googleapis.com",
    "frame-src 'self' https://accounts.google.com https://www.facebook.com https://www.linkedin.com https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Prevent access to sensitive files
  const sensitivePaths = [
    ".env",
    "package.json",
    "node_modules",
    ".git",
    "prisma/schema.prisma",
    "proxy.ts",
    "middleware.ts",
    "authOptions.ts",
    ".next",
    "dist",
    "build",
    "coverage",
    "logs",
  ];

  if (sensitivePaths.some((sensitivePath) => path.includes(sensitivePath))) {
    logSecurityEvent({
      type: "sensitive_file_access",
      path,
      method,
      ip,
      userAgent,
      timestamp,
      details: { attemptedPath: path },
    });
    return new NextResponse("Not Found", { status: 404 });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
