/**
 * SMRC (State Municipal Report Card) types for UI
 * Re-exports from lib/firebase/smrc-types and adds form-specific types.
 */

import type { SMRCDocument } from "@/lib/firebase/smrc-types";
import {
  AgencyLevel,
  ContactMethod,
  DeliveryMethod,
  LengthOfVisit,
  RequestStatus,
  ResidenceType,
  TimeAtResidence,
} from "@/lib/firebase/smrc-types";

export type { SMRCDocument };
export { AgencyLevel, ContactMethod, DeliveryMethod, LengthOfVisit, RequestStatus, ResidenceType, TimeAtResidence };

/** Alias for components that expect SMRC with id */
export type SMRC = SMRCDocument;

export interface LocationOption {
  label: string;
  value: string;
  state?: string;
  county?: string;
  city?: string;
  disabled?: boolean;
}

export interface SMRCFormInputFields {
  visitBeganAt: string;
  endDate: string;
  residenceType: (typeof ResidenceType)[keyof typeof ResidenceType] | "no_option";
  timeAtResidence: (typeof TimeAtResidence)[keyof typeof TimeAtResidence] | "no_option";
  lengthOfVisit: (typeof LengthOfVisit)[keyof typeof LengthOfVisit] | "no_option";
  visitDays: string;
  state: string;
  city: string;
  zipCode: string;
  currentResidence: boolean;
  notResident: boolean;
  agencyLevel: (typeof AgencyLevel)[keyof typeof AgencyLevel] | "no_option";
  agencyName: string;
  serviceReceivedDate: string;
  deliveryMethod: (typeof DeliveryMethod)[keyof typeof DeliveryMethod] | "no_option";
  requestStatus: (typeof RequestStatus)[keyof typeof RequestStatus] | "no_option";
  representativeName: string;
  agencyWebsite: string;
  dateLastEmailReceived: string;
  representativePhone: string;
  dateLastPhoneContact: string;
  representativeEmail: string;
  locationStreetAddressOne: string;
  locationStreetAddressTwo: string;
  locationCity: string;
  locationState: string;
  locationZipCode: string;
  shortDescription: string;
  recommendation: string;
  recommendationComments: string[];
  recommendationCommentExplanation: string;
  recommendationComment: string;
  businessOwner: string;
  businessRecommendation: string;
  businessRecommendationComments: string[];
  businessRecommendationCommentExplanation: string;
  businessRecommendationComment: string;
  contactedByGovernment: string;
  contactedByGovernmentMethod: (typeof ContactMethod)[keyof typeof ContactMethod] | "no_option";
  contactedByGovernmentPhone: string;
  contactedByGovernmentPhoneTime: string;
  contactedByGovernmentEmail: string;
  contactedByGovernmentConfirmEmail: string;
  nonBusinessRating: Partial<Record<string, string>>;
  nonBusinessExperienceFeedback: string;
  businessRating: Partial<Record<string, string>>;
  businessExperienceFeedback: string;
  hasRecordedVideo: boolean;
  /** Link to video testimonial (Firebase Storage URL) */
  videoUrl: string;
}
