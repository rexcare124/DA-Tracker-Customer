"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSMRCDraft } from "@/components/SMRC/SMRCDraftContext";

interface NavLink {
  href: string;
  label: string;
  icon: string;
  dataPage: string;
}

interface NavSection {
  label: string;
  dataSection: string;
  subnav: NavLink[];
}

interface NestedNavSection {
  label: string;
  dataSection: string;
  subnav: NavLink[];
}

interface NestedNavSectionWithStates {
  label: string;
  dataSection: string;
  states: NestedNavSection[];
}

/** When user is on an SMRC form and clicks a nav link, show draft modal instead of navigating. */
function DashboardNavLink({
  href,
  className,
  children,
  "aria-current": ariaCurrent,
  "data-page": dataPage,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  "aria-current"?: "page" | undefined;
  "data-page"?: string;
}) {
  const pathname = usePathname();
  const draft = useSMRCDraft();
  const isOnSMRCForm = draft?.isSMRCFormPath(pathname) ?? false;
  const isSamePage = pathname === href;
  const shouldIntercept = isOnSMRCForm && !isSamePage;

  if (shouldIntercept && draft) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => draft.setPendingNavigation(href)}
        data-page={dataPage}
        aria-current={ariaCurrent}
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={href} className={className} aria-current={ariaCurrent} data-page={dataPage}>
      {children}
    </Link>
  );
}

const navLinksBeforeCreateSmrc: NavLink[] = [
  { href: "/dashboard", label: "♥ Favorites", icon: "♥", dataPage: "favorites" },
  {
    href: "/dashboard/review-history",
    label: "📋 Public Service Reviews",
    icon: "📋",
    dataPage: "review-history",
  },
];

const navLinksAfterCreateSmrc: NavLink[] = [
  { href: "/dashboard/persons", label: "👤 Persons", icon: "👤", dataPage: "persons" },
  { href: "/dashboard/businesses", label: "🏢 Businesses", icon: "🏢", dataPage: "businesses" },
  { href: "/dashboard/ngos", label: "🤝 Non-Governmental Orgs", icon: "🤝", dataPage: "ngos" },
];

const residentialCommunities: NavSection = {
  label: "🏘️ Residential Communities",
  dataSection: "residential-communities",
  subnav: [
    {
      href: "/dashboard/homeowners-associations",
      label: "🏠 Homeowners Associations",
      icon: "🏠",
      dataPage: "homeowners-associations",
    },
  ],
};

const governmentEntities: NestedNavSectionWithStates = {
  label: "🏛 Government Entities",
  dataSection: "government-entities",
  states: [
    {
      label: "📍 California",
      dataSection: "california",
      subnav: [
        {
          href: "/dashboard/california-state",
          label: "🏛️ State Government",
          icon: "🏛️",
          dataPage: "california-state",
        },
        {
          href: "/dashboard/california-counties",
          label: "🏛️ County Governments",
          icon: "🏛️",
          dataPage: "california-counties",
        },
        {
          href: "/dashboard/california-cities",
          label: "🏛️ City Governments",
          icon: "🏛️",
          dataPage: "california-cities",
        },
      ],
    },
    {
      label: "📍 Arizona",
      dataSection: "arizona",
      subnav: [
        {
          href: "/dashboard/arizona-state",
          label: "🏛️ State Government",
          icon: "🏛️",
          dataPage: "arizona-state",
        },
        {
          href: "/dashboard/arizona-counties",
          label: "🏛️ County Governments",
          icon: "🏛️",
          dataPage: "arizona-counties",
        },
        {
          href: "/dashboard/arizona-cities",
          label: "🏛️ City Governments",
          icon: "🏛️",
          dataPage: "arizona-cities",
        },
      ],
    },
    {
      label: "📍 Oregon",
      dataSection: "oregon",
      subnav: [
        {
          href: "/dashboard/oregon-state",
          label: "🏛️ State Government",
          icon: "🏛️",
          dataPage: "oregon-state",
        },
        {
          href: "/dashboard/oregon-counties",
          label: "🏛️ County Governments",
          icon: "🏛️",
          dataPage: "oregon-counties",
        },
        {
          href: "/dashboard/oregon-cities",
          label: "🏛️ City Governments",
          icon: "🏛️",
          dataPage: "oregon-cities",
        },
      ],
    },
  ],
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const toggleState = (state: string) => {
    setExpandedStates((prev) => {
      const next = new Set(prev);
      if (next.has(state)) {
        next.delete(state);
      } else {
        next.add(state);
      }
      return next;
    });
  };

  const isNavLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className="dashboard-sidebar min-h-[calc(100vh-56px)] bg-[#f8f9fa] border-r border-[#ced4da] p-4 relative resize-x overflow-hidden min-w-[260px] max-w-[400px]"
      role="complementary"
      aria-label="Navigation"
    >
      <h2 className="text-[#666666] my-2 mx-2 text-xs uppercase tracking-wider">Local&apos;s View</h2>
      <nav className="flex flex-col gap-1" aria-label="Primary navigation">
        {/* Favorites */}
        {navLinksBeforeCreateSmrc.map((link) => {
          const isActive = isNavLinkActive(link.href);
          return (
            <DashboardNavLink
              key={link.href}
              href={link.href}
              className={cn(
                "sidebar__nav-link flex items-center gap-2.5 py-2 px-2.5 rounded-md text-[#333333] no-underline border border-transparent bg-transparent cursor-pointer whitespace-nowrap text-sm",
                isActive ? "bg-[#dee2e6] border-[#ced4da]" : "hover:bg-[#dee2e6] hover:border-[#ced4da]",
              )}
              aria-current={isActive ? "page" : undefined}
              data-page={link.dataPage}
            >
              {link.label}
            </DashboardNavLink>
          );
        })}

        {/* Persons, Businesses, etc. */}
        {navLinksAfterCreateSmrc.map((link) => {
          const isActive = isNavLinkActive(link.href);
          return (
            <DashboardNavLink
              key={link.href}
              href={link.href}
              className={cn(
                "sidebar__nav-link flex items-center gap-2.5 py-2 px-2.5 rounded-md text-[#333333] no-underline border border-transparent bg-transparent cursor-pointer whitespace-nowrap text-sm",
                isActive ? "bg-[#dee2e6] border-[#ced4da]" : "hover:bg-[#dee2e6] hover:border-[#ced4da]",
              )}
              aria-current={isActive ? "page" : undefined}
              data-page={link.dataPage}
            >
              {link.label}
            </DashboardNavLink>
          );
        })}

        {/* Residential Communities Section */}
        <div className="flex flex-col gap-1">
          <button
            className={cn(
              "sidebar__nav-section-header flex items-center gap-2.5 py-2 px-2.5 rounded-md text-[#333333] no-underline border border-transparent bg-transparent cursor-pointer whitespace-nowrap text-sm font-medium text-left",
              "hover:bg-[#dee2e6] hover:border-[#ced4da]",
            )}
            onClick={() => toggleSection(residentialCommunities.dataSection)}
            aria-expanded={expandedSections.has(residentialCommunities.dataSection)}
            data-section={residentialCommunities.dataSection}
          >
            {residentialCommunities.label}
          </button>
          {expandedSections.has(residentialCommunities.dataSection) && (
            <div className="flex flex-col gap-1 ml-5 pl-2.5 border-l-2 border-[#e9ecef]">
              {residentialCommunities.subnav.map((subLink) => {
                const isActive = isNavLinkActive(subLink.href);
                return (
                  <DashboardNavLink
                    key={subLink.href}
                    href={subLink.href}
                    className={cn(
                      "sidebar__nav-section__subnav-link flex items-center gap-2.5 py-1.5 px-2.5 rounded-md text-[#666666] no-underline border border-transparent bg-transparent cursor-pointer whitespace-nowrap text-[13px]",
                      isActive
                        ? "bg-[#e9ecef] border-[#ced4da] text-[#333333]"
                        : "hover:bg-[#e9ecef] hover:border-[#ced4da] hover:text-[#333333]",
                    )}
                    aria-current={isActive ? "page" : undefined}
                    data-page={subLink.dataPage}
                  >
                    {subLink.label}
                  </DashboardNavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* Government Entities Section */}
        <div className="flex flex-col gap-1">
          <button
            className={cn(
              "sidebar__nav-section-header flex items-center gap-2.5 py-2 px-2.5 rounded-md text-[#333333] no-underline border border-transparent bg-transparent cursor-pointer whitespace-nowrap text-sm font-medium text-left",
              "hover:bg-[#dee2e6] hover:border-[#ced4da]",
            )}
            onClick={() => toggleSection(governmentEntities.dataSection)}
            aria-expanded={expandedSections.has(governmentEntities.dataSection)}
            data-section={governmentEntities.dataSection}
          >
            {governmentEntities.label}
          </button>
          {expandedSections.has(governmentEntities.dataSection) && (
            <div className="flex flex-col gap-1 ml-5 pl-2.5 border-l-2 border-[#e9ecef]">
              {governmentEntities.states.map((state) => {
                const isStateExpanded = expandedStates.has(state.dataSection);
                return (
                  <div key={state.dataSection} className="flex flex-col gap-1">
                    <button
                      className={cn(
                        "sidebar__nav-section__subnav-section-header flex items-center gap-2.5 py-1.5 px-2.5 rounded-md text-[#333333] no-underline border border-transparent bg-transparent cursor-pointer whitespace-nowrap text-[13px] font-medium text-left",
                        "hover:bg-[#e9ecef] hover:border-[#ced4da]",
                      )}
                      onClick={() => toggleState(state.dataSection)}
                      aria-expanded={isStateExpanded}
                      data-section={state.dataSection}
                    >
                      {state.label}
                    </button>
                    {isStateExpanded && (
                      <div className="flex flex-col gap-1 ml-5 pl-2.5 border-l-2 border-[#e9ecef]">
                        {state.subnav.map((subLink) => {
                          const isActive = isNavLinkActive(subLink.href);
                          return (
                            <DashboardNavLink
                              key={subLink.href}
                              href={subLink.href}
                              className={cn(
                                "sidebar__nav-section__subnav-section__subnav-link flex items-center gap-2.5 py-1.5 px-2.5 rounded-md text-[#666666] no-underline border border-transparent bg-transparent cursor-pointer whitespace-nowrap text-xs",
                                isActive
                                  ? "bg-[#e9ecef] border-[#ced4da] text-[#333333]"
                                  : "hover:bg-[#e9ecef] hover:border-[#ced4da] hover:text-[#333333]",
                              )}
                              aria-current={isActive ? "page" : undefined}
                              data-page={subLink.dataPage}
                            >
                              {subLink.label}
                            </DashboardNavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings Link - at the bottom */}
        {(() => {
          const settingsHref = "/dashboard/settings";
          const isActive = isNavLinkActive(settingsHref);
          return (
            <DashboardNavLink
              href={settingsHref}
              className={cn(
                "sidebar__nav-link flex items-center gap-2.5 py-2 px-2.5 rounded-md text-[#333333] no-underline border border-transparent bg-transparent cursor-pointer whitespace-nowrap text-sm",
                isActive ? "bg-[#dee2e6] border-[#ced4da]" : "hover:bg-[#dee2e6] hover:border-[#ced4da]",
              )}
              aria-current={isActive ? "page" : undefined}
              data-page="settings"
            >
              ⚙ Settings
            </DashboardNavLink>
          );
        })()}
      </nav>
    </aside>
  );
}
