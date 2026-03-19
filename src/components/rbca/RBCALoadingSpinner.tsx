// RBCA Loading Spinner - Reusable loading component for RBCA operations
'use client';

import React from 'react';

interface RBCALoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  overlay?: boolean;
  className?: string;
}

export function RBCALoadingSpinner({ 
  size = 'md', 
  message, 
  overlay = false, 
  className = '' 
}: RBCALoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinner = (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div 
            className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
          />
        </div>
        {message && (
          <p className={`text-gray-600 ${textSizeClasses[size]} text-center max-w-xs`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}

// Inline loading spinner for buttons
interface RBCAButtonSpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function RBCAButtonSpinner({ size = 'sm', className = '' }: RBCAButtonSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}

// Loading skeleton for registration cards
export function RBCARegistrationSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}

// Loading skeleton for statistics cards
export function RBCAStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
}

// Loading skeleton for table rows
export function RBCATableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/8"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}

// Export all components and types
export type { RBCALoadingSpinnerProps, RBCAButtonSpinnerProps };
