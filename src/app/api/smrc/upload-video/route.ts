/**
 * POST /api/smrc/upload-video
 *
 * Upload a video file to Firebase Storage and return the download URL.
 * Used to save video testimonials with the SMRC review (link stored in videoUrl).
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSecurityContext } from "@/lib/serverSecurity";
import { getAdminStorage } from "@/lib/firebase/admin";

const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
const ALLOWED_TYPES = ["video/webm", "video/mp4", "video/quicktime"];
function getExt(mime: string): string {
  if (mime === "video/mp4") return ".mp4";
  if (mime === "video/quicktime") return ".mov";
  return ".webm";
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const securityContext = await getSecurityContext(session);
    if (!securityContext) {
      return NextResponse.json({ error: "Invalid security context" }, { status: 403 });
    }

    const userId = securityContext.userId;
    const formData = await request.formData();
    const file = formData.get("video");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid file. Send a 'video' field with a video file." },
        { status: 400 },
      );
    }

    const type = (file.type || "").toLowerCase();
    const okType = ALLOWED_TYPES.some((t) => type === t || type.startsWith("video/"));
    if (!okType) {
      return NextResponse.json(
        { error: "Invalid file type. Use WebM, MP4, or MOV." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 100 MB." },
        { status: 400 },
      );
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_SMRC_BUCKET;
    if (!bucketName?.trim()) {
      console.error("SMRC upload-video: NEXT_PUBLIC_FIREBASE_STORAGE_SMRC_BUCKET is not set");
      return NextResponse.json(
        {
          error:
            "Video storage is not configured. Set NEXT_PUBLIC_FIREBASE_STORAGE_SMRC_BUCKET (e.g. your-project.appspot.com) and enable Firebase Storage.",
        },
        { status: 503 },
      );
    }

    const storage = getAdminStorage();
    const bucket = storage.bucket(bucketName.trim());
    const ext = getExt(type || "video/webm");
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    const path = `smrc-videos/${userId}/${safeName}`;
    const fileRef = bucket.file(path);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || "video/webm",
        metadata: { userId },
      },
    });

    // Signed URLs are limited to 7 days max by Google Cloud Storage
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const [signedUrl] = await fileRef.getSignedUrl({
      version: "v4",
      action: "read",
      expires: new Date(Date.now() + SEVEN_DAYS_MS),
    });

    return NextResponse.json({ videoUrl: signedUrl }, { status: 200 });
  } catch (error) {
    console.error("SMRC upload-video error:", error);
    const message = error instanceof Error ? error.message : String(error);
    const isBucketNotFound =
      message.includes("does not exist") ||
      message.includes("notFound") ||
      (typeof (error as { code?: number })?.code === "number" &&
        (error as { code: number }).code === 404);
    if (isBucketNotFound) {
      return NextResponse.json(
        {
          error:
            "Storage bucket not found. Enable Firebase Storage in your project and set NEXT_PUBLIC_FIREBASE_STORAGE_SMRC_BUCKET to your bucket (e.g. your-project-id.appspot.com).",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: message || "Upload failed" }, { status: 500 });
  }
}
