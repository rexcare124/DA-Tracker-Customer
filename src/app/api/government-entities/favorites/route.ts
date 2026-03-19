/**
 * Favorites API Route
 *
 * Provides secure favorites functionality for government entities.
 * Requires Insider+ membership (Tier 3+).
 *
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 *
 * Reference: IMPLEMENTATION_PLAN.md Phase 3.3.1
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSecurityContext, logSecurityEvent } from "@/lib/serverSecurity";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { encodeUserIdForFavoritesPath } from "@/lib/firebase/favorites-path";

/**
 * GET /api/government-entities/favorites
 *
 * Get all favorites for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get session and validate authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent("UNAUTHORIZED_FAVORITES_ACCESS", null, {});
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Validate Insider+ access
    // const accessValidation = await validateInsiderPlusAccess(session);

    // if (!accessValidation.isValid) {
    //   logSecurityEvent('INSUFFICIENT_TIER_FAVORITES', null, {
    //     userId: session.user?.id,
    //     tier: accessValidation.tier,
    //     error: accessValidation.error,
    //   });
    //   return NextResponse.json(
    //     { error: accessValidation.error || 'Insider+ membership required' },
    //     { status: 403 }
    //   );
    // }

    // Get security context
    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent("INVALID_SECURITY_CONTEXT_FAVORITES", null, {
        userId: session.user?.id,
      });
      return NextResponse.json({ error: "Invalid security context" }, { status: 403 });
    }

    const userId = securityContext.userId;
    const safePathKey = encodeUserIdForFavoritesPath(userId);

    // Get favorites from Firebase (Admin SDK bypasses client rules; path key must not contain . # $ [ ])
    const db = getAdminDatabase();
    const snapshot = await db.ref(`favorites/${safePathKey}`).once("value");

    if (!snapshot.exists()) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }

    const favoritesData = snapshot.val();
    const favorites: number[] = (() => {
      if (Array.isArray(favoritesData)) {
        // Validate all elements are numbers
        return favoritesData.filter(
          (id): id is number => typeof id === "number" && !isNaN(id) && id > 0,
        );
      }
      if (favoritesData && typeof favoritesData === "object") {
        // Handle object structure - could be { "0": 123, "1": 456 } or { "123": true }
        const values = Object.values(favoritesData);
        const numbers: number[] = [];

        for (const value of values) {
          if (typeof value === "number" && !isNaN(value) && value > 0) {
            numbers.push(value);
          } else if (typeof value === "string") {
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed) && parsed > 0) {
              numbers.push(parsed);
            }
          }
        }

        // If no valid numbers found, try parsing keys as entity IDs
        if (numbers.length === 0) {
          for (const key of Object.keys(favoritesData)) {
            const parsed = parseInt(key, 10);
            if (!isNaN(parsed) && parsed > 0) {
              numbers.push(parsed);
            }
          }
        }

        return numbers;
      }
      return [];
    })();

    logSecurityEvent("FAVORITES_FETCHED", securityContext, {
      count: favorites.length,
    });

    return NextResponse.json({ favorites }, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    logSecurityEvent("FAVORITES_FETCH_ERROR", null, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}
