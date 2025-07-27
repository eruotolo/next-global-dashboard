# Guía de Migración desde React Hook Form

Esta guía te ayudará a migrar formularios existentes que usan React Hook Form al nuevo sistema FormBuilder con Next.js Forms + Zod.

## 🎯 Diferencias Principales

| Aspecto | React Hook Form | FormBuilder (Nuevo) |
|---------|----------------|---------------------|
| **Validación** | Validación client-side | Zod (client + server) |
| **Envío** | JavaScript requerido | Progressive enhancement |
| **Estado** | useForm hook | Next.js Forms nativo |
| **Tipado** | Manual con TypeScript | Automático con Zod |
| **Server Actions** | Integración manual | Integración nativa |

## 📋 Proceso de Migración Paso a Paso

### Paso 1: Analizar el Formulario Existente

Primero, identifica los elementos clave del formulario actual:

```tsx
// ❌ ANTES: React Hook Form
function OldUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset
  } = useForm<UserFormData>({ mode: 'onChange' });

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await createUser(data);
      if (response.error) {
        setError(response.error);
        return;
      }
      reset();
      toast.success('Usuario creado');
    } catch (err) {
      toast.error('Error al crear usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('name', {
          required: 'El nombre es obligatorio',
          minLength: { value: 2, message: 'Mínimo 2 caracteres' }
        })}
        placeholder="Nombre"
      />
      {errors.name && <p className="error">{errors.name.message}</p>}
      
      <Input
        type="email"
        {...register('email', {
          required: 'El email es obligatorio',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email inválido'
          }
        })}
        placeholder="Email"
      />
      {errors.email && <p className="error">{errors.email.message}</p>}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear Usuario'}
      </Button>
    </form>
  );
}
```

### Paso 2: Crear el Schema Zod

Convierte las validaciones de React Hook Form a esquemas Zod:

```tsx
// ✅ NUEVO: Schema Zod
import { z } from 'zod';

const userCreateSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'Mínimo 2 caracteres'),
  
  email: z.string()
    .min(1, 'El email es obligatorio')
    .email('Email inválido'),
  
  phone: z.string()
    .min(1, 'El teléfono es obligatorio'),
  
  // Agregar más campos según necesites
});

export type UserCreateData = z.infer<typeof userCreateSchema>;
```

### Paso 3: Crear el Server Action

Migra la lógica de envío a un Server Action:

```tsx
// ✅ NUEVO: Server Action
'use server';

import { userCreateSchema } from '@/schemas/userSchema';
import type { ActionResult } from '@/components/Form/types/FormBuilderTypes';

export async function createUserAction(formData: FormData): Promise<ActionResult> {
  // Validación server-side
  const rawData = Object.fromEntries(formData);
  const result = userCreateSchema.safeParse(rawData);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    };
  }

  try {
    // Tu lógica de creación de usuario
    const user = await db.user.create({
      data: result.data
    });
    
    return {
      success: true,
      data: user
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al crear el usuario'
    };
  }
}
```

### Paso 4: Migrar al FormBuilder

Reemplaza el formulario con el nuevo FormBuilder:

```tsx
// ✅ NUEVO: FormBuilder
'use client';

import { FormBuilder } from '@/components/Form';
import { userCreateSchema } from '@/schemas/userSchema';
import { createUserAction } from '@/actions/userActions';
import { toast } from 'sonner';

function NewUserForm() {
  const handleSuccess = (data: any) => {
    toast.success('Usuario creado exitosamente');
    // Lógica adicional de éxito
  };

  const handleError = (errors: any) => {
    toast.error('Error al crear usuario');
  };

  return (
    <FormBuilder
      schema={userCreateSchema}
      action={createUserAction}
      fields={[
        {
          name: 'name',
          type: 'text',
          label: 'Nombre',
          placeholder: 'Nombre completo',
          required: true,
          validation: 'realtime'
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'tu@email.com',
          required: true,
          validation: 'realtime'
        },
        {
          name: 'phone',
          type: 'phone',
          label: 'Teléfono',
          placeholder: '+1234567890',
          required: true
        }
      ]}
      submitLabel="Crear Usuario"
      loadingLabel="Creando usuario..."
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## 🔄 Patrones de Migración Comunes

### Migración de Validaciones

```tsx
// ❌ ANTES: React Hook Form validations
register('email', {
  required: 'Email requerido',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  validate: {
    notGmail: (value) => 
      !value.includes('@gmail.com') || 'No se permiten emails de Gmail'
  }
})

// ✅ DESPUÉS: Zod schema
email: z.string()
  .min(1, 'Email requerido')
  .email('Email inválido')
  .refine(val => !val.includes('@gmail.com'), {
    message: 'No se permiten emails de Gmail'
  })
```

### Migración de Valores por Defecto

```tsx
// ❌ ANTES: React Hook Form
const form = useForm<UserData>({
  defaultValues: {
    name: '',
    email: '',
    role: 'user'
  }
});

// ✅ DESPUÉS: FormBuilder
<FormBuilder
  schema={userSchema}
  action={createUser}
  defaultValues={{
    name: '',
    email: '',
    role: 'user'
  }}
  fields={fields}
/>
```

### Migración de Estados Condicionales

```tsx
// ❌ ANTES: React Hook Form con watch
const userType = watch('userType');

return (
  <form>
    <select {...register('userType')}>
      <option value="individual">Individual</option>
      <option value="business">Empresa</option>
    </select>
    
    {userType === 'business' && (
      <input {...register('companyName')} placeholder="Nombre de empresa" />
    )}
  </form>
);

// ✅ DESPUÉS: FormBuilder con campos dinámicos
function DynamicUserForm() {
  const [userType, setUserType] = useState('');
  
  const getFields = () => {
    const baseFields = [
      {
        name: 'userType',
        type: 'select' as const,
        label: 'Tipo de Usuario',
        options: [
          { value: 'individual', label: 'Individual' },
          { value: 'business', label: 'Empresa' }
        ],
        required: true
      }
    ];
    
    if (userType === 'business') {
      baseFields.push({
        name: 'companyName',
        type: 'text' as const,
        label: 'Nombre de Empresa',
        required: true
      });
    }
    
    return baseFields;
  };

  return (
    <FormBuilder
      schema={dynamicUserSchema}
      action={createUser}
      fields={getFields()}
      onFieldChange={(name, value) => {
        if (name === 'userType') {
          setUserType(value);
        }
      }}
    />
  );
}
```

### Migración de Custom Hooks

```tsx
// ❌ ANTES: Custom hook con React Hook Form
function useUserForm() {
  const form = useForm<UserData>();
  
  const submitUser = async (data: UserData) => {
    // lógica
  };
  
  return {
    ...form,
    submitUser
  };
}

// ✅ DESPUÉS: Server Action + FormBuilder
// No necesitas custom hook, usa Server Actions directamente
const createUserAction = async (formData: FormData) => {
  // lógica del servidor
};

// En el componente
<FormBuilder
  schema={userSchema}
  action={createUserAction}
  fields={fields}
/>
```

## 🛠️ Herramientas de Migración

### Script de Migración Automática

```bash
# Crear script de migración
# migrate-forms.js

const fs = require('fs');
const path = require('path');

// Buscar archivos con useForm
function findReactHookFormFiles(dir) {
  const files = fs.readdirSync(dir);
  const formFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      formFiles.push(...findReactHookFormFiles(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('useForm') || content.includes('react-hook-form')) {
        formFiles.push(filePath);
      }
    }
  });
  
  return formFiles;
}

// Ejecutar análisis
const formFiles = findReactHookFormFiles('./src');
console.log('Archivos con React Hook Form encontrados:');
formFiles.forEach(file => console.log(`- ${file}`));
```

### Checklist de Migración

```markdown
## ✅ Checklist de Migración por Formulario

### Preparación
- [ ] Identificar todos los campos del formulario
- [ ] Documentar validaciones existentes
- [ ] Identificar lógica de envío actual
- [ ] Revisar estados condicionales

### Implementación
- [ ] Crear schema Zod
- [ ] Crear Server Action
- [ ] Configurar campos en FormBuilder
- [ ] Migrar valores por defecto
- [ ] Implementar lógica condicional

### Testing
- [ ] Probar validación client-side
- [ ] Probar validación server-side
- [ ] Verificar progressive enhancement
- [ ] Probar en diferentes dispositivos
- [ ] Validar accessibilidad

### Limpieza
- [ ] Remover imports de React Hook Form
- [ ] Limpiar código no utilizado
- [ ] Actualizar tests si existen
- [ ] Documentar cambios
```

## 🔧 Casos Especiales

### Formularios con File Upload

```tsx
// ❌ ANTES: React Hook Form + File handling manual
const { register, handleSubmit } = useForm();

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  // lógica manual de validación y preview
};

// ✅ DESPUÉS: FormBuilder con FileUpload integrado
<FormBuilder
  schema={userWithImageSchema}
  action={createUserWithImage}
  fields={[
    {
      name: 'avatar',
      type: 'file-upload',
      label: 'Foto de perfil',
      accept: 'image/*',
      maxSize: 1024000,
      preview: true,
      description: 'Máximo 1MB'
    }
  ]}
/>
```

### Formularios Multi-Step

```tsx
// ❌ ANTES: React Hook Form con pasos manuales
const [step, setStep] = useState(1);
const form = useForm();

// ✅ DESPUÉS: Multiple FormBuilders o campos condicionales
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const getStepFields = (step: number) => {
    switch (step) {
      case 1:
        return personalInfoFields;
      case 2:
        return contactInfoFields;
      case 3:
        return preferencesFields;
      default:
        return [];
    }
  };

  return (
    <FormBuilder
      schema={multiStepSchema}
      action={submitMultiStepForm}
      fields={getStepFields(currentStep)}
      // ... otras props
    />
  );
}
```

## 📊 Comparación de Performance

| Métrica | React Hook Form | FormBuilder |
|---------|----------------|-------------|
| **Bundle Size** | +15KB | +5KB |
| **JavaScript requerido** | Sí | No (progressive) |
| **Validación server-side** | Manual | Automática |
| **Time to Interactive** | +200ms | +50ms |
| **First Load** | JavaScript required | HTML funcional |

## 🚨 Problemas Comunes y Soluciones

### 1. Tipos TypeScript inconsistentes

```tsx
// ❌ PROBLEMA
interface UserForm {
  name: string;
  email: string;
}

const schema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string() // ¡Falta en la interface!
});

// ✅ SOLUCIÓN
const schema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string()
});

type UserForm = z.infer<typeof schema>; // Tipos automáticos
```

### 2. Validaciones no migradas correctamente

```tsx
// ❌ PROBLEMA: Validación perdida
register('email', { required: true, pattern: /email-regex/ })

// Solo migras required
z.string().min(1, 'Required')

// ✅ SOLUCIÓN: Migrar todas las validaciones
z.string()
  .min(1, 'Email requerido')
  .email('Formato de email inválido')
```

### 3. Server Actions no funcionan

```tsx
// ❌ PROBLEMA: Olvidar 'use server'
async function createUser(formData: FormData) {
  // ...
}

// ✅ SOLUCIÓN: Agregar directive
'use server';

async function createUser(formData: FormData): Promise<ActionResult> {
  // ...
}
```

## 📝 Template de Migración

```tsx
// Template para migración rápida
'use client';

import { FormBuilder } from '@/components/Form';
import { z } from 'zod';

// 1. Definir schema
const [FORM_NAME]Schema = z.object({
  // Agregar campos aquí
});

// 2. Server Action
const handle[FORM_NAME] = async (formData: FormData): Promise<ActionResult> => {
  const result = [FORM_NAME]Schema.safeParse(Object.fromEntries(formData));
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    };
  }

  try {
    // Tu lógica aquí
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: 'Error message' };
  }
};

// 3. Componente
export function [FORM_NAME]() {
  return (
    <FormBuilder
      schema={[FORM_NAME]Schema}
      action={handle[FORM_NAME]}
      fields={[
        // Definir campos aquí
      ]}
      submitLabel="Submit"
      onSuccess={(data) => {
        // Lógica de éxito
      }}
      onError={(errors) => {
        // Lógica de error
      }}
    />
  );
}
```

---

¿Necesitas ayuda con una migración específica? ¡Consulta los [casos de uso](./casos-de-uso.md)! 🚀