import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      className = '',
      type = 'text',
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

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

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={computedType}
            value={value}
            onChange={onChange}
            className={`w-full rounded-xl text-sm bg-white dark:bg-slate-900 border transition-all duration-150 py-2.5 ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${isPassword || rightIcon || clearable ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-rose-400 text-rose-900 dark:text-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 hover:border-slate-400 dark:hover:border-slate-600'
            } placeholder-slate-400 dark:placeholder-slate-500 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          <div className="absolute right-3 flex items-center gap-1.5 text-slate-400">
            {clearable && value && !props.disabled && (
              <button
                type="button"
                onClick={onClear}
                className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}

            {rightIcon && !isPassword && rightIcon}
          </div>
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
