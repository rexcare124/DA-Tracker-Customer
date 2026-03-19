"use client";

import { Eye, EyeOff, Chrome, Facebook, Linkedin } from "lucide-react";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TwoFactorModal from "@/components/shared/TwoFactorModal";
import EmailVerificationModal from "@/components/betaclient/EmailVerificationModal";
import NavBar from "@/components/shared/NavBar";
import { validatedFetch, ApiError } from "@/lib/validatedFetch";
import {
  getVerificationSessionResponseSchema,
  sendEmailVerificationSuccessSchema,
  sendEmailVerificationActiveSessionErrorSchema,
  type GetVerificationSessionResponse,
  type SendEmailVerificationSuccessResponse,
  type SendEmailVerificationActiveSessionErrorResponse,
} from "@/lib/api-response-schemas";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<
    string | undefined
  >(undefined);
  const [verificationTimeRemaining, setVerificationTimeRemaining] = useState<
    number | undefined
  >(undefined);
  const [verificationAttempts, setVerificationAttempts] = useState<
    number | undefined
  >(undefined);
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  // Ref to track latest session for use in callbacks
  const sessionRef = useRef(session);

  // Keep sessionRef in sync with session
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Redirect to dashboard if already authenticated
  // IMPORTANT: Don't redirect if 2FA modal or email verification modal is open - user needs to complete verification first
  useEffect(() => {
    // Skip redirect check if modals are open
    if (showTwoFactorModal || showEmailVerificationModal) {
      return;
    }

    if (status === "authenticated" && session?.user) {
      const user = session.user as
        | {
            twoFactorRequired?: boolean;
            twoFactorVerified?: boolean;
            onboardingComplete?: boolean;
          }
        | undefined;
      // Only redirect if 2FA is not required or if it's already verified
      if (!user?.twoFactorRequired || user?.twoFactorVerified) {
        // Check if user has completed onboarding
        // If not, redirect to registration page instead of dashboard
        if (user?.onboardingComplete === false) {
          router.push("/beta-client/registration");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [status, session, router, showTwoFactorModal, showEmailVerificationModal]);

  const handleEmailLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsSubmitting(true);

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          // Check if the error is EMAIL_NOT_VERIFIED
          const errorMessage =
            typeof result.error === "string" ? result.error : "";
          if (
            errorMessage === "EMAIL_NOT_VERIFIED" ||
            errorMessage.includes("EMAIL_NOT_VERIFIED")
          ) {
            // Password is correct but email is not verified
            // First, check if there's an active verification session (with retry logic)
            let sessionData: GetVerificationSessionResponse | null = null;
            let sessionFetchSucceeded = false;

            // Retry logic: try to fetch session up to 2 times before falling back
            for (let attempt = 0; attempt < 2; attempt++) {
              try {
                const sessionResult = await validatedFetch<
                  GetVerificationSessionResponse,
                  unknown
                >("/api/auth/get-verification-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                  schema: getVerificationSessionResponseSchema,
                  throwOnError: false,
                });

                if (sessionResult.success) {
                  sessionData = sessionResult.data;
                  sessionFetchSucceeded = true;
                  break; // Success - exit retry loop
                }
              } catch (retryError) {
                console.error(
                  `Session fetch attempt ${attempt + 1} failed:`,
                  retryError,
                );
                if (attempt === 1) {
                  // Last attempt failed - will fall back to showing modal without session data
                  console.error("All session fetch attempts failed");
                }
              }
            }

            // Helper function to send verification code (only called when no valid session exists)
            const sendVerificationCode = async () => {
              // DEBUG: Log when sendVerificationCode is called
              console.log(`🔍 [DEBUG] SIGN_IN_SEND_VERIFICATION_CODE_CALLED`, {
                timestamp: new Date().toISOString(),
                email,
                location: "sign-in/page.tsx",
              });

              try {
                const sendCodeResult = await validatedFetch<
                  SendEmailVerificationSuccessResponse,
                  SendEmailVerificationActiveSessionErrorResponse
                >("/api/auth/send-email-verification", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                  schema: sendEmailVerificationSuccessSchema,
                  throwOnError: false,
                  errorSchema: sendEmailVerificationActiveSessionErrorSchema,
                });

                if (sendCodeResult.success) {
                  // Success - code sent successfully
                  const data = sendCodeResult.data;
                  setError(""); // Clear any previous errors
                  setUserEmail(email);
                  setVerificationExpiresAt(data.expiresAt);
                  setVerificationTimeRemaining(data.timeRemaining);
                  setShowEmailVerificationModal(true);
                } else {
                  // Error response - handle based on status and validation
                  setError(""); // Clear error on sign-in page - modal will handle errors
                  setUserEmail(email);

                  if (
                    sendCodeResult.status === 409 &&
                    sendCodeResult.isValidated
                  ) {
                    // Active session error - data is already validated
                    const errorData = sendCodeResult.data;
                    setVerificationExpiresAt(errorData.expiresAt);
                    setVerificationTimeRemaining(errorData.timeRemaining);
                  }
                  setShowEmailVerificationModal(true);
                }
              } catch (sendCodeError) {
                // Handle validation errors or network errors
                console.error(
                  "Error sending verification code:",
                  sendCodeError,
                );
                setError(""); // Clear error on sign-in page
                setUserEmail(email);
                setShowEmailVerificationModal(true);
              }
            };

            // Process session data
            if (sessionFetchSucceeded && sessionData) {
              if (
                sessionData.hasActiveSession &&
                sessionData.timeRemaining &&
                sessionData.timeRemaining > 0
              ) {
                // CRITICAL: Active session exists with valid time remaining
                // DO NOT send a new code - just show modal with existing session info
                // This preserves the original code that was sent
                setError(""); // Clear any previous errors
                setUserEmail(email);
                setVerificationExpiresAt(sessionData.expiresAt);
                setVerificationTimeRemaining(sessionData.timeRemaining);
                // Pass attempts count to modal
                if (sessionData.hasActiveSession && "attempts" in sessionData) {
                  setVerificationAttempts(sessionData.attempts || 0);
                } else {
                  setVerificationAttempts(0);
                }
                setShowEmailVerificationModal(true);
              } else {
                // No active session or session expired - send new code
                await sendVerificationCode();
              }
            } else {
              // Session fetch failed after retries - show modal without session data
              // User can still enter code if they have it, or request a new one from modal
              setError(""); // Clear error on sign-in page
              setUserEmail(email);
              setShowEmailVerificationModal(true);
            }
          } else {
            setError("Failed to sign in. Please check your credentials.");
          }
        } else if (result?.ok) {
          // For email/password sign-ins, 2FA is always required on every sign-in
          // User must enter a code that was emailed to them
          setUserEmail(email);
          setShowTwoFactorModal(true);
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password],
  );

  const handleSocialLogin = useCallback(
    async (provider: "google" | "facebook" | "linkedin") => {
      setIsSubmitting(true);
      try {
        const result = await signIn(provider, { redirect: false });
        if (result?.ok) {
          // Update session to get latest auth state
          await updateSession();
          // Small delay to ensure session is updated before checking onboarding status
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Use sessionRef to get the latest session value after update
          // This ensures we're reading the most current session state
          const currentSession = sessionRef.current;

          // Type-safe check for onboarding completion status
          const user = currentSession?.user as
            | {
                onboardingComplete?: boolean;
                twoFactorRequired?: boolean;
                twoFactorVerified?: boolean;
              }
            | undefined;

          // Check if user needs to complete registration
          // Redirect to registration if onboarding is explicitly false
          // Otherwise redirect to dashboard (onboardingComplete is true or undefined)
          if (user?.onboardingComplete === false) {
            router.push("/beta-client/registration");
          } else {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        // Error handling - redirect to dashboard as fallback
        // This ensures users aren't stuck if session check fails
        router.push("/dashboard");
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, updateSession],
  );

  const handleTwoFactorSuccess = useCallback(async () => {
    await updateSession();
    setTimeout(() => {
      setShowTwoFactorModal(false);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    }, 300);
  }, [updateSession, router]);

  const handleEmailVerificationSuccess = useCallback(async () => {
    // After email verification, try to sign in again
    setShowEmailVerificationModal(false);
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        // Email is now verified
        // Update session to get latest 2FA verification status
        // If email verification happened during sign-in, 2FA was also verified with the same code
        await updateSession();

        // Small delay to ensure session is updated with latest Firebase data
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Check if 2FA is already verified (from email verification step)
        // If verified, skip 2FA modal and go to dashboard
        // If not verified, show 2FA modal (shouldn't happen in this flow, but handle edge case)
        const currentUser = session?.user as
          | { twoFactorRequired?: boolean; twoFactorVerified?: boolean }
          | undefined;

        if (currentUser?.twoFactorRequired && !currentUser?.twoFactorVerified) {
          // 2FA is required but not verified - show 2FA modal
          setUserEmail(email);
          setShowTwoFactorModal(true);
        } else {
          // 2FA is already verified (from email verification) or not required - go to dashboard
          setEmail("");
          setPassword("");
          router.push("/dashboard");
        }
      } else {
        setError(
          "Failed to sign in after email verification. Please try again.",
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, updateSession, router]);

  const handleSignUpClick = useCallback(() => {
    router.push("/beta-client/registration-agreement");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] text-black">
      <NavBar hideSignInButton />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="mt-1 text-gray-600">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          <div className="px-6 pb-6 pt-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              >
                {isSubmitting ? "Signing in..." : "Sign in with Email"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don&apos;t have an account?{" "}
              <button
                onClick={handleSignUpClick}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => {
          setShowTwoFactorModal(false);
        }}
        onVerificationSuccess={handleTwoFactorSuccess}
        email={userEmail}
      />

      <EmailVerificationModal
        isOpen={showEmailVerificationModal}
        onClose={(codeExpired) => {
          // For sign-in page, expired code doesn't require special handling
          setShowEmailVerificationModal(false);
          setVerificationExpiresAt(undefined);
          setVerificationTimeRemaining(undefined);
          setVerificationAttempts(undefined);
        }}
        onVerificationSuccess={handleEmailVerificationSuccess}
        email={userEmail}
        initialExpiresAt={verificationExpiresAt}
        initialTimeRemaining={verificationTimeRemaining}
        initialAttempts={verificationAttempts}
      />
    </div>
  );
};

export default SignInPage;
