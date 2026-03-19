// RBCA Stats Cards - Statistics display component for RBCA dashboard
'use client';

import React from 'react';
import type { RBCAStats } from '@/lib/firebase/rbca-utils';
import { RBCAStatsSkeleton } from './RBCALoadingSpinner';

interface RBCAStatsCardsProps {
  stats: RBCAStats | null;
  loading?: boolean;
  className?: string;
}

export function RBCAStatsCards({ stats, loading = false, className = '' }: RBCAStatsCardsProps) {
  if (loading || !stats) {
    return <RBCAStatsSkeleton />;
  }

  const cards = [
    {
      title: 'Total Registrations',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'blue',
      change: null,
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow',
      change: null,
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
      change: null,
    },
    {
      title: 'Under Review',
      value: stats.under_review,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'indigo',
      change: null,
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        text: 'text-blue-900',
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        text: 'text-yellow-900',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        text: 'text-green-900',
      },
      indigo: {
        bg: 'bg-indigo-50',
        icon: 'text-indigo-600',
        text: 'text-indigo-900',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        
        return (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <div className={colors.icon}>
                  {card.icon}
                </div>
              </div>
            </div>
            
            <div className="flex items-baseline justify-between">
              <p className={`text-2xl font-bold ${colors.text}`}>
                {card.value.toLocaleString()}
              </p>
              
              {card.change && (
                <div className={`flex items-center text-sm ${
                  card.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change > 0 ? (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                    </svg>
                  )}
                  {Math.abs(card.change)}%
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Business Type Distribution Chart Component
interface RBCABusinessTypeChartProps {
  businessTypeStats: Record<string, number>;
  className?: string;
}

export function RBCABusinessTypeChart({ businessTypeStats, className = '' }: RBCABusinessTypeChartProps) {
  const total = Object.values(businessTypeStats).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Type Distribution</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  const businessTypes = Object.entries(businessTypeStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Show top 8 business types

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-gray-500',
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Type Distribution</h3>
      
      <div className="space-y-3">
        {businessTypes.map(([type, count], index) => {
          const percentage = ((count / total) * 100).toFixed(1);
          
          return (
            <div key={type} className="flex items-center">
              <div className="flex-1 flex items-center">
                <div className={`w-3 h-3 rounded-full ${colors[index]} mr-3`}></div>
                <span className="text-sm text-gray-700 flex-1">{type}</span>
                <span className="text-sm font-medium text-gray-900 ml-2">
                  {count} ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Total: {total} registrations across {Object.keys(businessTypeStats).length} business types
        </p>
      </div>
    </div>
  );
}

// Monthly Registration Trend Component
interface RBCAMonthlyTrendProps {
  monthlyStats: Record<string, number>;
  className?: string;
}

export function RBCAMonthlyTrend({ monthlyStats, className = '' }: RBCAMonthlyTrendProps) {
  const months = Object.entries(monthlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12); // Show last 12 months

  if (months.length === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Registration Trend</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  const maxCount = Math.max(...months.map(([, count]) => count));

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Registration Trend</h3>
      
      <div className="space-y-2">
        {months.map(([month, count]) => {
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          const date = new Date(month + '-01');
          const monthName = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
          });
          
          return (
            <div key={month} className="flex items-center">
              <div className="w-16 text-sm text-gray-600 text-right mr-3">
                {monthName}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div 
                  className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${percentage}%` }}
                >
                  {count > 0 && (
                    <span className="text-white text-xs font-medium">
                      {count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export components and types
export type { RBCAStatsCardsProps, RBCABusinessTypeChartProps, RBCAMonthlyTrendProps };
