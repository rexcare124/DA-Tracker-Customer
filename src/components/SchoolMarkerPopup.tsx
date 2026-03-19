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
import { isSchoolDetails, type School } from "@/types/dataSearchPayloads";
import { School as SchoolIcon } from "lucide-react";

interface SchoolMarkerPopupProps {
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

function formatSchoolAddress(school: School): string | null {
  const cityPart = normalizeNullablePart(school.city?.cityName ?? null);
  const statePart = normalizeNullablePart(school.stateRegion?.regionName ?? school.stateRegion?.regionCode ?? null);
  const parts = [cityPart, statePart].filter((p): p is string => p != null);
  return parts.length > 0 ? `${parts.join(", ")}, USA` : null;
}

export default function SchoolMarkerPopup({ marker, onClose, className = "", variant = "popup" }: SchoolMarkerPopupProps) {
  const schoolDetails = isSchoolDetails(marker.data) ? marker.data : null;

  const resolvedName = formatNullableString(schoolDetails?.schoolName ?? marker.label);
  const addressLine = schoolDetails ? formatSchoolAddress(schoolDetails) : null;
  const addressDisplay = formatNullableString(addressLine);
  const schoolTypeDisplay = formatNullableString(schoolDetails?.schoolType ?? null);
  const districtNameDisplay = formatNullableString(schoolDetails?.district?.districtName ?? null);
  const schoolIdDisplay = schoolDetails ? String(schoolDetails.schoolId) : "—";

  const slides: MarkerPopupSlide[] = useMemo(
    () => [
      { title: "Name", value: resolvedName },
      { title: "Address", value: addressDisplay },
      { title: "School Type", value: schoolTypeDisplay },
      { title: "District", value: districtNameDisplay },
    ],
    [addressDisplay, districtNameDisplay, resolvedName, schoolTypeDisplay],
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
      { label: "School ID", value: schoolIdDisplay },
      { label: "School Type", value: schoolTypeDisplay },
      { label: "District", value: districtNameDisplay },
    ],
    [districtNameDisplay, schoolIdDisplay, schoolTypeDisplay],
  );

  const contactRows: MarkerPopupContactRow[] = useMemo(
    () => [
      { label: "School Type", value: schoolTypeDisplay },
      { label: "District", value: districtNameDisplay },
      { label: "Address", value: addressDisplay },
    ],
    [addressDisplay, districtNameDisplay, schoolTypeDisplay],
  );

  return (
    <EntityMarkerPopupBaseComponent
      marker={marker}
      onClose={onClose}
      variant={variant}
      className={className}
      entityLabel="School"
      DetailsIcon={SchoolIcon}
      ContactIcon={SchoolIcon}
      slides={slides}
      detailRows={detailRows}
      keyDetails={keyDetails}
      contactRows={contactRows}
      resolvedName={resolvedName}
      addressDisplay={addressDisplay}
    />
  );
}

