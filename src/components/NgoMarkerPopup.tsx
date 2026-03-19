"use client";

import { useMemo } from "react";
import type { DataSearchMarker } from "@/types/search";
import EntityMarkerPopupBaseComponent, {
  type MarkerPopupContactRow,
  type MarkerPopupDetailRow,
  type MarkerPopupKeyDetail,
  type MarkerPopupSlide,
} from "./EntityMarkerPopupBase";
import { formatNullableString } from "@/lib/datasearch/formatNullableString";
import { isNgoDetails, type NonGovernmentalOrganization } from "@/types/dataSearchPayloads";
import { Handshake } from "lucide-react";

interface NgoMarkerPopupProps {
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

function formatNgoAddress(ngo: NonGovernmentalOrganization): string | null {
  const cityPart = normalizeNullablePart(ngo.city?.cityName ?? null);
  const statePart = normalizeNullablePart(ngo.stateRegion?.regionName ?? ngo.stateRegion?.regionCode ?? null);
  const parts = [cityPart, statePart].filter((p): p is string => p != null);
  return parts.length > 0 ? `${parts.join(", ")}, USA` : null;
}

export default function NgoMarkerPopup({ marker, onClose, className = "", variant = "popup" }: NgoMarkerPopupProps) {
  const ngoDetails = isNgoDetails(marker.data) ? marker.data : null;

  const resolvedName = formatNullableString(ngoDetails?.name ?? marker.label);
  const addressLine = ngoDetails ? formatNgoAddress(ngoDetails) : null;
  const addressDisplay = formatNullableString(addressLine);
  const ngoTypeDisplay = formatNullableString(ngoDetails?.ngoType ?? null);
  const einDisplay = ngoDetails ? formatNullableString(ngoDetails.employerIdentificationNumber) : "—";

  const slides: MarkerPopupSlide[] = useMemo(
    () => [
      { title: "Name", value: resolvedName },
      { title: "Address", value: addressDisplay },
      { title: "NGO Type", value: ngoTypeDisplay },
      { title: "EIN", value: einDisplay },
    ],
    [addressDisplay, einDisplay, ngoTypeDisplay, resolvedName],
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
      { label: "EIN", value: einDisplay },
      { label: "Address", value: addressDisplay },
      { label: "NGO Type", value: ngoTypeDisplay },
    ],
    [addressDisplay, einDisplay, ngoTypeDisplay],
  );

  const contactRows: MarkerPopupContactRow[] = useMemo(
    () => [
      { label: "NGO Type", value: ngoTypeDisplay },
      { label: "EIN", value: einDisplay },
      { label: "Address", value: addressDisplay },
    ],
    [addressDisplay, einDisplay, ngoTypeDisplay],
  );

  return (
    <EntityMarkerPopupBaseComponent
      marker={marker}
      onClose={onClose}
      variant={variant}
      className={className}
      entityLabel="Non-governmental Organization"
      DetailsIcon={Handshake}
      ContactIcon={Handshake}
      slides={slides}
      detailRows={detailRows}
      keyDetails={keyDetails}
      contactRows={contactRows}
      resolvedName={resolvedName}
      addressDisplay={addressDisplay}
    />
  );
}

