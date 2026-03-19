"use client";

import React, { useEffect, Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import { useGetAuthUserQuery } from "@/state/api";
import Loading from "@/components/Loading";
import DashboardContent from "@/components/dashboard/DashboardContent";
import ProfileInformation from "@/components/settings/ProfileInformation";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireOnboarding } from "@/hooks/useRequireOnboarding";
import { BlockedAccessModal } from "@/components/BlockedAccessModal";
import { usePaymentSuccess } from "@/hooks/usePaymentSuccess";
import { usePaymentModalSeen } from "@/hooks/usePaymentModalSeen";
import { secureLogger } from "@/lib/secureLogger";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

// Lazy load SubscriptionManagement component (heavy component with lots of UI)
const SubscriptionManagement = dynamic(
  () => import("@/components/settings/SubscriptionManagement"),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    ),
    ssr: false, // Disable SSR for subscription management (requires client-side hooks)
  },
);

function SettingsPageContent() {
  const {
    data: authUser,
    isLoading: authLoading,
    refetch: refetchAuthUser,
  } = useGetAuthUserQuery();

  // CRITICAL: Check for payment success first (before checking onboarding)
  const {
    isPaymentSuccess,
    isLoading: paymentLoading,
    isSessionRefreshed,
    error: paymentError,
    clearSessionId,
  } = usePaymentSuccess();

  // Check if user has already seen the payment success modal
  const {
    hasSeenModal,
    isLoading: modalSeenLoading,
    markModalAsSeen,
  } = usePaymentModalSeen();

  const {
    hasAccess,
    isLoading: sessionLoading,
    showBlockedModal,
    handleRedirectToRegistration,
    session,
    status,
  } = useRequireOnboarding({
    check2FA: false, // Settings page doesn't check 2FA
    isPaymentSuccess, // Pass payment success to allow access during race condition
  });

  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  // Constants for fallback modal timing (reduced since we now refresh session immediately)
  const FALLBACK_MODAL_DELAY_MS = 2000; // 2 seconds - fallback delay if session refresh takes longer than expected

  /**
   * SessionStorage key for tracking if payment success modal has been shown in current session
   */
  const MODAL_SHOWN_SESSION_KEY = "pk_payment_modal_shown_session";

  // Track if modal has been shown to prevent multiple triggers
  const hasShownModalRef = useRef(false);

  /**
   * Check if modal has been shown in current session (sessionStorage)
   * Synchronous check to prevent duplicates within same session
   */
  const hasShownInSession = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const shown = sessionStorage.getItem(MODAL_SHOWN_SESSION_KEY);
      return shown === "true";
    } catch {
      return false;
    }
  };

  /**
   * Mark modal as shown in current session (sessionStorage)
   * Synchronous write to prevent duplicates within same session
   */
  const markShownInSession = (): void => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(MODAL_SHOWN_SESSION_KEY, "true");
    } catch {
      // Ignore sessionStorage errors (private browsing, etc.)
    }
  };

  // Show success modal when payment is successful and session is refreshed
  // Only show if user hasn't seen it before (checked from Firebase and sessionStorage)
  // CRITICAL: Mark modal as seen in Firebase FIRST, then show modal to prevent race conditions
  useEffect(() => {
    // Prevent showing modal multiple times
    if (hasShownModalRef.current) {
      return;
    }

    // Don't show if already shown in this session (sessionStorage check - synchronous, immediate)
    if (hasShownInSession()) {
      return;
    }

    // Don't show if user has already seen the modal (persisted in Firebase)
    if (hasSeenModal) {
      return;
    }

    // Fallback: If payment succeeded but session refresh is taking longer than expected,
    // show modal after a short delay (handles Fast Refresh remounts and async delays)
    // CRITICAL: This ensures modal shows even if component remounts before isSessionRefreshed is set
    if (isPaymentSuccess && !paymentError) {
      // Show modal immediately if session is refreshed, otherwise use fallback
      if (isSessionRefreshed) {
        // Mark modal as seen in Firebase FIRST, then show modal
        // This ensures Firebase is updated before modal appears, preventing duplicates
        const showModalAfterFirebaseUpdate = async (): Promise<void> => {
          try {
            await markModalAsSeen();
            // Firebase update complete - safe to show modal
            hasShownModalRef.current = true;
            markShownInSession(); // Mark in sessionStorage immediately (synchronous)
            setShowSuccessModal(true);
            // Clear session_id after session refresh completes
            setTimeout(() => clearSessionId(), 100);
          } catch (error) {
            // If Firebase update fails, still show modal (graceful degradation)
            // But log the error for monitoring
            secureLogger.error("Failed to mark modal as seen, showing anyway", {
              operation: "payment success modal",
            });
            hasShownModalRef.current = true;
            markShownInSession(); // Mark in sessionStorage immediately (synchronous)
            setShowSuccessModal(true);
            // Clear session_id after a short delay
            setTimeout(() => clearSessionId(), 100);
          }
        };

        showModalAfterFirebaseUpdate();
      } else {
        // Fallback: Show modal after delay if session refresh is delayed or component remounted
        const fallbackTimer = setTimeout(async () => {
          if (!hasShownModalRef.current && !hasSeenModal && !hasShownInSession()) {
            // Mark modal as seen in Firebase FIRST, then show modal
            try {
              await markModalAsSeen();
              // Firebase update complete - safe to show modal
              hasShownModalRef.current = true;
              markShownInSession(); // Mark in sessionStorage immediately (synchronous)
              setShowSuccessModal(true);
              // Clear session_id after a short delay to avoid triggering re-renders
              setTimeout(() => clearSessionId(), 100);
            } catch (error) {
              // If Firebase update fails, still show modal (graceful degradation)
              secureLogger.error("Failed to mark modal as seen, showing anyway", {
                operation: "payment success modal",
              });
              hasShownModalRef.current = true;
              markShownInSession(); // Mark in sessionStorage immediately (synchronous)
              setShowSuccessModal(true);
              setTimeout(() => clearSessionId(), 100);
            }
          }
        }, FALLBACK_MODAL_DELAY_MS);

        return () => clearTimeout(fallbackTimer);
      }
    }
  }, [
    isPaymentSuccess,
    isSessionRefreshed,
    paymentError,
    clearSessionId,
    hasSeenModal,
    markModalAsSeen,
  ]);

  // Close success modal
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  // Show loading only if not waiting for payment success processing
  // If payment succeeded, allow page to render to show success modal (even if session not yet refreshed)
  // CRITICAL: Once payment is verified, render content to allow fallback modal to appear
  // This allows the success modal to appear immediately after payment verification
  if (isPaymentSuccess) {
    // Payment succeeded - allow rendering to show success modal
    // Don't block on sessionLoading - session will load in background
    // Fallback modal will show after 2 seconds if session refresh is delayed
    // Only block if we truly don't have session after a reasonable wait
    if (!session && sessionLoading) {
      // Give session a moment to load, but don't block indefinitely
      // The modal can show even without full session data
      return <Loading />;
    }
    // Render immediately if we have session, or if sessionLoading is false
    // authUser can load in background - don't block rendering
    // isSessionRefreshed can be false - fallback will handle it
  } else if (sessionLoading || authLoading || paymentLoading || modalSeenLoading) {
    // Normal loading state - show loading spinner
    return <Loading />;
  }

  // Settings page requires session for full content, but modal can show without it
  // If payment succeeded, render modal even without full session
  if (!session) {
    if (isPaymentSuccess) {
      // Payment succeeded but no session yet - render minimal content to show modal
      return (
        <>
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="sm:max-w-[425px] rounded-lg p-6">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <DialogTitle>Registration Completed Successfully!</DialogTitle>
                </div>
                <DialogDescription className="whitespace-pre-line pt-2">
                  Your payment has been processed and your registration is now complete. You now
                  have full access to your dashboard.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button
                  onClick={handleSuccessModalClose}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
                >
                  Ok
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Loading />
        </>
      );
    }
    return null;
  }

  // If payment just succeeded, allow access even if session hasn't fully updated yet
  // This handles the race condition gracefully
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

  return (
    <>
      {/* Payment Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[425px] rounded-lg p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <DialogTitle>Registration Completed Successfully!</DialogTitle>
            </div>
            <DialogDescription className="whitespace-pre-line pt-2">
              Your payment has been processed and your registration is now complete. You now have
              full access to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleSuccessModalClose}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DashboardContent title="Settings" subtitle="Manage your account and preferences">
        <div className="space-y-6">
          {authUser ? (
            <>
              <ProfileInformation
                session={session}
                authUser={authUser}
                onProfileUpdate={refetchAuthUser}
              />
              <Separator />
            </>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          )}
          <SubscriptionManagement />
        </div>
      </DashboardContent>
    </>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SettingsPageContent />
    </Suspense>
  );
}
