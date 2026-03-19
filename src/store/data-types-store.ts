"use client";

import { create } from "zustand";
import type { DataTypeItem } from "./types";

interface DataTypesApiResponse {
  success?: boolean;
  data?: DataTypeItem[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface DataTypesState {
  items: DataTypeItem[];
  isLoading: boolean;
  error: string | null;
  fetchedAt: number | null;

  /** Ensure data types are loaded (idempotent: fetches only if not yet loaded) */
  ensureLoaded: () => Promise<void>;
  /** Force refetch */
  refetch: () => Promise<void>;
  /** Clear store (e.g. on sign out) */
  reset: () => void;
}

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  fetchedAt: null,
};

export const useDataTypesStore = create<DataTypesState>((set, get) => ({
  ...initialState,

  ensureLoaded: async () => {
    const { items, isLoading } = get();
    if (items.length > 0 || isLoading) return;
    const load = async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetchData("/api/data-types");
        const json: DataTypesApiResponse = await res.json();
        const data = json?.data ?? [];
        set({
          items: data,
          isLoading: false,
          error: null,
          fetchedAt: Date.now(),
        });
      } catch (err) {
        set({
          items: [],
          isLoading: false,
          error: err instanceof Error ? err.message : String(err),
          fetchedAt: null,
        });
      }
    };
    await load();
  },

  refetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchData("/api/data-types");
      const json: DataTypesApiResponse = await res.json();
      const data = json?.data ?? [];
      set({
        items: data,
        isLoading: false,
        error: null,
        fetchedAt: Date.now(),
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  reset: () => set(initialState),
}));

// Wrapper to avoid name collision with state method
async function fetchData(url: string): Promise<Response> {
  return globalThis.fetch(url, { credentials: "include" });
}
