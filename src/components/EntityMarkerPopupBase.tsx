"use client";

import { useMemo, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import type { DataSearchMarker } from "@/types/search";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { FileText, Heart, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { GEOGRAPHIC_DEFAULTS } from "@/lib/constants/search";

const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";
const DEFAULT_GALLERY_IMAGES = ["/bg-image.jpg", "/entity_2.jpg", "/entity_3.jpg"];

export interface MarkerPopupSlide {
  title: string;
  value: string;
}

export interface MarkerPopupDetailRow {
  label: string;
  value: string;
}

export interface MarkerPopupKeyDetail {
  label: string;
  value: string;
}

export interface MarkerPopupContactRow {
  label: string;
  value: string;
}

export interface EntityMarkerPopupBaseProps {
  marker: DataSearchMarker;
  onClose: () => void;
  /** "popup" = map popup (fixed size); "modal" = larger card/dialog-style layout */
  variant?: "popup" | "modal";
  className?: string;

  entityLabel: string;
  galleryImages?: string[];

  DetailsIcon: ComponentType<{ className?: string }>;
  ContactIcon: ComponentType<{ className?: string }>;

  slides: MarkerPopupSlide[];
  detailRows: MarkerPopupDetailRow[];
  keyDetails: MarkerPopupKeyDetail[];
  contactRows: MarkerPopupContactRow[];

  resolvedName: string;
  addressDisplay: string;

  /** Optional extra sections inside the modal below the key details. */
  modalLeftExtras?: ReactNode;
}

/**
 * EntityMarkerPopupBase
 *
 * Shared popup + full-screen details modal used by multiple data-search marker types.
 * Layout and sizing mirror `PersonMarkerPopup` for consistent UX.
 */
export default function EntityMarkerPopupBase({
  marker,
  onClose,
  variant = "popup",
  className = "",
  entityLabel,
  galleryImages = DEFAULT_GALLERY_IMAGES,
  DetailsIcon,
  ContactIcon,
  slides,
  detailRows,
  keyDetails,
  contactRows,
  resolvedName,
  addressDisplay,
  modalLeftExtras,
}: EntityMarkerPopupBaseProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const justClosedModalRef = useRef(false);

  const isModal = variant === "modal";

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_KEY,
  });

  const locationString = `${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}`;
  const mapCenter = useMemo(() => ({ lat: marker.lat, lng: marker.lng }), [marker.lat, marker.lng]);

  const safeSlides = slides.length > 0 ? slides : [{ title: "Name", value: resolvedName }];
  const safeGalleryImages = galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY_IMAGES;
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % safeSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  const current = safeSlides[currentSlide];

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg relative overflow-hidden font-inter flex flex-col
        ${isModal ? "w-[450px] max-h-[90vh] overflow-auto" : "w-[286px] h-[284px]"}
        ${className}
      `}
      role="dialog"
      aria-labelledby="data-marker-popup-title"
      onClick={(e) => {
        e.stopPropagation();
        const target = e.target;
        if (target instanceof HTMLElement && target.closest("button")) return;
        if (justClosedModalRef.current) {
          justClosedModalRef.current = false;
          return;
        }
        setDetailsModalOpen(true);
      }}
    >
      {/* Header strip */}
      <div
        className={`w-full bg-modal-bg relative flex flex-col flex-shrink-0 overflow-hidden ${
          isModal ? "h-[120px]" : "flex-[2] min-h-0"
        }`}
      >
        <div
          className={`flex items-center justify-between flex-shrink-0 relative ${
            isModal ? "pt-4 px-4" : "pt-2 px-2"
          }`}
        >
          <div
            className={`flex items-center bg-white rounded-full shadow-sm min-w-0 ${
              isModal ? "px-4 py-1.5 max-w-[85%]" : "px-1.5 py-0.5 max-w-[75%]"
            }`}
          >
            <FileText className={`text-gray-600 flex-shrink-0 ${isModal ? "mr-2 h-4 w-4" : "mr-1 h-2.5 w-2.5"}`} />
            <span className={`text-gray-700 font-medium truncate ${isModal ? "text-sm" : "text-[9px]"}`}>
              {marker.dataTypeIdentifier}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite((prev) => !prev);
            }}
            className={`bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-100 z-10 ${
              isModal ? "w-8 h-8" : "w-5 h-5"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`${
                isFavorite ? "fill-red-500 text-red-500" : "text-[#999999]"
              } ${isModal ? "h-4 w-4" : "h-3 w-3"}`}
            />
          </button>
        </div>

        {/* Slide title */}
        <div className="flex-1 flex items-center justify-center px-8">
          <span
            id="data-marker-popup-title"
            className={`text-white font-medium text-center leading-tight ${isModal ? "text-base" : "text-[11px]"}`}
          >
            {current.title}
          </span>
        </div>

        {/* Slide value badge */}
        <div className={`flex justify-center flex-shrink-0 ${isModal ? "pb-3" : "pb-1"}`}>
          <div
            className={`bg-white rounded-lg flex items-center shadow-sm ${
              isModal ? "px-4 py-1.5" : "rounded px-2 py-0.5"
            }`}
          >
            <span className={`font-semibold text-gray-800 ${isModal ? "text-sm" : "text-[10px]"} max-w-[240px] truncate`}>
              {current.value}
            </span>
          </div>
        </div>

        {/* Dots */}
        <div
          className={`flex justify-center items-center flex-shrink-0 space-x-1 ${
            isModal ? "pb-2" : "pb-1 space-x-0.5"
          }`}
          role="tablist"
          aria-label={`${entityLabel} slides`}
        >
          {safeSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`rounded-full transition-all focus-visible:outline-none ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              } ${isModal ? "h-2.5 w-2.5" : "h-1 w-1"} ${
                index === currentSlide && isModal ? "w-2.5" : ""
              } ${index === currentSlide && !isModal ? "w-1.5" : ""}`}
              role="tab"
              aria-selected={index === currentSlide}
            />
          ))}
        </div>

        {/* Slide nav */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className={`absolute left-2 top-[60%] -translate-y-1/2 text-white hover:opacity-75 z-10 ${
            isModal ? "p-2" : "p-0.5"
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className={isModal ? "h-8 w-8" : "h-3 w-3"} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className={`absolute right-2 top-[60%] -translate-y-1/2 text-white hover:opacity-75 z-10 ${
            isModal ? "p-2" : "p-0.5"
          }`}
          aria-label="Next slide"
        >
          <ChevronRight className={isModal ? "h-8 w-8" : "h-3 w-3"} />
        </button>
      </div>

      {/* Content area */}
      <div
        className={`min-h-0 overflow-auto flex flex-col flex-shrink-0 ${
          isModal ? "flex-[3] p-4 space-y-4" : "flex-[3] p-2 space-y-2"
        }`}
      >
        <div className="space-y-1 text-xs">
          <div className={`flex items-center gap-1 font-bold text-gray-800 text-sm`}>
            <DetailsIcon className="h-3 w-3 text-gray-500 shrink-0" />
            <span>Details:</span>
          </div>

          {detailRows.map((row) => (
            <div key={row.label} className="flex items-center gap-1 text-gray-800 text-sm">
              <span className="font-semibold">{row.label}:</span>
              <span className="text-[11px] text-gray-500">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setDetailsModalOpen(true);
            }}
            className={`w-full bg-gray-800 text-white rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200/60 ${
              isModal ? "py-2 text-sm" : "py-1 text-[11px]"
            }`}
            type="button"
          >
            View data details
          </Button>
        </div>
      </div>

      {/* Details modal */}
      <Dialog
        open={detailsModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            justClosedModalRef.current = true;
            window.setTimeout(() => {
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
            <DialogTitle>{resolvedName}</DialogTitle>
          </VisuallyHidden>

          <div className="flex-shrink-0 flex items-center border-b border-gray-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={() => setDetailsModalOpen(false)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              aria-label="Back to map"
            >
              Back to Map
            </button>
          </div>

          {/* Image carousel */}
          <div className="relative h-[450px] w-full flex-shrink-0 bg-gray-100">
            {safeGalleryImages.map((src, index) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  index === modalImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${entityLabel} ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex((prev) => (prev === 0 ? safeGalleryImages.length - 1 : prev - 1));
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
                setModalImageIndex((prev) => (prev === safeGalleryImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Two-column layout */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col md:flex-row justify-center gap-10 mx-4 md:mx-10 mt-8 mb-8">
            <div className="order-2 md:order-1 flex-1 min-w-0 max-w-3xl">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">
                  {entityLabel} detail • Data type:{" "}
                  <span className="font-medium text-gray-700">{marker.dataTypeIdentifier}</span>
                </p>
                <h1 className="text-3xl font-bold my-4 text-gray-900 break-words">{resolvedName}</h1>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <span className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1 text-gray-700 shrink-0" />
                    {addressDisplay}
                  </span>
                  <span className="text-sm text-gray-600">{locationString}</span>
                </div>
              </div>

              {/* Key details grid */}
              {keyDetails.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-6 mb-8">
                  <div className="flex flex-wrap justify-between items-center gap-4 px-2">
                    {keyDetails.map((d, idx) => (
                      <span key={d.label} className="contents">
                        {idx > 0 && <div className="border-l border-gray-300 h-10 hidden sm:block" />}
                        <div>
                          <div className="text-sm text-gray-500">{d.label}</div>
                          <div className="font-semibold text-gray-900">{d.value}</div>
                        </div>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {modalLeftExtras}

              {/* Map and coordinates */}
              <div className="py-8">
                <h3 className="text-xl font-semibold text-gray-900">Map and Location</h3>
                <div className="flex flex-wrap justify-between items-center gap-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-700 shrink-0" />
                    <span className="font-medium text-gray-700">Address:</span>
                    <span className="ml-1">{addressDisplay}</span>
                  </div>
                  <span className="text-xs text-gray-500">{locationString}</span>
                </div>
                <div className="mt-4 h-[200px] rounded-lg overflow-hidden bg-gray-200 relative">
                  {isMapLoaded && GOOGLE_MAP_KEY ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={mapCenter}
                      zoom={GEOGRAPHIC_DEFAULTS.DEFAULT_ZOOM}
                      options={{ disableDefaultUI: false, zoomControl: true }}
                    >
                      <Marker position={mapCenter} />
                    </GoogleMap>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                      Map not available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact widget */}
            <div className="order-1 md:order-2 w-full md:w-auto md:min-w-[280px] md:max-w-[320px] shrink-0">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 h-fit md:sticky md:top-4">
                <div className="flex items-center gap-4 mb-4 border border-gray-200 p-4 rounded-xl">
                  <div className="flex items-center p-3 bg-gray-800 rounded-full">
                    <ContactIcon className="text-white shrink-0 h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">{entityLabel}</p>
                    <div className="text-lg font-bold text-gray-900 truncate">{resolvedName}</div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium py-2.5 mb-4"
                  type="button"
                  onClick={() => {
                    setDetailsModalOpen(false);
                    onClose();
                  }}
                >
                  Close and return to map
                </Button>

                <div className="text-sm text-gray-600 space-y-1">
                  {contactRows.map((row) => (
                    <div key={row.label} className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">{row.label}:</span>
                      <span>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

