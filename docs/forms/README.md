# Sistema de Formularios Next.js + Zod

Un sistema unificado de formularios que utiliza Next.js Forms, validación Zod y componentes reutilizables para crear formularios consistentes y performantes.

## 🎯 Características Principales

- **✅ Next.js Forms**: Integración nativa con Server Actions
- **✅ Validación Zod**: Tipado fuerte y validación robusta
- **✅ Progressive Enhancement**: Funciona sin JavaScript
- **✅ Validación Híbrida**: Cliente + Servidor
- **✅ Componentes Reutilizables**: FormBuilder universal
- **✅ TypeScript**: Tipado completo en toda la aplicación

## 📁 Estructura del Sistema

```
src/components/Form/
├── FormBuilder.tsx                    # Componente principal
├── hooks/                             # Hooks personalizados
│   ├── useFormValidation.ts          # Validación con Zod
│   ├── useFormState.ts               # Estado del formulario
│   └── useServerAction.ts            # Integración Server Actions
├── fields/                           # Componentes de campos
│   ├── TextField.tsx                 # Campos de texto
│   ├── TextareaField.tsx            # Área de texto
│   └── SelectField.tsx              # Selects y multi-selects
├── types/                           # Tipos TypeScript
├── validation/schemas/              # Esquemas Zod
└── examples/                        # Ejemplos de uso
```

## 🚀 Inicio Rápido

### 1. Importar el FormBuilder

```tsx
import { FormBuilder } from '@/components/Form';
import { userCreateSchema } from '@/components/Form/validation/schemas/userSchemas';
```

### 2. Crear un Server Action

```tsx
const handleSubmit = async (formData: FormData): Promise<ActionResult> => {
  const result = userCreateSchema.safeParse(Object.fromEntries(formData));
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    };
  }

  // Procesar datos...
  return { success: true, data: result.data };
};
```

### 3. Usar el FormBuilder

```tsx
<FormBuilder
  schema={userCreateSchema}
  action={handleSubmit}
  fields={[
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true
    }
  ]}
  submitLabel="Crear Usuario"
/>
```

## 📖 Guías Detalladas

- [Guía Básica de Uso](./guia-basica.md)
- [Tipos de Campos Disponibles](./tipos-de-campos.md)
- [Validación con Zod](./validacion-zod.md)
- [Casos de Uso Complejos](./casos-de-uso.md)
- [Migración desde React Hook Form](./migracion.md)
- [API Reference](./api-reference.md)

## 🔧 Campos Disponibles

| Tipo | Descripción | Implementado |
|------|-------------|-------------|
| `text` | Input de texto básico | ✅ |
| `email` | Input de email con validación | ✅ |
| `password` | Input de contraseña con toggle | ✅ |
| `phone` | Input de teléfono | ✅ |
| `textarea` | Área de texto con contador | ✅ |
| `select` | Select básico | ✅ |
| `multi-select` | Selección múltiple | ✅ |
| `searchable-select` | Select con búsqueda | 🔄 |
| `file-upload` | Subida de archivos | 🔄 |
| `rich-text` | Editor de texto rico | 🔄 |
| `checkbox` | Checkbox individual/grupo | 🔄 |
| `radio` | Radio buttons | 🔄 |
| `date` | Selector de fecha | 🔄 |

## 💡 Ejemplos Rápidos

### Formulario de Login

```tsx
<FormBuilder
  schema={loginSchema}
  action={handleLogin}
  fields={[
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validation: 'realtime'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      required: true,
      showPasswordToggle: true
    }
  ]}
  submitLabel="Iniciar Sesión"
/>
```

### Formulario de Contacto

```tsx
<FormBuilder
  schema={contactSchema}
  action={handleContact}
  fields={[
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mensaje',
      rows: 5,
      maxLength: 500,
      showCharCount: true
    }
  ]}
  layout={{ type: 'stack', gap: 4 }}
/>
```

## 🎨 Personalización

### Layout Grid

```tsx
<FormBuilder
  // ... otras props
  layout={{
    type: 'grid',
    columns: 2,
    gap: 4,
    breakpoints: {
      md: 1, // 1 columna en móvil
      lg: 2  // 2 columnas en desktop
    }
  }}
/>
```

### Validación Personalizada

```tsx
<FormBuilder
  // ... otras props
  options={{
    progressiveEnhancement: true,
    realTimeValidation: true,
    focusFirstError: true,
    resetOnSuccess: true
  }}
/>
```

## 🔍 Debugging

### Ver datos del formulario

```tsx
<FormBuilder
  // ... otras props
  onFieldChange={(fieldName, value) => {
    console.log(`Campo ${fieldName}:`, value);
  }}
  onSuccess={(data) => {
    console.log('Datos enviados:', data);
  }}
  onError={(errors) => {
    console.error('Errores:', errors);
  }}
/>
```

## 🚨 Problemas Comunes

### 1. Campos no se actualizan
- Verificar que el `name` del campo coincida con el schema
- Asegurar que el schema Zod esté bien definido

### 2. Validación no funciona
- Verificar importación de esquemas Zod
- Revisar configuración de `validation` en el campo

### 3. Server Action no se ejecuta
- Verificar que la función retorne `ActionResult`
- Asegurar validación server-side en la acción

## 🆘 Soporte

Para problemas o preguntas:
1. Revisar la [documentación completa](./api-reference.md)
2. Ver [casos de uso](./casos-de-uso.md)
3. Consultar [ejemplos](../Form/examples/)

---

**Desarrollado siguiendo las 9 reglas fundamentales de desarrollo**