// RBCA API Middleware - Common middleware functions for RBCA routes
import { NextRequest } from 'next/server';
import { verifyUserToken, isUserAdmin } from '@/lib/firebase/admin';

// Authentication middleware result
export interface AuthResult {
  success: true;
  uid: string;
  email: string | undefined;
  isAdmin: boolean;
}

export interface AuthError {
  success: false;
  error: string;
  status: number;
}

export type AuthMiddlewareResult = AuthResult | AuthError;

/**
 * Authenticate and authorize user from request
 */
export async function authenticateUser(
  request: NextRequest,
  requireAdmin = false
): Promise<AuthMiddlewareResult> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Authorization header required',
        status: 401,
      };
    }

    const token = authHeader.substring(7);
    const tokenResult = await verifyUserToken(token);

    if (!tokenResult.success) {
      return {
        success: false,
        error: 'Invalid or expired token',
        status: 401,
      };
    }

    // Check admin status
    const isAdmin = await isUserAdmin(tokenResult.uid);

    if (requireAdmin && !isAdmin) {
      return {
        success: false,
        error: 'Admin access required',
        status: 403,
      };
    }

    return {
      success: true,
      uid: tokenResult.uid,
      email: tokenResult.email,
      isAdmin,
    };
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500,
    };
  }
}

/**
 * Validate request body JSON
 */
export async function validateRequestBody<T>(request: NextRequest): Promise<{
  success: boolean;
  data?: T;
  error?: string;
}> {
  try {
    const data = await request.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON in request body',
    };
  }
}

/**
 * Rate limiting middleware (simple implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 60000 // 1 minute
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(identifier);

  if (!current || current.resetTime < windowStart) {
    // New window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: maxRequests - current.count };
}

/**
 * CORS headers for RBCA API routes
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL || '*'
    : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Handle OPTIONS requests for CORS
 */
export function handleCORS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
