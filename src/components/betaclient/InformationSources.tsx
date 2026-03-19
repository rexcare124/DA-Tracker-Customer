"use client";
import React from "react";
import { InformationSourcesProps, OptimizedInformationSourcesProps, INFORMATION_SOURCES } from "./types";
import { MIGRATION_FLAGS } from '@/lib/migrationFlags';
import { StaticOptionsService } from '@/lib/staticOptionsService';

const MAX_CHARS = 30;

// Information source IDs for optimized version (matches static_option_registry)
const INFORMATION_SOURCE_IDS = {
  "Traditional News Websites and Apps": 11,
  "Social Media": 12,
  "Podcasts": 13,
  "YouTube": 14,
  "Company Website": 15,
  "Industry Reports": 16,
  "Word of Mouth": 17,
  "Government Websites": 18,
  "Academic Research": 19,
  "Professional Networks": 20,
  "Newsletters": 21,
  "Other": -1, // Special ID for "Other" selections
} as const;

// Reverse mapping for ID to string conversion
const ID_TO_INFORMATION_SOURCE = {
  11: "Traditional News Websites and Apps",
  12: "Social Media",
  13: "Podcasts",
  14: "YouTube",
  15: "Company Website",
  16: "Industry Reports",
  17: "Word of Mouth",
  18: "Government Websites",
  19: "Academic Research",
  20: "Professional Networks",
  21: "Newsletters",
  [-1]: "Other",
} as const;

// A map to hold the descriptive text for each tooltip
const tooltipContentMap: { [key: string]: string } = {
  "Company Website":
    "The official website of the company, often containing product details, news, and investor relations.",
  "Social Media":
    "Platforms like Twitter, Facebook, or LinkedIn where the company posts updates and interacts with the public.",
  "News Articles":
    "Reporting from journalists and media outlets about the company's activities.",
  "Industry Reports":
    "In-depth analysis and data about the market sector the company operates in.",
  "Word of Mouth":
    "Information gathered from informal conversations with friends, family, or colleagues.",
};

// --- Reusable Tooltip Component (Based on your provided snippet) ---
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div
      className="relative inline-block group ml-1    mr-10 "
      // style={{ marginLeft: "0.25in" }}
    >
      {children}
      <div className="absolute text-left left-1/2 -translate-x-1/2 mt-2 w-64 p-2 bg-black text-white text-sm  rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {content}
        {/* The triangular arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-black"></div>
      </div>
    </div>
  );
};

// --- Legacy InformationSources Component ---
const LegacyInformationSources = ({
  rankedInformationSources,
  otherInformationSourceText,
  setFormData,
  prevStep,
  nextStep,
  showCustomModal,
}: InformationSourcesProps) => {
  // BUG FIX: Derive unranked sources directly from props to prevent re-render "blink".
  // The separate `useState` and `useEffect` for `unranked` caused a second render cycle.
  const unranked = INFORMATION_SOURCES.filter(
    (source) => !rankedInformationSources.includes(source)
  );

  const handleRankClick = (source: string) => {
    const newRanked = rankedInformationSources.includes(source)
      ? rankedInformationSources.filter((item) => item !== source)
      : [...rankedInformationSources, source];

    setFormData((prev: any) => ({
      ...prev,
      rankedInformationSources: newRanked,
      otherInformationSourceText: newRanked.includes("Other")
        ? prev.otherInformationSourceText
        : "",
    }));
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('[DEBUG] Information Sources Other text changed:', newValue);
    console.log('[DEBUG] Current otherInformationSourceText prop:', otherInformationSourceText);
    setFormData((prev: any) => {
      console.log('[DEBUG] Previous form data otherInformationSourceText:', prev.otherInformationSourceText);
      console.log('[DEBUG] Previous form data keys:', Object.keys(prev));
      const updated = {
        ...prev,
        otherInformationSourceText: newValue,
      };
      console.log('[DEBUG] Updated form data otherInformationSourceText:', updated.otherInformationSourceText);
      return updated;
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rankedInformationSources.length === 0) {
      showCustomModal(
        "Please select at least one information source to proceed."
      );
      return;
    }

    if (
      rankedInformationSources.includes("Other") &&
      !otherInformationSourceText.trim()
    ) {
      showCustomModal("Please specify your 'Other' information source.");
      return;
    }

    if (nextStep) {
      nextStep();
    }
  };

  const InfoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 inline-block text-gray-500 cursor-pointer"
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
  );

  return (
    <form onSubmit={onSubmit}>
      <h3 className="text-xl font-semibold mb-2 text-gray-700">
        Rank your sources of information based on their importance.
      </h3>
      <p className="text-gray-600 mb-6">
        Click on each source to rank it. If you select &apos;Other&apos;, please
        provide details.
      </p>
      <div className="flex justify-center">
        <div className="space-y-3 lg:w-max">
          {/* --- Render Ranked Items --- */}
          {rankedInformationSources.map((source, index) => (
            <div key={source}>
              <div
                onClick={() => handleRankClick(source)}
                className="flex items-center justify-between bg-brand-blue text-white p-3 rounded-lg shadow-md cursor-pointer border border-gray-700 hover:border-blue-500 transition duration-200 min-w-[300px]"
              >
                <div className="flex items-center">
                  <span className="font-medium">{source}</span>
                  {source !== "Other" && (
                    <Tooltip content={tooltipContentMap[source] || "Tooltip"}>
                      <InfoIcon />
                    </Tooltip>
                  )}
                </div>
                <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
                  {index + 1}
                </span>
              </div>
              {source === "Other" && (
                <div className="mt-2 ml-4">
                  <input
                    type="text"
                    value={otherInformationSourceText}
                    onChange={handleOtherTextChange}
                    maxLength={MAX_CHARS}
                    placeholder="Please specify"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-left px-2 text-sm text-gray-500 mt-1">
                    {MAX_CHARS - (otherInformationSourceText?.length || 0)}{" "}
                    characters remaining
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* --- Render Unranked Items --- */}
          {unranked.map((source) => (
            <div
              key={source}
              onClick={() => handleRankClick(source)}
              className="flex items-center justify-between bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm cursor-pointer border border-gray-300 hover:border-blue-500 transition duration-200 min-w-[300px]"
            >
              <div className="flex items-center">
                <span className="font-medium">{source}</span>
                {source !== "Other" && (
                  <Tooltip content={tooltipContentMap[source] || "Tooltip"}>
                    <InfoIcon />
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Form Actions --- */}
      <div className="flex justify-center space-x-2.5 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-sm min-w-32 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
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
    </form>
  );
};

// --- Optimized InformationSources Component ---
const OptimizedInformationSources = ({
  rankedInformationSourceIds,
  otherInformationSourceText,
  setFormData,
  prevStep,
  nextStep,
  showCustomModal,
}: OptimizedInformationSourcesProps) => {
  // Convert IDs to strings for display
  const rankedInformationSources = rankedInformationSourceIds
    .map(id => ID_TO_INFORMATION_SOURCE[id as keyof typeof ID_TO_INFORMATION_SOURCE])
    .filter(Boolean) as string[];
  
  // Calculate unranked sources
  const unranked = INFORMATION_SOURCES.filter(
    (source) => !rankedInformationSources.includes(source)
  );

  const handleRankClick = (source: string) => {
    const sourceId = source === "Other" ? -1 : INFORMATION_SOURCE_IDS[source as keyof typeof INFORMATION_SOURCE_IDS];
    if (sourceId === undefined) return;

    const isRanked = rankedInformationSourceIds.includes(sourceId);
    const newRankedIds = isRanked
      ? rankedInformationSourceIds.filter((id) => id !== sourceId)
      : [...rankedInformationSourceIds, sourceId];

    setFormData((prev: any) => ({
      ...prev,
      rankedInformationSourceIds: newRankedIds,
      otherInformationSourceText: newRankedIds.includes(-1)
        ? prev.otherInformationSourceText
        : "",
    }));
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      otherInformationSourceText: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rankedInformationSourceIds.length === 0) {
      showCustomModal(
        "Selection Required",
        "Please select at least one information source to proceed."
      );
      return;
    }

    if (
      rankedInformationSourceIds.includes(-1) &&
      !otherInformationSourceText.trim()
    ) {
      showCustomModal(
        "Input Required",
        "Please specify your 'Other' information source."
      );
      return;
    }

    if (nextStep) {
      nextStep();
    }
  };

  const InfoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 inline-block text-gray-500 cursor-pointer"
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
  );

  return (
    <form onSubmit={onSubmit}>
      <h3 className="text-xl font-semibold mb-2 text-gray-700">
        Rank your sources of information based on their importance.
      </h3>
      <p className="text-gray-600 mb-6">
        Click on each source to rank it. If you select &apos;Other&apos;, please
        provide details.
      </p>
      <div className="flex justify-center">
        <div className="space-y-3 lg:w-max">
          {/* --- Render Ranked Items --- */}
          {rankedInformationSources.map((source, index) => (
            <div key={source}>
              <div
                onClick={() => handleRankClick(source)}
                className="flex items-center justify-between bg-brand-blue text-white p-3 rounded-lg shadow-md cursor-pointer border border-gray-700 hover:border-blue-500 transition duration-200 min-w-[300px]"
              >
                <div className="flex items-center">
                  <span className="font-medium">{source}</span>
                  {source !== "Other" && (
                    <Tooltip content={tooltipContentMap[source] || "Tooltip"}>
                      <InfoIcon />
                    </Tooltip>
                  )}
                </div>
                <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
                  {index + 1}
                </span>
              </div>
              {source === "Other" && (
                <div className="mt-2 ml-4">
                  <input
                    type="text"
                    value={otherInformationSourceText}
                    onChange={handleOtherTextChange}
                    maxLength={MAX_CHARS}
                    placeholder="Please specify"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-left px-2 text-sm text-gray-500 mt-1">
                    {MAX_CHARS - (otherInformationSourceText?.length || 0)}{" "}
                    characters remaining
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* --- Render Unranked Items --- */}
          {unranked.map((source) => (
            <div
              key={source}
              onClick={() => handleRankClick(source)}
              className="flex items-center justify-between bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm cursor-pointer border border-gray-300 hover:border-blue-500 transition duration-200 min-w-[300px]"
            >
              <div className="flex items-center">
                <span className="font-medium">{source}</span>
                {source !== "Other" && (
                  <Tooltip content={tooltipContentMap[source] || "Tooltip"}>
                    <InfoIcon />
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Form Actions --- */}
      <div className="flex justify-center space-x-2.5 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-sm min-w-32 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
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
    </form>
  );
};

// Main component with feature flag support
const InformationSources = (props: InformationSourcesProps | OptimizedInformationSourcesProps) => {
  // Check if we should use optimized version
  if (MIGRATION_FLAGS.USE_OPTIMIZED_INFORMATION_SOURCES && 'rankedInformationSourceIds' in props) {
    return <OptimizedInformationSources {...props as OptimizedInformationSourcesProps} />;
  }
  
  // Default to legacy version
  return <LegacyInformationSources {...props as InformationSourcesProps} />;
};

export default InformationSources;
