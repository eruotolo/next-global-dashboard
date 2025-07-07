/**
 * Hook personalizado para manejar Server Actions
 * Integrado con los patrones existentes de la aplicación
 */

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { UseServerActionProps, ServerActionResponse } from '../utils/types';

/**
 * Hook para manejar Server Actions con estado unificado
 * Maneja loading, errores y éxito de forma consistente
 */
export function useServerAction<T = any>({
  action,
  onSuccess,
  onError,
  revalidatePath
}: UseServerActionProps<T>) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<T | null>(null);

  const execute = async (formData: FormData) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await action(formData);
        
        // Manejar respuesta de error del Server Action
        if (result.error) {
          setError(result.error);
          
          // Mostrar toast de error
          toast.error('Error', {
            description: result.error,
          });
          
          // Callback de error si existe
          if (onError) {
            onError(result.error);
          }
          
          return;
        }
        
        // Manejar éxito
        const responseData = result.user || result.role || result.ticket || null;
        setData(responseData as T);
        
        // Mostrar toast de éxito si hay mensaje
        if (result.message) {
          toast.success('Éxito', {
            description: result.message,
          });
        }
        
        // Callback de éxito si existe
        if (onSuccess) {
          onSuccess(result);
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        
        toast.error('Error', {
          description: errorMessage,
        });
        
        if (onError) {
          onError(errorMessage);
        }
        
        console.error('Error en Server Action:', err);
      }
    });
  };

  return {
    execute,
    isPending,
    error,
    data,
    setError,
    clearError: () => setError(null),
    clearData: () => setData(null)
  };
}

/**
 * Hook especializado para formularios con React Hook Form
 * Integra useServerAction con el patrón de formularios
 */
export function useFormServerAction<T = any>({
  action,
  onSuccess,
  onError,
  revalidatePath
}: UseServerActionProps<T>) {
  const serverAction = useServerAction({
    action,
    onSuccess,
    onError,
    revalidatePath
  });

  /**
   * Función para usar con React Hook Form handleSubmit
   * Convierte los datos del formulario a FormData automáticamente
   */
  const handleSubmit = (data: Record<string, any>) => {
    const formData = new FormData();
    
    // Convertir datos a FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof FileList) {
          // Manejar FileList (input file)
          if (value.length > 0) {
            formData.append(key, value[0]);
          }
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    return serverAction.execute(formData);
  };

  return {
    ...serverAction,
    handleSubmit
  };
}

/**
 * Hook para acciones de eliminación con confirmación
 */
export function useDeleteAction<T = any>({
  action,
  onSuccess,
  onError,
  entityName = 'elemento'
}: UseServerActionProps<T> & { entityName?: string }) {
  const serverAction = useServerAction({
    action,
    onSuccess,
    onError
  });

  const handleDelete = async (id: string, confirmMessage?: string) => {
    const message = confirmMessage || `¿Estás seguro de eliminar este ${entityName}?`;
    
    if (window.confirm(message)) {
      const formData = new FormData();
      formData.append('id', id);
      
      await serverAction.execute(formData);
    }
  };

  return {
    ...serverAction,
    handleDelete
  };
}

/**
 * Hook para acciones de actualización con confirmación opcional
 */
export function useUpdateAction<T = any>({
  action,
  onSuccess,
  onError,
  requireConfirmation = false,
  confirmMessage = '¿Confirmas los cambios?'
}: UseServerActionProps<T> & { 
  requireConfirmation?: boolean;
  confirmMessage?: string;
}) {
  const serverAction = useServerAction({
    action,
    onSuccess,
    onError
  });

  const handleUpdate = async (id: string, formData: FormData) => {
    if (requireConfirmation) {
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    
    // Agregar el ID al FormData
    formData.append('id', id);
    
    await serverAction.execute(formData);
  };

  return {
    ...serverAction,
    handleUpdate
  };
}