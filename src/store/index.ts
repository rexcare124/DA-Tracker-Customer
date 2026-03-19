/**
 * Zustand store barrel export.
 *
 * Structure:
 * - store/types.ts         – shared types (DataTypeItem, etc.)
 * - store/data-types-store.ts – data-types reference data (fetched on first load)
 *
 * For first-load hydration, use DataTypesHydrator in the app root (providers).
 */
export { useDataTypesStore, type DataTypesState } from "./data-types-store";
export type { DataTypeItem } from "./types";
