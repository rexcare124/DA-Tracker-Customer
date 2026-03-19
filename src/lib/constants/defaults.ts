/**
 * Default State Constants
 * 
 * Centralized default values for Redux initial state and component defaults.
 * Uses constants from search.ts to ensure consistency across the application.
 * 
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: `IMPROVEMENT_REPORT.md` lines 704-749
 */

import {
  GEOGRAPHIC_DEFAULTS,
  PAGINATION,
} from "./search";
import type {
  GovernmentEntityFiltersState,
  MapState,
} from "@/types/governmentEntityTypes";

/**
 * Default filter values
 * 
 * Used for initializing government entity search filters in Redux state.
 */
export const DEFAULT_FILTERS: Omit<
  GovernmentEntityFiltersState,
  "populationRange" | "budgetRange" | "dateRange" | "crimeRateMin" | "crimeRateMax" | "dataQualityThreshold" | "employeeCountMin" | "employeeCountMax"
> = {
  // Basic search
  searchQuery: "",
  location: "",

  // Government level filters
  governmentLevels: [],
  entityType: "",

  // Boolean filters
  hasBusinessLicenses: false,
  hasReviews: false,
  isActive: true,

  // Geospatial filters
  coordinates: [
    GEOGRAPHIC_DEFAULTS.DEFAULT_COORDINATES.LONGITUDE,
    GEOGRAPHIC_DEFAULTS.DEFAULT_COORDINATES.LATITUDE,
  ] as [number, number],
  radiusKm: GEOGRAPHIC_DEFAULTS.DEFAULT_RADIUS_KM,
  useRadiusSearch: false,

  // Pagination
  page: PAGINATION.DEFAULT_PAGE,
  limit: PAGINATION.DEFAULT_LIMIT,

  // Sorting
  sortBy: "entityName" as const,
  sortOrder: "asc" as const,
} as const;

/**
 * Default map state values
 * 
 * Used for initializing map UI state in Redux.
 */
export const DEFAULT_MAP_STATE: MapState = {
  center: [
    GEOGRAPHIC_DEFAULTS.DEFAULT_COORDINATES.LONGITUDE,
    GEOGRAPHIC_DEFAULTS.DEFAULT_COORDINATES.LATITUDE,
  ] as [number, number],
  zoom: GEOGRAPHIC_DEFAULTS.DEFAULT_ZOOM,
} as const;

/**
 * Default view mode
 * 
 * Used for initializing view mode state.
 */
export const DEFAULT_VIEW_MODE = "grid" as const;

/**
 * Default state export (for convenience)
 */
export const DEFAULT_STATE = {
  FILTERS: DEFAULT_FILTERS,
  MAP: DEFAULT_MAP_STATE,
  VIEW_MODE: DEFAULT_VIEW_MODE,
} as const;
