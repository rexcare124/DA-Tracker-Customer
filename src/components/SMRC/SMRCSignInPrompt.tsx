"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Shown when user is not signed in. PK-Website uses NextAuth;
 * no custom SMRC login/register - user signs in via app sign-in.
 */
export default function SMRCSignInPrompt() {
  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      <h2 className="text-2xl font-semibold text-[#38464d]">
        Let Your Experiences Effect Positive Change
      </h2>
      <p className="text-[#38464d] text-lg">
        To submit a State Municipal Report Card (SMRC) review, please sign in to your account.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
