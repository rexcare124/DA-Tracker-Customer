// RBCA Data Table - Reusable table component for RBCA registration data
'use client';

import React, { useState, useMemo } from 'react';
import type { RBCARegistration, RBCAStatus } from '@/lib/firebase/index';
import { RBCAStatusBadge } from './RBCAStatusBadge';
import { RBCATableSkeleton } from './RBCALoadingSpinner';
import { filterRegistrations, sortRegistrations } from '@/lib/firebase/rbca-utils';

interface RBCADataTableProps {
  registrations: RBCARegistration[];
  loading?: boolean;
  onRegistrationClick?: (registration: RBCARegistration) => void;
  onStatusUpdate?: (registrationId: string, status: RBCAStatus) => void;
  showActions?: boolean;
  isAdmin?: boolean;
  className?: string;
}

type SortField = 'submittedAt' | 'updatedAt' | 'businessName' | 'status';
type SortOrder = 'asc' | 'desc';

export function RBCADataTable({
  registrations,
  loading = false,
  onRegistrationClick,
  onStatusUpdate,
  showActions = false,
  isAdmin = false,
  className = '',
}: RBCADataTableProps) {
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RBCAStatus | ''>('');

  // Filter and sort registrations
  const filteredAndSortedRegistrations = useMemo(() => {
    let filtered = registrations;

    // Apply filters
    if (searchTerm || statusFilter) {
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (searchTerm) filters.searchTerm = searchTerm;
      filtered = filterRegistrations(registrations, filters);
    }

    // Apply sorting
    return sortRegistrations(filtered, sortField, sortOrder);
  }, [registrations, searchTerm, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  if (loading) {
    return <RBCATableSkeleton rows={8} />;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by business name, owner, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RBCAStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('businessName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Business</span>
                  {getSortIcon('businessName')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('submittedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Submitted</span>
                  {getSortIcon('submittedAt')}
                </div>
              </th>
              {showActions && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedRegistrations.length === 0 ? (
              <tr>
                <td 
                  colSpan={showActions ? 6 : 5} 
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {searchTerm || statusFilter ? 'No registrations match your filters.' : 'No registrations found.'}
                </td>
              </tr>
            ) : (
              filteredAndSortedRegistrations.map((registration) => (
                <tr 
                  key={registration.id}
                  className={`hover:bg-gray-50 ${onRegistrationClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRegistrationClick?.(registration)}
                >
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.businessName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.businessCity}, {registration.businessState}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.firstName} {registration.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {registration.businessType}
                  </td>
                  <td className="px-4 py-4">
                    <RBCAStatusBadge status={registration.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(registration.submittedAt).toLocaleDateString()}
                  </td>
                  {showActions && (
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        {isAdmin && onStatusUpdate && (
                          <select
                            value={registration.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              onStatusUpdate(registration.id, e.target.value as RBCAStatus);
                            }}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      {filteredAndSortedRegistrations.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-700">
          Showing {filteredAndSortedRegistrations.length} of {registrations.length} registrations
        </div>
      )}
    </div>
  );
}

// Export component and types
export type { RBCADataTableProps };
