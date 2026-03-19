"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface UseRequireOnboardingOptions {
  /**
   * If true, also checks 2FA status and redirects if required but not verified
   * @default true
   */
  check2FA?: boolean;
  /**
   * Custom redirect path for unauthenticated users
   * @default "/beta-client/registration"
   */
  redirectPath?: string;
  /**
   * Custom redirect path for 2FA required users
   * @default "/"
   */
  twoFactorRedirectPath?: string;
  /**
   * If true, allows access even if onboardingComplete is false (e.g., after successful payment)
   * @default false
   */
  isPaymentSuccess?: boolean;
}

interface UseRequireOnboardingReturn {
  /**
   * Whether the user has completed onboarding
   */
  hasAccess: boolean;
  /**
   * Whether the session is still loading
   */
  isLoading: boolean;
  /**
   * Whether to show the blocked access modal
   */
  showBlockedModal: boolean;
  /**
   * Handler to redirect to registration
   */
  handleRedirectToRegistration: () => void;
  /**
   * Session data (if available)
   */
  session: ReturnType<typeof useSession>["data"];
  /**
   * Session status
   */
  status: ReturnType<typeof useSession>["status"];
}

/**
 * Hook to enforce onboarding completion requirement for protected routes.
 * Handles authentication checks, 2FA verification, and onboarding completion.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing access state, loading state, and handlers
 */
export function useRequireOnboarding(
  options: UseRequireOnboardingOptions = {},
): UseRequireOnboardingReturn {
  const {
    check2FA = true,
    redirectPath = "/beta-client/registration",
    twoFactorRedirectPath = "/",
    isPaymentSuccess = false,
  } = options;

  const { data: session, status } = useSession();
  const router = useRouter();
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  /**
   * Check sessionStorage for persisted payment success state
   * This ensures payment success persists across navigation even after session_id is cleared
   */
  const getPersistedPaymentSuccess = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const persisted = sessionStorage.getItem("pk_payment_success");
      return persisted === "true";
    } catch {
      return false;
    }
  }, []);

  // Combine passed isPaymentSuccess with persisted value
  const effectivePaymentSuccess = isPaymentSuccess || getPersistedPaymentSuccess();

  useEffect(() => {
    console.log("[DEBUG] useRequireOnboarding: Checking access", {
      status,
      hasSession: !!session,
      userId: session?.user?.id,
      onboardingComplete: session?.user?.onboardingComplete,
      check2FA,
      isPaymentSuccess,
    });

    if (status === "loading") return;

    // CRITICAL: Don't redirect if payment just succeeded, even if session is temporarily unauthenticated
    // This prevents redirect loops when rate limits cause session verification to fail
    if (status === "unauthenticated") {
      if (effectivePaymentSuccess) {
        return;
      }
      router.push(redirectPath);
      return;
    }

    if (session?.user) {
      // Check if 2FA is required and not verified
      if (check2FA) {
        const user = session.user as {
          twoFactorRequired?: boolean;
          twoFactorVerified?: boolean;
        };

        if (user.twoFactorRequired && !user.twoFactorVerified) {
          console.log("[DEBUG] useRequireOnboarding: 2FA required but not verified, redirecting");
          router.push(twoFactorRedirectPath);
          return;
        }
      }

      // Require onboarding to be complete for access
      // BUT: Allow access if payment just succeeded (handles race condition where webhook hasn't updated session yet)
      const hasAccess = session.user.onboardingComplete === true || effectivePaymentSuccess;

      if (!hasAccess) {
        // User hasn't completed onboarding - show modal
        setShowBlockedModal(true);
        return;
      }
    }
  }, [
    session,
    status,
    router,
    check2FA,
    redirectPath,
    twoFactorRedirectPath,
    effectivePaymentSuccess,
    getPersistedPaymentSuccess,
  ]);

  const handleRedirectToRegistration = () => {
    setShowBlockedModal(false);
    router.push(redirectPath);
  };

  // Allow access if onboarding is complete OR payment just succeeded (including persisted state)
  const hasAccess =
    session?.user?.onboardingComplete === true || effectivePaymentSuccess;
  const isLoading = status === "loading";

  return {
    hasAccess,
    isLoading,
    showBlockedModal,
    handleRedirectToRegistration,
    session,
    status,
  };
}
