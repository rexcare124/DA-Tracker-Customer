import React, { useState } from "react";
import { GovernmentEntityWithRelations } from "@/types/governmentEntityTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Users, Star } from "lucide-react";
import { FeatureGate } from "@/components/FeatureGate";
import { FEATURES } from "@/lib/features";
import { useFavorites } from "@/hooks/useFavorites";

interface GovernmentEntityCardProps {
  entity: GovernmentEntityWithRelations;
  onEntityClick?: (entity: GovernmentEntityWithRelations) => void;
}

const GovernmentEntityCard: React.FC<GovernmentEntityCardProps> = ({
  entity,
  onEntityClick,
}) => {
  const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useFavorites();
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const favorite = isFavorite(entity.id);

  const handleClick = () => {
    if (onEntityClick) {
      onEntityClick(entity);
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isToggling || favoritesLoading) {
      return;
    }

    setIsToggling(true);
    try {
      await toggleFavorite(entity.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const getLocationString = () => {
    const parts = [];
    if (entity.city?.cityName) parts.push(entity.city.cityName);
    if (entity.county?.countyName) parts.push(entity.county.countyName);
    if (entity.state?.stateName) parts.push(entity.state.stateName);
    return parts.join(", ");
  };

  const getGovernmentLevelColor = (levelName?: string) => {
    switch (levelName?.toLowerCase()) {
      case "federal":
        return "bg-red-100 text-red-800";
      case "state":
        return "bg-blue-100 text-blue-800";
      case "county":
        return "bg-green-100 text-green-800";
      case "city":
        return "bg-purple-100 text-purple-800";
      case "municipal":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {entity.entityName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <FeatureGate feature={FEATURES.FAVORITES} showUpgradePrompt={false}>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleFavoriteToggle}
                disabled={isToggling || favoritesLoading}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star
                  className={`h-4 w-4 ${
                    favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                  } ${isToggling ? "opacity-50" : ""}`}
                />
              </Button>
            </FeatureGate>
            <Badge 
              className={`ml-2 ${getGovernmentLevelColor(entity.governmentLevel?.levelName)}`}
            >
              {entity.governmentLevel?.levelName || "Unknown"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Location Information */}
          {getLocationString() && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{getLocationString()}</span>
            </div>
          )}

          {/* Government Level */}
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Government Level: {entity.governmentLevel?.levelName || "Unknown"}</span>
          </div>

          {/* Additional Info */}
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>ID: {entity.id}</span>
          </div>

          {/* Created Date */}
          <div className="text-xs text-gray-400 pt-2 border-t">
            Created: {new Date(entity.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GovernmentEntityCard;
