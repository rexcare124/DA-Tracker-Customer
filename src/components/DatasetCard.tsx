'use client';

import { GovernmentEntityWithRelations } from '@/types/governmentEntityTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DataIcon from './DataIcon';
import { 
  MapPin, 
  Users, 
  Calendar,
  ExternalLink,
  Star,
  Award
} from 'lucide-react';

interface DatasetCardProps {
  entity: GovernmentEntityWithRelations;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (entity: GovernmentEntityWithRelations) => void;
  onViewDetails?: (entity: GovernmentEntityWithRelations) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * DatasetCard - Enhanced Entity Card Component
 * 
 * Displays government entity information in a card format with
 * interactive features and responsive design.
 */
export default function DatasetCard({
  entity,
  isSelected = false,
  isHovered = false,
  onClick,
  onViewDetails,
  onMouseEnter,
  onMouseLeave,
  className = '',
  variant = 'default'
}: DatasetCardProps) {
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatPopulation = (population?: number) => {
    if (!population) return null;
    return population.toLocaleString();
  };

  const getGovernmentLevelBadgeColor = (levelId: number) => {
    switch (levelId) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-green-100 text-green-800';
      case 4: return 'bg-purple-100 text-purple-800';
      case 5: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    onClick?.(entity);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(entity);
  };

  if (variant === 'compact') {
    return (
      <Card 
        className={`
          dataset-card dataset-card--compact
          ${className}
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
          ${isHovered ? 'shadow-md' : 'shadow-sm'}
          transition-all duration-200 cursor-pointer
          hover:shadow-lg
        `}
        onClick={handleCardClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <DataIcon 
              type="entity" 
              variant={entity.entityType} 
              size="md" 
              color="primary" 
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {entity.entityName}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {entity.entityType} • {entity.governmentLevel?.levelName}
              </p>
            </div>
            {entity.governmentLevel && (
              <Badge 
                className={`${getGovernmentLevelBadgeColor(entity.governmentLevel.id)} text-xs`}
              >
                {entity.governmentLevel.levelName}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`
        dataset-card dataset-card--${variant}
        ${className}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
        transition-all duration-200 cursor-pointer
        hover:shadow-lg
      `}
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <DataIcon 
              type="entity" 
              variant={entity.entityType} 
              size="lg" 
              color="primary" 
              className="mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                {entity.entityName}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {entity.entityType || 'Government Entity'}
              </p>
            </div>
          </div>
          {entity.governmentLevel && (
            <Badge 
              className={`${getGovernmentLevelBadgeColor(entity.governmentLevel.id)} text-xs flex-shrink-0`}
            >
              {entity.governmentLevel.levelName}
            </Badge>
          )}
        </div>
        
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {entity.isActive && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
          {entity.hasBusinessLicenses && (
            <Badge variant="outline" className="text-xs flex items-center space-x-1">
              <Award className="h-3 w-3" />
              <span>Licenses</span>
            </Badge>
          )}
          {entity.hasReviews && (
            <Badge variant="outline" className="text-xs flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>Reviews</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        {entity.description && variant === 'default' && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {entity.description}
          </p>
        )}

        {/* Location Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="truncate">
              {[entity.city?.cityName, entity.county?.countyName, entity.state?.stateName]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
          
          {/* Population Information */}
          {(entity.state?.population || entity.county?.population || entity.city?.population) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-gray-500" />
              <span>
                {entity.city?.population && `City: ${formatPopulation(entity.city.population)}`}
                {entity.county?.population && ` • County: ${formatPopulation(entity.county.population)}`}
                {entity.state?.population && ` • State: ${formatPopulation(entity.state.population)}`}
              </span>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
          <Calendar className="h-3 w-3" />
          <span>Created: {formatDate(entity.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleViewDetails}
            size="sm"
            className="flex-1"
            variant="outline"
          >
            View Details
          </Button>
          {entity.website && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                window.open(entity.website, '_blank', 'noopener,noreferrer');
              }}
              className="px-2"
              aria-label="Visit website"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
