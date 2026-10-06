import React, { forwardRef } from 'react';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  FieldErrors,
} from 'react-hook-form';
import type { DateTimePickerHandle } from 'react-flatpickr';
import { Input, InputProps } from '../ui/Input';
import { Select, SelectProps, SelectOption } from '../ui/Select';
import { DatePicker, DatePickerProps } from '../ui/DatePicker';
import { Switch, SwitchProps } from '../ui/Switch';
import { RadioGroup, RadioGroupProps, RadioOption } from '../ui/Radio';
import { Textarea, TextareaProps } from '../ui/Textarea';

// ============================================================================
// 1. FORM INPUT
// ============================================================================
export interface FormInputProps<T extends FieldValues>
  extends Omit<InputProps, 'name' | 'value' | 'defaultValue'> {
  name: Path<T>;
  control: Control<T, any>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  rules,
  error: customError,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...inputProps}
          {...field}
          value={field.value ?? ''}
          error={customError || error?.message}
        />
      )}
    />
  );
}

// ============================================================================
// 2. FORM SELECT
// ============================================================================
export interface FormSelectProps<T extends FieldValues>
  extends Omit<SelectProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'onValueChange'> {
  name: Path<T>;
  control: Control<T, any>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  rules,
  error: customError,
  ...selectProps
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...selectProps}
          name={field.name}
          value={field.value ?? ''}
          onValueChange={field.onChange}
          error={customError || error?.message}
        />
      )}
    />
  );
}

// ============================================================================
// 3. FORM DATE PICKER  (react-flatpickr ভিত্তিক)
// ============================================================================
export interface FormDatePickerProps<T extends FieldValues>
  extends Omit<DatePickerProps, 'value' | 'onChange'> {
  name: Path<T>;
  control: Control<T, any>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormDatePicker<T extends FieldValues>({
  name,
  control,
  rules,
  error: customError,
  ...datePickerProps
}: FormDatePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...datePickerProps}
          value={field.value ?? ''}
          onChange={field.onChange}
          error={customError || error?.message}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

// ============================================================================
// 4. FORM SWITCH / TOGGLE
// ============================================================================
export interface FormSwitchProps<T extends FieldValues>
  extends Omit<SwitchProps, 'checked' | 'onChange'> {
  name: Path<T>;
  control: Control<T, any>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormSwitch<T extends FieldValues>({
  name,
  control,
  rules,
  error: customError,
  ...switchProps
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Switch
          {...switchProps}
          checked={Boolean(field.value)}
          onChange={field.onChange}
          error={customError || error?.message}
        />
      )}
    />
  );
}

// ============================================================================
// 5. FORM RADIO GROUP
// ============================================================================
export interface FormRadioGroupProps<T extends FieldValues>
  extends Omit<RadioGroupProps, 'name' | 'value' | 'onChange'> {
  name: Path<T>;
  control: Control<T, any>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormRadioGroup<T extends FieldValues>({
  name,
  control,
  rules,
  error: customError,
  ...radioProps
}: FormRadioGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <RadioGroup
          {...radioProps}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          error={customError || error?.message}
        />
      )}
    />
  );
}

// ============================================================================
// 6. FORM TEXTAREA
// ============================================================================
export interface FormTextareaProps<T extends FieldValues>
  extends Omit<TextareaProps, 'name' | 'value' | 'defaultValue'> {
  name: Path<T>;
  control: Control<T, any>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  rules,
  error: customError,
  ...textareaProps
}: FormTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Textarea
          {...textareaProps}
          {...field}
          value={field.value ?? ''}
          error={customError || error?.message}
        />
      )}
    />
  );
}