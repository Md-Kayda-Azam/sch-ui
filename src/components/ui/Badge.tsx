import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  dot = true,
  className = '',
}) => {
  const variantDotColors = {
    default: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-cyan-500',
    neutral: 'bg-slate-400',
  };

  const variantTextColors = {
    default: 'text-blue-700 dark:text-blue-300',
    success: 'text-emerald-700 dark:text-emerald-300',
    warning: 'text-amber-700 dark:text-amber-300',
    danger: 'text-rose-700 dark:text-rose-300',
    info: 'text-cyan-700 dark:text-cyan-300',
    neutral: 'text-slate-600 dark:text-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium tracking-tight ${variantTextColors[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${variantDotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
