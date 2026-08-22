import React from 'react';

export interface LoadingStateProps {
  count?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 animate-pulse"
        >
          {/* Top header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded-full w-16" />
          </div>

          {/* Value skeleton */}
          <div className="h-8 bg-gray-200 rounded w-3/4" />

          {/* Subtext skeleton */}
          <div className="pt-2 flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-28" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
