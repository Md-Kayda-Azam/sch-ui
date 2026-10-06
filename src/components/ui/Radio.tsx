import React, { forwardRef } from 'react';

export interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  options: RadioOption[];
  label?: string;
  error?: string;
  helperText?: string;
  direction?: 'horizontal' | 'vertical' | 'grid';
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'cards' | 'pills';
  disabled?: boolean;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      onChange,
      options,
      label,
      error,
      helperText,
      direction = 'vertical',
      columns = 2,
      variant = 'default',
      disabled = false,
      className = '',
    },
    ref
  ) => {
    return (
      <div className={`w-full ${className}`} ref={ref}>
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
          </label>
        )}

        {/* Variant: CARDS (Clean modern card selector) */}
        {variant === 'cards' ? (
          <div
            className={`grid gap-2.5 ${
              columns === 4
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : columns === 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {options.map((opt) => {
              const isSelected = value === opt.value;
              const isDisabled = disabled || opt.disabled;

              return (
                <div
                  key={String(opt.value)}
                  onClick={() => !isDisabled && onChange?.(opt.value)}
                  className={`relative p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none flex flex-col justify-between ${
                    isSelected
                      ? 'border-theme-primary bg-theme-subtle shadow-xs ring-1 ring-theme-primary'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {opt.icon && (
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-white dark:bg-slate-800 text-theme-primary shadow-2xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {opt.icon}
                        </div>
                      )}
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            isSelected
                              ? 'text-theme-primary'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {opt.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {opt.badge}
                        </span>
                      )}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-theme-primary bg-theme-primary'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : variant === 'pills' ? (
          /* Variant: PILLS (Segmented button row) */
          <div className="inline-flex flex-wrap p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 gap-1 text-xs">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              const isDisabled = disabled || opt.disabled;

              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  disabled={isDisabled}
                  onClick={() => onChange?.(opt.value)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-theme-primary shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {opt.icon && <span className="w-3.5 h-3.5">{opt.icon}</span>}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Variant: DEFAULT (Classic clean radio list) */
          <div
            className={`space-y-2.5 ${
              direction === 'horizontal' ? 'flex flex-wrap items-center gap-4 space-y-0' : ''
            }`}
          >
            {options.map((opt) => {
              const isSelected = value === opt.value;
              const isDisabled = disabled || opt.disabled;

              return (
                <label
                  key={String(opt.value)}
                  className={`flex items-start gap-2.5 cursor-pointer select-none ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="radio"
                      name={name}
                      value={opt.value}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => onChange?.(opt.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border transition-all duration-150 flex items-center justify-center ${
                        isSelected
                          ? 'border-theme-primary bg-theme-primary ring-2 ring-theme-primary'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected
                          ? 'text-theme-primary'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {opt.description}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {error ? (
          <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
