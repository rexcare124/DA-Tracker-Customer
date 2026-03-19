"use client";

import { Eye, EyeOff, Chrome, Facebook, Linkedin } from "lucide-react";
import React, { useState, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TwoFactorModal from "./TwoFactorModal";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  title = "Sign in",
  description = "Welcome back! Please sign in to continue.",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const handleEmailLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsSubmitting(true);

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });

        if (result?.error) {
          setError("Failed to sign in. Please check your credentials.");
        } else if (result?.ok) {
          // For email/password sign-ins, 2FA is always required
          // Show 2FA modal immediately
          setUserEmail(email);
          setShowTwoFactorModal(true);
          // Don't close the sign-in modal yet - wait for 2FA completion
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password]
  );

  const handleSocialLogin = useCallback(
    async (provider: "google" | "facebook" | "linkedin") => {
      setIsSubmitting(true);
      const result = await signIn(provider, { redirect: false });
      setIsSubmitting(false);
      if (result?.ok) {
        onClose();
      }
    },
    [onClose]
  );

  const handleModalOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
        setError("");
        setEmail("");
        setPassword("");
        setShowTwoFactorModal(false);
        setUserEmail("");
      }
    },
    [onClose]
  );

  const handleTwoFactorSuccess = useCallback(async () => {
    // Update session to get latest 2FA verification status
    await updateSession();
    // Wait a moment for session to update
    setTimeout(() => {
      setShowTwoFactorModal(false);
      onClose();
      setEmail("");
      setPassword("");
    }, 300);
  }, [updateSession, onClose]);

  const handleSignUpClick = useCallback(() => {
    onClose();
    router.push("/beta-client/registration");
  }, [onClose, router]);

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg">
        <DialogHeader className="p-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialLogin("google")}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              <Chrome className="mr-2 h-5 w-5" /> Sign in with Google
            </Button>
            <Button
              onClick={() => handleSocialLogin("facebook")}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              <Facebook className="mr-2 h-5 w-5" /> Sign in with Facebook
            </Button>
            <Button
              onClick={() => handleSocialLogin("linkedin")}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              <Linkedin className="mr-2 h-5 w-5" /> Sign in with LinkedIn
            </Button>
          </div>
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
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
      </DialogContent>
      
      {/* Two-Factor Authentication Modal */}
      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => {
          setShowTwoFactorModal(false);
          // Don't close the sign-in modal, let user try again
        }}
        onVerificationSuccess={handleTwoFactorSuccess}
        email={userEmail}
      />
    </Dialog>
  );
};

export default SignInModal;

