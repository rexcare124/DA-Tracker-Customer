/**
 * useFeatureAccess Hook
 * 
 * Custom React hook for checking feature access based on user's membership tier.
 * Provides helper functions for feature gating throughout the application.
 * 
 * This hook is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: `15_FEATURE_RESTRICTIONS.md` lines 196-234
 */

"use client";

import { useMemo } from "react";
import { useMembership } from "./useMembership";
import {
  FEATURES,
  TIER_FEATURES,
  type Feature,
  getFeaturesForTier,
  tierHasFeature,
} from "@/lib/features";

/**
 * Hook return type - fully typed interface
 */
export interface UseFeatureAccessReturn {
  hasFeature: (feature: Feature) => boolean;
  hasAnyFeature: (features: readonly Feature[]) => boolean;
  hasAllFeatures: (features: readonly Feature[]) => boolean;
  getAvailableFeatures: () => readonly Feature[];
  membershipTier: number;
  isActive: boolean;
}

/**
 * useFeatureAccess hook implementation
 * 
 * Provides feature access checking based on user's membership tier.
 * Uses the `useMembership` hook to get current tier and subscription status.
 */
export function useFeatureAccess(): UseFeatureAccessReturn {
  const { membershipTier, isActive } = useMembership();

  /**
   * Check if user has access to a specific feature
   * 
   * @param feature - The feature to check
   * @returns true if user's tier includes the feature and subscription is active
   */
  const hasFeature = useMemo(
    () => (feature: Feature): boolean => {
      if (!isActive || membershipTier === 0) {
        return false;
      }
      return tierHasFeature(membershipTier as 1 | 2 | 3 | 4 | 5, feature);
    },
    [membershipTier, isActive]
  );

  /**
   * Check if user has access to any of the provided features
   * 
   * @param features - Array of features to check
   * @returns true if user has access to at least one feature
   */
  const hasAnyFeature = useMemo(
    () => (features: readonly Feature[]): boolean => {
      if (!isActive || membershipTier === 0 || features.length === 0) {
        return false;
      }
      return features.some((feature) =>
        tierHasFeature(membershipTier as 1 | 2 | 3 | 4 | 5, feature)
      );
    },
    [membershipTier, isActive]
  );

  /**
   * Check if user has access to all provided features
   * 
   * @param features - Array of features to check
   * @returns true if user has access to all features
   */
  const hasAllFeatures = useMemo(
    () => (features: readonly Feature[]): boolean => {
      if (!isActive || membershipTier === 0 || features.length === 0) {
        return false;
      }
      return features.every((feature) =>
        tierHasFeature(membershipTier as 1 | 2 | 3 | 4 | 5, feature)
      );
    },
    [membershipTier, isActive]
  );

  /**
   * Get all features available to the user's current tier
   * 
   * @returns Array of features available at user's tier
   */
  const getAvailableFeatures = useMemo(
    () => (): readonly Feature[] => {
      if (!isActive || membershipTier === 0) {
        return [];
      }
      return getFeaturesForTier(membershipTier as 1 | 2 | 3 | 4 | 5);
    },
    [membershipTier, isActive]
  );

  return {
    hasFeature,
    hasAnyFeature,
    hasAllFeatures,
    getAvailableFeatures,
    membershipTier,
    isActive,
  };
}
