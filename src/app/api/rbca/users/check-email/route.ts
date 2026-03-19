import { NextRequest, NextResponse } from "next/server";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { createRateLimiter, RATE_LIMITS } from "@/lib/rateLimit";
import { getClientIdentifier } from "@/lib/getClientIP";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email format")
  .transform((email) => email.toLowerCase());

function isActiveRbcaUserRecord(record: any): boolean {
  if (!record || typeof record !== "object") return false;

  // New abbreviated schema: "active" means onboarding complete
  if (record.pin) {
    return record.onc === true;
  }

  // Legacy schema fallback
  return record.onboardingComplete === true || Boolean(record.emailVerified);
}

export async function GET(request: NextRequest) {
  try {
    const rateLimiter = createRateLimiter(RATE_LIMITS.API);
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimiter(clientId);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many email check requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMITS.API.maxRequests.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get("email");
    const excludeUserId = searchParams.get("excludeUserId");

    if (!rawEmail) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    const parsed = emailSchema.safeParse(rawEmail);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email format", details: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const email = parsed.data;
    const database = getAdminDatabase();

    if (!database) {
      return NextResponse.json(
        { error: "Database service unavailable", exists: false, fallback: true },
        { status: 503 }
      );
    }

    // Primary: new abbreviated schema
    let snapshot = await database
      .ref("rbca_users")
      .orderByChild("pin/eml")
      .equalTo(email)
      .once("value");

    // Fallback: legacy schema
    if (!snapshot.exists()) {
      snapshot = await database
        .ref("rbca_users")
        .orderByChild("email")
        .equalTo(email)
        .once("value");
    }

    if (!snapshot.exists()) {
      return NextResponse.json(
        { exists: false, email },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const matches = snapshot.val() as Record<string, any>;
    const entries = Object.entries(matches);

    const activeMatch = entries.find(([userId, record]) => {
      if (excludeUserId && userId === excludeUserId) return false;
      return isActiveRbcaUserRecord(record);
    });

    const exists = Boolean(activeMatch);

    return NextResponse.json(
      { exists, existingEmail: exists ? email : undefined, email },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error checking RBCA email availability:", error);
    return NextResponse.json(
      { error: "Failed to check email availability", exists: false, fallback: true },
      { status: 500 }
    );
  }
}


