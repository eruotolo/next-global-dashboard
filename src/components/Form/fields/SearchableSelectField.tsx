'use client';

import { useState } from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useController } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { SearchableSelectFieldProps } from '../types/fields';

export function SearchableSelectField({
    name,
    label,
    options,
    placeholder = 'Seleccionar...',
    searchPlaceholder = 'Buscar...',
    emptyText = 'No se encontraron resultados',
    required,
    disabled,
    className,
    description,
}: SearchableSelectFieldProps) {
    const [open, setOpen] = useState(false);
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId } = useFormField(name);

    const { field } = useController({
        name,
        rules: { required: required ? 'Este campo es requerido' : false },
    });

    const selectedOption = options.find((option) => option.value === field.value);

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
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled || isDisabled}
                        className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                            hasError && 'border-red-500',
                        )}
                        aria-describedby={cn(description && descriptionId, hasError && errorId)}
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        disabled={option.disabled}
                                        onSelect={(currentValue) => {
                                            field.onChange(
                                                currentValue === field.value ? '' : currentValue,
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                field.value === option.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
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
