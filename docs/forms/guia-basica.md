# Guía Básica de Uso

Esta guía te mostrará cómo crear formularios desde cero usando el sistema FormBuilder.

## 📋 Paso a Paso

### 1. Definir el Schema Zod

Primero, define la estructura y validación de tu formulario:

```tsx
// schemas/contactSchema.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[\+]?[0-9\s\-\(\)]{7,15}$/, 'Formato inválido'),
  
  message: z.string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'Mínimo 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
  
  newsletter: z.boolean().optional()
});

export type ContactData = z.infer<typeof contactSchema>;
```

### 2. Crear el Server Action

```tsx
// actions/contactActions.ts
'use server';

import { contactSchema } from '@/schemas/contactSchema';
import type { ActionResult } from '@/components/Form/types/FormBuilderTypes';

export async function submitContact(formData: FormData): Promise<ActionResult> {
  // Validación server-side
  const rawData = Object.fromEntries(formData);
  const result = contactSchema.safeParse(rawData);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    };
  }

  try {
    // Procesar datos (enviar email, guardar DB, etc.)
    await sendContactEmail(result.data);
    await saveToDatabase(result.data);
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al procesar el formulario'
    };
  }
}
```

### 3. Crear el Componente del Formulario

```tsx
// components/ContactForm.tsx
'use client';

import { FormBuilder } from '@/components/Form';
import { contactSchema } from '@/schemas/contactSchema';
import { submitContact } from '@/actions/contactActions';
import { toast } from 'sonner';

export function ContactForm() {
  const handleSuccess = (data: any) => {
    toast.success('Mensaje enviado correctamente');
  };

  const handleError = (errors: any) => {
    toast.error('Error al enviar el mensaje');
  };

  return (
    <FormBuilder
      schema={contactSchema}
      action={submitContact}
      fields={[
        {
          name: 'name',
          type: 'text',
          label: 'Nombre completo',
          placeholder: 'Tu nombre',
          required: true,
          validation: 'realtime'
        },
        {
          name: 'email',
          type: 'email',
          label: 'Correo electrónico',
          placeholder: 'tu@email.com',
          required: true,
          validation: 'realtime'
        },
        {
          name: 'phone',
          type: 'phone',
          label: 'Teléfono',
          placeholder: '+1234567890',
          required: true,
          validation: 'onBlur'
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Mensaje',
          placeholder: 'Escribe tu mensaje aquí...',
          required: true,
          rows: 5,
          maxLength: 500,
          showCharCount: true
        },
        {
          name: 'newsletter',
          type: 'checkbox',
          label: 'Suscribirse al newsletter',
          description: 'Recibe noticias y actualizaciones'
        }
      ]}
      layout={{
        type: 'stack',
        gap: 4
      }}
      options={{
        progressiveEnhancement: true,
        realTimeValidation: true,
        focusFirstError: true,
        resetOnSuccess: true
      }}
      submitLabel="Enviar Mensaje"
      loadingLabel="Enviando..."
      onSuccess={handleSuccess}
      onError={handleError}
      className="max-w-md mx-auto"
    />
  );
}
```

## 🎨 Personalización Básica

### Layout en Grid

```tsx
<FormBuilder
  // ... otras props
  fields={[
    {
      name: 'firstName',
      type: 'text',
      label: 'Nombre',
      gridColumn: 1 // Primera columna
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Apellido',
      gridColumn: 1 // Primera columna
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      gridColumn: 2 // Span completo
    }
  ]}
  layout={{
    type: 'grid',
    columns: 2,
    gap: 4
  }}
/>
```

### Validación Condicional

```tsx
// Schema con validaciones condicionales
const userSchema = z.object({
  userType: z.enum(['student', 'teacher', 'admin']),
  
  // Campo condicional para estudiantes
  studentId: z.string().optional(),
  
  // Campo condicional para profesores
  department: z.string().optional()
}).refine((data) => {
  if (data.userType === 'student' && !data.studentId) {
    return false;
  }
  if (data.userType === 'teacher' && !data.department) {
    return false;
  }
  return true;
}, {
  message: 'Campos requeridos según el tipo de usuario',
  path: ['userType']
});
```

### Campos Dinámicos

```tsx
const [userType, setUserType] = useState('');

const getConditionalFields = () => {
  const baseFields = [
    {
      name: 'userType',
      type: 'select' as const,
      label: 'Tipo de Usuario',
      options: [
        { value: 'student', label: 'Estudiante' },
        { value: 'teacher', label: 'Profesor' }
      ],
      required: true
    }
  ];

  if (userType === 'student') {
    baseFields.push({
      name: 'studentId',
      type: 'text' as const,
      label: 'ID Estudiante',
      required: true
    });
  }

  if (userType === 'teacher') {
    baseFields.push({
      name: 'department',
      type: 'text' as const,
      label: 'Departamento',
      required: true
    });
  }

  return baseFields;
};

return (
  <FormBuilder
    schema={userSchema}
    action={submitUser}
    fields={getConditionalFields()}
    onFieldChange={(name, value) => {
      if (name === 'userType') {
        setUserType(value);
      }
    }}
  />
);
```

## 🔧 Configuraciones Útiles

### Formulario Simple (Solo Required)

```tsx
<FormBuilder
  schema={simpleSchema}
  action={handleSubmit}
  fields={fields}
  options={{
    progressiveEnhancement: true,
    realTimeValidation: false, // Solo validar al enviar
    focusFirstError: true,
    resetOnSuccess: true
  }}
/>
```

### Formulario Avanzado (Validación Tiempo Real)

```tsx
<FormBuilder
  schema={advancedSchema}
  action={handleSubmit}
  fields={fields}
  options={{
    progressiveEnhancement: true,
    realTimeValidation: true,
    focusFirstError: true,
    resetOnSuccess: false, // No resetear automáticamente
    validateOnBlur: true
  }}
/>
```

## 🚨 Mejores Prácticas

### 1. Naming Conventions

```tsx
// ✅ BIEN
const userRegistrationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email()
});

// ❌ EVITAR
const schema1 = z.object({
  name1: z.string(),
  name2: z.string(),
  email1: z.string()
});
```

### 2. Mensajes de Error Claros

```tsx
const schema = z.object({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
});
```

### 3. Validación Server-Side Siempre

```tsx
export async function submitForm(formData: FormData): Promise<ActionResult> {
  // ✅ SIEMPRE validar en el servidor
  const result = schema.safeParse(Object.fromEntries(formData));
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    };
  }
  
  // Procesar datos validados
  return processData(result.data);
}
```

## ⚡ Performance Tips

1. **Usar validación `onBlur` para campos complejos**
2. **Implementar debounce en validación real-time**
3. **Minimizar re-renders con `useMemo` en campos dinámicos**
4. **Usar `progressiveEnhancement: true` siempre**

---

¡Ahora estás listo para crear formularios robustos! 🚀