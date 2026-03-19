import { cleanParams, withToast } from "@/lib/utils";
import { AppUser, UserInfo } from "@/types/index";
import {
  GovernmentEntityWithRelations,
  GovernmentEntityStats,
  GovernmentEntityResponse,
  SearchFilters,
  SearchResponse,
} from "@/types/governmentEntityTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { GovernmentEntityFiltersState } from ".";
import type {
  UserProfileResponse,
  UserProfileError,
  AppUserWithProfile,
} from "@/types/user-profile";
import { isUserProfileResponse, isUserProfileError } from "@/types/user-profile";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      // For now, we'll handle authentication differently since NextAuth doesn't provide access tokens by default
      // The server-side API routes will use getServerSession for authentication
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["GovernmentEntities"],
  endpoints: (build) => ({
    getAuthUser: build.query<AppUser, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await getSession();
          if (!session?.user) {
            return {
              error: {
                status: "CUSTOM_ERROR",
                data: "No authenticated user found",
                error: "No authenticated user found",
              },
            };
          }

          // Fetch full user profile from Firebase via Next.js API route
          // Use direct fetch for Next.js API routes (not external API)
          let profileData: UserProfileResponse | null = null;
          try {
            const response = await fetch("/api/users/profile", {
              method: "GET",
              credentials: "include",
            });

            if (response.ok) {
              const jsonData: unknown = await response.json();
              if (isUserProfileResponse(jsonData)) {
                profileData = jsonData;
                console.log("[DEBUG] User profile data fetched:", profileData);
              } else if (isUserProfileError(jsonData)) {
                console.warn("[WARN] API returned error:", jsonData.error, jsonData.details);
              } else {
                console.warn("[WARN] Invalid response format from profile API");
              }
            } else {
              const errorData: unknown = await response.json().catch(() => ({}));
              if (isUserProfileError(errorData)) {
                console.warn(
                  "[WARN] Failed to fetch user profile:",
                  response.status,
                  response.statusText,
                  errorData,
                );
              } else {
                console.warn(
                  "[WARN] Failed to fetch user profile:",
                  response.status,
                  response.statusText,
                );
              }
            }
          } catch (fetchError) {
            console.error("[ERROR] Error fetching user profile:", fetchError);
          }

          // Get user role from session or determine from user data
          const userRole = session.user.email?.includes("manager") ? "manager" : "local";

          // If profile data was successfully fetched, use it; otherwise use session data
          if (profileData) {
            // Combine session data with Firebase profile data
            const combinedData: AppUserWithProfile = {
              userInfo: {
                id: profileData.id || session.user.id || "",
                email: profileData.email || session.user.email || null,
                name:
                  session.user.name ||
                  `${profileData.firstName} ${profileData.lastName}`.trim() ||
                  null,
              },
              userRole,
              // Include all profile fields for use in components
              ...profileData,
            };
            console.log("[DEBUG] Combined authUser data:", combinedData);
            return {
              data: combinedData as AppUser,
            };
          } else {
            // If profile fetch fails, return basic user info from session
            const userId = session.user.id || session.user.email;
            return {
              data: {
                userInfo: {
                  id: userId,
                  email: session.user.email,
                  name: session.user.name,
                } as UserInfo,
                userRole,
              },
            };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Could not fetch user data";
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: errorMessage,
              error: errorMessage,
            },
          };
        }
      },
    }),

    // government entity related endpoints
    getGovernmentEntities: build.query<
      GovernmentEntityResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 20, search } = {}) => ({
        url: `government-entities`,
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.entities.map(({ id }) => ({ type: "GovernmentEntities" as const, id })),
              { type: "GovernmentEntities", id: "LIST" },
            ]
          : [{ type: "GovernmentEntities", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch government entities.",
        });
      },
    }),

    // Enhanced government entity search – uses Next.js API route (same origin) so auth/session work and no direct backend URL needed
    searchGovernmentEntities: build.query<SearchResponse, Partial<GovernmentEntityFiltersState>>({
      queryFn: async (filters) => {
        // Support both shapes: Redux uses populationRange/dateRange; FiltersFull may send populationMin/Max, dateFrom/To
        const populationMin = filters.populationRange?.[0] ?? (filters as Record<string, unknown>).populationMin;
        const populationMax = filters.populationRange?.[1] ?? (filters as Record<string, unknown>).populationMax;
        const dateFrom = filters.dateRange?.[0] ?? (filters as Record<string, unknown>).dateFrom;
        const dateTo = filters.dateRange?.[1] ?? (filters as Record<string, unknown>).dateTo;
        const searchParams = cleanParams({
          searchQuery: filters.searchQuery,
          location: filters.location,
          governmentLevels: filters.governmentLevels?.length
            ? filters.governmentLevels.join(",")
            : undefined,
          entityType: filters.entityType,
          hasBusinessLicenses: filters.hasBusinessLicenses,
          hasReviews: filters.hasReviews,
          isActive: filters.isActive,
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
          radiusKm: filters.useRadiusSearch ? filters.radiusKm : undefined,
          useRadiusSearch: filters.useRadiusSearch,
          populationMin,
          populationMax,
          budgetMin: filters.budgetRange?.[0],
          budgetMax: filters.budgetRange?.[1],
          crimeRateMin: filters.crimeRateMin,
          crimeRateMax: filters.crimeRateMax,
          dataQualityThreshold: filters.dataQualityThreshold,
          dateFrom,
          dateTo,
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });
        const queryString = new URLSearchParams(
          Object.entries(searchParams).reduce(
            (acc, [k, v]) => {
              acc[k] = String(v);
              return acc;
            },
            {} as Record<string, string>,
          ),
        ).toString();
        const url = `/api/government-entities/search${queryString ? `?${queryString}` : ""}`;
        try {
          const res = await fetch(url, { credentials: "include" });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const message = (errData as { error?: string })?.error ?? res.statusText;
            return {
              error: {
                status: res.status as number,
                data: message,
                error: message,
              },
            };
          }
          const data = (await res.json()) as SearchResponse;
          return { data };
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          return {
            error: {
              status: "CUSTOM_ERROR" as const,
              error: message,
              data: message,
            },
          };
        }
      },
      providesTags: (result) =>
        result?.entities
          ? [
              ...result.entities.map(({ id }: { id: number }) => ({ type: "GovernmentEntities" as const, id })),
              { type: "GovernmentEntities", id: "SEARCH" },
            ]
          : [{ type: "GovernmentEntities", id: "SEARCH" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to search government entities.",
        });
      },
    }),

    getGovernmentEntityStats: build.query<GovernmentEntityStats, void>({
      query: () => `government-entities/stats`,
      providesTags: [{ type: "GovernmentEntities", id: "STATS" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch government entity statistics.",
        });
      },
    }),

    getGovernmentEntity: build.query<GovernmentEntityWithRelations, number>({
      query: (id) => `government-entities/${id}`,
      providesTags: (result, error, id) => [{ type: "GovernmentEntities", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to load government entity details.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useGetGovernmentEntitiesQuery,
  useSearchGovernmentEntitiesQuery,
  useGetGovernmentEntityStatsQuery,
  useGetGovernmentEntityQuery,
} = api;
