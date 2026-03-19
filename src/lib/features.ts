/**
 * Feature Constants and Access Control
 * 
 * Defines all available features and their tier mappings for feature gating.
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: `15_FEATURE_RESTRICTIONS.md` lines 82-191, `06_SUBSCRIPTION_MODEL.md` Feature Access Matrix
 */

import { type MembershipTierNumber } from "@/types/subscription";

/**
 * Feature constant definitions
 * 
 * All available features in the GDAP application.
 * Reference: `15_FEATURE_RESTRICTIONS.md` lines 82-132
 */
export const FEATURES = {
  // Core Features
  DASHBOARD_ACCESS: "dashboard-access",
  DATA_SEARCH: "data-search",
  BASIC_DATA_VIEWING: "basic-data-viewing",
  MAP_VIEW: "map-view",
  ENTITY_DETAILS: "entity-details",

  // Geographic Access
  HOME_ZIP_SMRC: "home-zip-smrc",
  WORK_ZIP_SMRC: "work-zip-smrc",
  FIVE_ZIP_SMRC: "five-zip-smrc",
  ALL_ZIP_SMRC: "all-zip-smrc",
  CROSS_STATE_DATA: "cross-state-data",

  // Data Management
  SAVE_SEARCHES: "save-searches",
  FAVORITES: "favorites",
  EXPORT_RESULTS: "export-results",
  SEARCH_HISTORY: "search-history",
  CUSTOM_FILTERS: "custom-filters",

  // Business Features
  CONTACT_DIRECTORY: "contact-directory",
  CUSTOM_REPORTS: "custom-reports",
  REPORT_SCHEDULING: "report-scheduling",
  API_ACCESS: "api-access",
  BULK_DATA_QUERIES: "bulk-data-queries",

  // Enterprise Features
  DATASET_DOWNLOADS: "dataset-downloads",
  DOCUMENT_LIBRARY: "document-library",
  BULK_DATA_EXPORT: "bulk-data-export",
  HISTORICAL_DATA: "historical-data",
  ADVANCED_ANALYTICS: "advanced-analytics",

  // Support
  EMAIL_SUPPORT: "email-support",
  PRIORITY_SUPPORT_24H: "priority-support-24h",
  PREMIUM_SUPPORT_8H: "premium-support-8h",
  ELITE_SUPPORT_4H: "elite-support-4h",
  PHONE_SUPPORT: "phone-support",
  DEDICATED_ACCOUNT_MANAGER: "dedicated-account-manager",

  // Social Groups
  MUSIC_SEEDS: "music-seeds",
  TECHSOCIAL: "techsocial",
  PERSONAL_SOCIAL_GROUPS: "personal-social-groups",
  BUSINESS_SOCIAL_GROUPS: "business-social-groups",
} as const;

/**
 * Feature type - derived from FEATURES constant
 */
export type Feature = (typeof FEATURES)[keyof typeof FEATURES];

/**
 * Base features for Tier 1 (Follower)
 */
const TIER_1_FEATURES: readonly Feature[] = [
  FEATURES.DASHBOARD_ACCESS,
  FEATURES.DATA_SEARCH,
  FEATURES.BASIC_DATA_VIEWING,
  FEATURES.MAP_VIEW,
  FEATURES.ENTITY_DETAILS,
  FEATURES.HOME_ZIP_SMRC,
  FEATURES.EMAIL_SUPPORT,
  FEATURES.MUSIC_SEEDS,
  FEATURES.PERSONAL_SOCIAL_GROUPS,
] as const;

/**
 * Additional features for Tier 2 (Groupie)
 */
const TIER_2_ADDITIONAL: readonly Feature[] = [FEATURES.WORK_ZIP_SMRC] as const;

/**
 * Additional features for Tier 3 (Insider)
 */
const TIER_3_ADDITIONAL: readonly Feature[] = [
  FEATURES.FIVE_ZIP_SMRC,
  FEATURES.SAVE_SEARCHES,
  FEATURES.FAVORITES,
  FEATURES.EXPORT_RESULTS,
  FEATURES.SEARCH_HISTORY,
  FEATURES.CUSTOM_FILTERS,
  FEATURES.PRIORITY_SUPPORT_24H,
] as const;

/**
 * Additional features for Tier 4 (Biz Leader)
 */
const TIER_4_ADDITIONAL: readonly Feature[] = [
  FEATURES.ALL_ZIP_SMRC,
  FEATURES.CROSS_STATE_DATA,
  FEATURES.CONTACT_DIRECTORY,
  FEATURES.CUSTOM_REPORTS,
  FEATURES.REPORT_SCHEDULING,
  FEATURES.API_ACCESS,
  FEATURES.BULK_DATA_QUERIES,
  FEATURES.PREMIUM_SUPPORT_8H,
  FEATURES.PHONE_SUPPORT,
  FEATURES.TECHSOCIAL,
  FEATURES.BUSINESS_SOCIAL_GROUPS,
] as const;

/**
 * Additional features for Tier 5 (Data Seeker)
 */
const TIER_5_ADDITIONAL: readonly Feature[] = [
  FEATURES.DATASET_DOWNLOADS,
  FEATURES.DOCUMENT_LIBRARY,
  FEATURES.BULK_DATA_EXPORT,
  FEATURES.HISTORICAL_DATA,
  FEATURES.ADVANCED_ANALYTICS,
  FEATURES.ELITE_SUPPORT_4H,
  FEATURES.DEDICATED_ACCOUNT_MANAGER,
] as const;

/**
 * Tier to Features mapping
 * 
 * Maps each membership tier (1-5) to the features available at that tier.
 * Reference: `15_FEATURE_RESTRICTIONS.md` lines 137-191, `06_SUBSCRIPTION_MODEL.md` Feature Access Matrix
 */
export const TIER_FEATURES: Record<MembershipTierNumber, readonly Feature[]> = {
  1: TIER_1_FEATURES,
  2: [...TIER_1_FEATURES, ...TIER_2_ADDITIONAL] as const,
  3: [
    ...TIER_1_FEATURES,
    ...TIER_2_ADDITIONAL,
    ...TIER_3_ADDITIONAL,
  ] as const,
  4: [
    ...TIER_1_FEATURES,
    ...TIER_2_ADDITIONAL,
    ...TIER_3_ADDITIONAL,
    ...TIER_4_ADDITIONAL,
  ] as const,
  5: [
    ...TIER_1_FEATURES,
    ...TIER_2_ADDITIONAL,
    ...TIER_3_ADDITIONAL,
    ...TIER_4_ADDITIONAL,
    ...TIER_5_ADDITIONAL,
  ] as const,
};

/**
 * Get features available for a specific tier
 * 
 * @param tier - Membership tier number (1-5)
 * @returns Array of features available at that tier
 */
export function getFeaturesForTier(tier: MembershipTierNumber): readonly Feature[] {
  return TIER_FEATURES[tier] ?? [];
}

/**
 * Check if a tier has access to a specific feature
 * 
 * @param tier - Membership tier number (1-5)
 * @param feature - Feature to check
 * @returns true if tier has access to the feature
 */
export function tierHasFeature(
  tier: MembershipTierNumber,
  feature: Feature
): boolean {
  const tierFeatures = getFeaturesForTier(tier);
  return tierFeatures.includes(feature);
}

/**
 * Get minimum tier required for a feature
 * 
 * @param feature - Feature to check
 * @returns Minimum tier number required, or null if feature doesn't exist
 */
export function getMinimumTierForFeature(feature: Feature): MembershipTierNumber | null {
  for (let tier = 1; tier <= 5; tier++) {
    if (tierHasFeature(tier as MembershipTierNumber, feature)) {
      return tier as MembershipTierNumber;
    }
  }
  return null;
}

/**
 * Check if a feature string is a valid feature
 * 
 * @param value - Value to check
 * @returns true if value is a valid feature
 */
export function isFeature(value: unknown): value is Feature {
  return (
    typeof value === "string" &&
    Object.values(FEATURES).includes(value as Feature)
  );
}
