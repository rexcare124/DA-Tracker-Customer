"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useRequireOnboarding } from "@/hooks/useRequireOnboarding";
import { useIncompleteRegistration } from "@/hooks/useIncompleteRegistration";
import { usePaymentSuccess } from "@/hooks/usePaymentSuccess";
import { usePaymentModalSeen } from "@/hooks/usePaymentModalSeen";
import { useFavorites } from "@/hooks/useFavorites";
import { BlockedAccessModal } from "@/components/BlockedAccessModal";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CheckCircle2 } from "lucide-react";
import { GovernmentEntityWithRelations } from "@/types/governmentEntityTypes";
import CityModal from "@/components/shared/CityModal";

/**
 * Fallback delay for showing success modal if session refresh is delayed
 */
const FALLBACK_MODAL_DELAY_MS = 2000;

/**
 * SessionStorage key for tracking if payment success modal has been shown in current session
 */
const MODAL_SHOWN_SESSION_KEY = "pk_payment_modal_shown_session";

function DashboardPageContent() {
  const router = useRouter();
  // CRITICAL: Check for payment success first (before checking onboarding)
  const {
    isPaymentSuccess,
    isLoading: paymentLoading,
    isSessionRefreshed,
    error: paymentError,
    clearSessionId,
  } = usePaymentSuccess();

  const {
    hasAccess,
    isLoading: onboardingLoading,
    showBlockedModal,
    handleRedirectToRegistration,
    status,
    session,
  } = useRequireOnboarding({
    check2FA: true,
    isPaymentSuccess, // Pass payment success to allow access during race condition
  });

  const {
    hasIncompleteRegistration,
    incompleteRegistrationData,
    isLoading: incompleteLoading,
    error: incompleteError,
    showPaymentModal,
    isProcessingPayment,
    initiatePayment,
  } = useIncompleteRegistration();

  // Check if user has already seen the payment success modal
  const { hasSeenModal, isLoading: modalSeenLoading, markModalAsSeen } = usePaymentModalSeen();

  const isLoading = onboardingLoading || incompleteLoading || paymentLoading || modalSeenLoading;

  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const hasShownModalRef = useRef(false);

  const { favorites, isLoading: favoritesLoading, isFavorite, toggleFavorite } = useFavorites();
  const [favoriteEntities, setFavoriteEntities] = useState<GovernmentEntityWithRelations[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<number | null>(null);

  /** Group favorited entities by government level for section subheadings (State, County, City, etc.) */
  const favoritesByGovernmentLevel = useMemo(() => {
    const byLevel = new Map<
      string,
      { groupKey: string; levelName: string; hierarchyOrder: number; entities: GovernmentEntityWithRelations[] }
    >();
    for (const entity of favoriteEntities) {
      const level = entity.governmentLevel;
      const groupKey = level ? String(level.id) : "other";
      const levelName = level?.levelName ?? "Other";
      const hierarchyOrder = level?.hierarchyOrder ?? 999;
      if (!byLevel.has(groupKey)) {
        byLevel.set(groupKey, { groupKey, levelName, hierarchyOrder, entities: [] });
      }
      byLevel.get(groupKey)!.entities.push(entity);
    }
    return Array.from(byLevel.values()).sort((a, b) => a.hierarchyOrder - b.hierarchyOrder);
  }, [favoriteEntities]);

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

    // If payment succeeded but session refresh is taking longer than expected,
    // show modal after a short delay (handles Fast Refresh remounts and async delays)
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
          if (!hasShownModalRef.current && !hasSeenModal) {
            // Mark modal as seen in Firebase FIRST, then show modal
            try {
              await markModalAsSeen();
              // Firebase update complete - safe to show modal
              hasShownModalRef.current = true;
              setShowSuccessModal(true);
              // Clear session_id after a short delay to avoid triggering re-renders
              setTimeout(() => clearSessionId(), 100);
            } catch (error) {
              // If Firebase update fails, still show modal (graceful degradation)
              secureLogger.error("Failed to mark modal as seen, showing anyway", {
                operation: "payment success modal",
              });
              hasShownModalRef.current = true;
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

  // Fetch favorited entity details when favorites list changes
  useEffect(() => {
    if (!session?.user?.id || favorites.length === 0) {
      setFavoriteEntities([]);
      setLoadingFavorites(false);
      return;
    }
    let cancelled = false;
    setLoadingFavorites(true);
    const fetchEntities = async () => {
      try {
        const results = await Promise.all(
          favorites.map(async (entityId: number): Promise<GovernmentEntityWithRelations | null> => {
            try {
              const res = await fetch(`/api/government-entities/${entityId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              });
              console.log({ res });
              if (!res.ok) return null;
              const data = await res.json();
              const entity =
                (data as { entity?: GovernmentEntityWithRelations }).entity ??
                (data as GovernmentEntityWithRelations);
              if (!entity || typeof entity !== "object" || !("id" in entity)) return null;
              return entity as GovernmentEntityWithRelations;
            } catch {
              return null;
            }
          }),
        );
        if (!cancelled) {
          setFavoriteEntities(results.filter((e): e is GovernmentEntityWithRelations => e != null));
        }
      } finally {
        if (!cancelled) setLoadingFavorites(false);
      }
    };
    void fetchEntities();
    return () => {
      cancelled = true;
    };
  }, [favorites, session?.user?.id]);

  if (isLoading) {
    return <Loading />;
  }

  // If not authenticated, show loading (redirect will happen)
  if (status === "unauthenticated") {
    return <Loading />;
  }

  // Check for incomplete registration first (payment required)
  if (hasIncompleteRegistration && incompleteRegistrationData) {
    const daysRemaining = incompleteRegistrationData.daysRemaining;
    return (
      <>
        <Loading />
        <Dialog
          open={showPaymentModal}
          onOpenChange={() => {}} // Non-dismissible - user must proceed to payment
        >
          <DialogContent className="sm:max-w-[425px] rounded-lg p-6" hideCloseButton={true}>
            <DialogHeader>
              <DialogTitle>Complete Your Registration</DialogTitle>
              <DialogDescription className="whitespace-pre-line">
                {incompleteError ? (
                  <>
                    {incompleteError.message}
                    <span className="block mt-2 text-sm">
                      Please try again or contact support if the problem persists.
                    </span>
                  </>
                ) : (
                  `Your registration is incomplete. Please complete payment to finish your registration. Your registration data will be deleted in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} if payment is not completed.`
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                onClick={initiatePayment}
                disabled={isProcessingPayment}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Checkout...
                  </>
                ) : (
                  "Complete Payment Now"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
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

      <DashboardContent
        title="Favorited Items"
        subtitle="Browse and manage your saved GDAP listings"
        emptyMessage="You don't have any favorited items."
      >
        {favoritesLoading || loadingFavorites ? (
          <div className="bg-[#f8f9fa] border border-[#ced4da] rounded-xl p-4 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-28 min-h-[7rem]" />
            ))}
          </div>
        ) : favoriteEntities.length > 0 ? (
          <div className="bg-[#f8f9fa] border border-[#ced4da] rounded-xl p-4 mt-4 space-y-8">
            {favoritesByGovernmentLevel.map(({ groupKey, levelName, entities }) => (
              <section key={groupKey}>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  {levelName} Government Departments
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
                  {entities.map((entity) => (
                    <li key={entity.id} className="w-full min-w-0">
                      <CityModal
                        entity={entity}
                        fullWidth
                        onViewPublicServiceReviews={() => router.push(`/datasearch/${entity.id}`)}
                        isFavorite={isFavorite(entity.id)}
                        onFavoriteClick={async () => {
                          setTogglingFavoriteId(entity.id);
                          try {
                            await toggleFavorite(entity.id);
                          } finally {
                            setTogglingFavoriteId(null);
                          }
                        }}
                        favoriteLoading={togglingFavoriteId === entity.id}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : undefined}
      </DashboardContent>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardPageContent />
    </Suspense>
  );
}
