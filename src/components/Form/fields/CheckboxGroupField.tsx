'use client';

import { useController } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { CheckboxGroupFieldProps } from '../types/fields';

export function CheckboxGroupField({
    name,
    label,
    options,
    layout = 'vertical',
    required,
    disabled,
    className,
    description,
}: CheckboxGroupFieldProps) {
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId } = useFormField(name);

    const { field } = useController({
        name,
        rules: { required: required ? 'Debe seleccionar al menos una opción' : false },
        defaultValue: [],
    });

    const handleChange = (value: string, checked: boolean) => {
        const currentValues = field.value || [];
        const newValues = checked
            ? [...currentValues, value]
            : currentValues.filter((v: string) => v !== value);

        field.onChange(newValues);
    };

    const layoutClasses = {
        vertical: 'space-y-3',
        horizontal: 'flex flex-wrap gap-6',
        grid: 'grid grid-cols-2 gap-3',
    };

    return (
        <div className={cn('space-y-3', className)}>
            <Label
                className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
            >
                {label}
            </Label>

            <div className={layoutClasses[layout]}>
                {options.map((option) => {
                    const isChecked = field.value?.includes(option.value) || false;
                    const checkboxId = `${fieldId}-${option.value}`;

                    return (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={checkboxId}
                                checked={isChecked}
                                disabled={option.disabled || disabled || isDisabled}
                                onCheckedChange={(checked) => handleChange(option.value, !!checked)}
                                aria-describedby={cn(
                                    description && descriptionId,
                                    hasError && errorId,
                                )}
                            />
                            <Label
                                htmlFor={checkboxId}
                                className={cn(
                                    'cursor-pointer text-sm font-normal',
                                    (option.disabled || disabled || isDisabled) &&
                                        'cursor-not-allowed opacity-50',
                                )}
                            >
                                {option.label}
                            </Label>
                        </div>
                    );
                })}
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
