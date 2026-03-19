// RBCA Registration Export API Route - CSV export functionality for admin
import { NextRequest, NextResponse } from 'next/server';
import { rbcaFirebaseService } from '@/lib/firebase/rbca-service';
import { verifyUserToken, isUserAdmin } from '@/lib/firebase/admin';
import { exportRegistrationsToCSV, filterRegistrations } from '@/lib/firebase/rbca-utils';
import type { RBCAStatus } from '@/lib/firebase/index';

// GET /api/rbca/export - Export registrations as CSV (Admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as RBCAStatus | null;
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const womanOwned = searchParams.get('womanOwned') === 'true';
    const veteranOwned = searchParams.get('veteranOwned') === 'true';
    const minorityOwned = searchParams.get('minorityOwned') === 'true';
    const hubzoneEligible = searchParams.get('hubzoneEligible') === 'true';
    const searchTerm = searchParams.get('search');

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

    // Apply filters
    const filters: any = {};
    if (status) filters.status = status;
    if (searchParams.has('womanOwned')) filters.womanOwned = womanOwned;
    if (searchParams.has('veteranOwned')) filters.veteranOwned = veteranOwned;
    if (searchParams.has('minorityOwned')) filters.minorityOwned = minorityOwned;
    if (searchParams.has('hubzoneEligible')) filters.hubzoneEligible = hubzoneEligible;
    if (searchTerm) filters.searchTerm = searchTerm;

    if (Object.keys(filters).length > 0) {
      registrations = filterRegistrations(registrations, filters);
    }

    // Apply date filters
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

    // Generate CSV
    const csvData = exportRegistrationsToCSV(registrations);

    // Generate filename with timestamp and filters
    const timestamp = new Date().toISOString().split('T')[0];
    const filterSuffix = status ? `_${status}` : '';
    const filename = `rbca_registrations_${timestamp}${filterSuffix}.csv`;

    // Return CSV response
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('GET /api/rbca/export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
