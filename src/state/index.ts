import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";
import { SearchFilters, MapState } from "@/types/governmentEntityTypes";
import { api } from "./api";
import {
  type MembershipState,
  type Subscription,
  getFeaturesForTier,
} from "@/types/subscription";
import { DEFAULT_FILTERS, DEFAULT_MAP_STATE, DEFAULT_VIEW_MODE } from "@/lib/constants/defaults";

// Government Entity Search Filters State
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

// Map and UI State
export interface MapUIState {
  mapState: MapState;
  selectedEntityId: number | null;
  hoveredEntityId: number | null;
  showPopup: boolean;
}

// Global Application State
interface InitialStateTypes {
  // Government entity search filters
  governmentEntityFilters: GovernmentEntityFiltersState;
  
  // Map and UI state
  mapUI: MapUIState;
  
  // UI controls
  isFiltersFullOpen: boolean;
  viewMode: "grid" | "list";
  
  // Search state
  isSearching: boolean;
  lastSearchTimestamp: number | null;

  /** One-time prefill for SMRC form (state/city from map selection). Cleared after form applies it. */
  smrcFormPrefill: { state: string | null; city: string | null };
}

export const initialState: InitialStateTypes = {
  governmentEntityFilters: {
    // Use default filters from constants
    ...DEFAULT_FILTERS,
    
    // Population filters (not in DEFAULT_FILTERS)
    populationRange: [null, null],
    
    // Budget filters (not in DEFAULT_FILTERS)
    budgetRange: [null, null],
    
    // Crime rate filters (not in DEFAULT_FILTERS)
    crimeRateMin: null,
    crimeRateMax: null,
    
    // Data quality filter (not in DEFAULT_FILTERS)
    dataQualityThreshold: null,
    
    // Employee count filters (not in DEFAULT_FILTERS)
    employeeCountMin: null,
    employeeCountMax: null,
    
    // Date filters (not in DEFAULT_FILTERS)
    dateRange: [null, null],
  },
  
  mapUI: {
    mapState: DEFAULT_MAP_STATE,
    selectedEntityId: null,
    hoveredEntityId: null,
    showPopup: false,
  },
  
  // UI controls
  isFiltersFullOpen: false,
  viewMode: DEFAULT_VIEW_MODE,
  
  // Search state
  isSearching: false,
  lastSearchTimestamp: null,

  smrcFormPrefill: { state: null, city: null },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // Government Entity Search Filters
    setGovernmentEntityFilters: (state, action: PayloadAction<Partial<GovernmentEntityFiltersState>>) => {
      state.governmentEntityFilters = { ...state.governmentEntityFilters, ...action.payload };
      // Reset pagination when filters change
      if (action.payload.page === undefined) {
        state.governmentEntityFilters.page = 1;
      }
      // Update search timestamp
      state.lastSearchTimestamp = Date.now();
    },
    
    resetGovernmentEntityFilters: (state) => {
      state.governmentEntityFilters = initialState.governmentEntityFilters;
      state.lastSearchTimestamp = Date.now();
    },
    
    // Map and UI State
    setMapState: (state, action: PayloadAction<Partial<MapState>>) => {
      state.mapUI.mapState = { ...state.mapUI.mapState, ...action.payload };
    },
    
    setSelectedEntity: (state, action: PayloadAction<number | null>) => {
      state.mapUI.selectedEntityId = action.payload;
      state.mapUI.showPopup = action.payload !== null;
    },
    
    setHoveredEntity: (state, action: PayloadAction<number | null>) => {
      state.mapUI.hoveredEntityId = action.payload;
    },
    
    togglePopup: (state) => {
      state.mapUI.showPopup = !state.mapUI.showPopup;
    },
    
    // UI Controls
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    
    // Search State
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    
    // Pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.governmentEntityFilters.page = action.payload;
    },
    
    setLimit: (state, action: PayloadAction<number>) => {
      state.governmentEntityFilters.limit = action.payload;
      state.governmentEntityFilters.page = 1; // Reset to first page when limit changes
    },
    
    // Sorting
    setSorting: (state, action: PayloadAction<{ sortBy: 'entityName' | 'createdAt' | 'governmentLevelId'; sortOrder: 'asc' | 'desc' }>) => {
      state.governmentEntityFilters.sortBy = action.payload.sortBy;
      state.governmentEntityFilters.sortOrder = action.payload.sortOrder;
      state.governmentEntityFilters.page = 1; // Reset to first page when sorting changes
    },
    
    // Geospatial Search
    setLocationSearch: (state, action: PayloadAction<{ location: string; coordinates: [number, number]; radiusKm?: number }>) => {
      state.governmentEntityFilters.location = action.payload.location;
      state.governmentEntityFilters.coordinates = action.payload.coordinates;
      if (action.payload.radiusKm !== undefined) {
        state.governmentEntityFilters.radiusKm = action.payload.radiusKm;
      }
      state.governmentEntityFilters.page = 1;
      state.lastSearchTimestamp = Date.now();
    },
    
    toggleRadiusSearch: (state) => {
      state.governmentEntityFilters.useRadiusSearch = !state.governmentEntityFilters.useRadiusSearch;
      state.lastSearchTimestamp = Date.now();
    },

    setSmrcFormPrefill: (state, action: PayloadAction<{ state: string | null; city: string | null }>) => {
      state.smrcFormPrefill = action.payload;
    },

    clearSmrcFormPrefill: (state) => {
      state.smrcFormPrefill = { state: null, city: null };
    },
  },
});

export const {
  setGovernmentEntityFilters,
  resetGovernmentEntityFilters,
  setMapState,
  setSelectedEntity,
  setHoveredEntity,
  togglePopup,
  toggleFiltersFullOpen,
  setViewMode,
  setSearching,
  setPage,
  setLimit,
  setSorting,
  setLocationSearch,
  toggleRadiusSearch,
  setSmrcFormPrefill,
  clearSmrcFormPrefill,
} = globalSlice.actions;

export default globalSlice.reducer;

// Membership State Slice
const initialMembershipState: MembershipState = {
  isLoading: true,
  membershipLevel: null,
  membershipTier: 0,
  hasActiveSubscription: false,
  features: [],
  subscription: null,
};

export const membershipSlice = createSlice({
  name: "membership",
  initialState: initialMembershipState,
  reducers: {
    setMembership: (state, action: PayloadAction<Subscription | null>) => {
      const subscription = action.payload;
      state.subscription = subscription;
      state.membershipLevel = subscription?.membershipLevel ?? null;
      state.membershipTier = subscription?.membershipTier ?? 0;
      state.hasActiveSubscription = (subscription?.status === "active") || false;
      state.features = subscription
        ? [...getFeaturesForTier(subscription.membershipTier)]
        : [];
      state.isLoading = false;
    },
    clearMembership: (state) => {
      state.subscription = null;
      state.membershipLevel = null;
      state.membershipTier = 0;
      state.hasActiveSubscription = false;
      state.features = [];
      state.isLoading = false;
    },
    setMembershipLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setMembership, clearMembership, setMembershipLoading } =
  membershipSlice.actions;

export const membershipReducer = membershipSlice.reducer;

// Configure the store
export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
    membership: membershipSlice.reducer,
    api: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Export types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
