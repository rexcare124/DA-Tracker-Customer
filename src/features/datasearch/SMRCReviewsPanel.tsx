"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { format } from "date-fns";
import type { SMRCDocument } from "@/lib/firebase/smrc-types";
import { useAppSelector } from "@/state/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelectPopover } from "@/components/MultiSelectPopover";
import { FileText, MapPin, Calendar, ExternalLink, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataTypesStore, type DataTypeItem, type DataTypesState } from "@/store";

const PER_PAGE = 10;
/** Data type ID that enables SMRC reviews; only fetch when this is in applied filter */
const SMRC_REQUIRED_DATA_TYPE_ID = "4fd9b494-e1b8-46e7-a031-48b7efbe76c8";
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

interface SMRCReviewsPanelProps {
  /** When set, filter SMRC reviews to this location (reverse geocode to state/city) */
  searchLocation?: { lat: number; lng: number } | null;
  /** When set (e.g. from a pin click), use this for the "in X" label so it matches the popup location instead of reverse geocode */
  searchLocationLabel?: string | null;
  /** When "Submit a review" is clicked, call with current location (state, city) so the review form can prefill. */
  onRequestSubmitReview?: (state: string | null, city: string | null) => void;
}

/** Display label and initial for a review's author (we only have userId, no name/email in doc). */
function reviewerDisplay(userId: string | undefined): { label: string; initial: string } {
  if (!userId) return { label: "Reviewer", initial: "?" };
  const id = userId.trim();
  if (id.length >= 2) {
    return { label: "Reviewer", initial: id.slice(0, 2).toUpperCase() };
  }
  return { label: "Reviewer", initial: id ? id.toUpperCase() : "?" };
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
      <div className={`flex items-center justify-between mb-4`}>
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

export default function SMRCReviewsPanel({
  searchLocation = null,
  searchLocationLabel = null,
  onRequestSubmitReview,
}: SMRCReviewsPanelProps) {
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const currentPageRef = useRef(0);
  const fetchingRef = useRef(false);
  const [locationFilter, setLocationFilter] = useState<{
    state: string | null;
    city: string | null;
  }>({
    state: null,
    city: null,
  });
  const [data, setData] = useState<{
    isFetching: boolean;
    data: SMRCDocument[];
    page: number;
    lastPage: number;
    totalCount: number;
  }>({
    isFetching: true,
    data: [],
    page: 1,
    lastPage: 1,
    totalCount: 0,
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

  // Data types filter: list from Zustand store (hydrated on app load), local UI filter state
  const dataTypes = useDataTypesStore((s: DataTypesState) => s.items);
  const dataTypesLoading = useDataTypesStore((s: DataTypesState) => s.isLoading);
  const [selectedDataTypeIds, setSelectedDataTypeIds] = useState<Set<string>>(new Set());
  const [appliedDataTypeIds, setAppliedDataTypeIds] = useState<string[]>([]);
  const [dataTypesPopoverOpen, setDataTypesPopoverOpen] = useState(false);
  const dataTypesInitializedRef = useRef(false);

  // Initialize selected/applied with all data type IDs when store first populates
  useEffect(() => {
    if (dataTypes.length > 0 && !dataTypesInitializedRef.current) {
      dataTypesInitializedRef.current = true;
      const ids = dataTypes.map((dt: DataTypeItem) => dt.id);
      setAppliedDataTypeIds(ids);
      setSelectedDataTypeIds(new Set(ids));
    }
  }, [dataTypes]);

  const fetchServiceReviews = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(data.page),
      perPage: String(PER_PAGE),
    });
    if (locationFilter.state) params.set("state", locationFilter.state);
    if (locationFilter.city) params.set("city", locationFilter.city);
    if (appliedDataTypeIds.length > 0) {
      params.set("dataTypeIds", appliedDataTypeIds.join(","));
    }
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
  }, [data.page, locationFilter.state, locationFilter.city, appliedDataTypeIds]);

  const fetchData = useCallback(async () => {
    if (appliedDataTypeIds.includes(SMRC_REQUIRED_DATA_TYPE_ID)) {
      fetchServiceReviews();
    } else {
      fetchingRef.current = false;
      setData({
        isFetching: false,
        data: [],
        page: 1,
        lastPage: 1,
        totalCount: 0,
      });
    }
  }, [appliedDataTypeIds, fetchServiceReviews]);

  const handleApplyDataTypes = useCallback((ids: string[]) => {
    setAppliedDataTypeIds(ids);
    setDataTypesPopoverOpen(false);
  }, []);

  // Reset to page 1 when location or data type filter changes
  useEffect(() => {
    setData((prev) => ({ ...prev, page: 1 }));
    currentPageRef.current = 0;
  }, [locationFilter.state, locationFilter.city, appliedDataTypeIds.join(",")]);

  useEffect(() => {
    if (currentPageRef.current === data.page || fetchingRef.current) return;
    fetchingRef.current = true;

    fetchData();
  }, [data.page, locationFilter.state, locationFilter.city, appliedDataTypeIds.join(",")]);

  const setPage = (page: number) => {
    setData((prev) => ({ ...prev, page }));
  };

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

  // Sync selected IDs from applied when opening popover
  useEffect(() => {
    if (dataTypesPopoverOpen) {
      setSelectedDataTypeIds(new Set(appliedDataTypeIds));
    }
  }, [dataTypesPopoverOpen, appliedDataTypeIds]);

  // Loading state – same skeleton layout as Listings
  if (data.isFetching && data.data.length === 0) {
    return (
      <div className="h-full flex flex-col" role="region" aria-label="SMRC reviews">
        <PanelHeader
          icon={<Skeleton className="h-5 w-5 rounded" />}
          title={<Skeleton className="h-6 w-32" />}
          right={dataTypesMultiSelect}
        />
        <div className="flex-1 p-4 overflow-y-auto">
          <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4" : "space-y-0"}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // When searchLocationLabel is set (e.g. from pin click), use it so the panel matches the popup; otherwise use reverse-geocoded city/state
  const locationLabel =
    searchLocationLabel?.trim() ||
    (locationFilter.state || locationFilter.city
      ? [locationFilter.city, locationFilter.state].filter(Boolean).join(", ")
      : null);

  // Empty state – same style as Listings empty state
  if (!data.data.length) {
    return (
      <div className="h-full flex flex-col" role="region" aria-label="SMRC reviews">
        <PanelHeader title="No SMRC review yet" locationLabel={locationLabel} right={dataTypesMultiSelect} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-600 mb-4">
              {locationLabel ? `No SMRC reviews in ${locationLabel}.` : "No SMRC reviews yet."}
            </p>
            {onRequestSubmitReview ? (
              <Button
                variant="outline"
                onClick={() => onRequestSubmitReview(locationFilter.state, locationFilter.city)}
              >
                Submit a review
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/dashboard/got-smrc">Submit a review</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const total = data.totalCount;
  const totalPages = data.lastPage;
  const hasPrev = data.page > 1;
  const hasNext = data.page < totalPages;
  const limit = PER_PAGE;
  const from = (data.page - 1) * limit + 1;
  const to = Math.min(data.page * limit, total);

  return (
    <div className="h-full flex flex-col" role="region" aria-label="SMRC reviews">
      <PanelHeader
        title={
          <span aria-live="polite" aria-atomic="true">
            SMRC {total} {total === 1 ? "Review" : "Reviews"}
          </span>
        }
        locationLabel={locationLabel}
        right={dataTypesMultiSelect}
      />

      {/* Results – grid (cards) or list (rows) like Listings */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Grid / Box view */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            viewMode === "grid"
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none absolute inset-0"
          }`}
        >
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {data.data.map((el) => (
                <Link key={el.id} href={`/dashboard/show-review/${el.id}`}>
                  <Card className="cursor-pointer transition-all duration-200 hover:shadow-md h-full">
                    <CardContent className="p-4">
                      <div className={el.videoUrl?.trim() ? "flex gap-3 items-stretch" : "space-y-3"}>
                        <div className={el.videoUrl?.trim() ? "flex-1 min-w-0 space-y-3" : "space-y-3"}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 line-clamp-2">{el.agencyName ?? "—"}</h3>
                              <p className="text-sm text-gray-600 mt-1">{el.agencyLevel ?? "—"}</p>
                            </div>
                            <span className="shrink-0 inline-flex items-center justify-center text-gray-500">
                              <ExternalLink className="h-4 w-4" />
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{residencyLabel(el)}</Badge>
                          </div>
                          {el.state && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span className="line-clamp-1">
                                {[el.city, el.state].filter(Boolean).join(", ") || el.state}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-5 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 shrink-0">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-[#007acc] text-white text-xs">
                                  {reviewerDisplay(el.userId).initial}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                                {reviewerDisplay(el.userId).label}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              {el.createdAt && (
                                <>
                                  <Calendar className="h-4 w-4 shrink-0" />
                                  <span>{format(new Date(el.createdAt), "MMM d, yyyy")}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {el.videoUrl?.trim() && (
                          <div
                            className="w-1/3 min-w-0 shrink-0 rounded-[5px] overflow-hidden bg-black aspect-video"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <video
                              src={el.videoUrl}
                              controls
                              playsInline
                              muted
                              className="w-full h-full object-contain pointer-events-auto"
                              preload="metadata"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* List view */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            viewMode === "list"
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none absolute inset-0"
          }`}
        >
          <div className="p-4">
            {data.data.map((el) => (
              <Link
                key={el.id}
                href={`/dashboard/show-review/${el.id}`}
                className="block p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{el.agencyName ?? "—"}</h3>
                    <p className="text-sm text-gray-600">
                      {el.agencyLevel ?? "—"}
                      {el.state ? ` • ${el.state}` : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs pl-0">
                        {residencyLabel(el)}
                      </Badge>
                    </div>
                    {el.videoUrl?.trim() && (
                      <div
                        className="mt-2 rounded overflow-hidden bg-black w-1/3 min-w-[120px] max-w-[160px] aspect-video shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <video
                          src={el.videoUrl}
                          controls
                          playsInline
                          muted
                          className="w-full h-full object-contain pointer-events-auto"
                          preload="metadata"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-5 mt-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-[#007acc] text-white text-[10px]">
                            {reviewerDisplay(el.userId).initial}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                          {reviewerDisplay(el.userId).label}
                        </span>
                      </div>
                      {el.createdAt && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(el.createdAt), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center justify-center text-gray-500">
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination – same as Listings */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-600">
              Showing {from} to {to} of {total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => setPage(data.page - 1)} disabled={!hasPrev}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      size="sm"
                      variant={page === data.page ? "default" : "outline"}
                      onClick={() => setPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button size="sm" variant="outline" onClick={() => setPage(data.page + 1)} disabled={!hasNext}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
