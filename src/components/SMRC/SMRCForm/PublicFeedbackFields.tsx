"use client";

import { useCallback, useMemo } from "react";
import { Controller, useFormContext, useWatch, type Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  type SMRCFormInputFields,
  SMRC_LABEL_CLASS,
  SMRC_TEXTAREA_CLASS,
  SMRC_ERROR_CLASS,
} from "./helper";
import type { SMRC } from "@/types/smrc";
import { AgencyLevel } from "@/lib/firebase/smrc-types";
import { cn } from "@/lib/utils";
import TextCountingField from "./TextCountingField";

/** Map 6-option scale to backend 1-10: Strongly Disagree=1, Somewhat Disagree=2, Neither=5, Somewhat Agree=8, Strongly Agree=10, No Knowledge=0 (submit as 5) */
const SCALE_VALUES = ["1", "2", "5", "8", "10", "0"] as const;

/** Radio (circle only for table cells): same as GovUNLEASHED Radio – 20px circle, 10px inner dot */
function GovScaleRadio({
  name,
  value,
  checked,
  onChange,
  disabled,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}) {
  return (
    <label className="group relative flex cursor-pointer justify-center">
      <span className="relative h-5 w-5 shrink-0">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="absolute left-0 top-0 h-5 w-5 cursor-pointer opacity-0"
          aria-hidden
        />
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#a3a3a3] bg-white group-has-[:checked]:border-[#0b83e6dc] group-has-[:checked]:bg-[#0b83e6dc]">
          <span className="hidden h-[10px] w-[10px] shrink-0 rounded-full border-2 border-white bg-white group-has-[:checked]:block" />
        </span>
      </span>
    </label>
  );
}

/** Gov uses 0.2–1.0 scale for Total Score: Strongly Disagree=0.2, Somewhat=0.4, Neither=0.6, Somewhat Agree=0.8, Strongly Agree=1.0. Map PK stored 1–10 to that. */
function storedValueToGovScore(stored: number): number {
  if (stored <= 1.5) return 0.2;
  if (stored <= 3.5) return 0.4;
  if (stored <= 6.5) return 0.6;
  if (stored <= 8.5) return 0.8;
  return 1.0;
}

/** Match GovUNLEASHED: totalScore = sum of Gov-scale values (0.2 per option), possibleScore = count of answered (exclude "0" / No Knowledge). */
function getTotalScore(
  rating: Record<string, string> | undefined,
  metricKeys: readonly { fieldName: string }[],
): { totalScore: number; possibleScore: number } {
  let totalScore = 0;
  let possibleScore = 0;
  if (rating) {
    for (const { fieldName } of metricKeys) {
      const v = rating[fieldName];
      if (v === undefined || v === "" || v === "0") continue;
      const n = parseFloat(String(v));
      if (Number.isFinite(n) && n >= 1 && n <= 10) {
        possibleScore += 1;
        totalScore += storedValueToGovScore(n);
      }
    }
  }
  return { totalScore, possibleScore };
}

/** Normalize loaded 1-10 value to nearest 6-point scale for display */
function normalizeToScale(v: string | undefined): string {
  if (v === "0" || v === "") return v ?? "";
  const n = parseFloat(String(v));
  if (!Number.isFinite(n)) return "";
  if (n <= 1.5) return "1";
  if (n <= 3.5) return "2";
  if (n <= 5.5) return "5";
  if (n <= 8.5) return "8";
  return "10";
}
const COLUMN_LABELS = [
  "Strongly Disagree",
  "Somewhat Disagree",
  "Neither Agree Nor Disagree",
  "Somewhat Agree",
  "Strongly Agree",
  "No Knowledge/Experience",
] as const;

const nonBusinessStateMetrics: {
  value: string;
  fieldName: keyof SMRCFormInputFields["nonBusinessRating"];
}[] = [
  { value: "The state is a good place to live and raise a family.", fieldName: "metric1" },
  {
    value: "The state offers a good variety of health (incl. mental health) and wellness services.",
    fieldName: "metric2",
  },
  {
    value:
      "State government leaders are clear about their priorities and what it takes to implement them.",
    fieldName: "metric3",
  },
  {
    value:
      "I trust state government leaders to perform their duties in an ethical manner and avoid the appearance of self-enrichment.",
    fieldName: "metric4",
  },
  {
    value: "State government leaders are responsive to my concerns and take them seriously.",
    fieldName: "metric5",
  },
  {
    value:
      "State government leaders devote an adequate amount of attention and resources to ensuring public safety.",
    fieldName: "metric6",
  },
  {
    value:
      "State government public service staff are kind, knowledgeable, and courteous to ensure requests are effectively fulfilled.",
    fieldName: "metric7",
  },
  {
    value:
      "State government programs and services are easy to access and enhance the quality of life.",
    fieldName: "metric8",
  },
  {
    value:
      "Technology platforms (e.g., website) for accessing state public services are intuitive and user-friendly.",
    fieldName: "metric9",
  },
  {
    value:
      "State government leaders regularly publish documents online that comprehensively describe the state's fiscal health.",
    fieldName: "metric10",
  },
  {
    value:
      "State government public service offices and recreational facilities are well-maintained, conveniently located, and accessible.",
    fieldName: "metric11",
  },
  {
    value:
      "State government laws are business-friendly and sufficiently stimulate employment opportunities near where I live.",
    fieldName: "metric12",
  },
  {
    value: "State government leaders and their workforce reflect the state's diversity.",
    fieldName: "metric13",
  },
  {
    value: "Laws and executive orders are enforced in a fair and unbiased manner.",
    fieldName: "metric14",
  },
  {
    value:
      "State emergency services staff perform their duties in a professional, courteous, and timely manner.",
    fieldName: "metric15",
  },
];

const nonBusinessCountyMetrics: {
  value: string;
  fieldName: keyof SMRCFormInputFields["nonBusinessRating"];
}[] = [
  { value: "The county is a good place to live and raise a family.", fieldName: "metric1" },
  {
    value:
      "The county offers a good variety of health (incl. mental health) and wellness services.",
    fieldName: "metric2",
  },
  {
    value:
      "County government leaders are clear about their priorities and what it takes to implement them.",
    fieldName: "metric3",
  },
  {
    value:
      "I trust county government leaders to perform their duties in an ethical manner and avoid the appearance of self-enrichment.",
    fieldName: "metric4",
  },
  {
    value: "County government leaders are responsive to my concerns and take them seriously.",
    fieldName: "metric5",
  },
  {
    value:
      "County government leaders devote an adequate amount of attention and resources to ensuring public safety.",
    fieldName: "metric6",
  },
  {
    value:
      "County government public service staff are kind, knowledgeable, and courteous to ensure requests are effectively fulfilled.",
    fieldName: "metric7",
  },
  {
    value:
      "County government programs and services are easy to access and enhance the quality of life.",
    fieldName: "metric8",
  },
  {
    value:
      "Technology platforms (e.g., website) for accessing county public services are intuitive and user-friendly.",
    fieldName: "metric9",
  },
  {
    value:
      "County government leaders regularly publish documents online that comprehensively describe the county's fiscal health.",
    fieldName: "metric10",
  },
  {
    value:
      "County government public service offices and recreational facilities are well-maintained, conveniently located, and accessible.",
    fieldName: "metric11",
  },
  {
    value:
      "County government ordinances are business-friendly and sufficiently stimulate employment opportunities near where I live.",
    fieldName: "metric12",
  },
  {
    value:
      "County government leaders and their workforce reflect the diversity of residents in the community.",
    fieldName: "metric13",
  },
  {
    value: "Laws and county ordinances are enforced in a fair and unbiased manner.",
    fieldName: "metric14",
  },
  {
    value:
      "County emergency services staff (e.g., Sheriff's office) perform their duties in a professional, courteous, and timely manner.",
    fieldName: "metric15",
  },
];

const nonBusinessCityMetrics: {
  value: string;
  fieldName: keyof SMRCFormInputFields["nonBusinessRating"];
}[] = [
  { value: "The city is a good place to live and raise a family.", fieldName: "metric1" },
  {
    value: "The city provides adequate health (incl. mental health) and wellness services.",
    fieldName: "metric2",
  },
  {
    value:
      "City government leaders are clear about their priorities and what it takes to implement them.",
    fieldName: "metric3",
  },
  {
    value:
      "I trust city government leaders to perform their duties in an ethical manner and avoid the appearance of self-enrichment.",
    fieldName: "metric4",
  },
  {
    value: "City government leaders are responsive to my concerns and take them seriously.",
    fieldName: "metric5",
  },
  {
    value:
      "City government leaders devote an adequate amount of attention and resources to ensuring public safety.",
    fieldName: "metric6",
  },
  {
    value:
      "City government public service staff are kind, knowledgeable, and courteous to ensure requests are effectively fulfilled.",
    fieldName: "metric7",
  },
  {
    value:
      "City government programs and services are easy to access and enhance the quality of life.",
    fieldName: "metric8",
  },
  {
    value:
      "Technology platforms (e.g., website) for accessing city public services are intuitive and user-friendly.",
    fieldName: "metric9",
  },
  {
    value:
      "City government leaders regularly publish documents online that comprehensively describe the city's fiscal health.",
    fieldName: "metric10",
  },
  {
    value:
      "City government public service offices and recreational facilities are well-maintained, conveniently located, and accessible.",
    fieldName: "metric11",
  },
  {
    value:
      "City municipal code is business-friendly and sufficiently stimulates employment opportunities near where I live.",
    fieldName: "metric12",
  },
  {
    value:
      "City government leaders and their workforce reflect the diversity of residents in the community.",
    fieldName: "metric13",
  },
  {
    value:
      "Laws, county ordinances, and city municipal code are enforced in a fair and unbiased manner.",
    fieldName: "metric14",
  },
  {
    value:
      "First responders (e.g., police, firefighters, and paramedics) handle emergency scenes in a professional, courteous, and timely manner.",
    fieldName: "metric15",
  },
];

const businessStateMetrics: {
  value: string;
  fieldName: keyof SMRCFormInputFields["businessRating"];
}[] = [
  {
    value:
      "State government leaders understand my business's needs and the challenges of my industry.",
    fieldName: "metric1",
  },
  {
    value:
      "State government leaders are effective at developing and executing strategies beneficial to my business.",
    fieldName: "metric2",
  },
  {
    value:
      "State government leaders do a good job of engaging the private sector when evaluating the impact of new laws.",
    fieldName: "metric3",
  },
  {
    value:
      "State government leaders do a good job of building and maintaining positive relationships with the business community.",
    fieldName: "metric4",
  },
  {
    value:
      "State government leaders provide sufficient facts and data to justify their decision-making to the business community.",
    fieldName: "metric5",
  },
  {
    value:
      "State government leaders provide sufficient resources and support to help me grow a successful business.",
    fieldName: "metric6",
  },
  {
    value:
      "State government leaders do a good job of connecting their business community with sources of capital.",
    fieldName: "metric7",
  },
  {
    value:
      "State government leaders do a good job of advocating for the interests of their business community.",
    fieldName: "metric8",
  },
  {
    value:
      "State government leaders support their business community by giving them preference (whenever possible) over competitors located outside the state when purchasing products and services.",
    fieldName: "metric9",
  },
  {
    value:
      "State government leaders do a good job of ensuring the state has an overall good image and reputation as a place to operate a business.",
    fieldName: "metric10",
  },
];

const businessCountyMetrics: {
  value: string;
  fieldName: keyof SMRCFormInputFields["businessRating"];
}[] = [
  {
    value:
      "County government leaders understand my business's needs and the challenges of my industry.",
    fieldName: "metric1",
  },
  {
    value:
      "County government leaders are effective at developing and executing strategies beneficial to my business.",
    fieldName: "metric2",
  },
  {
    value:
      "County government leaders do a good job of engaging the private sector when evaluating the impact of new ordinances and regulations.",
    fieldName: "metric3",
  },
  {
    value:
      "County government leaders do a good job of building and maintaining positive relationships with the business community.",
    fieldName: "metric4",
  },
  {
    value:
      "County government leaders provide sufficient facts and data to justify their decision-making to the business community.",
    fieldName: "metric5",
  },
  {
    value:
      "County government leaders provide sufficient resources and support to help me grow a successful business.",
    fieldName: "metric6",
  },
  {
    value:
      "County government leaders do a good job of connecting their business community with sources of capital.",
    fieldName: "metric7",
  },
  {
    value:
      "County government leaders do a good job of advocating for the interests of their business community.",
    fieldName: "metric8",
  },
  {
    value:
      "County government leaders support their business community by giving them preference (whenever possible) over competitors located outside the county when purchasing products and services.",
    fieldName: "metric9",
  },
  {
    value:
      "County government leaders do a good job of ensuring the county has an overall good image and reputation as a place to operate a business.",
    fieldName: "metric10",
  },
];

const businessCityMetrics: {
  value: string;
  fieldName: keyof SMRCFormInputFields["businessRating"];
}[] = [
  {
    value:
      "City government leaders understand my business's needs and the challenges of my industry.",
    fieldName: "metric1",
  },
  {
    value:
      "City government leaders are effective at developing and executing strategies beneficial to my business.",
    fieldName: "metric2",
  },
  {
    value:
      "City government leaders do a good job of engaging the private sector when evaluating the impact of new policies.",
    fieldName: "metric3",
  },
  {
    value:
      "City government leaders do a good job of building and maintaining positive relationships with the business community.",
    fieldName: "metric4",
  },
  {
    value:
      "City government leaders provide sufficient facts and data to justify their decision-making to the business community.",
    fieldName: "metric5",
  },
  {
    value:
      "City government leaders provide sufficient resources and support to help me grow a successful business.",
    fieldName: "metric6",
  },
  {
    value:
      "City government leaders do a good job of connecting their business community with sources of capital.",
    fieldName: "metric7",
  },
  {
    value:
      "City government leaders do a good job of advocating for the interests of their business community.",
    fieldName: "metric8",
  },
  {
    value:
      "City government leaders support their business community by giving them preference (whenever possible) over competitors located outside the city when purchasing products and services.",
    fieldName: "metric9",
  },
  {
    value:
      "City government leaders do a good job of ensuring the city has an overall good image and reputation as a place to operate a business.",
    fieldName: "metric10",
  },
];

interface PublicFeedbackFieldsProps {
  isValidating: boolean;
  defaultSmrc?: SMRC | null;
}

export default function PublicFeedbackFields({ defaultSmrc }: PublicFeedbackFieldsProps) {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<SMRCFormInputFields>();
  const businessOwner = watch("businessOwner");
  const agencyLevel = watch("agencyLevel");
  const agencyName = watch("agencyName");
  // useWatch subscribes to nested field changes so Total Score updates live when any rating is selected
  const nonBusinessRating = useWatch({ control, name: "nonBusinessRating", defaultValue: {} });
  const businessRating = useWatch({ control, name: "businessRating", defaultValue: {} });

  const nonBusinessMetrics = useMemo(() => {
    if (agencyLevel === AgencyLevel.STATE) return nonBusinessStateMetrics;
    if (agencyLevel === AgencyLevel.COUNTY) return nonBusinessCountyMetrics;
    return nonBusinessCityMetrics;
  }, [agencyLevel]);

  const businessMetrics = useMemo(() => {
    if (agencyLevel === AgencyLevel.STATE) return businessStateMetrics;
    if (agencyLevel === AgencyLevel.COUNTY) return businessCountyMetrics;
    return businessCityMetrics;
  }, [agencyLevel]);

  const nonBusinessTotalScore = useMemo(
    () =>
      getTotalScore(nonBusinessRating as Record<string, string> | undefined, nonBusinessMetrics),
    [nonBusinessRating, nonBusinessMetrics],
  );

  const businessTotalScore = useMemo(
    () => getTotalScore(businessRating as Record<string, string> | undefined, businessMetrics),
    [businessRating, businessMetrics],
  );

  const onChangeRating = useCallback(
    (fieldName: Path<SMRCFormInputFields>, value: string) => {
      setValue(fieldName, value as never, { shouldValidate: true });
    },
    [setValue],
  );

  return (
    <div className="space-y-8">
      <p className="text-[#38464d] text-lg">
        Please indicate the extent you agree or disagree with the following statements concerning
        your public service interaction(s) with
        {agencyLevel !== AgencyLevel.COUNTY ? " the" : ""} <b>{agencyName || "the agency"}</b>.
        Accepted responses are on a scale of &quot;Strongly Agree&quot; to &quot;Strongly
        Disagree&quot;. Select &quot;No Knowledge/Experience&quot; response where appropriate.
      </p>
      <p className="text-[#38464d] text-lg">
        This information is used by GovUNLEASHED to prepare state government and municipality report
        cards. Selections and testimonials provided on this page are shared with the public.
      </p>
      <p className="text-[#38464d] text-sm -mt-4">
        <span className="text-[#e20a0a]">*</span> indicates required field
      </p>

      <div className="overflow-x-auto mt-[30px]">
        <table className="w-full border-collapse [&_thead_th:nth-child(even)]:bg-[#f5f5f5] [&_td:nth-child(even)]:bg-[#f5f5f5]">
          <thead>
            <tr>
              <th className="p-2.5 border-b border-[#e7e7e7] text-left text-[#38464d] text-base font-normal" />
              {COLUMN_LABELS.map((label) => (
                <th
                  key={label}
                  className="p-2.5 border-b border-[#e7e7e7] text-[#38464d] text-base font-normal text-center"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nonBusinessMetrics.map(({ value, fieldName }) => (
              <tr key={fieldName}>
                <td className="p-2.5 border-b border-[#e7e7e7] align-top">
                  <p
                    className={cn(
                      "text-[#38464d] text-base font-normal",
                      errors?.nonBusinessRating?.[fieldName] && "text-red-500",
                    )}
                  >
                    <span className="text-[#e20a0a]">*</span> {value}
                  </p>
                </td>
                {SCALE_VALUES.map((scaleValue) => (
                  <td key={scaleValue} className="p-2.5 border-b border-[#e7e7e7] align-middle">
                    <Controller
                      name={`nonBusinessRating.${fieldName}` as keyof SMRCFormInputFields}
                      control={control}
                      rules={{ required: "Rating is required" }}
                      render={({ field }) => (
                        <GovScaleRadio
                          name={field.name}
                          value={scaleValue}
                          checked={normalizeToScale(String(field.value ?? "")) === scaleValue}
                          onChange={() =>
                            onChangeRating(field.name as Path<SMRCFormInputFields>, scaleValue)
                          }
                          disabled={!!defaultSmrc}
                        />
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {errors?.nonBusinessRating && (
          <p className={cn(SMRC_ERROR_CLASS, "mt-2")}>Rating is required</p>
        )}
      </div>

      <p className="text-[#38464d] text-base font-medium mt-2">
        <strong>
          Total Score:{" "}
          {nonBusinessTotalScore.possibleScore > 0
            ? `${+nonBusinessTotalScore.totalScore.toFixed(3)}/${+nonBusinessTotalScore.possibleScore.toFixed(3)} (${((nonBusinessTotalScore.totalScore || 0) / (nonBusinessTotalScore.possibleScore || 1) * 100).toFixed(1)}%)`
            : "—/— (—%)"}
        </strong>
      </p>

      <TextCountingField
        label={
          <>
            <span className="text-[#e20a0a]">*</span> Share your experience with
            {agencyLevel !== AgencyLevel.COUNTY ? " the" : ""} <b>{agencyName || "the agency"}</b>.
          </>
        }
        name="nonBusinessExperienceFeedback"
        limit={5000}
        rules={{ required: "Field is required" }}
        disabled={!!defaultSmrc}
      />

      {businessOwner === "yes" && (
        <>
          <div className="space-y-0 mt-[30px]">
            <Label className={cn(SMRC_LABEL_CLASS, "font-semibold")}>
              Business Experience Ratings
            </Label>
          </div>
          <div className="overflow-x-auto mt-2.5">
            <table className="w-full border-collapse [&_thead_th:nth-child(even)]:bg-[#f5f5f5] [&_td:nth-child(even)]:bg-[#f5f5f5]">
              <thead>
                <tr>
                  <th className="p-2.5 border-b border-[#e7e7e7] text-left text-[#38464d] text-base font-normal" />
                  {COLUMN_LABELS.map((label) => (
                    <th
                      key={label}
                      className="p-2.5 border-b border-[#e7e7e7] text-[#38464d] text-base font-normal text-center"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {businessMetrics.map(({ value, fieldName }) => (
                  <tr key={fieldName}>
                    <td className="p-2.5 border-b border-[#e7e7e7] align-top">
                      <p
                        className={cn(
                          "text-[#38464d] text-base font-normal",
                          errors?.businessRating?.[fieldName] && "text-red-500",
                        )}
                      >
                        <span className="text-[#e20a0a]">*</span> {value}
                      </p>
                    </td>
                    {SCALE_VALUES.map((scaleValue) => (
                      <td key={scaleValue} className="p-2.5 border-b border-[#e7e7e7] align-middle">
                        <Controller
                          name={`businessRating.${fieldName}` as keyof SMRCFormInputFields}
                          control={control}
                          rules={{ required: "Required when business owner" }}
                          render={({ field }) => (
                            <GovScaleRadio
                              name={field.name}
                              value={scaleValue}
                              checked={normalizeToScale(String(field.value ?? "")) === scaleValue}
                              onChange={() =>
                                onChangeRating(
                                  field.name as Path<SMRCFormInputFields>,
                                  scaleValue,
                                )
                              }
                              disabled={!!defaultSmrc}
                            />
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {errors?.businessRating && (
              <p className={cn(SMRC_ERROR_CLASS, "mt-2")}>Rating is required</p>
            )}
          </div>
          <p className="text-[#38464d] text-base font-medium mt-2">
            <strong>
              Total Score:{" "}
              {businessTotalScore.possibleScore > 0
                ? `${+businessTotalScore.totalScore.toFixed(3)}/${+businessTotalScore.possibleScore.toFixed(3)} (${((businessTotalScore.totalScore || 0) / (businessTotalScore.possibleScore || 1) * 100).toFixed(1)}%)`
                : "—/— (—%)"}
            </strong>
          </p>
          <div className="space-y-0 mt-[30px]">
            <Label className={SMRC_LABEL_CLASS}>Business experience feedback (optional)</Label>
            <textarea
              className={SMRC_TEXTAREA_CLASS}
              {...register("businessExperienceFeedback")}
              disabled={!!defaultSmrc}
              placeholder="Any other comments about your business experience"
            />
          </div>
        </>
      )}
    </div>
  );
}
