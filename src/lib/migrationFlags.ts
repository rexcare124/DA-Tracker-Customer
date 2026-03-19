// Migration feature flags for Phase 4A implementation
// Allows gradual rollout and instant rollback capability

export const MIGRATION_FLAGS = {
  // Master flag to enable/disable optimized interfaces
  USE_OPTIMIZED_INTERFACES: process.env.NEXT_PUBLIC_USE_OPTIMIZED_INTERFACES === 'true',
  
  // Component-level flags for granular control
  USE_OPTIMIZED_GOVERNMENT_INTERESTS: process.env.NEXT_PUBLIC_USE_OPTIMIZED_GOVERNMENT_INTERESTS === 'true',
  USE_OPTIMIZED_INFORMATION_SOURCES: process.env.NEXT_PUBLIC_USE_OPTIMIZED_INFORMATION_SOURCES === 'true',
  USE_OPTIMIZED_DATA_INTERESTS: process.env.NEXT_PUBLIC_USE_OPTIMIZED_DATA_INTERESTS === 'true',
  USE_OPTIMIZED_RANK_MOTIVATIONS: process.env.NEXT_PUBLIC_USE_OPTIMIZED_RANK_MOTIVATIONS === 'true',
  USE_OPTIMIZED_REGISTRATION_PAGE: process.env.NEXT_PUBLIC_USE_OPTIMIZED_REGISTRATION_PAGE === 'true',
} as const;

// Helper function to check if any optimization is enabled
export const isAnyOptimizationEnabled = (): boolean => {
  return Object.values(MIGRATION_FLAGS).some(flag => flag === true);
};

// Helper function to get migration status for debugging
export const getMigrationStatus = () => {
  return {
    masterFlag: MIGRATION_FLAGS.USE_OPTIMIZED_INTERFACES,
    componentFlags: {
      dataInterests: MIGRATION_FLAGS.USE_OPTIMIZED_DATA_INTERESTS,
      rankMotivations: MIGRATION_FLAGS.USE_OPTIMIZED_RANK_MOTIVATIONS,
      governmentInterests: MIGRATION_FLAGS.USE_OPTIMIZED_GOVERNMENT_INTERESTS,
      informationSources: MIGRATION_FLAGS.USE_OPTIMIZED_INFORMATION_SOURCES,
      registrationPage: MIGRATION_FLAGS.USE_OPTIMIZED_REGISTRATION_PAGE,
    },
    anyEnabled: isAnyOptimizationEnabled(),
  };
};
