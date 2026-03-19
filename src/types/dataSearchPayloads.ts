export interface BusinessLocationLike {
  city?: { name?: string | null } | null;
  stateRegion?: {
    code?: string | null;
    name?: string | null;
    regionCode?: string | null;
    regionName?: string | null;
  } | null;
}

export interface Business {
  id: number;
  name: string;
  city?: { name?: string | null } | null;
  stateRegion?: {
    code?: string | null;
    name?: string | null;
    regionCode?: string | null;
    regionName?: string | null;
  } | null;
  location?: BusinessLocationLike | null;
  website?: string | null;
}

export interface NonGovernmentalOrganization {
  employerIdentificationNumber: string;
  name: string;
  ngoType?: string | null;
  // API payload fields use `cityName` / `regionCode` / `regionName` for NGOs.
  city?: { cityName?: string | null } | null;
  stateRegion?: { regionCode?: string | null; regionName?: string | null } | null;
}

export interface HomeOwnerAssociation {
  id: number;
  name: string;
  location?: {
    stateRegion?: { code?: string | null; name?: string | null } | null;
    zipCode?: { code?: string | null } | null;
    locationType?: { name?: string | null } | null;
  } | null;
  website?: string | null;
}

export interface School {
  id: number;
  schoolId: number;
  schoolName: string;
  schoolType: string;
  districtId: number;
  cityId: number;
  stateRegionId: number;
  createdAt: string;
  updatedAt: string;
  district?: {
    id: number;
    districtId: number;
    districtName: string;
    cityId: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  city?: {
    id: number;
    cityName: string;
    population: number;
    countyId: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  stateRegion?: {
    id: number;
    regionName: string;
    regionCode: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
}

/**
 * Runtime type guard for narrowing `DataSearchMarker.data` to a `Business`.
 */
export function isBusinessDetails(value: unknown): value is Business {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || typeof value.id !== "number") return false;
  if (!("name" in value) || typeof value.name !== "string") return false;
  return true;
}

/**
 * Runtime type guard for narrowing `DataSearchMarker.data` to a `NonGovernmentalOrganization`.
 */
export function isNgoDetails(value: unknown): value is NonGovernmentalOrganization {
  if (typeof value !== "object" || value === null) return false;
  if (
    !("employerIdentificationNumber" in value) ||
    typeof value.employerIdentificationNumber !== "string"
  ) {
    return false;
  }
  if (!("name" in value) || typeof value.name !== "string") return false;
  return true;
}

/**
 * Runtime type guard for narrowing `DataSearchMarker.data` to a `HomeOwnerAssociation`.
 */
export function isHomeOwnerAssociationDetails(value: unknown): value is HomeOwnerAssociation {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || typeof value.id !== "number") return false;
  if (!("name" in value) || typeof value.name !== "string") return false;
  return true;
}

/**
 * Runtime type guard for narrowing `DataSearchMarker.data` to a `School`.
 */
export function isSchoolDetails(value: unknown): value is School {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || typeof value.id !== "number") return false;
  if (!("schoolId" in value) || typeof value.schoolId !== "number") return false;
  if (!("schoolName" in value) || typeof value.schoolName !== "string") return false;
  if (!("schoolType" in value) || typeof value.schoolType !== "string") return false;
  return true;
}

