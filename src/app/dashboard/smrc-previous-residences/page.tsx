"use client";

import SMRCContent from "@/components/SMRC/SMRCContent";

export default function SMRCPreviousResidencesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-10 pb-12 px-4 md:px-10 max-w-[1140px] mx-auto w-full">
        <SMRCContent isPreviousResidence />
      </div>
    </div>
  );
}
