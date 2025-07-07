/**
 * Utilidades para manejo de FormData y conversiones
 * Basado en los patrones observados en Server Actions
 */

import type { ProcessedFormData } from './types';

/**
 * Convierte un objeto de datos a FormData
 * Útil para enviar a Server Actions
 */
export function objectToFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
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
  
  return formData;
}

/**
 * Extrae datos de FormData y los convierte a objeto
 * Útil para debugging o procesamiento adicional
 */
export function formDataToObject(formData: FormData): ProcessedFormData {
  const obj: ProcessedFormData = {};
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      obj[key] = value.size > 0 ? value : null;
    } else {
      obj[key] = value;
    }
  }
  
  return obj;
}

/**
 * Valida que los campos requeridos estén presentes en FormData
 * Basado en el patrón de validación observado en Server Actions
 */
export function validateRequiredFields(
  formData: FormData,
  requiredFields: string[]
): string | null {
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    const value = formData.get(field);
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    return `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`;
  }
  
  return null;
}

/**
 * Valida archivos en FormData
 * Basado en el patrón de validación de archivos observado
 */
export function validateFileFields(
  formData: FormData,
  fileFields: Array<{
    name: string;
    maxSize?: number; // en bytes
    allowedTypes?: string[];
    required?: boolean;
  }>
): string | null {
  for (const fieldConfig of fileFields) {
    const file = formData.get(fieldConfig.name) as File | null;
    
    // Validar si es requerido
    if (fieldConfig.required && (!file || file.size === 0)) {
      return `El archivo ${fieldConfig.name} es obligatorio`;
    }
    
    // Si no hay archivo y no es requerido, continuar
    if (!file || file.size === 0) continue;
    
    // Validar tamaño
    if (fieldConfig.maxSize && file.size > fieldConfig.maxSize) {
      const maxSizeMB = (fieldConfig.maxSize / (1024 * 1024)).toFixed(1);
      return `El archivo ${fieldConfig.name} no puede superar ${maxSizeMB}MB`;
    }
    
    // Validar tipo
    if (fieldConfig.allowedTypes && !fieldConfig.allowedTypes.includes(file.type)) {
      return `El archivo ${fieldConfig.name} debe ser de tipo: ${fieldConfig.allowedTypes.join(', ')}`;
    }
  }
  
  return null;
}

/**
 * Limpia FormData removiendo campos vacíos
 * Útil para updates parciales
 */
export function cleanFormData(formData: FormData): FormData {
  const cleaned = new FormData();
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size > 0) {
        cleaned.append(key, value);
      }
    } else if (value && value.trim() !== '') {
      cleaned.append(key, value);
    }
  }
  
  return cleaned;
}

/**
 * Genera un nombre único para archivos
 * Basado en el patrón observado en Server Actions
 */
export function generateFileName(
  originalName: string,
  prefix: string = 'file',
  includeTimestamp: boolean = true
): string {
  const fileExtension = originalName.split('.').pop() || 'jpg';
  const timestamp = includeTimestamp ? Date.now() : '';
  const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9]/g, '-');
  
  return `${sanitizedPrefix}${timestamp ? `-${timestamp}` : ''}.${fileExtension}`;
}