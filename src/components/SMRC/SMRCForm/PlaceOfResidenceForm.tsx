"use client";

import { useCallback, useEffect, useMemo, type Dispatch, type SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker, Select } from "antd";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type SMRCFormInputFields,
  SMRC_LABEL_CLASS,
  SMRC_LABEL_WITH_ICON_CLASS,
  SMRC_INPUT_CLASS,
  SMRC_ANT_SELECT_STYLE,
  SMRC_ERROR_CLASS,
} from "./helper";
import type { SMRC } from "@/types/smrc";
import type { LocationOption } from "@/types/smrc";
import { AgencyLevel, LengthOfVisit, ResidenceType, TimeAtResidence } from "@/lib/firebase/smrc-types";
import { CheckCircle, Info, Loader2, XCircle } from "lucide-react";
import dayjs from "dayjs";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getSmrcApiBase } from "@/lib/smrc-api";

interface PlaceOfResidenceFormProps {
  isPreviousResidence: boolean;
  notResident: boolean;
  isValidating: boolean;
  locations: {
    loading: boolean;
    states: LocationOption[];
    cities: LocationOption[];
    zips: LocationOption[];
  };
  agencyLevelIsValid: {
    isChecking: boolean;
    isChecked: boolean;
    isValid: boolean;
    error: string;
  };
  setAgencyLevelIsValid: Dispatch<
    SetStateAction<{
      isChecking: boolean;
      isChecked: boolean;
      isValid: boolean;
      error: string;
    }>
  >;
  defaultSmrc?: SMRC | null;
}

export default function PlaceOfResidenceForm({
  isPreviousResidence,
  notResident,
  locations,
  agencyLevelIsValid,
  setAgencyLevelIsValid,
  defaultSmrc,
}: PlaceOfResidenceFormProps) {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<SMRCFormInputFields>();
  const watchedState = watch("state");
  const watchedCity = watch("city");
  const watchedZipCode = watch("zipCode");
  const agencyLevel = watch("agencyLevel");
  const agencyName = watch("agencyName");
  const lengthOfVisit = watch("lengthOfVisit");

  useEffect(() => {
    if (!agencyLevel || agencyLevel === "no_option" || !agencyName?.trim() || defaultSmrc) return;
    let cancelled = false;
    setAgencyLevelIsValid({
      isChecking: true,
      isChecked: false,
      isValid: false,
      error: "",
    });
    fetch(`${getSmrcApiBase()}/validate-agency-level-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ agencyLevel, agencyName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setAgencyLevelIsValid({
          isChecking: false,
          isChecked: true,
          isValid: data.valid !== false,
          error: data.message ?? "",
        });
      })
      .catch(() => {
        if (!cancelled)
          setAgencyLevelIsValid({
            isChecking: false,
            isChecked: true,
            isValid: false,
            error: "Error checking agency",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [agencyLevel, agencyName, defaultSmrc, setAgencyLevelIsValid]);

  const changeAgencyLevel = useCallback(
    (value: string) => {
      if (!watchedState || !watchedCity || value === "no_option") return;
      const cityPart = watchedCity?.split("County/")?.[1]?.trim() ?? "";
      const countyPart = watchedCity?.split("County/")?.[0]?.trim() ?? "";
      const agencyName =
        value === AgencyLevel.COUNTY
          ? `${countyPart} County`
          : value === AgencyLevel.CITY
            ? `City of ${cityPart} (${watchedZipCode})`
            : `State of ${watchedState}`;
      setValue("agencyLevel", value as SMRCFormInputFields["agencyLevel"], {
        shouldValidate: false,
      });
      setValue("agencyName", agencyName, { shouldValidate: false });
    },
    [watchedState, watchedCity, watchedZipCode, setValue],
  );

  const statesOptions = useMemo(() => {
    const opts = locations.states ?? [];
    return [{ label: "Select", value: "no_option", disabled: true }, ...opts];
  }, [locations.states]);

  const citiesOptions = useMemo(() => {
    const list = (locations.cities ?? []).filter(
      (el) => el.value === "no_option" || (el as LocationOption & { state?: string }).state === watchedState,
    );
    return [
      { label: "Select", value: "no_option", disabled: true },
      ...list.map((el, i) =>
        i === 0
          ? el
          : {
              ...el,
              label: `${(el as LocationOption & { county?: string }).county ?? ""} County/${el.label}`,
              value: `${(el as LocationOption & { county?: string }).county ?? ""} County/${el.value}`,
            },
      ),
    ];
  }, [watchedState, locations.cities]);

  const zipCodesOptions = useMemo(() => {
    const cityPart = watchedCity?.split("/")?.[1];
    return [
      { label: "Select", value: "no_option", disabled: true },
      ...(locations.zips ?? []).filter(
        (el) =>
          el.value === "no_option" ||
          ((el as LocationOption & { city?: string; state?: string }).city === cityPart &&
            (el as LocationOption & { state?: string }).state === watchedState),
      ),
    ];
  }, [watchedState, watchedCity, locations.zips]);

  const timeAtResidenceOptions = useMemo(
    () => [
      { label: "Select", value: "no_option", disabled: true },
      ...Object.entries(TimeAtResidence).map(([_, v]) => ({
        label: v,
        value: v,
      })),
    ],
    [],
  );
  const residenceTypeOptions = useMemo(
    () => [
      { label: "Select", value: "no_option", disabled: true },
      ...Object.entries(ResidenceType).map(([_, v]) => ({
        label: v,
        value: v,
      })),
    ],
    [],
  );
  const lengthOfVisitOptions = useMemo(
    () => [
      { label: "Select", value: "no_option", disabled: true },
      ...Object.entries(LengthOfVisit).map(([_, v]) => ({
        label: v,
        value: v,
      })),
    ],
    [],
  );
  const agencyLevelOptions = useMemo(
    () => [
      { label: "Select", value: "no_option", disabled: true },
      { label: "City", value: AgencyLevel.CITY },
      { label: "County", value: AgencyLevel.COUNTY },
      { label: "State", value: AgencyLevel.STATE },
    ],
    [],
  );

  const isResidenceDisabled = !!defaultSmrc;
  const isLocationDisabled =
    isResidenceDisabled ||
    !watchedState ||
    watchedState === "no_option" ||
    !watchedCity ||
    watchedCity === "no_option" ||
    !watchedZipCode ||
    watchedZipCode === "no_option";

  return (
    <div className="space-y-6">
      {isPreviousResidence && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-0">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-destructive">*</span> Last Month at Previous Residence
            </Label>
            <Controller
              name="endDate"
              control={control}
              rules={{ required: "Field is required" }}
              render={({ field }) => (
                <DatePicker
                  picker="month"
                  format="MMMM YYYY"
                  style={{ width: "100%" }}
                  value={
                    field.value && dayjs(field.value, "YYYY-MM", true).isValid() ? dayjs(field.value, "YYYY-MM") : null
                  }
                  placeholder="Select month"
                  disabled={isResidenceDisabled}
                  status={errors.endDate ? "error" : undefined}
                  onChange={(val) => field.onChange(val ? dayjs(val).format("YYYY-MM") : "")}
                />
              )}
            />
            {errors.endDate?.message && <p className={SMRC_ERROR_CLASS}>{String(errors.endDate.message)}</p>}
          </div>
          <div className="space-y-0">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-destructive">*</span> Length of Time at Previous Residence
            </Label>
            <Controller
              name="timeAtResidence"
              control={control}
              rules={{
                required: "Field is required",
                validate: (v) => v !== "no_option" || "Field is required",
              }}
              render={({ field }) => (
                <Select
                  style={SMRC_ANT_SELECT_STYLE}
                  value={field.value ?? "no_option"}
                  onChange={(v: string) => {
                    field.onChange(v);
                    setValue("serviceReceivedDate", "");
                  }}
                  disabled={isResidenceDisabled}
                  options={timeAtResidenceOptions}
                  status={errors.timeAtResidence ? "error" : undefined}
                />
              )}
            />
            {errors.timeAtResidence?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.timeAtResidence.message)}</p>
            )}
          </div>
          <div className="space-y-0">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-destructive">*</span> Describe Your Residence
            </Label>
            <Controller
              name="residenceType"
              control={control}
              rules={{
                required: "Field is required",
                validate: (v) => v !== "no_option" || "Field is required",
              }}
              render={({ field }) => (
                <Select
                  style={SMRC_ANT_SELECT_STYLE}
                  value={field.value ?? "no_option"}
                  onChange={(v: string) => field.onChange(v)}
                  disabled={isResidenceDisabled}
                  options={residenceTypeOptions}
                  status={errors.residenceType ? "error" : undefined}
                />
              )}
            />
            {errors.residenceType?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.residenceType.message)}</p>
            )}
          </div>
        </div>
      )}
      {!notResident && !isPreviousResidence && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-0">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-destructive">*</span> Length of Time at Current Residence
            </Label>
            <Controller
              name="timeAtResidence"
              control={control}
              rules={{
                required: "Field is required",
                validate: (v) => v !== "no_option" || "Field is required",
              }}
              render={({ field }) => (
                <Select
                  style={SMRC_ANT_SELECT_STYLE}
                  value={field.value ?? "no_option"}
                  onChange={(v: string) => {
                    field.onChange(v);
                    setValue("serviceReceivedDate", "");
                  }}
                  disabled={isResidenceDisabled}
                  options={timeAtResidenceOptions}
                  status={errors.timeAtResidence ? "error" : undefined}
                />
              )}
            />
            {errors.timeAtResidence?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.timeAtResidence.message)}</p>
            )}
          </div>
          <div className="space-y-0">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-destructive">*</span> Describe Your Residence
            </Label>
            <Controller
              name="residenceType"
              control={control}
              rules={{
                required: "Field is required",
                validate: (v) => v !== "no_option" || "Field is required",
              }}
              render={({ field }) => (
                <Select
                  style={SMRC_ANT_SELECT_STYLE}
                  value={field.value ?? "no_option"}
                  onChange={(v: string) => field.onChange(v)}
                  disabled={isResidenceDisabled}
                  options={residenceTypeOptions}
                  status={errors.residenceType ? "error" : undefined}
                />
              )}
            />
            {errors.residenceType?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.residenceType.message)}</p>
            )}
          </div>
        </div>
      )}
      {notResident && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-0">
              <Label className={SMRC_LABEL_CLASS}>
                <span className="text-destructive">*</span> Date Your Visit Began
              </Label>
              <Controller
                name="visitBeganAt"
                control={control}
                rules={{
                  required: "Field is required",
                  validate: (v) =>
                    !v || v <= new Date().toISOString().slice(0, 10) || "Date should not be in the future",
                }}
                render={({ field }) => (
                  <DatePicker
                    format="DD-MMM-YYYY"
                    style={{ width: "100%" }}
                    value={field.value ? dayjs(field.value) : null}
                    placeholder="Select date"
                    disabled={isResidenceDisabled}
                    status={errors.visitBeganAt ? "error" : undefined}
                    disabledDate={(current) => (current ? current > dayjs().endOf("day") : false)}
                    onChange={(val) => field.onChange(val ? dayjs(val).format("YYYY-MM-DD") : "")}
                  />
                )}
              />
              {errors.visitBeganAt?.message && (
                <p className={SMRC_ERROR_CLASS}>{String(errors.visitBeganAt.message)}</p>
              )}
            </div>
            <div className="space-y-0">
              <Label className={SMRC_LABEL_CLASS}>
                <span className="text-destructive">*</span> Length of Visit
              </Label>
              <Controller
                name="lengthOfVisit"
                control={control}
                rules={{
                  required: "Field is required",
                  validate: (v) => v !== "no_option" || "Field is required",
                }}
                render={({ field }) => (
                  <Select
                    style={SMRC_ANT_SELECT_STYLE}
                    value={field.value ?? "no_option"}
                    onChange={(v: string) => {
                      field.onChange(v);
                      setValue("serviceReceivedDate", "");
                    }}
                    disabled={isResidenceDisabled}
                    options={lengthOfVisitOptions}
                    status={errors.lengthOfVisit ? "error" : undefined}
                  />
                )}
              />
              {errors.lengthOfVisit?.message && (
                <p className={SMRC_ERROR_CLASS}>{String(errors.lengthOfVisit.message)}</p>
              )}
            </div>
          </div>
          {lengthOfVisit === LengthOfVisit.OTHER && (
            <div className="space-y-0">
              <Label className={SMRC_LABEL_CLASS}>
                <span className="text-destructive">*</span> Number of Days
              </Label>
              <Input
                type="number"
                min={1}
                disabled={isResidenceDisabled}
                {...register("visitDays", { required: "Field is required" })}
                className={`${SMRC_INPUT_CLASS} ${errors.visitDays ? "border-destructive text-destructive" : ""}`}
              />
              {errors.visitDays?.message && <p className={SMRC_ERROR_CLASS}>{String(errors.visitDays.message)}</p>}
            </div>
          )}
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-0">
          <Label className={SMRC_LABEL_CLASS}>
            <span className="text-destructive">*</span> State
          </Label>
          <Controller
            name="state"
            control={control}
            rules={{
              required: "Field is required",
              validate: (v) => v !== "no_option" || "Field is required",
            }}
            render={({ field }) => (
              <Select
                style={SMRC_ANT_SELECT_STYLE}
                value={field.value ?? "no_option"}
                onChange={(v: string) => {
                  field.onChange(v);
                  setValue("city", "no_option", { shouldValidate: false });
                  setValue("zipCode", "no_option", { shouldValidate: false });
                  setValue("agencyLevel", "no_option", {
                    shouldValidate: false,
                  });
                  setValue("agencyName", "", { shouldValidate: false });
                }}
                disabled={isResidenceDisabled}
                loading={locations.loading}
                showSearch
                optionFilterProp="label"
                options={statesOptions}
                status={errors.state ? "error" : undefined}
              />
            )}
          />
          {errors.state?.message && <p className={SMRC_ERROR_CLASS}>{String(errors.state.message)}</p>}
        </div>
        <div className="space-y-0">
          <Label className={SMRC_LABEL_CLASS}>
            <span className="text-destructive">*</span> City
          </Label>
          <Controller
            name="city"
            control={control}
            rules={{
              required: "Field is required",
              validate: (v) => v !== "no_option" || "Field is required",
            }}
            render={({ field }) => (
              <Select
                style={SMRC_ANT_SELECT_STYLE}
                value={field.value ?? "no_option"}
                onChange={(v: string) => {
                  field.onChange(v);
                  setValue("zipCode", "no_option", { shouldValidate: false });
                  setValue("agencyLevel", "no_option", {
                    shouldValidate: false,
                  });
                  setValue("agencyName", "", { shouldValidate: false });
                }}
                disabled={isResidenceDisabled || !watchedState || watchedState === "no_option"}
                loading={locations.loading}
                showSearch
                optionFilterProp="label"
                filterOption={(input: string, option?: { label?: string }) =>
                  (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
                }
                options={citiesOptions}
                status={errors.city ? "error" : undefined}
              />
            )}
          />
          {errors.city?.message && <p className={SMRC_ERROR_CLASS}>{String(errors.city.message)}</p>}
        </div>
        <div className="space-y-0">
          <Label className={SMRC_LABEL_CLASS}>
            <span className="text-destructive">*</span> Zip Code
          </Label>
          <Controller
            name="zipCode"
            control={control}
            rules={{
              required: "Field is required",
              validate: (v) => v !== "no_option" || "Field is required",
            }}
            render={({ field }) => (
              <Select
                style={SMRC_ANT_SELECT_STYLE}
                value={field.value ?? "no_option"}
                onChange={(v: string) => {
                  field.onChange(v);
                  setValue("agencyLevel", "no_option", {
                    shouldValidate: false,
                  });
                  setValue("agencyName", "", { shouldValidate: false });
                }}
                disabled={isResidenceDisabled || !watchedCity || watchedCity === "no_option"}
                loading={locations.loading}
                showSearch
                optionFilterProp="label"
                options={zipCodesOptions}
                status={errors.zipCode ? "error" : undefined}
              />
            )}
          />
          {errors.zipCode?.message && <p className={SMRC_ERROR_CLASS}>{String(errors.zipCode.message)}</p>}
        </div>
      </div>
      <p className="mb-2 text-lg font-medium text-[#38464d]">
        Select the level of government associated with the public service(s) that you received.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-0">
          <Label className={SMRC_LABEL_WITH_ICON_CLASS} title="Government Level">
            <span className="min-w-0 truncate">
              <span className="text-destructive">*</span> Government Level
            </span>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex shrink-0 cursor-help rounded-full p-0.5 text-[#38464d] hover:bg-gray-100"
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
                  Use the drop-down list to select the state or local government that delivered the public service(s).
                  <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Controller
            name="agencyLevel"
            control={control}
            rules={{
              required: "Field is required",
              validate: (v) => v !== "no_option" || "Field is required",
            }}
            render={({ field }) => (
              <Select
                style={SMRC_ANT_SELECT_STYLE}
                value={field.value ?? "no_option"}
                onChange={changeAgencyLevel}
                disabled={isLocationDisabled}
                options={agencyLevelOptions}
                status={errors.agencyLevel ? "error" : undefined}
              />
            )}
          />
          {errors.agencyLevel?.message && <p className={SMRC_ERROR_CLASS}>{String(errors.agencyLevel.message)}</p>}
        </div>
        <div className="md:col-span-2 space-y-0">
          <Label className={SMRC_LABEL_CLASS}>
            <span className="text-destructive">*</span> Government/Municipality
          </Label>
          <Input type="text" disabled value={agencyName ?? ""} className={`${SMRC_INPUT_CLASS} bg-muted`} readOnly />
          {!defaultSmrc && (agencyLevelIsValid.isChecking || agencyLevelIsValid.isChecked) && (
            <div className="pt-[10px] flex items-center gap-2 text-sm text-muted-foreground">
              {agencyLevelIsValid.isChecking && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking government review eligibility...
                </>
              )}
              {!agencyLevelIsValid.isChecking && agencyLevelIsValid.isChecked && (
                <>
                  {agencyLevelIsValid.isValid ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5 shrink-0" aria-hidden />
                      This government level is eligible for review.
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-destructive">
                      <XCircle className="h-5 w-5 shrink-0" aria-hidden />
                      <span className="inline">
                        {(() => {
                          const msg = agencyLevelIsValid.error;
                          const dateMatch = msg.match(
                            /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}(?:st|nd|rd|th) \d{4}/,
                          );
                          if (!dateMatch) return msg;
                          const [fullDate] = dateMatch;
                          const i = msg.indexOf(fullDate);
                          return (
                            <>
                              {msg.slice(0, i)}
                              <span className="underline decoration-destructive underline-offset-1">{fullDate}</span>
                              {msg.slice(i + fullDate.length)}
                            </>
                          );
                        })()}
                      </span>
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
