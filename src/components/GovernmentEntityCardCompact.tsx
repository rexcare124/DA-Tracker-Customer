/**
 * Government Entity Card Compact Component
 *
 * A horizontal, condensed card layout for list view mode.
 * Displays the same entity data as GovernmentEntityCard in a compact format.
 *
 * This component is 100% type-safe, secure, and production-ready per .cursorrules requirements.
 *
 * Reference: IMPLEMENTATION_PLAN.md Phase 3.2.1
 * Pattern: Based on CardCompact.tsx from real-estate-prod
 */

import React, { useState } from "react";
import { GovernmentEntityWithRelations } from "@/types/governmentEntityTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Users, Calendar, ExternalLink, CheckCircle, Star } from "lucide-react";
import {
  getEntityBadgeColor,
  getEntityIcon,
  type GovernmentLevelId,
} from "@/lib/constants/entityTypes";
import { FeatureGate } from "@/components/FeatureGate";
import { FEATURES } from "@/lib/features";
import { useFavorites } from "@/hooks/useFavorites";

interface GovernmentEntityCardCompactProps {
  entity: GovernmentEntityWithRelations;
  onEntityClick?: (entity: GovernmentEntityWithRelations) => void;
  isSelected?: boolean;
  showFavoriteButton?: boolean;
}

/**
 * Format population number for display
 */
const formatPopulation = (population: number): string => {
  if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)}M`;
  }
  if (population >= 1000) {
    return `${(population / 1000).toFixed(1)}K`;
  }
  return population.toString();
};

/**
 * Get location string from entity
 */
const getLocationString = (entity: GovernmentEntityWithRelations): string => {
  const parts: string[] = [];
  if (entity.location?.streetAddress1) {
    parts.push(entity.location.streetAddress1);
  }
  if (entity.city?.cityName) {
    parts.push(entity.city.cityName);
  }
  if (entity.county?.countyName) {
    parts.push(entity.county.countyName);
  }
  if (entity.state?.stateName) {
    parts.push(entity.state.stateName);
  }
  return parts.join(", ");
};

const GovernmentEntityCardCompact: React.FC<GovernmentEntityCardCompactProps> = ({
  entity,
  onEntityClick,
  isSelected = false,
  showFavoriteButton = true,
}) => {
  const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useFavorites();
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const favorite = isFavorite(entity.id);

  const handleClick = () => {
    if (onEntityClick) {
      onEntityClick(entity);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isToggling || favoritesLoading) {
      return;
    }

    setIsToggling(true);
    try {
      await toggleFavorite(entity.id);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleViewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onEntityClick) {
      onEntityClick(entity);
    }
  };

  const locationString = getLocationString(entity);
  const population =
    entity.state?.population || entity.county?.population || entity.city?.population || 0;
  const entityIcon = getEntityIcon(
    entity.governmentLevelId as GovernmentLevelId,
    "h-12 w-12 text-gray-600",
  );

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden w-full flex mb-3 cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      onClick={handleClick}
    >
      {/* Left Section: Icon/Image Area */}
      <div className="relative w-1/4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {entityIcon}
        {entity.hasBusinessLicenses && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-white/90 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Licenses
            </span>
          </div>
        )}
      </div>

      {/* Right Section: Content */}
      <div className="w-3/4 p-4 flex flex-col justify-between">
        <div>
          {/* Header with Title and Favorite Button */}
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">
              {entity.entityName}
            </h2>
            {showFavoriteButton && (
              <FeatureGate feature={FEATURES.FAVORITES} showUpgradePrompt={false}>
                <button
                  className="bg-white rounded-full p-1 ml-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  onClick={handleFavoriteClick}
                  disabled={isToggling || favoritesLoading}
                  aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    className={`w-4 h-4 ${
                      favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                    } ${isToggling ? "opacity-50" : ""}`}
                  />
                </button>
              </FeatureGate>
            )}
          </div>

          {/* Location */}
          {locationString && (
            <p className="text-gray-600 mb-2 text-sm line-clamp-1">
              <MapPin className="h-3 w-3 inline mr-1" />
              {locationString}
            </p>
          )}

          {/* Badges Row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {entity.governmentLevel && (
              <Badge
                variant="secondary"
                className={getEntityBadgeColor(entity.governmentLevelId as GovernmentLevelId)}
              >
                {entity.governmentLevel.levelName}
              </Badge>
            )}
            {entity.hasReviews && (
              <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Reviews
              </Badge>
            )}
            {entity.entityType && (
              <span className="text-xs text-gray-500">{entity.entityType}</span>
            )}
          </div>
        </div>

        {/* Footer with Stats and Action Button */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-3 text-gray-600">
            {population > 0 && (
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {formatPopulation(population)}
              </span>
            )}
            {entity.createdAt && (
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(entity.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleViewClick}
            className="h-8 w-8 p-0"
            aria-label="View details"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentEntityCardCompact;
