'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { TextAreaFieldProps } from '../types/fields';

export function TextAreaField({
    name,
    label,
    placeholder,
    required,
    disabled,
    className,
    description,
    maxLength,
    minLength,
    rows = 3,
}: TextAreaFieldProps) {
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

            <Textarea
                {...field}
                id={fieldId}
                placeholder={placeholder}
                disabled={disabled || isDisabled}
                maxLength={maxLength}
                minLength={minLength}
                rows={rows}
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
