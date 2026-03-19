"use client";

import { useCallback, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SMRC_LABEL_CLASS, SMRC_ERROR_CLASS } from "./helper";
import type { SMRCFormInputFields } from "./helper";
import type { SMRC } from "@/types/smrc";
import { AgencyLevel } from "@/lib/firebase/smrc-types";
import TextCountingField from "./TextCountingField";

/** GovUNLEASHED-style Likert radio: 22px circle, light gray border, blue fill when selected, white inner dot */
const LikertRadio = ({
  value,
  checked,
  onChange,
  disabled,
  name,
}: {
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  name: string;
}) => (
  <label className="group flex flex-col cursor-pointer items-center gap-1">
    <span className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer absolute inset-0 cursor-pointer opacity-0"
        aria-hidden
      />
      <span
        className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[#d9d9d9] bg-white group-has-[:checked]:border-[#0b83e6] group-has-[:checked]:bg-[#0b83e6]"
        aria-hidden
      >
        <span
          className="hidden h-2.5 w-2.5 shrink-0 rounded-full bg-white group-has-[:checked]:block"
          aria-hidden
        />
      </span>
    </span>
    <span className="text-[#38464d] text-lg">{value}</span>
  </label>
);

/** GovUNLEASHED-style checkbox: 20px square, light gray border, blue fill + white check when selected; red when hasError */
const SMRCCheckbox = ({
  checked,
  onChange,
  disabled,
  label,
  hasError = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  label: string;
  hasError?: boolean;
}) => (
  <label
    className={`group flex cursor-pointer items-start gap-2 text-lg ${hasError ? "text-[#e20a0a]" : "text-[#38464d]"}`}
  >
    <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer absolute inset-0 cursor-pointer opacity-0"
        aria-hidden
      />
      <span
        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 bg-white ${
          hasError
            ? "border-[#e20a0a] group-has-[:checked]:border-[#e20a0a] group-has-[:checked]:bg-[#e20a0a]"
            : "border-[#d9d9d9] group-has-[:checked]:border-[#0b83e6] group-has-[:checked]:bg-[#0b83e6]"
        }`}
        aria-hidden
      >
        <svg
          className="hidden h-3 w-3 text-white group-has-[:checked]:block"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2 6l3 3 5-6" />
        </svg>
      </span>
    </span>
    <span>{label}</span>
  </label>
);

const stateRecommendations = [
  "The state's laws and policies do not sufficiently stimulate economic growth and the creation of good-paying jobs.",
  "The state's elected officials are not sufficiently accountable to residents.",
  "The state does not sufficiently consider the impact of new laws and policies on residents before enacting them.",
  "The state does not place enough emphasis on improving existing laws and policies.",
  "The state is not sufficiently transparent about the operating practices and costs of its departments.",
  "The state should do more to stimulate economic growth and the creation of good-paying jobs.",
  "The state's elected officials should do more to improve their accountability with residents.",
  "The state should make more of an effort to understand the impact of new laws and policies on citizens before enacting them.",
  "The state should place more emphasis on improving existing laws and policies.",
  "The state should be more transparent about the operating practices and costs of its departments.",
];

const countyRecommendations = [
  "The county's ordinances and policies do not sufficiently stimulate economic growth and the creation of good-paying jobs.",
  "The county's elected officials are not sufficiently accountable to residents.",
  "The county does not sufficiently consider the impact of new ordinances and policies on residents before adopting them.",
  "The county does not place enough emphasis on improving existing ordinances and policies.",
  "The county is not sufficiently transparent about the operating practices and costs of its departments.",
  "The county should improve their ordinances and policies to stimulate economic growth and the creation of good-paying jobs.",
  "The county's elected officials should do more to improve their accountability to residents.",
  "The county should make more of an effort to understand the impact of new ordinances and policies on residents before adopting them.",
  "The county should place more emphasis on improving existing ordinances and policies.",
  "The county should be more transparent about the operating practices and costs of its departments.",
];

const cityRecommendations = [
  "The city's ordinances and policies do not sufficiently stimulate economic growth and the creation of good-paying jobs.",
  "The city's elected officials are not sufficiently accountable to residents.",
  "The city does not sufficiently consider the impact of new ordinances and policies on residents before adopting them.",
  "The city does not place enough emphasis on improving existing ordinances and policies.",
  "The city is not sufficiently transparent about the operating practices and costs of its departments.",
  "The city should improve their ordinances and policies to stimulate economic growth and the creation of good-paying jobs.",
  "The city's elected officials should do more to improve their accountability to residents.",
  "The city should make more of an effort to understand the impact of new ordinances and policies on residents before adopting them.",
  "The city should place more emphasis on improving existing ordinances and policies.",
  "The city should be more transparent about the operating practices and costs of its departments.",
];

interface RecommendationProps {
  isValidating: boolean;
  onChangeField: (name: keyof SMRCFormInputFields, value: unknown) => void;
  defaultSmrc?: SMRC | null;
}

export default function Recommendation({ onChangeField, defaultSmrc }: RecommendationProps) {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
    clearErrors,
  } = useFormContext<SMRCFormInputFields>();
  const recommendation = watch("recommendation");
  const agencyLevel = watch("agencyLevel");
  const agencyName = watch("agencyName");

  const ratings = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

  const onChangeRating = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChangeField("recommendation", val);
      const num = parseInt(val, 10);
      const prev = parseInt(recommendation, 10);
      if ((prev < 5 && num >= 5) || (prev >= 5 && prev < 7 && (num < 5 || num >= 7))) {
        setValue("recommendationComments", []);
        setValue("recommendationCommentExplanation", "");
      } else if (prev > 6 && num <= 6) {
        setValue("recommendationComment", "");
      }
    },
    [recommendation, onChangeField, setValue],
  );

  const onChangeCheckboxes = useCallback(
    (value: string) => {
      const current = getValues("recommendationComments") || [];
      if (value === "Other" && current.includes("Other")) {
        setValue("recommendationCommentExplanation", "");
        clearErrors("recommendationCommentExplanation");
      }
      setValue(
        "recommendationComments",
        current.includes(value) ? current.filter((el) => el !== value) : [...current, value],
        { shouldValidate: true },
      );
    },
    [getValues, setValue, clearErrors],
  );

  const recommendations = useMemo(() => {
    if (agencyLevel === AgencyLevel.STATE) return stateRecommendations;
    if (agencyLevel === AgencyLevel.COUNTY) return countyRecommendations;
    return cityRecommendations;
  }, [agencyLevel]);

  const recNum = parseInt(recommendation, 10);
  const lowRecs =
    recNum > 4 && recNum < 7 ? recommendations.slice(5, 10) : recommendations.slice(0, 5);

  return (
    <div className="space-y-6 mt-[30px]">
      <div className="space-y-0">
        <Label className={SMRC_LABEL_CLASS}>
          <span className="text-[#e20a0a]">*</span> How likely are you to recommend
          {agencyLevel !== AgencyLevel.COUNTY ? " the" : ""} <b>{agencyName}</b> to someone as a
          place to live and raise a family based on your public service interaction(s)?
        </Label>
        <div className="mt-2.5 w-fit flex flex-col gap-5">
          <div className="flex justify-between text-sm text-[#38464d] mb-1">
            <span className="text-base font-medium">Not at all likely</span>
            <span className="text-base font-medium">Extremely likely</span>
          </div>
          <div className="flex gap-8 flex-wrap">
            {ratings.map((n) => (
              <LikertRadio
                key={n}
                name="recommendation"
                value={String(n)}
                checked={recommendation === String(n)}
                onChange={() =>
                  onChangeRating({
                    target: { value: String(n) },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                disabled={!!defaultSmrc}
              />
            ))}
          </div>
        </div>
        {errors.recommendation?.message && (
          <p className={SMRC_ERROR_CLASS}>{String(errors.recommendation.message)}</p>
        )}
      </div>

      {recNum < 7 && recNum >= 1 && (
        <Controller
          name="recommendationComments"
          control={control}
          rules={{
            validate: (value) => {
              const rec = getValues("recommendation");
              const num = parseInt(rec, 10);
              if (num >= 1 && num < 7) {
                if (!value || !Array.isArray(value) || value.length === 0)
                  return "Please select at least one option.";
              }
              return true;
            },
          }}
          render={({ field: { value } }) => (
            <div className="space-y-4 mt-[30px]">
              <Label
                className={`${SMRC_LABEL_CLASS} ${errors.recommendationComments?.message ? "text-[#e20a0a]" : ""}`}
              >
                <span className="text-[#e20a0a]">*</span>{" "}
                {recNum > 4 ? "What could have made your experience better" : "What went wrong"}?
                (Select all that apply)
              </Label>
              <div className="flex flex-col gap-2 mt-2.5">
                {[...lowRecs, "Other"].map((option) => (
                  <SMRCCheckbox
                    key={option}
                    label={option}
                    checked={!!(value as string[] | undefined)?.includes?.(option)}
                    onChange={() => onChangeCheckboxes(option)}
                    disabled={!!defaultSmrc}
                    hasError={!!errors.recommendationComments?.message}
                  />
                ))}
              </div>
              {errors.recommendationComments?.message && (
                <p className={SMRC_ERROR_CLASS}>{String(errors.recommendationComments.message)}</p>
              )}
              {(value as string[] | undefined)?.includes?.("Other") && (
                <TextCountingField
                  label="Explanation"
                  name="recommendationCommentExplanation"
                  limit={2000}
                  disabled={!!defaultSmrc}
                  rules={{
                    validate: (v) => {
                      const comments = getValues("recommendationComments");
                      if (Array.isArray(comments) && comments.includes("Other")) {
                        const str = typeof v === "string" ? v : "";
                        return str.trim().length > 0 || "Please provide an explanation when selecting Other.";
                      }
                      return true;
                    },
                  }}
                />
              )}
            </div>
          )}
        />
      )}

      {recNum >= 7 && (
        <TextCountingField
          label={
            <>
              Tell us more. What did {agencyLevel !== AgencyLevel.COUNTY ? "the" : ""}{" "}
              <b>{agencyName}</b> do well? What could have been better?
            </>
          }
          name="recommendationComment"
          limit={1000}
          disabled={!!defaultSmrc}
        />
      )}
    </div>
  );
}
