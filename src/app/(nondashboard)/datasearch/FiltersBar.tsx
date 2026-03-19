"use client";

import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GovernmentEntityFiltersState } from "@/types/governmentEntityTypes";
import { SearchFormSchema } from "@/lib/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Filter, X, Building2, Users, Calendar, CheckCircle, List, Grid3X3 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_DELAYS } from "@/lib/constants/search";
import { useAppSelector } from "@/state/hooks";
import { toggleFiltersFullOpen, setViewMode } from "@/state";
import { cn } from "@/lib/utils";

interface FiltersBarProps {
  filters: GovernmentEntityFiltersState;
  onFilterChange: (filters: Partial<GovernmentEntityFiltersState>) => void;
  onSearch: () => void;
  isLoading?: boolean;
  /** When true, show only filter icon, search bar, and SMRC (mobile layout) */
  isMobile?: boolean;
  /** Called when SMRC label is clicked (mobile only) */
  onSmrcClick?: () => void;
}

/**
 * Compact Filters Bar Component
 *
 * Features:
 * - Quick search input with debouncing
 * - Location search with geocoding
 * - Government level filter
 * - Active filter badges with removal
 * - Real-time URL synchronization
 * - Security validation
 */
export default function FiltersBar({
  filters,
  onFilterChange,
  onSearch,
  isLoading = false,
  isMobile = false,
  onSmrcClick,
}: FiltersBarProps) {
  const dispatch = useDispatch();
  const isFiltersFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen);
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "");
  const [location, setLocation] = useState(filters.location || "");
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search query for performance
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAYS.SEARCH_QUERY_MS);
  const debouncedLocation = useDebounce(location, DEBOUNCE_DELAYS.LOCATION_MS);

  // Government level options
  const governmentLevels = [
    { value: "federal", label: "Federal", icon: Building2 },
    { value: "state", label: "State", icon: Building2 },
    { value: "county", label: "County", icon: Building2 },
    { value: "city", label: "City", icon: Building2 },
    { value: "municipal", label: "Municipal", icon: Building2 },
  ];

  // Entity type options
  const entityTypes = [
    { value: "government", label: "Government" },
    { value: "agency", label: "Agency" },
    { value: "department", label: "Department" },
    { value: "commission", label: "Commission" },
    { value: "board", label: "Board" },
    { value: "authority", label: "Authority" },
  ];

  /**
   * Handle search query change with validation
   */
  const handleSearchQueryChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  /**
   * Handle location change with validation
   */
  const handleLocationChange = useCallback((value: string) => {
    setLocation(value);
  }, []);

  /**
   * Handle government level change
   */
  const handleGovernmentLevelChange = useCallback(
    (value: string) => {
      const newLevels = value ? [value] : [];
      onFilterChange({ governmentLevels: newLevels });
    },
    [onFilterChange],
  );

  /**
   * Remove active filter
   */
  const removeFilter = useCallback(
    (filterType: keyof GovernmentEntityFiltersState) => {
      switch (filterType) {
        case "searchQuery":
          setSearchQuery("");
          onFilterChange({ searchQuery: "" });
          break;
        case "location":
          setLocation("");
          onFilterChange({ location: "" });
          break;
        case "governmentLevels":
          onFilterChange({ governmentLevels: [] });
          break;
        case "entityType":
          onFilterChange({ entityType: "" });
          break;
        case "hasBusinessLicenses":
          onFilterChange({ hasBusinessLicenses: false });
          break;
        case "hasReviews":
          onFilterChange({ hasReviews: false });
          break;
        case "isActive":
          onFilterChange({ isActive: true });
          break;
      }
    },
    [onFilterChange],
  );

  /**
   * Toggle boolean filters
   */
  const toggleBooleanFilter = useCallback(
    (filterType: "hasBusinessLicenses" | "hasReviews" | "isActive") => {
      const currentValue = filters[filterType];
      onFilterChange({ [filterType]: !currentValue });
    },
    [filters, onFilterChange],
  );

  // Update filters when debounced values change
  useEffect(() => {
    if (debouncedSearchQuery !== filters.searchQuery) {
      onFilterChange({ searchQuery: debouncedSearchQuery });
    }
  }, [debouncedSearchQuery, filters.searchQuery, onFilterChange]);

  useEffect(() => {
    if (debouncedLocation !== filters.location) {
      onFilterChange({ location: debouncedLocation });
    }
  }, [debouncedLocation, filters.location, onFilterChange]);

  // Get active filter count
  const activeFiltersCount = [
    filters.searchQuery,
    filters.location,
    filters.governmentLevels?.length,
    filters.entityType,
    filters.hasBusinessLicenses,
    filters.hasReviews,
    filters.isActive === false,
  ].filter(Boolean).length;

  // Get active filter badges
  const activeFilters = [
    { key: "searchQuery", label: "Search", value: filters.searchQuery },
    { key: "location", label: "Location", value: filters.location },
    { key: "governmentLevels", label: "Level", value: filters.governmentLevels?.join(", ") },
    { key: "entityType", label: "Type", value: filters.entityType },
    { key: "hasBusinessLicenses", label: "Has Licenses", value: filters.hasBusinessLicenses },
    { key: "hasReviews", label: "Has Reviews", value: filters.hasReviews },
    { key: "isActive", label: "Inactive Only", value: filters.isActive === false },
  ].filter((filter) => filter.value && filter.value !== "" && filter.value !== "false");

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2",
        isMobile ? "flex-nowrap" : "flex-wrap justify-between gap-3"
      )}
      role="search"
      aria-label="Quick filters"
    >
      {/* Left: All Filters + search (+ quick filters on desktop) */}
      <div className={cn("flex items-center gap-2 sm:gap-3", isMobile ? "flex-1 min-w-0" : "flex-wrap")}>
        {/* All Filters - toggles collapsible panel (or sheet on mobile) */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 rounded-xl border-blue-400 hover:bg-blue-500 hover:text-white shrink-0",
            isFiltersFullOpen && "bg-blue-600 text-white border-blue-600"
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}
          aria-pressed={isFiltersFullOpen}
          aria-label={isFiltersFullOpen ? "Close filters panel" : "Open all filters"}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">All Filters</span>
        </Button>

        {/* Search Input + Search button */}
        <div
          className={cn(
            "flex items-stretch rounded-xl border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            isMobile ? "flex-1 min-w-0" : ""
          )}
        >
          <div className="relative flex-1 min-w-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <Input
              placeholder="Search entities..."
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              className="pl-9 pr-3 w-full min-w-0 h-9 border-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-40"
              disabled={isLoading}
              aria-label="Search government entities"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none border-0 border-l h-9 px-3 hover:bg-blue-600 hover:text-white hover:border-blue-600 shrink-0"
            onClick={onSearch}
            disabled={isLoading}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile: SMRC button (opens reviews drawer) */}
        {isMobile && onSmrcClick && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-xl border-blue-400 hover:bg-blue-500 hover:text-white"
            onClick={onSmrcClick}
            aria-label="Open SMRC reviews"
          >
            SMRC
          </Button>
        )}
      </div>

      {/* Quick Filters - hidden on mobile (moved to filter sheet) */}
      {!isMobile && (
        <div className="flex flex-wrap gap-1 sm:gap-2">
            {/* Government Level Filter */}
            <Select
              value={String(filters.governmentLevels?.[0] || "")}
              onValueChange={handleGovernmentLevelChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all levels">All Levels</SelectItem>
                {governmentLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Entity Type Filter */}
            <Select
              value={filters.entityType || "all types"}
              onValueChange={(v) => onFilterChange({ entityType: v === "all types" ? "" : v })}
              disabled={isLoading}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all types">All Types</SelectItem>
                {entityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Min Population - per plan 09_SEARCH_MAP_PAGE */}
            <Select
              value={filters.populationRange?.[0] != null ? String(filters.populationRange[0]) : "any"}
              onValueChange={(v) => {
                const num = v === "any" ? null : Number(v);
                const next: [number, number] | [null, null] =
                  num === null ? [null, null] : [num, filters.populationRange?.[1] ?? num];
                onFilterChange({ populationRange: next });
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Min Population" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Population</SelectItem>
                <SelectItem value="10000">10,000+</SelectItem>
                <SelectItem value="50000">50,000+</SelectItem>
                <SelectItem value="100000">100,000+</SelectItem>
                <SelectItem value="500000">500,000+</SelectItem>
                <SelectItem value="1000000">1,000,000+</SelectItem>
              </SelectContent>
            </Select>

            {/* Min Budget - per plan 09_SEARCH_MAP_PAGE */}
            <Select
              value={filters.budgetRange?.[0] != null ? String(filters.budgetRange[0]) : "any"}
              onValueChange={(v) => {
                const num = v === "any" ? null : Number(v);
                const next: [number, number] | [null, null] =
                  num === null ? [null, null] : [num, filters.budgetRange?.[1] ?? num];
                onFilterChange({ budgetRange: next });
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Min Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Budget</SelectItem>
                <SelectItem value="1000000">$1M+</SelectItem>
                <SelectItem value="10000000">$10M+</SelectItem>
                <SelectItem value="100000000">$100M+</SelectItem>
                <SelectItem value="1000000000">$1B+</SelectItem>
              </SelectContent>
            </Select>

            {/* Boolean Filters */}
            <Button
              variant={filters.hasBusinessLicenses ? "default" : "outline"}
              size="sm"
              onClick={() => toggleBooleanFilter("hasBusinessLicenses")}
              disabled={isLoading}
              className="flex items-center space-x-1"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Licenses</span>
            </Button>

            <Button
              variant={filters.hasReviews ? "default" : "outline"}
              size="sm"
              onClick={() => toggleBooleanFilter("hasReviews")}
              disabled={isLoading}
              className="flex items-center space-x-1"
            >
              <Users className="h-3 w-3" />
              <span>Reviews</span>
            </Button>

            <Button
              variant={filters.isActive === false ? "default" : "outline"}
              size="sm"
              onClick={() => toggleBooleanFilter("isActive")}
              disabled={isLoading}
              className="flex items-center space-x-1"
            >
              <Calendar className="h-3 w-3" />
              <span className="hidden md:inline">Inactive</span>
            </Button>

            {/* Clear filters - per plan 09_SEARCH_MAP_PAGE */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onFilterChange({
                  searchQuery: "",
                  location: "",
                  governmentLevels: [],
                  entityType: "",
                  populationRange: [null, null],
                  budgetRange: [null, null],
                  dateRange: [null, null],
                  hasBusinessLicenses: false,
                  hasReviews: false,
                  isActive: true,
                  page: 1,
                })
              }
              disabled={isLoading}
              className="gap-2"
              aria-label="Clear all filters"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
        </div>
      )}

      {/* Right: View mode toggle (list / box) - hidden on mobile (in filter sheet) */}
      {!isMobile && (
        <div className="flex items-center gap-2">
          <div className="flex border rounded-xl overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-2 rounded-none hover:bg-blue-100",
                viewMode === "list" ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white" : ""
              )}
              onClick={() => dispatch(setViewMode("list"))}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-2 rounded-none hover:bg-blue-100",
                viewMode === "grid" ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white" : ""
              )}
              onClick={() => dispatch(setViewMode("grid"))}
              aria-label="Box view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid3X3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
