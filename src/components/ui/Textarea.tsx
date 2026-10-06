import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <textarea
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl text-sm bg-white dark:bg-slate-900 border transition-all duration-150 p-3 ${
            error
              ? 'border-rose-400 text-rose-900 dark:text-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 hover:border-slate-400 dark:hover:border-slate-600'
          } placeholder-slate-400 dark:placeholder-slate-500 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${className}`}
          rows={props.rows || 3}
          {...props}
        />

        {error ? (
          <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
