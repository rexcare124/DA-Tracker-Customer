"use client";
import React from "react";

// --- Type Definitions ---

// NEW: Type to distinguish between sign-up methods
export type SignUpMethod = "social" | "email" | null;

// Type for Personal Information
export interface PersonalInfo {
  prefix: string;
  firstName: string;
  lastName: string;
  suffix: string;
  email: string;
  confirmEmail: string;
  password?: string; // UPDATED: Made optional for email sign-up
  confirmPassword?: string; // UPDATED: Added for password confirmation
  username: string;
  defaultPrivacyLevel: string;
  stateOfResidence: string;
  cityOfResidence: string;
  zipCode: string;
  howDidYouHearAboutUs: string;
  forumUrl: string;
  youtubeUrl: string;
  referredByUsername: string;
  flyerPromoCode: string;
  otherHeardAboutText: string;
  agreementAccepted: boolean;
}

// Membership selection type
export interface MembershipSelection {
  level: "follower" | "groupie" | "insider" | "bizleader" | "dataseeker";
  billingFrequency: "monthly" | "yearly";
}

// Agreements type
export interface Agreements {
  betaClient: boolean;
  termsOfUse: boolean;
  privacyPolicy: boolean;
}

// Type for the main form data state (LEGACY - kept during migration)
export interface FormData {
  personalInfo: PersonalInfo;
  dataInterests: string[];
  otherInterestText: string;
  rankedMotivations: string[];
  rankedGovernments: string[];
  rankedInformationSources: string[];
  otherInformationSourceText: string;
  agreementAccepted: boolean;
  membershipSelection?: MembershipSelection | null; // NEW: Membership selection
  agreements?: Agreements; // NEW: Detailed agreements
}

// OPTIMIZED: New interface using ID arrays for better performance
export interface OptimizedFormData {
  personalInfo: PersonalInfo;
  dataInterestIds: number[];
  otherInterestText: string;
  rankedMotivationIds: number[];
  rankedGovernmentIds: number[];
  rankedInformationSourceIds: number[];
  otherInformationSourceText: string;
  agreementAccepted: boolean;
}

// Registration page props interfaces
export interface RegistrationPageProps {
  // No specific props needed for main page component
}

export interface OptimizedRegistrationPageProps {
  // No specific props needed for optimized version
}

// Type for common props passed to step components
export interface StepComponentProps {
  prevStep?: () => void;
  nextStep?: () => void;
  showCustomModal: (message: string) => void;
}

// Type for optimized step components with enhanced modal
export interface OptimizedStepComponentProps {
  prevStep?: () => void;
  nextStep?: () => void;
  showCustomModal: (title: string, message: string) => void;
}

// Types for individual step component props
export interface PersonalInformationProps extends StepComponentProps {
  formData: PersonalInfo;
  signUpMethod: SignUpMethod; // UPDATED: Added to determine which fields to show
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof PersonalInfo
  ) => void;
  userId?: string; // User ID for OAuth users to save suffix immediately
}

// DataInterests component interfaces
export interface DataInterestsProps {
  selectedInterests: string[];
  otherInterestText: string;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  prevStep?: () => void;
  nextStep?: () => void;
  isStepValid: boolean;
  showCustomModal: (title: string, content: string) => void;
}

export interface OptimizedDataInterestsProps {
  selectedInterestIds: number[];
  otherInterestText: string;
  setFormData: React.Dispatch<React.SetStateAction<OptimizedFormData>>;
  prevStep?: () => void;
  nextStep?: () => void;
  isStepValid: boolean;
  showCustomModal: (title: string, content: string) => void;
}

// LEGACY: GovernmentInterests props using string arrays
export interface GovernmentInterestsProps extends StepComponentProps {
  rankedGovernments: string[];
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// OPTIMIZED: GovernmentInterests props using ID arrays
export interface OptimizedGovernmentInterestsProps extends StepComponentProps {
  rankedGovernmentIds: number[];
  setFormData: React.Dispatch<React.SetStateAction<OptimizedFormData>>;
}

// RankMotivations component interfaces
export interface RankMotivationsProps extends StepComponentProps {
  selectedInterests: string[];
  otherInterestText: string;
  rankedMotivations: string[];
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export interface OptimizedRankMotivationsProps extends OptimizedStepComponentProps {
  selectedInterestIds: number[];
  otherInterestText: string;
  rankedMotivationIds: number[];
  setFormData: React.Dispatch<React.SetStateAction<OptimizedFormData>>;
}

// LEGACY: InformationSources props using string arrays
export interface InformationSourcesProps extends StepComponentProps {
  rankedInformationSources: string[];
  otherInformationSourceText: string;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// OPTIMIZED: InformationSources props using ID arrays
export interface OptimizedInformationSourcesProps {
  rankedInformationSourceIds: number[];
  otherInformationSourceText: string;
  setFormData: React.Dispatch<React.SetStateAction<OptimizedFormData>>;
  prevStep?: () => void;
  nextStep?: () => void;
  isStepValid: boolean;
  showCustomModal: (title: string, content: string) => void;
}

export interface AgreementAcceptanceProps extends StepComponentProps {
  agreementAccepted: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "agreementAccepted"
  ) => void;
  handleSubmit: () => void;
  isRegistrationSubmitted?: boolean; // Optional: disables form if registration already submitted
}

// --- Constant Definitions ---

export const USER_PREFIX = {
  DR: "Dr.",
  MR: "Mr.",
  MRS: "Mrs.",
  MS: "Ms.",
  PROF: "Prof.",
  REV: "Rev.",
  THE_HON: "The Hon.",
};

export const USER_SUFFIX = {
  ESQ: "Esq.",
  JR: "Jr.",
  SR: "Sr.",
  II: "II",
  III: "III",
  IV: "IV",
  V: "V",
};

export const USER_HEARD_ABOUT_US = {
  SEARCH_ENGINE: "Search engine",
  SOCIAL_MEDIA: "Social media",
  LINKEDIN: "LinkedIn",
  BLOG_OR_PUBLICATION: "Blog or publication",
  REFERRED_BY_FRIEND: "Referred by friend/colleague",
  ONLINE_COMMUNITY_FORUM: "Online community forum",
  YOUTUBE_PERSONALITY: "YouTube personality",
  REFERRED_BY_EXISTING_MEMBER: "Referred By Existing Member/Guest User",
  COMMUNITY_FLYER: "Community flyer",
  OTHER: "Other",
};

export const USER_PRIVACY_LEVEL = {
  ANONYMOUS: "Anonymous",
  USERNAME: "Username Only",
  FIRST_LAST_INITIAL: "Your First Name & Last Initial",
  FULLNAME: "Your Full Name",
};

export const MOTIVATIONS = [
  "Improve well-being",
  "Find community to live",
  "Manage personal risks",
  "Career advancement",
  "Elect government leaders",
  "Protect friends/family",
  "Enhance school experience",
  "Grow my business",
  "Plan for travel",
  "Other",
];

export const INFORMATION_SOURCES = [
  "Social Media",
  "Traditional News Websites and Apps",
  "Television",
  "Search Engines",
  "Podcasts",
  "Print Publications (e.g., Newspapers and Magazines)",
  "Personal Connections (Word of Mouth)",
  "Books and eBooks",
  "Scholarly Peer-Reviewed Articles and Journals",
  "Reference Sources (Dictionaries, Encyclopedias, and Handbooks)",
  "AI Chatbots and Interfaces",
  "Other",
];

export const STEP_NAMES = [
  "Sign In",
  "Personal Information",
  "Data Interests",
  "Rank Motivations",
  "Government Interests",
  "Information Sources",
  "Choose Membership", // UPDATED: Changed from "Agreement Acceptance"
];
