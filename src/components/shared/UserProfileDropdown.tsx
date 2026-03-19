"use client";

import React, { useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileDropdownProps {
  /**
   * Custom trigger element. If not provided, uses default Avatar.
   */
  trigger?: React.ReactNode;
  /**
   * Whether to show Dashboard link. If not provided, auto-detects based on pathname.
   */
  showDashboard?: boolean;
  /**
   * Whether to show Settings link. Defaults to false.
   */
  showSettings?: boolean;
  /**
   * Custom callback for logout. If not provided, uses default signOut.
   */
  onLogout?: () => void | Promise<void>;
  /**
   * Custom callback for dashboard navigation. If not provided, uses router.push.
   */
  onDashboardClick?: () => void;
  /**
   * Custom callback for settings navigation. If not provided, uses router.push.
   */
  onSettingsClick?: () => void;
  /**
   * Additional className for DropdownMenuContent
   */
  contentClassName?: string;
  /**
   * Additional className for menu items
   */
  itemClassName?: string;
}

/**
 * Reusable user profile dropdown component using Radix UI.
 * Provides consistent styling and behavior across all pages.
 * 
 * Features:
 * - Blue background (#007acc) with white text
 * - White background with blue text on hover
 * - Conditional Dashboard/Settings links
 * - Consistent logout behavior
 * - Accessible and keyboard navigable
 */
export function UserProfileDropdown({
  trigger,
  showDashboard,
  showSettings = false,
  onLogout,
  onDashboardClick,
  onSettingsClick,
  contentClassName = "",
  itemClassName = "",
}: UserProfileDropdownProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Auto-detect if we should show Dashboard link
  const shouldShowDashboard = showDashboard ?? (pathname !== '/dashboard' && !pathname.startsWith('/dashboard/'));

  const handleSignOut = useCallback(async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await signOut({ callbackUrl: '/' });
    }
  }, [onLogout]);

  const handleGoToDashboard = useCallback(() => {
    if (onDashboardClick) {
      onDashboardClick();
    } else {
      router.push('/dashboard');
    }
  }, [router, onDashboardClick]);

  const handleGoToSettings = useCallback(() => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      router.push('/dashboard/settings');
    }
  }, [router, onSettingsClick]);

  // Get user's initial for avatar fallback
  const getUserInitial = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Default trigger (Avatar) if not provided
  const defaultTrigger = (
    <Avatar className="w-8 h-8">
      <AvatarImage src={session?.user?.image || undefined} />
      <AvatarFallback className="bg-[#e9ecef] border border-[#ced4da] text-[#666666] text-sm font-medium">
        {getUserInitial()}
      </AvatarFallback>
    </Avatar>
  );

  const baseItemClassName = "cursor-pointer hover:!bg-white hover:!border-white hover:!text-[#007acc] focus:bg-white focus:text-[#007acc] transition-colors";
  const combinedItemClassName = itemClassName ? `${baseItemClassName} ${itemClassName}` : baseItemClassName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className="flex items-center gap-2 focus:outline-none"
        asChild={!!trigger}
      >
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={`bg-[#007acc] text-white min-w-[180px] border-[#007acc] transition-colors ${contentClassName}`} 
        align="end"
      >
        {shouldShowDashboard && (
          <>
            <DropdownMenuItem
              className={combinedItemClassName}
              onClick={handleGoToDashboard}
            >
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/20" />
          </>
        )}
        {showSettings && (
          <>
            <DropdownMenuItem
              className={combinedItemClassName}
              onClick={handleGoToSettings}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/20" />
          </>
        )}
        <DropdownMenuItem
          className={combinedItemClassName}
          onClick={handleSignOut}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
