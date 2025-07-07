/**
 * Componente wrapper para formularios estandarizados
 * Integra React Hook Form con Server Actions
 */

import { type ReactNode } from 'react';
import { useForm, type FieldValues, type DefaultValues } from 'react-hook-form';
import { useFormServerAction } from '../hooks/useServerAction';
import type { UseServerActionProps } from '../utils/types';

interface FormWrapperProps<T extends FieldValues> {
  children: ReactNode;
  defaultValues?: DefaultValues<T>;
  onSubmit: UseServerActionProps['action'];
  onSuccess?: UseServerActionProps['onSuccess'];
  onError?: UseServerActionProps['onError'];
  className?: string;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

/**
 * Wrapper principal para formularios
 * Proporciona contexto de React Hook Form y manejo de Server Actions
 */
export function FormWrapper<T extends FieldValues>({
  children,
  defaultValues,
  onSubmit,
  onSuccess,
  onError,
  className = '',
  mode = 'onChange'
}: FormWrapperProps<T>) {
  const form = useForm<T>({
    defaultValues,
    mode
  });

  const { handleSubmit: handleServerAction, isPending, error } = useFormServerAction({
    action: onSubmit,
    onSuccess: (response) => {
      form.reset(); // Limpiar formulario después del éxito
      onSuccess?.(response);
    },
    onError
  });

  return (
    <form 
      onSubmit={form.handleSubmit(handleServerAction)}
      className={`space-y-4 ${className}`}
    >
      {/* Contexto para los campos del formulario */}
      <FormProvider form={form} isPending={isPending} error={error}>
        {children}
      </FormProvider>
    </form>
  );
}

/**
 * Contexto para compartir el estado del formulario
 */
import { createContext, useContext } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface FormContextValue {
  form: UseFormReturn<any>;
  isPending: boolean;
  error: string | null;
}

const FormContext = createContext<FormContextValue | null>(null);

function FormProvider({ 
  form, 
  isPending, 
  error, 
  children 
}: {
  form: UseFormReturn<any>;
  isPending: boolean;
  error: string | null;
  children: ReactNode;
}) {
  return (
    <FormContext.Provider value={{ form, isPending, error }}>
      {children}
    </FormContext.Provider>
  );
}

/**
 * Hook para acceder al contexto del formulario
 */
export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext debe ser usado dentro de FormWrapper');
  }
  return context;
}