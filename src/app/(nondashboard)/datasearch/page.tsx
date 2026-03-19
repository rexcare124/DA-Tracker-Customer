"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  setGovernmentEntityFilters,
  setSearching,
  setSelectedEntity,
  toggleFiltersFullOpen,
  setViewMode,
  setSmrcFormPrefill,
} from "@/state/index";
import { useSearchGovernmentEntitiesQuery } from "@/state/api";
import { GovernmentEntityFiltersState } from "@/types/governmentEntityTypes";
import { EntitySelectHandler, EntityHoverHandler, EntityViewDetailsHandler, DataSearchMarker } from "@/types/search";
import { URLSearchParamsSchema } from "@/lib/validationSchemas";
import { getSecurityContext, hasPermission, logSecurityEvent } from "@/lib/security";
import { GEOGRAPHIC_DEFAULTS, DEBOUNCE_DELAYS } from "@/lib/constants/search";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield, List, Grid3X3 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import dynamic from "next/dynamic";
import PreviousResidencesModal from "@/components/SMRC/PreviousResidencesModal";

// Dynamic imports for better performance
const FiltersBar = dynamic(() => import("./FiltersBar"), {
  loading: () => <Skeleton className="h-16 w-full" />,
  ssr: false,
});
const FiltersFull = dynamic(() => import("./FiltersFull"), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false,
});
const Map = dynamic(() => import("./Map"), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false,
});
const DataSearchPanel = dynamic(() => import("../../../features/datasearch/Panel"), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false,
});

/**
 * Government Data Search Page
 *
 * Three-panel layout with:
 * - Left: Filters (compact bar + full panel)
 * - Center: Map with government entity markers
 * - Right: Results list with pagination
 *
 * Features:
 * - URL parameter synchronization
 * - Real-time search with debouncing
 * - User permission validation
 * - Responsive design
 * - Security-first implementation
 */
export default function DataSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  // Redux state
  const filters = useAppSelector((state) => state.global.governmentEntityFilters);
  const isSearching = useAppSelector((state) => state.global.isSearching);
  const mapUI = useAppSelector((state) => state.global.mapUI);
  const isFiltersFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen);
  const viewMode = useAppSelector((state) => state.global.viewMode);

  // Only sync URL from filters after we've synced filters from URL (avoids overwriting URL on load)
  const hasSyncedFromUrlRef = useRef(false);

  // Trailing-only debounce: run search only after filters have been stable for SEARCH_API_MS.
  // Avoids 429 on load (no immediate request; wait for URL sync) and when typing.
  const [queryFilters, setQueryFilters] = useState<GovernmentEntityFiltersState | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setQueryFilters(filters), DEBOUNCE_DELAYS.SEARCH_API_MS);
    return () => clearTimeout(t);
  }, [filters]);

  /** Map/pin click: search SMRC reviews at this location (lat, lng) */
  const [smrcSearchLocation, setSmrcSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [smrcSearchLocationLabel, setSmrcSearchLocationLabel] = useState<string | null>(null);
  const handleMapLocationSelect = useCallback((lng: number, lat: number, locationLabel?: string) => {
    setSmrcSearchLocation({ lat, lng });
    setSmrcSearchLocationLabel(locationLabel ?? null);
  }, []);

  /** Mobile: SMRC reviews drawer open state */
  const [smrcDrawerOpen, setSmrcDrawerOpen] = useState(false);

  /** Data search markers (e.g. persons with addresses) to display on the map */
  const [dataSearchMarkers, setDataSearchMarkers] = useState<DataSearchMarker[]>([]);

  /** Open SMRC submit modal (same as review-history "Submit New Review"). Sets prefill from map selection so got-smrc form can auto-fill state/city. */
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const handleRequestSubmitReview = useCallback(
    (state: string | null, city: string | null) => {
      dispatch(setSmrcFormPrefill({ state, city }));
      setShowSubmitModal(true);
    },
    [dispatch],
  );

  // RTK Query for search
  const {
    data: searchResults,
    error: searchError,
    isLoading: isSearchLoading,
    refetch: refetchSearch,
  } = useSearchGovernmentEntitiesQuery(queryFilters ?? filters, {
    skip: !session?.user || queryFilters === null, // Wait for trailing debounce so we only run once after URL sync / typing
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: true,
  });

  console.log({ searchResults });

  /**
   * Parse URL parameters and update Redux state
   * Security: Validates all URL parameters using Zod schemas and security validation
   */
  const parseURLParams = useCallback(async () => {
    try {
      const urlParams = Object.fromEntries(searchParams.entries());
      // Keep URL params as strings for Zod (URLSearchParamsSchema expects strings; validateSearchParams mutates to numbers/booleans which would break Zod)
      const urlParamsStrings: Record<string, string> = {};
      for (const [k, v] of Object.entries(urlParams)) {
        urlParamsStrings[k] = v == null ? "" : String(v);
      }

      // Validate URL parameters with Zod (schema expects string values)
      const validatedParams = URLSearchParamsSchema.safeParse(urlParamsStrings);

      if (!validatedParams.success) {
        logSecurityEvent("ZOD_VALIDATION_FAILED", null, {
          urlParams: urlParamsStrings,
          errors: validatedParams.error,
        });
        console.warn("Invalid URL parameters:", validatedParams.error);
        return;
      }

      const params = validatedParams.data;

      // Update Redux state with validated parameters. Use populationRange/dateRange so search API receives them.
      const populationMin = params.populationMin ? parseInt(params.populationMin) : null;
      const populationMax = params.populationMax ? parseInt(params.populationMax) : null;
      const dateFrom = params.dateFrom || null;
      const dateTo = params.dateTo || null;
      const populationRange: [number, number] | [null, null] =
        populationMin != null && populationMax != null ? [populationMin, populationMax] : [null, null];
      const dateRange: [string, string] | [null, null] = dateFrom && dateTo ? [dateFrom, dateTo] : [null, null];
      const newFilters: Partial<GovernmentEntityFiltersState> = {
        searchQuery: params.searchQuery || "",
        location: params.location || "",
        governmentLevels: Array.isArray(params.governmentLevels)
          ? params.governmentLevels
          : params.governmentLevels
            ? [params.governmentLevels]
            : [],
        entityType: params.entityType || "",
        hasBusinessLicenses: params.hasBusinessLicenses === "true",
        hasReviews: params.hasReviews === "true",
        isActive: params.isActive !== "false",
        coordinates:
          params.latitude && params.longitude
            ? [parseFloat(params.longitude), parseFloat(params.latitude)]
            : [null, null],
        radiusKm: params.radiusKm ? parseFloat(params.radiusKm) : GEOGRAPHIC_DEFAULTS.DEFAULT_RADIUS_KM,
        useRadiusSearch: params.useRadiusSearch === "true",
        populationRange,
        dateRange,
        page: params.page ? parseInt(params.page) : 1,
        limit: params.limit ? parseInt(params.limit) : 20,
        sortBy: ["entityName", "createdAt", "governmentLevelId"].includes(params.sortBy ?? "")
          ? (params.sortBy as "entityName" | "createdAt" | "governmentLevelId")
          : "entityName",
        sortOrder: params.sortOrder === "desc" ? "desc" : "asc",
      };

      dispatch(setGovernmentEntityFilters(newFilters));
      hasSyncedFromUrlRef.current = true;
    } catch (error) {
      logSecurityEvent("URL_PARSE_ERROR", null, {
        error: error instanceof Error ? error.message : String(error),
      });
      console.error("Error parsing URL parameters:", error);
    }
  }, [searchParams, dispatch]);

  /** Build search string from filters (same logic as updateURL) for comparison / replace */
  const getSearchStringFromFilters = useCallback((f: Partial<GovernmentEntityFiltersState>) => {
    const params = new URLSearchParams();
    if (f.searchQuery) params.set("searchQuery", f.searchQuery);
    if (f.location) params.set("location", f.location);
    if (f.governmentLevels?.length) params.set("governmentLevels", f.governmentLevels.join(","));
    if (f.entityType) params.set("entityType", f.entityType);
    if (f.hasBusinessLicenses) params.set("hasBusinessLicenses", "true");
    if (f.hasReviews) params.set("hasReviews", "true");
    if (f.isActive !== undefined) params.set("isActive", String(f.isActive));
    if (f.coordinates?.[0] != null && f.coordinates?.[1] != null) {
      params.set("latitude", String(f.coordinates[1]));
      params.set("longitude", String(f.coordinates[0]));
    }
    if (f.radiusKm) params.set("radiusKm", String(f.radiusKm));
    if (f.useRadiusSearch) params.set("useRadiusSearch", "true");
    const popMin = f.populationRange?.[0] ?? (f as { populationMin?: number }).populationMin;
    const popMax = f.populationRange?.[1] ?? (f as { populationMax?: number }).populationMax;
    const dateFrom = f.dateRange?.[0] ?? (f as { dateFrom?: string }).dateFrom;
    const dateTo = f.dateRange?.[1] ?? (f as { dateTo?: string }).dateTo;
    if (popMin != null && !Number.isNaN(Number(popMin))) params.set("populationMin", String(popMin));
    if (popMax != null && !Number.isNaN(Number(popMax))) params.set("populationMax", String(popMax));
    if (dateFrom && typeof dateFrom === "string") params.set("dateFrom", dateFrom);
    if (dateTo && typeof dateTo === "string") params.set("dateTo", dateTo);
    if (f.page && f.page > 1) params.set("page", String(f.page));
    if (f.limit && f.limit !== 20) params.set("limit", String(f.limit));
    if (f.sortBy && f.sortBy !== "entityName") params.set("sortBy", f.sortBy);
    if (f.sortOrder && f.sortOrder !== "asc") params.set("sortOrder", f.sortOrder);
    return params.toString();
  }, []);

  /**
   * Update URL with current filter state
   * Security: Sanitizes all parameters before URL update
   */
  const updateURL = useCallback(
    (newFilters: Partial<GovernmentEntityFiltersState>) => {
      try {
        const search = getSearchStringFromFilters(newFilters);
        router.replace(`${window.location.pathname}${search ? `?${search}` : ""}`, {
          scroll: false,
        });
      } catch (error) {
        console.error("Error updating URL:", error);
      }
    },
    [router, getSearchStringFromFilters],
  );

  /**
   * Handle filter changes with URL synchronization
   */
  const handleFilterChange = useCallback(
    (newFilters: Partial<GovernmentEntityFiltersState>) => {
      dispatch(setGovernmentEntityFilters(newFilters));
      updateURL(newFilters);
    },
    [dispatch, updateURL],
  );

  /**
   * Handle search execution with security validation
   */
  const handleSearch = useCallback(async () => {
    try {
      // Get security context
      const securityContext = await getSecurityContext();

      if (!securityContext) {
        logSecurityEvent("UNAUTHORIZED_SEARCH_ATTEMPT", null, { filters });
        return;
      }

      // Check search permission
      if (!hasPermission(securityContext, "canSearchEntities")) {
        logSecurityEvent("INSUFFICIENT_PERMISSIONS", securityContext, {
          action: "search",
          filters,
        });
        return;
      }

      // Log search attempt
      logSecurityEvent("SEARCH_ATTEMPT", securityContext, { filters });

      dispatch(setSearching(true));
      refetchSearch();
    } catch (error) {
      logSecurityEvent("SEARCH_ERROR", null, {
        error: error instanceof Error ? error.message : String(error),
        filters,
      });
      console.error("Error executing search:", error);
    }
  }, [dispatch, refetchSearch, filters]);

  /**
   * Handle entity selection (map pin click or list click) – syncs to Redux for list highlight and popup
   */
  const handleEntitySelect = useCallback<EntitySelectHandler>(
    (entity) => {
      dispatch(setSelectedEntity(entity?.id ?? null));
    },
    [dispatch],
  );

  /**
   * Handle entity hover
   */
  const handleEntityHover = useCallback<EntityHoverHandler>((entityId) => {
    // You can add additional logic here for entity hover
    console.log("Entity hovered:", entityId);
  }, []);

  /**
   * Handle view details
   */
  const handleViewDetails = useCallback<EntityViewDetailsHandler>((entity) => {
    // You can add additional logic here for viewing entity details
    console.log("View details for:", entity);
  }, []);

  // Parse URL parameters on mount and when searchParams change
  useEffect(() => {
    parseURLParams();
  }, [parseURLParams]);

  // Sync URL from filters only after we've synced from URL, and only when URL would actually change (stops repeated API calls / loop)
  useEffect(() => {
    if (!hasSyncedFromUrlRef.current || filters.searchQuery === undefined) return;
    const targetSearch = getSearchStringFromFilters(filters);
    const currentSearch = typeof window !== "undefined" ? window.location.search.slice(1) : "";
    if (targetSearch !== currentSearch) {
      updateURL(filters);
    }
  }, [filters, updateURL, getSearchStringFromFilters]);

  // Mobile detection for filters sheet - must run before any conditional return (hooks rule)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Security: Check authentication status
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters panel skeleton */}
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Card>
                <CardContent className="p-4 space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
            {/* Map skeleton */}
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            {/* Results skeleton */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_: unknown, i: number) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Security: Require authentication and 2FA verification
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You must be signed in to access government data search. Please sign in to continue.
              </AlertDescription>
            </Alert>
            <Button className="w-full mt-4" onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if 2FA is required and not verified
  const user = session.user as { twoFactorRequired?: boolean; twoFactorVerified?: boolean };
  if (user.twoFactorRequired && !user.twoFactorVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Two-Factor Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete two-factor authentication to access this page. You will be redirected to complete 2FA.
              </AlertDescription>
            </Alert>
            <Button className="w-full mt-4" onClick={() => router.push("/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="w-full mx-auto flex flex-col bg-gray-50 py-6 overflow-hidden lg:overflow-hidden"
      style={{
        minHeight: `calc(100dvh - ${NAVBAR_HEIGHT}px)`,
        maxHeight: `calc(100dvh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      {/* Top bar: filter icon | search bar | SMRC (mobile) or full filters (desktop) */}
      <div className="flex-shrink-0 px-4 py-1.5 bg-gray-50 border-b border-gray-200">
        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          isLoading={isSearchLoading}
          isMobile={isMobile}
          onSmrcClick={isMobile ? () => setSmrcDrawerOpen(true) : undefined}
        />
      </div>

      {/* Main: on mobile map only (full view); on lg three columns */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden px-4 py-2" style={{ gap: 24 }}>
        {/* Left: Advanced Filters - desktop only; mobile uses Sheet */}
        <div
          className={`hidden lg:flex flex-col min-h-0 transition-all duration-300 ease-in-out ${
            isFiltersFullOpen
              ? "w-[25%] min-w-[280px] opacity-100 visible overflow-y-auto"
              : "w-0 min-w-0 opacity-0 invisible overflow-hidden"
          }`}
        >
          <FiltersFull
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            isLoading={isSearchLoading}
          />
        </div>

        {/* Map - full view on mobile, shared with reviews on desktop */}
        <div className="flex-1 min-w-0 min-h-0 w-full relative rounded-xl overflow-hidden">
          <Map
            filters={filters}
            results={searchResults}
            onFilterChange={handleFilterChange}
            onEntitySelect={handleEntitySelect}
            onMapLocationSelect={handleMapLocationSelect}
            dataSearchMarkers={dataSearchMarkers}
            isLoading={isSearchLoading}
            isFiltersFullOpen={isFiltersFullOpen}
          />
        </div>

        {/* Right: SMRC Reviews - desktop only; on mobile shown in drawer */}
        {!isMobile && (
          <div className="basis-[33%] min-w-[320px] min-h-0 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white flex-shrink">
            <DataSearchPanel
              searchLocation={smrcSearchLocation}
              searchLocationLabel={smrcSearchLocationLabel}
              onRequestSubmitReview={handleRequestSubmitReview}
              onDataSearchMarkers={setDataSearchMarkers}
            />
          </div>
        )}
      </div>

      {/* Mobile: Filters drawer (opens when filter icon is clicked) */}
      <Sheet
        open={isMobile && isFiltersFullOpen}
        onOpenChange={(open) => {
          if (!open) dispatch(toggleFiltersFullOpen());
        }}
      >
        <SheetContent side="left" className="w-[90vw] sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <FiltersFull
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={() => {
                handleSearch();
                dispatch(toggleFiltersFullOpen());
              }}
              isLoading={isSearchLoading}
            />
            {/* View mode for reviews (List / Box) */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Reviews view</p>
              <div className="flex border rounded-xl overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-1 rounded-none ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                      : "hover:bg-blue-100"
                  }`}
                  onClick={() => dispatch(setViewMode("list"))}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-1 rounded-none ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                      : "hover:bg-blue-100"
                  }`}
                  onClick={() => dispatch(setViewMode("grid"))}
                  aria-label="Box view"
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Box
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile: SMRC Reviews drawer (opens when SMRC is clicked) */}
      <Sheet open={isMobile && smrcDrawerOpen} onOpenChange={setSmrcDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-hidden flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-2 flex-shrink-0">
            <SheetTitle>SMRC Reviews</SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
            <DataSearchPanel
              searchLocation={smrcSearchLocation}
              searchLocationLabel={smrcSearchLocationLabel}
              onRequestSubmitReview={handleRequestSubmitReview}
              onDataSearchMarkers={setDataSearchMarkers}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* SMRC submit modal (same as review-history): choose review type then navigate to got-smrc; prefill applied on that page */}
      <PreviousResidencesModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} />

      {/* Error Display */}
      {searchError && (
        <div className="fixed bottom-4 right-4 max-w-md z-50">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Error loading search results. Please try again.</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
