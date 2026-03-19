'use client';

import { useState, useCallback } from 'react';
import { GovernmentEntityFiltersState } from '@/types/governmentEntityTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  X, 
  MapPin, 
  Building2, 
  Users, 
  Calendar,
  Star,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FilterPanelProps {
  filters: GovernmentEntityFiltersState;
  onFilterChange: (filters: Partial<GovernmentEntityFiltersState>) => void;
  onReset: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
  collapsible?: boolean;
  title?: string;
}

/**
 * FilterPanel - Reusable Filter Components
 * 
 * Provides a comprehensive filter interface for government entity search
 * with collapsible sections and responsive design.
 */
export default function FilterPanel({
  filters,
  onFilterChange,
  onReset,
  className = '',
  variant = 'default',
  collapsible = false,
  title = 'Search Filters'
}: FilterPanelProps) {
  
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = useCallback((key: keyof GovernmentEntityFiltersState, value: any) => {
    onFilterChange({ [key]: value });
  }, [onFilterChange]);

  const handleToggleFilter = useCallback((key: keyof GovernmentEntityFiltersState, value: any) => {
    const currentValue = filters[key];
    const newValue = currentValue === value ? undefined : value;
    handleFilterChange(key, newValue);
  }, [filters, handleFilterChange]);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.location) count++;
    if (filters.governmentLevels?.length) count++;
    if (filters.entityType) count++;
    if (filters.hasBusinessLicenses) count++;
    if (filters.hasReviews) count++;
    if (filters.isActive !== undefined) count++;
    if (filters.coordinates?.[0] && filters.coordinates?.[1]) count++;
    if (filters.radiusKm && filters.useRadiusSearch) count++;
    if (filters.populationRange?.[0] || filters.populationRange?.[1]) count++;
    if (filters.dateRange?.[0] || filters.dateRange?.[1]) count++;
    return count;
  }, [filters]);

  const clearFilter = useCallback((key: keyof GovernmentEntityFiltersState) => {
    handleFilterChange(key, undefined);
  }, [handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    onReset();
  }, [onReset]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const activeFiltersCount = getActiveFiltersCount();

  if (variant === 'compact') {
    return (
      <div className={`filter-panel filter-panel--compact ${className}`}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              {collapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              )}
            </div>
          </CardHeader>
          
          {isExpanded && (
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.hasBusinessLicenses ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleFilter('hasBusinessLicenses', true)}
                    className="text-xs"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Licenses
                  </Button>
                  <Button
                    variant={filters.hasReviews ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleFilter('hasReviews', true)}
                    className="text-xs"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Reviews
                  </Button>
                  <Button
                    variant={filters.isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleFilter('isActive', true)}
                    className="text-xs"
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    Active
                  </Button>
                </div>
                
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs text-gray-600"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className={`filter-panel filter-panel--${variant} ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>{title}</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">
                  {activeFiltersCount} active
                </Badge>
              )}
            </CardTitle>
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpanded}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            <div className="space-y-6">
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.searchQuery && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <span>Search: {filters.searchQuery}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('searchQuery')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.location && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{filters.location}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('location')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.governmentLevels?.length && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Building2 className="h-3 w-3" />
                        <span>Levels: {filters.governmentLevels.length}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('governmentLevels')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.entityType && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <span>Type: {filters.entityType}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('entityType')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.hasBusinessLicenses && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>Has Licenses</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('hasBusinessLicenses')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.hasReviews && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Has Reviews</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('hasReviews')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.coordinates?.[0] && filters.coordinates?.[1] && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>Location Set</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('coordinates')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.radiusKm && filters.useRadiusSearch && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <span>Radius: {filters.radiusKm}km</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('useRadiusSearch')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.populationRange?.[0] && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>Pop: {filters.populationRange[0]}+</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('populationRange')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.dateRange?.[0] && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Date Range</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter('dateRange')}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Filter Buttons */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Filters</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={filters.hasBusinessLicenses ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleFilter('hasBusinessLicenses', true)}
                    className="justify-start"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Has Licenses
                  </Button>
                  <Button
                    variant={filters.hasReviews ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleFilter('hasReviews', true)}
                    className="justify-start"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Has Reviews
                  </Button>
                  <Button
                    variant={filters.isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleFilter('isActive', true)}
                    className="justify-start"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Active Only
                  </Button>
                  <Button
                    variant={filters.useRadiusSearch ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleFilter('useRadiusSearch', true)}
                    className="justify-start"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Radius Search
                  </Button>
                </div>
              </div>

              {/* Clear All Button */}
              {activeFiltersCount > 0 && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
