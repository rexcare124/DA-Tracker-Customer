"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import SMRCSignInPrompt from "./SMRCSignInPrompt";
import SMRCForm from "./SMRCForm/SMRCForm";
import Loading from "@/components/Loading";
import type { SMRC } from "@/types/smrc";

interface SMRCContentProps {
  isPreviousResidence?: boolean;
  notResident?: boolean;
  defaultSmrc?: SMRC | null;
}

export default function SMRCContent({
  isPreviousResidence = false,
  notResident = false,
  defaultSmrc,
}: SMRCContentProps) {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const draftId = searchParams?.get("draftId") ?? undefined;
  const [showForm, setShowForm] = useState(!!session?.user);

  useEffect(() => {
    if (session?.user) {
      setShowForm(window?.sessionStorage?.getItem("show_smrc_form") !== "false");
    }
  }, [session?.user]);

  if (status === "loading") {
    return <Loading />;
  }

  if (defaultSmrc === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">
          The review is unavailable or you are not authorized to view it.
        </p>
      </div>
    );
  }

  if (showForm || defaultSmrc !== undefined) {
    return (
      <SMRCForm
        isPreviousResidence={isPreviousResidence}
        notResident={notResident}
        defaultSmrc={defaultSmrc}
        draftId={draftId}
      />
    );
  }

  return <SMRCSignInPrompt />;
}
