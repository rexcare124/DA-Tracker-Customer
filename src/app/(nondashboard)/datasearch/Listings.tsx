'use client';

import { useState, useCallback } from 'react';
import { 
  GovernmentEntityFiltersState, 
  SearchResponse,
  GovernmentEntity,
  GovernmentEntityWithRelations,
  ApiError,
} from '@/types/governmentEntityTypes';
import {
  EntitySelectHandler,
  EntityHoverHandler,
  EntityViewDetailsHandler,
} from '@/types/search';
import { useAppSelector } from '@/state/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ResultsList from '@/components/ResultsList';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  ExternalLink,
  CheckCircle,
  Star
} from 'lucide-react';
import { getEntityBadgeColor, isGovernmentLevelString, type GovernmentLevelId } from '@/lib/constants/entityTypes';
import GovernmentEntityCardCompact from '@/components/GovernmentEntityCardCompact';

interface ListingsProps {
  results?: SearchResponse;
  filters: GovernmentEntityFiltersState;
  onFilterChange: (filters: Partial<GovernmentEntityFiltersState>) => void;
  isLoading?: boolean;
  error?: Error | ApiError | null;
  selectedEntityId?: number | null;
  hoveredEntityId?: number | null;
  onEntitySelect?: EntitySelectHandler;
  onEntityHover?: EntityHoverHandler;
  onViewDetails?: EntityViewDetailsHandler;
}

/**
 * Listings Component - Results List with Pagination and View Modes
 * 
 * Features:
 * - Grid and list view modes
 * - Pagination controls
 * - Entity cards with government-specific information
 * - Sorting options
 * - Empty state handling
 * - Loading states
 * - Security validation
 */
export default function Listings({ 
  results, 
  filters, 
  onFilterChange, 
  isLoading = false,
  error,
  selectedEntityId = null,
  hoveredEntityId = null,
  onEntitySelect,
  onEntityHover,
  onViewDetails
}: ListingsProps) {
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  // Sort options – must match backend enum: entityName | createdAt | governmentLevelId
  const sortOptions = [
    { value: 'entityName', label: 'Name' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'governmentLevelId', label: 'Government Level' },
  ];

  /**
   * Handle pagination
   */
  const handlePageChange = useCallback((page: number) => {
    onFilterChange({ page });
  }, [onFilterChange]);

  /**
   * Handle sort change
   */
  const handleSortChange = useCallback((sortBy: string) => {
    onFilterChange({ sortBy: sortBy as 'entityName' | 'createdAt' | 'governmentLevelId', page: 1 });
  }, [onFilterChange]);

  /**
   * Handle sort order change
   */
  const handleSortOrderChange = useCallback((sortOrder: string) => {
    onFilterChange({ sortOrder: sortOrder as 'asc' | 'desc', page: 1 });
  }, [onFilterChange]);

  /**
   * Handle entity selection
   */
  const handleEntitySelect = useCallback((entityId: string) => {
    setSelectedEntity(entityId);
    // TODO: Navigate to entity detail page
    console.log('Navigate to entity:', entityId);
  }, []);

  /**
   * Get government level badge color
   * Uses centralized entity type configuration
   */
  const getLevelBadgeColor = (level: string): string => {
    if (isGovernmentLevelString(level)) {
      return getEntityBadgeColor(level);
    }
    return 'bg-gray-100 text-gray-800';
  };

  /**
   * Format population number
   */
  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population.toString();
  };

  /**
   * Render entity card for grid view
   */
  const renderEntityCard = (entity: GovernmentEntityWithRelations) => (
    <Card 
      key={entity.id}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedEntityId === entity.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onEntitySelect?.(entity)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {entity.entityName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {entity.entityType}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEntitySelect?.(entity);
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {entity.governmentLevel && (
              <Badge 
                variant="secondary" 
                className={getEntityBadgeColor(entity.governmentLevelId as GovernmentLevelId)}
              >
                {entity.governmentLevel.levelName}
              </Badge>
            )}
            {entity.hasBusinessLicenses && (
              <Badge variant="outline" className="text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Licenses
              </Badge>
            )}
            {entity.hasReviews && (
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                <Star className="h-3 w-3 mr-1" />
                SMRC Reviews
              </Badge>
            )}
          </div>

          {/* SMRC Reviews summary (when entity has reviews) */}
          {entity.hasReviews && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>SMRC reviews available</span>
            </div>
          )}

          {/* Location */}
            {entity.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{entity.location.streetAddress1}</span>
            </div>
          )}

          {/* Population */}
          {(entity.state?.population || entity.county?.population || entity.city?.population) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {(() => {
                  const population = entity.state?.population || entity.county?.population || entity.city?.population;
                  return population && population > 0 ? formatPopulation(population) : 'N/A';
                })()} people
              </span>
            </div>
          )}

          {/* Date */}
          {entity.createdAt && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Created {new Date(entity.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Render entity row for list view
   */
  const renderEntityRow = (entity: GovernmentEntityWithRelations) => (
    <div 
      key={entity.id}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
        selectedEntityId === entity.id ? 'bg-blue-50' : ''
      }`}
      onClick={() => onEntitySelect?.(entity)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {entity.entityName}
              </h3>
              <p className="text-sm text-gray-600">
                {entity.entityType} • {entity.location?.streetAddress1}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {(entity.state?.population || entity.county?.population || entity.city?.population) && (
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {(() => {
                      const population = entity.state?.population || entity.county?.population || entity.city?.population;
                      return population && population > 0 ? formatPopulation(population) : 'N/A';
                    })()}
                  </span>
                </div>
              )}
              
              {entity.createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(entity.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            {entity.governmentLevel && (
              <Badge 
                variant="secondary" 
                className={getEntityBadgeColor(entity.governmentLevelId as GovernmentLevelId)}
              >
                {entity.governmentLevel.levelName}
              </Badge>
            )}
            {entity.hasBusinessLicenses && (
              <Badge variant="outline" className="text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Licenses
              </Badge>
            )}
            {entity.hasReviews && (
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                <Star className="h-3 w-3 mr-1" />
                SMRC Reviews
              </Badge>
            )}
          </div>
          {entity.hasReviews && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>SMRC reviews available</span>
            </div>
          )}
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onEntitySelect?.(entity);
          }}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Loading state with skeleton screens matching content layout
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        {/* Header skeleton matching actual header layout */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        {/* Content skeleton matching grid/list view */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {Array.from({ length: 6 }).map((_: unknown, i: number) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Title skeleton */}
                    <Skeleton className="h-5 w-3/4" />
                    {/* Badges skeleton */}
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    {/* Location skeleton */}
                    <Skeleton className="h-4 w-full" />
                    {/* Stats skeleton */}
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Results
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading the search results. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!results || !results.entities || results.entities.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find government entities.
          </p>
          <Button 
            variant="outline"
            onClick={() => onFilterChange({ 
              searchQuery: '', 
              location: '', 
              governmentLevels: [],
              entityType: '',
              page: 1 
            })}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" role="region" aria-label="Search results">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-gray-600" aria-hidden="true" />
            <span className="font-medium text-gray-900">
              <span aria-live="polite" aria-atomic="true">
                {results.total} {results.total === 1 ? 'Place' : 'Places'}
                {filters.location ? ` in ${filters.location}` : ''}
              </span>
            </span>
          </div>
          
          {/* View mode is controlled by FiltersBar (Redux); display only reflects state */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {viewMode === 'list' ? 'List view' : 'Box view'}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select
              value={filters.sortBy || 'entityName'}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option: { value: string; label: string }) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Order:</span>
            <Select
              value={filters.sortOrder || 'asc'}
              onValueChange={handleSortOrderChange}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto relative">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            viewMode === 'grid' 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-2 pointer-events-none absolute inset-0'
          }`}
        >
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {results.entities.map(renderEntityCard)}
            </div>
          </div>
        </div>
        <div 
          className={`transition-all duration-300 ease-in-out ${
            viewMode === 'list' 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-2 pointer-events-none absolute inset-0'
          }`}
        >
          <div className="p-4">
            {results.entities.map((entity: GovernmentEntityWithRelations) => (
              <GovernmentEntityCardCompact
                key={entity.id}
                entity={entity}
                onEntityClick={onEntitySelect}
                isSelected={selectedEntityId === entity.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {results.pagination && results.pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((results.pagination.page - 1) * results.pagination.limit) + 1} to{' '}
              {Math.min(results.pagination.page * results.pagination.limit, results.pagination.total)} of{' '}
              {results.pagination.total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(results.pagination.page - 1)}
                disabled={!results.pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, results.pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      size="sm"
                      variant={page === results.pagination.page ? 'default' : 'outline'}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(results.pagination.page + 1)}
                disabled={!results.pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
