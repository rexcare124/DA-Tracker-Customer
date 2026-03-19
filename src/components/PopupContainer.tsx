"use client";

import type { DataSearchMarker } from "@/types/search";
import PersonMarkerPopup from "./PersonMarkerPopup";
import HomeOwnerAssociationMarkerPopup from "./HomeOwnerAssociationMarkerPopup";
import BusinessMarkerPopup from "./BusinessMarkerPopup";
import NgoMarkerPopup from "./NgoMarkerPopup";
import SchoolMarkerPopup from "./SchoolMarkerPopup";
import {
  DATA_SEARCH_BUSINESS_IDENTIFIER,
  DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER,
  DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER,
  DATA_SEARCH_PERSON_IDENTIFIER,
  DATA_SEARCH_SCHOOL_IDENTIFIER,
} from "@/lib/constants/dataSearchIdentifiers";

interface PopupContainerProps {
  marker: DataSearchMarker;
  onClose: () => void;
  /** "popup" = map popup (fixed size); "modal" = dashboard/card */
  variant?: "popup" | "modal";
  className?: string;
}

/**
 * PopupContainer
 *
 * Wrapper for data search markers.
 */
export default function PopupContainer({ marker, onClose, variant = "popup", className }: PopupContainerProps) {
  switch (marker.dataTypeIdentifier) {
    case DATA_SEARCH_PERSON_IDENTIFIER:
      return <PersonMarkerPopup marker={marker} onClose={onClose} variant={variant} className={className} />;
    case DATA_SEARCH_HOME_OWNER_ASSOCIATION_IDENTIFIER:
      return (
        <HomeOwnerAssociationMarkerPopup marker={marker} onClose={onClose} variant={variant} className={className} />
      );
    case DATA_SEARCH_BUSINESS_IDENTIFIER:
      return <BusinessMarkerPopup marker={marker} onClose={onClose} variant={variant} className={className} />;
    case DATA_SEARCH_NON_GOVERNMENTAL_ORGANIZATION_IDENTIFIER:
      return <NgoMarkerPopup marker={marker} onClose={onClose} variant={variant} className={className} />;
    case DATA_SEARCH_SCHOOL_IDENTIFIER:
      return <SchoolMarkerPopup marker={marker} onClose={onClose} variant={variant} className={className} />;
  }
}
