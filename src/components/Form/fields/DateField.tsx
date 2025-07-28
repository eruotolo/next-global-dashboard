'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useController } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { DateFieldProps } from '../types/fields';

export function DateField({
    name,
    label,
    placeholder = 'Seleccionar fecha',
    minDate,
    maxDate,
    required,
    disabled,
    className,
    description,
}: DateFieldProps) {
    const [open, setOpen] = useState(false);
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId } = useFormField(name);

    const { field } = useController({
        name,
        defaultValue: undefined,
    });

    return (
        <div className={cn('space-y-2', className)}>
            <Label
                htmlFor={fieldId}
                className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
            >
                {label}
            </Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={fieldId}
                        variant="outline"
                        disabled={disabled || isDisabled}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                            hasError && 'border-red-500',
                        )}
                        aria-describedby={cn(description && descriptionId, hasError && errorId)}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP', { locale: es }) : placeholder}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(selectedDate: Date | undefined) => {
                            field.onChange(selectedDate);
                            setOpen(false);
                        }}
                        // @ts-expect-error: El tipo del prop 'disabled' depende del Calendar real
                        disabled={(calendarDate: Date) => {
                            return (
                                (minDate && calendarDate < minDate) ||
                                (maxDate && calendarDate > maxDate)
                            );
                        }}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
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
