'use client';

import { useForm as useReactHookForm, type UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { z } from 'zod';
import type { FormState } from '../types/form';

export function useForm<T extends z.ZodType<any, any, any>>(
    schema: T,
    action: (formData: FormData) => Promise<any>,
    options?: UseFormProps<z.infer<T>>,
    onSuccess?: () => void,
    onError?: (error: string) => void,
) {
    const [state, setState] = useState<FormState>({
        isSubmitting: false,
        errors: {},
        success: false,
    });

    const form = useReactHookForm<z.infer<T>>({
        resolver: zodResolver(schema) as any,
        mode: 'onChange',
        ...options,
    });

    const handleSubmit = form.handleSubmit(async (data) => {
        setState((prev) => ({ ...prev, isSubmitting: true, errors: {}, success: false }));

        try {
            // Convertir datos a FormData para Server Action
            const formData = new FormData();

            for (const [key, value] of Object.entries(data)) {
                if (value instanceof FileList) {
                    // Manejar múltiples archivos
                    for (const file of Array.from(value)) {
                        formData.append(`${key}[]`, file);
                    }
                } else if (value instanceof File) {
                    // Archivo único
                    formData.append(key, value);
                } else if (Array.isArray(value)) {
                    // Arrays (checkboxes, etc.)
                    for (const item of value) {
                        formData.append(`${key}[]`, String(item));
                    }
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            }

            const result = await action(formData);

            // Verificar si la acción devolvió un error (respetando el patrón de arquitectura)
            if (result?.error) {
                setState((prev) => ({ ...prev, isSubmitting: false }));
                onError?.(result.error);
                return;
            }

            setState((prev) => ({ ...prev, success: true, isSubmitting: false }));
            onSuccess?.();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setState((prev) => ({ ...prev, isSubmitting: false }));
            onError?.(errorMessage);
        }
    });

    return {
        form,
        state,
        isPending: state.isSubmitting,
        submitForm: handleSubmit,
        handleSubmit,
    };
}
