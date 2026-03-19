"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { X, Info } from "lucide-react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FormValues = { reviewType: string };

export default function PreviousResidencesModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors: fieldsErrors, isSubmitted },
  } = useForm<FormValues>();

  const onSubmit = useCallback(
    ({ reviewType }: FormValues) => {
      onClose();
      if (reviewType === "previous") {
        router.push("/dashboard/smrc-previous-residences");
      } else if (reviewType === "notResident") {
        router.push("/dashboard/smrc-not-resident");
      } else {
        router.push("/dashboard/got-smrc");
      }
    },
    [onClose, router],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="font-lato w-full max-w-[90vw] rounded-[8px] bg-white shadow-lg"
        style={{
          width: "600px",
          maxWidth: "90vw",
          padding: "20px 20px 40px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="flex w-full items-center justify-between">
          <h2
            id="modal-title"
            className="w-full text-left font-normal text-[rgba(0, 0, 0, 0.88)]"
            style={{ fontSize: "20px" }}
          >
            Your Public Service Interaction
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border-0 bg-transparent p-0 text-[#38464d] hover:opacity-80"
            aria-label="Close"
          >
            <X style={{ width: 22, height: 22 }} strokeWidth={2} />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div style={{ marginTop: "30px" }}>
            <p
              className="block text-[#38464d]"
              style={{
                fontSize: "18px",
                fontWeight: 400,
                marginBottom: "10px",
              }}
            >
              Which option best describes where you received public service(s)?
            </p>
            <div
              className="flex flex-wrap"
              style={{
                justifyContent: "flex-start",
                gap: "30px",
              }}
            >
              <label
                className="group flex cursor-pointer items-center text-[#38464d]"
                style={{ flexDirection: "row", columnGap: "5px" }}
              >
                <span className="relative flex shrink-0 items-center justify-center">
                  <input
                    type="radio"
                    value="previous"
                    {...register("reviewType", { required: "Field is required" })}
                    onChange={(e) =>
                      setValue("reviewType", e.target.value, {
                        shouldValidate: isSubmitted,
                      })
                    }
                    className="peer absolute inset-0 cursor-pointer opacity-0"
                    style={{ width: 20, height: 20 }}
                  />
                  <span
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#a3a3a3] group-has-[:checked]:border-[#0b83e6dc] group-has-[:checked]:bg-[#0b83e6dc]"
                    style={{ width: 20, height: 20 }}
                    aria-hidden
                  >
                    <span
                      className="hidden shrink-0 rounded-full bg-white group-has-[:checked]:block"
                      style={{ width: 10, height: 10 }}
                      aria-hidden
                    />
                  </span>
                </span>
                <span className="flex items-center" style={{ columnGap: "5px" }}>
                  <span>Previous Residence</span>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="inline-flex cursor-help rounded-full p-0.5 text-[#38464d] hover:bg-gray-100"
                          aria-label="More information"
                        >
                          <Info style={{ width: 16, height: 16 }} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={8}
                        className="z-[100000] max-w-[260px] bg-[#1f2937] px-3 py-2 text-[12px] font-normal leading-snug text-white"
                      >
                        Select this review type if you're sharing your experiences about public
                        services at a previous address where you lived/worked.
                        <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </label>
              <label
                className="group flex cursor-pointer items-center text-[#38464d]"
                style={{ flexDirection: "row", columnGap: "5px" }}
              >
                <span className="relative flex shrink-0 items-center justify-center">
                  <input
                    type="radio"
                    value="current"
                    {...register("reviewType", { required: "Field is required" })}
                    onChange={(e) =>
                      setValue("reviewType", e.target.value, {
                        shouldValidate: isSubmitted,
                      })
                    }
                    className="peer absolute inset-0 cursor-pointer opacity-0"
                    style={{ width: 20, height: 20 }}
                  />
                  <span
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#a3a3a3] group-has-[:checked]:border-[#0b83e6dc] group-has-[:checked]:bg-[#0b83e6dc]"
                    style={{ width: 20, height: 20 }}
                    aria-hidden
                  >
                    <span
                      className="hidden shrink-0 rounded-full bg-white group-has-[:checked]:block"
                      style={{ width: 10, height: 10 }}
                      aria-hidden
                    />
                  </span>
                </span>
                <span className="flex items-center" style={{ columnGap: "5px" }}>
                  <span>Current Residence</span>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="inline-flex cursor-help rounded-full p-0.5 text-[#38464d] hover:bg-gray-100"
                          aria-label="More information"
                        >
                          <Info style={{ width: 16, height: 16 }} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={8}
                        className="z-[100000] max-w-[260px] bg-[#1f2937] px-3 py-2 text-[12px] font-normal leading-snug text-white"
                      >
                        Select this review type if you're sharing your experiences about public
                        services at your current place of residence/work.
                        <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </label>
              <label
                className="group flex cursor-pointer items-center text-[#38464d]"
                style={{ flexDirection: "row", columnGap: "5px" }}
              >
                <span className="relative flex shrink-0 items-center justify-center">
                  <input
                    type="radio"
                    value="notResident"
                    {...register("reviewType", { required: "Field is required" })}
                    onChange={(e) =>
                      setValue("reviewType", e.target.value, {
                        shouldValidate: isSubmitted,
                      })
                    }
                    className="peer absolute inset-0 cursor-pointer opacity-0"
                    style={{ width: 20, height: 20 }}
                  />
                  <span
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#a3a3a3] group-has-[:checked]:border-[#0b83e6dc] group-has-[:checked]:bg-[#0b83e6dc]"
                    style={{ width: 20, height: 20 }}
                    aria-hidden
                  >
                    <span
                      className="hidden shrink-0 rounded-full bg-white group-has-[:checked]:block"
                      style={{ width: 10, height: 10 }}
                      aria-hidden
                    />
                  </span>
                </span>
                <span className="flex items-center" style={{ columnGap: "5px" }}>
                  <span>Not a Resident</span>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="inline-flex cursor-help rounded-full p-0.5 text-[#38464d] hover:bg-gray-100"
                          aria-label="More information"
                        >
                          <Info style={{ width: 16, height: 16 }} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={8}
                        className="z-[100000] max-w-[260px] bg-[#1f2937] px-3 py-2 text-[12px] font-normal leading-snug text-white"
                      >
                        Select this review type if you're sharing your experiences about public
                        services received in a location visited while traveling or outside the
                        community where you normally live/work.
                        <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </label>
            </div>
            {fieldsErrors?.reviewType?.message && (
              <p className="text-red-500" style={{ marginTop: "7px" }}>
                {fieldsErrors.reviewType.message}
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2" style={{ marginTop: "30px" }}>
            <button
              type="submit"
              className="cursor-pointer rounded border border-[#0b83e6dc] bg-[#0b83e6dc] text-center text-white hover:border-[#95c8f1dc] hover:bg-[#95c8f1dc] hover:text-[#0b83e6dc]"
              style={{
                padding: "10px 50px",
                fontSize: "18px",
                borderRadius: "5px",
              }}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
