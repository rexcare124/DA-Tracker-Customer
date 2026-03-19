// DataInterests.tsx

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { DataInterestsProps, OptimizedDataInterestsProps, MOTIVATIONS } from "./types";
import { MIGRATION_FLAGS } from "../../lib/migrationFlags";

// Validation Error Modal Component
interface ValidationErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  isOpen,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Selection Required
          </h3>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <button
            onClick={onClose}
            className="bg-brand-blue hover:bg-brand-darkblue text-white font-bold py-2 px-6 rounded-sm focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Static ID mappings for data interests (immutable for security)
const DATA_INTEREST_ID_MAP: { [key: string]: number } = {
  "Improve well-being": 1,
  "Find community to live": 2,
  "Manage personal risks": 3,
  "Career advancement": 4,
  "Elect government leaders": 5,
  "Protect friends/family": 6,
  "Enhance school experience": 7,
  "Grow my business": 8,
  "Plan for travel": 9,
  "Other": -1,
} as const;

// Reverse mapping for ID to string conversion
const DATA_INTEREST_STRING_MAP: { [key: number]: string } = {
  1: "Improve well-being",
  2: "Find community to live",
  3: "Manage personal risks",
  4: "Career advancement",
  5: "Elect government leaders",
  6: "Protect friends/family",
  7: "Enhance school experience",
  8: "Grow my business",
  9: "Plan for travel",
  [-1]: "Other",
} as const;

  // Legacy component using string arrays
const LegacyDataInterests = ({
  selectedInterests,
  otherInterestText,
  setFormData,
  prevStep,
  nextStep,
  errors,
  setErrors,
}: Omit<DataInterestsProps, "isStepValid" | "showCustomModal"> & {
  errors: { interests?: string; other?: string };
  setErrors: React.Dispatch<
    React.SetStateAction<{ interests?: string; other?: string }>
  >;
}) => {
  const MAX_CHAR_COUNT = 30;
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  const isOtherSelected = selectedInterests.includes("Other");

  const validate = useCallback(() => {
    const newErrors: { interests?: string; other?: string } = {};
    if (selectedInterests.length === 0) {
      newErrors.interests = "Please select at least one data interest.";
    }
    if (isOtherSelected && otherInterestText.trim() === "") {
      newErrors.other = "Enter your specific interest";
    }
    return newErrors;
  }, [selectedInterests, isOtherSelected, otherInterestText]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      setErrors(validate());
    }
  }, [
    selectedInterests,
    otherInterestText,
    hasAttemptedSubmit,
    setErrors,
    validate,
  ]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const currentInterests = prevData.dataInterests;
      let updatedInterests: string[];
      if (checked) {
        updatedInterests = [...currentInterests, value];
      } else {
        updatedInterests = currentInterests.filter((item) => item !== value);
        if (value === "Other") {
          return {
            ...prevData,
            dataInterests: updatedInterests,
            otherInterestText: "",
            rankedMotivations: [],
          };
        }
      }
      return {
        ...prevData,
        dataInterests: updatedInterests,
        rankedMotivations: [],
      };
    });
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHAR_COUNT) {
      setFormData((prevData) => ({
        ...prevData,
        otherInterestText: text,
      }));
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (nextStep) {
        nextStep();
      }
    } else if (validationErrors.interests) {
      // Show modal for interests validation error
      setShowValidationModal(true);
    }
  };

  const charCount = MAX_CHAR_COUNT - otherInterestText.length;

  return (
    <form onSubmit={onSubmit} noValidate>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        What decision(s) can our data help you make?
      </h3>
      <p className="text-gray-600 mb-6">
        Select as many motivations as you&apos;d like.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        {MOTIVATIONS.map((motivation) => {
          if (motivation === "Other") {
            return (
              <div key={motivation} className="col-span-1 md:col-span-2">
                <div className="flex items-start flex-col gap-4">
                  <div className="flex items-center flex-shrink-0">
                    <input
                      type="checkbox"
                      id={motivation.replace(/\s/g, "-")}
                      name="dataInterests"
                      value={motivation}
                      checked={selectedInterests.includes(motivation)}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-5 w-5 text-brand-blue rounded-md"
                    />
                    <label
                      htmlFor={motivation.replace(/\s/g, "-")}
                      className="ml-2 text-gray-700 cursor-pointer"
                    >
                      {motivation}
                    </label>
                  </div>
                  {isOtherSelected && (
                    <div className="flex-1 flex flex-col items-start min-w-0">
                      <input
                        type="text"
                        id="otherInterestText"
                        name="otherInterestText"
                        value={otherInterestText}
                        onChange={handleOtherTextChange}
                        placeholder="e.g., Personal growth"
                        maxLength={MAX_CHAR_COUNT}
                        className={`shadow appearance-none border w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md ${
                          errors.other
                            ? "border-red-500"
                            : "focus:border-brand-blue"
                        }`}
                        required={isOtherSelected}
                      />

                      <div className="w-full mt-1">
                        <p className="text-left pl-3 text-xs text-gray-500 mb-1">
                          {charCount} characters remaining
                        </p>
                        {errors.other && (
                          <p className="text-red-500 text-xs pl-3 italic text-left">
                            {errors.other}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={motivation} className="flex items-center">
              <input
                type="checkbox"
                id={motivation.replace(/\s/g, "-")}
                name="dataInterests"
                value={motivation}
                checked={selectedInterests.includes(motivation)}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-brand-blue rounded-md"
              />
              <label
                htmlFor={motivation.replace(/\s/g, "-")}
                className="ml-2 text-gray-700 cursor-pointer"
              >
                {motivation}
              </label>
            </div>
          );
        })}
      </div>


      <div className="flex justify-center space-x-2.5 mt-6">
        <button
          type="button"
          onClick={() => {
            if (prevStep) {
              prevStep();
            }
          }}
          className="bg-gray-500 min-w-32 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-brand-blue hover:bg-brand-darkblue text-center text-white font-bold py-2 px-4 rounded-sm min-w-32 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Next
        </button>
      </div>
      <ValidationErrorModal
        isOpen={showValidationModal}
        message="Please select at least one data interest."
        onClose={() => setShowValidationModal(false)}
      />
    </form>
  );
};

// Optimized component using ID arrays
const OptimizedDataInterests = ({
  selectedInterestIds,
  otherInterestText,
  setFormData,
  prevStep,
  nextStep,
  errors,
  setErrors,
}: Omit<OptimizedDataInterestsProps, "isStepValid" | "showCustomModal"> & {
  errors: { interests?: string; other?: string };
  setErrors: React.Dispatch<
    React.SetStateAction<{ interests?: string; other?: string }>
  >;
}) => {
  const MAX_CHAR_COUNT = 30;
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Convert IDs to strings for display
  const selectedInterests = selectedInterestIds.map(id => DATA_INTEREST_STRING_MAP[id]).filter(Boolean);
  const isOtherSelected = selectedInterestIds.includes(-1);

  const validate = useCallback(() => {
    const newErrors: { interests?: string; other?: string } = {};
    if (selectedInterestIds.length === 0) {
      newErrors.interests = "Please select at least one data interest.";
    }
    if (isOtherSelected && otherInterestText.trim() === "") {
      newErrors.other = "Enter your specific interest";
    }
    return newErrors;
  }, [selectedInterestIds, isOtherSelected, otherInterestText]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      setErrors(validate());
    }
  }, [
    selectedInterestIds,
    otherInterestText,
    hasAttemptedSubmit,
    setErrors,
    validate,
  ]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const interestId = DATA_INTEREST_ID_MAP[value];
    
    if (interestId === undefined) return; // Type safety guard
    
    setFormData((prevData) => {
      const currentIds = prevData.dataInterestIds;
      let updatedIds: number[];
      
      if (checked) {
        updatedIds = [...currentIds, interestId];
      } else {
        updatedIds = currentIds.filter((id) => id !== interestId);
        if (value === "Other") {
          return {
            ...prevData,
            dataInterestIds: updatedIds,
            otherInterestText: "",
            rankedMotivationIds: [],
          };
        }
      }
      return {
        ...prevData,
        dataInterestIds: updatedIds,
        rankedMotivationIds: [],
      };
    });
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHAR_COUNT) {
      setFormData((prevData) => ({
        ...prevData,
        otherInterestText: text,
      }));
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (nextStep) {
        nextStep();
      }
    } else if (validationErrors.interests) {
      // Show modal for interests validation error
      setShowValidationModal(true);
    }
  };

  const charCount = MAX_CHAR_COUNT - otherInterestText.length;

  return (
    <form onSubmit={onSubmit} noValidate>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        What decision(s) can our data help you make?
      </h3>
      <p className="text-gray-600 mb-6">
        Select as many motivations as you&apos;d like.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        {MOTIVATIONS.map((motivation) => {
          const isChecked = selectedInterests.includes(motivation);
          
          if (motivation === "Other") {
            return (
              <div key={motivation} className="col-span-1 md:col-span-2">
                <div className="flex items-start flex-col gap-4">
                  <div className="flex items-center flex-shrink-0">
                    <input
                      type="checkbox"
                      id={motivation.replace(/\s/g, "-")}
                      name="dataInterests"
                      value={motivation}
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-5 w-5 text-brand-blue rounded-md"
                    />
                    <label
                      htmlFor={motivation.replace(/\s/g, "-")}
                      className="ml-2 text-gray-700 cursor-pointer"
                    >
                      {motivation}
                    </label>
                  </div>
                  {isOtherSelected && (
                    <div className="flex-1 flex flex-col items-start min-w-0">
                      <input
                        type="text"
                        id="otherInterestText"
                        name="otherInterestText"
                        value={otherInterestText}
                        onChange={handleOtherTextChange}
                        placeholder="e.g., Personal growth"
                        maxLength={MAX_CHAR_COUNT}
                        className={`shadow appearance-none border w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-md ${
                          errors.other
                            ? "border-red-500"
                            : "focus:border-brand-blue"
                        }`}
                        required={isOtherSelected}
                      />

                      <div className="w-full mt-1">
                        <p className="text-left pl-3 text-xs text-gray-500 mb-1">
                          {charCount} characters remaining
                        </p>
                        {errors.other && (
                          <p className="text-red-500 text-xs pl-3 italic text-left">
                            {errors.other}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={motivation} className="flex items-center">
              <input
                type="checkbox"
                id={motivation.replace(/\s/g, "-")}
                name="dataInterests"
                value={motivation}
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-brand-blue rounded-md"
              />
              <label
                htmlFor={motivation.replace(/\s/g, "-")}
                className="ml-2 text-gray-700 cursor-pointer"
              >
                {motivation}
              </label>
            </div>
          );
        })}
      </div>


      <div className="flex justify-center space-x-2.5 mt-6">
        <button
          type="button"
          onClick={() => {
            if (prevStep) {
              prevStep();
            }
          }}
          className="bg-gray-500 min-w-32 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-brand-blue hover:bg-brand-darkblue text-center text-white font-bold py-2 px-4 rounded-sm min-w-32 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Next
        </button>
      </div>
      <ValidationErrorModal
        isOpen={showValidationModal}
        message="Please select at least one data interest."
        onClose={() => setShowValidationModal(false)}
      />
    </form>
  );
};

// Main component with feature flag switching
const DataInterests = (props: any) => {
  if (MIGRATION_FLAGS.USE_OPTIMIZED_DATA_INTERESTS && 'selectedInterestIds' in props) {
    return <OptimizedDataInterests {...props} />;
  }
  return <LegacyDataInterests {...props} />;
};

export default DataInterests;
