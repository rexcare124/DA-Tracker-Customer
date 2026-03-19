"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { setSelectedEntity, setHoveredEntity } from "@/state/index";
import { GovernmentEntityWithRelations } from "@/types/governmentEntityTypes";
import { getSecurityContext, hasPermission, logSecurityEvent } from "@/lib/security";
import { useFavorites } from "@/hooks/useFavorites";
import GovernmentEntityPopup from "./GovernmentEntityPopup";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";

interface GovernmentEntityPopupContainerProps {
  entityId: number | null;
  /** When provided (e.g. from map click), popup uses this data and does not require auth or fetch */
  initialEntity?: GovernmentEntityWithRelations | null;
  onClose: () => void;
  onEntitySelect?: (entity: GovernmentEntityWithRelations) => void;
  /** When provided, "View Public Service Reviews" triggers SMRC search at (lng, lat) and shows results in right panel */
  onViewPublicServiceReviews?: (lng: number, lat: number) => void;
  className?: string;
  /** "popup" = map popup (fixed size); "modal" = dashboard/card */
  variant?: "popup" | "modal";
}

/**
 * GovernmentEntityPopupContainer - Container Component
 *
 * This container component handles the business logic for government entity popups,
 * including data fetching, security validation, and state management.
 *
 * Features:
 * - Security validation and permission checks
 * - Entity data fetching and caching
 * - Error handling and loading states
 * - Security logging for all interactions
 * - Integration with Redux state management
 */
export default function GovernmentEntityPopupContainer({
  entityId,
  initialEntity = null,
  onClose,
  onEntitySelect,
  onViewPublicServiceReviews,
  className = "",
  variant = "popup",
}: GovernmentEntityPopupContainerProps) {
  const dispatch = useAppDispatch();
  const [entity, setEntity] = useState<GovernmentEntityWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [favoriteToggling, setFavoriteToggling] = useState(false);
  const session = useAppSelector((state) => state.api.queries.getAuthUser?.data);
  const mapUI = useAppSelector((state) => state.global.mapUI);
  const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useFavorites();

  /** Use initialEntity when it matches entityId so map popup does not require auth */
  const resolvedEntity =
    entity ?? (initialEntity && initialEntity.id === entityId ? initialEntity : null);

  /**
   * Fetch entity data with security validation
   */
  const fetchEntityData = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      setSecurityError(null);

      // Get security context
      const securityContext = await getSecurityContext();

      if (!securityContext) {
        setSecurityError("Authentication required to view entity details");
        logSecurityEvent("UNAUTHORIZED_ENTITY_VIEW_ATTEMPT", null, { entityId: id });
        return;
      }

      // Check permission to view entity details
      if (!hasPermission(securityContext, "canViewEntityDetails")) {
        setSecurityError("Insufficient permissions to view entity details");
        logSecurityEvent("INSUFFICIENT_PERMISSIONS", securityContext, {
          action: "viewEntityDetails",
          entityId: id,
        });
        return;
      }

      // Log entity view attempt
      logSecurityEvent("ENTITY_VIEW_ATTEMPT", securityContext, { entityId: id });

      // Fetch entity data from API
      const response = await fetch(`/api/government-entities/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Entity not found");
        } else if (response.status === 403) {
          setSecurityError("Access denied to this entity");
          logSecurityEvent("ENTITY_ACCESS_DENIED", securityContext, { entityId: id });
        } else {
          setError("Failed to load entity details");
        }
        return;
      }

      let entityData: GovernmentEntityWithRelations;
      try {
        const data = await response.json();

        // Handle different response structures (data.entity or just data)
        if (data && typeof data === "object") {
          entityData =
            (data as { entity?: GovernmentEntityWithRelations }).entity ||
            (data as GovernmentEntityWithRelations);
        } else {
          setError("Invalid response format");
          return;
        }
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        setError("Failed to parse entity data");
        return;
      }

      // Validate entity data structure
      if (
        !entityData ||
        typeof entityData !== "object" ||
        !("id" in entityData) ||
        typeof entityData.id !== "number"
      ) {
        setError("Invalid entity data received");
        return;
      }

      setEntity(entityData);

      // Log successful entity view
      logSecurityEvent("ENTITY_VIEW_SUCCESS", securityContext, { entityId: id });
    } catch (error) {
      console.error("Error fetching entity data:", error);
      setError("Failed to load entity details");
      logSecurityEvent("ENTITY_FETCH_ERROR", null, {
        entityId: id,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle entity selection
   */
  const handleEntitySelect = useCallback(
    (selectedEntity: GovernmentEntityWithRelations) => {
      dispatch(setSelectedEntity(selectedEntity.id));
      onEntitySelect?.(selectedEntity);
    },
    [dispatch, onEntitySelect],
  );

  /**
   * Handle popup close. Do not call getSecurityContext here — it uses getServerSession
   * and must only run in a request scope (server), not in client event handlers.
   */
  const handleClose = useCallback(() => {
    dispatch(setSelectedEntity(null));
    onClose();
  }, [dispatch, onClose]);

  /**
   * Handle favorite toggle (heart click)
   */
  const handleFavoriteClick = useCallback(async () => {
    if (!resolvedEntity || favoriteToggling) return;
    setFavoriteToggling(true);
    try {
      await toggleFavorite(resolvedEntity.id);
    } finally {
      setFavoriteToggling(false);
    }
  }, [resolvedEntity, favoriteToggling, toggleFavorite]);

  /**
   * Handle mouse enter/leave for hover effects
   */
  const handleMouseEnter = useCallback(() => {
    if (entityId) {
      dispatch(setHoveredEntity(entityId));
    }
  }, [dispatch, entityId]);

  const handleMouseLeave = useCallback(() => {
    dispatch(setHoveredEntity(null));
  }, [dispatch]);

  // When initialEntity is provided and matches, use it and skip fetch (no auth required)
  useEffect(() => {
    if (initialEntity && initialEntity.id === entityId) {
      setEntity(initialEntity);
      setIsLoading(false);
      setError(null);
      setSecurityError(null);
      return;
    }
    if (entityId) {
      fetchEntityData(entityId);
    } else {
      setEntity(null);
      setError(null);
      setSecurityError(null);
    }
  }, [entityId, initialEntity, fetchEntityData]);

  // Don't render if no entityId
  if (!entityId) {
    return null;
  }

  // Render loading state (skip when we have initialEntity and it matches)
  if (isLoading && !(initialEntity && initialEntity.id === entityId)) {
    return (
      <div className={`government-entity-popup-container ${className}`}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[286px] h-[284px] overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Render security error
  if (securityError) {
    return (
      <div className={`government-entity-popup-container ${className}`}>
        <div className="bg-white rounded-lg shadow-lg border border-red-200 p-4 w-[286px] h-[284px] overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-red-700">Access Denied</span>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              ×
            </button>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{securityError}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Render general error
  if (error) {
    return (
      <div className={`government-entity-popup-container ${className}`}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[286px] h-[284px] overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-900">Error</span>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              ×
            </button>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Render popup with entity data (from fetch or initialEntity)
  if (resolvedEntity) {
    return (
      <div
        className={`government-entity-popup-container ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <GovernmentEntityPopup
          entity={resolvedEntity}
          onClose={handleClose}
          onEntitySelect={handleEntitySelect}
          onViewPublicServiceReviews={onViewPublicServiceReviews}
          isFavorite={isFavorite(resolvedEntity.id)}
          onFavoriteClick={handleFavoriteClick}
          favoriteLoading={favoriteToggling}
          isSelected={mapUI.selectedEntityId === resolvedEntity.id}
          isHovered={mapUI.hoveredEntityId === resolvedEntity.id}
          variant={variant}
        />
      </div>
    );
  }

  return null;
}
