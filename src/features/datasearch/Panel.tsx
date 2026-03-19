"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { format } from "date-fns";
import type { SMRCDocument } from "@/lib/firebase/smrc-types";
import type { Person } from "@/hooks/usePersons";
import { useAppSelector } from "@/state/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelectPopover } from "@/components/MultiSelectPopover";
import {
  FileText,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Building2,
  School as SchoolIcon,
  Handshake,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDataTypesStore, type DataTypeItem, type DataTypesState } from "@/store";
import { api } from "@/lib/api";
import { forwardGeocode } from "@/lib/geo/geocode";
import type { DataSearchMarker } from "@/types/search";
import {
  DATA_SEARCH_BUSINESS_IDENTIFIER,
  DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER,
  DATA_SEARCH_MARKER_IDENTIFIERS,
  DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER,
  DATA_SEARCH_PERSON_IDENTIFIER,
  DATA_SEARCH_SCHOOL_IDENTIFIER,
  DATA_SEARCH_SERVICE_REVIEWS_IDENTIFIER,
  type DataSearchMarkerIdentifier,
  isDataSearchMarkerIdentifier,
} from "@/lib/constants/dataSearchIdentifiers";

const PER_PAGE = 10;
const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";

/** Reverse geocode (lng, lat) to { state, city } using Google Geocoding API */
async function reverseGeocode(lng: number, lat: number): Promise<{ state: string | null; city: string | null }> {
  if (!GOOGLE_MAP_KEY) return { state: null, city: null };
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${encodeURIComponent(GOOGLE_MAP_KEY)}`,
    );
    const json = await res.json();
    const results = json?.results as
      | Array<{ address_components?: Array<{ long_name: string; types: string[] }> }>
      | undefined;
    let state: string | null = null;
    let city: string | null = null;
    for (const r of results ?? []) {
      for (const c of r.address_components ?? []) {
        if (c.types.includes("administrative_area_level_1")) state = c.long_name;
        if (c.types.includes("locality") || c.types.includes("sublocality")) city = c.long_name;
      }
      if (state || city) break;
    }
    if (!city && results?.[0]?.address_components) {
      for (const c of results[0].address_components) {
        if (c.types.includes("administrative_area_level_2")) city = c.long_name;
      }
    }
    return { state, city };
  } catch {
    return { state: null, city: null };
  }
}

function residencyLabel(el: SMRCDocument): string {
  if (el.notResident) return "Not a Resident";
  if (el.currentResidence) return "Current Residence";
  return "Previous Residence";
}

function reviewerDisplay(userId: string | undefined): { label: string; initial: string } {
  if (!userId) return { label: "Reviewer", initial: "?" };
  const id = userId.trim();
  if (id.length >= 2) return { label: "Reviewer", initial: id.slice(0, 2).toUpperCase() };
  return { label: "Reviewer", initial: id ? id.toUpperCase() : "?" };
}

function personDisplayName(p: Person): string {
  const parts = [p.firstName, p.middleName, p.lastName].filter(Boolean);
  return parts.join(" ") || "Unknown";
}

interface PanelHeaderProps {
  title: ReactNode;
  locationLabel?: string | null;
  icon?: ReactNode;
  right?: ReactNode;
}

function PanelHeader({ title, locationLabel, icon, right }: PanelHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {icon ?? <FileText className="h-5 w-5 text-gray-600" aria-hidden="true" />}
          <span className="font-medium text-gray-900">{title}</span>
          {locationLabel && <span className="text-sm text-gray-500">in {locationLabel}</span>}
        </div>
        {right != null && <div className="flex items-center space-x-2 text-sm text-gray-500">{right}</div>}
      </div>
    </div>
  );
}

export interface PanelProps {
  /** When set, filter results by this location (state/city from reverse geocode) */
  searchLocation?: { lat: number; lng: number } | null;
  /** When set, use this for the "in X" label instead of reverse geocode */
  searchLocationLabel?: string | null;
  /** When "Submit a review" is clicked (service-reviews section) */
  onRequestSubmitReview?: (state: string | null, city: string | null) => void;
  /** Callback when data search markers (e.g. persons with addresses) are ready to display on the map */
  onDataSearchMarkers?: (markers: DataSearchMarker[]) => void;
}

export default function Panel({
  searchLocation = null,
  searchLocationLabel = null,
  onRequestSubmitReview,
  onDataSearchMarkers,
}: PanelProps) {
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [locationFilter, setLocationFilter] = useState<{ state: string | null; city: string | null }>({
    state: null,
    city: null,
  });

  // Data types from Zustand store
  const dataTypes = useDataTypesStore((s: DataTypesState) => s.items);
  const dataTypesLoading = useDataTypesStore((s: DataTypesState) => s.isLoading);
  const [selectedDataTypeIds, setSelectedDataTypeIds] = useState<Set<string>>(new Set());
  const [appliedDataTypeIds, setAppliedDataTypeIds] = useState<string[]>([]);
  const [dataTypesPopoverOpen, setDataTypesPopoverOpen] = useState(false);
  const dataTypesInitializedRef = useRef(false);

  const [mapVisibilityByIdentifier, setMapVisibilityByIdentifier] = useState<
    Record<DataSearchMarkerIdentifier, boolean>
  >({
    [DATA_SEARCH_PERSON_IDENTIFIER]: true,
    [DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER]: true,
    [DATA_SEARCH_BUSINESS_IDENTIFIER]: true,
    [DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER]: true,
    [DATA_SEARCH_SCHOOL_IDENTIFIER]: true,
  });

  // Resolve searchLocation to state/city via reverse geocode
  useEffect(() => {
    if (!searchLocation) {
      setLocationFilter({ state: null, city: null });
      return;
    }
    let cancelled = false;
    reverseGeocode(searchLocation.lng, searchLocation.lat).then(({ state, city }) => {
      if (!cancelled) setLocationFilter({ state, city });
    });
    return () => {
      cancelled = true;
    };
  }, [searchLocation?.lat, searchLocation?.lng]);

  // Initialize selected/applied with all data type IDs when store first populates
  useEffect(() => {
    if (dataTypes.length > 0 && !dataTypesInitializedRef.current) {
      dataTypesInitializedRef.current = true;
      const ids = dataTypes.map((dt: DataTypeItem) => dt.id);
      setAppliedDataTypeIds(ids);
      setSelectedDataTypeIds(new Set(ids));
    }
  }, [dataTypes]);

  const handleApplyDataTypes = useCallback((ids: string[]) => {
    setAppliedDataTypeIds(ids);
    setDataTypesPopoverOpen(false);
  }, []);

  // Sync selected IDs from applied when opening popover
  useEffect(() => {
    if (dataTypesPopoverOpen) {
      setSelectedDataTypeIds(new Set(appliedDataTypeIds));
    }
  }, [dataTypesPopoverOpen, appliedDataTypeIds]);

  const locationLabel =
    searchLocationLabel?.trim() ||
    (locationFilter.state || locationFilter.city
      ? [locationFilter.city, locationFilter.state].filter(Boolean).join(", ")
      : null);

  const appliedDataTypes = dataTypes.filter((dt) => appliedDataTypeIds.includes(dt.id));
  const hasServiceReviews = appliedDataTypes.some((dt) => dt.identifier === DATA_SEARCH_SERVICE_REVIEWS_IDENTIFIER);
  const hasPersons = appliedDataTypes.some((dt) => dt.identifier === DATA_SEARCH_PERSON_IDENTIFIER);
  const hasHomeOwnerAssociations = appliedDataTypes.some(
    (dt) => dt.identifier === DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER,
  );
  const hasNonGovernmentalOrganizations = appliedDataTypes.some(
    (dt) => dt.identifier === DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER,
  );
  const hasSchools = appliedDataTypes.some((dt) => dt.identifier === DATA_SEARCH_SCHOOL_IDENTIFIER);
  const hasBusinesses = appliedDataTypes.some((dt) => dt.identifier === DATA_SEARCH_BUSINESS_IDENTIFIER);

  const appliedMarkerIdentifiers = useMemo<Set<DataSearchMarkerIdentifier>>(() => {
    const appliedIdSet = new Set<string>(appliedDataTypeIds);
    const set = new Set<DataSearchMarkerIdentifier>();
    for (const dt of dataTypes) {
      if (!appliedIdSet.has(dt.id)) continue;
      if (isDataSearchMarkerIdentifier(dt.identifier)) set.add(dt.identifier);
    }
    return set;
  }, [dataTypes, appliedDataTypeIds]);

  // --- Aggregate map markers from all entity cards ---
  const markersMapRef = useRef<Record<DataSearchMarkerIdentifier, DataSearchMarker[]>>({
    [DATA_SEARCH_PERSON_IDENTIFIER]: [],
    [DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER]: [],
    [DATA_SEARCH_BUSINESS_IDENTIFIER]: [],
    [DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER]: [],
    [DATA_SEARCH_SCHOOL_IDENTIFIER]: [],
  });

  const emitAllMarkers = useCallback(() => {
    const markers: DataSearchMarker[] = [];
    for (const identifier of DATA_SEARCH_MARKER_IDENTIFIERS) {
      if (!appliedMarkerIdentifiers.has(identifier)) continue;
      if (!mapVisibilityByIdentifier[identifier]) continue;
      markers.push(...markersMapRef.current[identifier]);
    }
    onDataSearchMarkers?.(markers);
  }, [appliedMarkerIdentifiers, mapVisibilityByIdentifier, onDataSearchMarkers]);

  // When a user toggles marker visibility, re-emit the filtered marker list.
  // Geocoding results already trigger emissions via handle*Markers callbacks.
  useEffect(() => {
    emitAllMarkers();
  }, [mapVisibilityByIdentifier]);

  const handleToggleMapVisibility = useCallback((identifier: DataSearchMarkerIdentifier) => {
    setMapVisibilityByIdentifier((prev) => {
      const nextVisible = !prev[identifier];
      const next = { ...prev, [identifier]: nextVisible };
      return next;
    });
  }, []);

  const handlePersonMarkers = useCallback(
    (markers: DataSearchMarker[]) => {
      markersMapRef.current[DATA_SEARCH_PERSON_IDENTIFIER] = markers;
      emitAllMarkers();
    },
    [emitAllMarkers],
  );
  const handleHoaMarkers = useCallback(
    (markers: DataSearchMarker[]) => {
      markersMapRef.current[DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER] = markers;
      emitAllMarkers();
    },
    [emitAllMarkers],
  );
  const handleBusinessMarkers = useCallback(
    (markers: DataSearchMarker[]) => {
      markersMapRef.current[DATA_SEARCH_BUSINESS_IDENTIFIER] = markers;
      emitAllMarkers();
    },
    [emitAllMarkers],
  );
  const handleNgoMarkers = useCallback(
    (markers: DataSearchMarker[]) => {
      markersMapRef.current[DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER] = markers;
      emitAllMarkers();
    },
    [emitAllMarkers],
  );
  const handleSchoolMarkers = useCallback(
    (markers: DataSearchMarker[]) => {
      markersMapRef.current[DATA_SEARCH_SCHOOL_IDENTIFIER] = markers;
      emitAllMarkers();
    },
    [emitAllMarkers],
  );

  // Clear markers for unchecked data types
  useEffect(() => {
    let changed = false;
    for (const identifier of DATA_SEARCH_MARKER_IDENTIFIERS) {
      if (!appliedMarkerIdentifiers.has(identifier) && markersMapRef.current[identifier].length > 0) {
        markersMapRef.current[identifier] = [];
        changed = true;
      }
    }
    if (changed) emitAllMarkers();
  }, [appliedMarkerIdentifiers, emitAllMarkers]);

  const dataTypesMultiSelect = (
    <MultiSelectPopover<DataTypeItem>
      items={dataTypes}
      getItemId={(item) => item.id}
      getItemLabel={(item) => item.name}
      selectedIds={selectedDataTypeIds}
      onSelectionChange={setSelectedDataTypeIds}
      onApply={handleApplyDataTypes}
      triggerLabel="Data types"
      triggerIcon={<Filter className="h-4 w-4" />}
      emptyMessage="No data types"
      isLoading={dataTypesLoading}
      open={dataTypesPopoverOpen}
      onOpenChange={setDataTypesPopoverOpen}
      align="end"
      renderTriggerBadge={(count) => (
        <Badge variant="secondary" className="ml-0.5 text-xs">
          {count}
        </Badge>
      )}
      ariaLabel="Filter by data type"
    />
  );

  const hasAnyDataType =
    hasServiceReviews ||
    hasPersons ||
    hasHomeOwnerAssociations ||
    hasNonGovernmentalOrganizations ||
    hasSchools ||
    hasBusinesses;
  const isInitialLoading = dataTypesLoading && dataTypes.length === 0;

  if (isInitialLoading) {
    return (
      <div className="h-full flex flex-col" role="region" aria-label="Data search results">
        <PanelHeader
          icon={<Skeleton className="h-5 w-5 rounded" />}
          title={<Skeleton className="h-6 w-32" />}
          right={dataTypesMultiSelect}
        />
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasAnyDataType) {
    return (
      <div className="h-full flex flex-col" role="region" aria-label="Data search results">
        <PanelHeader title="Data Search Results" locationLabel={locationLabel} right={dataTypesMultiSelect} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Types Selected</h3>
            <p className="text-gray-600">Select one or more data types above to view results.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" role="region" aria-label="Data search results">
      <PanelHeader title="Data Search Results" locationLabel={locationLabel} right={dataTypesMultiSelect} />
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {hasServiceReviews && (
          <ServiceReviewsCard
            locationFilter={locationFilter}
            locationLabel={locationLabel}
            viewMode={viewMode}
            dataTypeIds={appliedDataTypes
              .filter((dt) => dt.identifier === DATA_SEARCH_SERVICE_REVIEWS_IDENTIFIER)
              .map((dt) => dt.id)}
            onRequestSubmitReview={onRequestSubmitReview}
          />
        )}
        {hasPersons && (
          <PersonsCard
            viewMode={viewMode}
            personMarkerUrl={
              appliedDataTypes.find((dt) => dt.identifier === DATA_SEARCH_PERSON_IDENTIFIER)?.marker ?? null
            }
            mapVisible={mapVisibilityByIdentifier[DATA_SEARCH_PERSON_IDENTIFIER]}
            onToggleMapVisible={() => handleToggleMapVisibility(DATA_SEARCH_PERSON_IDENTIFIER)}
            onMarkersReady={handlePersonMarkers}
          />
        )}
        {hasHomeOwnerAssociations && (
          <HomeOwnerAssociationsCard
            viewMode={viewMode}
            markerUrl={
              appliedDataTypes.find((dt) => dt.identifier === DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER)?.marker ??
              null
            }
            mapVisible={mapVisibilityByIdentifier[DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER]}
            onToggleMapVisible={() => handleToggleMapVisibility(DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER)}
            onMarkersReady={handleHoaMarkers}
          />
        )}
        {hasBusinesses && (
          <BusinessesCard
            viewMode={viewMode}
            markerUrl={appliedDataTypes.find((dt) => dt.identifier === DATA_SEARCH_BUSINESS_IDENTIFIER)?.marker ?? null}
            mapVisible={mapVisibilityByIdentifier[DATA_SEARCH_BUSINESS_IDENTIFIER]}
            onToggleMapVisible={() => handleToggleMapVisibility(DATA_SEARCH_BUSINESS_IDENTIFIER)}
            onMarkersReady={handleBusinessMarkers}
          />
        )}
        {hasNonGovernmentalOrganizations && (
          <NonGovernmentalOrganizationsCard
            viewMode={viewMode}
            markerUrl={
              appliedDataTypes.find((dt) => dt.identifier === DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER)
                ?.marker ?? null
            }
            mapVisible={mapVisibilityByIdentifier[DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER]}
            onToggleMapVisible={() => handleToggleMapVisibility(DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER)}
            onMarkersReady={handleNgoMarkers}
          />
        )}
        {hasSchools && (
          <SchoolsCard
            viewMode={viewMode}
            markerUrl={appliedDataTypes.find((dt) => dt.identifier === DATA_SEARCH_SCHOOL_IDENTIFIER)?.marker ?? null}
            mapVisible={mapVisibilityByIdentifier[DATA_SEARCH_SCHOOL_IDENTIFIER]}
            onToggleMapVisible={() => handleToggleMapVisibility(DATA_SEARCH_SCHOOL_IDENTIFIER)}
            onMarkersReady={handleSchoolMarkers}
          />
        )}
      </div>
    </div>
  );
}

interface ServiceReviewsCardProps {
  locationFilter: { state: string | null; city: string | null };
  locationLabel: string | null;
  viewMode: "grid" | "list";
  dataTypeIds?: string[];
  onRequestSubmitReview?: (state: string | null, city: string | null) => void;
}

function ServiceReviewsCard({
  locationFilter,
  locationLabel,
  viewMode,
  dataTypeIds = [],
  onRequestSubmitReview,
}: ServiceReviewsCardProps) {
  const [data, setData] = useState<{
    isFetching: boolean;
    data: SMRCDocument[];
    page: number;
    lastPage: number;
    totalCount: number;
  }>({ isFetching: true, data: [], page: 1, lastPage: 1, totalCount: 0 });
  const fetchingRef = useRef(false);
  const currentPageRef = useRef(0);

  const fetchServiceReviews = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(data.page),
      perPage: String(PER_PAGE),
    });
    if (locationFilter.state) params.set("state", locationFilter.state);
    if (locationFilter.city) params.set("city", locationFilter.city);
    if (dataTypeIds.length > 0) params.set("dataTypeIds", dataTypeIds.join(","));
    const url = `/api/smrc?${params.toString()}`;
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((resData) => {
        const page = resData.meta?.page ?? resData.page ?? data.page;
        const lastPage = resData.meta?.total_pages ?? resData.lastPage ?? 1;
        const totalCount = resData.meta?.total ?? resData.totalCount ?? 0;
        currentPageRef.current = page;
        fetchingRef.current = false;
        setData({
          data: Array.isArray(resData.data) ? resData.data : [],
          page,
          lastPage,
          totalCount,
          isFetching: false,
        });
      })
      .catch(() => {
        fetchingRef.current = false;
        setData((prev) => ({ ...prev, isFetching: false }));
      });
  }, [data.page, locationFilter.state, locationFilter.city, dataTypeIds.join(",")]);

  useEffect(() => {
    currentPageRef.current = 0;
    setData((prev) => ({ ...prev, page: 1 }));
  }, [locationFilter.state, locationFilter.city, dataTypeIds.join(",")]);

  useEffect(() => {
    if (currentPageRef.current === data.page || fetchingRef.current) return;
    fetchingRef.current = true;
    fetchServiceReviews();
  }, [data.page, locationFilter.state, locationFilter.city, dataTypeIds.join(","), fetchServiceReviews]);

  const setPage = (p: number) => setData((prev) => ({ ...prev, page: p }));
  const total = data.totalCount;
  const totalPages = data.lastPage;
  const hasPrev = data.page > 1;
  const hasNext = data.page < totalPages;
  const from = (data.page - 1) * PER_PAGE + 1;
  const to = Math.min(data.page * PER_PAGE, total);

  if (data.isFetching && data.data.length === 0) {
    return (
      <Card>
        <CardHeader title="Service Reviews" />
        <CardContent className="p-4">
          <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4" : "space-y-0"}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-4 pt-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          Service Reviews{" "}
          {total > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({total} {total === 1 ? "review" : "reviews"})
            </span>
          )}
        </h3>
      </div>
      <CardContent className="p-4">
        {data.data.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {locationLabel ? `No service reviews in ${locationLabel}.` : "No service reviews yet."}
            </p>
            {onRequestSubmitReview && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onRequestSubmitReview(locationFilter.state, locationFilter.city)}
              >
                Submit a review
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-3" : "space-y-0"}>
              {data.data.map((el) => (
                <Link key={el.id} href={`/dashboard/show-review/${el.id}`}>
                  <div
                    className={
                      viewMode === "grid"
                        ? "rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                        : "p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate">{el.agencyName ?? "—"}</h4>
                        <p className="text-sm text-gray-600">{el.agencyLevel ?? "—"}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {residencyLabel(el)}
                        </Badge>
                        {el.state && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {[el.city, el.state].filter(Boolean).join(", ")}
                          </div>
                        )}
                        {el.createdAt && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(el.createdAt), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-gray-600">
                  Showing {from}–{to} of {total}
                </span>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page - 1)} disabled={!hasPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page + 1)} disabled={!hasNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface CardHeaderProps {
  title: string;
}

function CardHeader({ title }: CardHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

/** Build address string from person's residence fields. Returns null if no address. */
function personAddressString(p: Person): string | null {
  const parts: string[] = [];
  if (p.cityOfResidence?.trim()) parts.push(p.cityOfResidence.trim());
  if (p.stateOfResidence?.trim()) parts.push(p.stateOfResidence.trim());
  if (p.zipCode?.trim()) parts.push(p.zipCode.trim());
  return parts.length > 0 ? parts.join(", ") + ", USA" : null;
}

function hasAddress(p: Person): boolean {
  return !!(p.stateOfResidence?.trim() || p.cityOfResidence?.trim() || p.zipCode?.trim());
}

interface PersonsCardProps {
  viewMode: "grid" | "list";
  personMarkerUrl: string | null;
  mapVisible: boolean;
  onToggleMapVisible: () => void;
  onMarkersReady?: (markers: DataSearchMarker[]) => void;
}

interface PaginatedApiResponse<T> {
  data: T[];
  page?: number;
  lastPage?: number;
  totalCount?: number;
  meta?: {
    total?: number;
    total_pages?: number;
    page?: number;
  };
}

function PersonsCard({ viewMode, personMarkerUrl, mapVisible, onToggleMapVisible, onMarkersReady }: PersonsCardProps) {
  const [data, setData] = useState<{
    isFetching: boolean;
    data: Person[];
    page: number;
    lastPage: number;
    totalCount: number;
  }>({ isFetching: true, data: [], page: 1, lastPage: 1, totalCount: 0 });
  const fetchingRef = useRef(false);

  const fetchPersons = useCallback(async () => {
    fetchingRef.current = true;
    try {
      const params = new URLSearchParams({ page: String(data.page), perPage: String(PER_PAGE) });
      const res = await api.get<PaginatedApiResponse<Person>>(`persons?${params.toString()}`);
      const payload = res.data;
      const list = Array.isArray(payload.data) ? payload.data : [];
      const total = payload.meta?.total ?? payload.totalCount ?? 0;
      const totalPages = payload.meta?.total_pages ?? payload.lastPage ?? 1;
      const page = payload.meta?.page ?? payload.page ?? data.page;
      setData({ data: list, page, lastPage: totalPages, totalCount: total, isFetching: false });
    } catch {
      setData((prev) => ({ ...prev, isFetching: false, data: [] }));
    } finally {
      fetchingRef.current = false;
    }
  }, [data.page]);

  useEffect(() => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    fetchPersons();
  }, [fetchPersons]);

  // Geocode persons with address and report markers for the map (only when marker URL and callback exist)
  useEffect(() => {
    if (!personMarkerUrl || !onMarkersReady || !mapVisible) return;
    const personsWithAddress = data.data.filter(hasAddress);
    if (personsWithAddress.length === 0) {
      onMarkersReady([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const markers: DataSearchMarker[] = [];
      for (const p of personsWithAddress) {
        if (cancelled) return;
        const addr = personAddressString(p);
        if (!addr) continue;
        const coords = await forwardGeocode(addr);
        if (cancelled) return;
        if (coords) {
          markers.push({
            lat: coords.lat,
            lng: coords.lng,
            id: p.id,
            label: personDisplayName(p),
            markerUrl: personMarkerUrl,
            dataTypeIdentifier: DATA_SEARCH_PERSON_IDENTIFIER,
            data: p,
          });
        }
      }
      if (!cancelled) onMarkersReady(markers);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [data.data, personMarkerUrl, onMarkersReady, mapVisible]);

  const setPage = (p: number) => setData((prev) => ({ ...prev, page: p }));
  const total = data.totalCount;
  const totalPages = data.lastPage;
  const hasPrev = data.page > 1;
  const hasNext = data.page < totalPages;
  const from = (data.page - 1) * PER_PAGE + 1;
  const to = Math.min(data.page * PER_PAGE, total);

  if (data.isFetching && data.data.length === 0) {
    return (
      <Card>
        <CardHeader title="Persons" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Persons
            {total > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({total} {total === 1 ? "person" : "persons"})
              </span>
            )}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label={mapVisible ? "Hide persons markers on map" : "Show persons markers on map"}
            aria-pressed={mapVisible}
            onClick={onToggleMapVisible}
          >
            {mapVisible ? <Eye className="h-4 w-4 text-gray-700" /> : <EyeOff className="h-4 w-4 text-gray-700" />}
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        {data.data.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No persons found.</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-3" : "space-y-0"}>
              {data.data.map((p) => (
                <Link key={p.id} href={`/dashboard/persons/${p.id}`}>
                  <div
                    className={
                      viewMode === "grid"
                        ? "rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                        : "p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {personDisplayName(p).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate">{personDisplayName(p)}</h4>
                        {(p.stateOfResidence || p.cityOfResidence) && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {[p.cityOfResidence, p.stateOfResidence].filter(Boolean).join(", ")}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-gray-600">
                  Showing {from}–{to} of {total}
                </span>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page - 1)} disabled={!hasPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page + 1)} disabled={!hasNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface BusinessLocationLike {
  city?: { name?: string | null } | null;
  stateRegion?: {
    code?: string | null;
    name?: string | null;
    regionCode?: string | null;
    regionName?: string | null;
  } | null;
}

interface Business {
  id: number;
  name: string;
  city?: { name?: string | null } | null;
  stateRegion?: {
    code?: string | null;
    name?: string | null;
    regionCode?: string | null;
    regionName?: string | null;
  } | null;
  location?: BusinessLocationLike | null;
  website?: string | null;
}

interface NonGovernmentalOrganization {
  employerIdentificationNumber: string;
  name: string;
  ngoType?: string | null;
  // API payload fields use `cityName` / `regionCode` / `regionName` for NG0s.
  city?: { cityName?: string | null } | null;
  stateRegion?: { regionCode?: string | null; regionName?: string | null } | null;
}

interface HomeOwnerAssociation {
  id: number;
  name: string;
  location?: {
    stateRegion?: { code?: string | null; name?: string | null } | null;
    zipCode?: { code?: string | null } | null;
    locationType?: { name?: string | null } | null;
  } | null;
  website?: string | null;
}

interface School {
  id: number;
  schoolId: number;
  schoolName: string;
  schoolType: string;
  districtId: number;
  cityId: number;
  stateRegionId: number;
  createdAt: string;
  updatedAt: string;
  district?: {
    id: number;
    districtId: number;
    districtName: string;
    cityId: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  city?: {
    id: number;
    cityName: string;
    population: number;
    countyId: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  stateRegion?: {
    id: number;
    regionName: string;
    regionCode: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface SimpleCardProps {
  viewMode: "grid" | "list";
  markerUrl?: string | null;
  mapVisible: boolean;
  onToggleMapVisible: () => void;
  onMarkersReady?: (markers: DataSearchMarker[]) => void;
}

function formatLocationFromRelations(relations?: {
  city?: { name?: string | null; cityName?: string | null } | null;
  stateRegion?: {
    code?: string | null;
    name?: string | null;
    regionCode?: string | null;
    regionName?: string | null;
  } | null;
}) {
  if (!relations) return null;
  const city = relations.city?.name?.trim() ?? relations.city?.cityName?.trim();
  const state =
    relations.stateRegion?.code?.trim() ??
    relations.stateRegion?.name?.trim() ??
    relations.stateRegion?.regionName?.trim() ??
    relations.stateRegion?.regionCode?.trim();
  const parts = [city, state].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

/** Build a geocodable address string from city/state relations, appending ", USA". */
function entityAddressFromRelations(relations?: {
  city?: { name?: string | null; cityName?: string | null } | null;
  stateRegion?: {
    code?: string | null;
    name?: string | null;
    regionCode?: string | null;
    regionName?: string | null;
  } | null;
}): string | null {
  const label = formatLocationFromRelations(relations);
  return label ? `${label}, USA` : null;
}

function HomeOwnerAssociationsCard({
  viewMode,
  markerUrl,
  mapVisible,
  onToggleMapVisible,
  onMarkersReady,
}: SimpleCardProps) {
  const [data, setData] = useState<{
    isFetching: boolean;
    data: HomeOwnerAssociation[];
    page: number;
    lastPage: number;
    totalCount: number;
  }>({ isFetching: true, data: [], page: 1, lastPage: 1, totalCount: 0 });
  const fetchingRef = useRef(false);

  const fetchHoas = useCallback(async () => {
    fetchingRef.current = true;
    try {
      const params = new URLSearchParams({ page: String(data.page), perPage: String(PER_PAGE) });
      const res = await api.get<PaginatedApiResponse<HomeOwnerAssociation>>(
        `home_owner_associations?${params.toString()}`,
      );
      const payload = res.data;
      const list = Array.isArray(payload.data) ? payload.data : [];
      const total = payload.meta?.total ?? payload.totalCount ?? 0;
      const totalPages = payload.meta?.total_pages ?? payload.lastPage ?? 1;
      const page = payload.meta?.page ?? payload.page ?? data.page;
      setData({ data: list, page, lastPage: totalPages, totalCount: total, isFetching: false });
    } catch {
      setData((prev) => ({ ...prev, isFetching: false, data: [] }));
    } finally {
      fetchingRef.current = false;
    }
  }, [data.page]);

  useEffect(() => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    fetchHoas();
  }, [fetchHoas]);

  useEffect(() => {
    if (!markerUrl || !onMarkersReady || !mapVisible) return;
    const items = data.data;
    if (items.length === 0) {
      onMarkersReady([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const markers: DataSearchMarker[] = [];
      for (const hoa of items) {
        if (cancelled) return;
        const addr =
          entityAddressFromRelations({
            city: { name: hoa.location?.zipCode?.code ?? null },
            stateRegion: hoa.location?.stateRegion ?? undefined,
          }) ?? (hoa.location?.locationType?.name ? `${hoa.location.locationType.name}, USA` : null);
        if (!addr) continue;
        const coords = await forwardGeocode(addr);
        if (cancelled) return;
        if (coords) {
          markers.push({
            lat: coords.lat,
            lng: coords.lng,
            id: `hoa-${hoa.id}`,
            label: hoa.name,
            markerUrl,
            dataTypeIdentifier: DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER,
            data: hoa,
          });
        }
      }
      if (!cancelled) onMarkersReady(markers);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [data.data, markerUrl, onMarkersReady, mapVisible]);

  const setPage = (p: number) => setData((prev) => ({ ...prev, page: p }));
  const total = data.totalCount;
  const totalPages = data.lastPage;
  const hasPrev = data.page > 1;
  const hasNext = data.page < totalPages;
  const from = (data.page - 1) * PER_PAGE + 1;
  const to = Math.min(data.page * PER_PAGE, total);

  if (data.isFetching && data.data.length === 0) {
    return (
      <Card>
        <CardHeader title="Homeowner Associations" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-5 w-52" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Home className="h-4 w-4 text-emerald-600" />
            Homeowner Associations
            {total > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({total} {total === 1 ? "association" : "associations"})
              </span>
            )}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label={
              mapVisible ? "Hide homeowner association markers on map" : "Show homeowner association markers on map"
            }
            aria-pressed={mapVisible}
            onClick={onToggleMapVisible}
          >
            {mapVisible ? <Eye className="h-4 w-4 text-gray-700" /> : <EyeOff className="h-4 w-4 text-gray-700" />}
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        {data.data.length === 0 ? (
          <div className="py-8 text-center">
            <Home className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No homeowner associations found.</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-3" : "space-y-0"}>
              {data.data.map((hoa) => {
                const locationLabel =
                  formatLocationFromRelations({
                    city: { name: hoa.location?.zipCode?.code ?? null },
                    stateRegion: hoa.location?.stateRegion ?? undefined,
                  }) ?? hoa.location?.locationType?.name;
                return (
                  <Link key={hoa.id} href={`/dashboard/home-owner-associations/${hoa.id}`}>
                    <div
                      className={
                        viewMode === "grid"
                          ? "rounded-lg border border-emerald-100 bg-emerald-50/40 p-3 hover:bg-emerald-50 transition-colors"
                          : "p-3 border-b border-gray-100 last:border-b-0 hover:bg-emerald-50/40"
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          {hoa.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{hoa.name}</h4>
                          {locationLabel && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{locationLabel}</span>
                            </div>
                          )}
                          {hoa.website && <p className="text-xs text-emerald-700 mt-0.5 truncate">{hoa.website}</p>}
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-gray-600">
                  Showing {from}–{to} of {total}
                </span>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page - 1)} disabled={!hasPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page + 1)} disabled={!hasNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BusinessesCard({ viewMode, markerUrl, mapVisible, onToggleMapVisible, onMarkersReady }: SimpleCardProps) {
  const [data, setData] = useState<{
    isFetching: boolean;
    data: Business[];
    page: number;
    lastPage: number;
    totalCount: number;
  }>({ isFetching: true, data: [], page: 1, lastPage: 1, totalCount: 0 });
  const fetchingRef = useRef(false);

  const fetchBusinesses = useCallback(async () => {
    fetchingRef.current = true;
    try {
      const params = new URLSearchParams({ page: String(data.page), perPage: String(PER_PAGE) });
      const res = await api.get<PaginatedApiResponse<Business>>(`businesses?${params.toString()}`);
      const payload = res.data;
      const list = Array.isArray(payload.data) ? payload.data : [];
      const total = payload.meta?.total ?? payload.totalCount ?? 0;
      const totalPages = payload.meta?.total_pages ?? payload.lastPage ?? 1;
      const page = payload.meta?.page ?? payload.page ?? data.page;
      setData({ data: list, page, lastPage: totalPages, totalCount: total, isFetching: false });
    } catch {
      setData((prev) => ({ ...prev, isFetching: false, data: [] }));
    } finally {
      fetchingRef.current = false;
    }
  }, [data.page]);

  useEffect(() => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    if (!markerUrl || !onMarkersReady || !mapVisible) return;
    const items = data.data;
    if (items.length === 0) {
      onMarkersReady([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const markers: DataSearchMarker[] = [];
      for (const b of items) {
        if (cancelled) return;
        const businessStateRegion = b.stateRegion ?? b.location?.stateRegion ?? null;
        const stateRegionForBusiness = businessStateRegion
          ? {
              code: businessStateRegion.regionCode ?? businessStateRegion.code ?? null,
              name: businessStateRegion.regionName ?? businessStateRegion.name ?? null,
            }
          : null;
        const addr = entityAddressFromRelations({
          city: b.city ?? b.location?.city,
          stateRegion: stateRegionForBusiness,
        });
        if (!addr) continue;
        const coords = await forwardGeocode(addr);
        if (cancelled) return;
        if (coords) {
          markers.push({
            lat: coords.lat,
            lng: coords.lng,
            id: `biz-${b.id}`,
            label: b.name,
            markerUrl,
            dataTypeIdentifier: DATA_SEARCH_BUSINESS_IDENTIFIER,
            data: b,
          });
        }
      }
      if (!cancelled) onMarkersReady(markers);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [data.data, markerUrl, onMarkersReady, mapVisible]);

  const setPage = (p: number) => setData((prev) => ({ ...prev, page: p }));
  const total = data.totalCount;
  const totalPages = data.lastPage;
  const hasPrev = data.page > 1;
  const hasNext = data.page < totalPages;
  const from = (data.page - 1) * PER_PAGE + 1;
  const to = Math.min(data.page * PER_PAGE, total);

  if (data.isFetching && data.data.length === 0) {
    return (
      <Card>
        <CardHeader title="Businesses" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            Businesses
            {total > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({total} {total === 1 ? "business" : "businesses"})
              </span>
            )}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label={mapVisible ? "Hide business markers on map" : "Show business markers on map"}
            aria-pressed={mapVisible}
            onClick={onToggleMapVisible}
          >
            {mapVisible ? <Eye className="h-4 w-4 text-gray-700" /> : <EyeOff className="h-4 w-4 text-gray-700" />}
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        {data.data.length === 0 ? (
          <div className="py-8 text-center">
            <Building2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No businesses found.</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-3" : "space-y-0"}>
              {data.data.map((b) => {
                const businessStateRegion = b.stateRegion ?? b.location?.stateRegion ?? null;
                const stateRegionForBusiness = businessStateRegion
                  ? {
                      code: businessStateRegion.regionCode ?? businessStateRegion.code ?? null,
                      name: businessStateRegion.regionName ?? businessStateRegion.name ?? null,
                    }
                  : null;
                const locationLabel =
                  formatLocationFromRelations({
                    city: b.city ?? b.location?.city,
                    stateRegion: stateRegionForBusiness,
                  }) ?? null;
                return (
                  <Link key={b.id} href={`/dashboard/businesses/${b.id}`}>
                    <div
                      className={
                        viewMode === "grid"
                          ? "rounded-lg border border-blue-100 bg-blue-50/40 p-3 hover:bg-blue-50 transition-colors"
                          : "p-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50/40"
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                          {b.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{b.name}</h4>
                          {locationLabel && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{locationLabel}</span>
                            </div>
                          )}
                          {b.website && <p className="text-xs text-blue-700 mt-0.5 truncate">{b.website}</p>}
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-gray-600">
                  Showing {from}–{to} of {total}
                </span>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page - 1)} disabled={!hasPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page + 1)} disabled={!hasNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function NonGovernmentalOrganizationsCard({
  viewMode,
  markerUrl,
  mapVisible,
  onToggleMapVisible,
  onMarkersReady,
}: SimpleCardProps) {
  const [data, setData] = useState<{
    isFetching: boolean;
    data: NonGovernmentalOrganization[];
    page: number;
    lastPage: number;
    totalCount: number;
  }>({ isFetching: true, data: [], page: 1, lastPage: 1, totalCount: 0 });
  const fetchingRef = useRef(false);

  const fetchNgos = useCallback(async () => {
    fetchingRef.current = true;
    try {
      const params = new URLSearchParams({ page: String(data.page), perPage: String(PER_PAGE) });
      const res = await api.get<PaginatedApiResponse<NonGovernmentalOrganization>>(
        `non_governmental_organizations?${params.toString()}`,
      );
      const payload = res.data;
      const list = Array.isArray(payload.data) ? payload.data : [];
      const total = payload.meta?.total ?? payload.totalCount ?? 0;
      const totalPages = payload.meta?.total_pages ?? payload.lastPage ?? 1;
      const page = payload.meta?.page ?? payload.page ?? data.page;
      setData({ data: list, page, lastPage: totalPages, totalCount: total, isFetching: false });
    } catch {
      setData((prev) => ({ ...prev, isFetching: false, data: [] }));
    } finally {
      fetchingRef.current = false;
    }
  }, [data.page]);

  useEffect(() => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    fetchNgos();
  }, [fetchNgos]);

  useEffect(() => {
    if (!markerUrl || !onMarkersReady || !mapVisible) return;
    const items = data.data;
    if (items.length === 0) {
      onMarkersReady([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const markers: DataSearchMarker[] = [];
      for (const ngo of items) {
        if (cancelled) return;
        const addr = entityAddressFromRelations({
          city: ngo.city,
          stateRegion: ngo.stateRegion,
        });
        if (!addr) continue;
        const coords = await forwardGeocode(addr);
        if (cancelled) return;
        if (coords) {
          markers.push({
            lat: coords.lat,
            lng: coords.lng,
            id: `ngo-${ngo.employerIdentificationNumber}`,
            label: ngo.name,
            markerUrl,
            dataTypeIdentifier: DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER,
            data: ngo,
          });
        }
      }
      if (!cancelled) onMarkersReady(markers);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [data.data, markerUrl, onMarkersReady, mapVisible]);

  const setPage = (p: number) => setData((prev) => ({ ...prev, page: p }));
  const total = data.totalCount;
  const totalPages = data.lastPage;
  const hasPrev = data.page > 1;
  const hasNext = data.page < totalPages;
  const from = (data.page - 1) * PER_PAGE + 1;
  const to = Math.min(data.page * PER_PAGE, total);

  if (data.isFetching && data.data.length === 0) {
    return (
      <Card>
        <CardHeader title="Non-governmental Organizations" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-5 w-56" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Handshake className="h-4 w-4 text-purple-600" />
            Non-governmental Organizations
            {total > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({total} {total === 1 ? "organization" : "organizations"})
              </span>
            )}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label={mapVisible ? "Hide NGO markers on map" : "Show NGO markers on map"}
            aria-pressed={mapVisible}
            onClick={onToggleMapVisible}
          >
            {mapVisible ? <Eye className="h-4 w-4 text-gray-700" /> : <EyeOff className="h-4 w-4 text-gray-700" />}
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        {data.data.length === 0 ? (
          <div className="py-8 text-center">
            <Handshake className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No non-governmental organizations found.</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-3" : "space-y-0"}>
              {data.data.map((ngo) => {
                const locationLabel = formatLocationFromRelations({
                  city: ngo.city,
                  stateRegion: ngo.stateRegion,
                });
                return (
                  <Link
                    key={ngo.employerIdentificationNumber}
                    href={`/dashboard/non-governmental-organizations/${ngo.employerIdentificationNumber}`}
                  >
                    <div
                      className={
                        viewMode === "grid"
                          ? "rounded-lg border border-purple-100 bg-purple-50/40 p-3 hover:bg-purple-50 transition-colors"
                          : "p-3 border-b border-gray-100 last:border-b-0 hover:bg-purple-50/40"
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                          {ngo.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{ngo.name}</h4>
                          {ngo.ngoType && <p className="text-xs text-purple-700 mt-0.5 truncate">{ngo.ngoType}</p>}
                          {locationLabel && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{locationLabel}</span>
                            </div>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-gray-600">
                  Showing {from}–{to} of {total}
                </span>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page - 1)} disabled={!hasPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page + 1)} disabled={!hasNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SchoolsCard({ viewMode, markerUrl, mapVisible, onToggleMapVisible, onMarkersReady }: SimpleCardProps) {
  const [data, setData] = useState<{
    isFetching: boolean;
    data: School[];
    page: number;
    lastPage: number;
    totalCount: number;
  }>({ isFetching: true, data: [], page: 1, lastPage: 1, totalCount: 0 });
  const fetchingRef = useRef(false);

  const fetchSchools = useCallback(async () => {
    fetchingRef.current = true;
    try {
      const params = new URLSearchParams({ page: String(data.page), perPage: String(PER_PAGE) });
      const res = await api.get<PaginatedApiResponse<School>>(`schools?${params.toString()}`);
      const payload = res.data;
      const list = Array.isArray(payload.data) ? payload.data : [];
      const total = payload.meta?.total ?? payload.totalCount ?? 0;
      const totalPages = payload.meta?.total_pages ?? payload.lastPage ?? 1;
      const page = payload.meta?.page ?? payload.page ?? data.page;
      setData({ data: list, page, lastPage: totalPages, totalCount: total, isFetching: false });
    } catch {
      setData((prev) => ({ ...prev, isFetching: false, data: [] }));
    } finally {
      fetchingRef.current = false;
    }
  }, [data.page]);

  useEffect(() => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    if (!markerUrl || !onMarkersReady || !mapVisible) return;
    const items = data.data;
    if (items.length === 0) {
      onMarkersReady([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const markers: DataSearchMarker[] = [];
      for (const school of items) {
        if (cancelled) return;
        const addr = entityAddressFromRelations({
          city: school.city ? { name: school.city.cityName } : null,
          stateRegion: school.stateRegion
            ? { code: school.stateRegion.regionCode, name: school.stateRegion.regionName }
            : null,
        });
        if (!addr) continue;
        const coords = await forwardGeocode(addr);
        if (cancelled) return;
        if (coords) {
          markers.push({
            lat: coords.lat,
            lng: coords.lng,
            id: `school-${school.id}`,
            label: school.schoolName,
            markerUrl,
            dataTypeIdentifier: DATA_SEARCH_SCHOOL_IDENTIFIER,
            data: school,
          });
        }
      }
      if (!cancelled) onMarkersReady(markers);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [data.data, markerUrl, onMarkersReady, mapVisible]);

  const setPage = (p: number) => setData((prev) => ({ ...prev, page: p }));
  const total = data.totalCount;
  const totalPages = data.lastPage;
  const hasPrev = data.page > 1;
  const hasNext = data.page < totalPages;
  const from = (data.page - 1) * PER_PAGE + 1;
  const to = Math.min(data.page * PER_PAGE, total);

  if (data.isFetching && data.data.length === 0) {
    return (
      <Card>
        <CardHeader title="Schools" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <SchoolIcon className="h-4 w-4 text-amber-600" />
            Schools
            {total > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({total} {total === 1 ? "school" : "schools"})
              </span>
            )}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label={mapVisible ? "Hide school markers on map" : "Show school markers on map"}
            aria-pressed={mapVisible}
            onClick={onToggleMapVisible}
          >
            {mapVisible ? <Eye className="h-4 w-4 text-gray-700" /> : <EyeOff className="h-4 w-4 text-gray-700" />}
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        {data.data.length === 0 ? (
          <div className="py-8 text-center">
            <SchoolIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No schools found.</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-3" : "space-y-0"}>
              {data.data.map((school) => {
                const locationLabel = formatLocationFromRelations({
                  city: school.city ? { name: school.city.cityName } : null,
                  stateRegion: school.stateRegion
                    ? { code: school.stateRegion.regionCode, name: school.stateRegion.regionName }
                    : null,
                });
                return (
                  <Link key={school.id} href={`/dashboard/schools/${school.id}`}>
                    <div
                      className={
                        viewMode === "grid"
                          ? "rounded-lg border border-amber-100 bg-amber-50/40 p-3 hover:bg-amber-50 transition-colors"
                          : "p-3 border-b border-gray-100 last:border-b-0 hover:bg-amber-50/40"
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          {school.schoolName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{school.schoolName}</h4>
                          <p className="text-xs text-amber-700 mt-0.5 truncate">{school.schoolType}</p>
                          {school.district?.districtName && (
                            <p className="text-xs text-gray-600 mt-0.5 truncate">{school.district.districtName}</p>
                          )}
                          {locationLabel && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{locationLabel}</span>
                            </div>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-gray-600">
                  Showing {from}–{to} of {total}
                </span>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page - 1)} disabled={!hasPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(data.page + 1)} disabled={!hasNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
