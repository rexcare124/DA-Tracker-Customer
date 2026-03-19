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
import { isHomeOwnerAssociationDetails, type HomeOwnerAssociation } from "@/types/dataSearchPayloads";
import { Home } from "lucide-react";

interface HomeOwnerAssociationMarkerPopupProps {
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

function formatHomeOwnerAssociationAddress(hoa: HomeOwnerAssociation): string | null {
  const statePart = normalizeNullablePart(hoa.location?.stateRegion?.name ?? hoa.location?.stateRegion?.code);
  const zipPart = normalizeNullablePart(hoa.location?.zipCode?.code);
  const locationTypePart = normalizeNullablePart(hoa.location?.locationType?.name);

  const parts = [statePart, zipPart].filter((p): p is string => p != null);
  if (parts.length > 0) return `${parts.join(", ")}, USA`;
  if (locationTypePart) return `${locationTypePart}, USA`;
  return null;
}

export default function HomeOwnerAssociationMarkerPopup({
  marker,
  onClose,
  className = "",
  variant = "popup",
}: HomeOwnerAssociationMarkerPopupProps) {
  const hoaDetails = isHomeOwnerAssociationDetails(marker.data) ? marker.data : null;

  const resolvedName = formatNullableString(hoaDetails?.name ?? marker.label);
  const addressLine = hoaDetails ? formatHomeOwnerAssociationAddress(hoaDetails) : null;
  const addressDisplay = formatNullableString(addressLine);
  const locationTypeDisplay = formatNullableString(hoaDetails?.location?.locationType?.name ?? null);
  const websiteDisplay = formatNullableString(hoaDetails?.website ?? null);
  const hoaIdDisplay = hoaDetails ? String(hoaDetails.id) : "—";

  const slides: MarkerPopupSlide[] = useMemo(
    () => [
      { title: "Name", value: resolvedName },
      { title: "Address", value: addressDisplay },
      { title: "Location", value: locationTypeDisplay },
      { title: "Website", value: websiteDisplay },
    ],
    [addressDisplay, locationTypeDisplay, resolvedName, websiteDisplay],
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
      { label: "HOA ID", value: hoaIdDisplay },
      { label: "Address", value: addressDisplay },
      { label: "Location type", value: locationTypeDisplay },
    ],
    [addressDisplay, hoaIdDisplay, locationTypeDisplay],
  );

  const contactRows: MarkerPopupContactRow[] = useMemo(
    () => [
      { label: "Website", value: websiteDisplay },
      { label: "HOA ID", value: hoaIdDisplay },
      { label: "Address", value: addressDisplay },
    ],
    [addressDisplay, hoaIdDisplay, websiteDisplay],
  );

  return (
    <EntityMarkerPopupBaseComponent
      marker={marker}
      onClose={onClose}
      variant={variant}
      className={className}
      entityLabel="Homeowner Association"
      DetailsIcon={Home}
      ContactIcon={Home}
      slides={slides}
      detailRows={detailRows}
      keyDetails={keyDetails}
      contactRows={contactRows}
      resolvedName={resolvedName}
      addressDisplay={addressDisplay}
    />
  );
}

