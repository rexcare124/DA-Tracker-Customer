"use client";

import React, { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { GovernmentEntityWithRelations } from "@/types/governmentEntityTypes";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  FileText,
  Star,
  Compass,
  Building2,
  FileCheck,
  ClipboardList,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { GEOGRAPHIC_DEFAULTS } from "@/lib/constants/search";

const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";

interface GovernmentEntityPopupProps {
  entity: GovernmentEntityWithRelations;
  onClose: () => void;
  onEntitySelect?: (entity: GovernmentEntityWithRelations) => void;
  /** When provided, "View Public Service Reviews" will call this with entity (lng, lat) to show SMRC reviews in the right panel */
  onViewPublicServiceReviews?: (lng: number, lat: number) => void;
  /** Whether the entity is in the user's favorites */
  isFavorite?: boolean;
  /** Called when the user clicks the heart to add/remove favorite */
  onFavoriteClick?: () => void;
  /** True while favorite request is in progress */
  favoriteLoading?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  className?: string;
  /** "popup" = map popup (fixed size); "modal" = dashboard/card (e.g. 450px) */
  variant?: "popup" | "modal";
}

type Trend = "up" | "down";

/**
 * GovernmentEntityPopup - Map popup UI matching CityModal layout 100%.
 * Includes warning bar, heart icon, metric gallery (carousel with arrows + dots).
 * Does not show "View City Metrics", "View County", or "View State" buttons.
 */
const ENTITY_GALLERY_IMAGES = ["/entity_1.jpg", "/entity_2.jpg", "/entity_3.jpg"];

function getEntityCoords(
  entity: GovernmentEntityWithRelations,
): { lat: number; lng: number } | null {
  const lat = entity.latitude ?? entity.location?.latitude;
  const lng = entity.longitude ?? entity.location?.longitude;
  if (lat == null || lng == null || isNaN(Number(lat)) || isNaN(Number(lng))) return null;
  return { lat: Number(lat), lng: Number(lng) };
}

export default function GovernmentEntityPopup({
  entity,
  onClose,
  onEntitySelect,
  onViewPublicServiceReviews,
  isFavorite = false,
  onFavoriteClick,
  favoriteLoading = false,
  isSelected = false,
  isHovered = false,
  className = "",
  variant = "popup",
}: GovernmentEntityPopupProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const justClosedModalRef = useRef(false);
  const isModal = variant === "modal";

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_KEY,
  });

  const entityCoords = useMemo(() => getEntityCoords(entity), [entity]);
  const mapCenter = useMemo(
    () =>
      entityCoords
        ? { lat: entityCoords.lat, lng: entityCoords.lng }
        : {
            lat: GEOGRAPHIC_DEFAULTS.DEFAULT_COORDINATES.LATITUDE,
            lng: GEOGRAPHIC_DEFAULTS.DEFAULT_COORDINATES.LONGITUDE,
          },
    [entityCoords],
  );

  const formatPopulation = (population?: number): string => {
    if (!population) return "N/A";
    if (population >= 1000000) return `${(population / 1000000).toFixed(1)}M`;
    if (population >= 1000) return `${(population / 1000).toFixed(1)}K`;
    return population.toLocaleString();
  };

  const getLocationString = (): string => {
    const parts: string[] = [];
    if (entity.city?.cityName) parts.push(entity.city.cityName);
    if (entity.county?.countyName) parts.push(`${entity.county.countyName} County`);
    if (entity.state?.stateName) parts.push(entity.state.stateName);
    return parts.join(", ") || "Location not available";
  };

  const getPopulation = (): number | null => {
    return entity.city?.population ?? entity.county?.population ?? entity.state?.population ?? null;
  };

  const population = getPopulation();

  const metrics = useMemo(
    () => [
      { title: "Crime Solve Rate", percentage: "-18%", trend: "down" as Trend },
      { title: "Unemployment Rate", percentage: "+12%", trend: "up" as Trend },
      { title: "Population Decline", percentage: "-5%", trend: "down" as Trend },
      { title: "New Business Licenses", percentage: "+8%", trend: "up" as Trend },
    ],
    [],
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % metrics.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + metrics.length) % metrics.length);
  };

  const currentMetric = metrics[currentSlide];

  const handleViewReviews = () => {
    onEntitySelect?.(entity);
    const coords = getEntityCoords(entity);
    if (onViewPublicServiceReviews && coords) {
      onViewPublicServiceReviews(coords.lng, coords.lat);
    } else if (!onViewPublicServiceReviews) {
      router.push(`/datasearch/${entity.id}`);
    }
  };

  const locationString = getLocationString();

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg relative overflow-hidden font-inter flex flex-col
        ${isModal ? "w-[450px] max-h-[90vh] overflow-auto" : "w-[286px] h-[284px]"}
        ${className}
        ${isSelected ? "ring-2 ring-blue-500" : ""}
        ${isHovered ? "shadow-xl" : ""}
      `}
      role="dialog"
      aria-labelledby="entity-popup-name"
      onClick={(e) => {
        e.stopPropagation();
        if ((e.target as HTMLElement).closest("button")) return;
        if (justClosedModalRef.current) {
          justClosedModalRef.current = false;
          return;
        }
        setDetailsModalOpen(true);
      }}
    >
      {/* Top gallery: 2/5 of popup height; full height in modal */}
      <div
        className={`w-full bg-modal-bg relative flex flex-col flex-shrink-0 overflow-hidden ${isModal ? "h-[160px]" : "flex-[2] min-h-0"}`}
      >
        {/* Row: warning (left), close (center), heart (right) - 8px top/left/right; larger in modal */}
        <div
          className={`flex items-center justify-between flex-shrink-0 relative ${isModal ? "pt-4 px-4" : "pt-2 px-2"}`}
        >
          <div
            className={`flex items-center bg-white rounded-full shadow-sm min-w-0 ${isModal ? "px-4 py-1.5 max-w-[85%]" : "px-1.5 py-0.5 max-w-[75%]"}`}
          >
            <TriangleAlert
              className={`text-red-500 flex-shrink-0 ${isModal ? "mr-2 h-4 w-4" : "mr-1 h-2.5 w-2.5"}`}
            />
            <span
              className={`text-gray-500 font-medium truncate ${isModal ? "text-sm" : "text-[9px]"}`}
            >
              Credit Downgrade Mar 2025
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteClick?.();
            }}
            disabled={favoriteLoading}
            className={`bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-100 disabled:opacity-50 z-10 ${isModal ? "w-10 h-10" : "w-5 h-5"}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`${isFavorite ? "fill-red-500 text-red-500" : "text-[#999999]"} ${isModal ? "h-5 w-5" : "h-2.5 w-2.5"}`}
            />
          </button>
        </div>

        {/* Metric title - center */}
        <div
          className={`flex items-center justify-center px-8 ${isModal ? "absolute bottom-[70px] left-0 right-0" : "flex-1"}`}
        >
          <span
            id="entity-popup-name"
            className={`text-white font-medium text-center leading-tight ${isModal ? "text-base" : "text-[11px]"}`}
          >
            {currentMetric.title}
          </span>
        </div>

        {/* Percentage badge - fully inside top section */}
        <div
          className={`flex justify-center flex-shrink-0 ${isModal ? "absolute bottom-6 left-1/2 -translate-x-1/2" : "pb-1"}`}
        >
          <div
            className={`bg-white rounded-lg flex items-center shadow-sm ${isModal ? "px-4 py-1.5" : "rounded px-2 py-0.5"}`}
          >
            <span
              className={`font-semibold ${currentMetric.trend === "down" ? "text-red-500" : "text-green-600"} ${isModal ? "text-lg" : "text-[11px]"}`}
            >
              {currentMetric.percentage}
            </span>
            {currentMetric.trend === "down" ? (
              <TrendingDown
                className={`text-red-500 rotate-90 ${isModal ? "ml-1 h-5 w-5" : "ml-0.5 h-2.5 w-2.5"}`}
              />
            ) : (
              <TrendingUp
                className={`text-green-500 ${isModal ? "ml-1 h-5 w-5" : "ml-0.5 h-2.5 w-2.5"}`}
              />
            )}
          </div>
        </div>

        {/* Dots */}
        <div
          className={`flex justify-center items-center flex-shrink-0 space-x-1 ${isModal ? "absolute bottom-2 left-1/2 -translate-x-1/2" : "pb-1 space-x-0.5"}`}
          role="tablist"
          aria-label="Metric slides"
        >
          {metrics.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`rounded-full transition-all focus-visible:outline-none ${index === currentSlide ? "bg-white" : "bg-white/50"} ${isModal ? "h-2.5 w-2.5" : "h-1 w-1"} ${index === currentSlide && isModal ? "w-2.5" : ""} ${index === currentSlide && !isModal ? "w-1.5" : ""}`}
              role="tab"
              aria-selected={index === currentSlide}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className={`absolute left-2 top-[60%] -translate-y-1/2 text-white hover:opacity-75 z-10 ${isModal ? "p-2" : "p-0.5"}`}
          aria-label="Previous metric"
        >
          <ChevronLeft className={isModal ? "h-8 w-8" : "h-3 w-3"} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className={`absolute right-2 top-[60%] -translate-y-1/2 text-white hover:opacity-75 z-10 ${isModal ? "p-2" : "p-0.5"}`}
          aria-label="Next metric"
        >
          <ChevronRight className={isModal ? "h-8 w-8" : "h-3 w-3"} />
        </button>
      </div>

      {/* Rest info: 3/5 of popup height; larger in modal. Click anywhere (except controls) opens entity details modal. */}
      <div
        className={`min-h-0 overflow-auto flex flex-col flex-shrink-0 cursor-pointer ${isModal ? "flex-[3] p-4 space-y-4" : "flex-[3] p-2"}`}
      >
        <div className={`flex items-start flex-shrink-0 ${isModal ? "space-x-3" : "space-x-2"}`}>
          <div
            className={`bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 mt-1 ${isModal ? "w-8 h-8" : "w-4 h-4 rounded"}`}
          >
            <svg
              className={`text-gray-600 ${isModal ? "w-5 h-5" : "w-2.5 h-2.5"}`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-black leading-tight ${isModal ? "text-lg line-clamp-1" : "text-[11px] line-clamp-2"}`}
            >
              {entity.entityName}
            </h3>
            <p className={`text-gray-600 ${isModal ? "text-sm" : "text-[9px] line-clamp-2"}`}>
              {locationString}
            </p>
            {entity.governmentLevel && (
              <p className={`text-gray-600 ${isModal ? "text-sm" : "text-[9px]"}`}>
                {entity.governmentLevel.levelName}
              </p>
            )}
          </div>
        </div>

        <div className={`space-y-3 flex-shrink-0 ${isModal ? "" : "space-y-0.5 mt-1.5"}`}>
          <h4 className={`font-semibold text-black ${isModal ? "text-base mb-3" : "text-[10px]"}`}>
            Key City Government Metrics
          </h4>
          <div
            className={`grid grid-cols-2 text-gray-600 ${isModal ? "gap-y-2 text-sm" : "gap-x-1.5 gap-y-0.5 text-[9px]"}`}
          >
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              <span>
                {entity.city?.graduationRate != null
                  ? `${entity.city.graduationRate}% Graduation Rate`
                  : "NA% Graduation Rate"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              <span>8% Unemployment</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              <span>-6% School Enrollment</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              <span>$2.5M Investment</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              <span>15 Dev Projects</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              <span>$275K Tax Revenue</span>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewReviews();
          }}
          className={`w-full bg-gray-400 text-white rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200/60 flex-shrink-0 ${isModal ? "py-2 text-sm" : "py-1 rounded text-[10px] mt-1.5"}`}
          type="button"
          aria-label="View public service reviews"
        >
          View Public Service Reviews
        </button>
      </div>

      <Dialog
        open={detailsModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            justClosedModalRef.current = true;
            setTimeout(() => {
              justClosedModalRef.current = false;
            }, 150);
          }
          setDetailsModalOpen(open);
        }}
      >
        <DialogContent
          className="!left-[50%] !top-0 !translate-x-[-50%] !translate-y-0 w-[80vw] max-w-[80vw] min-h-[100vh] max-h-[100vh] p-0 gap-0 flex flex-col rounded-none sm:rounded-lg"
          hideCloseButton
        >
          <VisuallyHidden>
            <DialogTitle>{entity.entityName}</DialogTitle>
          </VisuallyHidden>
          {/* Action bar: Back to Search */}
          <div className="flex-shrink-0 flex items-center border-b border-gray-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={() => setDetailsModalOpen(false)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              aria-label="Back to search"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              Back to Search
            </button>
          </div>

          {/* Image carousel (SingleListing-style ImagePreviews) */}
          <div className="relative h-[450px] w-full flex-shrink-0 bg-gray-100">
            {ENTITY_GALLERY_IMAGES.map((src, index) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  index === modalImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Entity ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex((prev) =>
                  prev === 0 ? ENTITY_GALLERY_IMAGES.length - 1 : prev - 1,
                );
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex((prev) =>
                  prev === ENTITY_GALLERY_IMAGES.length - 1 ? 0 : prev + 1,
                );
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Two-column layout: overview + details + location | contact widget */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col md:flex-row justify-center gap-10 mx-4 md:mx-10 mt-8 mb-8">
            <div className="order-2 md:order-1 flex-1 min-w-0 max-w-3xl">
              {/* PropertyOverview-style header */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">
                  {entity.state?.stateName && <>{entity.state.stateName} / </>}
                  {entity.county?.countyName && <>{entity.county.countyName} County / </>}
                  <span className="font-semibold text-gray-600">
                    {entity.city?.cityName ?? "—"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold my-5 text-gray-900">{entity.entityName}</h1>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1 text-gray-700 shrink-0" />
                    {locationString}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center text-amber-500 text-sm">
                      <Star className="w-4 h-4 mr-1 fill-current shrink-0" />
                      {entity.hasReviews ? "4.2 (12 Reviews)" : "No reviews yet"}
                    </span>
                    <span className="text-green-600 text-sm font-medium">Verified</span>
                  </div>
                </div>
              </div>

              {/* Bordered stats row (PropertyOverview-style) */}
              <div className="border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex flex-wrap justify-between items-center gap-4 px-2">
                  <div>
                    <div className="text-sm text-gray-500">Government Level</div>
                    <div className="font-semibold text-gray-900">
                      {entity.governmentLevel?.levelName ?? "N/A"}
                    </div>
                  </div>
                  <div className="border-l border-gray-300 h-10 hidden sm:block" />
                  <div>
                    <div className="text-sm text-gray-500">Population</div>
                    <div className="font-semibold text-gray-900">
                      {formatPopulation(population ?? undefined)}
                    </div>
                  </div>
                  <div className="border-l border-gray-300 h-10 hidden sm:block" />
                  <div>
                    <div className="text-sm text-gray-500">Entity Type</div>
                    <div className="font-semibold text-gray-900">{entity.entityType ?? "N/A"}</div>
                  </div>
                  <div className="border-l border-gray-300 h-10 hidden sm:block" />
                  <div>
                    <div className="text-sm text-gray-500">Reviews</div>
                    <div className="font-semibold text-gray-900">
                      {entity.hasReviews ? "Available" : "None"}
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="my-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-5">
                  About {entity.entityName}
                </h2>
                <p className="text-gray-600 leading-7">
                  {entity.description ||
                    "This government entity provides essential public services to the community. Residents can access permits, licenses, and official records. Service quality and transparency are supported through public feedback and reviews."}
                </p>
              </div>

              {/* PropertyDetails-style: amenities / highlights grids + tabs */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 my-3">
                  Services &amp; Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[
                    { icon: FileText, label: "Public Records" },
                    { icon: FileCheck, label: "Licenses" },
                    { icon: ClipboardList, label: "Permits" },
                    { icon: Building2, label: "Facilities" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center border border-gray-200 rounded-xl py-6 px-4"
                    >
                      <Icon className="w-8 h-8 mb-2 text-gray-700" />
                      <span className="text-sm text-center text-gray-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[
                    "Online applications",
                    "In-person support",
                    "Extended hours",
                    "Accessibility",
                  ].map((h) => (
                    <div
                      key={h}
                      className="flex flex-col items-center border border-gray-200 rounded-xl py-6 px-4"
                    >
                      <span className="text-sm text-center text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fees and Policies tabs */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fees and Policies</h3>
                <p className="text-sm text-gray-600 mt-2 mb-4">
                  The information below is based on publicly available data and may vary by service.
                </p>
                <Tabs defaultValue="required-fees" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="required-fees">Required Fees</TabsTrigger>
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                    <TabsTrigger value="hours">Hours</TabsTrigger>
                  </TabsList>
                  <TabsContent value="required-fees" className="mt-4">
                    <p className="font-semibold text-gray-900 mt-2 mb-2">Common service fees</p>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between py-2 bg-gray-50 px-2 rounded">
                      <span className="text-gray-700 font-medium">Application Fee</span>
                      <span className="text-gray-700">$25</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between py-2 bg-gray-50 px-2 rounded">
                      <span className="text-gray-700 font-medium">Record Copy</span>
                      <span className="text-gray-700">$5 per page</span>
                    </div>
                    <hr className="border-gray-200" />
                  </TabsContent>
                  <TabsContent value="policies" className="mt-4">
                    <p className="font-semibold text-gray-900 mt-2 mb-2">
                      Standard policies apply. Contact the entity for current requirements.
                    </p>
                  </TabsContent>
                  <TabsContent value="hours" className="mt-4">
                    <p className="font-semibold text-gray-900 mt-2 mb-2">
                      Monday – Friday, 8:00 AM – 5:00 PM. Holiday schedule may vary.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* PropertyLocation-style: Map and Location */}
              <div className="py-10">
                <h3 className="text-xl font-semibold text-gray-900">Map and Location</h3>
                <div className="flex flex-wrap justify-between items-center gap-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-700 shrink-0" />
                    <span className="font-medium text-gray-700">Address: </span>
                    <span className="ml-1">{locationString}</span>
                  </div>
                  {(() => {
                    const coords = getEntityCoords(entity);
                    const mapsUrl = coords
                      ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationString)}`;
                    return (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <Compass className="w-5 h-5 shrink-0" />
                        Get Directions
                      </a>
                    );
                  })()}
                </div>
                <div className="mt-4 h-[200px] rounded-lg overflow-hidden bg-gray-200 relative">
                  {isMapLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={mapCenter}
                      zoom={entityCoords ? 14 : GEOGRAPHIC_DEFAULTS.DEFAULT_ZOOM}
                      options={{ disableDefaultUI: false, zoomControl: true }}
                    >
                      {entityCoords && <Marker position={mapCenter} />}
                    </GoogleMap>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                      Loading map…
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact widget (sticky sidebar) */}
            <div className="order-1 md:order-2 w-full md:w-auto md:min-w-[300px] md:max-w-[320px] shrink-0">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 h-fit md:sticky md:top-4">
                <div className="flex items-center gap-4 mb-4 border border-gray-200 p-4 rounded-xl">
                  <div className="flex items-center p-3 bg-gray-800 rounded-full">
                    <Phone className="text-white shrink-0" size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Contact this entity</p>
                    <div className="text-lg font-bold text-gray-900 truncate">
                      {entity.phone || "(555) 123-4567"}
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium py-2.5"
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handleViewReviews();
                  }}
                >
                  <FileText className="h-4 w-4 mr-2 shrink-0" />
                  View Public Service Reviews
                </Button>
                <hr className="my-4 border-gray-200" />
                <div className="text-sm text-gray-600 space-y-1">
                  {entity.website && (
                    <a
                      href={
                        entity.website.startsWith("http")
                          ? entity.website
                          : `https://${entity.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <Globe className="h-4 w-4 shrink-0" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {entity.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <a href={`mailto:${entity.email}`} className="hover:underline truncate">
                        {entity.email}
                      </a>
                    </div>
                  )}
                  {!entity.website && !entity.email && <p>Open by appointment Monday – Friday</p>}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
