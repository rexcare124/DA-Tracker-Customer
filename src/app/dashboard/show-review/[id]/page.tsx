"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SMRCContent from "@/components/SMRC/SMRCContent";
import Loading from "@/components/Loading";
import type { SMRCDocument } from "@/lib/firebase/smrc-types";

export default function ShowReviewPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: session, status } = useSession();
  const [smrc, setSmrc] = useState<SMRCDocument | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || status !== "authenticated") {
      if (status === "unauthenticated" && id) setSmrc(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/smrc/${encodeURIComponent(id)}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setSmrc(null);
        } else {
          setSmrc(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load review");
          setSmrc(null);
        }
      });
    return () => { cancelled = true; };
  }, [id, status]);

  if (status === "loading" || (id && smrc === undefined && !error)) {
    return <Loading />;
  }

  if (error || smrc === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">
          {error ?? "The review is unavailable or you are not authorized to view it."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-10 pb-12 px-4 md:px-10 max-w-[1140px] mx-auto w-full">
        <SMRCContent
          defaultSmrc={smrc}
          isPreviousResidence={!smrc?.currentResidence}
          notResident={smrc?.notResident ?? false}
        />
      </div>
    </div>
  );
}
