"use client";

import { useMemo } from "react";
import type { DataSearchMarker } from "@/types/search";
import { formatNullableString } from "@/lib/datasearch/formatNullableString";
import EntityMarkerPopupBaseComponent, {
  type MarkerPopupContactRow,
  type MarkerPopupDetailRow,
  type MarkerPopupKeyDetail,
  type MarkerPopupSlide,
} from "./EntityMarkerPopupBase";
import { isBusinessDetails, type Business } from "@/types/dataSearchPayloads";
import { Building2 } from "lucide-react";

interface BusinessMarkerPopupProps {
  marker: DataSearchMarker;
  onClose: () => void;
  className?: string;
  variant?: "popup" | "modal";
}

function normalizeNullablePart(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function formatBusinessAddress(b: Business): string | null {
  const cityName = normalizeNullablePart(b.city?.name ?? b.location?.city?.name);

  const stateName =
    normalizeNullablePart(
      b.stateRegion?.regionName ??
        b.stateRegion?.name ??
        b.stateRegion?.regionCode ??
        b.stateRegion?.code ??
        b.location?.stateRegion?.regionName ??
        b.location?.stateRegion?.name ??
        b.location?.stateRegion?.regionCode ??
        b.location?.stateRegion?.code,
    ) ?? null;

  const parts = [cityName, stateName].filter((p): p is string => p != null);
  return parts.length > 0 ? `${parts.join(", ")}, USA` : null;
}

export default function BusinessMarkerPopup({ marker, onClose, className = "", variant = "popup" }: BusinessMarkerPopupProps) {
  const businessDetails = isBusinessDetails(marker.data) ? marker.data : null;

  const resolvedName = formatNullableString(businessDetails?.name ?? marker.label);
  const addressLine = businessDetails ? formatBusinessAddress(businessDetails) : null;
  const addressDisplay = formatNullableString(addressLine);
  const websiteDisplay = formatNullableString(businessDetails?.website ?? null);
  const businessIdDisplay = businessDetails ? String(businessDetails.id) : "—";

  const slides: MarkerPopupSlide[] = useMemo(
    () => [
      { title: "Name", value: resolvedName },
      { title: "Address", value: addressDisplay },
      { title: "Website", value: websiteDisplay },
      { title: "Business ID", value: businessIdDisplay },
    ],
    [addressDisplay, businessIdDisplay, resolvedName, websiteDisplay],
  );

  const detailRows: MarkerPopupDetailRow[] = useMemo(
    () => [
      { label: "Name", value: resolvedName },
      { label: "Addr", value: addressDisplay },
    ],
    [addressDisplay, resolvedName],
  );

  const keyDetails: MarkerPopupKeyDetail[] = useMemo(
    () => [
      { label: "Business ID", value: businessIdDisplay },
      { label: "Address", value: addressDisplay },
      { label: "Website", value: websiteDisplay },
    ],
    [addressDisplay, businessIdDisplay, websiteDisplay],
  );

  const contactRows: MarkerPopupContactRow[] = useMemo(
    () => [
      { label: "Website", value: websiteDisplay },
      { label: "Business ID", value: businessIdDisplay },
      { label: "Address", value: addressDisplay },
    ],
    [addressDisplay, businessIdDisplay, websiteDisplay],
  );

  return (
    <EntityMarkerPopupBaseComponent
      marker={marker}
      onClose={onClose}
      variant={variant}
      className={className}
      entityLabel="Business"
      DetailsIcon={Building2}
      ContactIcon={Building2}
      slides={slides}
      detailRows={detailRows}
      keyDetails={keyDetails}
      contactRows={contactRows}
      resolvedName={resolvedName}
      addressDisplay={addressDisplay}
    />
  );
}

