// components/betaclient/VerificationModal.tsx

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VerificationModalProps {
  open: boolean;
  email: string;
  onVerify: (code: string) => Promise<void>;
  onClose: () => void;
}

const VerificationModal = ({
  open,
  email,
  onVerify,
  onClose,
}: VerificationModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await onVerify(code);
      // On successful verification, the parent component will handle login and redirection.
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Verify Your Email
            </DialogTitle>
            <DialogDescription>
              We&apos;ve sent a 6-digit verification code to{" "}
              <span className="font-semibold">{email}</span>. Please enter it
              below to complete your registration.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6">
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700 sr-only"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-2 text-center text-2xl tracking-[0.5em] font-mono border-gray-300 border rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
              placeholder="______"
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue hover:bg-brand-darkblue text-white font-bold py-2 px-4 rounded-sm"
            >
              {isLoading ? "Verifying..." : "Verify and Sign In"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
