'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { GovernmentEntityWithRelations, SearchResponse } from '@/types/governmentEntityTypes';
import { getSecurityContext, hasPermission, logSecurityEvent } from '@/lib/security';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DataIcon from '@/components/DataIcon';
import { 
  Building2, 
  Users, 
  MapPin, 
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Shield,
  Loader2,
  Eye,
  Settings
} from 'lucide-react';

/**
 * Manager Dashboard - Government Entities Management
 * 
 * Administrative dashboard for managing government entities with comprehensive
 * CRUD operations, analytics, and role-based access control.
 * 
 * Features:
 * - Entity management (view, edit, delete)
 * - Bulk operations and data import/export
 * - Analytics and reporting
 * - Role-based access control
 * - Search and filtering capabilities
 */
export default function ManagerDashboard() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  
  const [entities, setEntities] = useState<GovernmentEntityWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntities, setSelectedEntities] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // RTK Query for search - will be implemented when needed
  // const { 
  //   data: searchResults, 
  //   isLoading: isSearchLoading, 
  //   error: searchError,
  //   refetch: refetchSearch 
  // } = useSearchGovernmentEntitiesQuery({});

  /**
   * Check manager permissions
   */
  const checkManagerPermissions = useCallback(async () => {
    const securityContext = await getSecurityContext();
    
    if (!securityContext) {
      setSecurityError('Authentication required to access manager dashboard');
      logSecurityEvent('UNAUTHORIZED_MANAGER_ACCESS_ATTEMPT', null, {});
      return false;
    }

    if (!hasPermission(securityContext, 'canManageEntities')) {
      setSecurityError('Insufficient permissions to access manager dashboard');
      logSecurityEvent('INSUFFICIENT_MANAGER_PERMISSIONS', securityContext, {});
      return false;
    }

    return true;
  }, []);

  /**
   * Fetch entities for management
   */
  const fetchEntities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const hasPermission = await checkManagerPermissions();
      if (!hasPermission) return;

      const securityContext = await getSecurityContext();
      logSecurityEvent('MANAGER_ENTITIES_FETCH_ATTEMPT', securityContext, {});

      // Fetch entities with manager-level access
      const response = await fetch('/api/government-entities?manager=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setSecurityError('Access denied to manager functions');
          logSecurityEvent('MANAGER_ACCESS_DENIED', securityContext, {});
        } else {
          setError('Failed to load entities');
        }
        return;
      }

      const data: SearchResponse = await response.json();
      setEntities(data.entities || []);
      
      logSecurityEvent('MANAGER_ENTITIES_FETCH_SUCCESS', securityContext, { 
        count: data.entities?.length || 0 
      });

    } catch (error) {
      console.error('Error fetching entities:', error);
      setError('Failed to load entities');
      logSecurityEvent('MANAGER_ENTITIES_FETCH_ERROR', null, { 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setIsLoading(false);
    }
  }, [checkManagerPermissions]);

  /**
   * Handle entity selection
   */
  const handleEntitySelect = useCallback((entityId: number) => {
    setSelectedEntities(prev => 
      prev.includes(entityId) 
        ? prev.filter(id => id !== entityId)
        : [...prev, entityId]
    );
  }, []);

  /**
   * Handle select all entities
   */
  const handleSelectAll = useCallback(() => {
    if (selectedEntities.length === entities.length) {
      setSelectedEntities([]);
    } else {
      setSelectedEntities(entities.map(entity => entity.id));
    }
  }, [selectedEntities.length, entities]);

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = useCallback(async () => {
    if (selectedEntities.length === 0) return;

    const securityContext = await getSecurityContext();
    if (!securityContext || !hasPermission(securityContext, 'canManageEntities')) {
      setSecurityError('Insufficient permissions to delete entities');
      return;
    }

    try {
      logSecurityEvent('BULK_DELETE_ATTEMPT', securityContext, { 
        entityIds: selectedEntities 
      });

      const response = await fetch('/api/government-entities/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entityIds: selectedEntities }),
      });

      if (!response.ok) {
        setError('Failed to delete selected entities');
        return;
      }

      // Refresh entities list
      await fetchEntities();
      setSelectedEntities([]);
      
      logSecurityEvent('BULK_DELETE_SUCCESS', securityContext, { 
        entityIds: selectedEntities 
      });

    } catch (error) {
      console.error('Error deleting entities:', error);
      setError('Failed to delete selected entities');
    }
  }, [selectedEntities, fetchEntities]);

  /**
   * Handle export data
   */
  const handleExport = useCallback(async () => {
    const securityContext = await getSecurityContext();
    if (!securityContext || !hasPermission(securityContext, 'canExportData')) {
      setSecurityError('Insufficient permissions to export data');
      return;
    }

    try {
      logSecurityEvent('DATA_EXPORT_ATTEMPT', securityContext, {});

      const response = await fetch('/api/government-entities/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setError('Failed to export data');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `government-entities-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      logSecurityEvent('DATA_EXPORT_SUCCESS', securityContext, {});

    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data');
    }
  }, []);

  /**
   * Handle import data
   */
  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const securityContext = await getSecurityContext();
    if (!securityContext || !hasPermission(securityContext, 'canManageEntities')) {
      setSecurityError('Insufficient permissions to import data');
      return;
    }

    try {
      logSecurityEvent('DATA_IMPORT_ATTEMPT', securityContext, { fileName: file.name });

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/government-entities/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setError('Failed to import data');
        return;
      }

      // Refresh entities list
      await fetchEntities();
      
      logSecurityEvent('DATA_IMPORT_SUCCESS', securityContext, { fileName: file.name });

    } catch (error) {
      console.error('Error importing data:', error);
      setError('Failed to import data');
    }
  }, [fetchEntities]);

  // Fetch entities on mount
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  // Security: Check authentication status
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
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
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to access the manager dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Security error
  if (securityError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {securityError}
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
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // General error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const filteredEntities = entities.filter(entity =>
    entity.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.entityType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.city?.cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Government Entities Management</h1>
            <p className="text-gray-600">Manage and monitor government entities</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <label htmlFor="import-file">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
            </label>
            <input
              id="import-file"
              type="file"
              accept=".csv,.xlsx"
              onChange={handleImport}
              className="hidden"
            />
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Entity
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Entities</p>
                  <p className="text-2xl font-bold text-gray-900">{entities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Entities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {entities.filter(e => e.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(entities.map(e => e.city?.cityName).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">With Licenses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {entities.filter(e => e.hasBusinessLicenses).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search entities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={viewMode} onValueChange={(value: 'grid' | 'table') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
              {selectedEntities.length > 0 && (
                <Button variant="destructive" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedEntities.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Entities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Government Entities</CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">
                        <input
                          type="checkbox"
                          checked={selectedEntities.length === entities.length && entities.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntities.map((entity) => (
                      <tr key={entity.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedEntities.includes(entity.id)}
                            onChange={() => handleEntitySelect(entity.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <DataIcon type="entity" variant={entity.entityType} size="sm" />
                            <span className="font-medium">{entity.entityName}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">{entity.entityType}</Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">
                              {entity.city?.cityName}, {entity.state?.stateName}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant={entity.isActive ? "default" : "secondary"}>
                            {entity.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEntities.map((entity) => (
                  <Card key={entity.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedEntities.includes(entity.id)}
                            onChange={() => handleEntitySelect(entity.id)}
                            className="rounded"
                          />
                          <DataIcon type="entity" variant={entity.entityType} size="md" />
                        </div>
                        <Badge variant={entity.isActive ? "default" : "secondary"}>
                          {entity.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{entity.entityName}</h3>
                      <p className="text-sm text-gray-600 mb-3">{entity.entityType}</p>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>{entity.city?.cityName}, {entity.state?.stateName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}