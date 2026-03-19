// Type-safe interfaces for Government Entity data structures
// Based on the enhanced database schema and API responses

export interface GovernmentEntity {
  id: number;
  entityName: string;
  governmentLevelId: number;
  stateId?: number;
  countyId?: number;
  cityId?: number;
  locationId?: number;
  // Enhanced fields for search functionality
  entityType?: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  // Geospatial coordinates
  latitude?: number;
  longitude?: number;
  // Search and filtering fields
  hasBusinessLicenses: boolean;
  hasReviews: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Related entities
  governmentLevel?: GovernmentLevel;
  state?: State;
  county?: County;
  city?: City;
  location?: Location;
}

// Extended type with all relations for detailed views
export interface GovernmentEntityWithRelations extends GovernmentEntity {
  governmentLevel: GovernmentLevel;
  state?: State;
  county?: County;
  city?: City;
  location?: Location;
}

// API response type for government entity search
export interface GovernmentEntityResponse {
  entities: GovernmentEntityWithRelations[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GovernmentLevel {
  id: number;
  levelName: string;
  hierarchyOrder: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  id: number;
  stateName: string;
  abbreviation: string;
  population?: number;
  createdAt: string;
  updatedAt: string;
}

export interface County {
  id: number;
  countyName: string;
  population?: number;
  stateId: number;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: number;
  cityName: string;
  population?: number;
  countyId: number;
  /** Graduation rate (0–100), from latest graduation_data when present */
  graduationRate?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: number;
  streetAddress1: string;
  streetAddress2?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

// Search and filter interfaces
export interface SearchFilters {
  // Basic filters
  location?: string;
  governmentLevels?: string[];
  entityType?: string;
  hasBusinessLicenses?: boolean;
  hasReviews?: boolean;
  isActive?: boolean;
  
  // Geospatial filters
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  
  // Bounding box filters
  bounds?: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  };
  
  // Population and date filters
  populationMin?: number | null;
  populationMax?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  
  // Pagination
  page?: number;
  limit?: number;
  
  // Sorting
  sortBy?: 'entityName' | 'createdAt' | 'governmentLevelId';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  entities: GovernmentEntityWithRelations[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: SearchFilters;
}

export interface GovernmentEntityStats {
  totalEntities: number;
  entitiesByLevel: Array<{
    governmentLevelId: number;
    _count: { id: number };
    governmentLevel?: GovernmentLevel;
  }>;
  entitiesByState: Array<{
    stateId: number;
    _count: { id: number };
    state?: State;
  }>;
}

// API Error types
export interface ApiError {
  message: string;
  code: string;
  requestId?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Form validation types
export interface SearchFormData {
  location: string;
  governmentLevels: string[];
  entityType: string;
  hasBusinessLicenses: boolean;
  hasReviews: boolean;
  populationMin: string;
  populationMax: string;
  dateFrom: string;
  dateTo: string;
}

// Map and UI state types
export interface MapState {
  center: [number, number]; // [lng, lat]
  zoom: number;
  bounds?: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  };
}

export interface ViewMode {
  type: 'grid' | 'list';
}

export interface FilterPanelState {
  isOpen: boolean;
  activeFilters: string[];
}

// Constants for validation
export const GOVERNMENT_LEVELS = {
  FEDERAL: 1,
  STATE: 2,
  COUNTY: 3,
  CITY: 4,
  MUNICIPAL: 5
} as const;

export const ENTITY_TYPES = [
  'department',
  'agency',
  'office',
  'bureau',
  'commission',
  'board',
  'authority',
  'district'
] as const;

export const SORT_OPTIONS = [
  { value: 'entityName', label: 'Name' },
  { value: 'createdAt', label: 'Date Created' },
  { value: 'governmentLevelId', label: 'Government Level' }
] as const;

export const SORT_ORDERS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' }
] as const;

// Enhanced state management types
export interface GovernmentEntityFiltersState extends SearchFilters {
  // Basic search
  searchQuery: string;
  location: string;
  
  // Government level filters
  governmentLevels: string[];
  entityType: string;
  
  // Boolean filters
  hasBusinessLicenses: boolean;
  hasReviews: boolean;
  isActive: boolean;
  
  // Geospatial filters
  coordinates: [number, number] | [null, null]; // [lng, lat] or [null, null]
  radiusKm: number;
  useRadiusSearch: boolean;
  
  // Population filters
  populationRange: [number, number] | [null, null];
  
  // Budget filters
  budgetRange: [number, number] | [null, null];
  
  // Crime rate filters
  crimeRateMin: number | null;
  crimeRateMax: number | null;
  
  // Data quality filter
  dataQualityThreshold: number | null;
  
  // Employee count filters
  employeeCountMin: number | null;
  employeeCountMax: number | null;
  
  // Date filters
  dateRange: [string, string] | [null, null];
  
  // Pagination
  page: number;
  limit: number;
  
  // Sorting
  sortBy: 'entityName' | 'createdAt' | 'governmentLevelId';
  sortOrder: 'asc' | 'desc';
}

export interface MapUIState {
  mapState: MapState;
  selectedEntityId: number | null;
  hoveredEntityId: number | null;
  showPopup: boolean;
}

export interface SearchState {
  isSearching: boolean;
  lastSearchTimestamp: number | null;
  searchResults: GovernmentEntityWithRelations[];
  totalResults: number;
  hasMore: boolean;
}

// Utility types for API responses
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResult<T> {
  entities: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: SearchFilters;
  searchMetadata: {
    searchTime: number;
    queryId: string;
    cached: boolean;
  };
}

// Type guards for runtime type checking
export function isGovernmentEntity(obj: unknown): obj is GovernmentEntity {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as GovernmentEntity).id === 'number' &&
    typeof (obj as GovernmentEntity).entityName === 'string' &&
    typeof (obj as GovernmentEntity).governmentLevelId === 'number'
  );
}

export function isSearchResponse(obj: unknown): obj is SearchResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray((obj as SearchResponse).entities) &&
    typeof (obj as SearchResponse).pagination === 'object'
  );
}

export function isApiError(obj: unknown): obj is ApiError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as ApiError).message === 'string' &&
    typeof (obj as ApiError).code === 'string'
  );
}

export function isGovernmentEntityFiltersState(obj: unknown): obj is GovernmentEntityFiltersState {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as GovernmentEntityFiltersState).searchQuery === 'string' &&
    typeof (obj as GovernmentEntityFiltersState).location === 'string' &&
    Array.isArray((obj as GovernmentEntityFiltersState).governmentLevels)
  );
}

export function isMapUIState(obj: unknown): obj is MapUIState {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as MapUIState).mapState === 'object' &&
    (typeof (obj as MapUIState).selectedEntityId === 'number' || (obj as MapUIState).selectedEntityId === null)
  );
}