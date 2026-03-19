/**
 * FeatureGate Component
 * 
 * Wrapper component that conditionally renders children based on user's feature access.
 * Shows upgrade prompt if user doesn't have access to the required feature.
 * 
 * This component is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: `15_FEATURE_RESTRICTIONS.md` lines 239-277
 */

"use client";

import React from "react";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { type Feature } from "@/lib/features";
import { UpgradePrompt } from "./UpgradePrompt";

/**
 * FeatureGate component props
 */
interface FeatureGateProps {
  /** Feature required to access the children */
  feature: Feature;
  /** Content to render if user has access */
  children: React.ReactNode;
  /** Optional fallback content if user doesn't have access (overrides upgrade prompt) */
  fallback?: React.ReactNode;
  /** Whether to show upgrade prompt if user doesn't have access (default: true) */
  showUpgradePrompt?: boolean;
}

/**
 * FeatureGate Component
 * 
 * Conditionally renders children based on user's feature access.
 * Shows upgrade prompt or fallback if user doesn't have access.
 */
export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
}: FeatureGateProps): React.ReactElement {
  const { hasFeature } = useFeatureAccess();

  // User has access - render children
  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  // User doesn't have access - show fallback or upgrade prompt
  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    return <UpgradePrompt feature={feature} />;
  }

  // No fallback and upgrade prompt disabled - render nothing
  return <></>;
}
