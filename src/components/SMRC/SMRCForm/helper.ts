/**
 * SMRC Form helper - default values and types.
 * Uses date-fns for formatting; no styled-components.
 * GovUNLEASHED-matching field styles: label 18px/500/#38464d, input/select 50px height, 5px radius, #38464d border.
 */

import { format } from "date-fns";

/** GovUNLEASHED-matching label: block, margin-bottom 10px, font-size 18px, font-weight 500, color #38464d. One line with ellipsis when no space. */
export const SMRC_LABEL_CLASS =
  "block mb-2.5 text-lg font-medium text-[#38464d] min-w-0 truncate";

/** Use for labels that include an info icon: flex one line, text truncates, icon stays visible. Wrap label text in <span className=\"min-w-0 truncate\"> and icon in span with shrink-0. */
export const SMRC_LABEL_WITH_ICON_CLASS =
  "mb-2.5 text-lg font-medium text-[#38464d] flex items-center gap-1 min-w-0";

/** GovUNLEASHED-matching text input: height 50px, border #38464d, on focus 1px outline (no blue) */
export const SMRC_INPUT_CLASS =
  "h-[50px] w-full rounded-[5px] border border-[#38464d] px-2.5 py-2 text-[18px] text-[#38464d] placeholder:text-[#757575] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#38464d] focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";

/** GovUNLEASHED-matching select trigger: min-height 50px, border #38464d, on focus 1px outline (no blue) */
export const SMRC_SELECT_TRIGGER_CLASS =
  "h-[50px] min-h-[50px] w-full rounded-[5px] border border-[#38464d] bg-transparent px-2.5 py-2 text-base text-[#38464d] focus:outline focus:outline-1 focus:outline-[#38464d] focus:outline-offset-0 disabled:opacity-50 [&>span]:text-[#38464d] data-[placeholder]:text-[#757575]";

/** GovUNLEASHED-matching error message: margin-top 7px, color red */
export const SMRC_ERROR_CLASS = "mt-[7px] text-red-500";

/** GovUNLEASHED-matching textarea: border #38464d, on focus 1px outline (no blue) */
export const SMRC_TEXTAREA_CLASS =
  "flex min-h-[150px] w-full rounded-[5px] border border-[#38464d] bg-transparent px-2.5 py-2 text-[18px] text-[#38464d] placeholder:text-[#757575] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#38464d] focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-none";

/** Shared style for antd Select in SMRC form: width 100%, height 50px, font 18px, border #38464d (match GovUNLEASHED UI). Use with className for .ant-select-selector overrides if needed. */
export const SMRC_ANT_SELECT_STYLE: Record<string, string | number> = {
  width: "100%",
  minHeight: 50,
  fontSize: 18,
  lineHeight: 1.5,
  color: "#38464d",
  borderRadius: 5,
};

import type { SMRC, SMRCFormInputFields } from "@/types/smrc";
import type { SMRCDocument } from "@/lib/firebase/smrc-types";
import { normalizeUrl } from "@/utils/url";

export type { SMRCFormInputFields };

export function getSMRCdefaultValues(smrc: SMRCDocument): Partial<SMRCFormInputFields> {
  return {
    ...(smrc.endDate && { endDate: format(new Date(smrc.endDate), "yyyy-MM") }),
    ...(smrc.visitBeganAt && { visitBeganAt: format(new Date(smrc.visitBeganAt), "yyyy-MM") }),
    residenceType: (smrc.residenceType as SMRCFormInputFields["residenceType"]) ?? "no_option",
    timeAtResidence: (smrc.timeAtResidence as SMRCFormInputFields["timeAtResidence"]) ?? "no_option",
    lengthOfVisit: (smrc.lengthOfVisit as SMRCFormInputFields["lengthOfVisit"]) ?? "no_option",
    visitDays: smrc.visitDays?.toString() ?? "",
    state: smrc.state ?? "",
    city: smrc.city ?? "",
    zipCode: smrc.zipCode ?? "",
    currentResidence: smrc.currentResidence ?? false,
    notResident: smrc.notResident ?? false,
    agencyLevel: (smrc.agencyLevel as SMRCFormInputFields["agencyLevel"]) ?? "no_option",
    agencyName: smrc.agencyName ?? "",
    ...(smrc.serviceReceivedDate && {
      serviceReceivedDate: format(new Date(smrc.serviceReceivedDate), "yyyy-MM-dd"),
    }),
    deliveryMethod: (smrc.deliveryMethod as SMRCFormInputFields["deliveryMethod"]) ?? "no_option",
    requestStatus: (smrc.requestStatus as SMRCFormInputFields["requestStatus"]) ?? "no_option",
    representativeName: smrc.representativeName ?? "",
    agencyWebsite: smrc.agencyWebsite ?? "",
    ...(smrc.dateLastEmailReceived && {
      dateLastEmailReceived: format(new Date(smrc.dateLastEmailReceived), "yyyy-MM-dd"),
    }),
    representativePhone: smrc.representativePhone ?? "",
    ...(smrc.dateLastPhoneContact && {
      dateLastPhoneContact: format(new Date(smrc.dateLastPhoneContact), "yyyy-MM-dd"),
    }),
    representativeEmail: smrc.representativeEmail ?? "",
    locationStreetAddressOne: smrc.locationStreetAddressOne ?? "",
    locationStreetAddressTwo: smrc.locationStreetAddressTwo ?? "",
    locationCity: smrc.locationCity ?? "",
    locationState: smrc.locationState ?? "",
    locationZipCode: smrc.locationZipCode ?? "",
    shortDescription: smrc.shortDescription ?? "",
    recommendation: smrc.recommendation?.toString() ?? "",
    recommendationComments: smrc.recommendationComments ?? [],
    recommendationCommentExplanation: smrc.recommendationCommentExplanation ?? "",
    recommendationComment: smrc.recommendationComment ?? "",
    businessOwner: smrc.businessOwner ? "yes" : "no",
    businessRecommendation: smrc.businessRecommendation?.toString() ?? "",
    businessRecommendationComments: smrc.businessRecommendationComments ?? [],
    businessRecommendationComment: smrc.businessRecommendationComment ?? "",
    businessRecommendationCommentExplanation: smrc.businessRecommendationCommentExplanation ?? "",
    contactedByGovernment: smrc.contactedByGovernment ? "yes" : "no",
    contactedByGovernmentMethod: (smrc.contactedByGovernmentMethod as SMRCFormInputFields["contactedByGovernmentMethod"]) ?? "no_option",
    contactedByGovernmentPhone: smrc.contactedByGovernmentPhone ?? "",
    contactedByGovernmentPhoneTime: smrc.contactedByGovernmentPhoneTime ?? "",
    contactedByGovernmentEmail: smrc.contactedByGovernmentEmail ?? "",
    contactedByGovernmentConfirmEmail: smrc.contactedByGovernmentEmail ?? "",
    nonBusinessRating: smrc.nonBusinessRating
      ? Object.fromEntries(
          Object.entries(smrc.nonBusinessRating).map(([k, v]) => [k, String(v)])
        )
      : {},
    nonBusinessExperienceFeedback: smrc.nonBusinessExperienceFeedback ?? "",
    businessRating: smrc.businessRating
      ? Object.fromEntries(Object.entries(smrc.businessRating).map(([k, v]) => [k, String(v)]))
      : {},
    businessExperienceFeedback: smrc.businessExperienceFeedback ?? "",
    hasRecordedVideo: smrc.hasRecordedVideo ?? false,
    videoUrl: smrc.videoUrl ?? "",
  };
}

export function formDefaultValues({
  isPreviousResidence,
  notResident,
  user,
  defaultSmrc,
}: {
  isPreviousResidence: boolean;
  notResident: boolean;
  user: { email?: string | null; state?: string; city?: string; zipCode?: string } | null;
  defaultSmrc?: SMRC | null;
}): Partial<SMRCFormInputFields> {
  return {
    hasRecordedVideo: false,
    videoUrl: "",
    currentResidence: !isPreviousResidence,
    notResident,
    ...(!isPreviousResidence && { endDate: format(new Date(), "yyyy-MM") }),
    contactedByGovernmentEmail: user?.email ?? "",
    contactedByGovernmentConfirmEmail: user?.email ?? "",
    ...(!isPreviousResidence && !notResident && {
      state: user?.state ?? "",
      city: user?.city ?? "",
      zipCode: user?.zipCode ?? "",
    }),
    ...(defaultSmrc && getSMRCdefaultValues(defaultSmrc)),
  };
}

/** Build API payload from form data (for POST create and for draft save). Handles partial data for drafts. */
export function buildSmrcPayloadFromFormData(data: Partial<SMRCFormInputFields>): Record<string, unknown> {
  const toIso = (dateStr: string | undefined, endOfDay: false | true) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return undefined;
    if (endOfDay) d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };
  const toIsoDateOnly = (dateStr: string | undefined) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr + "T12:00:00.000Z");
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString();
  };
  const nonBusinessRating: Record<string, number> = {};
  for (let i = 1; i <= 15; i++) {
    const key = `metric${i}`;
    const v = data.nonBusinessRating?.[key];
    const num = v !== undefined && v !== "" ? parseFloat(String(v)) : NaN;
    nonBusinessRating[key] = Number.isFinite(num) && num >= 1 && num <= 10 ? num : 5;
  }
  const businessRating =
    data.businessOwner === "yes" && data.businessRating
      ? (() => {
          const out: Record<string, number> = {};
          for (let i = 1; i <= 10; i++) {
            const key = `metric${i}`;
            const v = data.businessRating![key];
            const num = v !== undefined && v !== "" ? parseFloat(String(v)) : NaN;
            out[key] = Number.isFinite(num) && num >= 1 && num <= 10 ? num : 5;
          }
          return out;
        })()
      : undefined;
  return {
    currentResidence: data.currentResidence ?? false,
    notResident: data.notResident ?? false,
    residenceType: data.residenceType !== "no_option" && data.residenceType ? data.residenceType : undefined,
    timeAtResidence: data.timeAtResidence !== "no_option" && data.timeAtResidence ? data.timeAtResidence : undefined,
    lengthOfVisit: data.lengthOfVisit !== "no_option" && data.lengthOfVisit ? data.lengthOfVisit : undefined,
    visitDays: data.visitDays ? parseInt(String(data.visitDays), 10) : undefined,
    endDate: !data.currentResidence && data.endDate ? toIso(`${data.endDate}-01`, true) : undefined,
    visitBeganAt: data.notResident && data.visitBeganAt ? toIso(`${data.visitBeganAt}-01`, true) : undefined,
    state: data.state?.trim() ?? "",
    city: data.city?.trim() ?? "",
    zipCode: data.zipCode?.trim() ?? "",
    agencyLevel: data.agencyLevel !== "no_option" && data.agencyLevel ? data.agencyLevel : undefined,
    agencyName: data.agencyName?.trim() ?? "",
    serviceReceivedDate:
      data.serviceReceivedDate
        ? (toIsoDateOnly(data.serviceReceivedDate) ?? toIso(data.serviceReceivedDate, false) ?? "")
        : "",
    deliveryMethod: data.deliveryMethod !== "no_option" && data.deliveryMethod ? data.deliveryMethod : undefined,
    requestStatus: data.requestStatus !== "no_option" && data.requestStatus ? data.requestStatus : undefined,
    representativeName: data.representativeName?.trim() || undefined,
    agencyWebsite: (() => {
      const normalized = normalizeUrl(data.agencyWebsite);
      return normalized || undefined;
    })(),
    dateLastEmailReceived: data.dateLastEmailReceived ? toIso(data.dateLastEmailReceived, false) : undefined,
    representativeEmail: data.representativeEmail?.trim() || undefined,
    representativePhone: data.representativePhone?.trim() || undefined,
    dateLastPhoneContact: data.dateLastPhoneContact ? toIso(data.dateLastPhoneContact, false) : undefined,
    locationStreetAddressOne: data.locationStreetAddressOne?.trim() || undefined,
    locationStreetAddressTwo: data.locationStreetAddressTwo?.trim() || undefined,
    locationCity: data.locationCity?.trim() || undefined,
    locationState: data.locationState?.trim() || undefined,
    locationZipCode: data.locationZipCode?.trim() || undefined,
    shortDescription: data.shortDescription?.trim() ?? "",
    recommendation: Math.min(10, Math.max(1, parseInt(String(data.recommendation), 10) || 1)),
    recommendationComments: data.recommendationComments?.length ? data.recommendationComments : undefined,
    recommendationCommentExplanation: data.recommendationCommentExplanation?.trim() || undefined,
    recommendationComment: data.recommendationComment?.trim() || undefined,
    contactedByGovernment: data.contactedByGovernment === "yes",
    contactedByGovernmentMethod:
      data.contactedByGovernmentMethod !== "no_option" && data.contactedByGovernmentMethod
        ? data.contactedByGovernmentMethod
        : undefined,
    contactedByGovernmentPhone: data.contactedByGovernmentPhone?.trim() || undefined,
    contactedByGovernmentPhoneTime: data.contactedByGovernmentPhoneTime?.trim() || undefined,
    contactedByGovernmentEmail: data.contactedByGovernmentEmail?.trim() || undefined,
    nonBusinessRating,
    nonBusinessExperienceFeedback: data.nonBusinessExperienceFeedback?.trim() || undefined,
    businessOwner: data.businessOwner === "yes",
    businessRecommendation: data.businessRecommendation ? parseInt(String(data.businessRecommendation), 10) : undefined,
    businessRecommendationComments: data.businessRecommendationComments?.length ? data.businessRecommendationComments : undefined,
    businessRecommendationCommentExplanation: data.businessRecommendationCommentExplanation?.trim() || undefined,
    businessRecommendationComment: data.businessRecommendationComment?.trim() || undefined,
    businessRating: businessRating && Object.keys(businessRating).length ? businessRating : undefined,
    businessExperienceFeedback: data.businessExperienceFeedback?.trim() || undefined,
    hasRecordedVideo: data.hasRecordedVideo ?? false,
    videoUrl: data.videoUrl?.trim() || undefined,
  };
}
