// RBCA API Client - Frontend service for API communication
'use client';

import type { 
  RBCARegistration, 
  CreateRBCARegistration, 
  UpdateRBCARegistration,
  RBCAStatus 
} from '@/lib/firebase/index';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
  total?: number;
}

interface RegistrationStats {
  overview: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    under_review: number;
    womanOwned: number;
    veteranOwned: number;
    minorityOwned: number;
    hubzoneEligible: number;
  };
  monthly: Array<{ month: string; count: number }>;
  businessTypes: Array<{ type: string; count: number }>;
  certifications: Array<{ certification: string; count: number }>;
  dateRange: {
    from?: string;
    to?: string;
  };
  totalRecords: number;
}

// API Client class
export class RBCAApiClient {
  private baseUrl: string;
  private getAuthToken: () => Promise<string | null>;

  constructor(baseUrl = '/api/rbca', getAuthToken: () => Promise<string | null>) {
    this.baseUrl = baseUrl;
    this.getAuthToken = getAuthToken;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication token not available',
          code: 'AUTH_ERROR',
        };
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          code: errorData.code || 'HTTP_ERROR',
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        code: 'NETWORK_ERROR',
      };
    }
  }

  // Get registrations (user's own or all for admin)
  async getRegistrations(params?: {
    userId?: string;
    status?: RBCAStatus;
    adminView?: boolean;
  }): Promise<ApiResponse<RBCARegistration[]>> {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.set('userId', params.userId);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.adminView) searchParams.set('adminView', 'true');

    const endpoint = `/registrations${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.makeRequest<RBCARegistration[]>(endpoint);
  }

  // Get specific registration by ID
  async getRegistration(id: string): Promise<ApiResponse<RBCARegistration>> {
    return this.makeRequest<RBCARegistration>(`/registrations/${id}`);
  }

  // Create new registration
  async createRegistration(
    data: CreateRBCARegistration
  ): Promise<ApiResponse<RBCARegistration>> {
    return this.makeRequest<RBCARegistration>('/registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update registration status (admin only)
  async updateRegistrationStatus(
    id: string,
    data: UpdateRBCARegistration
  ): Promise<ApiResponse<RBCARegistration>> {
    return this.makeRequest<RBCARegistration>(`/registrations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Delete registration (admin only)
  async deleteRegistration(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/registrations/${id}`, {
      method: 'DELETE',
    });
  }

  // Get registration statistics (admin only)
  async getStats(params?: {
    dateFrom?: string;
    dateTo?: string;
    status?: RBCAStatus;
  }): Promise<ApiResponse<RegistrationStats>> {
    const searchParams = new URLSearchParams();
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.status) searchParams.set('status', params.status);

    const endpoint = `/stats${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.makeRequest<RegistrationStats>(endpoint);
  }

  // Export registrations as CSV (admin only)
  async exportRegistrations(params?: {
    status?: RBCAStatus;
    dateFrom?: string;
    dateTo?: string;
    womanOwned?: boolean;
    veteranOwned?: boolean;
    minorityOwned?: boolean;
    hubzoneEligible?: boolean;
    search?: string;
  }): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication token not available' };
      }

      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
      if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
      if (params?.womanOwned !== undefined) searchParams.set('womanOwned', params.womanOwned.toString());
      if (params?.veteranOwned !== undefined) searchParams.set('veteranOwned', params.veteranOwned.toString());
      if (params?.minorityOwned !== undefined) searchParams.set('minorityOwned', params.minorityOwned.toString());
      if (params?.hubzoneEligible !== undefined) searchParams.set('hubzoneEligible', params.hubzoneEligible.toString());
      if (params?.search) searchParams.set('search', params.search);

      const endpoint = `/export${searchParams.toString() ? `?${searchParams}` : ''}`;
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `Export failed: ${response.statusText}`,
        };
      }

      const blob = await response.blob();
      return { success: true, blob };
    } catch (error) {
      console.error('Export request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      };
    }
  }

  // Download CSV file
  downloadCSV(blob: Blob, filename?: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `rbca_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

// Hook to create API client instance
export function useRBCAApiClient(getAuthToken: () => Promise<string | null>) {
  return new RBCAApiClient('/api/rbca', getAuthToken);
}

// Export types
export type { ApiResponse, RegistrationStats };
