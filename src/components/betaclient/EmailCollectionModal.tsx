"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaEnvelope, FaCheck } from "react-icons/fa";
import { SESSION_CONFIG, ERROR_MESSAGES } from "@/lib/emailVerificationConfig";

interface EmailCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmitted: (email: string) => void;
  provider: "Google" | "Facebook" | "LinkedIn";
}

const EmailCollectionModal: React.FC<EmailCollectionModalProps> = ({
  isOpen,
  onClose,
  onEmailSubmitted,
  provider,
}) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    confirmEmail?: string;
    general?: string;
  }>({});
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle cooldown timer
  useEffect(() => {
    if (cooldownTimer > 0) {
      const timer = setTimeout(() => setCooldownTimer(cooldownTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (cooldownTimer === 0 && errors.general && (errors.general === "RATE_LIMIT_ERROR" || errors.general === "ACTIVE_SESSION_ERROR")) {
      // Clear the error when countdown reaches zero
      setErrors({});
    }
  }, [cooldownTimer, errors.general]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!email) {
      setErrors({ email: ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: ERROR_MESSAGES.VALIDATION.INVALID_EMAIL });
      return;
    }

    if (!confirmEmail) {
      setErrors({ confirmEmail: ERROR_MESSAGES.VALIDATION.CONFIRM_EMAIL_REQUIRED });
      return;
    }

    if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
      setErrors({ confirmEmail: ERROR_MESSAGES.VALIDATION.EMAIL_MISMATCH });
      return;
    }

    if (cooldownTimer > 0) {
      setErrors({ general: `Please wait ${cooldownTimer} seconds before requesting another code.` });
      return;
    }

    setIsLoading(true);

    try {
      // Send verification code to the email
      const response = await fetch("/api/auth/send-email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (response.status === 429) {
          // Rate limited - extract retry time from headers
          const retryAfter = response.headers.get('Retry-After');
          const retrySeconds = retryAfter ? parseInt(retryAfter) : SESSION_CONFIG.COOLDOWN_PERIODS.AFTER_RATE_LIMIT;
          setCooldownTimer(retrySeconds);
          throw new Error("RATE_LIMIT_ERROR"); // Use a special error code
        } else if (response.status === 409 && errorData.code === 'ACTIVE_SESSION_EXISTS') {
          // Active session exists - start cooldown
          setCooldownTimer(SESSION_CONFIG.COOLDOWN_PERIODS.AFTER_ACTIVE_SESSION);
          throw new Error("ACTIVE_SESSION_ERROR"); // Use a special error code
        }
        
        throw new Error(errorData.message || "Failed to send verification code.");
      }

      // Call the parent handler with the email
      onEmailSubmitted(email);
    } catch (error: any) {
      setErrors({ general: error.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail("");
      setConfirmEmail("");
      setErrors({});
      onClose();
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
              Email Verification Required
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
            You successfully authenticated with <strong>{provider}</strong>, but we didn&apos;t receive your email address. 
            Please provide the email address associated with your <strong>{provider}</strong> account to continue with the registration process.
          </p>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">
                {errors.general === "RATE_LIMIT_ERROR" && cooldownTimer > 0
                  ? `Too many requests. Please wait ${cooldownTimer} seconds before trying again.`
                  : errors.general === "ACTIVE_SESSION_ERROR" && cooldownTimer > 0
                  ? `A verification code has already been sent. Please check your inbox or wait ${cooldownTimer} seconds.`
                  : errors.general}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Confirm Email Field */}
            <div>
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm E-mail Address
              </label>
              <input
                type="email"
                id="confirmEmail"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmEmail ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Confirm your email address"
                disabled={isLoading}
              />
              {errors.confirmEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmEmail}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || cooldownTimer > 0}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Verification Code...
                </>
              ) : cooldownTimer > 0 ? (
                <>
                  <FaCheck className="mr-2" size={14} />
                  Wait {cooldownTimer}s
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" size={14} />
                  Send Verification Code
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            We&apos;ll send a 6-digit verification code to your email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailCollectionModal; 