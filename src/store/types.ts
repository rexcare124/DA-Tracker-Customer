/** Data type from GET /api/data-types */
export interface DataTypeItem {
  id: string;
  identifier: string;
  name: string;
  marker: string | null;
  createdAt: string;
  updatedAt: string;
}
