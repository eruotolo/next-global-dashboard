'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { TextFieldProps } from '../types/fields';

export function TextField({
    name,
    label,
    type = 'text',
    placeholder,
    required,
    disabled,
    className,
    description,
    maxLength,
    minLength,
}: TextFieldProps) {
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId, ...field } =
        useFormField(name);

    return (
        <div className={cn('space-y-2', className)}>
            <Label
                htmlFor={fieldId}
                className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
            >
                {label}
            </Label>

            <Input
                {...field}
                id={fieldId}
                type={type}
                placeholder={placeholder}
                disabled={disabled || isDisabled}
                maxLength={maxLength}
                minLength={minLength}
                className={cn(hasError && 'border-red-500 focus-visible:ring-red-500')}
                aria-describedby={cn(description && descriptionId, hasError && errorId)}
            />

            {description && (
                <p id={descriptionId} className="text-muted-foreground text-sm">
                    {description}
                </p>
            )}

            {hasError && (
                <p id={errorId} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
