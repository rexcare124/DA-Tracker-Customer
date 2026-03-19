"use client";

import React from "react";
import Image from "next/image";
import { Bell, HelpCircle } from "lucide-react";
import { UserProfileDropdown } from "@/components/shared/UserProfileDropdown";
import { useRouter, usePathname } from "next/navigation";
import { useSMRCDraft } from "@/components/SMRC/SMRCDraftContext";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const draft = useSMRCDraft();
  const isSearchPage = pathname === "/datasearch";
  const isOnSMRCForm = draft?.isSMRCFormPath(pathname) ?? false;
  const targetUrl = isSearchPage ? "/dashboard" : "/datasearch";

  const handleSearchDataClick = () => {
    if (isOnSMRCForm && draft) {
      draft.setPendingNavigation(targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <header
      className="h-12 sm:h-14 bg-[#f8f9fa] border-b border-[#ced4da] flex items-center px-3 sm:px-4 gap-2 sm:gap-4 sticky top-0 z-10 min-w-0"
      role="banner"
    >
      <div className="flex items-center shrink-0">
        <Image
          src="/pk-color-logo.png"
          alt="Plentiful Knowledge"
          width={48}
          height={48}
          className="h-8 w-auto sm:h-12"
          priority
        />
      </div>
      <div className="flex-1 min-w-0 flex justify-center sm:justify-start sm:ml-6 lg:ml-8">
        <button
          className="h-9 sm:h-[34px] rounded-md border border-[#ced4da] bg-[#007acc] text-white px-3 sm:px-4 cursor-pointer font-medium text-sm transition-colors hover:bg-[#005a9e] whitespace-nowrap min-w-[88px]"
          type="button"
          onClick={handleSearchDataClick}
        >
          {isSearchPage ? "Dashboard" : "Search Data"}
        </button>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-md inline-flex items-center justify-center bg-[#e9ecef] border border-[#ced4da] text-[#666666] cursor-pointer text-base hover:bg-[#dee2e6] shrink-0"
          type="button"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-md inline-flex items-center justify-center bg-[#e9ecef] border border-[#ced4da] text-[#666666] cursor-pointer text-base hover:bg-[#dee2e6] shrink-0"
          type="button"
          title="Help"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <UserProfileDropdown itemClassName="font-semibold" />
      </div>
    </header>
  );
}
