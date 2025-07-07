# Sistema de Formularios Estandarizado

Este es el nuevo sistema de formularios para la aplicación, diseñado para trabajar perfectamente con los Server Actions existentes y proporcionar una experiencia consistente.

## 🎯 Características

- **React Hook Form** integrado para validación client-side
- **Server Actions** para procesamiento servidor
- **Validación unificada** cliente y servidor
- **Estados de loading** y errores integrados
- **Componentes reutilizables** para campos comunes
- **TypeScript completo** para mejor DX

## 📁 Estructura

```
src/components/forms/
├── core/                 # Componentes principales
│   ├── FormWrapper.tsx   # Wrapper principal del formulario
│   ├── FormField.tsx     # Campos de formulario reutilizables
│   └── FormActions.tsx   # Botones de acción
├── hooks/                # Hooks personalizados
│   └── useServerAction.ts # Hook para Server Actions
├── utils/                # Utilidades
│   ├── types.ts          # Tipos TypeScript
│   ├── formDataUtils.ts  # Helpers para FormData
│   └── validationSchemas.ts # Validaciones reutilizables
└── index.ts              # Exportaciones principales
```

## 🚀 Uso Básico

### Formulario Simple

```tsx
import { FormWrapper, FormField, StandardFormActions, formSchemas } from '@/components/forms';

function MyForm() {
  const handleSubmit = async (formData: FormData) => {
    // Tu Server Action aquí
    return await createUser(formData);
  };

  return (
    <FormWrapper
      defaultValues={{ name: '', email: '' }}
      onSubmit={handleSubmit}
      onSuccess={(response) => console.log('Éxito:', response)}
      onError={(error) => console.log('Error:', error)}
    >
      <FormField
        name="name"
        label="Nombre"
        placeholder="Ingresa tu nombre"
        validation={formSchemas.user.name}
      />
      
      <FormField
        name="email"
        label="Email"
        type="email"
        validation={formSchemas.user.email}
      />
      
      <StandardFormActions submitText="Crear Usuario" />
    </FormWrapper>
  );
}
```

### Formulario con Archivo

```tsx
import { FormWrapper, FormField, FileField, StandardFormActions } from '@/components/forms';

function UserForm() {
  return (
    <FormWrapper onSubmit={createUser}>
      <FormField name="name" label="Nombre" validation={...} />
      
      <FileField
        name="image"
        label="Foto de Perfil"
        showPreview={true}
        maxSize={1} // 1MB
        validation={validationSchemas.imageFile(1)}
      />
      
      <StandardFormActions />
    </FormWrapper>
  );
}
```

### Formulario con Contraseña

```tsx
import { PasswordField } from '@/components/forms';

<PasswordField
  name="password"
  label="Contraseña"
  showToggle={true}
  validation={formSchemas.user.password}
/>
```

## 🛠️ Componentes Disponibles

### FormWrapper
Componente principal que envuelve todo el formulario.

**Props:**
- `defaultValues` - Valores iniciales
- `onSubmit` - Server Action a ejecutar
- `onSuccess` - Callback de éxito
- `onError` - Callback de error
- `mode` - Modo de validación ('onChange', 'onSubmit', etc.)

### FormField
Campo de formulario genérico y reutilizable.

**Props:**
- `name` - Nombre del campo
- `label` - Etiqueta del campo
- `type` - Tipo de input
- `validation` - Reglas de validación
- `placeholder` - Texto de placeholder

### FileField
Campo especializado para archivos con preview.

**Props:**
- `showPreview` - Mostrar preview de imagen
- `maxSize` - Tamaño máximo en MB
- `previewClassName` - Clases CSS para preview

### PasswordField
Campo especializado para contraseñas con toggle de visibilidad.

### StandardFormActions
Grupo de botones estándar (Guardar, Cancelar, etc.)

## 📝 Validaciones

### Validaciones Predefinidas

```tsx
import { validationSchemas } from '@/components/forms';

// Validaciones básicas
validationSchemas.required('Campo obligatorio')
validationSchemas.email()
validationSchemas.phone()
validationSchemas.minLength(6)
validationSchemas.password(6)

// Validaciones de archivos
validationSchemas.imageFile(1) // 1MB max
validationSchemas.fileSize(5) // 5MB max
```

### Esquemas de Formulario

```tsx
import { formSchemas } from '@/components/forms';

// Esquemas predefinidos
formSchemas.login    // Email + Password
formSchemas.user     // Campos completos de usuario
formSchemas.role     // Campos de rol
formSchemas.recovery // Email para recuperación
```

### Validaciones Personalizadas

```tsx
const customValidation = {
  required: 'Este campo es obligatorio',
  validate: {
    isUnique: async (value) => {
      const exists = await checkIfExists(value);
      return !exists || 'Este valor ya existe';
    }
  }
};
```

## 🔧 Hooks Personalizados

### useServerAction
Hook principal para manejar Server Actions.

```tsx
import { useServerAction } from '@/components/forms';

const { execute, isPending, error, data } = useServerAction({
  action: createUser,
  onSuccess: (response) => console.log('Usuario creado:', response),
  onError: (error) => console.error('Error:', error)
});

// Ejecutar la acción
await execute(formData);
```

### useFormServerAction
Hook especializado para formularios con RHF.

```tsx
const { handleSubmit, isPending, error } = useFormServerAction({
  action: createUser,
  onSuccess: () => router.push('/users')
});

// Usar con React Hook Form
<form onSubmit={form.handleSubmit(handleSubmit)}>
```

## 🎨 Personalización

### Estilos Personalizados

```tsx
<FormField
  name="name"
  label="Nombre"
  className="my-custom-class"
  validation={...}
/>

<StandardFormActions
  submitText="Guardar Cambios"
  justify="center"
/>
```

### Validación Personalizada

```tsx
const customSchema = combineValidations(
  validationSchemas.required(),
  validationSchemas.minLength(3),
  {
    validate: {
      noSpaces: (value) => !value.includes(' ') || 'No se permiten espacios'
    }
  }
);
```

## 📋 Migración de Formularios Existentes

### Antes (Formulario Antiguo)
```tsx
const { register, handleSubmit, formState: { errors } } = useForm();
const [isLoading, setIsLoading] = useState(false);

const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await createUser(formData);
  } catch (error) {
    // manejo de errores manual
  } finally {
    setIsLoading(false);
  }
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('name', { required: 'Nombre obligatorio' })} />
    {errors.name && <p>{errors.name.message}</p>}
    <button disabled={isLoading}>
      {isLoading ? 'Guardando...' : 'Guardar'}
    </button>
  </form>
);
```

### Después (Nuevo Sistema)
```tsx
return (
  <FormWrapper onSubmit={createUser}>
    <FormField
      name="name"
      label="Nombre"
      validation={validationSchemas.required('Nombre obligatorio')}
    />
    <StandardFormActions submitText="Guardar" />
  </FormWrapper>
);
```

## ✅ Beneficios

1. **Menos código repetitivo** - Manejo automático de estados
2. **Validación consistente** - Esquemas reutilizables
3. **Better UX** - Estados de loading y errores integrados
4. **TypeScript completo** - Mejor DX y menos errores
5. **Integración perfecta** - Funciona con Server Actions existentes
6. **Componentes reutilizables** - Acelera desarrollo futuro

## 🔄 Próximos Pasos

1. Migrar gradualmente formularios existentes
2. Crear más componentes especializados según necesidades
3. Añadir más validaciones predefinidas
4. Implementar optimistic updates
5. Añadir tests unitarios