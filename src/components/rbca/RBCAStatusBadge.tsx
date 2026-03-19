// RBCA Status Badge - Visual status indicator component
'use client';

import React from 'react';
import type { RBCAStatus } from '@/lib/firebase/index';
import { getStatusConfig } from '@/lib/firebase/rbca-utils';

interface RBCAStatusBadgeProps {
  status: RBCAStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function RBCAStatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true, 
  className = '' 
}: RBCAStatusBadgeProps) {
  const statusConfig = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  };

  const baseClasses = 'inline-flex items-center gap-1 rounded-full border font-medium';
  const statusClasses = colorClasses[statusConfig.color as keyof typeof colorClasses];
  const sizeClass = sizeClasses[size];

  return (
    <span 
      className={`${baseClasses} ${statusClasses} ${sizeClass} ${className}`}
      title={statusConfig.description}
    >
      {showIcon && <span>{statusConfig.icon}</span>}
      <span>{statusConfig.label}</span>
    </span>
  );
}

// Export component and types
export type { RBCAStatusBadgeProps };
