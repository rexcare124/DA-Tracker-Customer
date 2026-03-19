import React, { useState, useEffect } from "react";
import { RankMotivationsProps, OptimizedRankMotivationsProps } from "./types";
import { MIGRATION_FLAGS } from "../../lib/migrationFlags";

// Static ID mappings for data interests (must match DataInterests component)
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
  "-1": "Other",
} as const;

// Legacy component using string arrays
const LegacyRankMotivations = ({
  selectedInterests,
  otherInterestText,
  rankedMotivations,
  setFormData,
  prevStep,
  nextStep,
  showCustomModal,
}: Omit<RankMotivationsProps, "isStepValid">) => {
  const [currentRankedMotivations, setCurrentRankedMotivations] = useState<
    string[]
  >([]);
  const [unrankedMotivations, setUnrankedMotivations] = useState<string[]>([]);

  useEffect(() => {
    const allMotivations = selectedInterests;

    // --- MODIFICATION START ---
    // If there is exactly one motivation and nothing has been ranked yet,
    // we automatically set it as the #1 ranked motivation.
    if (allMotivations.length === 1 && rankedMotivations.length === 0) {
      const singleMotivation = allMotivations[0];
      // Update the parent form data directly.
      setFormData((prevData) => ({
        ...prevData,
        rankedMotivations: [singleMotivation],
      }));
      // The effect will re-run with the updated props, so we can return early
      // to avoid running the logic below with stale data.
      return;
    }
    // --- MODIFICATION END ---

    const unranked = allMotivations.filter(
      (m) => !rankedMotivations.includes(m)
    );

    setCurrentRankedMotivations(rankedMotivations);
    setUnrankedMotivations(unranked);
    // --- MODIFICATION START ---
    // Added setFormData to the dependency array as it's used inside the effect.
  }, [selectedInterests, otherInterestText, rankedMotivations, setFormData]);
  // --- MODIFICATION END ---

  const handleMotivationClick = (motivation: string) => {
    const isAlreadyRanked = currentRankedMotivations.includes(motivation);
    const newRanked = isAlreadyRanked
      ? currentRankedMotivations.filter((m) => m !== motivation)
      : [...currentRankedMotivations, motivation];

    setFormData((prevData) => ({
      ...prevData,
      rankedMotivations: newRanked,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (unrankedMotivations.length > 0) {
      showCustomModal("Please rank all selected motivations to proceed.");
      return;
    }
    if (nextStep) {
      nextStep();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Rank your motivations based on their importance.
      </h3>
      <p className="text-gray-600 mb-6">
        Click on each motivation to rank it. All selected motivations must be
        ranked to proceed.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6  lg:gap-x-7 ">
        {currentRankedMotivations.map((motivation, index) => (
          <div
            key={motivation}
            onClick={() => handleMotivationClick(motivation)}
            className="flex items-center justify-between bg-brand-blue text-white p-3 rounded-lg shadow-md cursor-pointer border border-gray-700 hover:border-blue-500 transition duration-200"
          >
            <span className="font-medium text-sm">
              {motivation === "Other" && otherInterestText ? otherInterestText : motivation}
            </span>
            <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
              {index + 1}
            </span>
          </div>
        ))}

        {unrankedMotivations.map((motivation) => (
          <div
            key={motivation}
            onClick={() => handleMotivationClick(motivation)}
            className="flex items-center justify-between bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm cursor-pointer border border-gray-300 hover:border-blue-500 transition duration-200"
          >
            <span className="font-medium text-sm">
              {motivation === "Other" && otherInterestText ? otherInterestText : motivation}
            </span>
          </div>
        ))}

        {selectedInterests.length === 0 && (
          <p className="text-gray-500 col-span-full">
            No motivations selected in the previous step.
          </p>
        )}
      </div>

      <div className="flex justify-center space-x-2.5  mt-6">
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
    </form>
  );
};

// Optimized component using ID arrays
const OptimizedRankMotivations = ({
  selectedInterestIds,
  otherInterestText,
  rankedMotivationIds,
  setFormData,
  prevStep,
  nextStep,
  showCustomModal,
}: Omit<OptimizedRankMotivationsProps, "isStepValid">) => {
  const [currentRankedMotivationIds, setCurrentRankedMotivationIds] = useState<
    number[]
  >([]);
  const [unrankedMotivationIds, setUnrankedMotivationIds] = useState<number[]>([]);

  useEffect(() => {
    const allMotivationIds = selectedInterestIds.filter(id => id !== undefined);

    // Auto-rank single motivation
    if (allMotivationIds.length === 1 && rankedMotivationIds.length === 0) {
      const singleMotivationId = allMotivationIds[0];
      setFormData((prevData) => ({
        ...prevData,
        rankedMotivationIds: [singleMotivationId],
      }));
      return;
    }

    const unranked = allMotivationIds.filter(
      (id) => !rankedMotivationIds.includes(id)
    );

    setCurrentRankedMotivationIds(rankedMotivationIds);
    setUnrankedMotivationIds(unranked);
  }, [selectedInterestIds, rankedMotivationIds, setFormData]);

  const handleMotivationClick = (motivationId: number) => {
    const isAlreadyRanked = currentRankedMotivationIds.includes(motivationId);
    const newRanked = isAlreadyRanked
      ? currentRankedMotivationIds.filter((id) => id !== motivationId)
      : [...currentRankedMotivationIds, motivationId];

    setFormData((prevData) => ({
      ...prevData,
      rankedMotivationIds: newRanked,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (unrankedMotivationIds.length > 0) {
      showCustomModal(
        "Selection Required",
        "Please rank all selected motivations to proceed."
      );
      return;
    }
    if (nextStep) {
      nextStep();
    }
  };

  const getMotivationDisplayText = (motivationId: number): string => {
    if (motivationId === -1 && otherInterestText) {
      return otherInterestText;
    }
    const motivationString = DATA_INTEREST_STRING_MAP[motivationId];
    if (motivationString === undefined) {
      console.warn(`Unknown motivation ID: ${motivationId}`);
      return `Unknown motivation (ID: ${motivationId})`;
    }
    return motivationString;
  };

  return (
    <form onSubmit={onSubmit}>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Rank your motivations based on their importance.
      </h3>
      <p className="text-gray-600 mb-6">
        Click on each motivation to rank it. All selected motivations must be
        ranked to proceed.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6  lg:gap-x-7 ">
        {currentRankedMotivationIds.map((motivationId, index) => (
          <div
            key={motivationId}
            onClick={() => handleMotivationClick(motivationId)}
            className="flex items-center justify-between bg-brand-blue text-white p-3 rounded-lg shadow-md cursor-pointer border border-gray-700 hover:border-blue-500 transition duration-200"
          >
            <span className="font-medium text-sm">{getMotivationDisplayText(motivationId)}</span>
            <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
              {index + 1}
            </span>
          </div>
        ))}

        {unrankedMotivationIds.map((motivationId) => (
          <div
            key={motivationId}
            onClick={() => handleMotivationClick(motivationId)}
            className="flex items-center justify-between bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm cursor-pointer border border-gray-300 hover:border-blue-500 transition duration-200"
          >
            <span className="font-medium text-sm">{getMotivationDisplayText(motivationId)}</span>
          </div>
        ))}

        {selectedInterestIds.length === 0 && (
          <p className="text-gray-500 col-span-full">
            No motivations selected in the previous step.
          </p>
        )}
      </div>

      <div className="flex justify-center space-x-2.5  mt-6">
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
    </form>
  );
};

// Main component with feature flag switching
const RankMotivations = (props: any) => {
  if (MIGRATION_FLAGS.USE_OPTIMIZED_RANK_MOTIVATIONS && 'selectedInterestIds' in props) {
    return <OptimizedRankMotivations {...props} />;
  }
  return <LegacyRankMotivations {...props} />;
};

export default RankMotivations;
