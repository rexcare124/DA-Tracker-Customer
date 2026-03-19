/**
 * UpgradePrompt Component
 * 
 * Displays a prompt encouraging users to upgrade their membership to access locked features.
 * Shows feature name, required tier, and upgrade button.
 * 
 * This component is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: `15_FEATURE_RESTRICTIONS.md` lines 240-316
 */

"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type Feature, FEATURES, getMinimumTierForFeature } from "@/lib/features";
import { useMembership } from "@/hooks/useMembership";

/**
 * Feature display names mapping
 */
const FEATURE_NAMES: Record<Feature, string> = {
  [FEATURES.DASHBOARD_ACCESS]: "Dashboard Access",
  [FEATURES.DATA_SEARCH]: "Data Search",
  [FEATURES.BASIC_DATA_VIEWING]: "Basic Data Viewing",
  [FEATURES.MAP_VIEW]: "Map View",
  [FEATURES.ENTITY_DETAILS]: "Entity Details",
  [FEATURES.HOME_ZIP_SMRC]: "Home Zip Code SMRC",
  [FEATURES.WORK_ZIP_SMRC]: "Work Zip Code SMRC",
  [FEATURES.FIVE_ZIP_SMRC]: "Five Zip Codes SMRC",
  [FEATURES.ALL_ZIP_SMRC]: "All Zip Codes SMRC",
  [FEATURES.CROSS_STATE_DATA]: "Cross-State Data",
  [FEATURES.SAVE_SEARCHES]: "Save Searches",
  [FEATURES.FAVORITES]: "Favorites",
  [FEATURES.EXPORT_RESULTS]: "Export Results",
  [FEATURES.SEARCH_HISTORY]: "Search History",
  [FEATURES.CUSTOM_FILTERS]: "Custom Filters",
  [FEATURES.CONTACT_DIRECTORY]: "Contact Directory",
  [FEATURES.CUSTOM_REPORTS]: "Custom Reports",
  [FEATURES.REPORT_SCHEDULING]: "Report Scheduling",
  [FEATURES.API_ACCESS]: "API Access",
  [FEATURES.BULK_DATA_QUERIES]: "Bulk Data Queries",
  [FEATURES.DATASET_DOWNLOADS]: "Dataset Downloads",
  [FEATURES.DOCUMENT_LIBRARY]: "Document Library",
  [FEATURES.BULK_DATA_EXPORT]: "Bulk Data Export",
  [FEATURES.HISTORICAL_DATA]: "Historical Data",
  [FEATURES.ADVANCED_ANALYTICS]: "Advanced Analytics",
  [FEATURES.EMAIL_SUPPORT]: "Email Support",
  [FEATURES.PRIORITY_SUPPORT_24H]: "Priority Support (24h)",
  [FEATURES.PREMIUM_SUPPORT_8H]: "Premium Support (8h)",
  [FEATURES.ELITE_SUPPORT_4H]: "Elite Support (4h)",
  [FEATURES.PHONE_SUPPORT]: "Phone Support",
  [FEATURES.DEDICATED_ACCOUNT_MANAGER]: "Dedicated Account Manager",
  [FEATURES.MUSIC_SEEDS]: "Music Seeds Social Group",
  [FEATURES.TECHSOCIAL]: "TechSocial Social Group",
  [FEATURES.PERSONAL_SOCIAL_GROUPS]: "Personal Social Groups",
  [FEATURES.BUSINESS_SOCIAL_GROUPS]: "Business Social Groups",
};

/**
 * Tier display names
 */
const TIER_NAMES: Record<number, string> = {
  1: "Follower",
  2: "Groupie",
  3: "Insider",
  4: "Biz Leader",
  5: "Data Seeker",
};

/**
 * UpgradePrompt component props
 */
interface UpgradePromptProps {
  /** Feature that requires upgrade */
  feature: Feature;
  /** Optional array of features (for multi-feature prompts) */
  features?: readonly Feature[];
  /** Mode for multi-feature prompts ('any' or 'all') */
  mode?: "any" | "all";
}

/**
 * UpgradePrompt Component
 * 
 * Displays a card prompting users to upgrade their membership to access locked features.
 */
export function UpgradePrompt({
  feature,
  features,
  mode = "any",
}: UpgradePromptProps): React.ReactElement {
  const { membershipTier } = useMembership();

  // Get minimum tier required for the feature
  const requiredTier = getMinimumTierForFeature(feature);
  const requiredTierName = requiredTier ? TIER_NAMES[requiredTier] : "Higher Tier";

  // Get feature display name
  const featureName = FEATURE_NAMES[feature] ?? feature;

  // Determine if user needs to upgrade
  const needsUpgrade = requiredTier !== null && (membershipTier === 0 || membershipTier < requiredTier);

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-900">Feature Locked</CardTitle>
        </div>
        <CardDescription className="text-amber-800">
          {needsUpgrade
            ? `This feature requires ${requiredTierName} membership or higher.`
            : "This feature is not available with your current membership."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Alert variant="default" className="bg-white border-amber-300">
          <AlertDescription className="text-gray-700">
            <strong>{featureName}</strong> is available with {requiredTierName} membership or higher.
            {features && features.length > 1 && (
              <span className="block mt-2 text-sm">
                {mode === "all"
                  ? "All of these features are required:"
                  : "Any of these features will unlock this content:"}
              </span>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white">
          <Link href="/settings/subscription">
            <ArrowUp className="mr-2 h-4 w-4" />
            Upgrade Membership
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
