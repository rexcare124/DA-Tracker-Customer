'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { GovernmentEntityWithRelations } from '@/types/governmentEntityTypes';
import { getSecurityContext, hasPermission, logSecurityEvent } from '@/lib/security';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import DataIcon from '@/components/DataIcon';
import { getEntityBadgeColor } from '@/lib/constants/entityTypes';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Users, 
  Calendar,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Star,
  Award,
  Shield,
  FileText,
  AlertCircle,
  Loader2,
  Edit,
  Download,
  Share2
} from 'lucide-react';

/**
 * Entity Detail Page - Comprehensive Government Entity Information
 * 
 * This page displays detailed information about a specific government entity
 * with role-based access control and comprehensive data visualization.
 * 
 * Features:
 * - Comprehensive entity information display
 * - Role-based access control and security validation
 * - Interactive data visualization and metrics
 * - Navigation and sharing capabilities
 * - Responsive design with accessibility
 */
export default function EntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  
  const [entity, setEntity] = useState<GovernmentEntityWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const entityId = params.id as string;

  /**
   * Fetch entity data with security validation
   */
  const fetchEntityData = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSecurityError(null);

      // Get security context
      const securityContext = await getSecurityContext();
      
      if (!securityContext) {
        setSecurityError('Authentication required to view entity details');
        logSecurityEvent('UNAUTHORIZED_ENTITY_VIEW_ATTEMPT', null, { entityId: id });
        return;
      }

      // Check permission to view entity details
      if (!hasPermission(securityContext, 'canViewEntityDetails')) {
        setSecurityError('Insufficient permissions to view entity details');
        logSecurityEvent('INSUFFICIENT_PERMISSIONS', securityContext, { 
          action: 'viewEntityDetails',
          entityId: id 
        });
        return;
      }

      // Log entity view attempt
      logSecurityEvent('ENTITY_DETAIL_VIEW_ATTEMPT', securityContext, { entityId: id });

      // Fetch entity data from API
      const response = await fetch(`/api/government-entities/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Entity not found');
        } else if (response.status === 403) {
          setSecurityError('Access denied to this entity');
          logSecurityEvent('ENTITY_ACCESS_DENIED', securityContext, { entityId: id });
        } else {
          setError('Failed to load entity details');
        }
        return;
      }

      const entityData: GovernmentEntityWithRelations = await response.json();
      
      // Validate entity data
      if (!entityData || !entityData.id) {
        setError('Invalid entity data received');
        return;
      }

      setEntity(entityData);
      
      // Log successful entity view
      logSecurityEvent('ENTITY_DETAIL_VIEW_SUCCESS', securityContext, { entityId: id });

    } catch (error) {
      console.error('Error fetching entity data:', error);
      setError('Failed to load entity details');
      logSecurityEvent('ENTITY_FETCH_ERROR', null, { 
        entityId: id, 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * Handle edit entity (if user has permission)
   */
  const handleEdit = useCallback(async () => {
    const securityContext = await getSecurityContext();
    if (securityContext && hasPermission(securityContext, 'canManageEntities')) {
      // Navigate to edit page or open edit modal
      logSecurityEvent('ENTITY_EDIT_ATTEMPT', securityContext, { entityId });
      // TODO: Implement edit functionality
    }
  }, [entityId]);

  /**
   * Handle download entity data
   */
  const handleDownload = useCallback(async () => {
    const securityContext = await getSecurityContext();
    if (securityContext && hasPermission(securityContext, 'canExportData')) {
      logSecurityEvent('ENTITY_DATA_EXPORT', securityContext, { entityId });
      // TODO: Implement download functionality
    }
  }, [entityId]);

  /**
   * Handle share entity
   */
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: entity?.entityName || 'Government Entity',
        text: `View details for ${entity?.entityName}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }, [entity]);

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  /**
   * Format population number
   */
  const formatPopulation = (population?: number) => {
    if (!population) return 'N/A';
    return population.toLocaleString();
  };

  /**
   * Get government level badge color based on level ID
   * Uses centralized entity type configuration
   */
  const getGovernmentLevelBadgeColor = (levelId: number): string => {
    if (levelId >= 1 && levelId <= 5) {
      return getEntityBadgeColor(levelId as 1 | 2 | 3 | 4 | 5);
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Fetch entity data when component mounts or entityId changes
  useEffect(() => {
    if (entityId) {
      fetchEntityData(entityId);
    }
  }, [entityId, fetchEntityData]);

  // Security: Check authentication status
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to view entity details.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Security error
  if (securityError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                {securityError}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  // General error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  // Entity not found
  if (!entity) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <Card>
              <CardContent className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Entity Not Found
                </h3>
                <p className="text-gray-600">
                  The requested government entity could not be found.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{entity.entityName}</h1>
              <p className="text-gray-600">{entity.entityType || 'Government Entity'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Entity Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DataIcon type="entity" variant={entity.entityType} size="lg" color="primary" />
                  <span>Entity Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Government Level and Type Badges */}
                <div className="flex flex-wrap gap-2">
                  {entity.governmentLevel && (
                    <Badge 
                      className={`${getGovernmentLevelBadgeColor(entity.governmentLevel.id)} text-sm`}
                    >
                      {entity.governmentLevel.levelName}
                    </Badge>
                  )}
                  {entity.entityType && (
                    <Badge variant="outline" className="text-sm">
                      {entity.entityType}
                    </Badge>
                  )}
                  {entity.isActive && (
                    <Badge variant="secondary" className="text-sm">
                      Active
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {entity.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed">{entity.description}</p>
                  </div>
                )}

                {/* Location Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {[entity.city?.cityName, entity.county?.countyName, entity.state?.stateName]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                    {entity.latitude && entity.longitude && (
                      <div className="text-sm text-gray-500">
                        Coordinates: {entity.latitude.toFixed(4)}, {entity.longitude.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                {(entity.phone || entity.email || entity.website) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      {entity.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a 
                            href={`tel:${entity.phone}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {entity.phone}
                          </a>
                        </div>
                      )}
                      {entity.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a 
                            href={`mailto:${entity.email}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {entity.email}
                          </a>
                        </div>
                      )}
                      {entity.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <a 
                            href={entity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                          >
                            <span>Visit Website</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Data Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Business Licenses</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {entity.hasBusinessLicenses ? (
                        <>
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-green-600 font-medium">Available</span>
                        </>
                      ) : (
                        <span className="text-gray-400">Not Available</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Public Reviews</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {entity.hasReviews ? (
                        <>
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-green-600 font-medium">Available</span>
                        </>
                      ) : (
                        <span className="text-gray-400">Not Available</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Metrics and Metadata */}
          <div className="space-y-6">
            {/* Population Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Population Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {entity.city?.population && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">City Population</span>
                    <span className="font-semibold">{formatPopulation(entity.city.population)}</span>
                  </div>
                )}
                {entity.county?.population && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">County Population</span>
                    <span className="font-semibold">{formatPopulation(entity.county.population)}</span>
                  </div>
                )}
                {entity.state?.population && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">State Population</span>
                    <span className="font-semibold">{formatPopulation(entity.state.population)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Metadata</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold">{formatDate(entity.createdAt)}</span>
                </div>
                {entity.updatedAt !== entity.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-semibold">{formatDate(entity.updatedAt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Entity ID</span>
                  <span className="font-mono text-sm">{entity.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
