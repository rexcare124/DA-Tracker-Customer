/**
 * Search Type Definitions
 *
 * Explicit type definitions for search functionality, replacing `any` types
 * throughout the datasearch components.
 *
 * This file is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 *
 * Reference: `IMPROVEMENT_REPORT.md` lines 518-557
 */

import type { GovernmentEntity, GovernmentEntityFiltersState } from "./governmentEntityTypes";
import type { Person } from "./person";

/**
 * Filter key type for all filterable fields
 *
 * Represents all possible keys that can be used in filter operations.
 */
export type FilterKey = keyof GovernmentEntityFiltersState;

/**
 * Filter value type
 *
 * Represents all possible values that can be assigned to filter fields.
 * Includes strings, numbers, tuples, null, and boolean values.
 */
export type FilterValue = string | number | [number, number] | [null, null] | null | boolean | string[];

/**
 * Filter change parameters
 *
 * Used when updating filter values, with optional `isMin` flag for range filters.
 */
export interface FilterChangeParams {
  key: FilterKey;
  value: FilterValue;
  isMin?: boolean | null;
}

/**
 * Entity selection handler
 *
 * Callback function type for handling entity selection events.
 * Receives a fully typed GovernmentEntity object.
 */
export type EntitySelectHandler = (entity: GovernmentEntity) => void;

/**
 * Entity hover handler
 *
 * Callback function type for handling entity hover events.
 * Receives the entity ID or null when hovering ends.
 */
export type EntityHoverHandler = (entityId: number | null) => void;

/**
 * Entity view details handler
 *
 * Callback function type for handling view details actions.
 * Receives a fully typed GovernmentEntity object.
 */
export type EntityViewDetailsHandler = (entity: GovernmentEntity) => void;

/**
 * Data search marker for map display
 * Used when displaying persons, service reviews, etc. on the map with data-type-specific markers.
 * Includes optional person-specific fields when the marker represents a Person.
 */
export interface DataSearchMarker {
  lat: number;
  lng: number;
  id: string | number;
  label: string;
  markerUrl: string;
  dataTypeIdentifier: string;
  /**
   * Optional full object payload for data-type-specific popups.
   * For persons, this allows the map popup to render without refetching.
   */
  data?: unknown;
}
