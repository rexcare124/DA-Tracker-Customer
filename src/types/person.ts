/**
 * Minimal location shape as returned with person org relationships (organization office).
 */
export interface PersonOrgLocation {
  id: number;
  streetAddress1: string;
  streetAddress2?: string | null;
  zipCode?: { id: number; zipCode: string } | null;
}

/**
 * Minimal organization shape as returned with person org relationships.
 */
export interface PersonOrgOrganization {
  id: number;
  entityName: string;
  location?: PersonOrgLocation | null;
  state?: { id: number; abbreviation: string; stateName: string } | null;
  city?: { id: number; cityName: string } | null;
}

/**
 * Single person–organization relationship as returned by GET /api/persons/:id.
 */
export interface PersonOrgRelationshipDetail {
  id: number;
  personId: number;
  organizationId: number;
  relationshipTypeId: number;
  startDate: string | null;
  endDate: string | null;
  title: string | null;
  relationshipType: { id: number; relationshipName: string };
  organization: PersonOrgOrganization;
  status?: { id: number; statusName: string; category: string } | null;
}

/** Person as returned by GET /api/persons and GET /api/persons/:id */
export interface Person {
  id: number;
  prefix: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  suffix: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  juvenile: boolean;
  deceased: boolean;
  createdAt: string;
  updatedAt: string;
  firebaseUserId: string | null;
  email: string | null;
  username: string | null;
  stateOfResidence: string | null;
  cityOfResidence: string | null;
  zipCode: string | null;
  namePrefixId: number | null;
  nameSuffixId: number | null;
  privacyLevelId: number | null;
  referralSourceId: number | null;
  referralText: string | null;
  hashedPassword: string | null;
  signInMethod: string | null;
  emailVerified: boolean | null;
  onboardingComplete: boolean | null;
  motivationIds: unknown;
  otherInterestText: string | null;
  governmentIds: unknown;
  informationSourceIds: unknown;
  otherInformationSourceText: string | null;
  agreementAccepted: boolean | null;
  registrationData: unknown;
  lastUpdatedFirebase: string | null;
  /** Present when fetching by id; includes organization, location, relationship type, title, dates. */
  personOrgRelationships?: PersonOrgRelationshipDetail[];
}
