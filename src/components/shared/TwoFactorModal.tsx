"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
  email: string;
}

const CODE_LENGTH = 6;
const CODE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  onClose,
  onVerificationSuccess,
  email,
}) => {
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(CODE_LENGTH).fill("")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeExpirationTime, setCodeExpirationTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { update: updateSession } = useSession();

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, CODE_LENGTH);
  }, []);

  // Auto-send code when modal opens
  useEffect(() => {
    if (isOpen && email) {
      handleSendCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, email]); // handleSendCode is stable, no need to include it

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
        setVerificationCode(Array(CODE_LENGTH).fill(""));
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
    const sanitizedValue = value.replace(/[0O1I]/gi, "").replace(/[^A-Za-z2-9]/g, "").toUpperCase();
    
    if (sanitizedValue.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = sanitizedValue;
      setVerificationCode(newCode);

      // Move to next input if value was entered
      if (sanitizedValue && index < CODE_LENGTH - 1) {
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
    const pastedData = e.clipboardData.getData("text").replace(/[0O1I]/gi, "").replace(/[^A-Za-z2-9]/g, "").toUpperCase();
    
    if (pastedData.length <= CODE_LENGTH) {
      const newCode = [...verificationCode];
      for (let i = 0; i < CODE_LENGTH; i++) {
        newCode[i] = pastedData[i] || "";
      }
      setVerificationCode(newCode);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex(code => !code);
      const focusIndex = nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-2fa-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to send verification code.";
        try {
          const errorData = await response.json() as { message?: string };
          if (errorData.message && typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          }
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      // Set expiration time (5 minutes from now)
      const expiresAt = Date.now() + CODE_EXPIRATION_MS;
      setCodeExpirationTime(expiresAt);
      setTimeRemaining(Math.ceil(CODE_EXPIRATION_MS / 1000));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join("");
    
    // SECURITY: Validate code length
    if (code.length !== CODE_LENGTH) {
      setError("Please enter the complete 6-character verification code.");
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
      const response = await fetch("/api/auth/verify-2fa-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          code 
        }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid verification code.";
        try {
          const errorData = await response.json() as { message?: string };
          if (errorData.message && typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          }
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      // Verification successful - refresh session to get updated twoFactorVerified status
      // The JWT callback will check Firebase and update twoFactorVerified
      await updateSession();
      
      // Wait a moment for session to update, then call success handler
      setTimeout(() => {
        onVerificationSuccess();
      }, 300);
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
      setVerificationCode(Array(CODE_LENGTH).fill(""));
      setError("");
      setCodeExpirationTime(null);
      setTimeRemaining(0);
      setIsExpiringSoon(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg">
        <DialogHeader className="p-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            We&apos;ve sent a 6-character verification code to <strong>{email}</strong>. Please enter the code below to complete sign-in.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="verification-code" className="text-gray-700">
                Verification Code
              </Label>
              <div className="flex gap-2 justify-center mt-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                    autoComplete="off"
                    id={index === 0 ? "verification-code" : undefined}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-character code.
              </p>
            </div>

            <Button
              type="submit"
              disabled={
                isLoading || 
                verificationCode.join("").length !== CODE_LENGTH ||
                timeRemaining === 0
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorModal;

