/**
 * Search Constants
 * 
 * Centralized constants for search functionality, filters, and map configuration.
 * This file eliminates hard-coded values throughout the search components.
 * 
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 * 
 * Reference: `IMPROVEMENT_REPORT.md` lines 414-482
 */

/**
 * Geographic defaults for map and location search
 */
export const GEOGRAPHIC_DEFAULTS = {
  /** Default coordinates (Center of US) */
  DEFAULT_COORDINATES: {
    LATITUDE: 39.8283,
    LONGITUDE: -98.5795,
  } as const,
  /** Default map zoom level */
  DEFAULT_ZOOM: 4,
  /** Default zoom for radius search */
  RADIUS_SEARCH_ZOOM: 10,
  /** Default zoom for general search */
  GENERAL_SEARCH_ZOOM: 6,
  /** Default radius in kilometers */
  DEFAULT_RADIUS_KM: 10,
  /** Maximum radius in kilometers */
  MAX_RADIUS_KM: 100,
  /** Map animation duration in milliseconds */
  MAP_ANIMATION_DURATION_MS: 1000,
} as const;

/**
 * Population filter options and slider configuration
 */
export const POPULATION_FILTERS = {
  /** Population filter dropdown options */
  OPTIONS: [
    { value: 10000, label: "10,000+" },
    { value: 50000, label: "50,000+" },
    { value: 100000, label: "100,000+" },
    { value: 500000, label: "500,000+" },
    { value: 1000000, label: "1,000,000+" },
  ] as const,
  /** Population slider configuration */
  SLIDER: {
    MIN: 0,
    MAX: 10000000, // 10M
    STEP: 1000,
    DEFAULT_MAX: 1000000, // 1M
  } as const,
  /** Population formatting thresholds */
  FORMAT_THRESHOLDS: {
    MILLION: 1000000,
    THOUSAND: 1000,
  } as const,
} as const;

/**
 * Budget filter options and slider configuration
 */
export const BUDGET_FILTERS = {
  /** Budget filter dropdown options */
  OPTIONS: [
    { value: 1000000, label: "$1M+" },
    { value: 10000000, label: "$10M+" },
    { value: 100000000, label: "$100M+" },
    { value: 1000000000, label: "$1B+" },
  ] as const,
  /** Budget slider configuration */
  SLIDER: {
    MIN: 0,
    MAX: 10000000000, // $10B
    STEP: 1000000, // $1M
  } as const,
} as const;

/**
 * Crime rate slider configuration
 */
export const CRIME_RATE_SLIDER = {
  MIN: -50,
  MAX: 50,
  STEP: 1,
} as const;

/**
 * Data quality slider configuration
 */
export const DATA_QUALITY_SLIDER = {
  MIN: 0,
  MAX: 100,
  STEP: 5,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Debounce timing for search inputs and API
 */
export const DEBOUNCE_DELAYS = {
  /** Debounce delay for search query input (ms). Higher to avoid 429 when typing. */
  SEARCH_QUERY_MS: 500,
  /** Debounce delay for location input (ms) */
  LOCATION_MS: 500,
  /** Debounce delay before running search API (ms). Prevents 429 from rapid filter changes. */
  SEARCH_API_MS: 400,
} as const;

/**
 * Map marker configuration
 */
export const MAP_MARKER = {
  /** Marker icon size in pixels */
  ICON_SIZE: 10,
  /** Maximum marker label width in pixels */
  MAX_LABEL_WIDTH: 100,
} as const;

/**
 * Search constants export (for convenience)
 */
export const SEARCH_CONSTANTS = {
  GEOGRAPHIC_DEFAULTS,
  POPULATION_FILTERS,
  BUDGET_FILTERS,
  CRIME_RATE_SLIDER,
  DATA_QUALITY_SLIDER,
  PAGINATION,
  DEBOUNCE_DELAYS,
  MAP_MARKER,
} as const;
