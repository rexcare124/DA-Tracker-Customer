// RBCA Registration API Routes - Firebase integration for RBCA registrations
import { NextRequest, NextResponse } from 'next/server';
import { rbcaFirebaseService } from '@/lib/firebase/rbca-service';
import { verifyUserToken, isUserAdmin } from '@/lib/firebase/admin';
import type { CreateRBCARegistration, RBCAStatus } from '@/lib/firebase/index';

// GET /api/rbca/registrations - Get registrations (user's own or all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') as RBCAStatus | null;
    const adminView = searchParams.get('adminView') === 'true';

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

    // Admin view - get all registrations with optional status filter
    if (adminView) {
      const isAdmin = await isUserAdmin(tokenResult.uid);
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }

      const result = await rbcaFirebaseService.getAllRegistrations(token, status || undefined);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data,
          total: result.data.length,
        });
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
    }

    // User view - get specific user's registrations
    const targetUserId = userId || tokenResult.uid;
    
    // Ensure user can only access their own registrations unless admin
    if (targetUserId !== tokenResult.uid) {
      const isAdmin = await isUserAdmin(tokenResult.uid);
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    const result = await rbcaFirebaseService.getUserRegistrations(targetUserId, token);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        total: result.data.length,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: result.code === 'NOT_FOUND' ? 404 : 500 }
      );
    }
  } catch (error) {
    console.error('GET /api/rbca/registrations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rbca/registrations - Create new registration
export async function POST(request: NextRequest) {
  try {
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

    // Parse request body
    let registrationData: CreateRBCARegistration;
    try {
      registrationData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Ensure userId matches authenticated user
    if (registrationData.userId !== tokenResult.uid) {
      return NextResponse.json(
        { error: 'Cannot create registration for another user' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!registrationData.email || !registrationData.businessName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, businessName' },
        { status: 400 }
      );
    }

    const result = await rbcaFirebaseService.createRegistration(registrationData, token);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Registration created successfully',
      }, { status: 201 });
    } else {
      const statusCode = result.code === 'VALIDATION_ERROR' ? 400 : 500;
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: statusCode }
      );
    }
  } catch (error) {
    console.error('POST /api/rbca/registrations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
