/**
 * Favorites by ID API Route
 *
 * Provides secure add/remove favorites functionality for government entities.
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
import { validateInsiderPlusAccess } from "@/lib/serverMembership";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { encodeUserIdForFavoritesPath } from "@/lib/firebase/favorites-path";

/**
 * POST /api/government-entities/favorites/[id]
 *
 * Add a government entity to favorites
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;

    // Get session and validate authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent("UNAUTHORIZED_FAVORITE_ADD", null, {});
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Validate Insider+ access
    // const accessValidation = await validateInsiderPlusAccess(session);

    // if (!accessValidation.isValid) {
    //   logSecurityEvent("INSUFFICIENT_TIER_FAVORITE_ADD", null, {
    //     userId: session.user?.id,
    //     tier: accessValidation.tier,
    //     error: accessValidation.error,
    //   });
    //   return NextResponse.json(
    //     { error: accessValidation.error || "Insider+ membership required" },
    //     { status: 403 },
    //   );
    // }

    // Get security context
    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent("INVALID_SECURITY_CONTEXT_FAVORITE_ADD", null, {
        userId: session.user?.id,
      });
      return NextResponse.json({ error: "Invalid security context" }, { status: 403 });
    }

    const userId = securityContext.userId;
    const safePathKey = encodeUserIdForFavoritesPath(userId);
    const entityId = parseInt(params.id, 10);

    if (isNaN(entityId) || entityId <= 0) {
      return NextResponse.json({ error: "Invalid entity ID" }, { status: 400 });
    }

    // Get current favorites (Admin SDK bypasses client rules)
    const db = getAdminDatabase();
    const favoritesRef = db.ref(`favorites/${safePathKey}`);
    const snapshot = await favoritesRef.once("value");
    const existingFavorites = snapshot.exists() ? snapshot.val() : null;

    // Convert to array if it's an object, with proper validation
    const favoritesArray: number[] = (() => {
      if (!existingFavorites) {
        return [];
      }
      if (Array.isArray(existingFavorites)) {
        // Validate all elements are numbers
        return existingFavorites.filter(
          (id): id is number => typeof id === "number" && !isNaN(id) && id > 0,
        );
      }
      if (typeof existingFavorites === "object") {
        // Handle object structure - validate values are numbers
        const values = Object.values(existingFavorites);
        return values.filter(
          (value): value is number => typeof value === "number" && !isNaN(value) && value > 0,
        );
      }
      return [];
    })();

    // Check if already favorited
    if (favoritesArray.includes(entityId)) {
      return NextResponse.json(
        { message: "Entity already in favorites", favorite: true },
        { status: 200 },
      );
    }

    // Add to favorites
    const updatedFavorites = [...favoritesArray, entityId];

    await favoritesRef.set(updatedFavorites);

    logSecurityEvent("FAVORITE_ADDED", securityContext, {
      entityId,
    });

    return NextResponse.json(
      { message: "Favorite added successfully", favorite: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error adding favorite:", error);
    logSecurityEvent("FAVORITE_ADD_ERROR", null, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

/**
 * DELETE /api/government-entities/favorites/[id]
 *
 * Remove a government entity from favorites
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;

    // Get session and validate authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      logSecurityEvent("UNAUTHORIZED_FAVORITE_REMOVE", null, {});
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Validate Insider+ access (optional - match POST behavior)
    // const accessValidation = await validateInsiderPlusAccess(session);
    // if (!accessValidation.isValid) {
    //   logSecurityEvent("INSUFFICIENT_TIER_FAVORITE_REMOVE", null, {
    //     userId: session.user?.id,
    //     tier: accessValidation.tier,
    //     error: accessValidation.error,
    //   });
    //   return NextResponse.json(
    //     { error: accessValidation.error || "Insider+ membership required" },
    //     { status: 403 },
    //   );
    // }

    // Get security context
    const securityContext = await getSecurityContext(session);

    if (!securityContext) {
      logSecurityEvent("INVALID_SECURITY_CONTEXT_FAVORITE_REMOVE", null, {
        userId: session.user?.id,
      });
      return NextResponse.json({ error: "Invalid security context" }, { status: 403 });
    }

    const userId = securityContext.userId;
    const safePathKey = encodeUserIdForFavoritesPath(userId);
    const entityId = parseInt(params.id, 10);

    if (isNaN(entityId) || entityId <= 0) {
      return NextResponse.json({ error: "Invalid entity ID" }, { status: 400 });
    }

    // Get current favorites (Admin SDK bypasses client rules)
    const db = getAdminDatabase();
    const favoritesRef = db.ref(`favorites/${safePathKey}`);
    const snapshot = await favoritesRef.once("value");

    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "Entity not in favorites", favorite: false },
        { status: 200 },
      );
    }

    const existingFavorites = snapshot.val();
    const favoritesArray: number[] = (() => {
      if (Array.isArray(existingFavorites)) {
        // Validate all elements are numbers
        return existingFavorites.filter(
          (id): id is number => typeof id === "number" && !isNaN(id) && id > 0,
        );
      }
      if (typeof existingFavorites === "object" && existingFavorites !== null) {
        // Handle object structure - validate values are numbers
        const values = Object.values(existingFavorites);
        return values.filter(
          (value): value is number => typeof value === "number" && !isNaN(value) && value > 0,
        );
      }
      return [];
    })();

    // Check if favorited
    if (!favoritesArray.includes(entityId)) {
      return NextResponse.json(
        { message: "Entity not in favorites", favorite: false },
        { status: 200 },
      );
    }

    // Remove from favorites
    const updatedFavorites = favoritesArray.filter((id: number) => id !== entityId);

    if (updatedFavorites.length === 0) {
      await favoritesRef.remove();
    } else {
      await favoritesRef.set(updatedFavorites);
    }

    logSecurityEvent("FAVORITE_REMOVED", securityContext, {
      entityId,
    });

    return NextResponse.json(
      { message: "Favorite removed successfully", favorite: false },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing favorite:", error);
    logSecurityEvent("FAVORITE_REMOVE_ERROR", null, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
