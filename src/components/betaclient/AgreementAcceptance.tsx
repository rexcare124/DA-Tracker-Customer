"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import BetaCleintAgreement from "@/components/BetaClientAgreement";
import PrivacyContent from "@/components/PrivacyContent";
import { AgreementAcceptanceProps } from "./types";

const AgreementAcceptance = ({
  agreementAccepted,
  handleChange,
  prevStep,
  handleSubmit,
  showCustomModal,
  isLoading, // --- ADDED: isLoading prop ---
  isRegistrationSubmitted = false, // --- ADDED: isRegistrationSubmitted prop ---
}: Omit<AgreementAcceptanceProps, "email"> & {
  showCustomModal: (message: string) => void;
  isLoading: boolean; // --- ADDED: isLoading type ---
}) => {
  const handleFinalSubmitClick = () => {
    if (!agreementAccepted) {
      showCustomModal(
        "You must agree to the Beta Client Agreement and Privacy Policy to proceed."
      );
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="">
      <div className="flex items-center space-x-3 sm:space-x-4 mb-8">
        <input
          id="agreementAccepted"
          name="agreementAccepted"
          type="checkbox"
          checked={agreementAccepted}
          onChange={(e) => {
            handleChange(e, "agreementAccepted");
          }}
          className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer mt-1 flex-shrink-0"
          disabled={isLoading || isRegistrationSubmitted} // --- ADDED: Disable checkbox while loading or after submission ---
        />
        <label
          htmlFor="agreementAccepted"
          className="text-lg sm:text-xl font-semibold text-gray-700"
        >
          Do you agree to the{" "}
          <Dialog>
            <DialogTrigger asChild>
              <span className="text-blue-600 hover:underline cursor-pointer">
                Beta Client Agreement
              </span>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold "></DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[70vh] rounded-md border p-4">
                <BetaCleintAgreement />
              </ScrollArea>
            </DialogContent>
          </Dialog>{" "}
          and{" "}
          <Dialog>
            <DialogTrigger asChild>
              <span className="text-blue-600 hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold "></DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[70vh] rounded-md border p-4">
                <PrivacyContent />
              </ScrollArea>
            </DialogContent>
          </Dialog>
          ?
        </label>
      </div>

      <div className="flex justify-center space-x-2.5 mt-6">
        <button
          type="button"
          onClick={() => prevStep && prevStep()}
          className="bg-gray-500 min-w-32 h-10 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          disabled={isLoading || isRegistrationSubmitted} // --- ADDED: Disable button while loading or after submission ---
        >
          Previous
        </button>

        <button
          type="button"
          onClick={handleFinalSubmitClick}
          className="bg-brand-blue min-w-32 h-10 hover:bg-brand-darkblue text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading || isRegistrationSubmitted} // --- ADDED: Disable button while loading or after submission ---
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AgreementAcceptance;
