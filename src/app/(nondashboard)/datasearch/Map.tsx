"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  GovernmentEntityFiltersState,
  SearchResponse,
  GovernmentEntityWithRelations,
} from "@/types/governmentEntityTypes";
import type { EntitySelectHandler, DataSearchMarker } from "@/types/search";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import GovernmentEntityPopupContainer from "@/components/GovernmentEntityPopupContainer";
import PopupContainer from "@/components/PopupContainer";
import { reverseGeocodeCountry } from "@/lib/geo/geocode";
import { ZoomIn, ZoomOut, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import { GEOGRAPHIC_DEFAULTS } from "@/lib/constants/search";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";
const DEFAULT_CENTER = {
  lat: GEOGRAPHIC_DEFAULTS.DEFAULT_COORDINATES.LATITUDE,
  lng: GEOGRAPHIC_DEFAULTS.DEFAULT_COORDINATES.LONGITUDE,
};

const US_MAINLAND_BOUNDS: google.maps.LatLngBoundsLiteral = {
  north: 47.5,
  south: 29,
  west: -118.0,
  east: -75,
};

interface MapProps {
  filters: GovernmentEntityFiltersState;
  results?: SearchResponse;
  onFilterChange: (filters: Partial<GovernmentEntityFiltersState>) => void;
  onEntitySelect?: EntitySelectHandler;
  /** Called when map or a pin is clicked to search SMRC reviews at that location (lng, lat). When a pin is clicked, locationLabel is the entity's display location (city, state) so the panel matches the popup. */
  onMapLocationSelect?: (lng: number, lat: number, locationLabel?: string) => void;
  /** Data search markers (e.g. persons with addresses) - rendered with data-type-specific marker icons */
  dataSearchMarkers?: DataSearchMarker[];
  isLoading?: boolean;
  /** Desktop-only layout: true when the "All Filters" left panel is open (affects map width). */
  isFiltersFullOpen?: boolean;
}

function getEntityCoords(entity: GovernmentEntityWithRelations): { lat: number; lng: number } | null {
  const lat = entity.latitude ?? entity.location?.latitude;
  const lng = entity.longitude ?? entity.location?.longitude;
  if (lat == null || lng == null || isNaN(Number(lat)) || isNaN(Number(lng))) return null;
  return { lat: Number(lat), lng: Number(lng) };
}

/** Build location string from entity (city, county, state) to match popup display */
function getEntityLocationLabel(entity: GovernmentEntityWithRelations): string {
  const parts: string[] = [];
  if (entity.city?.cityName) parts.push(entity.city.cityName);
  if (entity.county?.countyName) parts.push(`${entity.county.countyName} County`);
  if (entity.state?.stateName) parts.push(entity.state.stateName);
  return parts.join(", ") || "";
}

/** Convert lat/lng to pixel position relative to map container using Google Maps projection */
function latLngToPixel(
  map: google.maps.Map,
  container: HTMLDivElement,
  lat: number,
  lng: number,
): { x: number; y: number } | null {
  const projection = map.getProjection();
  const bounds = map.getBounds();
  if (!projection || !bounds) return null;
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const topRight = projection.fromLatLngToPoint(ne);
  const bottomLeft = projection.fromLatLngToPoint(sw);
  const point = projection.fromLatLngToPoint({
    lat,
    lng,
  } as unknown as google.maps.LatLng);
  if (!topRight || !bottomLeft || !point) return null;
  const scaleX = container.offsetWidth / (topRight.x - bottomLeft.x);
  const scaleY = container.offsetHeight / (topRight.y - bottomLeft.y);
  const x = (point.x - bottomLeft.x) * scaleX;
  const y = (point.y - topRight.y) * scaleY;
  return { x, y };
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "calc(100vh - 170px)",
};

export default function Map({
  filters,
  results,
  onFilterChange,
  onEntitySelect,
  onMapLocationSelect,
  dataSearchMarkers = [],
  isLoading = false,
  isFiltersFullOpen = false,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const onEntitySelectRef = useRef(onEntitySelect);
  const onMapLocationSelectRef = useRef(onMapLocationSelect);
  const handlePopupCloseRef = useRef<() => void>(() => {});
  /** Ref so map click handler can see current popup state without closure staleness. */
  const popupOpenRef = useRef(false);
  onEntitySelectRef.current = onEntitySelect;
  onMapLocationSelectRef.current = onMapLocationSelect;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_KEY,
  });

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<GovernmentEntityWithRelations | null>(null);
  const [popupEntityId, setPopupEntityId] = useState<number | null>(null);
  const [popupPixel, setPopupPixel] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [selectedDataMarker, setSelectedDataMarker] = useState<DataSearchMarker | null>(null);
  const [dataPopupPixel, setDataPopupPixel] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showOutOfRegionModal, setShowOutOfRegionModal] = useState(false);
  const [mapViewportVersion, setMapViewportVersion] = useState(0);

  const resizeTimeoutRef = useRef<number | null>(null);
  const pendingRefitMainlandRef = useRef(false);

  const POPUP_WIDTH = 286;
  const POPUP_HEIGHT = 284;

  const isNationalDefaultView = useMemo(() => {
    const hasCoordinates = filters.coordinates?.[0] != null && filters.coordinates?.[1] != null;
    return !hasCoordinates && !filters.useRadiusSearch;
  }, [filters.coordinates, filters.useRadiusSearch]);

  const requestMapResize = useCallback(
    (opts?: { refitToMainland?: boolean; delayMs?: number }) => {
      const map = mapRef.current;
      if (!map || !mapLoaded) return;
      if (opts?.refitToMainland) pendingRefitMainlandRef.current = true;

      const delayMs = opts?.delayMs ?? 350;
      if (resizeTimeoutRef.current != null) window.clearTimeout(resizeTimeoutRef.current);

      resizeTimeoutRef.current = window.setTimeout(() => {
        const m = mapRef.current;
        if (!m) return;
        const container = mapContainerRef.current;

        const centerBefore = m.getCenter();
        const zoomBefore = m.getZoom();

        // Inform Google Maps the container dimensions changed (e.g. filters panel animates open/closed).
        google.maps.event.trigger(m, "resize");

        const shouldRefitMainland = pendingRefitMainlandRef.current;
        pendingRefitMainlandRef.current = false;

        if (shouldRefitMainland) {
          m.fitBounds(US_MAINLAND_BOUNDS);

          // After fitting to the current container, nudge zoom so that the
          // pixel distance between the US mainland west/east edges occupies
          // a consistent fraction of the container width, regardless of
          // absolute screen size.
          if (container) {
            const containerWidth = container.offsetWidth || 1;
            const containerHeight = container.offsetHeight || 1;
            const containerAspect = containerWidth / containerHeight;

            const midLat = (US_MAINLAND_BOUNDS.north + US_MAINLAND_BOUNDS.south) / 2;
            const midLng = (US_MAINLAND_BOUNDS.west + US_MAINLAND_BOUNDS.east) / 2;

            // For wide containers, fit horizontally (west/east).
            if (containerAspect <= 2) {
              const westPoint = latLngToPixel(m, container, midLat, US_MAINLAND_BOUNDS.west);
              const eastPoint = latLngToPixel(m, container, midLat, US_MAINLAND_BOUNDS.east);

              if (westPoint && eastPoint) {
                const usPixelWidth = Math.max(1, Math.abs(eastPoint.x - westPoint.x));

                // Target: US mainland should span about 70% of container width.
                const TARGET_FRACTION = 0.7;
                const desiredWidth = containerWidth * TARGET_FRACTION;

                const scaleNeeded = desiredWidth / usPixelWidth; // >1 => zoom in, <1 => zoom out

                // Convert required scale into zoom delta (each zoom level ≈ factor 2).
                const zoomDeltaRaw = Math.log2(scaleNeeded);

                // Ignore tiny adjustments; clamp to avoid extreme jumps.
                if (Math.abs(zoomDeltaRaw) > 0.1) {
                  const zoom = m.getZoom() ?? GEOGRAPHIC_DEFAULTS.DEFAULT_ZOOM;
                  const zoomDeltaClamped = Math.max(-2, Math.min(2, zoomDeltaRaw));
                  let zoomAfterFit = zoom + zoomDeltaClamped;
                  zoomAfterFit = Math.max(3, Math.min(22, zoomAfterFit));
                  m.setZoom(zoomAfterFit);
                }
              }
            } else {
              // For tall containers, fit vertically (north/south).
              const northPoint = latLngToPixel(m, container, US_MAINLAND_BOUNDS.north, midLng);
              const southPoint = latLngToPixel(m, container, US_MAINLAND_BOUNDS.south, midLng);

              if (northPoint && southPoint) {
                const usPixelHeight = Math.max(1, Math.abs(southPoint.y - northPoint.y));

                // Target: US mainland should span about 70% of container height.
                const TARGET_FRACTION = 0.7;
                const desiredHeight = containerHeight * TARGET_FRACTION;

                const scaleNeeded = desiredHeight / usPixelHeight; // >1 => zoom in, <1 => zoom out

                // Convert required scale into zoom delta (each zoom level ≈ factor 2).
                const zoomDeltaRaw = Math.log2(scaleNeeded);

                // Ignore tiny adjustments; clamp to avoid extreme jumps.
                if (Math.abs(zoomDeltaRaw) > 0.1) {
                  const zoom = m.getZoom() ?? GEOGRAPHIC_DEFAULTS.DEFAULT_ZOOM;
                  const zoomDeltaClamped = Math.max(-2, Math.min(2, zoomDeltaRaw));
                  let zoomAfterFit = zoom + zoomDeltaClamped;
                  zoomAfterFit = Math.max(3, Math.min(22, zoomAfterFit));
                  m.setZoom(zoomAfterFit);
                }
              }
            }
          }
        } else {
          // Resize can sometimes shift the viewport; restore prior view when not refitting.
          if (centerBefore) m.setCenter(centerBefore);
          if (typeof zoomBefore === "number") m.setZoom(zoomBefore);
        }

        setMapViewportVersion((v) => v + 1);
      }, delayMs);
    },
    [mapLoaded],
  );

  const center = useMemo(() => {
    if (filters.coordinates?.[0] != null && filters.coordinates?.[1] != null) {
      return { lng: filters.coordinates[0], lat: filters.coordinates[1] };
    }
    return DEFAULT_CENTER;
  }, [filters.coordinates]);

  const zoom = useMemo(() => {
    if (filters.useRadiusSearch) return GEOGRAPHIC_DEFAULTS.RADIUS_SEARCH_ZOOM;
    if (filters.coordinates?.[0] != null && filters.coordinates?.[1] != null) {
      return GEOGRAPHIC_DEFAULTS.GENERAL_SEARCH_ZOOM;
    }
    return GEOGRAPHIC_DEFAULTS.DEFAULT_ZOOM;
  }, [filters.coordinates, filters.useRadiusSearch]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
    setMapError(null);
  }, []);

  // First load (and when returning to national/default view): fit to US mainland bounds.
  useEffect(() => {
    if (!mapLoaded) return;
    if (!isNationalDefaultView) return;
    requestMapResize({ refitToMainland: true, delayMs: 50 });
  }, [mapLoaded, isNationalDefaultView, requestMapResize]);

  // Track viewport changes so marker popups stay correctly positioned after pan/zoom/fitBounds/resize.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    const listener = map.addListener("idle", () => setMapViewportVersion((v) => v + 1));
    return () => listener.remove();
  }, [mapLoaded]);

  // Observe container size changes (filter panel animation, window resizes, etc.) and debounce a map resize.
  useEffect(() => {
    if (!mapLoaded) return;
    const el = mapContainerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    let lastW = 0;
    let lastH = 0;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      requestMapResize({
        delayMs: 120,
        refitToMainland: isNationalDefaultView,
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [mapLoaded, requestMapResize, isNationalDefaultView]);

  // When the desktop "All Filters" panel toggles, trigger a resize and (when in national/default view) refit to US mainland.
  useEffect(() => {
    if (!mapLoaded) return;
    if (isMobile) return;

    const hasCoordinates = filters.coordinates?.[0] != null && filters.coordinates?.[1] != null;
    const shouldRefitMainland = !hasCoordinates && !filters.useRadiusSearch;

    requestMapResize({ refitToMainland: shouldRefitMainland, delayMs: 350 });
  }, [isFiltersFullOpen, mapLoaded, isMobile, filters.coordinates, filters.useRadiusSearch, requestMapResize]);

  useEffect(() => {
    if (!loadError) return;
    const msg = loadError.message ?? String(loadError);
    if (msg.includes("ApiNotActivatedMapError") || msg.includes("ApiNotActivated") || msg.includes("API_KEY_INVALID")) {
      setMapError("API_NOT_ACTIVATED");
    } else {
      setMapError("Failed to load map");
    }
  }, [loadError]);

  // Catch ApiNotActivatedMapError (and similar) when map initializes
  useEffect(() => {
    if (!isLoaded || !window.google?.maps) return;
    const handler = (e: ErrorEvent) => {
      const msg = e?.message ?? "";
      if (
        msg.includes("ApiNotActivatedMapError") ||
        msg.includes("ApiNotActivated") ||
        msg.includes("API_KEY_INVALID")
      ) {
        setMapError("API_NOT_ACTIVATED");
      }
    };
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, [isLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    if (filters.coordinates?.[0] != null && filters.coordinates?.[1] != null) {
      map.panTo({ lat: filters.coordinates[1], lng: filters.coordinates[0] });
      map.setZoom(
        filters.useRadiusSearch ? GEOGRAPHIC_DEFAULTS.RADIUS_SEARCH_ZOOM : GEOGRAPHIC_DEFAULTS.GENERAL_SEARCH_ZOOM,
      );
    }
  }, [mapLoaded, filters.coordinates, filters.useRadiusSearch]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    // Guard: if popup is open, treat this click as "close popup only". Do not zoom, pan, or
    // trigger SMRC search—that would be unintended when the user is just dismissing the popup.
    if (popupOpenRef.current) {
      handlePopupCloseRef.current?.();
      return;
    }
    const latLng = e.latLng;
    if (!latLng || !mapRef.current) return;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
    void (async () => {
      const { countryCode } = await reverseGeocodeCountry(lat, lng);
      const allowedCountries = ["US", "PR", "GU", "AS", "MP", "VI"];
      if (!allowedCountries.includes(countryCode ?? "")) {
        setShowOutOfRegionModal(true);
        return;
      }
      const map = mapRef.current;
      if (!map) return;
      const currentZoom = map.getZoom() ?? GEOGRAPHIC_DEFAULTS.DEFAULT_ZOOM;
      const newZoom = Math.min(22, currentZoom + 1);
      map.panTo({ lat, lng });
      map.setZoom(newZoom);
      onMapLocationSelectRef.current?.(lng, lat);
    })();
  }, []);

  const handlePopupClose = useCallback(() => {
    popupOpenRef.current = false;
    setPopupEntityId(null);
    setSelectedEntity(null);
    setPopupPixel(null);
    setSelectedDataMarker(null);
    setDataPopupPixel(null);
  }, []);
  handlePopupCloseRef.current = handlePopupClose;

  // Keep popup-open ref in sync with popup state so the map click handler (stable callback) can
  // distinguish "click to close popup" from "click to zoom/search here".
  useEffect(() => {
    popupOpenRef.current = popupEntityId != null || selectedDataMarker != null;
  }, [popupEntityId, selectedDataMarker]);

  // If the user hides a marker type (or pagination changes) while a marker popup is open,
  // close the popup to avoid showing details for a non-rendered pin.
  useEffect(() => {
    if (!selectedDataMarker) return;
    const stillRendered = dataSearchMarkers.some(
      (m) => m.dataTypeIdentifier === selectedDataMarker.dataTypeIdentifier && m.id === selectedDataMarker.id,
    );
    if (stillRendered) return;
    setSelectedDataMarker(null);
    setDataPopupPixel(null);
  }, [dataSearchMarkers, selectedDataMarker]);

  useEffect(() => {
    if (!popupEntityId || !selectedEntity || !mapRef.current || !mapContainerRef.current) {
      setPopupPixel(null);
      return;
    }
    const coords = getEntityCoords(selectedEntity);
    if (!coords) {
      setPopupPixel(null);
      return;
    }
    const map = mapRef.current;
    const container = mapContainerRef.current;
    const point = latLngToPixel(map, container, coords.lat, coords.lng);
    if (!point) {
      setPopupPixel(null);
      return;
    }
    const offsetLeft = container.offsetLeft ?? 0;
    const offsetTop = container.offsetTop ?? 0;
    let left = offsetLeft + point.x - POPUP_WIDTH / 2;
    let top = offsetTop + point.y - POPUP_HEIGHT - 12;
    const padding = 8;
    left = Math.max(padding, Math.min(left, offsetLeft + container.offsetWidth - POPUP_WIDTH - padding));
    top = Math.max(padding, Math.min(top, offsetTop + container.offsetHeight - POPUP_HEIGHT - padding));
    setPopupPixel({ left, top });
  }, [popupEntityId, selectedEntity, mapViewportVersion]);

  useEffect(() => {
    if (!selectedDataMarker || !mapRef.current || !mapContainerRef.current) {
      setDataPopupPixel(null);
      return;
    }
    const map = mapRef.current;
    const container = mapContainerRef.current;
    const point = latLngToPixel(map, container, selectedDataMarker.lat, selectedDataMarker.lng);
    if (!point) {
      setDataPopupPixel(null);
      return;
    }
    const offsetLeft = container.offsetLeft ?? 0;
    const offsetTop = container.offsetTop ?? 0;
    let left = offsetLeft + point.x - POPUP_WIDTH / 2;
    let top = offsetTop + point.y - POPUP_HEIGHT - 12;
    const padding = 8;
    left = Math.max(padding, Math.min(left, offsetLeft + container.offsetWidth - POPUP_WIDTH - padding));
    top = Math.max(padding, Math.min(top, offsetTop + container.offsetHeight - POPUP_HEIGHT - padding));
    setDataPopupPixel({ left, top });
  }, [selectedDataMarker, mapViewportVersion]);

  const handleEntitySelect = useCallback<EntitySelectHandler>((entity) => {
    setSelectedEntity(entity as GovernmentEntityWithRelations);
  }, []);

  const handleZoomIn = useCallback(() => {
    const map = mapRef.current;
    if (map) map.setZoom((map.getZoom() ?? 4) + 1);
  }, []);

  const handleZoomOut = useCallback(() => {
    const map = mapRef.current;
    if (map) map.setZoom((map.getZoom() ?? 4) - 1);
  }, []);

  const handleResetView = useCallback(() => {
    requestMapResize({ refitToMainland: true, delayMs: 0 });
  }, [requestMapResize]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!GOOGLE_MAP_KEY) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map not configured</h3>
            <p className="text-gray-600">Google Maps API key is missing.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mapError) {
    const isApiNotActivated = mapError === "API_NOT_ACTIVATED";
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full p-6">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Error</h3>
            {isApiNotActivated ? (
              <>
                <p className="text-gray-600 mb-2">The Maps JavaScript API is not enabled for this API key.</p>
                <p className="text-sm text-gray-600 mb-4">
                  In{" "}
                  <a
                    href="https://console.cloud.google.com/apis/library"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Google Cloud Console → APIs &amp; Services → Library
                  </a>
                  , enable <strong>Maps JavaScript API</strong>. For SMRC location search, also enable{" "}
                  <strong>Geocoding API</strong>. Then ensure your key (
                  <code className="text-xs bg-gray-100 px-1">NEXT_PUBLIC_GOOGLE_MAP_KEY</code>) is restricted to these
                  APIs if you use restrictions.
                </p>
              </>
            ) : (
              <p className="text-gray-600 mb-4">{mapError}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative h-full w-full min-h-[400px] rounded-xl">
      <div ref={mapContainerRef} className="rounded-xl h-full w-full" style={mapContainerStyle}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={isNationalDefaultView ? undefined : center}
            zoom={isNationalDefaultView ? undefined : zoom}
            onLoad={onMapLoad}
            onClick={onMapClick}
            options={{
              disableDefaultUI: false,
              zoomControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}
          >
            {results?.entities?.map((entity) => {
              const coords = getEntityCoords(entity);
              if (!coords) return null;
              return (
                <Marker
                  key={`entity-${entity.id}`}
                  position={coords}
                  onClick={() => {
                    setPopupEntityId(entity.id);
                    setSelectedEntity(entity);
                    onEntitySelectRef.current?.(entity);
                    // Filter SMRC reviews by this pin's location; pass entity's location label so panel matches popup
                    const locationLabel = getEntityLocationLabel(entity);
                    onMapLocationSelectRef.current?.(coords.lng, coords.lat, locationLabel || undefined);
                  }}
                />
              );
            })}
            {dataSearchMarkers.map((m) => (
              <Marker
                key={`data-${m.dataTypeIdentifier}-${m.id}`}
                position={{ lat: m.lat, lng: m.lng }}
                icon={m.markerUrl ? { url: m.markerUrl } : undefined}
                title={m.label}
                onClick={() => {
                  setSelectedDataMarker(m);
                }}
              />
            ))}
          </GoogleMap>
        ) : null}
      </div>

      {(!isLoaded || !mapLoaded) && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {mapLoaded && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomIn}
            className="bg-white shadow-md min-h-[44px] min-w-[44px]"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomOut}
            className="bg-white shadow-md min-h-[44px] min-w-[44px]"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetView}
            className="bg-white shadow-md min-h-[44px] min-w-[44px]"
            aria-label="Reset view"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {selectedDataMarker && dataPopupPixel && !isMobile && (
        <div
          className="absolute z-10"
          style={{
            left: dataPopupPixel.left,
            top: dataPopupPixel.top,
            width: POPUP_WIDTH,
            height: POPUP_HEIGHT,
          }}
        >
          <PopupContainer
            marker={selectedDataMarker}
            onClose={() => {
              setSelectedDataMarker(null);
              setDataPopupPixel(null);
            }}
          />
        </div>
      )}

      {popupEntityId && (
        <>
          {!isMobile && popupPixel && (
            <div
              className="absolute z-10"
              style={{
                left: popupPixel.left,
                top: popupPixel.top,
                width: POPUP_WIDTH,
                height: POPUP_HEIGHT,
              }}
            >
              <GovernmentEntityPopupContainer
                entityId={popupEntityId}
                initialEntity={selectedEntity}
                onClose={handlePopupClose}
                onEntitySelect={handleEntitySelect}
                onViewPublicServiceReviews={onMapLocationSelect}
              />
            </div>
          )}
          {isMobile && (
            <Sheet open={!!popupEntityId} onOpenChange={(open) => !open && handlePopupClose()}>
              <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Entity Details</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <GovernmentEntityPopupContainer
                    entityId={popupEntityId}
                    initialEntity={selectedEntity}
                    onClose={handlePopupClose}
                    onEntitySelect={handleEntitySelect}
                    onViewPublicServiceReviews={onMapLocationSelect}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </>
      )}

      <Dialog open={showOutOfRegionModal} onOpenChange={setShowOutOfRegionModal}>
        <DialogContent className="sm:max-w-[425px] rounded-lg p-6">
          <DialogHeader>
            <DialogTitle>Service area</DialogTitle>
            <DialogDescription className="whitespace-pre-line">
              Plentiful Knowledge services are limited to the United States' contiguous 48 states, Alaska, Hawaii, and
              several territories across the Pacific and Caribbean, including Puerto Rico, Guam, American Samoa, the
              Northern Mariana Islands, and the US Virgin Islands.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => setShowOutOfRegionModal(false)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
