import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variantStyles[variant]} ${className}`}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-slate-50 dark:border-slate-800/40">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
