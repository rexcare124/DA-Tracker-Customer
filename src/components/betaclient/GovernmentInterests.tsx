import React from "react";
import { GovernmentInterestsProps, OptimizedGovernmentInterestsProps } from './types';
import { MIGRATION_FLAGS } from '@/lib/migrationFlags';
import { StaticOptionsService } from '@/lib/staticOptionsService';

// The list of government levels to be ranked
const GOVERNMENT_LEVELS = [
  "State Government",
  "County Government",
  "City Government",
];

// Government level IDs for optimized version
const GOVERNMENT_LEVEL_IDS = {
  "State Government": 1,
  "County Government": 2,
  "City Government": 3,
} as const;

// Reverse mapping for ID to string conversion
const ID_TO_GOVERNMENT_LEVEL = {
  1: "State Government",
  2: "County Government",
  3: "City Government",
} as const;

// Legacy component using string arrays
const LegacyGovernmentInterests = ({
  rankedGovernments,
  setFormData,
  prevStep,
  nextStep,
  showCustomModal,
}: GovernmentInterestsProps) => {
  // --- FIX ---
  // Calculate unranked levels directly instead of using useState and useEffect.
  // This avoids unnecessary re-renders and state synchronization issues.
  const unranked = GOVERNMENT_LEVELS.filter(
    (level) => !rankedGovernments.includes(level)
  );

  // Handles ranking and un-ranking of items
  const handleRankClick = (level: string) => {
    // Check if the item is already ranked
    const isRanked = rankedGovernments.includes(level);

    // Create the new list of ranked governments
    const newRanked = isRanked
      ? rankedGovernments.filter((item) => item !== level) // Un-rank by removing it
      : [...rankedGovernments, level]; // Rank by adding it

    // Update the parent component's state
    setFormData((prev: any) => ({
      ...prev,
      rankedGovernments: newRanked,
    }));
  };

  // Form submission validation
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (unranked.length > 0) {
      showCustomModal("Please rank all government levels to proceed.");
      return;
    }
    if (nextStep) {
      nextStep();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3 className="text-xl font-semibold mb-2 text-gray-700">
        Rank your interests in state and local government based on their
        importance.
      </h3>
      <p className="text-gray-600 mb-6 ">
        Click on each level of government to rank it. All government levels must
        be ranked to proceed.
      </p>
      <div className="flex justify-center">
        <div className="space-y-3 w-max">
          {/* Render Ranked Items */}
          {rankedGovernments.map((level, index) => (
            <div
              key={level} // Using the level as key is fine since it's unique
              onClick={() => handleRankClick(level)}
              className="flex items-center justify-between bg-brand-blue text-white p-3 rounded-lg shadow-md cursor-pointer border border-gray-700 hover:border-blue-500 transition duration-200"
            >
              <span className="font-medium mr-6">{level}</span>
              <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
                {index + 1}
              </span>
            </div>
          ))}

          {/* Render Unranked Items */}
          {unranked.map((level) => (
            <div
              key={level} // Using the level as key is fine
              onClick={() => handleRankClick(level)}
              className="flex items-center justify-between bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm cursor-pointer border border-gray-300 hover:border-blue-500 transition duration-200"
            >
              <span className="font-medium">{level}</span>
            </div>
          ))}
        </div>
      </div>

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

// Optimized component using ID arrays
const OptimizedGovernmentInterests = ({
  rankedGovernmentIds,
  setFormData,
  prevStep,
  nextStep,
  showCustomModal,
}: OptimizedGovernmentInterestsProps) => {
  // Convert IDs to strings for display
  const rankedGovernments = rankedGovernmentIds.map(id => ID_TO_GOVERNMENT_LEVEL[id as keyof typeof ID_TO_GOVERNMENT_LEVEL]).filter(Boolean) as string[];
  
  // Calculate unranked levels
  const unranked = GOVERNMENT_LEVELS.filter(
    (level) => !(rankedGovernments as string[]).includes(level)
  );

  // Handles ranking and un-ranking of items
  const handleRankClick = (level: string) => {
    const levelId = GOVERNMENT_LEVEL_IDS[level as keyof typeof GOVERNMENT_LEVEL_IDS];
    if (!levelId) return;

    // Check if the item is already ranked
    const isRanked = rankedGovernmentIds.includes(levelId);

    // Create the new list of ranked government IDs
    const newRankedIds = isRanked
      ? rankedGovernmentIds.filter((id) => id !== levelId) // Un-rank by removing it
      : [...rankedGovernmentIds, levelId]; // Rank by adding it

    // Update the parent component's state
    setFormData((prev: any) => ({
      ...prev,
      rankedGovernmentIds: newRankedIds,
    }));
  };

  // Form submission validation
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (unranked.length > 0) {
      showCustomModal("Please rank all government levels to proceed.");
      return;
    }
    if (nextStep) {
      nextStep();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3 className="text-xl font-semibold mb-2 text-gray-700">
        Rank your interests in state and local government based on their
        importance.
      </h3>
      <p className="text-gray-600 mb-6 ">
        Click on each level of government to rank it. All government levels must
        be ranked to proceed.
      </p>
      <div className="flex justify-center">
        <div className="space-y-3 w-max">
          {/* Render Ranked Items */}
          {rankedGovernments.map((level, index) => (
            <div
              key={level}
              onClick={() => handleRankClick(level)}
              className="flex items-center justify-between bg-brand-blue text-white p-3 rounded-lg shadow-md cursor-pointer border border-gray-700 hover:border-blue-500 transition duration-200"
            >
              <span className="font-medium mr-6">{level}</span>
              <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
                {index + 1}
              </span>
            </div>
          ))}

          {/* Render Unranked Items */}
          {unranked.map((level) => (
            <div
              key={level}
              onClick={() => handleRankClick(level)}
              className="flex items-center justify-between bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm cursor-pointer border border-gray-300 hover:border-blue-500 transition duration-200"
            >
              <span className="font-medium">{level}</span>
            </div>
          ))}
        </div>
      </div>

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
const GovernmentInterests = (props: GovernmentInterestsProps | OptimizedGovernmentInterestsProps) => {
  // Check if we should use optimized version
  if (MIGRATION_FLAGS.USE_OPTIMIZED_GOVERNMENT_INTERESTS && 'rankedGovernmentIds' in props) {
    return <OptimizedGovernmentInterests {...props as OptimizedGovernmentInterestsProps} />;
  }
  
  // Default to legacy version
  return <LegacyGovernmentInterests {...props as GovernmentInterestsProps} />;
};

export default GovernmentInterests;
