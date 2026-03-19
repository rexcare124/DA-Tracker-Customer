"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import ProgressBar from "@/components/betaclient/ProgressBar";
import SignInComponent from "@/components/betaclient/SignIn";
import PersonalInformation from "@/components/betaclient/PersonalInformation";
import DataInterests from "@/components/betaclient/DataInterests";
import RankMotivations from "@/components/betaclient/RankMotivations";
import GovernmentInterests from "@/components/betaclient/GovernmentInterests";
import InformationSources from "@/components/betaclient/InformationSources";

// Lazy load ChooseMembership component (heavy component with lots of UI)
// Only loaded when user reaches step 7
const ChooseMembership = dynamic(() => import("@/components/betaclient/ChooseMembership"), {
  loading: () => (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  ),
  ssr: false, // Disable SSR for membership selection component
});

import {
  PersonalInfo,
  FormData,
  STEP_NAMES,
  SignUpMethod,
  USER_HEARD_ABOUT_US,
  type MembershipSelection,
  type Agreements,
} from "@/components/betaclient/types";
import EmailCollectionModal from "@/components/betaclient/EmailCollectionModal";
import EmailVerificationModal from "@/components/betaclient/EmailVerificationModal";
import { useStripe } from "@/hooks/useStripe";
import { getStripePriceId } from "@/lib/constants/stripePrices";

export default function RegistrationPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();

  const [step, setStep] = useState<number>(1);
  const [signUpMethod, setSignUpMethod] = useState<SignUpMethod>(null);
  const totalSteps: number = 7;

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);

  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);
  const [validationModalMessage, setValidationModalMessage] = useState<string>("");
  const [validationModalAction, setValidationModalAction] = useState<
    | { kind: "none" }
    | { kind: "redirect_signin"; signOutOnOk: boolean }
    | { kind: "redirect_dashboard" }
  >({ kind: "none" });

  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

  // Email collection modal states
  const [showEmailCollectionModal, setShowEmailCollectionModal] = useState<boolean>(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState<boolean>(false);
  const [collectedEmail, setCollectedEmail] = useState<string>("");
  const [socialProvider, setSocialProvider] = useState<"Google" | "Facebook" | "LinkedIn">(
    "Google",
  );

  // Incomplete registration modal state
  const [showIncompleteRegistrationModal, setShowIncompleteRegistrationModal] =
    useState<boolean>(false);

  // Registration submission state - tracks if registration data has been submitted
  // Persisted in sessionStorage to handle page refreshes
  const [isRegistrationSubmitted, setIsRegistrationSubmitted] = useState<boolean>(false);

  // Expired code modal state - shown when verification code expires after submission
  const [showExpiredCodeModal, setShowExpiredCodeModal] = useState<boolean>(false);

  // Payment completion modal state - shown after email verification on step 7
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Stripe integration hook for payment after verification
  const { createCheckoutSession, loading: stripeLoading, error: stripeError } = useStripe();

  // Social authentication loading state
  const [isLoadingSocial, setIsLoadingSocial] = useState<"google" | "facebook" | "linkedin" | null>(
    null,
  );

  // OAuth processing loading state
  const [isProcessingOAuthReturn, setIsProcessingOAuthReturn] = useState<boolean>(false);

  // Email collection state management - using sessionStorage for persistence
  const [emailCollectionShown, setEmailCollectionShown] = useState<boolean>(false);
  const socialEmailValidationRef = useRef<string>("");

  // Track if OAuth return has been processed in this component lifecycle (secure, in-memory)
  // This prevents the incomplete registration modal from showing during initial OAuth flow
  const hasProcessedOAuthReturn = useRef<boolean>(false);

  // SECURITY: Store password temporarily in memory for auto-login after email verification
  // Password is only stored during email/password registration and cleared immediately after use
  // Never persisted to localStorage/sessionStorage - memory only
  const passwordRef = useRef<string | null>(null);

  // Restore loading state on component mount
  useEffect(() => {
    // Check if we're returning from a social login
    const savedLoadingState = sessionStorage.getItem("isLoadingSocial") as
      | "google"
      | "facebook"
      | "linkedin"
      | null;
    const isSocialLogin = sessionStorage.getItem("isSocialLogin");

    // Restore email collection state from sessionStorage
    const savedEmailCollectionShown = sessionStorage.getItem("emailCollectionShown") === "true";
    setEmailCollectionShown(savedEmailCollectionShown);

    // Restore registration submission state from sessionStorage and verify account exists
    const savedRegistrationSubmitted = sessionStorage.getItem("isRegistrationSubmitted") === "true";
    const signInMethodFromStorage = sessionStorage.getItem("signInMethod");

    // Only restore state for email/password registrations
    if (savedRegistrationSubmitted && signInMethodFromStorage === "email") {
      // Verify account exists by checking if email is in use
      const email = formData.personalInfo.email?.trim().toLowerCase();
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        // Lightweight check: attempt to fetch user data - if successful, account exists
        fetch("/api/rbca/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (response.ok) {
              // Account exists - restore disabled state
              setIsRegistrationSubmitted(true);
            } else {
              // Account doesn't exist - clear flag (API failed after storage was set)
              sessionStorage.removeItem("isRegistrationSubmitted");
            }
          })
          .catch(() => {
            // Network error - clear flag to allow re-submission
            sessionStorage.removeItem("isRegistrationSubmitted");
          });
      } else {
        // Invalid email - clear flag
        sessionStorage.removeItem("isRegistrationSubmitted");
      }
    }

    // Only restore loading state if we're actually returning from OAuth (check URL parameters)
    const urlParams = new URLSearchParams(window.location.search);
    const isSocialFromUrl = urlParams.get("social") === "true";
    const providerFromUrl = urlParams.get("provider");

    // Only show loading overlay if we have both sessionStorage state AND URL parameters indicating OAuth return
    if (savedLoadingState && isSocialLogin === "true" && isSocialFromUrl && providerFromUrl) {
      setIsLoadingSocial(savedLoadingState);
    } else {
      // Clear any stale loading state if we're not returning from OAuth
      if (savedLoadingState) {
        sessionStorage.removeItem("isLoadingSocial");
      }
    }
  }, []);

  // SECURITY: Cleanup password from memory when component unmounts or signUpMethod changes
  // Prevents password from lingering in memory if user navigates away or switches registration methods
  useEffect(() => {
    return () => {
      // Clear password on unmount
      passwordRef.current = null;
    };
  }, []);

  // SECURITY: Clear password when signUpMethod changes (e.g., user switches from email to social)
  // Prevents password from being used for wrong registration method
  useEffect(() => {
    if (signUpMethod !== "email") {
      passwordRef.current = null;
    }
  }, [signUpMethod]);

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      prefix: "",
      firstName: "",
      lastName: "",
      suffix: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      username: "",
      defaultPrivacyLevel: "",
      stateOfResidence: "",
      cityOfResidence: "",
      zipCode: "",
      howDidYouHearAboutUs: "",
      forumUrl: "",
      youtubeUrl: "",
      referredByUsername: "",
      flyerPromoCode: "",
      otherHeardAboutText: "",
      agreementAccepted: false,
    },
    dataInterests: [],
    otherInterestText: "",
    rankedMotivations: [],
    rankedGovernments: [],
    rankedInformationSources: [],
    otherInformationSourceText: "",
    agreementAccepted: false,
    membershipSelection: null,
    agreements: {
      betaClient: false,
      termsOfUse: false,
      privacyPolicy: false,
    },
  });

  const [dataInterestsErrors, setDataInterestsErrors] = useState<{
    interests?: string;
    other?: string;
  }>({});

  // Helper function to extract first and last names from social login data
  const extractNamesFromSocialLogin = (fullName?: string | null) => {
    if (!fullName || fullName.trim() === "") {
      return { firstName: "", lastName: "" };
    }

    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" };
    } else if (nameParts.length === 2) {
      return { firstName: nameParts[0], lastName: nameParts[1] };
    } else {
      // For names with more than 2 parts, first part is firstName, rest is lastName
      return {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
      };
    }
  };

  // Comprehensive cleanup function for social login state
  const cleanupSocialLoginState = () => {
    // Preserve the provider information before cleanup
    const urlParams = new URLSearchParams(window.location.search);
    const providerFromUrl = urlParams.get("provider");
    if (providerFromUrl) {
      sessionStorage.setItem("signInMethod", providerFromUrl);
    }

    // Clear sessionStorage (except signInMethod which we just preserved)
    sessionStorage.removeItem("isSocialLogin");
    sessionStorage.removeItem("socialProvider");
    sessionStorage.removeItem("isLoadingSocial");
    sessionStorage.removeItem("emailCollectionShown");

    // Clean up URL parameters
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  };

  // Validate social login state and provider information
  const validateSocialLoginState = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const providerFromUrl = urlParams.get("provider");

    if (providerFromUrl && !["google", "facebook", "linkedin"].includes(providerFromUrl)) {
      // Clean up invalid state
      cleanupSocialLoginState();
      return false;
    }

    return true;
  }, []);

  // Get provider-specific email behavior
  const getProviderEmailBehavior = (provider: string) => {
    switch (provider) {
      case "google":
        return { typicallyProvidesEmail: true, fallbackProvider: "Google" };
      case "facebook":
        return { typicallyProvidesEmail: false, fallbackProvider: "Facebook" };
      case "linkedin":
        return { typicallyProvidesEmail: true, fallbackProvider: "LinkedIn" };
      default:
        return { typicallyProvidesEmail: true, fallbackProvider: "Google" };
    }
  };

  // Handle authentication state changes
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Validate social login state first
      if (!validateSocialLoginState()) {
        return;
      }

      // Clear loading state
      setIsLoadingSocial(null);
      sessionStorage.removeItem("isLoadingSocial");

      // Enhanced detection logic: Check both URL parameters and sessionStorage
      const urlParams = new URLSearchParams(window.location.search);
      const isSocialFromUrl = urlParams.get("social") === "true";
      const providerFromUrl = urlParams.get("provider") as
        | "google"
        | "facebook"
        | "linkedin"
        | null;

      // Fallback: sessionStorage (for edge cases)
      const isSocialFromStorage = sessionStorage.getItem("isSocialLogin") === "true";
      const providerFromStorage = sessionStorage.getItem("socialProvider") as
        | "Google"
        | "Facebook"
        | "LinkedIn"
        | null;

      const isSocialLoginReturn = isSocialFromUrl || isSocialFromStorage;
      const socialProvider = providerFromUrl
        ? ((providerFromUrl.charAt(0).toUpperCase() + providerFromUrl.slice(1)) as
            | "Google"
            | "Facebook"
            | "LinkedIn")
        : providerFromStorage;

      if (isSocialLoginReturn) {
        // Mark that we've processed OAuth return (prevents modal from showing after cleanup)
        hasProcessedOAuthReturn.current = true;

        // Set OAuth processing loading state immediately
        setIsProcessingOAuthReturn(true);

        setSignUpMethod("social");

        // Extract names from social login data
        const { firstName, lastName } = extractNamesFromSocialLogin(session.user.name);

        // Check if user has email
        if (session.user.email && !session.user.onboardingComplete) {
          // User has email, proceed to step 2
          setFormData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              email: session.user.email || "",
              firstName: firstName,
              lastName: lastName,
            },
          }));

          // Show loading for 1 second, then transition to step 2
          setTimeout(() => {
            setStep(2);
            setIsProcessingOAuthReturn(false);

            // Clean up social login state
            cleanupSocialLoginState();
          }, 1000);
        } else if (!session.user.email) {
          // Only show email collection modal if we haven't shown it before for this session
          if (!emailCollectionShown) {
            // Get provider-specific email behavior
            const providerKey = providerFromUrl || providerFromStorage?.toLowerCase();
            const emailBehavior = getProviderEmailBehavior(providerKey || "google");

            // User doesn't have email, show email collection modal
            setSocialProvider(
              socialProvider ||
                (emailBehavior.fallbackProvider as "Google" | "Facebook" | "LinkedIn"),
            );
            setShowEmailCollectionModal(true);
            setEmailCollectionShown(true);
            sessionStorage.setItem("emailCollectionShown", "true");

            // Clear OAuth processing loading state
            setIsProcessingOAuthReturn(false);
          } else {
            setIsProcessingOAuthReturn(false);
          }
        } else {
          // Clean up social login state
          cleanupSocialLoginState();

          // Show modal informing user they're already registered
          // Determine appropriate message based on sign-in method
          const userId = session?.user?.id;
          getRegistrationCompletionMessage(userId).then((message) => {
            // Explicitly set redirect action - type-safe and maintainable
            handleShowValidationModal(message, { kind: "redirect_dashboard" });
          });

          // Clear OAuth processing loading state
          setIsProcessingOAuthReturn(false);
        }
      } else {
        // User is authenticated but not returning from OAuth callback
        // Check if they have incomplete registration
        if (session.user && !session.user.onboardingComplete) {
          // Check if this is an OAuth user (has email but incomplete registration)
          const hasEmail = !!session.user.email;
          if (hasEmail) {
            // Only show incomplete registration modal if:
            // 1. OAuth return has NOT been processed in this component lifecycle (user signed out and signed back in)
            // 2. User is on step 1 (not already in the middle of registration)
            // This prevents the modal from showing during initial OAuth flow or after page refresh during registration
            if (!hasProcessedOAuthReturn.current && step === 1) {
              // Show incomplete registration modal
              setShowIncompleteRegistrationModal(true);
              // Set them to step 2 (Personal Information) since they're already authenticated
              setStep(2);

              // Fetch user data from Firebase to pre-fill form (including separated suffix)
              const fetchUserData = async () => {
                try {
                  const response = await fetch("/api/rbca/users", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  });

                  if (response.ok) {
                    const userData = await response.json();
                    if (userData.personalInfo) {
                      // Set signUpMethod based on signInMethod from Firebase (google, facebook, linkedin = "social")
                      const signInMethod = userData.signInMethod;
                      // Type-safe validation: ensure signInMethod is a valid OAuth provider
                      const validOAuthProviders = ["google", "facebook", "linkedin"] as const;
                      if (
                        signInMethod &&
                        typeof signInMethod === "string" &&
                        validOAuthProviders.includes(
                          signInMethod as (typeof validOAuthProviders)[number],
                        )
                      ) {
                        setSignUpMethod("social");
                        // Persist signInMethod to sessionStorage for use in handleFinalSubmit
                        // Only store validated values to prevent client-side manipulation issues
                        sessionStorage.setItem("signInMethod", signInMethod);
                      }

                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          email: userData.personalInfo.email || session.user.email || "",
                          firstName: userData.personalInfo.firstName || "",
                          lastName: userData.personalInfo.lastName || "",
                          suffix: userData.personalInfo.suffix || "",
                          prefix: userData.personalInfo.prefix || "",
                          username: userData.personalInfo.username || "",
                          stateOfResidence: userData.personalInfo.stateOfResidence || "",
                          cityOfResidence: userData.personalInfo.cityOfResidence || "",
                          zipCode: userData.personalInfo.zipCode || "",
                          defaultPrivacyLevel: userData.personalInfo.defaultPrivacyLevel || "",
                          howDidYouHearAboutUs: userData.personalInfo.howDidYouHearAboutUs || "",
                          // Include suffixDetectionAsked flag from API response
                          suffixDetectionAsked: userData.personalInfo.suffixDetectionAsked ?? false,
                        } as typeof prev.personalInfo & { suffixDetectionAsked?: boolean },
                      }));
                    }
                  } else {
                    // Fallback to session data if Firebase fetch fails
                    // This can happen for first-time Facebook users who haven't completed registration yet
                    if (session.user.email) {
                      const { firstName, lastName } = extractNamesFromSocialLogin(
                        session.user.name,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          email: session.user.email || "",
                          firstName: firstName,
                          lastName: lastName,
                          // Include suffixDetectionAsked flag (defaults to false for first-time users)
                          suffixDetectionAsked: false,
                        } as typeof prev.personalInfo & { suffixDetectionAsked?: boolean },
                      }));

                      // If user has image (OAuth user) but Firebase fetch failed, still set as social
                      // The signInMethod will be determined in handleFinalSubmit from URL params or sessionStorage
                      if (session.user.image) {
                        setSignUpMethod("social");
                      }
                    }
                  }
                } catch (error) {
                  // Fallback to session data if fetch fails
                  if (session.user.email) {
                    const { firstName, lastName } = extractNamesFromSocialLogin(session.user.name);
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        email: session.user.email || "",
                        firstName: firstName,
                        lastName: lastName,
                        // Include suffixDetectionAsked flag (defaults to false for first-time users)
                        suffixDetectionAsked: false,
                      } as typeof prev.personalInfo & { suffixDetectionAsked?: boolean },
                    }));

                    // If user has image (OAuth user) but Firebase fetch failed, still set as social
                    // The signInMethod will be determined in handleFinalSubmit from URL params or sessionStorage
                    if (session.user.image) {
                      setSignUpMethod("social");
                    }
                  }
                }
              };

              void fetchUserData();
            }
          }
        } else if (session.user?.onboardingComplete) {
          // If user has completed onboarding but is on registration page, show modal
          // Determine appropriate message based on sign-in method
          // const userId = session.user.id;
          // getRegistrationCompletionMessage(userId).then((message) => {
          //   // Explicitly set redirect action - type-safe and maintainable
          //   handleShowValidationModal(message, { kind: "redirect_dashboard" });
          // });
        }
      }
    } else if (status === "unauthenticated" && isLoadingSocial) {
      // Clear loading state if authentication fails
      setIsLoadingSocial(null);
      sessionStorage.removeItem("isLoadingSocial");
      sessionStorage.removeItem("isSocialLogin");
      sessionStorage.removeItem("socialProvider");
      sessionStorage.removeItem("signInMethod");
    } else {
    }
  }, [status, session, isLoadingSocial, emailCollectionShown, validateSocialLoginState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof PersonalInfo,
  ) => {
    const { type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [key]: value },
    }));
  };

  const handleAgreementChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "agreementAccepted",
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: e.target.checked };
      return newData;
    });
  };

  /**
   * Handle membership selection change
   */
  const handleMembershipChange = (membership: MembershipSelection | null): void => {
    setFormData((prev) => ({
      ...prev,
      membershipSelection: membership,
    }));
  };

  /**
   * Handle individual agreement checkbox change
   */
  const handleAgreementCheckboxChange = (agreement: keyof Agreements, checked: boolean): void => {
    setFormData((prev) => ({
      ...prev,
      agreements: {
        ...(prev.agreements ?? {
          betaClient: false,
          termsOfUse: false,
          privacyPolicy: false,
        }),
        [agreement]: checked,
      },
      // Also update legacy agreementAccepted for backward compatibility
      agreementAccepted: agreement === "betaClient" && checked ? checked : prev.agreementAccepted,
    }));
  };

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const handleSocialSignUp = (
    provider: "google" | "facebook" | "linkedin",
    event?: React.MouseEvent,
  ) => {
    // Prevent any default form submission behavior and stop propagation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Reset email collection flag for new social login
    setEmailCollectionShown(false);
    sessionStorage.removeItem("emailCollectionShown");

    // Store social login info
    sessionStorage.setItem("isSocialLogin", "true");
    const providerName = (provider.charAt(0).toUpperCase() + provider.slice(1)) as
      | "Google"
      | "Facebook"
      | "LinkedIn";
    sessionStorage.setItem("socialProvider", providerName);
    sessionStorage.setItem("signInMethod", provider);

    // Set loading state for OAuth redirect (this will be restored when returning)
    sessionStorage.setItem("isLoadingSocial", provider);

    // Use URL parameters to preserve state across OAuth redirect
    // This is secure because we're only passing non-sensitive state information
    const callbackUrl = `/beta-client/registration?social=true&provider=${provider}`;

    // Ultra-fast redirect: Minimal delay for immediate response
    setTimeout(() => {
      signIn(provider, {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    }, 50); // Ultra-fast delay for immediate response
  };

  // Create type-safe form data factory function
  const createCleanFormData = (): FormData => ({
    personalInfo: {
      prefix: "",
      firstName: "",
      lastName: "",
      suffix: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      username: "",
      defaultPrivacyLevel: "",
      stateOfResidence: "",
      cityOfResidence: "",
      zipCode: "",
      howDidYouHearAboutUs: "",
      forumUrl: "",
      youtubeUrl: "",
      referredByUsername: "",
      flyerPromoCode: "",
      otherHeardAboutText: "",
      agreementAccepted: false,
    },
    dataInterests: [],
    otherInterestText: "",
    rankedMotivations: [],
    rankedGovernments: [],
    rankedInformationSources: [],
    otherInformationSourceText: "",
    agreementAccepted: false,
  });

  // Enhanced session cleanup with security logging
  const secureSessionCleanup = (reason: string): void => {
    // Clear all OAuth-related session storage
    const oauthKeys = [
      "isSocialLogin",
      "socialProvider",
      "isLoadingSocial",
      "emailCollectionShown",
    ];

    oauthKeys.forEach((key) => {
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleEmailSignUp = (): void => {
    try {
      // Security: Clear any existing OAuth contamination (T1539 - Steal Web Session Cookie mitigation)
      secureSessionCleanup("email_registration_switch");

      // Type-safe form data reset (T1055 - Process Injection mitigation)
      const cleanFormData = createCleanFormData();
      setFormData(cleanFormData);

      // Clear any error states
      setDataInterestsErrors({});

      // Reset registration method securely
      setSignUpMethod("email");
      setEmailCollectionShown(false);

      // Set secure session marker for email registration
      sessionStorage.setItem("signInMethod", "email");

      nextStep();
    } catch (error) {
      console.error("🔒 [SECURITY] Error during email registration setup:", error);
      // Fail securely - don't proceed if cleanup fails
      throw new Error("Failed to initialize secure email registration");
    }
  };

  // Comprehensive form validation for email sign-up (matching server-side schema)
  const validateEmailSignUpForm = () => {
    const errors: string[] = [];

    // Email validation
    if (!formData.personalInfo.email?.trim()) {
      errors.push("Email address is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.email)) {
      errors.push("Please enter a valid email address");
    }

    // Email confirmation validation
    if (!formData.personalInfo.confirmEmail?.trim()) {
      errors.push("Please confirm your email address");
    } else if (
      formData.personalInfo.email?.toLowerCase() !==
      formData.personalInfo.confirmEmail?.toLowerCase()
    ) {
      errors.push("Email addresses do not match");
    }

    // Name validation
    if (!formData.personalInfo.firstName?.trim()) {
      errors.push("First name is required");
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.personalInfo.firstName)) {
      errors.push("First name can only contain letters, spaces, hyphens, and apostrophes");
    } else if (formData.personalInfo.firstName.length > 50) {
      errors.push("First name is too long (max 50 characters)");
    }

    if (!formData.personalInfo.lastName?.trim()) {
      errors.push("Last name is required");
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.personalInfo.lastName)) {
      errors.push("Last name can only contain letters, spaces, hyphens, and apostrophes");
    } else if (formData.personalInfo.lastName.length > 50) {
      errors.push("Last name is too long (max 50 characters)");
    }

    // Password validation (matching server requirements)
    if (!formData.personalInfo.password?.trim()) {
      errors.push("Password is required");
    } else if (formData.personalInfo.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    } else if (formData.personalInfo.password.length > 128) {
      errors.push("Password is too long (max 128 characters)");
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.personalInfo.password)) {
      errors.push(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      );
    }

    // Password confirmation validation
    if (!formData.personalInfo.confirmPassword?.trim()) {
      errors.push("Please confirm your password");
    } else if (formData.personalInfo.password !== formData.personalInfo.confirmPassword) {
      errors.push("Passwords do not match");
    }

    // Username validation (matching server requirements)
    if (!formData.personalInfo.username?.trim()) {
      errors.push("Username is required");
    } else if (formData.personalInfo.username.length < 3) {
      errors.push("Username must be at least 3 characters");
    } else if (formData.personalInfo.username.length > 30) {
      errors.push("Username must be less than 30 characters");
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.personalInfo.username)) {
      errors.push("Username can only contain letters, numbers, underscores, and hyphens");
    }

    // Location validation
    if (!formData.personalInfo.stateOfResidence?.trim()) {
      errors.push("State of residence is required");
    }

    if (!formData.personalInfo.cityOfResidence?.trim()) {
      errors.push("City of residence is required");
    } else if (formData.personalInfo.cityOfResidence.length > 100) {
      errors.push("City name is too long (max 100 characters)");
    }

    if (!formData.personalInfo.zipCode?.trim()) {
      errors.push("ZIP code is required");
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.personalInfo.zipCode)) {
      errors.push("Invalid ZIP code format (use 12345 or 12345-6789)");
    }

    // Privacy level validation
    if (!formData.personalInfo.defaultPrivacyLevel) {
      errors.push("Please select a privacy level");
    } else if (
      !["Anonymous", "Username Only", "Your First Name & Last Initial", "Your Full Name"].includes(
        formData.personalInfo.defaultPrivacyLevel,
      )
    ) {
      errors.push("Please select a valid privacy level");
    }

    // How did you hear about us validation
    if (!formData.personalInfo.howDidYouHearAboutUs?.trim()) {
      errors.push("Please select how you heard about us");
    }

    // Conditional validation for "How Did You Hear About Us" follow-up fields
    if (formData.personalInfo.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.ONLINE_COMMUNITY_FORUM) {
      if (!formData.personalInfo.forumUrl?.trim()) {
        errors.push("Please enter the website URL of the forum");
      }
    }

    if (formData.personalInfo.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.YOUTUBE_PERSONALITY) {
      if (!formData.personalInfo.youtubeUrl?.trim()) {
        errors.push("Please enter the YouTube channel URL");
      }
    }

    if (
      formData.personalInfo.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.REFERRED_BY_EXISTING_MEMBER
    ) {
      if (!formData.personalInfo.referredByUsername?.trim()) {
        errors.push("Please enter the member/user's username");
      }
    }

    if (formData.personalInfo.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.COMMUNITY_FLYER) {
      if (!formData.personalInfo.flyerPromoCode?.trim()) {
        errors.push("Please enter the community flyer promo code");
      }
    }

    if (formData.personalInfo.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.OTHER) {
      if (!formData.personalInfo.otherHeardAboutText?.trim()) {
        errors.push("Please tell us how you heard about us");
      }
    }

    // Terms and policy acceptance
    if (!formData.agreementAccepted) {
      errors.push("You must accept the agreement to continue");
    }

    // Data interests validation
    if (!formData.dataInterests || formData.dataInterests.length === 0) {
      errors.push("Please select at least one data interest");
    } else if (formData.dataInterests.length > 10) {
      errors.push("Too many data interests selected (max 10)");
    }

    // Ranked motivations validation
    if (!formData.rankedMotivations || formData.rankedMotivations.length === 0) {
      errors.push("Please rank your motivations");
    } else if (formData.rankedMotivations.length > 10) {
      errors.push("Too many motivations selected (max 10)");
    }

    // Government interests validation
    if (!formData.rankedGovernments || formData.rankedGovernments.length === 0) {
      errors.push("Please rank your government interests");
    } else if (formData.rankedGovernments.length > 5) {
      errors.push("Too many government types selected (max 5)");
    }

    // Information sources validation
    if (!formData.rankedInformationSources || formData.rankedInformationSources.length === 0) {
      errors.push("Please rank your information sources");
    }

    return errors;
  };

  const validateFormData = () => {
    const errors: string[] = [];

    // Data interests validation
    if (!formData.dataInterests || formData.dataInterests.length === 0) {
      errors.push("Please select at least one data interest");
    } else if (formData.dataInterests.length > 10) {
      errors.push("Too many data interests selected (max 10)");
    }

    // Ranked motivations validation
    if (!formData.rankedMotivations || formData.rankedMotivations.length === 0) {
      errors.push("Please rank your motivations");
    } else if (formData.rankedMotivations.length > 10) {
      errors.push("Too many motivations selected (max 10)");
    }

    // Government interests validation
    if (!formData.rankedGovernments || formData.rankedGovernments.length === 0) {
      errors.push("Please rank your government interests");
    } else if (formData.rankedGovernments.length > 5) {
      errors.push("Too many government types selected (max 5)");
    }

    // Information sources validation
    if (!formData.rankedInformationSources || formData.rankedInformationSources.length === 0) {
      errors.push("Please rank your information sources");
    } else if (formData.rankedInformationSources.length > 12) {
      errors.push("Too many information sources selected (max 12)");
    }

    // Agreement acceptance
    if (!formData.agreementAccepted) {
      errors.push("You must accept the agreement to continue");
    }

    return errors;
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      if (signUpMethod === "social") {
        if (!session?.user?.id) {
          handleShowValidationModal("Authentication error. Please sign in again.");
          setStep(1);
          return;
        }
        const userId = session.user.id;

        // Type-safe provider validation helper
        const validSignInMethods = ["email", "google", "facebook", "linkedin"] as const;
        type ValidSignInMethod = (typeof validSignInMethods)[number];

        const isValidSignInMethod = (value: unknown): value is ValidSignInMethod => {
          return (
            typeof value === "string" && validSignInMethods.includes(value as ValidSignInMethod)
          );
        };

        // Get signInMethod from URL parameters first, then sessionStorage, then try to fetch from Firebase
        const urlParams = new URLSearchParams(window.location.search);
        const providerFromUrl = urlParams.get("provider");

        // Validate URL parameter before using it
        let signInMethod: ValidSignInMethod | null = isValidSignInMethod(providerFromUrl)
          ? providerFromUrl
          : null;

        // If not from URL, try sessionStorage (but validate it - client-side storage can be manipulated)
        if (!signInMethod) {
          const storedMethod = sessionStorage.getItem("signInMethod");
          if (isValidSignInMethod(storedMethod)) {
            signInMethod = storedMethod;
          }
        }

        // If signInMethod is still not found, try to fetch from existing user data in Firebase
        if (!signInMethod) {
          try {
            const userDataResponse = await fetch("/api/rbca/users", {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });

            if (userDataResponse.ok) {
              const userData = await userDataResponse.json();
              // Validate the response from Firebase before using it
              const validatedMethod = userData.signInMethod;
              if (isValidSignInMethod(validatedMethod)) {
                signInMethod = validatedMethod;
                // Persist validated value to sessionStorage for future use
                sessionStorage.setItem("signInMethod", validatedMethod);
              }
            }
          } catch (error) {
            // If fetch fails, continue to error handling below
            // Error is handled gracefully with user-friendly message
          }
        }

        // Validate signInMethod - if still not found, show error and require re-authentication
        if (!signInMethod) {
          handleShowValidationModal(
            "Unable to determine your sign-in method. Please sign out and sign in again to complete your registration.",
          );
          setIsLoading(false);
          return;
        }

        const requestBody = {
          personalInfo: formData.personalInfo,
          dataInterests: formData.dataInterests,
          otherInterestText: formData.otherInterestText || "",
          rankedMotivations: formData.rankedMotivations,
          rankedGovernments: formData.rankedGovernments,
          rankedInformationSources: formData.rankedInformationSources,
          otherInformationSourceText: formData.otherInformationSourceText || "",
          // Don't set onboardingComplete here - let API set it based on membership selection
          // API will set onboardingComplete: false if membershipSelection exists (pending payment)
          agreementAccepted: true,
          signInMethod: signInMethod,
          membershipSelection: formData.membershipSelection ?? null,
          agreements: formData.agreements ?? {
            betaClient: false,
            termsOfUse: false,
            privacyPolicy: false,
          },
        };

        const response = await fetch(`/api/rbca/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...requestBody,
            sessionId: userId,
            registrationStep: 7,
            // Don't set onboardingComplete here - let API handle it based on membership selection
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          // Extract error message from various possible response formats
          let errorMessage = "Failed to update user data.";
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
            if (responseData.details) {
              errorMessage += ` ${responseData.details}`;
            }
          } else if (responseData.details) {
            errorMessage = responseData.details;
          }
          throw new Error(errorMessage);
        }

        // Check if membership selection exists - if so, show payment modal
        // Social users don't need email verification, so payment modal appears immediately
        if (formData.membershipSelection) {
          // Show payment completion modal (non-dismissible) for social users
          setShowPaymentModal(true);
          return;
        }

        // Fallback: No membership selection (shouldn't happen, but handle gracefully)
        // Keep user signed in and show success message with redirect to dashboard
        const providerLabel = getSocialProviderLabel(); // Get provider name (Google, Facebook, or LinkedIn)
        handleShowValidationModal(
          `Thanks for registering with your ${providerLabel} account. You will now be redirected to your dashboard.`,
          { kind: "redirect_dashboard" }, // Explicit redirect action - type-safe and maintainable
        );
      } else if (signUpMethod === "email") {
        // Validate form data before submission
        const validationErrors = validateEmailSignUpForm();
        if (validationErrors && validationErrors.length > 0) {
          const errorMessage = validationErrors.join("\n");
          handleShowValidationModal(`Validation failed:\n${errorMessage}`);
          return;
        }

        // SECURITY: Store password temporarily in memory for auto-login after email verification
        // Only store if password exists and is a valid string
        // Password will be cleared immediately after successful sign-in
        if (formData.personalInfo.password && typeof formData.personalInfo.password === "string") {
          passwordRef.current = formData.personalInfo.password;
        }

        // Prepare request body with all required fields
        const requestBody = {
          personalInfo: {
            prefix: formData.personalInfo.prefix || "",
            firstName: formData.personalInfo.firstName,
            lastName: formData.personalInfo.lastName,
            suffix: formData.personalInfo.suffix || "",
            email: formData.personalInfo.email,
            confirmEmail: formData.personalInfo.confirmEmail,
            password: formData.personalInfo.password,
            confirmPassword: formData.personalInfo.confirmPassword,
            username: formData.personalInfo.username,
            defaultPrivacyLevel: formData.personalInfo.defaultPrivacyLevel || "",
            stateOfResidence: formData.personalInfo.stateOfResidence,
            cityOfResidence: formData.personalInfo.cityOfResidence,
            zipCode: formData.personalInfo.zipCode,
            howDidYouHearAboutUs: formData.personalInfo.howDidYouHearAboutUs || "",
            forumUrl: formData.personalInfo.forumUrl || "",
            youtubeUrl: formData.personalInfo.youtubeUrl || "",
            referredByUsername: formData.personalInfo.referredByUsername || "",
            flyerPromoCode: formData.personalInfo.flyerPromoCode || "",
            otherHeardAboutText: formData.personalInfo.otherHeardAboutText || "",
          },
          dataInterests: formData.dataInterests,
          otherInterestText: formData.otherInterestText || "",
          rankedMotivations: formData.rankedMotivations,
          rankedGovernments: formData.rankedGovernments,
          rankedInformationSources: formData.rankedInformationSources,
          otherInformationSourceText: formData.otherInformationSourceText || "",
          agreementAccepted: formData.agreementAccepted,
          signInMethod: sessionStorage.getItem("signInMethod") || "email",
          membershipSelection: formData.membershipSelection ?? null,
          agreements: formData.agreements ?? {
            betaClient: false,
            termsOfUse: false,
            privacyPolicy: false,
          },
        };

        // Route to appropriate API based on sign-in method with type safety
        const signInMethod = sessionStorage.getItem("signInMethod") as
          | "email"
          | "google"
          | "facebook"
          | "linkedin"
          | null;
        const apiEndpoint = signInMethod === "email" ? "/api/users" : "/api/rbca/users";

        const createResponse = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...requestBody,
            sessionId:
              signInMethod === "email"
                ? undefined
                : `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            registrationStep: 7,
            onboardingComplete: true,
          }),
        });

        const createData = await createResponse.json();

        if (!createResponse.ok) {
          // Try to extract detailed error information
          let errorMessage = "Failed to create account.";

          if (createData.message) {
            errorMessage = createData.message;
          } else if (createData.error) {
            errorMessage = createData.error;
          } else if (createData.errors && Array.isArray(createData.errors)) {
            // Format server-side validation errors with type safety
            const validationErrors = createData.errors.map((err: unknown) => {
              // Type-safe error object validation
              if (typeof err === "object" && err !== null) {
                if (
                  "field" in err &&
                  "message" in err &&
                  typeof err.field === "string" &&
                  typeof err.message === "string"
                ) {
                  return `${err.field}: ${err.message}`;
                }
                if ("message" in err && typeof err.message === "string") {
                  return err.message;
                }
              }
              if (typeof err === "string") {
                return err;
              }
              return String(err);
            });
            errorMessage = `Validation failed:\n${validationErrors.join("\n")}`;
          } else if (typeof createData === "string") {
            errorMessage = createData;
          }

          throw new Error(errorMessage);
        }

        // Send verification code using the new email verification system
        try {
          // SECURITY: Normalize email before sending
          const emailToVerify = formData.personalInfo.email?.trim().toLowerCase() || "";
          if (!emailToVerify || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToVerify)) {
            throw new Error("Invalid email address. Please check your email and try again.");
          }

          const sendCodeResponse = await fetch("/api/auth/send-email-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailToVerify,
            }),
          });

          if (!sendCodeResponse.ok) {
            let errorMessage = "Failed to send verification code.";
            try {
              const errorData = await sendCodeResponse.json();
              // SECURITY: Type-safe error message extraction with validation
              if (
                typeof errorData === "object" &&
                errorData !== null &&
                "message" in errorData &&
                typeof errorData.message === "string"
              ) {
                errorMessage = errorData.message;
              }
            } catch {
              // If JSON parsing fails, use default message
            }
            throw new Error(errorMessage);
          }

          // Mark registration as submitted and persist to sessionStorage
          setIsRegistrationSubmitted(true);
          sessionStorage.setItem("isRegistrationSubmitted", "true");

          setShowVerificationModal(true);
        } catch (sendError: unknown) {
          const errorMessage =
            sendError instanceof Error
              ? sendError.message
              : "Failed to send verification code. Please try again.";
          throw new Error(errorMessage);
        }
      }
    } catch (error: unknown) {
      // SECURITY: Clear password from memory on registration failure
      // Prevents password from lingering in memory if registration fails
      if (signUpMethod === "email") {
        passwordRef.current = null;
        // Clear registration submitted state on failure
        setIsRegistrationSubmitted(false);
        sessionStorage.removeItem("isRegistrationSubmitted");
      }

      // Type-safe error handling
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "An unexpected error occurred.";
      handleShowValidationModal(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initiate Stripe checkout after email verification
   * Called when user clicks "Proceed to Payment" button
   */
  const initiateStripeCheckoutAfterVerification = async (): Promise<void> => {
    if (!formData.membershipSelection) {
      handleShowValidationModal("Membership selection not found. Please contact support.", {
        kind: "none",
      });
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      // Get the Stripe Price ID for the selected membership and billing frequency
      const priceId = getStripePriceId(
        formData.membershipSelection.level,
        formData.membershipSelection.billingFrequency,
      );

      console.log("[DEBUG] Creating Stripe checkout session after email verification", {
        priceId: priceId.substring(0, 10) + "***",
        membershipLevel: formData.membershipSelection.level,
        billingFrequency: formData.membershipSelection.billingFrequency,
        userEmail: formData.personalInfo.email,
      });

      // Create Stripe Checkout Session and redirect
      // Pass email for unauthenticated registration flow
      await createCheckoutSession(
        formData.membershipSelection.level,
        formData.membershipSelection.billingFrequency,
        priceId,
        formData.personalInfo.email,
      );

      console.log("[DEBUG] Checkout session created successfully, redirect should occur");
      // Redirect should happen automatically via window.location.href in useStripe hook
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start checkout process";

      console.error("[DEBUG] Error creating checkout session after verification", {
        error: errorMessage,
        errorType: err instanceof Error ? err.constructor.name : typeof err,
        membershipLevel: formData.membershipSelection?.level,
      });

      setPaymentError(errorMessage);
      // Don't close modal on error - allow retry
    } finally {
      setIsProcessingPayment(false);
    }
  };

  /**
   * Handle successful email verification for email/password registration.
   * Automatically signs the user in if password is available in memory.
   * If on step 7 (membership selection), shows payment modal instead of redirecting to dashboard.
   *
   * SECURITY: Password is stored only in memory (useRef) and cleared immediately after use.
   * Never persisted to localStorage/sessionStorage.
   */
  const handleRegistrationEmailVerificationSuccess = async () => {
    setShowVerificationModal(false);

    // Get email and password from form data and memory
    const email = formData.personalInfo.email?.trim().toLowerCase();
    const password = passwordRef.current;

    // Check if we have both email and password for auto-login
    if (email && password && typeof password === "string" && signUpMethod === "email") {
      try {
        // SECURITY: Validate email format before attempting sign-in
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("Invalid email format");
        }

        // Attempt automatic sign-in using NextAuth credentials provider
        const result = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false, // Handle redirect manually
        });

        // SECURITY: Clear password from memory immediately after use
        passwordRef.current = null;

        // Check if sign-in was successful
        if (result?.ok) {
          // Check if we're on step 7 (membership selection) and have membership selection
          // All registrations require membership, so proceed to payment
          if (step === 7 && formData.membershipSelection) {
            // Show payment completion modal (non-dismissible)
            setShowPaymentModal(true);
            return;
          }

          // Not on step 7 or no membership selection - redirect to dashboard
          handleShowValidationModal(
            "Email verified successfully. You will now be redirected to your dashboard.",
            { kind: "redirect_dashboard" },
          );
          setStep(1);
          return;
        } else {
          // Sign-in failed - fall back to manual sign-in flow
          const errorMessage = result?.error || "Sign-in failed. Please sign in manually.";
          handleShowValidationModal(
            `Email verified successfully, but automatic sign-in failed. ${errorMessage} Please sign in manually.`,
          );
          setStep(1);
          return;
        }
      } catch (error: unknown) {
        // SECURITY: Clear password from memory even on error
        passwordRef.current = null;

        // Type-safe error handling
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : "An unexpected error occurred during sign-in.";

        // Fall back to manual sign-in flow
        handleShowValidationModal(
          `Email verified successfully, but automatic sign-in failed. ${errorMessage} Please sign in manually.`,
        );
        setStep(1);
        return;
      }
    }

    // Fallback: No password available or not email/password registration
    // If on step 7 with membership selection, show payment modal
    if (step === 7 && formData.membershipSelection) {
      setShowPaymentModal(true);
      return;
    }

    // Otherwise, show manual sign-in message
    handleShowValidationModal("Email verified successfully! You may now sign in.");
    setStep(1);
  };

  const extractDuplicateEmailFromMessage = (message: string): string | null => {
    // Accept both old and new shapes, with or without quotes.
    const match = message.match(
      /The e-mail address\s+"?([^"\s]+@[^"\s]+\.[^"\s]+)"?\s+is associated with an existing account\./i,
    );
    return match?.[1]?.toLowerCase() || null;
  };

  const isDuplicateEmailMessage = (message: string): boolean =>
    extractDuplicateEmailFromMessage(message) !== null;

  const getSocialProviderLabel = (): "Google" | "Facebook" | "LinkedIn" => {
    const urlParams = new URLSearchParams(window.location.search);
    const providerFromUrl = urlParams.get("provider");
    const providerFromStorage =
      sessionStorage.getItem("socialProvider") || sessionStorage.getItem("signInMethod");

    const raw = (providerFromUrl || providerFromStorage || "google").toString().toLowerCase();
    if (raw === "facebook") return "Facebook";
    if (raw === "linkedin") return "LinkedIn";
    return "Google";
  };

  /**
   * Get the appropriate registration completion message based on user's sign-in method.
   *
   * Messages:
   * - Email/password: "Thanks for creating an account. You will now be redirected to your dashboard."
   * - Social (Google/Facebook/LinkedIn): "Thanks for authenticating with your {Provider} account. You will now be redirected to your dashboard."
   *
   * @param userId - Optional user ID to fetch sign-in method from Firebase if not in sessionStorage
   * @returns Promise resolving to the appropriate message string
   */
  const getRegistrationCompletionMessage = async (userId?: string): Promise<string> => {
    // First, check sessionStorage for signInMethod
    const signInMethodFromStorage = sessionStorage.getItem("signInMethod");

    if (signInMethodFromStorage) {
      const normalizedMethod = signInMethodFromStorage.toLowerCase().trim();

      // Check if it's email/password
      if (normalizedMethod === "email") {
        return "Thanks for creating an account. You will now be redirected to your dashboard.";
      }

      // Check if it's a social provider
      if (["google", "facebook", "linkedin"].includes(normalizedMethod)) {
        const providerLabel =
          normalizedMethod === "google"
            ? "Google"
            : normalizedMethod === "facebook"
              ? "Facebook"
              : "LinkedIn";
        return `Thanks for authenticating with your ${providerLabel} account. You will now be redirected to your dashboard.`;
      }
    }

    // If not in sessionStorage and userId is provided, fetch from Firebase
    if (userId) {
      try {
        const response = await fetch("/api/rbca/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const userData = await response.json();
          const signInMethod = userData.signInMethod;

          if (signInMethod) {
            const normalizedMethod = signInMethod.toLowerCase().trim();

            // Check if it's email/password
            if (normalizedMethod === "email") {
              return "Thanks for creating an account. You will now be redirected to your dashboard.";
            }

            // Check if it's a social provider
            if (["google", "facebook", "linkedin"].includes(normalizedMethod)) {
              const providerLabel =
                normalizedMethod === "google"
                  ? "Google"
                  : normalizedMethod === "facebook"
                    ? "Facebook"
                    : "LinkedIn";
              return `Thanks for authenticating with your ${providerLabel} account. You will now be redirected to your dashboard.`;
            }
          }
        }
      } catch (error) {
        // If Firebase fetch fails, fall back to social provider label
        // This is a graceful degradation - better to show social message than error
      }
    }

    // Fallback: Use social provider label (for OAuth users who don't have signInMethod stored)
    // This handles edge cases where sessionStorage was cleared but user is OAuth
    const providerLabel = socialProvider || getSocialProviderLabel();
    return `Thanks for authenticating with your ${providerLabel} account. You will now be redirected to your dashboard.`;
  };

  /**
   * Show validation modal with optional explicit action.
   *
   * @param message - The message to display in the modal
   * @param action - Optional explicit action to take when modal is closed.
   *                 If not provided, action will be inferred from message content.
   *                 This parameter makes the intent explicit and type-safe.
   */
  const handleShowValidationModal = (
    message: string,
    action?:
      | { kind: "none" }
      | { kind: "redirect_signin"; signOutOnOk: boolean }
      | { kind: "redirect_dashboard" },
  ) => {
    setValidationModalMessage(message);
    setShowValidationModal(true);

    // Use explicit action if provided (preferred approach - explicit and type-safe)
    if (action) {
      setValidationModalAction(action);
      return;
    }

    // Fallback: Infer action from message content (for backward compatibility)
    if (isDuplicateEmailMessage(message)) {
      setValidationModalAction({
        kind: "redirect_signin",
        signOutOnOk: signUpMethod === "social",
      });
      return;
    }

    if (message.startsWith("You have already completed registration.")) {
      setValidationModalAction({ kind: "redirect_dashboard" });
      return;
    }

    setValidationModalAction({ kind: "none" });
  };

  const handleCloseValidationModal = async () => {
    if (validationModalAction.kind === "redirect_dashboard") {
      // Refresh session to get updated onboardingComplete from Firebase
      setIsRefreshingSession(true);
      try {
        // Trigger session refresh - JWT callback will read onboardingComplete from Firebase
        await updateSession();

        // Small delay to ensure session state propagates
        await new Promise((resolve) => setTimeout(resolve, 150));

        setShowValidationModal(false);
        router.push("/dashboard");
        setValidationModalAction({ kind: "none" });
      } catch (error) {
        console.error("[ERROR] Failed to refresh session:", error);
        // Still redirect even if refresh fails - dashboard will handle it
        setShowValidationModal(false);
        router.push("/dashboard");
        setValidationModalAction({ kind: "none" });
      } finally {
        setIsRefreshingSession(false);
      }
      return;
    }

    setShowValidationModal(false);

    if (validationModalAction.kind === "redirect_signin") {
      if (validationModalAction.signOutOnOk) {
        await signOut({ redirect: false });
      }
      router.push("/sign-in");
      setValidationModalAction({ kind: "none" });
      return;
    }
  };

  // Social signup: after Personal Information step renders, validate email belongs to an active RBCA account
  useEffect(() => {
    const run = async () => {
      if (step !== 2) return;
      if (signUpMethod !== "social") return;
      const email = formData.personalInfo.email?.trim().toLowerCase();
      const excludeUserId = session?.user?.id;
      if (!email || !excludeUserId) return;

      // Only run once per email value to avoid duplicate requests on re-renders
      if (socialEmailValidationRef.current === email) return;
      socialEmailValidationRef.current = email;

      try {
        const res = await fetch(
          `/api/rbca/users/check-email?email=${encodeURIComponent(email)}&excludeUserId=${encodeURIComponent(excludeUserId)}`,
        );
        const data = await res.json();
        if (res.ok && data?.exists) {
          const duplicateEmail = (data.existingEmail || email).toString().toLowerCase();
          handleShowValidationModal(
            `The e-mail address "${duplicateEmail}" is associated with an existing account. You will now be redirected to the Sign-In page.`,
          );
        }
      } catch (err) {
        // Fail open on network errors (server-side enforcement still applies)
        console.warn("RBCA email validation failed (social):", err);
      }
    };

    void run();
  }, [step, signUpMethod, formData.personalInfo.email, session?.user?.id]);

  // Email collection flow handlers
  const handleEmailSubmitted = (email: string) => {
    setCollectedEmail(email);
    setShowEmailCollectionModal(false);
    setShowEmailVerificationModal(true);
  };

  const handleEmailVerificationSuccess = () => {
    setShowEmailVerificationModal(false);
    setEmailCollectionShown(false); // Reset the flag after successful email verification
    sessionStorage.removeItem("emailCollectionShown");

    // Extract names from social login data
    const { firstName, lastName } = extractNamesFromSocialLogin(session?.user?.name);

    // Update form data with the verified email
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        email: collectedEmail,
        firstName: firstName,
        lastName: lastName,
      },
    }));

    // Clean up social login state
    cleanupSocialLoginState();

    // Proceed to Personal Information step
    setStep(2);
  };

  const handleBackToEmailCollection = () => {
    setShowEmailVerificationModal(false);
    setShowEmailCollectionModal(true);
    setEmailCollectionShown(true); // Keep the flag true since we're showing the modal again
    sessionStorage.setItem("emailCollectionShown", "true");
  };

  const handleCloseEmailCollection = () => {
    setShowEmailCollectionModal(false);
    setShowEmailVerificationModal(false);
    setCollectedEmail("");
    setEmailCollectionShown(false); // Reset the flag when user closes the modal
    sessionStorage.removeItem("emailCollectionShown");

    // Clean up social login state
    cleanupSocialLoginState();

    // Sign out the user
    signOut({ redirect: false });
    setStep(1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <SignInComponent
            onEmailSignUp={handleEmailSignUp}
            onGoogleSignUp={(e) => handleSocialSignUp("google", e)}
            onFacebookSignUp={(e) => handleSocialSignUp("facebook", e)}
            onLinkedInSignUp={(e) => handleSocialSignUp("linkedin", e)}
            showCustomModal={handleShowValidationModal}
            isLoadingSocial={isLoadingSocial}
          />
        );
      case 2:
        return (
          <PersonalInformation
            formData={formData.personalInfo}
            handleChange={handlePersonalInfoChange}
            nextStep={nextStep}
            prevStep={prevStep}
            signUpMethod={signUpMethod}
            showCustomModal={handleShowValidationModal}
            userId={session?.user?.id}
          />
        );
      case 3:
        return (
          <DataInterests
            selectedInterests={formData.dataInterests}
            otherInterestText={formData.otherInterestText}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            errors={dataInterestsErrors}
            setErrors={setDataInterestsErrors}
          />
        );
      case 4:
        return (
          <RankMotivations
            selectedInterests={formData.dataInterests}
            otherInterestText={formData.otherInterestText}
            rankedMotivations={formData.rankedMotivations}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            showCustomModal={handleShowValidationModal}
          />
        );
      case 5:
        return (
          <GovernmentInterests
            rankedGovernments={formData.rankedGovernments}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            showCustomModal={handleShowValidationModal}
          />
        );
      case 6:
        return (
          <InformationSources
            rankedInformationSources={formData.rankedInformationSources}
            otherInformationSourceText={formData.otherInformationSourceText}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            showCustomModal={handleShowValidationModal}
          />
        );
      case 7:
        return (
          <ChooseMembership
            selectedMembership={formData.membershipSelection ?? null}
            agreements={
              formData.agreements ?? {
                betaClient: false,
                termsOfUse: false,
                privacyPolicy: false,
              }
            }
            onMembershipChange={handleMembershipChange}
            onAgreementChange={handleAgreementCheckboxChange}
            prevStep={prevStep}
            handleSubmit={handleFinalSubmit}
            showCustomModal={handleShowValidationModal}
            isLoading={isLoading || isRegistrationSubmitted}
            isRegistrationSubmitted={isRegistrationSubmitted}
            userEmail={formData.personalInfo.email}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <nav className=" px-4 lg:px-6 min-h-[10vh] mx-auto py-5 flex flex-row mt-2 bg-white">
        <ProgressBar step={step} totalSteps={totalSteps} stepNames={STEP_NAMES} />
      </nav>
      <div className="min-h-[75vh] md:min-h-[85vh] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-4xl">
          {renderStepContent()}

          <Dialog
            open={showValidationModal}
            onOpenChange={(open) => {
              const isBlocking = validationModalAction.kind !== "none";

              // Force user to acknowledge blocking notifications via OK button
              if (!open && isBlocking) {
                return; // Prevent closing
              }
              setShowValidationModal(open);
            }}
          >
            <DialogContent
              className="sm:max-w-[425px] rounded-lg p-6"
              hideCloseButton={validationModalAction.kind !== "none"}
            >
              <DialogHeader>
                <DialogTitle>Notification</DialogTitle>
                <DialogDescription className="whitespace-pre-line">
                  {(() => {
                    const duplicateEmail = extractDuplicateEmailFromMessage(validationModalMessage);
                    if (duplicateEmail) {
                      return (
                        <>
                          The e-mail address{" "}
                          <span className="font-bold italic">"{duplicateEmail}"</span> is associated
                          with an existing account. You will now be redirected to the Sign-In page.
                        </>
                      );
                    }
                    return validationModalMessage;
                  })()}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button
                  onClick={handleCloseValidationModal}
                  disabled={isRefreshingSession}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRefreshingSession ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "OK"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <EmailVerificationModal
            isOpen={showVerificationModal}
            onClose={(codeExpired?: boolean) => {
              // If code expired and registration was submitted, show expired code modal
              if (codeExpired && isRegistrationSubmitted && signUpMethod === "email") {
                setShowExpiredCodeModal(true);
              } else {
                setShowVerificationModal(false);
              }
            }}
            onVerificationSuccess={handleRegistrationEmailVerificationSuccess}
            email={formData.personalInfo.email}
          />

          {/* Email Collection Modal */}
          <EmailCollectionModal
            isOpen={showEmailCollectionModal}
            onClose={handleCloseEmailCollection}
            onEmailSubmitted={handleEmailSubmitted}
            provider={socialProvider}
          />

          {/* Email Verification Modal */}
          <EmailVerificationModal
            isOpen={showEmailVerificationModal}
            onClose={(codeExpired) => {
              // For social login, ignore expired code - just go back to email collection
              handleBackToEmailCollection();
            }}
            onVerificationSuccess={handleEmailVerificationSuccess}
            email={collectedEmail}
          />

          {/* Social Authentication Loading Overlay */}
          {isLoadingSocial && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-in fade-in duration-75">
              <div className="text-center flex items-center justify-center w-full h-full p-4">
                <div className="animate-spin rounded-full h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 border-6 sm:border-8 md:border-10 lg:border-12 border-white border-t-transparent mx-auto"></div>
              </div>
            </div>
          )}

          {/* OAuth Processing Loading Overlay */}
          {isProcessingOAuthReturn && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-in fade-in duration-75">
              <div className="text-center flex items-center justify-center w-full h-full p-4">
                <div className="animate-spin rounded-full h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 border-6 sm:border-8 md:border-10 lg:border-12 border-white border-t-transparent mx-auto"></div>
              </div>
            </div>
          )}

          {/* Expired Code Modal - Non-dismissible, requires sign-in */}
          <Dialog
            open={showExpiredCodeModal}
            onOpenChange={() => {}} // Non-dismissible - user must go to sign-in
          >
            <DialogContent className="sm:max-w-[425px] rounded-lg p-6" hideCloseButton={true}>
              <DialogHeader>
                <DialogTitle>Verification Code Expired</DialogTitle>
                <DialogDescription className="whitespace-pre-line">
                  Your verification code has expired. Please sign in using your email and password
                  to receive a new verification code and complete your registration.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button
                  onClick={() => {
                    setShowExpiredCodeModal(false);
                    router.push("/sign-in");
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
                >
                  Go to Sign In
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Incomplete Registration Modal */}
          <Dialog
            open={showIncompleteRegistrationModal}
            onOpenChange={(open) => {
              // Allow closing the modal
              setShowIncompleteRegistrationModal(open);
            }}
          >
            <DialogContent className="sm:max-w-[425px] rounded-lg p-6">
              <DialogHeader>
                <DialogTitle>Complete Registration Required</DialogTitle>
                <DialogDescription className="whitespace-pre-line">
                  Almost there! Please finish setting up your account to receive guest access to the
                  site.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button
                  onClick={() => setShowIncompleteRegistrationModal(false)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
                >
                  Continue Registration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Payment Completion Modal - Non-dismissible, shown after email verification (email users) or account creation (social users) on step 7 */}
          <Dialog
            open={showPaymentModal}
            onOpenChange={() => {}} // Non-dismissible - user must proceed to payment
          >
            <DialogContent className="sm:max-w-[425px] rounded-lg p-6" hideCloseButton={true}>
              <DialogHeader>
                <DialogTitle>
                  {signUpMethod === "email"
                    ? "Email Verified Successfully!"
                    : "Complete Your Registration"}
                </DialogTitle>
                <DialogDescription className="whitespace-pre-line">
                  {paymentError ? (
                    <>
                      {paymentError}
                      {formData.membershipSelection && (
                        <span className="block mt-2 text-sm">
                          Please try again or contact support if the problem persists.
                        </span>
                      )}
                    </>
                  ) : (
                    "The final step is to complete your payment. Click 'Proceed to Payment' to continue."
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button
                  onClick={initiateStripeCheckoutAfterVerification}
                  disabled={isProcessingPayment || stripeLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment || stripeLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Checkout...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
