'use client';

import { FormProvider } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { FormStateProvider } from './FormProvider';
import { useForm } from './hooks/useForm';
import type { FormProps } from './types/form';

export function Form<T extends z.ZodType>({
    schema,
    action,
    defaultValues,
    onSuccess,
    onError,
    layout = 'default',
    className,
    children,
    submitText = 'Guardar',
    cancelText = 'Cancelar',
    onCancel,
}: FormProps<T>) {
    const { form, state, isPending, submitForm } = useForm(
        schema,
        action,
        defaultValues ? { defaultValues: defaultValues as any } : undefined,
        onSuccess,
        onError,
    );

    return (
        <FormProvider {...(form as any)}>
            <FormStateProvider state={state}>
                <form onSubmit={submitForm} className="space-y-6">
                    <div className={cn(layout === 'grid' ? 'grid gap-4' : 'space-y-4', className)}>
                        {children}
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isPending}
                            >
                                {cancelText}
                            </Button>
                        )}
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Guardando...' : submitText}
                        </Button>
                    </div>
                </form>
            </FormStateProvider>
        </FormProvider>
    );
}
