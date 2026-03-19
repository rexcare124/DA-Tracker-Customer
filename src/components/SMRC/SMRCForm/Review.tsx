"use client";

import { useFormContext } from "react-hook-form";
import type { SMRCFormInputFields } from "./helper";
import type { SMRC } from "@/types/smrc";
import { AgencyLevel } from "@/lib/firebase/smrc-types";
import { format } from "date-fns";

interface ReviewProps {
  defaultSmrc?: SMRC | null;
}

export default function Review({ defaultSmrc }: ReviewProps) {
  const { watch } = useFormContext<SMRCFormInputFields>();
  const agencyLevel = watch("agencyLevel");
  const agencyName = watch("agencyName");

  return (
    <div className="space-y-4">
      <p
        className={
          defaultSmrc
            ? "font-medium text-2xl text-center my-8 text-[#38464d]"
            : "text-xl text-center text-[#38464d]"
        }
      >
        {defaultSmrc
          ? `${agencyLevel !== AgencyLevel.COUNTY ? "The " : ""}${agencyName} was reviewed on ${defaultSmrc.createdAt ? format(new Date(defaultSmrc.createdAt), "EEEE, MMMM d, yyyy, h:mm a") : ""}`
          : 'Please use the "Previous" button if you would like to go back and review/edit your responses; otherwise, click the "Submit" button to save your review.'}
      </p>
    </div>
  );
}
