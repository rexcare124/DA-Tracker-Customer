"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaTimes, FaEnvelope, FaCheck } from "react-icons/fa";
import { VERIFICATION_CODE_CONFIG } from "@/lib/emailVerificationConfig";
import { validatedFetch, ApiError, ValidationError } from "@/lib/validatedFetch";
import {
  getVerificationSessionResponseSchema,
  sendEmailVerificationSuccessSchema,
  sendEmailVerificationActiveSessionErrorSchema,
  genericErrorResponseSchema,
  type GetVerificationSessionResponse,
  type SendEmailVerificationSuccessResponse,
  type SendEmailVerificationActiveSessionErrorResponse,
  type GenericErrorResponse,
} from "@/lib/api-response-schemas";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: (codeExpired?: boolean) => void;
  onVerificationSuccess: () => void;
  email: string;
  initialExpiresAt?: string; // ISO timestamp
  initialTimeRemaining?: number; // seconds
  initialAttempts?: number; // number of failed verification attempts
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationSuccess,
  email,
  initialExpiresAt,
  initialTimeRemaining,
  initialAttempts = 0,
}) => {
  // SECURITY: Validate and normalize email input
  // Only validate when modal is open to avoid build-time warnings
  const normalizedEmail = React.useMemo(() => {
    // During SSR/build time, email may be empty - this is expected for client-only components
    // Only validate when modal is actually being used (isOpen === true)
    if (!isOpen) {
      return email || '';
    }
    
    if (!email || typeof email !== 'string') {
      // Only log in development to avoid build-time noise
      if (process.env.NODE_ENV === 'development') {
        console.error('[SECURITY] Invalid email provided to EmailVerificationModal');
      }
      return '';
    }
    // Normalize email: trim whitespace and convert to lowercase
    const trimmed = email.trim();
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      // Only log in development to avoid build-time noise
      if (process.env.NODE_ENV === 'development') {
        console.error('[SECURITY] Invalid email format provided to EmailVerificationModal');
      }
      return '';
    }
    return trimmed.toLowerCase();
  }, [email, isOpen]);

  const [verificationCode, setVerificationCode] = useState(Array(VERIFICATION_CODE_CONFIG.CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState<number>(initialAttempts);
  
  // OPTIMAL: Calculate initial expiration time from expiresAt timestamp if provided
  // This ensures consistency - always use expiresAt as single source of truth
  const getInitialExpirationTime = (): number | null => {
    if (initialExpiresAt) {
      const expiresAt = new Date(initialExpiresAt).getTime();
      return isNaN(expiresAt) ? null : expiresAt;
    }
    return null;
  };
  
  const getInitialTimeRemaining = (): number => {
    const expiresAt = getInitialExpirationTime();
    if (expiresAt !== null) {
      // Always recalculate from expiresAt timestamp
      return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    }
    // Fallback: use provided initialTimeRemaining or default
    return initialTimeRemaining ?? Math.ceil(VERIFICATION_CODE_CONFIG.EXPIRATION_MS / 1000);
  };
  
  const [codeExpirationTime, setCodeExpirationTime] = useState<number | null>(getInitialExpirationTime());
  const [timeRemaining, setTimeRemaining] = useState<number>(getInitialTimeRemaining());
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, VERIFICATION_CODE_CONFIG.CODE_LENGTH);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Helper function to set expiration time and calculate remaining time
   * OPTIMAL SOLUTION: Always recalculate from expiresAt timestamp to account for network delay
   * This ensures the timer reflects the actual expiration time from when the code was emailed
   */
  const setExpirationFromTimestamp = useCallback((expiresAtTimestamp: number) => {
    // Validate timestamp is valid
    if (isNaN(expiresAtTimestamp) || expiresAtTimestamp <= 0) {
      // Only log in development to avoid production noise
      if (process.env.NODE_ENV === 'development') {
        console.error("Invalid expiration timestamp:", expiresAtTimestamp);
      }
      // Fallback to default expiration
      const defaultExpiresAt = Date.now() + VERIFICATION_CODE_CONFIG.EXPIRATION_MS;
      setCodeExpirationTime(defaultExpiresAt);
      setTimeRemaining(Math.ceil(VERIFICATION_CODE_CONFIG.EXPIRATION_MS / 1000));
      return;
    }

    setCodeExpirationTime(expiresAtTimestamp);
    // Always recalculate from timestamp to account for network delay and ensure accuracy
    // This is the single source of truth - expiresAt timestamp from server
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((expiresAtTimestamp - now) / 1000));
    setTimeRemaining(remaining);
  }, []);

  // Initialize expiration time when modal opens or props change
  useEffect(() => {
    if (isOpen && normalizedEmail) {
      if (initialExpiresAt) {
        // OPTIMAL: Use expiresAt timestamp as single source of truth
        // Always recalculate timeRemaining from expiresAt - Date.now()
        // This accounts for network delay and ensures accuracy
        const expiresAt = new Date(initialExpiresAt).getTime();
        
        // Validate the date is valid
        if (isNaN(expiresAt)) {
          // Only log in development to avoid production noise
          if (process.env.NODE_ENV === 'development') {
            console.error("Invalid initialExpiresAt date:", initialExpiresAt);
          }
          // Fallback to checking session
        } else {
          setExpirationFromTimestamp(expiresAt);
          return; // Early return to avoid checking session
        }
      }
      
      // If no initial expiration provided or invalid, check for active session
      const checkSession = async () => {
        try {
          const sessionResult = await validatedFetch<GetVerificationSessionResponse, unknown>(
            "/api/auth/get-verification-session",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: normalizedEmail }),
              schema: getVerificationSessionResponseSchema,
              throwOnError: false,
            }
          );

          if (sessionResult.success) {
            const sessionData = sessionResult.data;

            if (sessionData.hasActiveSession && sessionData.expiresAt) {
              // OPTIMAL: Use expiresAt timestamp as single source of truth
              // Always recalculate timeRemaining from expiresAt - Date.now()
              // Ignore sessionData.timeRemaining (may be stale due to network delay)
              const expiresAt = new Date(sessionData.expiresAt).getTime();
              
              // Validate the date is valid
              if (isNaN(expiresAt)) {
                // Only log in development to avoid production noise
                if (process.env.NODE_ENV === 'development') {
                  console.error("Invalid expiresAt from session:", sessionData.expiresAt);
                }
                // Fallback to default expiration
                setExpirationFromTimestamp(Date.now() + VERIFICATION_CODE_CONFIG.EXPIRATION_MS);
              } else {
                setExpirationFromTimestamp(expiresAt);
              }
              
              // Update attempts count from session data
              if (sessionData.hasActiveSession && 'attempts' in sessionData) {
                setAttempts(sessionData.attempts || 0);
              }
            } else {
              // No active session - set default 5 minutes from now
              setExpirationFromTimestamp(Date.now() + VERIFICATION_CODE_CONFIG.EXPIRATION_MS);
              setAttempts(0);
            }
          } else {
            // Session fetch failed - set default expiration
            setExpirationFromTimestamp(Date.now() + VERIFICATION_CODE_CONFIG.EXPIRATION_MS);
            setAttempts(0);
          }
        } catch (error) {
          // Only log in development to avoid production noise
          if (process.env.NODE_ENV === 'development') {
            console.error("Error checking session:", error);
          }
          // On error, set default expiration
          setExpirationFromTimestamp(Date.now() + VERIFICATION_CODE_CONFIG.EXPIRATION_MS);
        }
      };

      checkSession();
    }
  }, [isOpen, initialExpiresAt, normalizedEmail, setExpirationFromTimestamp]);

  // Countdown timer for code expiration with automatic invalidation
  useEffect(() => {
    if (!isOpen || !codeExpirationTime) return;

    let hasExpired = false;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((codeExpirationTime - now) / 1000));
      setTimeRemaining(remaining);
      setIsExpiringSoon(remaining <= 60 && remaining > 0); // Less than 1 minute

      // SECURITY: Invalidate code when timer expires
      // Clear the code input and show error message to prevent use of expired codes
      if (remaining === 0 && !hasExpired) {
        hasExpired = true;
        setVerificationCode(Array(VERIFICATION_CODE_CONFIG.CODE_LENGTH).fill(""));
        setError("Verification code has expired.");
        setIsLoading(false); // Ensure loading state is cleared
    }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(interval);
      hasExpired = false;
    };
  }, [isOpen, codeExpirationTime]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow alphanumeric characters, excluding "0", "O", "1", and "I" to prevent confusion
    // Remove confusing characters first, then filter other non-alphanumeric characters
    const sanitizedValue = value.replace(/[0O1I]/gi, "").replace(/[^a-zA-Z2-9]/g, "").toUpperCase();
    
    if (sanitizedValue.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = sanitizedValue;
      setVerificationCode(newCode);

      // Move to next input if value was entered
      if (sanitizedValue && index < VERIFICATION_CODE_CONFIG.CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Only allow alphanumeric characters, excluding "0", "O", "1", and "I" to prevent confusion
    // Remove confusing characters first, then filter other non-alphanumeric characters
    const pastedData = e.clipboardData.getData("text").replace(/[0O1I]/gi, "").replace(/[^a-zA-Z2-9]/g, "").toUpperCase();
    
    if (pastedData.length <= VERIFICATION_CODE_CONFIG.CODE_LENGTH) {
      const newCode = [...verificationCode];
      for (let i = 0; i < VERIFICATION_CODE_CONFIG.CODE_LENGTH; i++) {
        newCode[i] = pastedData[i] || "";
      }
      setVerificationCode(newCode);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex(code => !code);
      const focusIndex = nextEmptyIndex === -1 ? VERIFICATION_CODE_CONFIG.CODE_LENGTH - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join("");
    
    if (code.length !== VERIFICATION_CODE_CONFIG.CODE_LENGTH) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    // SECURITY: Validate email before making API call
    if (!normalizedEmail) {
      setError("Invalid email address. Please close this modal and try again.");
      return;
    }

    // SECURITY: Prevent submission if code has expired
    if (timeRemaining === 0) {
      setError("Verification code has expired.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/rbca-verify-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: normalizedEmail,
          code: code.trim().toUpperCase() // SECURITY: Normalize code input
        }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid verification code.";
        try {
        const errorData = await response.json();
          // SECURITY: Type-safe error message extraction with validation
          if (
            typeof errorData === 'object' && 
            errorData !== null && 
            'message' in errorData &&
            typeof errorData.message === 'string'
          ) {
            errorMessage = errorData.message;
          }
        } catch {
          // If JSON parsing fails, use default message
        }
        
        // Increment attempts on failed verification
        setAttempts((prev) => prev + 1);
        
        throw new Error(errorMessage);
      }

      // Verification successful
      onVerificationSuccess();
    } catch (error: unknown) {
      // Type-safe error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
        ? error 
        : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      const wasExpired = timeRemaining === 0;
      setVerificationCode(Array(VERIFICATION_CODE_CONFIG.CODE_LENGTH).fill(""));
      setError("");
      setTimeRemaining(Math.ceil(VERIFICATION_CODE_CONFIG.EXPIRATION_MS / 1000));
      setCodeExpirationTime(null);
      setIsExpiringSoon(false);
      setAttempts(initialAttempts);
      onClose(wasExpired);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaEnvelope className="text-blue-600 mr-3" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">
              Verify Your Email
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            We&apos;ve sent a 6-digit verification code to <strong>{normalizedEmail || email}</strong>. 
            Please enter the code below to continue.
          </p>

          {/* Countdown Timer - Always show when codeExpirationTime is set */}
          {codeExpirationTime && (
            <div className={`mb-4 p-3 rounded-md border ${
              timeRemaining === 0
                ? 'bg-red-50 border-red-200'
                : isExpiringSoon 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Code expires in:
                </span>
                <span className={`text-sm font-bold ${
                  timeRemaining === 0
                    ? 'text-red-700'
                    : isExpiringSoon 
                    ? 'text-yellow-700' 
                    : 'text-blue-700'
                }`}>
                  {timeRemaining > 0 ? formatTime(timeRemaining) : '00:00'}
                </span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Verification Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-digit alphanumeric code
              </p>
            </div>

            {/* Submit Button - Disabled when expired or invalid */}
            <button
              type="submit"
              disabled={
                isLoading || 
                verificationCode.join("").length !== VERIFICATION_CODE_CONFIG.CODE_LENGTH ||
                timeRemaining === 0
              }
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" size={14} />
                  Verify Code
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Check your spam folder if you don&apos;t see the email
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal; 