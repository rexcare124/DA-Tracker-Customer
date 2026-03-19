"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";

/** Data type from GET /api/data-types */
export interface DataTypeItem {
  id: string;
  identifier: string;
  name: string;
  marker: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DataTypesResponse {
  success: boolean;
  data: DataTypeItem[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface UseDataTypesParams {
  page?: number;
  perPage?: number;
  identifier?: string;
  name?: string;
  marker?: string;
}

export interface UseDataTypesReturn {
  data: DataTypeItem[];
  page: number;
  lastPage: number;
  totalCount: number;
  meta: DataTypesResponse["meta"] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches data types from the backend API (GET /api/data-types).
 */
export function useDataTypes(params: UseDataTypesParams = {}): UseDataTypesReturn {
  const { page = 1, perPage, identifier, name, marker } = params;
  const [data, setData] = useState<DataTypeItem[]>([]);
  const [pageState, setPageState] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [meta, setMeta] = useState<DataTypesResponse["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDataTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const searchParams = new URLSearchParams();
      searchParams.set("page", String(page));
      if (perPage != null) searchParams.set("pageSize", String(perPage));
      if (identifier) searchParams.set("identifier", identifier);
      if (name) searchParams.set("name", name);
      if (marker) searchParams.set("marker", marker);
      const query = searchParams.toString();
      const url = query ? `data-types?${query}` : "data-types";
      const res = await api.get<DataTypesResponse>(url);
      const payload = res.data;
      setData(payload.data ?? []);
      setPageState(payload.meta?.page ?? page);
      setLastPage(payload.meta?.total_pages ?? 1);
      setTotalCount(payload.meta?.total ?? 0);
      setMeta(payload.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setData([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, identifier, name, marker]);

  useEffect(() => {
    fetchDataTypes();
  }, [fetchDataTypes]);

  return {
    data,
    page: pageState,
    lastPage,
    totalCount,
    meta,
    isLoading,
    error,
    refetch: fetchDataTypes,
  };
}
