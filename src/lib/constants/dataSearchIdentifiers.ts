/**
 * Data Search marker identifiers
 *
 * Centralized constants for data search entities displayed as Google Map markers.
 * This avoids duplicating identifier strings across components and improves type safety.
 */

export const DATA_SEARCH_SERVICE_REVIEWS_IDENTIFIER = "service-reviews" as const;
export const DATA_SEARCH_PERSON_IDENTIFIER = "person" as const;
export const DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER = "home-owner-association" as const;
export const DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER = "non-governmental-orgs" as const;
export const DATA_SEARCH_SCHOOL_IDENTIFIER = "school" as const;
export const DATA_SEARCH_BUSINESS_IDENTIFIER = "businesses" as const;

export const DATA_SEARCH_MARKER_IDENTIFIERS = [
  DATA_SEARCH_PERSON_IDENTIFIER,
  DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER,
  DATA_SEARCH_BUSINESS_IDENTIFIER,
  DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER,
  DATA_SEARCH_SCHOOL_IDENTIFIER,
] as const;

export type DataSearchMarkerIdentifier = (typeof DATA_SEARCH_MARKER_IDENTIFIERS)[number];

const DATA_SEARCH_MARKER_IDENTIFIER_SET: ReadonlySet<string> = new Set(DATA_SEARCH_MARKER_IDENTIFIERS);

/**
 * Type guard for validating marker identifiers at runtime.
 *
 * @param identifier - Any identifier value.
 * @returns True if identifier is a known marker identifier.
 */
export function isDataSearchMarkerIdentifier(identifier: string): identifier is DataSearchMarkerIdentifier {
  return DATA_SEARCH_MARKER_IDENTIFIER_SET.has(identifier);
}

