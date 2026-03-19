"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import type { Person } from "@/types/person";

/** Re-export for consumers that import from usePersons */
export type { Person };

export interface PersonsResponse {
  success: boolean;
  data: Person[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface UsePersonsParams {
  page?: number;
  perPage?: number;
}

export interface UsePersonsReturn {
  data: Person[];
  page: number;
  lastPage: number;
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches persons from the backend API (GET /api/persons).
 */
export function usePersons(params: UsePersonsParams = {}): UsePersonsReturn {
  const { page = 1, perPage } = params;
  const [data, setData] = useState<Person[]>([]);
  const [pageState, setPageState] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPersons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const searchParams = new URLSearchParams();
      searchParams.set("page", String(page));
      if (perPage != null) searchParams.set("perPage", String(perPage));
      const url = `persons?${searchParams.toString()}`;
      const res = await api.get<PersonsResponse>(url);
      const payload = res.data;
      setData(payload.data ?? []);
      setPageState(payload.meta?.page ?? page);
      setLastPage(payload.meta?.total_pages ?? 1);
      setTotalCount(payload.meta?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  return {
    data,
    page: pageState,
    lastPage,
    totalCount,
    isLoading,
    error,
    refetch: fetchPersons,
  };
}
