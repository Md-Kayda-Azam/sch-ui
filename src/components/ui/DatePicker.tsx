import React, {
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useCallback,
} from 'react';
import Flatpickr from 'react-flatpickr';
import type { DateTimePickerHandle } from 'react-flatpickr';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import 'flatpickr/dist/themes/light.css';
import './date-picker.css';

export interface DatePickerProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (date: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  fromYear?: number;
  toYear?: number;
}

const parseStringToDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const d = new Date(value + 'T00:00:00');
  return isNaN(d.getTime()) ? undefined : d;
};

const formatDateToString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const DatePicker = forwardRef<DateTimePickerHandle, DatePickerProps>(
  (
    {
      label,
      name,
      value = '',
      onChange,
      onBlur,
      placeholder = 'Select date',
      error,
      helperText,
      minDate,
      maxDate,
      disabled = false,
      required = false,
      className = '',
      id,
      fromYear,
      toYear,
    },
    ref
  ) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const fpInstance = useRef<any>(null);
    const isInternalUpdate = useRef(false);

    const currentYear = new Date().getFullYear();
    const minDateObj = useMemo(() => parseStringToDate(minDate), [minDate]);
    const maxDateObj = useMemo(() => parseStringToDate(maxDate), [maxDate]);
    const selectedDate = useMemo(() => parseStringToDate(value), [value]);

    const startYear = fromYear ?? (minDateObj ? minDateObj.getFullYear() : 1900);
    const endYear =
      toYear ?? (maxDateObj ? maxDateObj.getFullYear() : currentYear + 10);

    // Build the className string
    const inputClasses = useMemo(
      () =>
        `w-full rounded-xl text-sm bg-white dark:bg-slate-900 border transition-all duration-150 py-2.5 pl-10 pr-10 cursor-pointer focus:outline-none ${error
          ? 'border-rose-400 text-rose-900 dark:text-rose-200 ring-1 ring-rose-400'
          : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800' : ''}`,
      [error, disabled]
    );

    // Sync value → flatpickr
    useEffect(() => {
      if (!fpInstance.current) return;
      if (isInternalUpdate.current) {
        isInternalUpdate.current = false;
        return;
      }
      const current = fpInstance.current.selectedDates?.[0];
      const next = selectedDate;
      if (
        (current && next && current.getTime() === next.getTime()) ||
        (!current && !next)
      ) {
        return;
      }
      fpInstance.current.setDate(next || null, false);
    }, [selectedDate]);

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      isInternalUpdate.current = true;
      if (fpInstance.current) fpInstance.current.clear();
      onChange?.('');
      onBlur?.();
    };

    const flatpickrOptions = useMemo(
      () => ({
        // ⚠️ IMPORTANT: dateFormat = display format, NOT machine format
        dateFormat: 'M j, Y',
        allowInput: false,
        clickOpens: !disabled,
        disableMobile: true,
        defaultDate: selectedDate,
        minDate: minDate,
        maxDate: maxDate,
        monthSelectorType: 'dropdown' as const,
        yearSelectorType: 'dropdown' as const,
        // NO altInput, NO altFormat
      }),
      [minDate, maxDate, disabled, selectedDate]
    );

    const handleReady = useCallback(
      (_selectedDates: Date[], _dateStr: string, instance: any) => {
        fpInstance.current = instance;
        instance.set('yearRange', [startYear, endYear]);
      },
      [startYear, endYear]
    );

    const handleChange = useCallback(
      (selectedDates: Date[], _dateStr: string) => {
        isInternalUpdate.current = true;
        const date = selectedDates[0];
        if (!date) {
          onChange?.('');
          return;
        }
        onChange?.(formatDateToString(date));
      },
      [onChange]
    );

    const handleClose = useCallback(() => {
      onBlur?.();
    }, [onBlur]);

    return (
      <div className={`w-full relative ${className}`} ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flatpickr-wrapper">
          {/* Left icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 z-10">
            <CalendarIcon className="w-4 h-4 text-theme-primary opacity-80" />
          </div>

          <Flatpickr
            id={inputId}
            name={name}
            ref={ref}
            options={flatpickrOptions}
            onReady={handleReady}
            onChange={handleChange}
            onClose={handleClose}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
          />

          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
              title="Clear Date"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';