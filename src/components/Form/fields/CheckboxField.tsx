'use client';

import { useController } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { CheckboxFieldProps } from '../types/fields';

export function CheckboxField({
    name,
    label,
    required,
    disabled,
    className,
    description,
}: CheckboxFieldProps) {
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId } = useFormField(name);

    const { field } = useController({
        name,
        defaultValue: false,
    });

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={fieldId}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    disabled={disabled || isDisabled}
                    aria-describedby={cn(description && descriptionId, hasError && errorId)}
                />
                <Label
                    htmlFor={fieldId}
                    className={cn(
                        'cursor-pointer text-sm font-normal',
                        required && "after:ml-0.5 after:text-red-500 after:content-['*']",
                    )}
                >
                    {label}
                </Label>
            </div>
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
