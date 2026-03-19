import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';

/**
 * Security utilities for government data analytics platform
 * 
 * Features:
 * - User permission validation
 * - Role-based access control
 * - Input sanitization
 * - Rate limiting helpers
 * - Security logging
 */

export interface UserPermissions {
  canViewGovernmentData: boolean;
  canSearchEntities: boolean;
  canViewEntityDetails: boolean;
  canExportData: boolean;
  canManageEntities: boolean;
  canViewAnalytics: boolean;
  canAccessAdminPanel: boolean;
}

export interface SecurityContext {
  userId: string;
  userRole: 'user' | 'analyst' | 'manager' | 'admin';
  permissions: UserPermissions;
  sessionValid: boolean;
}

/**
 * Get user permissions based on role
 */
export function getUserPermissions(role: string): UserPermissions {
  const basePermissions: UserPermissions = {
    canViewGovernmentData: false,
    canSearchEntities: false,
    canViewEntityDetails: false,
    canExportData: false,
    canManageEntities: false,
    canViewAnalytics: false,
    canAccessAdminPanel: false,
  };

  switch (role) {
    case 'admin':
      return {
        ...basePermissions,
        canViewGovernmentData: true,
        canSearchEntities: true,
        canViewEntityDetails: true,
        canExportData: true,
        canManageEntities: true,
        canViewAnalytics: true,
        canAccessAdminPanel: true,
      };
    
    case 'manager':
      return {
        ...basePermissions,
        canViewGovernmentData: true,
        canSearchEntities: true,
        canViewEntityDetails: true,
        canExportData: true,
        canManageEntities: true,
        canViewAnalytics: true,
        canAccessAdminPanel: false,
      };
    
    case 'analyst':
      return {
        ...basePermissions,
        canViewGovernmentData: true,
        canSearchEntities: true,
        canViewEntityDetails: true,
        canExportData: true,
        canManageEntities: false,
        canViewAnalytics: true,
        canAccessAdminPanel: false,
      };
    
    case 'user':
      return {
        ...basePermissions,
        canViewGovernmentData: true,
        canSearchEntities: true,
        canViewEntityDetails: true,
        canExportData: false,
        canManageEntities: false,
        canViewAnalytics: false,
        canAccessAdminPanel: false,
      };
    
    default:
      return basePermissions;
  }
}

/**
 * Validate user session and get security context
 */
export async function getSecurityContext(request?: NextRequest): Promise<SecurityContext | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return null;
    }

    const userRole = (session.user as any).role || 'user';
    const permissions = getUserPermissions(userRole);

    return {
      userId: session.user.id || session.user.email || 'unknown',
      userRole: userRole as 'user' | 'analyst' | 'manager' | 'admin',
      permissions,
      sessionValid: true,
    };
  } catch (error) {
    console.error('Error getting security context:', error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(
  context: SecurityContext | null,
  permission: keyof UserPermissions
): boolean {
  if (!context || !context.sessionValid) {
    return false;
  }
  
  return context.permissions[permission];
}

/**
 * Validate government entity access
 */
export function canAccessEntity(
  context: SecurityContext | null,
  entity: any
): boolean {
  if (!context || !context.sessionValid) {
    return false;
  }

  // Basic permission check
  if (!context.permissions.canViewEntityDetails) {
    return false;
  }

  // Role-based access for sensitive entities
  if (entity.isSensitive && context.userRole === 'user') {
    return false;
  }

  // Admin can access everything
  if (context.userRole === 'admin') {
    return true;
  }

  // Manager can access most entities
  if (context.userRole === 'manager') {
    return true;
  }

  // Analyst can access non-sensitive entities
  if (context.userRole === 'analyst') {
    return !entity.isSensitive;
  }

  // User can access basic entities only
  return !entity.isSensitive && !entity.isRestricted;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Validate search parameters
 */
export function validateSearchParams(params: any): boolean {
  try {
    // Check for required fields
    if (!params || typeof params !== 'object') {
      return false;
    }

    // Validate string fields
    const stringFields = ['searchQuery', 'location', 'entityType', 'sortBy', 'sortOrder'];
    for (const field of stringFields) {
      if (params[field] && typeof params[field] !== 'string') {
        return false;
      }
      if (params[field]) {
        params[field] = sanitizeInput(params[field]);
      }
    }

    // Validate array fields
    if (params.governmentLevels && !Array.isArray(params.governmentLevels)) {
      return false;
    }

    // Validate numeric fields
    const numericFields = ['page', 'limit', 'radiusKm', 'populationMin', 'populationMax'];
    for (const field of numericFields) {
      if (params[field] !== undefined && params[field] !== null) {
        const num = Number(params[field]);
        if (isNaN(num) || num < 0) {
          return false;
        }
        params[field] = num;
      }
    }

    // Validate boolean fields
    const booleanFields = ['hasBusinessLicenses', 'hasReviews', 'isActive', 'useRadiusSearch'];
    for (const field of booleanFields) {
      if (params[field] !== undefined && params[field] !== null) {
        params[field] = Boolean(params[field]);
      }
    }

    // Validate coordinate fields
    if (params.latitude !== undefined && params.longitude !== undefined) {
      const lat = Number(params.latitude);
      const lng = Number(params.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        return false;
      }
      
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return false;
      }
      
      params.coordinates = [lng, lat];
    }

    // Validate date fields
    if (params.dateFrom) {
      const date = new Date(params.dateFrom);
      if (isNaN(date.getTime())) {
        return false;
      }
    }
    
    if (params.dateTo) {
      const date = new Date(params.dateTo);
      if (isNaN(date.getTime())) {
        return false;
      }
    }

    // Validate pagination limits
    if (params.limit && (params.limit < 1 || params.limit > 100)) {
      params.limit = 20;
    }
    
    if (params.page && params.page < 1) {
      params.page = 1;
    }

    // Validate radius limits
    if (params.radiusKm && (params.radiusKm < 1 || params.radiusKm > 100)) {
      params.radiusKm = 10;
    }

    return true;
  } catch (error) {
    console.error('Error validating search parameters:', error);
    return false;
  }
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: string,
  context: SecurityContext | null,
  details?: any
): void {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId: context?.userId || 'anonymous',
      userRole: context?.userRole || 'unknown',
      details: details || {},
    };

    console.log('SECURITY_EVENT:', JSON.stringify(logEntry));
    
    // TODO: Send to security monitoring service
    // await sendToSecurityService(logEntry);
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Create rate limiter instance
 */
export const searchRateLimiter = new RateLimiter(15 * 60 * 1000, 50); // 50 requests per 15 minutes
export const apiRateLimiter = new RateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
