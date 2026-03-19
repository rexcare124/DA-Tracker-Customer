'use client';

import { useState, useCallback } from 'react';
import { GovernmentEntityWithRelations } from '@/types/governmentEntityTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DatasetCard from './DatasetCard';
import { 
  Grid3X3, 
  List, 
  Building2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface ResultsListProps {
  entities: GovernmentEntityWithRelations[];
  total: number;
  isLoading?: boolean;
  error?: string | null;
  selectedEntityId?: number | null;
  hoveredEntityId?: number | null;
  onEntitySelect?: (entity: GovernmentEntityWithRelations) => void;
  onEntityHover?: (entityId: number | null) => void;
  onViewDetails?: (entity: GovernmentEntityWithRelations) => void;
  className?: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

/**
 * ResultsList - Results List Wrapper Component
 * 
 * Provides a comprehensive results display with multiple view modes,
 * pagination, and interactive features for government entity data.
 */
export default function ResultsList({
  entities,
  total,
  isLoading = false,
  error = null,
  selectedEntityId = null,
  hoveredEntityId = null,
  onEntitySelect,
  onEntityHover,
  onViewDetails,
  className = '',
  viewMode = 'grid',
  onViewModeChange,
  pagination,
  onPageChange,
  onLimitChange
}: ResultsListProps) {
  
  const [localViewMode, setLocalViewMode] = useState<'grid' | 'list'>(viewMode);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setLocalViewMode(mode);
    onViewModeChange?.(mode);
  }, [onViewModeChange]);

  const handleEntityClick = useCallback((entity: GovernmentEntityWithRelations) => {
    onEntitySelect?.(entity);
  }, [onEntitySelect]);

  const handleEntityHover = useCallback((entityId: number | null) => {
    onEntityHover?.(entityId);
  }, [onEntityHover]);

  const handleViewDetails = useCallback((entity: GovernmentEntityWithRelations) => {
    onViewDetails?.(entity);
  }, [onViewDetails]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`results-list ${className}`}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Search Results</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`results-list ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Search Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (!entities || entities.length === 0) {
    return (
      <div className={`results-list ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Search Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters to find government entities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`results-list ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Search Results</span>
              <Badge variant="secondary">
                {total.toLocaleString()} entities
              </Badge>
            </CardTitle>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={localViewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={localViewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Results Grid/List */}
          <div className={
            localViewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4'
              : 'space-y-4'
          }>
            {entities.map((entity) => (
              <DatasetCard
                key={entity.id}
                entity={entity}
                isSelected={selectedEntityId === entity.id}
                isHovered={hoveredEntityId === entity.id}
                onClick={handleEntityClick}
                onViewDetails={handleViewDetails}
                variant={localViewMode === 'list' ? 'compact' : 'default'}
                onMouseEnter={() => handleEntityHover(entity.id)}
                onMouseLeave={() => handleEntityHover(null)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total.toLocaleString()} results
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    const isCurrentPage = pageNum === pagination.page;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={isCurrentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange?.(pageNum)}
                        className="w-8 h-8 p-0"
                        aria-label={`Page ${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
