"use client";

import { useCallback, useMemo } from "react";
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
import { AgencyLevel, DeliveryMethod, RequestStatus, ContactMethod, TimeAtResidence } from "@/lib/firebase/smrc-types";
import TextCountingField from "./TextCountingField";
import dayjs from "dayjs";
import Recommendation from "./Recommendation";
import OwnBusiness from "./OwnBusiness";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { validateAgencyWebsiteUrl } from "@/utils/url";

/** Radio: matches GovUNLEASHED styled Radio (flex column, row-gap 5px, 20px circle, 10px inner dot) */
function GovYesNoRadio({
  name,
  value,
  label,
  checked,
  onChange,
  disabled,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}) {
  return (
    <label className="group relative flex cursor-pointer flex-col items-center gap-[5px] text-[#38464d] text-lg">
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
      <span>{label}</span>
    </label>
  );
}

/** Format raw digits to (123) 456-7890 as user types */
function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

interface PrivateFeedbackFieldsProps {
  isValidating: boolean;
  locations: {
    loading: boolean;
    states: LocationOption[];
    cities: LocationOption[];
    zips: LocationOption[];
  };
  defaultSmrc?: SMRC | null;
  isPreviousResidence: boolean;
  notResident: boolean;
}

export default function PrivateFeedbackFields({
  isValidating,
  locations,
  defaultSmrc,
  isPreviousResidence,
  notResident,
}: PrivateFeedbackFieldsProps) {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<SMRCFormInputFields>();
  const deliveryMethod = watch("deliveryMethod");
  const agencyName = watch("agencyName");
  const agencyLevel = watch("agencyLevel");
  const contactedByGovernmentMethod = watch("contactedByGovernmentMethod");
  const watchedLocationState = watch("locationState");
  const watchedLocationCity = watch("locationCity");
  const endDate = watch("endDate");
  const timeAtResidence = watch("timeAtResidence");

  /** For "Previous Residence": min = start of (endDate - 3/12/36 months), max = end of endDate month. Matches GovUNLEASHED. */
  const serviceReceivedDateDisabledDate = useCallback(
    (current: ReturnType<typeof dayjs> | null) => {
      if (!current) return false;
      const d = dayjs(current).format("YYYY-MM-DD");
      if (isPreviousResidence && endDate && dayjs(endDate, "YYYY-MM", true).isValid()) {
        const endMonth = dayjs(endDate + "-01");
        const maxDate = endMonth.endOf("month").format("YYYY-MM-DD");
        if (d > maxDate) return true;
        const monthsBack =
          timeAtResidence === TimeAtResidence.LESS_THAN_3_MONTHS
            ? 3
            : timeAtResidence === TimeAtResidence.BETWEEN_3_12_MONTHS
              ? 12
              : timeAtResidence === TimeAtResidence.BETWEEN_12_36_MONTHS
                ? 36
                : 0;
        if (monthsBack === 0) return false; // MORE_THAN_36_MONTHS: no min
        const minDate = endMonth.subtract(monthsBack, "month").format("YYYY-MM-DD");
        return d < minDate;
      }
      if (notResident) {
        const today = dayjs().format("YYYY-MM-DD");
        return d > today;
      }
      const today = dayjs().format("YYYY-MM-DD");
      if (d > today) return true;
      const monthsBack =
        timeAtResidence === TimeAtResidence.LESS_THAN_3_MONTHS
          ? 3
          : timeAtResidence === TimeAtResidence.BETWEEN_3_12_MONTHS
            ? 12
            : timeAtResidence === TimeAtResidence.BETWEEN_12_36_MONTHS
              ? 36
              : 0;
      if (monthsBack === 0) return false;
      const minDate = dayjs().subtract(monthsBack, "month").format("YYYY-MM-DD");
      return d < minDate;
    },
    [isPreviousResidence, notResident, endDate, timeAtResidence],
  );

  const validateServiceReceivedDate = useCallback(
    (val: string) => {
      if (!val) return "Field is required";
      const d = dayjs(val, "YYYY-MM-DD", true);
      if (!d.isValid()) return "Invalid date";
      const dateStr = d.format("YYYY-MM-DD");
      if (isPreviousResidence && endDate && dayjs(endDate, "YYYY-MM", true).isValid()) {
        const endMonth = dayjs(endDate + "-01");
        const maxDate = endMonth.endOf("month").format("YYYY-MM-DD");
        if (dateStr > maxDate) return "Date is out of allowed range";
        const monthsBack =
          timeAtResidence === TimeAtResidence.LESS_THAN_3_MONTHS
            ? 3
            : timeAtResidence === TimeAtResidence.BETWEEN_3_12_MONTHS
              ? 12
              : timeAtResidence === TimeAtResidence.BETWEEN_12_36_MONTHS
                ? 36
                : 0;
        if (monthsBack > 0) {
          const minDate = endMonth.subtract(monthsBack, "month").format("YYYY-MM-DD");
          if (dateStr < minDate) return "Date is out of allowed range";
        }
      }
      return true;
    },
    [isPreviousResidence, endDate, timeAtResidence],
  );

  /** When previous residence: open calendar to endDate month. */
  const serviceReceivedDatePickerValue = useMemo(() => {
    if (isPreviousResidence && endDate && dayjs(endDate, "YYYY-MM", true).isValid())
      return dayjs(endDate + "-01");
    return dayjs();
  }, [isPreviousResidence, endDate]);

  const onChangeField = (name: keyof SMRCFormInputFields, value: unknown) => {
    setValue(name, value as never, { shouldValidate: true });
  };

  const locationStatesOptions = useMemo(() => {
    const opts = locations.states ?? [];
    return [{ label: "Select", value: "no_option", disabled: true }, ...opts];
  }, [locations.states]);

  const locationCitiesOptions = useMemo(() => {
    const list = (locations.cities ?? []).filter(
      (el) =>
        el.value === "no_option" ||
        (el as LocationOption & { state?: string }).state === watchedLocationState,
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
  }, [watchedLocationState, locations.cities]);

  const locationZipCodesOptions = useMemo(() => {
    const cityPart = watchedLocationCity?.split("/")?.[1];
    return [
      { label: "Select", value: "no_option", disabled: true },
      ...(locations.zips ?? []).filter(
        (el) =>
          el.value === "no_option" ||
          ((el as LocationOption & { city?: string; state?: string }).city === cityPart &&
            (el as LocationOption & { state?: string }).state === watchedLocationState),
      ),
    ];
  }, [watchedLocationState, watchedLocationCity, locations.zips]);

  return (
    <div className="space-y-6">
      <p className="text-[#38464d] text-lg">
        Please provide details on your public service interaction(s). This information is shared
        with the government agency.
      </p>
      <p className="text-[#38464d] text-sm -mt-4">
        <span className="text-[#e20a0a]">*</span> indicates required field
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[30px]">
        <div className="space-y-0">
          <Label className={SMRC_LABEL_CLASS}>
            <span className="text-[#e20a0a]">*</span> Date Public Service Requested
          </Label>
          <Controller
            name="serviceReceivedDate"
            control={control}
            rules={{ required: "Field is required", validate: validateServiceReceivedDate }}
            render={({ field }) => (
              <DatePicker
                format="DD-MMM-YYYY"
                style={{ width: "100%" }}
                value={field.value ? dayjs(field.value) : null}
                placeholder="Select date"
                disabled={!!defaultSmrc}
                status={errors.serviceReceivedDate ? "error" : undefined}
                defaultPickerValue={serviceReceivedDatePickerValue}
                disabledDate={serviceReceivedDateDisabledDate}
                onChange={(val) => field.onChange(val ? dayjs(val).format("YYYY-MM-DD") : "")}
              />
            )}
          />
          {errors.serviceReceivedDate?.message && (
            <p className={SMRC_ERROR_CLASS}>{String(errors.serviceReceivedDate.message)}</p>
          )}
        </div>
        <div className="space-y-0 min-w-0">
          <Label className={SMRC_LABEL_WITH_ICON_CLASS} title="Public Service Delivery Method">
            <span className="min-w-0 truncate">
              <span className="text-[#e20a0a]">*</span> Public Service Delivery Method
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
                  Use this drop-down list to describe how you received the requested public
                  service(s).
                  <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Controller
            name="deliveryMethod"
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
                disabled={!!defaultSmrc}
                status={errors.deliveryMethod ? "error" : undefined}
                options={[
                  { label: "Select", value: "no_option", disabled: true },
                  { label: "In-Person", value: DeliveryMethod.IN_PERSON },
                  { label: "Online (incl. Chat)", value: DeliveryMethod.ONLINE },
                  { label: "Phone", value: DeliveryMethod.PHONE },
                  { label: "E-mail", value: DeliveryMethod.EMAIL },
                ]}
              />
            )}
          />
          {errors.deliveryMethod?.message && (
            <p className={SMRC_ERROR_CLASS}>{String(errors.deliveryMethod.message)}</p>
          )}
        </div>
        <div className="space-y-0 min-w-0">
          <Label className={SMRC_LABEL_WITH_ICON_CLASS} title="Status of Public Service Request">
            <span className="min-w-0 truncate">
              <span className="text-[#e20a0a]">*</span> Status of Public Service Request
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
                  Describe to what extent your public service request was fulfilled.
                  <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Controller
            name="requestStatus"
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
                disabled={!!defaultSmrc}
                status={errors.requestStatus ? "error" : undefined}
                options={[
                  { label: "Select", value: "no_option", disabled: true },
                  { label: "In Progress", value: RequestStatus.IN_PROGRESS },
                  { label: "Completed", value: RequestStatus.COMPLETED },
                  { label: "Disputed", value: RequestStatus.DISPUTED },
                  { label: "Not Sure", value: RequestStatus.NOT_SURE },
                  { label: "Other", value: RequestStatus.OTHER },
                ]}
              />
            )}
          />
          {errors.requestStatus?.message && (
            <p className={SMRC_ERROR_CLASS}>{String(errors.requestStatus.message)}</p>
          )}
        </div>
      </div>

      {deliveryMethod === DeliveryMethod.ONLINE && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[30px]">
          <div className="space-y-0 md:col-span-1 min-w-0">
            <Label className={SMRC_LABEL_WITH_ICON_CLASS} title="Name of Agency Representative">
              <span className="min-w-0 truncate">
                <span className="text-[#e20a0a]">*</span> Name of Agency Representative
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
                    Identify (first name and last initial acceptable) the public service worker(s)
                    with whom you interacted.
                    <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              placeholder="Person Providing Service"
              disabled={!!defaultSmrc}
              {...register("representativeName", {
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.ONLINE
                    ? !!v?.trim() || "Field is required"
                    : true,
              })}
              className={`${SMRC_INPUT_CLASS} ${errors.representativeName ? "border-destructive" : ""}`}
            />
            {errors.representativeName?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.representativeName.message)}</p>
            )}
          </div>
          <div className="space-y-0 md:col-span-2">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-[#e20a0a]">*</span> Agency Website
            </Label>
            <Input
              type="text"
              placeholder="Website URL"
              disabled={!!defaultSmrc}
              {...register("agencyWebsite", {
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.ONLINE
                    ? validateAgencyWebsiteUrl(v, true)
                    : true,
              })}
              className={`${SMRC_INPUT_CLASS} ${errors.agencyWebsite ? "border-destructive" : ""}`}
            />
            {errors.agencyWebsite?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.agencyWebsite.message)}</p>
            )}
          </div>
        </div>
      )}

      {deliveryMethod === DeliveryMethod.IN_PERSON && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[30px]">
          <div className="space-y-0 md:col-span-1 min-w-0">
            <Label className={SMRC_LABEL_WITH_ICON_CLASS} title="Name of Agency Representative">
              <span className="min-w-0 truncate">
                <span className="text-[#e20a0a]">*</span> Name of Agency Representative
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
                    Identify (first name and last initial acceptable) the public service worker(s)
                    with whom you interacted.
                    <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              placeholder="Person Providing Service"
              disabled={!!defaultSmrc}
              {...register("representativeName", {
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.IN_PERSON
                    ? !!v?.trim() || "Field is required"
                    : true,
              })}
              className={`${SMRC_INPUT_CLASS} ${errors.representativeName ? "border-destructive" : ""}`}
            />
            {errors.representativeName?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.representativeName.message)}</p>
            )}
          </div>
        </div>
      )}

      {deliveryMethod === DeliveryMethod.EMAIL && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[30px]">
          <div className="space-y-0 min-w-0">
            <Label
              className={SMRC_LABEL_WITH_ICON_CLASS}
              title="Name of Agency Representative"
            >
              <span className="min-w-0 truncate">
                <span className="text-[#e20a0a]">*</span> Name of Agency Representative
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
                    Identify (first name and last initial acceptable) the public service worker(s)
                    with whom you interacted.
                    <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              placeholder="Person Providing Service"
              disabled={!!defaultSmrc}
              {...register("representativeName", {
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.EMAIL
                    ? !!v?.trim() || "Field is required"
                    : true,
              })}
              className={`${SMRC_INPUT_CLASS} ${errors.representativeName ? "border-destructive" : ""}`}
            />
            {errors.representativeName?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.representativeName.message)}</p>
            )}
          </div>
          <div className="space-y-0 min-w-0">
            <Label className={SMRC_LABEL_CLASS} title="Representative's E-mail">
              <span className="text-[#e20a0a]">*</span> Representative&apos;s E-mail
            </Label>
            <Input
              type="email"
              disabled={!!defaultSmrc}
              {...register("representativeEmail", {
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.EMAIL
                    ? (!!v?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ||
                      "Valid email required"
                    : true,
              })}
              className={`${SMRC_INPUT_CLASS} ${errors.representativeEmail ? "border-destructive" : ""}`}
            />
            {errors.representativeEmail?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.representativeEmail.message)}</p>
            )}
          </div>
          <div className="space-y-0 min-w-0">
            <Label className={SMRC_LABEL_CLASS} title="Date Last E-mail Received">
              <span className="text-[#e20a0a]">*</span> Date Last E-mail Received
            </Label>
            <Controller
              name="dateLastEmailReceived"
              control={control}
              rules={{
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.EMAIL ? !!v || "Field is required" : true,
              }}
              render={({ field }) => (
                <DatePicker
                  format="DD-MMM-YYYY"
                  style={{ width: "100%" }}
                  value={field.value ? dayjs(field.value) : null}
                  placeholder="Select date"
                  disabled={!!defaultSmrc}
                  status={errors.dateLastEmailReceived ? "error" : undefined}
                  onChange={(val) => field.onChange(val ? dayjs(val).format("YYYY-MM-DD") : "")}
                />
              )}
            />
            {errors.dateLastEmailReceived?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.dateLastEmailReceived.message)}</p>
            )}
          </div>
        </div>
      )}

      {deliveryMethod === DeliveryMethod.PHONE && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[30px]">
          <div className="space-y-0 min-w-0">
            <Label className={SMRC_LABEL_WITH_ICON_CLASS} title="Name of Agency Representative">
              <span className="min-w-0 truncate">
                <span className="text-[#e20a0a]">*</span> Name of Agency Representative
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
                    Identify (first name and last initial acceptable) the public service worker(s)
                    with whom you interacted.
                    <TooltipArrow width={10} height={5} className="fill-[#1f2937]" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              placeholder="Person Providing Service"
              disabled={!!defaultSmrc}
              {...register("representativeName", {
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.PHONE
                    ? !!v?.trim() || "Field is required"
                    : true,
              })}
              className={`${SMRC_INPUT_CLASS} ${errors.representativeName ? "border-destructive" : ""}`}
            />
            {errors.representativeName?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.representativeName.message)}</p>
            )}
          </div>
          <div className="space-y-0">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-[#e20a0a]">*</span> Representative Phone
            </Label>
            <Controller
              name="representativePhone"
              control={control}
              rules={{
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.PHONE
                    ? !!v?.trim() || "Field is required"
                    : true,
              }}
              render={({ field }) => (
                <Input
                  placeholder="(123) 456-7890"
                  disabled={!!defaultSmrc}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
                  onBlur={field.onBlur}
                  className={`${SMRC_INPUT_CLASS} ${errors.representativePhone ? "border-destructive" : ""}`}
                />
              )}
            />
            {errors.representativePhone?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.representativePhone.message)}</p>
            )}
          </div>
          <div className="space-y-0">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-[#e20a0a]">*</span> Date Last Phone Contact
            </Label>
            <Controller
              name="dateLastPhoneContact"
              control={control}
              rules={{
                validate: (v) =>
                  deliveryMethod === DeliveryMethod.PHONE ? !!v || "Field is required" : true,
              }}
              render={({ field }) => (
                <DatePicker
                  format="DD-MMM-YYYY"
                  style={{ width: "100%" }}
                  value={field.value ? dayjs(field.value) : null}
                  placeholder="Select date"
                  disabled={!!defaultSmrc}
                  status={errors.dateLastPhoneContact ? "error" : undefined}
                  onChange={(val) => field.onChange(val ? dayjs(val).format("YYYY-MM-DD") : "")}
                />
              )}
            />
            {errors.dateLastPhoneContact?.message && (
              <p className={SMRC_ERROR_CLASS}>{String(errors.dateLastPhoneContact.message)}</p>
            )}
          </div>
        </div>
      )}

      {deliveryMethod === DeliveryMethod.IN_PERSON && (
        <>
          <div className="mt-[30px]">
            <Label className={SMRC_LABEL_CLASS} style={{ fontSize: "22px", margin: 0 }}>
              Agency&apos;s Office Address
            </Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-0">
              <Label className={SMRC_LABEL_CLASS}>
                <span className="text-[#e20a0a]">*</span> Street Address 1
              </Label>
              <Input
                disabled={!!defaultSmrc}
                {...register("locationStreetAddressOne", {
                  validate: (v) =>
                    deliveryMethod === DeliveryMethod.IN_PERSON
                      ? !!v?.trim() || "Field is required"
                      : true,
                })}
                className={`${SMRC_INPUT_CLASS} ${errors.locationStreetAddressOne ? "border-destructive" : ""}`}
              />
              {errors.locationStreetAddressOne?.message && (
                <p className={SMRC_ERROR_CLASS}>
                  {String(errors.locationStreetAddressOne.message)}
                </p>
              )}
            </div>
            <div className="space-y-0">
              <Label className={SMRC_LABEL_CLASS}>Street Address 2</Label>
              <Input
                disabled={!!defaultSmrc}
                {...register("locationStreetAddressTwo")}
                className={SMRC_INPUT_CLASS}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-0">
              <Label className={SMRC_LABEL_CLASS}>
                <span className="text-[#e20a0a]">*</span> State
              </Label>
              <Controller
                name="locationState"
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
                      setValue("locationCity", "no_option", { shouldValidate: false });
                      setValue("locationZipCode", "no_option", { shouldValidate: false });
                    }}
                    disabled={!!defaultSmrc}
                    loading={locations.loading}
                    showSearch
                    optionFilterProp="label"
                    options={locationStatesOptions}
                    status={errors.locationState ? "error" : undefined}
                  />
                )}
              />
              {errors.locationState?.message && (
                <p className={SMRC_ERROR_CLASS}>{String(errors.locationState.message)}</p>
              )}
            </div>
            <div className="space-y-0">
              <Label className={SMRC_LABEL_CLASS}>
                <span className="text-[#e20a0a]">*</span> City
              </Label>
              <Controller
                name="locationCity"
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
                      setValue("locationZipCode", "no_option", { shouldValidate: false });
                    }}
                    disabled={
                      !!defaultSmrc || !watchedLocationState || watchedLocationState === "no_option"
                    }
                    loading={locations.loading}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input: string, option?: { label?: string }) =>
                      ((option?.label ?? "").toString().split("/")?.[1] ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={locationCitiesOptions}
                    status={errors.locationCity ? "error" : undefined}
                  />
                )}
              />
              {errors.locationCity?.message && (
                <p className={SMRC_ERROR_CLASS}>{String(errors.locationCity.message)}</p>
              )}
            </div>
            <div className="space-y-0">
              <Label className={SMRC_LABEL_CLASS}>
                <span className="text-[#e20a0a]">*</span> Zip Code
              </Label>
              <Controller
                name="locationZipCode"
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
                    disabled={
                      !!defaultSmrc || !watchedLocationCity || watchedLocationCity === "no_option"
                    }
                    loading={locations.loading}
                    showSearch
                    optionFilterProp="label"
                    options={locationZipCodesOptions}
                    status={errors.locationZipCode ? "error" : undefined}
                  />
                )}
              />
              {errors.locationZipCode?.message && (
                <p className={SMRC_ERROR_CLASS}>{String(errors.locationZipCode.message)}</p>
              )}
            </div>
          </div>
        </>
      )}

      <TextCountingField
        label={
          <>
            <span className="text-[#e20a0a]">*</span> Short Description of Public Service Requested
          </>
        }
        name="shortDescription"
        limit={500}
        rules={{ required: "Field is required" }}
        disabled={!!defaultSmrc}
      />

      <Recommendation
        isValidating={isValidating}
        onChangeField={onChangeField}
        defaultSmrc={defaultSmrc}
      />

      <OwnBusiness isValidating={isValidating} defaultSmrc={defaultSmrc} />

      <div className="space-y-0 mt-[30px]">
        <Label className={SMRC_LABEL_CLASS}>
          <span className="text-[#e20a0a]">*</span> Would you like someone from
          {agencyLevel !== AgencyLevel.COUNTY ? " the" : ""} <b>{agencyName || "the agency"}</b> to
          contact you regarding your public service experience?
        </Label>
        <Controller
          name="contactedByGovernment"
          control={control}
          rules={{ required: "Field is required" }}
          render={({ field }) => (
            <div
              className="flex gap-[30px] mt-2.5"
              role="radiogroup"
              aria-label="Contact by government"
            >
              <GovYesNoRadio
                name="contactedByGovernment"
                value="yes"
                label="Yes"
                checked={field.value === "yes"}
                onChange={() => field.onChange("yes")}
                disabled={!!defaultSmrc}
              />
              <GovYesNoRadio
                name="contactedByGovernment"
                value="no"
                label="No"
                checked={field.value === "no"}
                onChange={() => field.onChange("no")}
                disabled={!!defaultSmrc}
              />
            </div>
          )}
        />
        {errors.contactedByGovernment?.message && (
          <p className={SMRC_ERROR_CLASS}>{String(errors.contactedByGovernment.message)}</p>
        )}
      </div>

      {watch("contactedByGovernment") === "yes" && (
        <>
          <div className="space-y-0 mt-[30px]">
            <Label className={SMRC_LABEL_CLASS}>
              <span className="text-[#e20a0a]">*</span> What is your preferred contact method?
            </Label>
            <Controller
              name="contactedByGovernmentMethod"
              control={control}
              rules={{
                validate: (v) =>
                  watch("contactedByGovernment") === "yes"
                    ? (v !== "no_option" && !!v) || "Field is required"
                    : true,
              }}
              render={({ field }) => (
                <div
                  className="flex gap-[30px] mt-2.5"
                  role="radiogroup"
                  aria-label="Preferred contact method"
                >
                  <GovYesNoRadio
                    name="contactedByGovernmentMethod"
                    value={ContactMethod.PHONE}
                    label="Phone"
                    checked={field.value === ContactMethod.PHONE}
                    onChange={() => field.onChange(ContactMethod.PHONE)}
                    disabled={!!defaultSmrc}
                  />
                  <GovYesNoRadio
                    name="contactedByGovernmentMethod"
                    value={ContactMethod.EMAIL}
                    label="E-mail"
                    checked={field.value === ContactMethod.EMAIL}
                    onChange={() => field.onChange(ContactMethod.EMAIL)}
                    disabled={!!defaultSmrc}
                  />
                </div>
              )}
            />
            {errors.contactedByGovernmentMethod?.message && (
              <p className={SMRC_ERROR_CLASS}>
                {String(errors.contactedByGovernmentMethod.message)}
              </p>
            )}
          </div>

          {contactedByGovernmentMethod === ContactMethod.PHONE && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[30px]">
              <div className="space-y-0">
                <Label className={SMRC_LABEL_CLASS}>
                  <span className="text-[#e20a0a]">*</span> Phone
                </Label>
                <Controller
                  name="contactedByGovernmentPhone"
                  control={control}
                  rules={{
                    validate: (v) =>
                      contactedByGovernmentMethod === ContactMethod.PHONE
                        ? (!!v?.trim() && /^\(\d{3}\)\d{3}-\d{4}$/.test(v.replace(/\s/g, ""))) ||
                          "Use (123) 456-7890 format"
                        : true,
                  }}
                  render={({ field }) => (
                    <Input
                      placeholder="(123) 456-7890"
                      disabled={!!defaultSmrc}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
                      onBlur={field.onBlur}
                      className={`${SMRC_INPUT_CLASS} ${errors.contactedByGovernmentPhone ? "border-destructive" : ""}`}
                    />
                  )}
                />
                {errors.contactedByGovernmentPhone?.message && (
                  <p className={SMRC_ERROR_CLASS}>
                    {String(errors.contactedByGovernmentPhone.message)}
                  </p>
                )}
              </div>
              <div className="space-y-0">
                <Label className={SMRC_LABEL_CLASS}>
                  <span className="text-[#e20a0a]">*</span> Best Time To Call
                </Label>
                <Input
                  placeholder="e.g. M-F 9am-5pm"
                  disabled={!!defaultSmrc}
                  {...register("contactedByGovernmentPhoneTime", {
                    validate: (v) =>
                      contactedByGovernmentMethod === ContactMethod.PHONE
                        ? !!v?.trim() || "Field is required"
                        : true,
                  })}
                  className={`${SMRC_INPUT_CLASS} ${errors.contactedByGovernmentPhoneTime ? "border-destructive" : ""}`}
                />
                {errors.contactedByGovernmentPhoneTime?.message && (
                  <p className={SMRC_ERROR_CLASS}>
                    {String(errors.contactedByGovernmentPhoneTime.message)}
                  </p>
                )}
              </div>
            </div>
          )}

          {contactedByGovernmentMethod === ContactMethod.EMAIL && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[30px]">
              <div className="space-y-0">
                <Label className={SMRC_LABEL_CLASS}>
                  <span className="text-[#e20a0a]">*</span> E-mail
                </Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  disabled={!!defaultSmrc}
                  {...register("contactedByGovernmentEmail", {
                    validate: (v) =>
                      contactedByGovernmentMethod === ContactMethod.EMAIL
                        ? (!!v?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ||
                          "Valid email required"
                        : true,
                  })}
                  className={`${SMRC_INPUT_CLASS} ${errors.contactedByGovernmentEmail ? "border-destructive" : ""}`}
                />
                {errors.contactedByGovernmentEmail?.message && (
                  <p className={SMRC_ERROR_CLASS}>
                    {String(errors.contactedByGovernmentEmail.message)}
                  </p>
                )}
              </div>
              <div className="space-y-0">
                <Label className={SMRC_LABEL_CLASS}>
                  <span className="text-[#e20a0a]">*</span> Confirm E-mail
                </Label>
                <Input
                  type="email"
                  placeholder="Confirm E-mail"
                  disabled={!!defaultSmrc}
                  {...register("contactedByGovernmentConfirmEmail", {
                    validate: (v) => {
                      if (contactedByGovernmentMethod !== ContactMethod.EMAIL) return true;
                      const email = watch("contactedByGovernmentEmail");
                      return (!!v?.trim() && v === email) || "E-mails must match";
                    },
                  })}
                  className={`${SMRC_INPUT_CLASS} ${errors.contactedByGovernmentConfirmEmail ? "border-destructive" : ""}`}
                />
                {errors.contactedByGovernmentConfirmEmail?.message && (
                  <p className={SMRC_ERROR_CLASS}>
                    {String(errors.contactedByGovernmentConfirmEmail.message)}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
