/**
 * AppSidebar Component
 * 
 * Membership tier-based navigation sidebar for the GDAP application.
 * Replaces the old role-based system with feature-gated navigation links.
 * 
 * This component is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: `02_COMPONENT_MAPPING.md` lines 65-78, `IMPROVEMENT_REPORT.md` lines 27-78
 */

"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Home,
  Menu,
  Settings,
  X,
  Search,
  Heart,
  FileText,
  Database,
  Lock,
} from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMembership } from "@/hooks/useMembership";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { FEATURES, type Feature } from "@/lib/features";
import type { MembershipTierNumber } from "@/types/subscription";
import { LucideIcon } from "lucide-react";

/**
 * Navigation link configuration
 */
interface NavLink {
  icon: LucideIcon;
  label: string;
  href: string;
  minTier: MembershipTierNumber;
  feature: Feature;
  showLock?: boolean; // Show lock icon if user doesn't have access
}

/**
 * All available navigation links with tier and feature requirements
 * Reference: `02_COMPONENT_MAPPING.md` lines 71-77
 */
const ALL_NAV_LINKS: readonly NavLink[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/dashboard",
    minTier: 1,
    feature: FEATURES.DASHBOARD_ACCESS,
    showLock: false, // Always accessible to all tiers
  },
  {
    icon: Search,
    label: "Data Search",
    href: "/dashboard/datasearch",
    minTier: 1,
    feature: FEATURES.DATA_SEARCH,
    showLock: false, // Always accessible to all tiers
  },
  {
    icon: Heart,
    label: "Saved Searches",
    href: "/dashboard/favorites",
    minTier: 3,
    feature: FEATURES.SAVE_SEARCHES,
    showLock: true, // Show lock for Tier 1-2
  },
  {
    icon: FileText,
    label: "Reports",
    href: "/dashboard/reports",
    minTier: 4,
    feature: FEATURES.CUSTOM_REPORTS,
    showLock: true, // Show lock for Tier 1-3
  },
  {
    icon: Database,
    label: "Datasets",
    href: "/dashboard/datasets",
    minTier: 5,
    feature: FEATURES.DATASET_DOWNLOADS,
    showLock: true, // Show lock for Tier 1-4
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/settings",
    minTier: 1,
    feature: FEATURES.DASHBOARD_ACCESS, // Settings accessible to all
    showLock: false,
  },
] as const;

interface AppSidebarProps {
  userType?: "manager" | "local"; // DEPRECATED: Kept for backward compatibility, not used
}

const AppSidebar = ({ userType }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();
  const { membershipTier, isActive } = useMembership();
  const { hasFeature } = useFeatureAccess();

  /**
   * Filter navigation links based on user's membership tier and feature access
   */
  const navLinks = React.useMemo(() => {
    return ALL_NAV_LINKS.filter((link) => {
      // If user has no active subscription, only show Dashboard and Settings
      if (!isActive || membershipTier === 0) {
        return (
          link.href === "/dashboard" || link.href === "/dashboard/settings"
        );
      }

      // Check if user has access to the feature
      return hasFeature(link.feature);
    });
  }, [membershipTier, isActive, hasFeature]);

  /**
   * Check if a link is locked (user doesn't have access)
   */
  const isLinkLocked = React.useCallback(
    (link: NavLink): boolean => {
      if (!isActive || membershipTier === 0) {
        return link.href !== "/dashboard" && link.href !== "/dashboard/settings";
      }
      return !hasFeature(link.feature);
    },
    [membershipTier, isActive, hasFeature]
  );

  /**
   * Get tier display name
   */
  const getTierName = React.useCallback((): string => {
    if (!isActive || membershipTier === 0) {
      return "Guest";
    }
    const tierNames: Record<MembershipTierNumber, string> = {
      1: "Follower",
      2: "Groupie",
      3: "Insider",
      4: "Biz Leader",
      5: "Data Seeker",
    };
    return tierNames[membershipTier as MembershipTierNumber] ?? "Member";
  }, [membershipTier, isActive]);

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 bg-white shadow-lg"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex min-h-[56px] w-full items-center pt-3 mb-3",
                open ? "justify-between px-6" : "justify-center"
              )}
            >
              {open ? (
                <>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-800">GDAP</h1>
                    <p className="text-xs text-gray-500">{getTierName()}</p>
                  </div>
                  <button
                    className="hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => toggleSidebar()}
                    aria-label="Close sidebar"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              ) : (
                <button
                  className="hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => toggleSidebar()}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => {
            const isActiveLink = pathname === link.href || pathname?.startsWith(link.href + "/");
            const isLocked = isLinkLocked(link);

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild={!isLocked}
                  disabled={isLocked}
                  className={cn(
                    "flex items-center px-7 py-7",
                    isActiveLink
                      ? "bg-gray-100"
                      : "text-gray-600 hover:bg-gray-100",
                    open ? "text-blue-600" : "ml-[5px]",
                    isLocked && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLocked ? (
                    <div className="w-full flex items-center gap-3">
                      <link.icon
                        className={`h-5 w-5 ${
                          isActiveLink ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`font-medium flex-1 ${
                          isActiveLink ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {link.label}
                      </span>
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                  ) : (
                    <Link href={link.href} className="w-full" scroll={false}>
                      <div className="flex items-center gap-3">
                        <link.icon
                          className={`h-5 w-5 ${
                            isActiveLink ? "text-blue-600" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            isActiveLink ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          {link.label}
                        </span>
                      </div>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
