// RBCA Export Button - Component for exporting RBCA registration data
'use client';

import React, { useState } from 'react';
import type { RBCAStatus } from '@/lib/firebase/index';
import { RBCAButtonSpinner } from './RBCALoadingSpinner';

interface RBCAExportButtonProps {
  onExport: (filters?: ExportFilters) => Promise<void>;
  disabled?: boolean;
  className?: string;
  showFilters?: boolean;
}

interface ExportFilters {
  status?: RBCAStatus;
  businessType?: string;
  dateFrom?: string;
  dateTo?: string;
  format?: 'csv' | 'json';
}

export function RBCAExportButton({ 
  onExport, 
  disabled = false, 
  className = '',
  showFilters = false 
}: RBCAExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<ExportFilters>({
    format: 'csv',
  });

  const handleExport = async (exportFilters?: ExportFilters) => {
    if (isExporting || disabled) return;

    try {
      setIsExporting(true);
      await onExport(exportFilters);
    } catch (error) {
      console.error('Export failed:', error);
      // Error handling could be improved with toast notifications
    } finally {
      setIsExporting(false);
      setShowFilterModal(false);
    }
  };

  const handleQuickExport = () => {
    handleExport(filters);
  };

  const handleFilteredExport = () => {
    if (showFilters) {
      setShowFilterModal(true);
    } else {
      handleQuickExport();
    }
  };

  return (
    <>
      <button
        onClick={handleFilteredExport}
        disabled={disabled || isExporting}
        className={`
          inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
          ${disabled || isExporting 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          }
          transition-colors duration-200 ${className}
        `}
      >
        {isExporting ? (
          <>
            <RBCAButtonSpinner className="mr-2" />
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </>
        )}
      </button>

      {/* Export Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Options</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={filters.format}
                  onChange={(e) => setFilters({ ...filters, format: e.target.value as 'csv' | 'json' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="csv">CSV (Spreadsheet)</option>
                  <option value="json">JSON (Data)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Filter
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as RBCAStatus || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Business Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., Restaurant, Retail, etc."
                  value={filters.businessType || ''}
                  onChange={(e) => setFilters({ ...filters, businessType: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExport(filters)}
                disabled={isExporting}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <RBCAButtonSpinner size="sm" className="mr-2" />
                    Exporting...
                  </>
                ) : (
                  'Export'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Simple export button without filters
interface RBCASimpleExportButtonProps {
  onExport: () => Promise<void>;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function RBCASimpleExportButton({ 
  onExport, 
  disabled = false, 
  className = '',
  label = 'Export CSV'
}: RBCASimpleExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting || disabled) return;

    try {
      setIsExporting(true);
      await onExport();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`
        inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md
        ${disabled || isExporting 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }
        transition-colors duration-200 ${className}
      `}
    >
      {isExporting ? (
        <>
          <RBCAButtonSpinner size="sm" className="mr-2" />
          Exporting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// Export types
export type { RBCAExportButtonProps, RBCASimpleExportButtonProps, ExportFilters };
