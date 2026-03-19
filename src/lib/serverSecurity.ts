import { Session } from 'next-auth';

/**
 * Server-side Security Utilities
 * 
 * Provides security context and permission checking for server-side operations
 * including API routes and server components.
 */

export interface ServerSecurityContext {
  userId: string;
  userRole: 'user' | 'analyst' | 'manager' | 'admin';
  permissions: string[];
  sessionId: string;
  timestamp: number;
}

/**
 * Get security context from server session
 */
export async function getSecurityContext(session: Session): Promise<ServerSecurityContext | null> {
  try {
    if (!session || !session.user) {
      return null;
    }

    // Extract user role from session
    const userRole = (session.user as any).role || 'user';
    const permissions = getUserPermissions(userRole);

    return {
      userId: session.user.id || session.user.email || 'unknown',
      userRole: userRole as 'user' | 'analyst' | 'manager' | 'admin',
      permissions,
      sessionId: session.user.id || 'unknown',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error getting server security context:', error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(
  securityContext: ServerSecurityContext,
  permission: string
): boolean {
  try {
    if (!securityContext || !securityContext.permissions) {
      return false;
    }

    return securityContext.permissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Get user permissions based on role
 */
function getUserPermissions(role: string): string[] {
  const rolePermissions: Record<string, string[]> = {
    user: [
      'canViewPublicData',
      'canSearchEntities',
      'canViewEntityDetails',
      'canManageSubscriptions',
    ],
    analyst: [
      'canViewPublicData',
      'canSearchEntities',
      'canViewEntityDetails',
      'canViewStatistics',
      'canExportData',
      'canViewAnalytics',
      'canManageSubscriptions',
    ],
    manager: [
      'canViewPublicData',
      'canSearchEntities',
      'canViewEntityDetails',
      'canViewStatistics',
      'canExportData',
      'canViewAnalytics',
      'canManageEntities',
      'canEditEntities',
      'canImportData',
      'canViewManagerDashboard',
      'canManageSubscriptions',
    ],
    admin: [
      'canViewPublicData',
      'canSearchEntities',
      'canViewEntityDetails',
      'canViewStatistics',
      'canExportData',
      'canViewAnalytics',
      'canManageEntities',
      'canEditEntities',
      'canDeleteEntities',
      'canImportData',
      'canViewManagerDashboard',
      'canManageUsers',
      'canViewSystemLogs',
      'canConfigureSystem',
      'canManageSubscriptions',
    ],
  };

  return rolePermissions[role] || rolePermissions.user;
}

/**
 * Validate API request security
 */
export async function validateApiRequest(
  session: Session,
  requiredPermission: string
): Promise<{ isValid: boolean; securityContext?: ServerSecurityContext; error?: string }> {
  try {
    const securityContext = await getSecurityContext(session);
    
    if (!securityContext) {
      return {
        isValid: false,
        error: 'Invalid security context'
      };
    }

    if (!hasPermission(securityContext, requiredPermission)) {
      return {
        isValid: false,
        securityContext,
        error: 'Insufficient permissions'
      };
    }

    return {
      isValid: true,
      securityContext
    };
  } catch (error) {
    console.error('Error validating API request:', error);
    return {
      isValid: false,
      error: 'Security validation failed'
    };
  }
}

/**
 * Log security event for server-side operations
 */
export async function logSecurityEvent(
  eventType: string,
  securityContext: ServerSecurityContext | null,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    const logEntry = {
      eventType,
      timestamp: new Date().toISOString(),
      userId: securityContext?.userId || 'unknown',
      userRole: securityContext?.userRole || 'unknown',
      sessionId: securityContext?.sessionId || 'unknown',
      metadata,
      source: 'server',
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', logEntry);
    }

    // TODO: Implement proper logging to database or external service
    // This could be sent to a logging service, database, or security monitoring system
    
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

/**
 * Sanitize input data for security
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Validate and sanitize search parameters
 */
export function validateSearchParams(params: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  // Define allowed parameters and their types
  const allowedParams = {
    searchQuery: 'string',
    location: 'string',
    governmentLevels: 'array',
    entityType: 'string',
    hasBusinessLicenses: 'boolean',
    hasReviews: 'boolean',
    isActive: 'boolean',
    coordinates: 'array',
    radiusKm: 'number',
    useRadiusSearch: 'boolean',
    populationRange: 'array',
    dateRange: 'array',
    page: 'number',
    limit: 'number',
    sortBy: 'string',
    sortOrder: 'string',
  };

  for (const [key, value] of Object.entries(params)) {
    if (key in allowedParams) {
      const expectedType = allowedParams[key as keyof typeof allowedParams];
      
      // Type validation
      if (expectedType === 'string' && typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (expectedType === 'number' && typeof value === 'number') {
        sanitized[key] = value;
      } else if (expectedType === 'boolean' && typeof value === 'boolean') {
        sanitized[key] = value;
      } else if (expectedType === 'array' && Array.isArray(value)) {
        sanitized[key] = value.map(sanitizeInput);
      }
    }
  }

  return sanitized;
}
