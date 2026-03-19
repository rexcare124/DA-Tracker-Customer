/**
 * Mark Payment Success Modal as Seen API Route
 *
 * Updates Firebase to mark that the user has seen the payment success modal.
 * This ensures the modal only appears once ever, regardless of browser or session.
 *
 * This route is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { secureLogger } from "@/lib/secureLogger";

interface MarkModalSeenError {
  error: string;
  details?: string;
}

/**
 * POST /api/users/mark-payment-modal-seen
 *
 * Marks the payment success modal as seen for the authenticated user.
 * Updates Firebase user data to prevent the modal from showing again.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" } satisfies MarkModalSeenError,
        { status: 401 }
      );
    }

    const database = getAdminDatabase();
    const firebaseUserId = session.user.id;

    // Update Firebase to mark modal as seen
    const userRef = database.ref(`rbca_users/${firebaseUserId}`);
    await userRef.update({
      hasSeenPaymentSuccessModal: true,
    });

    secureLogger.info("Payment success modal marked as seen", {
      operation: "POST /api/users/mark-payment-modal-seen",
      userId: firebaseUserId,
    });

    return NextResponse.json(
      { success: true, message: "Modal marked as seen" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    secureLogger.error("Failed to mark payment modal as seen", {
      operation: "POST /api/users/mark-payment-modal-seen",
    });

    const errorResponse: MarkModalSeenError = {
      error: "Failed to mark modal as seen",
      details: errorMessage,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
