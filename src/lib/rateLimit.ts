// Rate limiting utility for API endpoints
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    lastAccess: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

// Cache for rate limit results to reduce computation
const rateLimitCache = new Map<string, { allowed: boolean; remaining: number; resetTime: number; cachedAt: number }>();
const CACHE_TTL = 1000; // 1 second cache

export function createRateLimiter(config: RateLimitConfig) {
  return function rateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    
    // Check cache first for recent results
    const cached = rateLimitCache.get(key);
    if (cached && (now - cached.cachedAt) < CACHE_TTL) {
      return {
        allowed: cached.allowed,
        remaining: cached.remaining,
        resetTime: cached.resetTime
      };
    }
    
    // Clean up expired entries (only if cache is getting large)
    if (Object.keys(store).length > 1000) {
      for (const storeKey in store) {
        if (store[storeKey].resetTime <= now) {
          delete store[storeKey];
        }
      }
    }
    
    // Initialize or get existing entry
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + config.windowMs,
        lastAccess: now
      };
    }
    
    // Check if request is allowed
    if (store[key].count >= config.maxRequests) {
      const result = {
        allowed: false,
        remaining: 0,
        resetTime: store[key].resetTime,
      };
      
      // Cache the result
      rateLimitCache.set(key, { ...result, cachedAt: now });
      return result;
    }
    
    // Increment count
    store[key].count++;
    store[key].lastAccess = now;
    
    const result = {
      allowed: true,
      remaining: config.maxRequests - store[key].count,
      resetTime: store[key].resetTime,
    };
    
    // Cache the result
    rateLimitCache.set(key, { ...result, cachedAt: now });
    
    return result;
  };
}

import { RATE_LIMIT_CONFIG } from './emailVerificationConfig';

// Default rate limit configurations
export const RATE_LIMITS = {
  REGISTRATION: {
    windowMs: RATE_LIMIT_CONFIG.REGISTRATION.WINDOW_MS,
    maxRequests: RATE_LIMIT_CONFIG.REGISTRATION.MAX_REQUESTS,
  },
  AUTH: {
    windowMs: RATE_LIMIT_CONFIG.AUTH.WINDOW_MS,
    maxRequests: RATE_LIMIT_CONFIG.AUTH.MAX_REQUESTS,
  },
  OAUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 OAuth attempts per 15 minutes per provider
  },
  EMAIL_VERIFICATION: {
    windowMs: RATE_LIMIT_CONFIG.EMAIL_VERIFICATION.WINDOW_MS,
    maxRequests: RATE_LIMIT_CONFIG.EMAIL_VERIFICATION.MAX_REQUESTS,
  },
  EMAIL_VERIFICATION_ATTEMPTS: {
    windowMs: RATE_LIMIT_CONFIG.EMAIL_VERIFICATION_ATTEMPTS.WINDOW_MS,
    maxRequests: RATE_LIMIT_CONFIG.EMAIL_VERIFICATION_ATTEMPTS.MAX_REQUESTS,
  },
  API: {
    windowMs: RATE_LIMIT_CONFIG.API.WINDOW_MS,
    maxRequests: RATE_LIMIT_CONFIG.API.MAX_REQUESTS,
  },
} as const; 