import { NextRequest, NextResponse } from "next/server";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { createRateLimiter, RATE_LIMITS } from "@/lib/rateLimit";
import { getClientIdentifier } from "@/lib/getClientIP";
import { z } from "zod";

// No in-memory cache - always check Firebase directly to prevent stale "available" results

// Username validation schema - preserve original case for Firebase queries
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
  .transform((username) => username.trim()); // Remove toLowerCase() to preserve case

// Reserved usernames that should not be allowed
const RESERVED_USERNAMES = new Set([
  "admin", "administrator", "root", "system", "support", "help", "info", "contact",
  "user", "users", "guest", "anonymous", "test", "testing", "demo", "example",
  "api", "api-docs", "docs", "documentation", "blog", "news", "forum", "community",
  "login", "logout", "signin", "signup", "register", "registration", "account",
  "profile", "settings", "preferences", "dashboard", "home", "index", "main",
  "about", "contact", "privacy", "terms", "legal", "support", "help", "faq"
]);

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimiter = createRateLimiter(RATE_LIMITS.API);
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimiter(clientId);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many username check requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.API.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawUsername = searchParams.get("username");

    if (!rawUsername) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Validate and sanitize username with additional security checks
    const validationResult = usernameSchema.safeParse(rawUsername);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid username format",
          details: validationResult.error.errors[0]?.message || "Username format is invalid"
        },
        { status: 400 }
      );
    }

    const username = validationResult.data;
    
    // Additional security: prevent SQL injection patterns and XSS
    if (username.includes('--') || username.includes('<') || username.includes('>')) {
      return NextResponse.json(
        { error: "Invalid characters in username" },
        { status: 400 }
      );
    }

    // Check if username is reserved (case-insensitive)
    if (RESERVED_USERNAMES.has(username.toLowerCase())) {
      return NextResponse.json({
        available: false,
        username: username,
        reserved: true
      });
    }

    // Check Firebase dedicated username index (rbca_usernames/<usernameLower>)
    const firebaseDatabase = getAdminDatabase();
    
    if (!firebaseDatabase) {
      console.error('Firebase database not available for username check');
      return NextResponse.json(
        { 
          error: "Database service unavailable",
          available: false,
          fallback: true
        },
        { status: 503 }
      );
    }

    const usernameLower = username.toLowerCase();
    let available = false;
    
    try {
      // Check dedicated username index - direct lookup (no scanning, no ambiguity)
      const usernameRef = firebaseDatabase.ref(`rbca_usernames/${usernameLower}`);
      const usernameSnapshot = await usernameRef.once('value');
      
      available = !usernameSnapshot.exists();
      
      // Production-safe logging (no sensitive data)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEBUG] Username check for "${username}" (index key: "${usernameLower}"): available=${available}`);
      }
    } catch (firebaseError) {
      console.error('Firebase query failed during username check:', firebaseError);
      
      // Safe default: assume username is unavailable to prevent conflicts
      return NextResponse.json(
        { 
          error: "Username availability service temporarily unavailable",
          available: false,
          fallback: true,
          username: username
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      available,
      username: username,
      cached: false
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    });

  } catch (error) {
    console.error("Error checking username availability:", error);
    
    // Return a safe fallback response
    return NextResponse.json(
      { 
        error: "Failed to check username availability",
        available: false, // Safe default - assume unavailable
        fallback: true
      },
      { status: 500 }
    );
  }
} 