"use client";

import { useCallback, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SMRC_LABEL_CLASS, SMRC_ERROR_CLASS } from "./helper";
import type { SMRCFormInputFields } from "./helper";
import type { SMRC } from "@/types/smrc";
import { AgencyLevel } from "@/lib/firebase/smrc-types";
import TextCountingField from "./TextCountingField";

/** GovUNLEASHED-style Yes/No radio: 18px circle, light gray border, blue fill when selected */
const YesNoRadio = ({
  value,
  label,
  checked,
  onChange,
  disabled,
  name,
}: {
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  name: string;
}) => (
  <label className="group flex flex-col cursor-pointer items-center gap-[5px] text-[#38464d] text-lg">
    <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
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
        className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#d9d9d9] bg-white group-has-[:checked]:border-[#0b83e6] group-has-[:checked]:bg-[#0b83e6]"
        aria-hidden
      >
        <span
          className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-white group-has-[:checked]:block"
          aria-hidden
        />
      </span>
    </span>
    <span>{label}</span>
  </label>
);

/** GovUNLEASHED-style Likert radio: 22px circle */
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
  <label className="group flex flex-col cursor-pointer items-center gap-[5px]">
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

/** GovUNLEASHED-style checkbox: 20px square, blue fill + white check when selected; red when hasError */
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

const businessStateRecommendations = [
  "The state does not enact laws and policies favorable to the business community.",
  "The state does not value the business community.",
  "The state's laws and policies do not attract sufficient investments for the business community.",
  "The state's policies and funding levels do not prioritize a statewide, modern infrastructure.",
  "The state's policies and funding levels do not support residents becoming proficient in foundational skills.",
  "The state should enact more business-friendly laws and policies.",
  "The state should make more of an effort to address concerns from the business community on the impact of proposed laws and policies.",
  "The state should devote more resources to attracting investments for the business community.",
  "The state should adopt policies and increase funding levels necessary for a statewide, modern infrastructure.",
  "The state should adopt policies and increase funding levels necessary for residents to become proficient in foundational skills.",
];

const businessCountyRecommendations = [
  "The county lacks quality business and service establishments.",
  "The county does not adequately promote their business community.",
  "The county does not attract sufficient business investments.",
  "The county lacks a consistent, modern infrastructure.",
  "The county residents in some local communities lack proficiency in foundational skills.",
  "The county should facilitate more opportunities for business owners to collaborate.",
  "The county should devote more staff and resources to promoting the business community.",
  "The county should secure more investments for the business community.",
  "The county should provide more resources so local communities can develop a consistent, modern infrastructure.",
  "The county should provide more resources to achieve a consistent level of foundational skills proficiency among residents.",
];

const businessCityRecommendations = [
  "The city does not facilitate enough meetups for business owners to network, exchange ideas, and support each other.",
  "The city does not adequately promote local businesses.",
  "The city does not sufficiently attract business investments.",
  "The city lacks a modern infrastructure.",
  "The city's residents seem to lack the foundational skills to adequately fulfill my business's needs.",
  "The city should host meetups for business owners to network, exchange ideas, and support each other.",
  "The city should devote more staff and resources to promoting local businesses.",
  "The city should develop more funding options for local businesses.",
  "The city should devote more resources to modernizing the infrastructure.",
  "The city should devote more resources to helping residents acquire the foundational skills to adequately fulfill my business's needs.",
];

interface OwnBusinessProps {
  isValidating: boolean;
  defaultSmrc?: SMRC | null;
}

export default function OwnBusiness({ defaultSmrc }: OwnBusinessProps) {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
    clearErrors,
  } = useFormContext<SMRCFormInputFields>();
  const businessOwner = watch("businessOwner");
  const agencyLevel = watch("agencyLevel");
  const agencyName = watch("agencyName");
  const recommendation = watch("businessRecommendation");

  const onChangeBusinessOwnership = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("businessOwner", e.target.value);
      setValue("businessRecommendationComments", []);
      setValue("businessRecommendationCommentExplanation", "");
      setValue("businessRecommendationComment", "");
    },
    [setValue],
  );

  const onChangeRating = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue("businessRecommendation", val, { shouldValidate: true });
      const num = parseInt(val, 10);
      const prev = parseInt(recommendation, 10);
      if ((prev < 5 && num >= 5) || (prev >= 5 && prev < 7 && (num < 5 || num >= 7))) {
        setValue("businessRecommendationComments", []);
        setValue("businessRecommendationCommentExplanation", "");
      } else if (prev > 6 && num <= 6) {
        setValue("businessRecommendationComment", "");
      }
    },
    [recommendation, setValue],
  );

  const onChangeCheckboxes = useCallback(
    (value: string) => {
      const current = getValues("businessRecommendationComments") || [];
      if (value === "Other" && current.includes("Other")) {
        setValue("businessRecommendationCommentExplanation", "");
        clearErrors("businessRecommendationCommentExplanation");
      }
      setValue(
        "businessRecommendationComments",
        current.includes(value) ? current.filter((el) => el !== value) : [...current, value],
        { shouldValidate: true },
      );
    },
    [getValues, setValue, clearErrors],
  );

  const recommendations = useMemo(() => {
    if (agencyLevel === AgencyLevel.STATE) return businessStateRecommendations;
    if (agencyLevel === AgencyLevel.COUNTY) return businessCountyRecommendations;
    return businessCityRecommendations;
  }, [agencyLevel]);

  const recNum = parseInt(recommendation, 10);
  const lowRecs =
    recNum > 4 && recNum < 7 ? recommendations.slice(5, 10) : recommendations.slice(0, 5);
  const ratings = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

  return (
    <div className="space-y-6 mt-[30px]">
      <div className="space-y-0">
        <Label className={SMRC_LABEL_CLASS}>
          <span className="text-[#e20a0a]">*</span> Own a Business?
        </Label>
        <div className="flex gap-[30px] mt-2.5">
          <YesNoRadio
            name="businessOwner"
            value="yes"
            label="Yes"
            checked={businessOwner === "yes"}
            onChange={() =>
              onChangeBusinessOwnership({
                target: { value: "yes" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            disabled={!!defaultSmrc}
          />
          <YesNoRadio
            name="businessOwner"
            value="no"
            label="No"
            checked={businessOwner === "no"}
            onChange={() =>
              onChangeBusinessOwnership({
                target: { value: "no" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            disabled={!!defaultSmrc}
          />
        </div>
        {errors.businessOwner?.message && (
          <p className={SMRC_ERROR_CLASS}>{String(errors.businessOwner.message)}</p>
        )}
      </div>

      {businessOwner === "yes" && (
        <>
          <div className="space-y-0 mt-[30px]">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-[#e20a0a]">*</span> How likely are you to recommend
              {agencyLevel !== AgencyLevel.COUNTY ? " the" : ""} <b>{agencyName}</b> to someone as a
              place to own a business?
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
                    name="businessRecommendation"
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
            {errors.businessRecommendation?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.businessRecommendation.message)}</p>
            )}
          </div>

          {recNum < 7 && recNum >= 1 && (
            <Controller
              name="businessRecommendationComments"
              control={control}
              rules={{
                validate: (value) => {
                  const rec = getValues("businessRecommendation");
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
                    className={`${SMRC_LABEL_CLASS} ${errors.businessRecommendationComments?.message ? "text-[#e20a0a]" : ""}`}
                  >
                    <span className="text-[#e20a0a]">*</span>{" "}
                    {recNum > 4 ? "What could have made your experience better" : "What went wrong"}
                    ? (Select all that apply)
                  </Label>
                  <div className="flex flex-col gap-2 mt-2.5">
                    {[...lowRecs, "Other"].map((option) => (
                      <SMRCCheckbox
                        key={option}
                        label={option}
                        checked={!!(value as string[] | undefined)?.includes?.(option)}
                        onChange={() => onChangeCheckboxes(option)}
                        disabled={!!defaultSmrc}
                        hasError={!!errors.businessRecommendationComments?.message}
                      />
                    ))}
                  </div>
                  {errors.businessRecommendationComments?.message && (
                    <p className={SMRC_ERROR_CLASS}>
                      {String(errors.businessRecommendationComments.message)}
                    </p>
                  )}
                  {(value as string[] | undefined)?.includes?.("Other") && (
                    <TextCountingField
                      label="Explanation"
                      name="businessRecommendationCommentExplanation"
                      limit={5000}
                      disabled={!!defaultSmrc}
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
              name="businessRecommendationComment"
              limit={5000}
              disabled={!!defaultSmrc}
            />
          )}
        </>
      )}
    </div>
  );
}
