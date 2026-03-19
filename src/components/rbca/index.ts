// RBCA Components - Centralized exports for all RBCA frontend components
// This file provides a single import point for all RBCA-related components

// Core Provider and Context
export { RBCAProvider, useRBCAContext } from './RBCAProvider';

// API Client
export { RBCAApiClient } from './RBCAApiClient';

// UI Components
export { RBCAStatusBadge } from './RBCAStatusBadge';
export { RBCADataTable } from './RBCADataTable';
export { 
  RBCAStatsCards, 
  RBCABusinessTypeChart, 
  RBCAMonthlyTrend 
} from './RBCAStatsCards';
export { 
  RBCAExportButton, 
  RBCASimpleExportButton 
} from './RBCAExportButton';

// Loading and Error Components
export { 
  RBCALoadingSpinner,
  RBCAButtonSpinner,
  RBCARegistrationSkeleton,
  RBCAStatsSkeleton,
  RBCATableSkeleton
} from './RBCALoadingSpinner';
export { 
  RBCAErrorBoundary, 
  withRBCAErrorBoundary 
} from './RBCAErrorBoundary';

// Re-export types for convenience
export type { RBCAProviderProps, RBCAContextValue as RBCAContextType } from './RBCAProvider';
export type { RBCAStatusBadgeProps } from './RBCAStatusBadge';
export type { RBCADataTableProps } from './RBCADataTable';
export type { 
  RBCAStatsCardsProps, 
  RBCABusinessTypeChartProps, 
  RBCAMonthlyTrendProps 
} from './RBCAStatsCards';
export type { 
  RBCAExportButtonProps, 
  RBCASimpleExportButtonProps, 
  ExportFilters 
} from './RBCAExportButton';
export type { 
  RBCALoadingSpinnerProps, 
  RBCAButtonSpinnerProps 
} from './RBCALoadingSpinner';
export type { 
  RBCAErrorBoundaryProps, 
  RBCAErrorBoundaryState 
} from './RBCAErrorBoundary';
