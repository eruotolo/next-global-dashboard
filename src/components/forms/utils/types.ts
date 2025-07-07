/**
 * Tipos base para el sistema de formularios estandarizado
 */

// Tipo para respuestas de Server Actions (basado en patrones observados)
export interface ServerActionResponse<T = any> {
  error?: string;
  message?: string;
  user?: T;
  role?: T;
  ticket?: T;
  [key: string]: any;
}

// Estados de un formulario
export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  isValid: boolean;
}

// Configuración de validación para campos
export interface FieldValidation {
  required?: string | boolean;
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  validate?: {
    [key: string]: (value: any) => boolean | string;
  };
}

// Configuración de un campo de formulario
export interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'file' | 'select' | 'textarea';
  placeholder?: string;
  validation?: FieldValidation;
  options?: Array<{ value: string; label: string }>; // Para selects
  disabled?: boolean;
  accept?: string; // Para inputs de archivo
}

// Props para el hook useServerAction
export interface UseServerActionProps<T = any> {
  action: (formData: FormData) => Promise<ServerActionResponse<T>>;
  onSuccess?: (response: ServerActionResponse<T>) => void;
  onError?: (error: string) => void;
  revalidatePath?: string;
}

// Datos del formulario después de procesar
export interface ProcessedFormData {
  [key: string]: string | File | null;
}