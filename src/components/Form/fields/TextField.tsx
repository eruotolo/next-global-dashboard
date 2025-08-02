'use client';

import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

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
    showPasswordToggle = false,
}: TextFieldProps) {
    // Estado para toggle de visibilidad de contraseña
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const { error, hasError, isDisabled, fieldId, errorId, descriptionId, ...field } =
        useFormField(name);

    // Determinar tipo de input
    const inputType =
        showPasswordToggle && type === 'password' && isPasswordVisible ? 'text' : type;

    // Verificar si debe mostrar toggle
    const shouldShowToggle = showPasswordToggle && type === 'password';

    return (
        <div className={cn('space-y-2', className)}>
            <Label
                htmlFor={fieldId}
                className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
            >
                {label}
            </Label>

            {/* Wrapper condicional relative */}
            <div className={cn(shouldShowToggle && 'relative')}>
                <Input
                    {...field}
                    id={fieldId}
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled || isDisabled}
                    maxLength={maxLength}
                    minLength={minLength}
                    className={cn(
                        hasError && 'border-red-500 focus-visible:ring-red-500',
                        shouldShowToggle && 'pr-10', // Padding para botón
                    )}
                    aria-describedby={cn(description && descriptionId, hasError && errorId)}
                />

                {/* Toggle Button */}
                {shouldShowToggle && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setPasswordVisible(!isPasswordVisible)}
                        aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {isPasswordVisible ? (
                            <EyeOff className="h-4 w-4 cursor-pointer text-gray-400" />
                        ) : (
                            <Eye className="h-4 w-4 cursor-pointer text-gray-400" />
                        )}
                    </button>
                )}
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
