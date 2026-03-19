"use client";

import { useMemo, useRef, useState } from "react";
import type { DataSearchMarker } from "@/types/search";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, Heart, User, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { GEOGRAPHIC_DEFAULTS } from "@/lib/constants/search";
import type { Person, PersonOrgRelationshipDetail, PersonOrgOrganization } from "@/types/person";
function personAddressString(p: Person): string | null {
  const parts: string[] = [];
  if (p.cityOfResidence?.trim()) parts.push(p.cityOfResidence.trim());
  if (p.stateOfResidence?.trim()) parts.push(p.stateOfResidence.trim());
  if (p.zipCode?.trim()) parts.push(p.zipCode.trim());
  return parts.length > 0 ? parts.join(", ") + ", USA" : null;
}

function isPersonPayload(value: unknown): value is Person {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || typeof value.id !== "number") return false;
  if (!("firstName" in value) || (value.firstName !== null && typeof value.firstName !== "string")) return false;
  if (
    !("dateOfBirth" in value) ||
    (value.dateOfBirth !== null && typeof value.dateOfBirth !== "string")
  ) {
    return false;
  }
  if (!("email" in value) || (value.email !== null && typeof value.email !== "string")) return false;
  if (!("juvenile" in value) || typeof value.juvenile !== "boolean") return false;
  if (!("deceased" in value) || typeof value.deceased !== "boolean") return false;
  return true;
}

const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";

interface PersonMarkerPopupProps {
  marker: DataSearchMarker;
  onClose: () => void;
  className?: string;
  /** "popup" = map popup (fixed size); "modal" = larger card/dialog-style layout */
  variant?: "popup" | "modal";
}

const PERSON_GALLERY_IMAGES = ["/bg-image.jpg", "/entity_2.jpg", "/entity_3.jpg"];
const DATA_TYPE_PERSON = "person";

const formatNullable = (value: string | null | undefined): string => (value && value.trim().length > 0 ? value : "—");

/** Build a single-line office address from organization location/state/city/zip. */
function formatOrgAddress(org: PersonOrgOrganization): string {
  const loc = org.location;
  const parts: string[] = [];
  if (loc?.streetAddress1) parts.push(loc.streetAddress1);
  if (loc?.streetAddress2 && loc.streetAddress2.trim()) parts.push(loc.streetAddress2.trim());
  if (org.city?.cityName) parts.push(org.city.cityName);
  if (org.state?.abbreviation) parts.push(org.state.abbreviation);
  if (loc?.zipCode?.zipCode) parts.push(loc.zipCode.zipCode);
  return parts.length > 0 ? parts.join(", ") : "—";
}

/** Format start/end date for display (e.g. "Sep 2022 – Present"). */
function formatRelationshipDates(startDate: string | null, endDate: string | null): string {
  if (!startDate) return "—";
  try {
    const start = new Date(startDate);
    const startStr = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!endDate) return `${startStr} – Present`;
    const end = new Date(endDate);
    const endStr = end.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return `${startStr} – ${endStr}`;
  } catch {
    return "—";
  }
}

interface PersonOrgSectionProps {
  relationships: PersonOrgRelationshipDetail[];
  compact?: boolean;
  /** When true, do not render the "Organization" heading (e.g. when parent provides its own). */
  hideTitle?: boolean;
}

function PersonOrgSection({ relationships, compact = false, hideTitle = false }: PersonOrgSectionProps) {
  const list = compact ? relationships.slice(0, 1) : relationships;
  const titleClass = `font-semibold ${compact ? "text-[11px]" : "text-sm"}`;
  const valueClass = `text-[11px] text-gray-500 ${compact ? "text-gray-700" : ""}`;

  return (
    <div className={compact ? "mt-1 border-t border-gray-100 pt-2 space-y-1 text-[11px] text-gray-700" : "space-y-4"}>
      {!hideTitle && (
        <div className={`flex items-center gap-1 font-bold text-gray-800 ${compact ? "text-sm" : "text-base"}`}>
          <Building2 className="h-3 w-3 text-gray-500 shrink-0" />
          <span>Organization</span>
        </div>
      )}
      <div className={`flex flex-col gap-2 ${valueClass}`}>
        {list.map((rel) => (
          <div key={rel.id} className={compact ? "space-y-0.5" : "space-y-1 p-2 rounded-lg bg-gray-50"}>
            <div className={compact ? "truncate" : ""}>
              <span className={titleClass}>Affiliation:</span> {rel.organization.entityName}
            </div>
            <div className={compact ? "truncate" : ""}>
              <span className={titleClass}>Office address:</span> {formatOrgAddress(rel.organization)}
            </div>
            <div className={compact ? "truncate" : ""}>
              <span className={titleClass}>Title/Role:</span> {formatNullable(rel.relationshipType.relationshipName)}
            </div>
            <div className={compact ? "truncate" : ""}>
              <span className={titleClass}>Dates:</span> {formatRelationshipDates(rel.startDate, rel.endDate)}
            </div>
            <div className={compact ? "truncate" : ""}>
              <span className={titleClass}>Supervisor/Manager:</span> —
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * PersonMarkerPopup
 *
 * Visual style and sizing mirror GovernmentEntityPopup for consistency:
 * - Popup variant matches the 286x284 map popup card
 * - Clicking the popup (outside of buttons) opens a full-screen style dialog
 */
export default function PersonMarkerPopup({
  marker,
  onClose,
  className = "",
  variant = "popup",
}: PersonMarkerPopupProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const justClosedModalRef = useRef(false);
  const isModal = variant === "modal";
  const personDetails: Person | null = isPersonPayload(marker.data) ? marker.data : null;
  const entityLabel = "Person";

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_KEY,
  });

  const locationString = `${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}`;
  const nameParts = [personDetails?.firstName, personDetails?.middleName, personDetails?.lastName].filter(
    (part): part is string => Boolean(part && part.trim()),
  );
  const fullName = nameParts.length > 0 ? nameParts.join(" ") : marker.label.trim().length > 0 ? marker.label : "—";
  const addressLine = personDetails ? personAddressString(personDetails) : null;

  const mapCenter = useMemo(
    () => ({
      lat: marker.lat,
      lng: marker.lng,
    }),
    [marker.lat, marker.lng],
  );

  const resolvedName = useMemo(() => {
    if (!personDetails) {
      return fullName;
    }

    const parts: string[] = [];
    if (personDetails.prefix) {
      parts.push(personDetails.prefix);
    }
    if (personDetails.firstName) {
      parts.push(personDetails.firstName);
    }
    if (personDetails.middleName) {
      parts.push(personDetails.middleName);
    }
    if (personDetails.lastName) {
      parts.push(personDetails.lastName);
    }
    if (personDetails.suffix) {
      parts.push(personDetails.suffix);
    }

    if (parts.length === 0) {
      return fullName;
    }

    return parts.join(" ");
  }, [fullName, personDetails]);

  const slides = useMemo(() => {
    const addr = formatNullable(addressLine);
    const dob = formatNullable(personDetails?.dateOfBirth);
    const email = formatNullable(personDetails?.email);
    return [
      { title: "Name", value: resolvedName },
      { title: "Address", value: addr },
      { title: "DOB", value: dob },
      { title: "Email", value: email },
    ];
  }, [marker.dataTypeIdentifier, personDetails?.dateOfBirth, personDetails?.email, resolvedName]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const current = slides[currentSlide];

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
        if ((e.target as HTMLElement).closest("button")) return;
        if (justClosedModalRef.current) {
          justClosedModalRef.current = false;
          return;
        }
        setDetailsModalOpen(true);
      }}
    >
      {/* Header strip - mirrors GovernmentEntityPopup slide layout */}
      <div
        className={`w-full bg-modal-bg relative flex flex-col flex-shrink-0 overflow-hidden ${
          isModal ? "h-[120px]" : "flex-[2] min-h-0"
        }`}
      >
        <div
          className={`flex items-center justify-between flex-shrink-0 relative ${isModal ? "pt-4 px-4" : "pt-2 px-2"}`}
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
            className={`bg-white rounded-lg flex items-center shadow-sm ${isModal ? "px-4 py-1.5" : "rounded px-2 py-0.5"}`}
          >
            <span
              className={`font-semibold text-gray-800 ${isModal ? "text-sm" : "text-[10px]"} max-w-[240px] truncate`}
            >
              {current.value}
            </span>
          </div>
        </div>

        {/* Dots */}
        <div
          className={`flex justify-center items-center flex-shrink-0 space-x-1 ${isModal ? "pb-2" : "pb-1 space-x-0.5"}`}
          role="tablist"
          aria-label={`${entityLabel} slides`}
        >
          {slides.map((_, index) => (
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
          className={`absolute right-2 top-[60%] -translate-y-1/2 text-white hover:opacity-75 z-10 ${isModal ? "p-2" : "p-0.5"}`}
          aria-label="Next slide"
        >
          <ChevronRight className={isModal ? "h-8 w-8" : "h-3 w-3"} />
        </button>
      </div>

      {/* Content area - person details and primary action at bottom */}
      <div
        className={`min-h-0 overflow-auto flex flex-col flex-shrink-0 ${
          isModal ? "flex-[3] p-4 space-y-4" : "flex-[3] p-2 space-y-2"
        }`}
      >
        <div className="space-y-1 text-xs">
          <div className={`flex items-center gap-1 font-bold text-gray-800 text-sm`}>
            <User className="h-3 w-3 text-gray-500 shrink-0" />
            <span>Details:</span>
          </div>
          <div className="flex items-center gap-1 text-gray-800 text-sm">
            <span className="font-semibold">Name:</span>{" "}
            <span className="text-[11px] text-gray-500">{resolvedName}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-800 text-sm">
            <span className="font-semibold">Addr:</span>{" "}
            <span className="text-[11px] text-gray-500">{formatNullable(addressLine)}</span>
          </div>
        </div>

        {personDetails?.personOrgRelationships && personDetails.personOrgRelationships.length > 0 && (
          <PersonOrgSection relationships={personDetails.personOrgRelationships} compact />
        )}

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

          {/* Image carousel (mirrors GovernmentEntityPopup modal carousel) */}
          <div className="relative h-[450px] w-full flex-shrink-0 bg-gray-100">
            {PERSON_GALLERY_IMAGES.map((src, index) => (
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
                setModalImageIndex((prev) => (prev === 0 ? PERSON_GALLERY_IMAGES.length - 1 : prev - 1));
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
                setModalImageIndex((prev) => (prev === PERSON_GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Two-column layout: overview + details + map | contact widget */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col md:flex-row justify-center gap-10 mx-4 md:mx-10 mt-8 mb-8">
            <div className="order-2 md:order-1 flex-1 min-w-0 max-w-3xl">
              {/* Overview header */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">
                  Person detail • Data type:{" "}
                  <span className="font-medium text-gray-700">{marker.dataTypeIdentifier}</span>
                </p>
                <h1 className="text-3xl font-bold my-4 text-gray-900 break-words">{resolvedName}</h1>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <span className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1 text-gray-700 shrink-0" />
                    {formatNullable(addressLine)}
                  </span>
                  <span className="text-sm text-gray-600">{locationString}</span>
                </div>
              </div>

              {/* Key details grid */}
              <div className="border border-gray-200 rounded-xl p-6 mb-8">
                <div className="flex flex-wrap justify-between items-center gap-4 px-2">
                  <div>
                    <div className="text-sm text-gray-500">Date of Birth</div>
                    <div className="font-semibold text-gray-900">{formatNullable(personDetails?.dateOfBirth)}</div>
                  </div>
                  <div className="border-l border-gray-300 h-10 hidden sm:block" />
                  <div>
                    <div className="text-sm text-gray-500">Gender</div>
                    <div className="font-semibold text-gray-900">{formatNullable(personDetails?.gender)}</div>
                  </div>
                  <div className="border-l border-gray-300 h-10 hidden sm:block" />
                  <div>
                    <div className="text-sm text-gray-500">Username</div>
                    <div className="font-semibold text-gray-900">{formatNullable(personDetails?.username)}</div>
                  </div>
                </div>
              </div>

              {/* Organization affiliations */}
              {personDetails?.personOrgRelationships && personDetails.personOrgRelationships.length > 0 && (
                <div className="my-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization</h2>
                  <PersonOrgSection relationships={personDetails.personOrgRelationships} compact={false} hideTitle />
                </div>
              )}

              {/* Residence details */}
              <div className="my-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Residence</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-500">City</div>
                    <div className="font-semibold text-gray-900">{formatNullable(personDetails?.cityOfResidence)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">State</div>
                    <div className="font-semibold text-gray-900">{formatNullable(personDetails?.stateOfResidence)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">ZIP Code</div>
                    <div className="font-semibold text-gray-900">{formatNullable(personDetails?.zipCode)}</div>
                  </div>
                </div>
              </div>

              {/* Map and coordinates */}
              <div className="py-8">
                <h3 className="text-xl font-semibold text-gray-900">Map and Location</h3>
                <div className="flex flex-wrap justify-between items-center gap-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-700 shrink-0" />
                    <span className="font-medium text-gray-700">Address:</span>
                    <span className="ml-1">{formatNullable(addressLine)}</span>
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
                    <User className="text-white shrink-0" size={18} />
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
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Juvenile:</span>
                    <span>{personDetails ? (personDetails.juvenile ? "Yes" : "No") : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Deceased:</span>
                    <span>{personDetails ? (personDetails.deceased ? "Yes" : "No") : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Email verified:</span>
                    <span>
                      {personDetails?.emailVerified == null ? "—" : personDetails.emailVerified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
