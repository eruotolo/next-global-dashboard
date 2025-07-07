/**
 * Esquemas de validación reutilizables para React Hook Form
 * Basado en los patrones observados en la aplicación
 */

import type { FieldValidation } from './types';

/**
 * Validaciones comunes reutilizables
 */
export const validationSchemas = {
  // Validaciones de texto
  required: (message: string = 'Este campo es obligatorio'): FieldValidation => ({
    required: message
  }),
  
  minLength: (length: number, message?: string): FieldValidation => ({
    minLength: {
      value: length,
      message: message || `Debe tener al menos ${length} caracteres`
    }
  }),
  
  maxLength: (length: number, message?: string): FieldValidation => ({
    maxLength: {
      value: length,
      message: message || `No puede exceder ${length} caracteres`
    }
  }),
  
  // Validaciones de email
  email: (message: string = 'Formato de email inválido'): FieldValidation => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message
    }
  }),
  
  // Validaciones de teléfono
  phone: (message: string = 'Formato de teléfono inválido'): FieldValidation => ({
    pattern: {
      value: /^[+]?[(]?[\d\s\-()]{7,15}$/,
      message
    }
  }),
  
  // Validaciones de contraseña
  password: (minLength: number = 6, message?: string): FieldValidation => ({
    minLength: {
      value: minLength,
      message: message || `La contraseña debe tener al menos ${minLength} caracteres`
    },
    validate: {
      notEmpty: (value: string) => value.trim().length > 0 || 'La contraseña no puede estar vacía'
    }
  }),
  
  // Validaciones de contraseña fuerte
  strongPassword: (message?: string): FieldValidation => ({
    minLength: {
      value: 8,
      message: 'La contraseña debe tener al menos 8 caracteres'
    },
    validate: {
      hasUppercase: (value: string) => 
        /[A-Z]/.test(value) || 'Debe contener al menos una mayúscula',
      hasLowercase: (value: string) => 
        /[a-z]/.test(value) || 'Debe contener al menos una minúscula',
      hasNumber: (value: string) => 
        /[0-9]/.test(value) || 'Debe contener al menos un número',
      hasSymbol: (value: string) => 
        /[^A-Za-z0-9]/.test(value) || 'Debe contener al menos un símbolo'
    }
  }),
  
  // Validaciones de fecha
  pastDate: (message: string = 'La fecha debe ser anterior a hoy'): FieldValidation => ({
    validate: {
      isPast: (value: string) => {
        if (!value) return true;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today || message;
      }
    }
  }),
  
  futureDate: (message: string = 'La fecha debe ser posterior a hoy'): FieldValidation => ({
    validate: {
      isFuture: (value: string) => {
        if (!value) return true;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate > today || message;
      }
    }
  }),
  
  // Validaciones de archivos
  fileSize: (maxSizeInMB: number, message?: string): FieldValidation => ({
    validate: {
      fileSize: (files: FileList | null) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        return file.size <= maxSizeInBytes || 
               message || `El archivo no puede superar ${maxSizeInMB}MB`;
      }
    }
  }),
  
  fileType: (allowedTypes: string[], message?: string): FieldValidation => ({
    validate: {
      fileType: (files: FileList | null) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        return allowedTypes.includes(file.type) || 
               message || `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`;
      }
    }
  }),
  
  // Validaciones de imagen
  imageFile: (maxSizeInMB: number = 1): FieldValidation => ({
    validate: {
      fileSize: (files: FileList | null) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        return file.size <= maxSizeInBytes || `La imagen no puede superar ${maxSizeInMB}MB`;
      },
      fileType: (files: FileList | null) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        return allowedTypes.includes(file.type) || 
               'Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)';
      }
    }
  })
};

/**
 * Esquemas compuestos para formularios específicos
 */
export const formSchemas = {
  // Esquema para login
  login: {
    email: {
      ...validationSchemas.required('El email es obligatorio'),
      ...validationSchemas.email()
    },
    password: {
      ...validationSchemas.required('La contraseña es obligatoria'),
      ...validationSchemas.minLength(6)
    }
  },
  
  // Esquema para usuario
  user: {
    name: {
      ...validationSchemas.required('El nombre es obligatorio'),
      ...validationSchemas.minLength(2, 'El nombre debe tener al menos 2 caracteres')
    },
    lastName: {
      ...validationSchemas.required('El apellido es obligatorio'),
      ...validationSchemas.minLength(2, 'El apellido debe tener al menos 2 caracteres')
    },
    email: {
      ...validationSchemas.required('El email es obligatorio'),
      ...validationSchemas.email()
    },
    phone: {
      ...validationSchemas.required('El teléfono es obligatorio'),
      ...validationSchemas.phone()
    },
    password: {
      ...validationSchemas.required('La contraseña es obligatoria'),
      ...validationSchemas.password(6)
    },
    image: validationSchemas.imageFile(1)
  },
  
  // Esquema para rol
  role: {
    name: {
      ...validationSchemas.required('El nombre del rol es obligatorio'),
      ...validationSchemas.minLength(2, 'El nombre debe tener al menos 2 caracteres')
    }
  },
  
  // Esquema para recuperación de contraseña
  recovery: {
    email: {
      ...validationSchemas.required('El email es obligatorio'),
      ...validationSchemas.email()
    }
  }
};

/**
 * Función helper para combinar múltiples validaciones
 */
export function combineValidations(...validations: FieldValidation[]): FieldValidation {
  const combined: FieldValidation = {};
  
  validations.forEach(validation => {
    Object.assign(combined, validation);
    
    // Combinar funciones de validación personalizada
    if (validation.validate && combined.validate) {
      combined.validate = {
        ...combined.validate,
        ...validation.validate
      };
    }
  });
  
  return combined;
}