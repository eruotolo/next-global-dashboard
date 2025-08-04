'use client';

import { useController } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { SelectFieldProps } from '../types/fields';

export function SelectField({
    name,
    label,
    options,
    placeholder = 'Seleccionar...',
    required,
    disabled,
    className,
    description,
}: SelectFieldProps) {
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId } = useFormField(name);

    const { field } = useController({
        name,
        defaultValue: '',
    });

    return (
        <div className={cn('space-y-2', className)}>
            <Label
                htmlFor={fieldId}
                className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
            >
                {label}
            </Label>

            <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled || isDisabled}
            >
                <SelectTrigger
                    id={fieldId}
                    className={cn('w-full', hasError && 'border-red-500')}
                    aria-describedby={cn(description && descriptionId, hasError && errorId)}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

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
