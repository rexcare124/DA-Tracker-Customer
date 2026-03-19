"use client";
import React, { useEffect, useState, useRef } from "react";

import {
  PersonalInformationProps,
  USER_PREFIX,
  USER_SUFFIX,
  USER_PRIVACY_LEVEL,
  USER_HEARD_ABOUT_US,
  PersonalInfo,
  SignUpMethod, // Import SignUpMethod
} from "./types";

import { decompress } from "compress-json";
import statesData from "@/utils/locations-states.json";
import citiesData from "@/utils/locations-cities.json";
import zipsData from "@/utils/locations-zips.json";

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}

// --- Suffix Detection Modal Component ---
interface SuffixDetectionModalProps {
  isOpen: boolean;
  lastName: string;
  detectedSuffix: string;
  onConfirm: () => void;
  onDecline: () => void;
}

const SuffixDetectionModal: React.FC<SuffixDetectionModalProps> = ({
  isOpen,
  lastName,
  detectedSuffix,
  onConfirm,
  onDecline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Name Suffix Detected
          </h3>
                                           <p className="text-gray-600 mb-6">
              We detected a suffix in your name. Would you like us to separate &quot;{detectedSuffix}&quot; as your name suffix?
            </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Yes, separate it
            </button>
            <button
              onClick={onDecline}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              No, keep as is
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Suffix Detection Utility Function ---
const detectSuffix = (lastName: string): { suffix: string; nameWithoutSuffix: string } | null => {
  const suffixValues = Object.values(USER_SUFFIX);
  
  // Sort suffixes by length (longest first) to ensure "III" is checked before "II"
  const sortedSuffixes = suffixValues.sort((a, b) => b.length - a.length);
  
  for (const suffix of sortedSuffixes) {
    // Check if the lastName ends with the suffix (case-insensitive)
    const suffixRegex = new RegExp(`\\s*${suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    if (suffixRegex.test(lastName)) {
      const nameWithoutSuffix = lastName.replace(suffixRegex, '').trim();
      return { suffix, nameWithoutSuffix };
    }
  }
  
  return null;
};

// --- Reusable SearchableSelect Component ---
interface SearchableSelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setSearchTerm("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[
        highlightedIndex
      ] as HTMLLIElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            error ? "border-red-500" : "focus:border-blue-500"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          value={isOpen ? searchTerm : selectedOption?.label || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(-1);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (!disabled) {
              setIsOpen(true);
              setSearchTerm("");
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
      {isOpen && !disabled && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto bottom-full mb-1"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  index === highlightedIndex ? "bg-gray-200" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

const getValidationErrors = (
  data: PersonalInfo,
  signUpMethod: SignUpMethod,
  usernameStatus?: "idle" | "checking" | "available" | "unavailable"
) => {
  const tempErrors: Record<string, string> = {};
  if (!data.prefix) tempErrors.prefix = "Please select a prefix.";
  if (!data.firstName) tempErrors.firstName = "Please enter your first name.";
  if (!data.lastName) tempErrors.lastName = "Please enter your last name.";
  
  // Enhanced username validation - CRITICAL: Block form submission until validation completes
  if (!data.username) {
    tempErrors.username = "Please enter a username.";
  } else if (data.username.length < 3) {
    tempErrors.username = "Username must be at least 3 characters long.";
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    tempErrors.username = "Username can only contain letters, numbers, underscores, and hyphens.";
  } else if (usernameStatus === "unavailable") {
    tempErrors.username = "This username is already taken. Please choose a different one.";
  } else if (usernameStatus === "checking") {
    tempErrors.username = "Checking username availability...";
  } else if (usernameStatus === "idle" && data.username.length >= 3) {
    // Allow form submission for idle state - validation will occur on blur
    // tempErrors.username = "Please wait for username availability check.";
  } else if (usernameStatus !== "available" && usernameStatus !== "idle") {
    // Only block submission for explicitly unavailable usernames, not idle state
    tempErrors.username = "Username availability must be verified before proceeding.";
  }
  
  if (!data.defaultPrivacyLevel)
    tempErrors.defaultPrivacyLevel = "Please select a privacy level.";

  if (signUpMethod === "email") {
    if (!data.email) {
      tempErrors.email = "Please enter your email.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = "Email is not valid.";
    }
    if (data.email.toLowerCase() !== data.confirmEmail.toLowerCase()) {
      tempErrors.confirmEmail = "Emails do not match.";
    }
    if (!data.password) {
      tempErrors.password = "Password is required.";
    } else if (data.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters long.";
    } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(data.password)) {
      tempErrors.password = "Must contain at least one letter and one number.";
    }
    if (data.password !== data.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }
  }

  if (!data.stateOfResidence)
    tempErrors.stateOfResidence = "Please select a state.";
  if (!data.cityOfResidence)
    tempErrors.cityOfResidence = "Please select a city.";
  if (!data.zipCode) tempErrors.zipCode = "Please enter a zip code.";
  if (!data.howDidYouHearAboutUs)
    tempErrors.howDidYouHearAboutUs = "Please select how you heard about us.";

  // Conditional validation for "How Did You Hear About Us" follow-up fields
  if (data.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.ONLINE_COMMUNITY_FORUM) {
    if (!data.forumUrl?.trim()) {
      tempErrors.forumUrl = "Please enter the website URL of the forum.";
    }
  }
  
  if (data.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.YOUTUBE_PERSONALITY) {
    if (!data.youtubeUrl?.trim()) {
      tempErrors.youtubeUrl = "Please enter the YouTube channel URL.";
    }
  }
  
  if (data.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.REFERRED_BY_EXISTING_MEMBER) {
    if (!data.referredByUsername?.trim()) {
      tempErrors.referredByUsername = "Please enter the member/user's username.";
    }
  }
  
  if (data.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.COMMUNITY_FLYER) {
    if (!data.flyerPromoCode?.trim()) {
      tempErrors.flyerPromoCode = "Please enter the community flyer promo code.";
    }
  }
  
  if (data.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.OTHER) {
    if (!data.otherHeardAboutText?.trim()) {
      tempErrors.otherHeardAboutText = "Please tell us how you heard about us.";
    }
  }

  return tempErrors;
};

// --- MODIFICATION: Component now accepts `prevStep` ---
const PersonalInformation = ({
  formData,
  handleChange,
  prevStep, // <-- New prop
  nextStep,
  signUpMethod,
  showCustomModal,
  userId,
}: PersonalInformationProps) => {
  const [locations, setLocations] = useState<{
    loading: boolean;
    states: BaseOptionType[];
    cities: BaseOptionType[];
    zips: BaseOptionType[];
  }>({
    loading: true,
    states: [],
    cities: [],
    zips: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Suffix Detection State ---
  const [showSuffixModal, setShowSuffixModal] = useState(false);
  const [detectedSuffix, setDetectedSuffix] = useState("");
  const [suffixDetectionCompleted, setSuffixDetectionCompleted] = useState(false);
  
  // Check if suffix detection was already asked (from Firebase)
  // Access suffixDetectionAsked from formData if it exists (added by registration page from API response)
  const suffixDetectionAsked = (formData as PersonalInfo & { suffixDetectionAsked?: boolean }).suffixDetectionAsked ?? false;

  // --- Username Validation State ---
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const confirmEmailRef = useRef<HTMLInputElement>(null);
  const lastCheckedEmailRef = useRef<string>("");

  useEffect(() => {
    if (hasAttemptedSubmit) {
      const validationErrors = getValidationErrors(formData, signUpMethod, usernameStatus);
      setErrors(validationErrors);
    }
  }, [formData, hasAttemptedSubmit, signUpMethod, usernameStatus]);

  const checkEmailExists = async (email: string) => {
    try {
      const res = await fetch(
        `/api/rbca/users/check-email?email=${encodeURIComponent(email.toLowerCase())}`
      );
      const data = await res.json();
      if (res.ok && data?.exists) {
        showCustomModal(
          `The e-mail address "${(data.existingEmail || email).toString().toLowerCase()}" is associated with an existing account. You will now be redirected to the Sign-In page.`
        );
      }
    } catch (err) {
      // Fail open on network errors (server-side enforcement still applies)
      console.warn("RBCA email validation failed (email signup):", err);
    }
  };

  const handleEmailFieldsBlur = () => {
    // Wait for focus to settle before checking whether neither field is focused
    window.setTimeout(() => {
      const active = document.activeElement;
      if (active === emailRef.current || active === confirmEmailRef.current) return;

      const email = (formData.email || "").trim().toLowerCase();
      const confirmEmail = (formData.confirmEmail || "").trim().toLowerCase();

      if (!email || !confirmEmail) return;
      if (email !== confirmEmail) return;
      if (!/^\S+@\S+\.\S+$/.test(email)) return;

      if (lastCheckedEmailRef.current === email) return;
      lastCheckedEmailRef.current = email;

      void checkEmailExists(email);
    }, 0);
  };

  // Track last validated username to preserve state
  const [lastValidatedUsername, setLastValidatedUsername] = useState<string>("");

  // Reset username validation status when username changes (no auto-checking)
  useEffect(() => {
    if (!formData.username || formData.username.length < 3) {
      // Reset status for empty or short usernames
      setUsernameStatus("idle");
      setLastValidatedUsername("");
    } else if (formData.username !== lastValidatedUsername) {
      // Username changed - reset to idle but don't auto-check (wait for onBlur)
      setUsernameStatus("idle");
    }
  }, [formData.username, lastValidatedUsername]);

  // --- Suffix Detection Effect ---
  useEffect(() => {
    // Only run suffix detection for social login users and only once
    // Skip if suffix detection was already asked (from Firebase)
    if (signUpMethod === "social" && !suffixDetectionCompleted && !suffixDetectionAsked && formData.lastName) {
      const suffixResult = detectSuffix(formData.lastName);

      if (suffixResult) {
        setDetectedSuffix(suffixResult.suffix);
        setShowSuffixModal(true);
      } else {
        // No suffix detected, mark as completed
        setSuffixDetectionCompleted(true);
      }
    } else if (suffixDetectionAsked) {
      // If flag is set in Firebase, mark as completed to prevent re-showing
      setSuffixDetectionCompleted(true);
    }
  }, [formData.lastName, signUpMethod, suffixDetectionCompleted, suffixDetectionAsked]);

  useEffect(() => {
    // Load locations data
    const loadLocations = async () => {
      try {
        // Process the compressed location data directly
        const states = decompress(statesData as any);
        const cities = decompress(citiesData as any);
        const zips = decompress(zipsData as any);
        
        setLocations({
          loading: false,
          states: states || [],
          cities: cities || [],
          zips: zips || [],
        });
      } catch (error) {
        console.error("Failed to load locations:", error);
        setLocations({
          loading: false,
          states: [],
          cities: [],
          zips: [],
        });
      }
    };

    loadLocations();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (usernameCheckTimeout) {
        clearTimeout(usernameCheckTimeout);
      }
    };
  }, [usernameCheckTimeout]);

  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    // Basic client-side validation
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameStatus("unavailable");
      return;
    }

    setUsernameStatus("checking");
    
    try {
      // Make API call to check username availability
      const response = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (response.ok) {
        if (data.available) {
          setUsernameStatus("available");
          setLastValidatedUsername(username); // Track this username as validated
        } else {
          setUsernameStatus("unavailable");
        }
      } else if (response.status === 429) {
        // Rate limited - show appropriate message
        setUsernameStatus("unavailable");
        console.warn("Username check rate limited:", data.error);
      } else if (response.status === 503) {
        // Service unavailable - Firebase connection issue
        setUsernameStatus("unavailable");
        console.warn("Username availability service temporarily unavailable");
      } else if (response.status === 400) {
        // Invalid username format
        setUsernameStatus("unavailable");
        console.warn("Invalid username format:", data.details);
      } else {
        // Server error - fall back to basic validation
        console.error("Username check failed:", data.error);
        setUsernameStatus("unavailable");
      }
    } catch (error) {
      console.error("Network error during username check:", error);
      // Network error - assume unavailable for safety
      setUsernameStatus("unavailable");
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleChange(e, "username");
    
    // Clear existing timeout
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }
    
    // Reset status immediately when username changes
    setUsernameStatus("idle");
    setLastValidatedUsername("");
  };

  const handleUsernameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only check if username is long enough and different from last validated
    if (value.length >= 3 && value !== lastValidatedUsername) {
      checkUsername(value);
    }
  };

  const handleSearchableChange = (key: keyof PersonalInfo, value: string) => {
    const syntheticEvent = {
      target: { name: key, value },
    } as React.ChangeEvent<HTMLSelectElement>;
    handleChange(syntheticEvent, key);
  };

  // --- Suffix Modal Handlers ---
  /**
   * Save suffix and updated lastName to Firebase immediately for OAuth users to preserve data if they sign out
   * Also saves the suffixDetectionAsked flag to prevent showing the modal again
   * @param suffix - The suffix text value (e.g., "III")
   * @param lastNameWithoutSuffix - The last name without the suffix (e.g., "Sanders")
   * @param suffixDetectionAsked - Whether the suffix detection modal was shown/answered
   */
  const saveSuffixToFirebase = async (suffix: string, lastNameWithoutSuffix: string, suffixDetectionAsked: boolean): Promise<void> => {
    // Only save for OAuth users with valid userId
    if (!userId || signUpMethod !== "social") {
      return;
    }

    try {
      const response = await fetch("/api/rbca/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: userId,
          personalInfo: {
            lastName: lastNameWithoutSuffix,
            suffix: suffix,
            suffixDetectionAsked: suffixDetectionAsked,
          },
        }),
      });

      if (!response.ok) {
        // Log error but don't block UI - suffix is already in form state
        const errorData = await response.json().catch(() => ({}));
        console.error("[ERROR] Failed to save suffix to Firebase:", errorData);
      }
    } catch (error) {
      // Log error but don't block UI - suffix is already in form state
      console.error("[ERROR] Error saving suffix to Firebase:", error instanceof Error ? error.message : String(error));
    }
  };

  const handleSuffixConfirm = async () => {
    const suffixResult = detectSuffix(formData.lastName);
    if (suffixResult) {
      // Update the form data to separate the suffix
      const syntheticEvent = {
        target: { name: "lastName", value: suffixResult.nameWithoutSuffix },
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(syntheticEvent, "lastName");

      const suffixEvent = {
        target: { name: "suffix", value: suffixResult.suffix },
      } as React.ChangeEvent<HTMLSelectElement>;
      handleChange(suffixEvent, "suffix");

      // Save suffix and updated lastName to Firebase immediately for OAuth users
      // Also save the flag to prevent showing the modal again
      await saveSuffixToFirebase(suffixResult.suffix, suffixResult.nameWithoutSuffix, true);
    }

    setShowSuffixModal(false);
    setSuffixDetectionCompleted(true);
  };

  const handleSuffixDecline = async () => {
    setShowSuffixModal(false);
    setSuffixDetectionCompleted(true);
    
    // Save the flag to Firebase to prevent showing the modal again
    // Even if user declined, we don't want to ask again
    if (userId && signUpMethod === "social") {
      await saveSuffixToFirebase("", formData.lastName, true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const validationErrors = getValidationErrors(formData, signUpMethod, usernameStatus);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (nextStep) {
        nextStep();
      }
    }
  };

  const stateOptions = locations.states.map((s) => ({
    value: s.value,
    label: s.label,
  }));

  const cityOptions = locations.cities
    .filter((c) => c.state === formData.stateOfResidence)
    .map((c) => ({
      value: `${c.county}/${c.value}`,
      label: `${c.county}/${c.label}`,
    }));

  const selectedCityName = formData.cityOfResidence
    ? formData.cityOfResidence.split("/")[1]
    : null;

  const zipOptions = locations.zips
    .filter(
      (z) =>
        z.city === selectedCityName && z.state === formData.stateOfResidence
    )
    .map((z) => ({ value: z.value, label: z.label }));

  return (
    <>
      {/* Suffix Detection Modal */}
      <SuffixDetectionModal
        isOpen={showSuffixModal}
        lastName={formData.lastName}
        detectedSuffix={detectedSuffix}
        onConfirm={handleSuffixConfirm}
        onDecline={handleSuffixDecline}
      />
      
      <form onSubmit={handleSubmit} className="w-full" noValidate>
        <p className="text-sm text-gray-600">* indicates required field</p>

      {/* --- Personal Details Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 pt-4">
        {/* Prefix */}
        <div className="lg:col-span-1">
          <label
            htmlFor="prefix"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *Prefix
          </label>
          <select
            id="prefix"
            name="prefix"
            value={formData.prefix}
            onChange={(e) => handleChange(e, "prefix")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.prefix ? "border-red-500" : "focus:border-blue-500"
            }`}
            required
          >
            <option value="">Select</option>
            {Object.values(USER_PREFIX).map((prefix) => (
              <option key={prefix} value={prefix}>
                {prefix}
              </option>
            ))}
          </select>
          {errors.prefix && (
            <p className="text-red-500 text-xs italic">{errors.prefix}</p>
          )}
        </div>
        {/* First Name */}
        <div className="lg:col-span-3">
          <label
            htmlFor="firstName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange(e, "firstName")}
            placeholder="First Name"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.firstName ? "border-red-500" : "focus:border-blue-500"
            }`}
            required
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs italic">{errors.firstName}</p>
          )}
        </div>
        {/* Last Name */}
        <div className="lg:col-span-3">
          <label
            htmlFor="lastName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange(e, "lastName")}
            placeholder="Last Name"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.lastName ? "border-red-500" : "focus:border-blue-500"
            }`}
            required
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs italic">{errors.lastName}</p>
          )}
        </div>
        {/* Suffix */}
        <div className="lg:col-span-1">
          <label
            htmlFor="suffix"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Suffix
          </label>
          <select
            id="suffix"
            name="suffix"
            value={formData.suffix}
            onChange={(e) => handleChange(e, "suffix")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 "
          >
            <option value="">Select</option>
            {Object.values(USER_SUFFIX).map((suffix) => (
              <option key={suffix} value={suffix}>
                {suffix}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Account Details Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {signUpMethod === "email" && (
          <>
            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
                onBlur={handleEmailFieldsBlur}
                placeholder="E-mail"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email ? "border-red-500" : "focus:border-brand-blue"
                }`}
                ref={emailRef}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic">{errors.email}</p>
              )}
            </div>
            {/* Confirm E-mail */}
            <div>
              <label
                htmlFor="confirmEmail"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *Confirm E-mail
              </label>
              <input
                type="email"
                id="confirmEmail"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={(e) => handleChange(e, "confirmEmail")}
                onBlur={handleEmailFieldsBlur}
                placeholder="Confirm E-mail"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.confirmEmail
                    ? "border-red-500"
                    : "focus:border-blue-500"
                }`}
                ref={confirmEmailRef}
                required
              />
              {errors.confirmEmail && (
                <p className="text-red-500 text-xs italic">
                  {errors.confirmEmail}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e, "password")}
                placeholder="Password"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.password ? "border-red-500" : "focus:border-blue-500"
                }`}
                required
              />
              <div className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 focus:outline-none focus:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs italic">{errors.password}</p>
              )}
            </div>
            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange(e, "confirmPassword")}
                placeholder="Confirm Password"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "focus:border-blue-500"
                }`}
                required
              />
              <div className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 focus:outline-none focus:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs italic">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </>
        )}

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleUsernameChange}
            onBlur={handleUsernameBlur}
            placeholder="Username"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.username ? "border-red-500" : 
              usernameStatus === "available" ? "border-green-500" :
              usernameStatus === "unavailable" ? "border-red-500" :
              usernameStatus === "checking" ? "border-blue-500" :
              "focus:border-blue-500"
            }`}
            required
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">{errors.username}</p>
          )}
          {usernameStatus === "checking" && !errors.username && (
            <p className="text-blue-500 text-xs italic flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking username availability...
            </p>
          )}
          {usernameStatus === "available" && !errors.username && (
            <p className="text-green-500 text-xs italic flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Username available!
            </p>
          )}
          {usernameStatus === "unavailable" && !errors.username && (
            <p className="text-red-500 text-xs italic flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Username taken.
            </p>
          )}
        </div>
        {/* Default Privacy Level */}
        <div>
          <label
            htmlFor="defaultPrivacyLevel"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *Default Privacy Level
            <div className="relative inline-block group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline-block text-gray-500 cursor-pointer ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-2 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                This setting determines how much information about your identity
                is publicly disclosed.
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-black"></div>
              </div>
            </div>
          </label>
          <select
            id="defaultPrivacyLevel"
            name="defaultPrivacyLevel"
            value={formData.defaultPrivacyLevel}
            onChange={(e) => handleChange(e, "defaultPrivacyLevel")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.defaultPrivacyLevel
                ? "border-red-500"
                : "focus:border-blue-500"
            }`}
            required
          >
            <option value="">Select</option>
            {Object.values(USER_PRIVACY_LEVEL).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.defaultPrivacyLevel && (
            <p className="text-red-500 text-xs italic">
              {errors.defaultPrivacyLevel}
            </p>
          )}
        </div>
      </div>

      {/* --- Location Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* State of Residence */}
        <div>
          <label
            htmlFor="stateOfResidence"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *State of Residence
          </label>
          <SearchableSelect
            options={stateOptions}
            value={formData.stateOfResidence}
            onChange={(value) =>
              handleSearchableChange("stateOfResidence", value)
            }
            placeholder={
              locations.loading ? "Loading..." : "Search for a state..."
            }
            disabled={locations.loading}
            error={!!errors.stateOfResidence}
          />
          {errors.stateOfResidence && (
            <p className="text-red-500 text-xs italic">
              {errors.stateOfResidence}
            </p>
          )}
        </div>

        {/* City of Residence */}
        <div>
          <label
            htmlFor="cityOfResidence"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *City of Residence
          </label>
          <SearchableSelect
            options={cityOptions}
            value={formData.cityOfResidence}
            onChange={(value) =>
              handleSearchableChange("cityOfResidence", value)
            }
            placeholder="Search for a city..."
            disabled={!formData.stateOfResidence || locations.loading}
            error={!!errors.cityOfResidence}
          />
          {errors.cityOfResidence && (
            <p className="text-red-500 text-xs italic">
              {errors.cityOfResidence}
            </p>
          )}
        </div>

        {/* Zip Code */}
        <div>
          <label
            htmlFor="zipCode"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *Zip Code
          </label>
          <SearchableSelect
            options={zipOptions}
            value={formData.zipCode}
            onChange={(value) => handleSearchableChange("zipCode", value)}
            placeholder="Search for a zip code..."
            disabled={!formData.cityOfResidence || locations.loading}
            error={!!errors.zipCode}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-xs italic">{errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* --- 'How Did You Hear About Us' Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* Dropdown Column */}
        <div className="md:col-span-1">
          <label
            htmlFor="howDidYouHearAboutUs"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            *How Did You Hear About Us?
          </label>
          <select
            id="howDidYouHearAboutUs"
            name="howDidYouHearAboutUs"
            value={formData.howDidYouHearAboutUs}
            onChange={(e) => handleChange(e, "howDidYouHearAboutUs")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.howDidYouHearAboutUs
                ? "border-red-500"
                : "focus:border-blue-500"
            }`}
            required
          >
            <option value="">Select an option</option>
            {Object.values(USER_HEARD_ABOUT_US).map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
          {errors.howDidYouHearAboutUs && (
            <p className="text-red-500 text-xs italic">
              {errors.howDidYouHearAboutUs}
            </p>
          )}
        </div>

        {/* Conditional Input Column */}
        <div className="md:col-span-1 self-end">
          {formData.howDidYouHearAboutUs ===
            USER_HEARD_ABOUT_US.ONLINE_COMMUNITY_FORUM && (
            <div>
              <label
                htmlFor="forumUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *Website URL of Forum
              </label>
              <input
                type="url"
                id="forumUrl"
                name="forumUrl"
                value={formData.forumUrl}
                onChange={(e) => handleChange(e, "forumUrl")}
                placeholder="https://example.com/forum"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.forumUrl ? "border-red-500" : "focus:border-blue-500"
                }`}
                required
              />
              {errors.forumUrl && (
                <p className="text-red-500 text-xs italic">{errors.forumUrl}</p>
              )}
            </div>
          )}

          {formData.howDidYouHearAboutUs ===
            USER_HEARD_ABOUT_US.YOUTUBE_PERSONALITY && (
            <div>
              <label
                htmlFor="youtubeUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *YouTube Channel URL
              </label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) => handleChange(e, "youtubeUrl")}
                placeholder="https://youtube.com/c/channelname"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.youtubeUrl ? "border-red-500" : "focus:border-blue-500"
                }`}
                required
              />
              {errors.youtubeUrl && (
                <p className="text-red-500 text-xs italic">
                  {errors.youtubeUrl}
                </p>
              )}
            </div>
          )}

          {formData.howDidYouHearAboutUs ===
            USER_HEARD_ABOUT_US.REFERRED_BY_EXISTING_MEMBER && (
            <div>
              <label
                htmlFor="referredByUsername"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *Member/User&apos;s Username
              </label>
              <input
                type="text"
                id="referredByUsername"
                name="referredByUsername"
                value={formData.referredByUsername}
                onChange={(e) => handleChange(e, "referredByUsername")}
                placeholder="Enter username"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.referredByUsername
                    ? "border-red-500"
                    : "focus:border-blue-500"
                }`}
                required
              />
              {errors.referredByUsername && (
                <p className="text-red-500 text-xs italic">
                  {errors.referredByUsername}
                </p>
              )}
            </div>
          )}

          {formData.howDidYouHearAboutUs ===
            USER_HEARD_ABOUT_US.COMMUNITY_FLYER && (
            <div>
              <label
                htmlFor="flyerPromoCode"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *Community Flyer Promo Code
              </label>
              <input
                type="text"
                id="flyerPromoCode"
                name="flyerPromoCode"
                value={formData.flyerPromoCode}
                onChange={(e) => handleChange(e, "flyerPromoCode")}
                placeholder="Enter promo code"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.flyerPromoCode
                    ? "border-red-500"
                    : "focus:border-blue-500"
                }`}
                required
              />
              {errors.flyerPromoCode && (
                <p className="text-red-500 text-xs italic">
                  {errors.flyerPromoCode}
                </p>
              )}
            </div>
          )}

          {formData.howDidYouHearAboutUs === USER_HEARD_ABOUT_US.OTHER && (
            <div>
              <label
                htmlFor="otherHeardAboutText"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                *Tell us more
              </label>
              <input
                type="text"
                id="otherHeardAboutText"
                name="otherHeardAboutText"
                value={formData.otherHeardAboutText}
                onChange={(e) => handleChange(e, "otherHeardAboutText")}
                placeholder="How did you hear about us?"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.otherHeardAboutText
                    ? "border-red-500"
                    : "focus:border-blue-500"
                }`}
                required
              />
              {errors.otherHeardAboutText && (
                <p className="text-red-500 text-xs italic">
                  {errors.otherHeardAboutText}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- MODIFICATION: Form Actions with Previous Button --- */}
      <div className="flex justify-center space-x-2.5 mt-8">
        <button
          type="button"
          onClick={() => {
            if (prevStep && signUpMethod !== "social") {
              prevStep();
            }
          }}
          disabled={signUpMethod === "social"}
          title={signUpMethod === "social" ? "Cannot go back after social login" : "Go to previous step"}
          className={`min-w-32 font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform ${
            signUpMethod === "social"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-700 text-white hover:scale-105"
          }`}
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={usernameStatus === "unavailable" || usernameStatus === "checking"}
          className={`min-w-32 font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform ${
            usernameStatus === "unavailable" || usernameStatus === "checking"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-brand-blue hover:bg-brand-darkblue text-white hover:scale-105"
          }`}
        >
          Next
        </button>
      </div>
      </form>
    </>
  );
};

export default PersonalInformation;
