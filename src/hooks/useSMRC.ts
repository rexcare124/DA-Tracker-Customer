"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import type { SMRCDocument } from "@/lib/firebase/smrc-types";

export interface SMRCResponse {
  success: boolean;
  data: SMRCDocument[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface UseSMRCParams {
  page?: number;
  perPage?: number;
  state?: string | null;
  city?: string | null;
  dataTypeIds?: string[];
}

export interface UseSMRCReturn {
  data: SMRCDocument[];
  page: number;
  lastPage: number;
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches SMRC reviews from the backend API (GET /api/smrc).
 */
export function useSMRC(params: UseSMRCParams = {}): UseSMRCReturn {
  const { page = 1, perPage, state, city, dataTypeIds } = params;
  const [data, setData] = useState<SMRCDocument[]>([]);
  const [pageState, setPageState] = useState(1);
  const [lastPageState, setLastPageState] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSMRC = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const searchParams = new URLSearchParams();
      searchParams.set("page", String(page));
      if (perPage != null) searchParams.set("perPage", String(perPage));
      if (state) searchParams.set("state", state);
      if (city) searchParams.set("city", city);
      if (dataTypeIds?.length) searchParams.set("dataTypeIds", dataTypeIds.join(","));
      const url = `smrc?${searchParams.toString()}`;
      const res = await api.get<SMRCResponse>(url);
      const payload = res.data;
      setData(payload.data ?? []);
      setPageState(payload.meta?.page ?? page);
      setLastPageState(payload.meta?.total_pages ?? 1);
      setTotalCount(payload.meta?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, state, city, dataTypeIds?.length ? dataTypeIds.join(",") : ""]);

  useEffect(() => {
    fetchSMRC();
  }, [fetchSMRC]);

  return {
    data,
    page: pageState,
    lastPage: lastPageState,
    totalCount,
    isLoading,
    error,
    refetch: fetchSMRC,
  };
}
