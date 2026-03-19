import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSecurityContext, hasPermission, logSecurityEvent } from '@/lib/serverSecurity';

/**
 * Government Entities Statistics API Route
 * 
 * Provides secure access to government entity statistics and analytics
 * with comprehensive validation, authorization, and security logging.
 * 
 * Features:
 * - Role-based access control
 * - Statistical data aggregation
 * - Security logging and audit trails
 * - Error handling and proper HTTP status codes
 * - Support for various statistical queries
 */
export async function GET(request: NextRequest) {
  try {
    // Get session and validate authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      logSecurityEvent('UNAUTHORIZED_STATS_ATTEMPT', null, {});
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get security context
    const securityContext = await getSecurityContext(session);
    
    if (!securityContext) {
      logSecurityEvent('INVALID_SECURITY_CONTEXT_STATS', null, { userId: session.user?.id });
      return NextResponse.json(
        { error: 'Invalid security context' },
        { status: 403 }
      );
    }

    // Check permission to view statistics
    if (!hasPermission(securityContext, 'canViewStatistics')) {
      logSecurityEvent('INSUFFICIENT_STATS_PERMISSIONS', securityContext, {});
      return NextResponse.json(
        { error: 'Insufficient permissions to view statistics' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const statsType = searchParams.get('type') || 'overview';
    const dateRange = searchParams.get('dateRange');
    const location = searchParams.get('location');
    const entityType = searchParams.get('entityType');

    // Validate stats type
    const validStatsTypes = ['overview', 'geographic', 'temporal', 'entity-types', 'population'];
    if (!validStatsTypes.includes(statsType)) {
      logSecurityEvent('INVALID_STATS_TYPE', securityContext, { statsType });
      return NextResponse.json(
        { error: 'Invalid statistics type' },
        { status: 400 }
      );
    }

    // Log stats request
    logSecurityEvent('STATS_REQUEST', securityContext, { 
      statsType,
      dateRange,
      location,
      entityType 
    });

    // Build backend request parameters
    const backendParams = new URLSearchParams();
    backendParams.append('type', statsType);
    backendParams.append('userId', securityContext.userId);
    backendParams.append('userRole', securityContext.userRole);
    
    if (dateRange) backendParams.append('dateRange', dateRange);
    if (location) backendParams.append('location', location);
    if (entityType) backendParams.append('entityType', entityType);

    // Make request to backend API
    const backendUrl = `${process.env.BACKEND_URL}/api/government-entities/stats?${backendParams.toString()}`;
    
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
      const errorText = await backendResponse.text();
      logSecurityEvent('BACKEND_STATS_ERROR', securityContext, { 
        status: backendResponse.status,
        error: errorText 
      });
      
      return NextResponse.json(
        { error: 'Backend statistics request failed' },
        { status: backendResponse.status }
      );
    }

    const statsData = await backendResponse.json();

    // Validate response structure
    if (!statsData || typeof statsData !== 'object') {
      logSecurityEvent('INVALID_STATS_RESPONSE', securityContext, { 
        response: statsData 
      });
      return NextResponse.json(
        { error: 'Invalid statistics response from backend' },
        { status: 500 }
      );
    }

    // Log successful stats request
    logSecurityEvent('STATS_SUCCESS', securityContext, { 
      statsType,
      dataKeys: Object.keys(statsData) 
    });

    // Return statistics data
    return NextResponse.json(statsData, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=600', // Cache for 10 minutes
        'X-Stats-Type': statsType,
        'X-Data-Generated': new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Stats API error:', error);
    
    // Log error
    logSecurityEvent('STATS_API_ERROR', null, { 
      error: error instanceof Error ? error.message : String(error) 
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST method for complex statistical queries
 * Allows for more complex statistical analysis requests
 */
export async function POST(request: NextRequest) {
  try {
    // Get session and validate authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      logSecurityEvent('UNAUTHORIZED_POST_STATS_ATTEMPT', null, {});
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get security context
    const securityContext = await getSecurityContext(session);
    
    if (!securityContext) {
      logSecurityEvent('INVALID_SECURITY_CONTEXT_POST_STATS', null, { userId: session.user?.id });
      return NextResponse.json(
        { error: 'Invalid security context' },
        { status: 403 }
      );
    }

    // Check permission to view statistics
    if (!hasPermission(securityContext, 'canViewStatistics')) {
      logSecurityEvent('INSUFFICIENT_POST_STATS_PERMISSIONS', securityContext, {});
      return NextResponse.json(
        { error: 'Insufficient permissions to view statistics' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request body structure
    if (!body || typeof body !== 'object') {
      logSecurityEvent('INVALID_STATS_REQUEST_BODY', securityContext, { body });
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { 
      statsType, 
      filters, 
      aggregations, 
      groupBy, 
      dateRange,
      customMetrics 
    } = body;

    // Validate stats type
    const validStatsTypes = ['overview', 'geographic', 'temporal', 'entity-types', 'population', 'custom'];
    if (!statsType || !validStatsTypes.includes(statsType)) {
      logSecurityEvent('INVALID_POST_STATS_TYPE', securityContext, { statsType });
      return NextResponse.json(
        { error: 'Invalid statistics type' },
        { status: 400 }
      );
    }

    // Log complex stats request
    logSecurityEvent('POST_STATS_REQUEST', securityContext, { 
      statsType,
      filters,
      aggregations,
      groupBy,
      dateRange,
      hasCustomMetrics: !!customMetrics 
    });

    // Build request payload
    const requestPayload = {
      statsType,
      filters: filters || {},
      aggregations: aggregations || [],
      groupBy: groupBy || [],
      dateRange: dateRange || null,
      customMetrics: customMetrics || null,
      userId: securityContext.userId,
      userRole: securityContext.userRole,
    };

    // Make request to backend API
    const backendUrl = `${process.env.BACKEND_URL}/api/government-entities/stats`;
    
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN}`,
        'X-User-ID': securityContext.userId,
        'X-User-Role': securityContext.userRole,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      logSecurityEvent('BACKEND_POST_STATS_ERROR', securityContext, { 
        status: backendResponse.status,
        error: errorText 
      });
      
      return NextResponse.json(
        { error: 'Backend statistics request failed' },
        { status: backendResponse.status }
      );
    }

    const statsData = await backendResponse.json();

    // Log successful complex stats request
    logSecurityEvent('POST_STATS_SUCCESS', securityContext, { 
      statsType,
      dataKeys: Object.keys(statsData),
      resultCount: statsData.results?.length || 0 
    });

    // Return statistics data
    return NextResponse.json(statsData, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=300', // Cache for 5 minutes (shorter for complex queries)
        'X-Stats-Type': statsType,
        'X-Data-Generated': new Date().toISOString(),
        'X-Query-Complexity': 'high',
      },
    });

  } catch (error) {
    console.error('POST Stats API error:', error);
    
    // Log error
    logSecurityEvent('POST_STATS_API_ERROR', null, { 
      error: error instanceof Error ? error.message : String(error) 
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
