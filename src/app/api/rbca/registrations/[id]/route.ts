// RBCA Registration API Routes - Individual registration operations
import { NextRequest, NextResponse } from "next/server";
import { rbcaFirebaseService } from "@/lib/firebase/rbca-service";
import { verifyUserToken, isUserAdmin } from "@/lib/firebase/admin";
import type { UpdateRBCARegistration } from "@/lib/firebase/index";

// GET /api/rbca/registrations/[id] - Get specific registration
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: registrationId } = await params;

  try {
    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const tokenResult = await verifyUserToken(token);

    if (!tokenResult.success) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const result = await rbcaFirebaseService.getRegistration(registrationId, token);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      const statusCode =
        result.code === "NOT_FOUND" ? 404 : result.code === "AUTHORIZATION_ERROR" ? 403 : 500;
      return NextResponse.json({ error: result.error, code: result.code }, { status: statusCode });
    }
  } catch (error) {
    console.error(`GET /api/rbca/registrations/${registrationId} error:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/rbca/registrations/[id] - Update registration status (Admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: registrationId } = await params;

  try {
    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const tokenResult = await verifyUserToken(token);

    if (!tokenResult.success) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Verify admin access
    const isAdmin = await isUserAdmin(tokenResult.uid);
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Parse request body
    let updateData: UpdateRBCARegistration;
    try {
      updateData = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    // Validate update data
    if (!updateData.status && !updateData.rejectionReason) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 },
      );
    }

    const result = await rbcaFirebaseService.updateRegistrationStatus(
      registrationId,
      updateData,
      token,
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "Registration updated successfully",
      });
    } else {
      const statusCode =
        result.code === "NOT_FOUND" ? 404 : result.code === "VALIDATION_ERROR" ? 400 : 500;
      return NextResponse.json({ error: result.error, code: result.code }, { status: statusCode });
    }
  } catch (error) {
    console.error(`PATCH /api/rbca/registrations/${registrationId} error:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/rbca/registrations/[id] - Delete registration (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: registrationId } = await params;

  try {
    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const tokenResult = await verifyUserToken(token);

    if (!tokenResult.success) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Verify admin access
    const isAdmin = await isUserAdmin(tokenResult.uid);
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const result = await rbcaFirebaseService.deleteRegistration(registrationId, token);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Registration deleted successfully",
      });
    } else {
      const statusCode = result.code === "NOT_FOUND" ? 404 : 500;
      return NextResponse.json({ error: result.error, code: result.code }, { status: statusCode });
    }
  } catch (error) {
    console.error(`DELETE /api/rbca/registrations/${registrationId} error:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
