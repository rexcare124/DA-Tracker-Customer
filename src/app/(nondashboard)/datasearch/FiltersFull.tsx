"use client";

import { useState, useCallback, useEffect } from "react";
import { GovernmentEntityFiltersState } from "@/types/governmentEntityTypes";
import { FilterValue } from "@/types/search";
import { SearchFormSchema } from "@/lib/validationSchemas";
import { useAppSelector } from "@/state/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Building2,
  Users,
  Calendar,
  Filter,
  Search,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  GEOGRAPHIC_DEFAULTS,
  POPULATION_FILTERS,
  BUDGET_FILTERS,
  CRIME_RATE_SLIDER,
  DATA_QUALITY_SLIDER,
  DEBOUNCE_DELAYS,
} from "@/lib/constants/search";

interface FiltersFullProps {
  filters: GovernmentEntityFiltersState;
  onFilterChange: (filters: Partial<GovernmentEntityFiltersState>) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

/**
 * Full Filters Panel Component
 *
 * Features:
 * - Comprehensive filter options
 * - Population range slider
 * - Date range picker
 * - Geospatial search options
 * - Mapbox geocoding integration
 * - Local state management with Apply/Reset
 * - Security validation
 */
export default function FiltersFull({
  filters,
  onFilterChange,
  onSearch,
  isLoading = false,
}: FiltersFullProps) {
  const isFiltersFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen);

  // Local state for form inputs
  const [localFilters, setLocalFilters] = useState<Partial<GovernmentEntityFiltersState>>({
    searchQuery: filters.searchQuery || "",
    location: filters.location || "",
    governmentLevels: filters.governmentLevels || [],
    entityType: filters.entityType || "",
    hasBusinessLicenses: filters.hasBusinessLicenses || false,
    hasReviews: filters.hasReviews || false,
    isActive: filters.isActive ?? true,
    populationMin: filters.populationMin ?? null,
    populationMax: filters.populationMax ?? null,
    budgetRange: filters.budgetRange ?? [null, null],
    crimeRateMin: filters.crimeRateMin ?? null,
    crimeRateMax: filters.crimeRateMax ?? null,
    dataQualityThreshold: filters.dataQualityThreshold ?? null,
    employeeCountMin: filters.employeeCountMin ?? null,
    employeeCountMax: filters.employeeCountMax ?? null,
    dateFrom: filters.dateFrom ?? null,
    dateTo: filters.dateTo ?? null,
    radiusKm: filters.radiusKm || 10,
    useRadiusSearch: filters.useRadiusSearch || false,
    sortBy: filters.sortBy || "entityName",
    sortOrder: filters.sortOrder || "asc",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [announcement, setAnnouncement] = useState<string>("");

  /**
   * Announce changes to screen readers
   */
  const announceToScreenReader = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear announcement after screen reader has time to read it
    setTimeout(() => setAnnouncement(""), 1000);
  }, []);

  // Debounced location for geocoding
  const debouncedLocation = useDebounce(localFilters.location || "", DEBOUNCE_DELAYS.LOCATION_MS);

  // Government level options
  const governmentLevels: Array<{ value: string; label: string; description: string }> = [
    { value: "federal", label: "Federal", description: "Federal government entities" },
    { value: "state", label: "State", description: "State government entities" },
    { value: "county", label: "County", description: "County government entities" },
    { value: "city", label: "City", description: "City government entities" },
    { value: "municipal", label: "Municipal", description: "Municipal government entities" },
  ];

  // Entity type options
  const entityTypes: Array<{ value: string; label: string; description: string }> = [
    { value: "government", label: "Government", description: "General government entities" },
    { value: "agency", label: "Agency", description: "Government agencies" },
    { value: "department", label: "Department", description: "Government departments" },
    { value: "commission", label: "Commission", description: "Government commissions" },
    { value: "board", label: "Board", description: "Government boards" },
    { value: "authority", label: "Authority", description: "Government authorities" },
  ];

  // Sort options – must match backend enum: entityName | createdAt | governmentLevelId
  const sortOptions = [
    { value: "entityName", label: "Name" },
    { value: "createdAt", label: "Date Created" },
    { value: "governmentLevelId", label: "Government Level" },
  ];

  /**
   * Handle input change with local state update
   */
  const handleInputChange = useCallback(
    (field: keyof GovernmentEntityFiltersState, value: FilterValue) => {
      setLocalFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
      setHasUnsavedChanges(true);
    },
    [],
  );

  /**
   * Handle government level checkbox change
   */
  const handleGovernmentLevelChange = useCallback((level: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const currentLevels = prev.governmentLevels || [];
      const newLevels = checked
        ? [...currentLevels, level]
        : currentLevels.filter((l) => l !== level);

      return {
        ...prev,
        governmentLevels: newLevels,
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Handle population range change
   */
  const handlePopulationRangeChange = useCallback((values: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      populationMin: values[0] || null,
      populationMax: values[1] || null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Handle budget range change
   */
  const handleBudgetRangeChange = useCallback((values: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      budgetRange: [values[0] || null, values[1] || null] as [number, number] | [null, null],
    }));
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Handle crime rate range change
   */
  const handleCrimeRateRangeChange = useCallback((values: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      crimeRateMin: values[0] ?? null,
      crimeRateMax: values[1] ?? null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Handle data quality threshold change
   */
  const handleDataQualityChange = useCallback((values: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      dataQualityThreshold: values[0] ?? null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Handle employee count range change
   */
  const handleEmployeeCountRangeChange = useCallback((values: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      employeeCountMin: values[0] || null,
      employeeCountMax: values[1] || null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Apply local filters to global state.
   * Normalize to Redux shape: populationRange and dateRange so the search API receives correct params.
   */
  const applyFilters = useCallback(() => {
    const populationMin = localFilters.populationMin ?? null;
    const populationMax = localFilters.populationMax ?? null;
    let dateFrom = localFilters.dateFrom ?? null;
    let dateTo = localFilters.dateTo ?? null;
    // Ensure From <= To so backend doesn't return 400
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      [dateFrom, dateTo] = [dateTo, dateFrom];
      setLocalFilters((prev) => ({ ...prev, dateFrom, dateTo }));
    }
    const populationRange: [number, number] | [null, null] =
      populationMin != null && populationMax != null ? [populationMin, populationMax] : [null, null];
    const dateRange: [string, string] | [null, null] =
      dateFrom && dateTo ? [dateFrom, dateTo] : [null, null];
    onFilterChange({
      ...localFilters,
      dateFrom,
      dateTo,
      populationRange,
      dateRange,
    });
    setHasUnsavedChanges(false);
    announceToScreenReader("Filters applied successfully");
  }, [localFilters, onFilterChange, announceToScreenReader]);

  /**
   * Handle keyboard navigation for filters
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Ctrl+Enter applies filters
      if (e.key === "Enter" && e.ctrlKey && hasUnsavedChanges) {
        e.preventDefault();
        applyFilters();
      }
    },
    [hasUnsavedChanges, applyFilters],
  );

  /**
   * Reset filters to default values.
   * Use populationRange and dateRange so Redux and API stay in sync.
   */
  const resetFilters = useCallback(() => {
    const defaultFilters: Partial<GovernmentEntityFiltersState> = {
      searchQuery: "",
      location: "",
      governmentLevels: [],
      entityType: "",
      hasBusinessLicenses: false,
      hasReviews: false,
      isActive: true,
      populationRange: [null, null],
      budgetRange: [null, null],
      crimeRateMin: null,
      crimeRateMax: null,
      dataQualityThreshold: null,
      employeeCountMin: null,
      employeeCountMax: null,
      dateRange: [null, null],
      radiusKm: 10,
      useRadiusSearch: false,
      sortBy: "entityName",
      sortOrder: "asc",
      page: 1,
    };

    setLocalFilters({
      ...defaultFilters,
      populationMin: null,
      populationMax: null,
      dateFrom: null,
      dateTo: null,
    });
    onFilterChange(defaultFilters);
    setHasUnsavedChanges(false);
    announceToScreenReader("Filters reset to default values");
  }, [onFilterChange, announceToScreenReader]);

  /**
   * Handle geocoding for location input
   */
  const handleLocationGeocoding = useCallback(async (location: string) => {
    if (!location || location.length < 3) return;

    try {
      // TODO: Implement Mapbox geocoding API call
      // This would typically call the Mapbox Geocoding API
      // For now, we'll just update the coordinates if they exist
      console.log("Geocoding location:", location);
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  }, []);

  // Sync Redux filters into local state. Redux uses populationRange/dateRange; local form uses populationMin/Max, dateFrom/To.
  useEffect(() => {
    const popRange = filters.populationRange;
    const dateR = filters.dateRange;
    const fallbackPopMin = "populationMin" in filters ? (filters as { populationMin?: number }).populationMin : undefined;
    const fallbackPopMax = "populationMax" in filters ? (filters as { populationMax?: number }).populationMax : undefined;
    const fallbackDateFrom = "dateFrom" in filters ? (filters as { dateFrom?: string }).dateFrom : undefined;
    const fallbackDateTo = "dateTo" in filters ? (filters as { dateTo?: string }).dateTo : undefined;
    setLocalFilters((prev) => ({
      ...prev,
      searchQuery: filters.searchQuery || "",
      location: filters.location || "",
      governmentLevels: filters.governmentLevels || [],
      entityType: filters.entityType || "",
      hasBusinessLicenses: filters.hasBusinessLicenses || false,
      hasReviews: filters.hasReviews || false,
      isActive: filters.isActive ?? true,
      populationMin: popRange?.[0] ?? fallbackPopMin ?? undefined,
      populationMax: popRange?.[1] ?? fallbackPopMax ?? undefined,
      dateFrom: dateR?.[0] ?? fallbackDateFrom ?? undefined,
      dateTo: dateR?.[1] ?? fallbackDateTo ?? undefined,
      budgetRange: filters.budgetRange ?? prev.budgetRange ?? [null, null],
      crimeRateMin: filters.crimeRateMin ?? null,
      crimeRateMax: filters.crimeRateMax ?? null,
      dataQualityThreshold: filters.dataQualityThreshold ?? null,
      employeeCountMin: filters.employeeCountMin ?? null,
      employeeCountMax: filters.employeeCountMax ?? null,
      radiusKm: filters.radiusKm || 10,
      useRadiusSearch: filters.useRadiusSearch || false,
      sortBy: filters.sortBy || "entityName",
      sortOrder: filters.sortOrder || "asc",
    }));
    setHasUnsavedChanges(false);
  }, [filters]);

  // Handle geocoding when location changes
  useEffect(() => {
    if (debouncedLocation) {
      handleLocationGeocoding(debouncedLocation);
    }
  }, [debouncedLocation, handleLocationGeocoding]);

  if (!isFiltersFullOpen) return null;

  return (
    <Card
      onKeyDown={handleKeyDown}
      role="region"
      aria-labelledby="filters-heading"
      className="bg-white rounded-lg px-4 h-full overflow-auto py-10"
    >
      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <CardContent id="filters-content" className="space-y-6 pt-0">
        {/* Search and Location */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="searchQuery">Search Query</Label>
            <Input
              id="searchQuery"
              placeholder="Search government entities..."
              value={localFilters.searchQuery || ""}
              onChange={(e) => handleInputChange("searchQuery", e.target.value)}
              disabled={isLoading}
              aria-describedby="searchQuery-description"
            />
            <p id="searchQuery-description" className="sr-only">
              Enter keywords to search for government entities
            </p>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <Input
                id="location"
                placeholder="Enter location (city, state, zip)..."
                aria-describedby="location-description"
                value={localFilters.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={isLoading}
              />
              <p id="location-description" className="sr-only">
                Enter a location to search for government entities in that area
              </p>
            </div>
          </div>
        </div>

        {/* Government Levels */}
        <div>
          <Label className="text-base font-medium" id="government-levels-label">
            Government Levels
          </Label>
          <div
            className="grid grid-cols-2 gap-3 mt-2"
            role="group"
            aria-labelledby="government-levels-label"
          >
            {governmentLevels.map(
              (level: { value: string; label: string; description: string }) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level.value}`}
                    checked={localFilters.governmentLevels?.includes(level.value) || false}
                    onCheckedChange={(checked: boolean | string) =>
                      handleGovernmentLevelChange(level.value, checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={`level-${level.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {level.label}
                  </Label>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Entity Type - plain grid, no dropdown */}
        <div>
          <Label className="text-base font-medium" id="entity-type-label">
            Entity Type
          </Label>
          <div
            className="grid grid-cols-2 gap-2 mt-2"
            role="group"
            aria-labelledby="entity-type-label"
          >
            <button
              type="button"
              onClick={() => handleInputChange("entityType", "")}
              disabled={isLoading}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors",
                !localFilters.entityType || localFilters.entityType === ""
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white hover:border-gray-300",
              )}
            >
              All Types
            </button>
            {entityTypes.map((type: { value: string; label: string; description: string }) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange("entityType", type.value)}
                disabled={isLoading}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors",
                  localFilters.entityType === type.value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Population Range */}
        <div>
          <Label className="text-base font-medium">
            Population Range
            {localFilters.populationMin && localFilters.populationMax && (
              <span className="text-sm text-gray-500 ml-2">
                ({localFilters.populationMin.toLocaleString()} -{" "}
                {localFilters.populationMax.toLocaleString()})
              </span>
            )}
          </Label>
          <div className="mt-2 space-y-2">
            <Slider
              value={[localFilters.populationMin || 0, localFilters.populationMax || 1000000]}
              onValueChange={handlePopulationRangeChange}
              max={10000000}
              min={0}
              step={1000}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{POPULATION_FILTERS.SLIDER.MAX / 1000000}M</span>
            </div>
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <Label className="text-base font-medium">
            Budget Range
            {(() => {
              const budgetRange = localFilters.budgetRange;
              if (budgetRange && budgetRange[0] !== null && budgetRange[1] !== null) {
                return (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    (${(budgetRange[0] / 1000000).toFixed(1)}M - $
                    {(budgetRange[1] / 1000000).toFixed(1)}M)
                  </span>
                );
              }
              return null;
            })()}
          </Label>
          <div className="mt-2 space-y-2">
            <Slider
              value={[
                localFilters.budgetRange && localFilters.budgetRange[0] !== null
                  ? localFilters.budgetRange[0]
                  : 0,
                localFilters.budgetRange && localFilters.budgetRange[1] !== null
                  ? localFilters.budgetRange[1]
                  : BUDGET_FILTERS.SLIDER.MAX,
              ]}
              onValueChange={handleBudgetRangeChange}
              max={BUDGET_FILTERS.SLIDER.MAX}
              min={BUDGET_FILTERS.SLIDER.MIN}
              step={BUDGET_FILTERS.SLIDER.STEP}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>${(BUDGET_FILTERS.SLIDER.MAX / 1000000000).toFixed(0)}B</span>
            </div>
          </div>
        </div>

        {/* Crime Rate Filter */}
        <div>
          <Label className="text-base font-medium">
            Crime Rate Change (%)
            {(() => {
              const min = localFilters.crimeRateMin;
              const max = localFilters.crimeRateMax;
              if (min !== null && min !== undefined && max !== null && max !== undefined) {
                return (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({min}% - {max}%)
                  </span>
                );
              }
              return null;
            })()}
          </Label>
          <div className="mt-2 space-y-2">
            <Slider
              value={[
                localFilters.crimeRateMin ?? CRIME_RATE_SLIDER.MIN,
                localFilters.crimeRateMax ?? CRIME_RATE_SLIDER.MAX,
              ]}
              onValueChange={handleCrimeRateRangeChange}
              max={CRIME_RATE_SLIDER.MAX}
              min={CRIME_RATE_SLIDER.MIN}
              step={CRIME_RATE_SLIDER.STEP}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{CRIME_RATE_SLIDER.MIN}%</span>
              <span>{CRIME_RATE_SLIDER.MAX}%</span>
            </div>
          </div>
        </div>

        {/* Data Quality Threshold – not yet supported by backend/DB */}
        <div>
          <Label className="text-base font-medium">
            Data Quality Threshold
            {(() => {
              const threshold = localFilters.dataQualityThreshold;
              if (threshold !== null && threshold !== undefined) {
                return (
                  <span className="ml-2 text-sm font-normal text-gray-600">({threshold}%)</span>
                );
              }
              return null;
            })()}
          </Label>
          <div className="mt-2 space-y-2">
            <Slider
              value={[localFilters.dataQualityThreshold ?? DATA_QUALITY_SLIDER.MIN]}
              onValueChange={handleDataQualityChange}
              max={DATA_QUALITY_SLIDER.MAX}
              min={DATA_QUALITY_SLIDER.MIN}
              step={DATA_QUALITY_SLIDER.STEP}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{DATA_QUALITY_SLIDER.MIN}%</span>
              <span>{DATA_QUALITY_SLIDER.MAX}%</span>
            </div>
          </div>
        </div>

        {/* Employee Count Range – not yet supported by backend/DB */}
        <div>
          <Label className="text-base font-medium">
            Employee Count
            {(() => {
              const min = localFilters.employeeCountMin;
              const max = localFilters.employeeCountMax;
              if (min !== null && min !== undefined && max !== null && max !== undefined) {
                return (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({min.toLocaleString()} - {max.toLocaleString()})
                  </span>
                );
              }
              return null;
            })()}
          </Label>
          <div className="mt-2 space-y-2">
            <Slider
              value={[localFilters.employeeCountMin || 0, localFilters.employeeCountMax || 10000]}
              onValueChange={handleEmployeeCountRangeChange}
              max={100000}
              min={0}
              step={100}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>100K+</span>
            </div>
          </div>
        </div>

        {/* Date Range – filters by entity created_at */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateFrom">From Date</Label>
            <Input
              id="dateFrom"
              type="date"
              value={localFilters.dateFrom || ""}
              onChange={(e) => handleInputChange("dateFrom", e.target.value || null)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="dateTo">To Date</Label>
            <Input
              id="dateTo"
              type="date"
              value={localFilters.dateTo || ""}
              onChange={(e) => handleInputChange("dateTo", e.target.value || null)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Boolean Filters */}
        <div>
          <Label className="text-base font-medium">Additional Filters</Label>
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasBusinessLicenses"
                checked={localFilters.hasBusinessLicenses || false}
                onCheckedChange={(checked) => handleInputChange("hasBusinessLicenses", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="hasBusinessLicenses" className="text-sm font-normal cursor-pointer">
                Has Business Licenses
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasReviews"
                checked={localFilters.hasReviews || false}
                onCheckedChange={(checked) => handleInputChange("hasReviews", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="hasReviews" className="text-sm font-normal cursor-pointer">
                Has Reviews
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={localFilters.isActive === false}
                onCheckedChange={(checked) => handleInputChange("isActive", !checked)}
                disabled={isLoading}
              />
              <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                Show Inactive Only
              </Label>
            </div>
          </div>
        </div>

        {/* Geospatial Options */}
        <div>
          <Label className="text-base font-medium">Geospatial Search</Label>
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useRadiusSearch"
                checked={localFilters.useRadiusSearch || false}
                onCheckedChange={(checked) => handleInputChange("useRadiusSearch", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="useRadiusSearch" className="text-sm font-normal cursor-pointer">
                Use Radius Search
              </Label>
            </div>

            {localFilters.useRadiusSearch && (
              <div>
                <Label htmlFor="radiusKm">Search Radius (km)</Label>
                <div className="mt-1">
                  <Slider
                    value={[localFilters.radiusKm || GEOGRAPHIC_DEFAULTS.DEFAULT_RADIUS_KM]}
                    onValueChange={(values) => handleInputChange("radiusKm", values[0])}
                    max={GEOGRAPHIC_DEFAULTS.MAX_RADIUS_KM}
                    min={1}
                    step={1}
                    className="w-full"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 km</span>
                    <span className="font-medium">{localFilters.radiusKm} km</span>
                    <span>{GEOGRAPHIC_DEFAULTS.MAX_RADIUS_KM} km</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select
              value={localFilters.sortBy || "entityName"}
              onValueChange={(value) => handleInputChange("sortBy", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sortOrder">Order</Label>
            <Select
              value={localFilters.sortOrder || "asc"}
              onValueChange={(value) => handleInputChange("sortOrder", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons - Optimized for touch targets and keyboard navigation */}
        <div className="flex space-x-2 pt-4 border-t" role="group" aria-label="Filter actions">
          <Button
            onClick={applyFilters}
            disabled={isLoading || !hasUnsavedChanges}
            className="flex-1 min-h-[44px]"
            size="sm"
            aria-label="Apply filters"
            aria-describedby="apply-filters-description"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                <span aria-live="polite">Applying...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                Apply Filters
              </>
            )}
          </Button>
          <span id="apply-filters-description" className="sr-only">
            Press Ctrl+Enter to apply filters. Applies all current filter settings.
          </span>

          <Button
            onClick={resetFilters}
            variant="outline"
            disabled={isLoading}
            size="sm"
            className="min-h-[44px]"
            aria-label="Reset all filters to default values"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                <span aria-live="polite">Resetting...</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                Reset
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
