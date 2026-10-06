import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: { target: { value: any; name?: string } }) => void;
  onValueChange?: (value: any) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  className?: string;
  id?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      value,
      onChange,
      onValueChange,
      name,
      placeholder = 'Select an option',
      disabled = false,
      required = false,
      searchable = false,
      className = '',
      id,
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    // Filter options if searchable is enabled
    const filteredOptions = searchQuery.trim()
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (opt.description && opt.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : options;

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleSelectOption = (optValue: any) => {
      onValueChange?.(optValue);
      onChange?.({ target: { value: optValue, name } });
      setIsOpen(false);
      setSearchQuery('');
    };

    return (
      <div className={`w-full relative ${className}`} ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Hidden select for standard HTML form/refs */}
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value ?? ''}
          onChange={(e) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
          }}
          disabled={disabled}
          required={required}
          className="sr-only"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom styled select trigger */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full rounded-xl text-sm bg-white dark:bg-slate-900 border transition-all duration-150 py-2.5 pl-3.5 pr-9 cursor-pointer flex items-center justify-between select-none ${
            error
              ? 'border-rose-400 text-rose-900 dark:text-rose-200 ring-1 ring-rose-400'
              : isOpen
              ? 'border-theme-primary ring-2 ring-theme-primary shadow-xs'
              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800' : ''}`}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
            <span
              className={
                selectedOption
                  ? 'font-medium text-slate-900 dark:text-slate-100 truncate'
                  : 'text-slate-400 dark:text-slate-500 truncate'
              }
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <div className="absolute right-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-theme-primary' : ''}`}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-hidden flex flex-col">
            {/* Optional search input */}
            {(searchable || options.length > 7) && (
              <div className="p-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search options..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery('');
                      }}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options list */}
            <div className="overflow-y-auto space-y-0.5 max-h-52">
              {filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);

                  return (
                    <button
                      type="button"
                      key={String(opt.value)}
                      disabled={opt.disabled}
                      onClick={() => handleSelectOption(opt.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                        isSelected
                          ? 'bg-theme-subtle text-theme-primary font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      } ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <div className="truncate">
                          <span className="block truncate">{opt.label}</span>
                          {opt.description && (
                            <span className="text-[10px] text-slate-400 font-normal block truncate">
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {opt.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && <Check className="w-3.5 h-3.5 text-theme-primary" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
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

Select.displayName = 'Select';
