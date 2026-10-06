import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface FilterBarProps {
  children: React.ReactNode;
  onReset?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  onReset,
  hasActiveFilters = false,
  className = '',
}) => {
  return (
    <div
      className={`p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>
        {children}
      </div>

      {hasActiveFilters && onReset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          leftIcon={<X className="w-3.5 h-3.5" />}
          className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700"
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};
