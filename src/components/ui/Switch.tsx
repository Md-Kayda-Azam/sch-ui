import React, { forwardRef } from 'react';

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      checked = false,
      onChange,
      label,
      description,
      disabled = false,
      error,
      size = 'md',
      className = '',
    },
    ref
  ) => {
    const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const toggle = () => {
      if (!disabled) {
        onChange?.(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    };

    const sizeConfig = {
      sm: {
        track: 'w-8 h-4.5 p-0.5',
        thumb: 'w-3.5 h-3.5',
        translate: 'translate-x-3.5',
      },
      md: {
        track: 'w-11 h-6 p-0.5',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
      },
      lg: {
        track: 'w-14 h-7.5 p-1',
        thumb: 'w-5.5 h-5.5',
        translate: 'translate-x-6.5',
      },
    }[size];

    return (
      <div className={`flex items-start justify-between gap-3 ${className}`}>
        {(label || description) && (
          <div className="flex flex-col cursor-pointer select-none" onClick={toggle}>
            {label && (
              <span
                id={switchId ? `${switchId}-label` : undefined}
                className="text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </span>
            )}
            {error && <span className="text-xs text-rose-500 font-medium mt-1">{error}</span>}
          </div>
        )}

        <button
          type="button"
          role="switch"
          id={switchId}
          ref={ref}
          aria-checked={checked}
          aria-labelledby={switchId ? `${switchId}-label` : undefined}
          disabled={disabled}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${sizeConfig.track
            } ${checked
              ? 'bg-theme-primary'
              : 'bg-slate-300 dark:bg-slate-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`pointer-events-none inline-block rounded-full bg-white shadow-md transform ring-0 transition duration-200 ease-in-out ${sizeConfig.thumb
              } ${checked ? sizeConfig.translate : 'translate-x-0'}`}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
