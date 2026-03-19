"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { decompress } from "compress-json";
import statesData from "@/utils/locations-states.json";
import citiesData from "@/utils/locations-cities.json";
import zipsData from "@/utils/locations-zips.json";
import { USER_PREFIX, USER_SUFFIX, USER_PRIVACY_LEVEL } from "@/components/betaclient/types";
import type { AppUserWithProfile } from "@/types/user-profile";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: AppUserWithProfile;
  onProfileUpdate?: () => void;
}

interface BaseOptionType {
  disabled?: boolean;
  [name: string]: unknown;
}

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

// Reusable SearchableSelect Component (copied from PersonalInformation)
const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const listItem = listRef.current.children[highlightedIndex] as HTMLElement;
      if (listItem) {
        listItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

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

export default function EditProfileModal({
  isOpen,
  onClose,
  authUser,
  onProfileUpdate,
}: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    prefix: "",
    suffix: "",
    state: "",
    cityOfResidence: "",
    zipCode: "",
    privacyLevel: "",
  });

  // Load location data
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const states = decompress(statesData as unknown as any);
        const cities = decompress(citiesData as unknown as any);
        const zips = decompress(zipsData as unknown as any);

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

    if (isOpen) {
      loadLocations();
    }
  }, [isOpen]);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && authUser) {
      // Use privacyLevelText if available, otherwise fall back to privacyLevel
      const privacyLevelValue = authUser.privacyLevelText || authUser.privacyLevel || "";

      setFormData({
        firstName: authUser?.firstName || "",
        lastName: authUser?.lastName || "",
        prefix: authUser?.prefix || "",
        suffix: authUser?.suffix || "",
        state: authUser?.state || "",
        cityOfResidence: authUser?.cityOfResidence || authUser?.city || "",
        zipCode: authUser?.zipCode || "",
        privacyLevel: privacyLevelValue,
      });
    }
  }, [isOpen, authUser]);

  const handleSearchableChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          prefix: formData.prefix,
          suffix: formData.suffix,
          state: formData.state,
          cityOfResidence: formData.cityOfResidence,
          zipCode: formData.zipCode,
          privacyLevel: formData.privacyLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to update profile: ${response.statusText}`
        );
      }

      // Trigger refetch to update the settings page
      if (onProfileUpdate) {
        await onProfileUpdate();
      }

      toast.success("Profile updated successfully");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare options for SearchableSelect components
  const stateOptions = locations.states.map((s) => ({
    value: s.value as string,
    label: s.label as string,
  }));

  const cityOptions = locations.cities
    .filter((c) => c.state === formData.state)
    .map((c) => ({
      value: `${c.county}/${c.value}`,
      label: `${c.county}/${c.label}`,
    }));

  // Extract city name from "County/City" format for zip code filtering
  const selectedCityName = formData.cityOfResidence
    ? formData.cityOfResidence.split("/")[1]
    : null;

  const zipOptions = locations.zips
    .filter(
      (z) =>
        z.city === selectedCityName && z.state === formData.state
    )
    .map((z) => ({
      value: z.value as string,
      label: z.label as string,
    }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
            {/* Prefix */}
            <div className="lg:col-span-1 space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Select
                value={formData.prefix || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, prefix: value })
                }
              >
                <SelectTrigger id="prefix">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(USER_PREFIX).map((prefix) => (
                    <SelectItem key={prefix} value={prefix}>
                      {prefix}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* First Name - Read Only */}
            <div className="lg:col-span-3 space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Last Name - Read Only */}
            <div className="lg:col-span-3 space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Suffix */}
            <div className="lg:col-span-1 space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Select
                value={formData.suffix || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, suffix: value })
                }
              >
                <SelectTrigger id="suffix">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(USER_SUFFIX).map((suffix) => (
                    <SelectItem key={suffix} value={suffix}>
                      {suffix}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State of Residence</Label>
              <SearchableSelect
                options={stateOptions}
                value={formData.state}
                onChange={(value) => handleSearchableChange("state", value)}
                placeholder={
                  locations.loading ? "Loading..." : "Search for a state..."
                }
                disabled={locations.loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cityOfResidence">City of Residence</Label>
              <SearchableSelect
                options={cityOptions}
                value={formData.cityOfResidence}
                onChange={(value) =>
                  handleSearchableChange("cityOfResidence", value)
                }
                placeholder="Search for a city..."
                disabled={!formData.state || locations.loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <SearchableSelect
                options={zipOptions}
                value={formData.zipCode}
                onChange={(value) => handleSearchableChange("zipCode", value)}
                placeholder="Search for a zip code..."
                disabled={!formData.cityOfResidence || locations.loading}
              />
            </div>
          </div>

          {/* Privacy Level */}
          <div className="space-y-2">
            <Label htmlFor="privacyLevel">Privacy Level</Label>
            <Select
              value={formData.privacyLevel || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, privacyLevel: value })
              }
            >
              <SelectTrigger id="privacyLevel">
                <SelectValue placeholder="Select privacy level" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(USER_PRIVACY_LEVEL).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
