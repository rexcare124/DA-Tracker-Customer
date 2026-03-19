"use client";

import React, { Suspense } from "react";
import Loading from "@/components/Loading";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useRequireOnboarding } from "@/hooks/useRequireOnboarding";
import { BlockedAccessModal } from "@/components/BlockedAccessModal";
import { usePaymentSuccess } from "@/hooks/usePaymentSuccess";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  // CRITICAL: Check for payment success first (before checking onboarding)
  // This allows payment success detection to work even when layout blocks access
  // const { isPaymentSuccess, isLoading: paymentLoading } = usePaymentSuccess();
  const { isPaymentSuccess, isLoading: paymentLoading } = usePaymentSuccess();

  const { hasAccess, isLoading, showBlockedModal, handleRedirectToRegistration, status } =
    useRequireOnboarding({
      check2FA: true,
      isPaymentSuccess, // Pass payment success to allow access during race condition
    });

  if (isLoading || paymentLoading) {
    return <Loading />;
  }

  // If not authenticated, show loading (redirect will happen)
  if (status === "unauthenticated") {
    return <Loading />;
  }

  // CRITICAL: Allow access if payment just succeeded, even if onboardingComplete isn't updated yet
  // This prevents the layout from blocking access before the page component can handle payment success
  const shouldBlockAccess = !hasAccess && !isPaymentSuccess;

  // Check access: require onboarding complete (unless payment just succeeded)
  if (shouldBlockAccess) {
    return (
      <>
        <Loading />
        <BlockedAccessModal open={showBlockedModal} onRedirect={handleRedirectToRegistration} />
      </>
    );
  }

  // Remove DashboardLayout from individual pages since it's now in the layout
  // The children should just be the content
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
