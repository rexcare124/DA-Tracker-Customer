"use client";

import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaLinkedin, FaEnvelope } from "react-icons/fa";

interface SignInProps {
  onGoogleSignUp: (e: React.MouseEvent) => void;
  onFacebookSignUp: (e: React.MouseEvent) => void;
  onLinkedInSignUp: (e: React.MouseEvent) => void;
  onEmailSignUp: () => void;
  showCustomModal: (message: string) => void;
  isLoadingSocial?: "google" | "facebook" | "linkedin" | null;
}

const SignInComponent = ({
  onGoogleSignUp,
  onFacebookSignUp,
  onLinkedInSignUp,
  onEmailSignUp,
  showCustomModal,
  isLoadingSocial,
}: SignInProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Join Our Beta Program
      </h2>
      <p className="text-gray-600 mb-8">
        Choose your preferred method to get started.
      </p>

      <button
        type="button"
        onClick={onEmailSignUp}
        disabled={isLoadingSocial !== null}
        className="w-full max-w-sm mx-auto flex items-center justify-center bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaEnvelope className="mr-3" size={20} />
        Sign up with Email
      </button>
    </div>
  );
};

export default SignInComponent;
