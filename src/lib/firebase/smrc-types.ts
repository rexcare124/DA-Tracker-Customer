/**
 * SMRC (Service Member Record Collection) types and validation for Firebase
 * Mirrors server CreateSMRCDto and enums using API string values for storage.
 */

import { z } from 'zod';
import { normalizeUrl, isValidUrl } from '@/utils/url';

// API-level enum types (matching server types)
export const AgencyLevel = {
  COUNTY: 'county',
  CITY: 'city',
  STATE: 'state',
} as const;
export type AgencyLevel = (typeof AgencyLevel)[keyof typeof AgencyLevel];

export const DeliveryMethod = {
  IN_PERSON: 'inPerson',
  ONLINE: 'online',
  PHONE: 'phone',
  EMAIL: 'email',
} as const;
export type DeliveryMethod = (typeof DeliveryMethod)[keyof typeof DeliveryMethod];

export const RequestStatus = {
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  DISPUTED: 'disputed',
  NOT_SURE: 'notSure',
  OTHER: 'other',
} as const;
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const ContactMethod = {
  PHONE: 'phone',
  EMAIL: 'email',
} as const;
export type ContactMethod = (typeof ContactMethod)[keyof typeof ContactMethod];

export const ResidenceType = {
  OWN: 'Own',
  RENT: 'Rent',
  LIVE_WITH_RELATIVE: 'Live With Relative',
  PREFER_NOT_SAY: 'Prefer Not To Say',
} as const;
export type ResidenceType = (typeof ResidenceType)[keyof typeof ResidenceType];

export const LengthOfVisit = {
  LESS_THAN_24_HOURS: 'Less Than 24 Hours',
  BETWEEN_1_7_DAYS: 'Between 1 - 7 Days',
  BETWEEN_8_30_DAYS: 'Between 8 - 30 Days',
  OTHER: 'Other',
} as const;
export type LengthOfVisit = (typeof LengthOfVisit)[keyof typeof LengthOfVisit];

export const TimeAtResidence = {
  LESS_THAN_3_MONTHS: 'Less than 3 months',
  BETWEEN_3_12_MONTHS: 'Between 3-12 months',
  BETWEEN_12_36_MONTHS: 'Between 12 - 36 months',
  MORE_THAN_36_MONTHS: 'More than 36 months',
} as const;
export type TimeAtResidence = (typeof TimeAtResidence)[keyof typeof TimeAtResidence];

const NonBusinessRatingSchema = z.object({
  metric1: z.number().min(1).max(10),
  metric2: z.number().min(1).max(10),
  metric3: z.number().min(1).max(10),
  metric4: z.number().min(1).max(10),
  metric5: z.number().min(1).max(10),
  metric6: z.number().min(1).max(10),
  metric7: z.number().min(1).max(10),
  metric8: z.number().min(1).max(10),
  metric9: z.number().min(1).max(10),
  metric10: z.number().min(1).max(10),
  metric11: z.number().min(1).max(10),
  metric12: z.number().min(1).max(10),
  metric13: z.number().min(1).max(10),
  metric14: z.number().min(1).max(10),
  metric15: z.number().min(1).max(10),
});

const BusinessRatingSchema = z.object({
  metric1: z.number().min(1).max(10),
  metric2: z.number().min(1).max(10),
  metric3: z.number().min(1).max(10),
  metric4: z.number().min(1).max(10),
  metric5: z.number().min(1).max(10),
  metric6: z.number().min(1).max(10),
  metric7: z.number().min(1).max(10),
  metric8: z.number().min(1).max(10),
  metric9: z.number().min(1).max(10),
  metric10: z.number().min(1).max(10),
});

const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;

/** Accept (123)456-7890 or 10-digit US formats (with optional separators); normalize to (123)456-7890. Empty string → undefined. */
const representativePhoneSchema = z.preprocess(
  (val) => {
    if (val === undefined || val === null) return undefined;
    const s = String(val).trim();
    return s === '' ? undefined : s;
  },
  z.union([
    z.undefined(),
    z
      .string()
      .refine(
        (s) => phoneRegex.test(s) || s.replace(/\D/g, '').length === 10,
        { message: 'Invalid phone number' }
      )
      .transform((s) => {
        const digits = s.replace(/\D/g, '');
        return digits.length === 10 ? `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}` : s;
      }),
  ])
);

export const CreateSMRCSchema = z
  .object({
    currentResidence: z.boolean(),
    notResident: z.boolean(),
    residenceType: z.nativeEnum(ResidenceType).optional(),
    timeAtResidence: z.nativeEnum(TimeAtResidence).optional(),
    lengthOfVisit: z.nativeEnum(LengthOfVisit).optional(),
    visitDays: z.number().int().min(1).optional(),
    endDate: z.string().datetime().optional(),
    visitBeganAt: z.string().datetime().optional(),
    state: z.string().min(1).trim(),
    city: z.string().min(1).trim(),
    zipCode: z.string().min(1).trim(),
    agencyLevel: z.enum([AgencyLevel.COUNTY, AgencyLevel.CITY, AgencyLevel.STATE]),
    agencyName: z.string().min(1).trim(),
    serviceReceivedDate: z.string().datetime(),
    deliveryMethod: z.nativeEnum(DeliveryMethod),
    requestStatus: z.nativeEnum(RequestStatus),
    representativeName: z.string().trim().optional(),
    agencyWebsite: z
      .string()
      .optional()
      .transform((v) => {
        const normalized = normalizeUrl(v);
        return normalized || undefined;
      })
      .pipe(
        z
          .string()
          .optional()
          .refine((s) => !s || isValidUrl(s), {
            message: 'Enter a valid URL (e.g. www.example.com or https://example.com)',
          })
      ),
    dateLastEmailReceived: z.string().datetime().optional(),
    representativeEmail: z.string().email().optional(),
    representativePhone: representativePhoneSchema,
    dateLastPhoneContact: z.string().datetime().optional(),
    locationStreetAddressOne: z.string().min(1).optional(),
    locationStreetAddressTwo: z.string().optional(),
    locationCity: z.string().min(1).optional(),
    locationState: z.string().min(1).optional(),
    locationZipCode: z.string().min(1).optional(),
    shortDescription: z.string().min(1).trim(),
    recommendation: z.number().int().min(1).max(10),
    recommendationComments: z.array(z.string()).min(1).optional(),
    recommendationCommentExplanation: z.string().optional(),
    recommendationComment: z.string().optional(),
    contactedByGovernment: z.boolean(),
    contactedByGovernmentMethod: z.nativeEnum(ContactMethod).optional(),
    contactedByGovernmentPhone: representativePhoneSchema,
    contactedByGovernmentPhoneTime: z.string().min(1).optional(),
    contactedByGovernmentEmail: z.string().email().optional(),
    nonBusinessRating: NonBusinessRatingSchema,
    nonBusinessExperienceFeedback: z.string().trim().optional(),
    businessOwner: z.boolean(),
    businessRecommendation: z.number().int().min(1).max(10).optional(),
    businessRecommendationComments: z.array(z.string()).min(1).optional(),
    businessRecommendationCommentExplanation: z.string().optional(),
    businessRecommendationComment: z.string().optional(),
    businessRating: BusinessRatingSchema.optional(),
    businessExperienceFeedback: z.string().trim().optional(),
    hasRecordedVideo: z.boolean(),
    /** Link to video testimonial (Firebase Storage URL) */
    videoUrl: z.string().url().trim().optional(),
  })
  .refine(
    (data) => (data.notResident ? data.lengthOfVisit !== undefined : true),
    { message: 'lengthOfVisit is required when notResident is true', path: ['lengthOfVisit'] }
  )
  .refine(
    (data) =>
      !(data.notResident && data.lengthOfVisit === LengthOfVisit.OTHER) || data.visitDays !== undefined,
    { message: 'visitDays is required when lengthOfVisit is OTHER', path: ['visitDays'] }
  )
  .refine(
    (data) => (data.notResident ? data.visitBeganAt !== undefined : true),
    { message: 'visitBeganAt is required when notResident is true', path: ['visitBeganAt'] }
  )
  .refine(
    (data) => (data.currentResidence || data.notResident || data.endDate !== undefined),
    { message: 'endDate is required when not currentResidence and not notResident', path: ['endDate'] }
  )
  .refine(
    (data) =>
      data.notResident || (data.residenceType !== undefined && data.timeAtResidence !== undefined),
    {
      message: 'residenceType and timeAtResidence are required when notResident is false',
      path: ['residenceType'],
    }
  )
  .refine(
    (data) => data.deliveryMethod !== DeliveryMethod.ONLINE || data.agencyWebsite !== undefined,
    { message: 'agencyWebsite is required when deliveryMethod is ONLINE', path: ['agencyWebsite'] }
  )
  .refine(
    (data) =>
      data.deliveryMethod !== DeliveryMethod.EMAIL ||
      (data.representativeEmail !== undefined && data.dateLastEmailReceived !== undefined),
    {
      message:
        'representativeEmail and dateLastEmailReceived are required when deliveryMethod is EMAIL',
      path: ['representativeEmail'],
    }
  )
  .refine(
    (data) =>
      data.deliveryMethod !== DeliveryMethod.PHONE ||
      (data.representativePhone !== undefined && data.dateLastPhoneContact !== undefined),
    {
      message:
        'representativePhone and dateLastPhoneContact are required when deliveryMethod is PHONE',
      path: ['representativePhone'],
    }
  )
  .refine(
    (data) =>
      data.deliveryMethod !== DeliveryMethod.IN_PERSON ||
      (data.locationStreetAddressOne !== undefined &&
        data.locationCity !== undefined &&
        data.locationState !== undefined &&
        data.locationZipCode !== undefined),
    {
      message: 'Location fields are required when deliveryMethod is IN_PERSON',
      path: ['locationStreetAddressOne'],
    }
  )
  .refine(
    (data) =>
      data.recommendation >= 7 ||
      (data.recommendationComments !== undefined && (data.recommendationComments?.length ?? 0) > 0),
    {
      message: 'recommendationComments is required when recommendation is less than 7',
      path: ['recommendationComments'],
    }
  )
  .refine(
    (data) => !data.contactedByGovernment || data.contactedByGovernmentMethod !== undefined,
    {
      message: 'contactedByGovernmentMethod is required when contactedByGovernment is true',
      path: ['contactedByGovernmentMethod'],
    }
  )
  .refine(
    (data) =>
      data.contactedByGovernmentMethod !== ContactMethod.PHONE ||
      (data.contactedByGovernmentPhone !== undefined &&
        data.contactedByGovernmentPhoneTime !== undefined),
    {
      message:
        'contactedByGovernmentPhone and contactedByGovernmentPhoneTime are required when contactedByGovernmentMethod is PHONE',
      path: ['contactedByGovernmentPhone'],
    }
  )
  .refine(
    (data) =>
      data.contactedByGovernmentMethod !== ContactMethod.EMAIL ||
      data.contactedByGovernmentEmail !== undefined,
    {
      message:
        'contactedByGovernmentEmail is required when contactedByGovernmentMethod is EMAIL',
      path: ['contactedByGovernmentEmail'],
    }
  )
  .refine(
    (data) =>
      !data.businessOwner || (data.businessRecommendation !== undefined && data.businessRating !== undefined),
    {
      message: 'businessRecommendation and businessRating are required when businessOwner is true',
      path: ['businessRecommendation'],
    }
  )
  .refine(
    (data) =>
      !(
        data.businessOwner &&
        data.businessRecommendation !== undefined &&
        data.businessRecommendation < 7
      ) ||
      (data.businessRecommendationComments !== undefined &&
        (data.businessRecommendationComments?.length ?? 0) > 0),
    {
      message:
        'businessRecommendationComments is required when businessOwner is true and businessRecommendation is less than 7',
      path: ['businessRecommendationComments'],
    }
  );

export type CreateSMRCDto = z.infer<typeof CreateSMRCSchema>;

/** Draft or published review */
export const SMRCStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;
export type SMRCStatus = (typeof SMRCStatus)[keyof typeof SMRCStatus];

export const GetMySmrcsSchema = z
  .object({
    page: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .default('1'),
    perPage: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .default('10'),
    state: z.string().optional(),
    city: z.string().optional(),
    status: z.enum([SMRCStatus.DRAFT, SMRCStatus.PUBLISHED]).optional(),
  })
  .refine((data) => data.page >= 1, { message: 'Minimum page value is 1', path: ['page'] })
  .refine((data) => data.perPage >= 1, { message: 'Minimum per page value is 1', path: ['perPage'] });

export type GetMySmrcsDto = z.infer<typeof GetMySmrcsSchema>;

/** Payload to create a draft: requires status and draftStep; all other fields optional (validated loosely in service) */
export const CreateDraftSMRCSchema = z.object({
  status: z.literal(SMRCStatus.DRAFT),
  draftStep: z.number().int().min(1).max(5),
});
export type CreateDraftSMRCDto = z.infer<typeof CreateDraftSMRCSchema> & Partial<CreateSMRCDto>;

/** SMRC document as stored in Firebase (API enum values as strings) */
export interface SMRCDocument {
  id: string;
  userId: string;
  /** draft | published; existing docs without this field are treated as published */
  status?: SMRCStatus;
  /** Step number when saved as draft (1-5) */
  draftStep?: number;
  currentResidence: boolean;
  notResident: boolean;
  residenceType?: string;
  timeAtResidence?: string;
  lengthOfVisit?: string;
  visitDays?: number;
  endDate?: string;
  visitBeganAt?: string;
  state: string;
  city: string;
  zipCode: string;
  agencyLevel: string;
  agencyName: string;
  serviceReceivedDate: string;
  deliveryMethod: string;
  requestStatus: string;
  representativeName?: string;
  agencyWebsite?: string;
  dateLastEmailReceived?: string;
  representativeEmail?: string;
  representativePhone?: string;
  dateLastPhoneContact?: string;
  locationStreetAddressOne?: string;
  locationStreetAddressTwo?: string;
  locationCity?: string;
  locationState?: string;
  locationZipCode?: string;
  shortDescription: string;
  recommendation: number;
  recommendationComments?: string[];
  recommendationCommentExplanation?: string;
  recommendationComment?: string;
  contactedByGovernment: boolean;
  contactedByGovernmentMethod?: string;
  contactedByGovernmentPhone?: string;
  contactedByGovernmentPhoneTime?: string;
  contactedByGovernmentEmail?: string;
  nonBusinessRating: Record<string, number>;
  nonBusinessExperienceFeedback?: string;
  businessOwner: boolean;
  businessRecommendation?: number;
  businessRecommendationComments?: string[];
  businessRecommendationCommentExplanation?: string;
  businessRecommendationComment?: string;
  businessRating?: Record<string, number>;
  businessExperienceFeedback?: string;
  hasRecordedVideo: boolean;
  /** Link to video testimonial (Firebase Storage URL) */
  videoUrl?: string;
  ipAddress?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export function isValidAgencyLevel(value: string): value is AgencyLevel {
  return Object.values(AgencyLevel).includes(value as AgencyLevel);
}
