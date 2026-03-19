// RBCA Registration Statistics API Route - Admin analytics and reporting
import { NextRequest, NextResponse } from 'next/server';
import { rbcaFirebaseService } from '@/lib/firebase/rbca-service';
import { verifyUserToken, isUserAdmin } from '@/lib/firebase/admin';
import { getRegistrationStats, filterRegistrations } from '@/lib/firebase/rbca-utils';
import type { RBCAStatus } from '@/lib/firebase/index';

// GET /api/rbca/stats - Get registration statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status') as RBCAStatus | null;

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const tokenResult = await verifyUserToken(token);

    if (!tokenResult.success) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Verify admin access
    const isAdmin = await isUserAdmin(tokenResult.uid);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all registrations
    const result = await rbcaFirebaseService.getAllRegistrations(token);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    let registrations = result.data;

    // Apply date filters if provided
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      registrations = registrations.filter(reg => 
        new Date(reg.submittedAt) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      registrations = registrations.filter(reg => 
        new Date(reg.submittedAt) <= toDate
      );
    }

    // Apply status filter if provided
    if (status) {
      registrations = filterRegistrations(registrations, { status });
    }

    // Calculate statistics
    const stats = getRegistrationStats(registrations);

    // Additional analytics
    const monthlyStats = getMonthlyStats(registrations);
    const businessTypeStats = getBusinessTypeStats(registrations);
    const certificationStats = getCertificationStats(registrations);

    return NextResponse.json({
      success: true,
      data: {
        overview: stats,
        monthly: monthlyStats,
        businessTypes: businessTypeStats,
        certifications: certificationStats,
        dateRange: {
          from: dateFrom,
          to: dateTo,
        },
        totalRecords: registrations.length,
      },
    });
  } catch (error) {
    console.error('GET /api/rbca/stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate monthly statistics
function getMonthlyStats(registrations: any[]) {
  const monthlyData: Record<string, number> = {};
  
  registrations.forEach(reg => {
    const date = new Date(reg.submittedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  });

  return Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Helper function to calculate business type statistics
function getBusinessTypeStats(registrations: any[]) {
  const businessTypeData: Record<string, number> = {};
  
  registrations.forEach(reg => {
    const type = reg.businessType || 'Unknown';
    businessTypeData[type] = (businessTypeData[type] || 0) + 1;
  });

  return Object.entries(businessTypeData)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

// Helper function to calculate certification statistics
function getCertificationStats(registrations: any[]) {
  const certificationData: Record<string, number> = {};
  
  registrations.forEach(reg => {
    if (reg.certificationTypes && Array.isArray(reg.certificationTypes)) {
      reg.certificationTypes.forEach((cert: string) => {
        certificationData[cert] = (certificationData[cert] || 0) + 1;
      });
    }
  });

  return Object.entries(certificationData)
    .map(([certification, count]) => ({ certification, count }))
    .sort((a, b) => b.count - a.count);
}
