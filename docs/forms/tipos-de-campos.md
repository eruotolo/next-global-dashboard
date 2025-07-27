# Tipos de Campos Disponibles

Referencia completa de todos los tipos de campos que puedes usar en FormBuilder.

## 📝 Campos de Texto

### TextField - Text/Email/Password

```tsx
{
  name: 'username',
  type: 'text', // 'text' | 'email' | 'password' | 'phone' | 'url' | 'number'
  label: 'Nombre de usuario',
  placeholder: 'Ingresa tu usuario',
  required: true,
  maxLength: 50,
  minLength: 3,
  pattern: '^[a-zA-Z0-9_]+$', // Regex pattern
  icon: <User className="h-4 w-4" />, // Icono opcional
  autoComplete: 'username',
  showPasswordToggle: true, // Solo para type: 'password'
  validation: 'realtime' // 'realtime' | 'onBlur' | 'onSubmit'
}
```

**Propiedades específicas:**
- `showPasswordToggle`: Mostrar/ocultar contraseña (solo password)
- `icon`: Icono a la izquierda del campo
- `autoComplete`: Atributo autocomplete HTML

### TextareaField

```tsx
{
  name: 'description',
  type: 'textarea',
  label: 'Descripción',
  placeholder: 'Describe tu proyecto...',
  required: true,
  rows: 5,
  cols: 50,
  maxLength: 500,
  minLength: 10,
  showCharCount: true,
  resize: 'vertical', // 'none' | 'vertical' | 'horizontal' | 'both'
  description: 'Máximo 500 caracteres'
}
```

**Propiedades específicas:**
- `rows/cols`: Dimensiones del textarea
- `showCharCount`: Mostrar contador de caracteres
- `resize`: Tipo de redimensionamiento

## 🔽 Campos de Selección

### SelectField - Select Simple

```tsx
{
  name: 'country',
  type: 'select',
  label: 'País',
  placeholder: 'Seleccionar país...',
  required: true,
  options: [
    { value: 'mx', label: 'México' },
    { value: 'us', label: 'Estados Unidos' },
    { value: 'ca', label: 'Canadá', disabled: true }
  ],
  clearable: true,
  noOptionsMessage: 'No hay países disponibles'
}
```

### MultiSelect - Selección Múltiple

```tsx
{
  name: 'skills',
  type: 'multi-select',
  label: 'Habilidades',
  placeholder: 'Selecciona habilidades...',
  options: [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'react', label: 'React' }
  ],
  maxSelections: 5,
  clearable: true,
  createOption: false // Permitir crear nuevas opciones
}
```

### SearchableSelect (🔄 Próximamente)

```tsx
{
  name: 'city',
  type: 'searchable-select',
  label: 'Ciudad',
  placeholder: 'Buscar ciudad...',
  options: cityOptions,
  searchable: true,
  loading: false,
  noOptionsMessage: 'No se encontraron ciudades'
}
```

## 📄 Campos de Archivo

### FileUpload (🔄 Próximamente)

```tsx
{
  name: 'avatar',
  type: 'file-upload',
  label: 'Foto de perfil',
  accept: 'image/*',
  maxSize: 1024000, // 1MB en bytes
  preview: true,
  cropAspectRatio: 1, // Ratio 1:1 (cuadrado)
  compressionQuality: 0.8,
  allowedTypes: ['image/jpeg', 'image/png'],
  dragDrop: true,
  description: 'Máximo 1MB, formatos: JPG, PNG'
}
```

### MultiFileUpload (🔄 Próximamente)

```tsx
{
  name: 'documents',
  type: 'multi-file-upload',
  label: 'Documentos',
  accept: '.pdf,.doc,.docx',
  multiple: true,
  maxFiles: 5,
  maxSize: 5242880, // 5MB por archivo
  maxTotalSize: 26214400, // 25MB total
  preview: false,
  dragDrop: true
}
```

## 📅 Campos de Fecha

### DateField (🔄 Próximamente)

```tsx
{
  name: 'birthdate',
  type: 'date', // 'date' | 'datetime' | 'time'
  label: 'Fecha de nacimiento',
  required: true,
  format: 'dd/MM/yyyy',
  minDate: new Date('1900-01-01'),
  maxDate: new Date(),
  description: 'Formato: DD/MM/AAAA'
}
```

## ☑️ Campos de Opciones

### CheckboxField (🔄 Próximamente)

```tsx
// Checkbox individual
{
  name: 'terms',
  type: 'checkbox',
  label: 'Acepto los términos y condiciones',
  required: true
}

// Grupo de checkboxes
{
  name: 'interests',
  type: 'checkbox-group',
  label: 'Intereses',
  options: [
    { value: 'tech', label: 'Tecnología' },
    { value: 'sports', label: 'Deportes' },
    { value: 'music', label: 'Música' }
  ],
  layout: 'grid', // 'vertical' | 'horizontal' | 'grid'
  columns: 2,
  checkAllOption: true
}
```

### RadioField (🔄 Próximamente)

```tsx
{
  name: 'plan',
  type: 'radio',
  label: 'Plan de suscripción',
  required: true,
  options: [
    { value: 'basic', label: 'Básico - $10/mes' },
    { value: 'pro', label: 'Pro - $25/mes' },
    { value: 'enterprise', label: 'Enterprise - $50/mes' }
  ],
  layout: 'vertical' // 'vertical' | 'horizontal'
}
```

## 🎨 Campos Especiales

### RichTextEditor (🔄 Próximamente)

```tsx
{
  name: 'content',
  type: 'rich-text',
  label: 'Contenido',
  placeholder: 'Escribe tu contenido...',
  height: 300,
  minHeight: 200,
  maxHeight: 600,
  extensions: ['bold', 'italic', 'link', 'bullet-list', 'image'],
  toolbar: true,
  menuBar: false
}
```

### ToggleField (🔄 Próximamente)

```tsx
{
  name: 'notifications',
  type: 'toggle',
  label: 'Activar notificaciones',
  size: 'lg', // 'sm' | 'md' | 'lg'
  description: 'Recibir notificaciones por email'
}
```

## 🎛️ Propiedades Comunes

Todas los campos heredan estas propiedades base:

```tsx
interface BaseFieldConfig {
  name: string;                    // Nombre único del campo
  type: FieldType;                // Tipo de campo
  label: string;                  // Etiqueta visible
  placeholder?: string;           // Texto placeholder
  description?: string;           // Texto de ayuda
  required?: boolean;             // Campo obligatorio
  disabled?: boolean;             // Campo deshabilitado
  readOnly?: boolean;             // Solo lectura
  className?: string;             // Clases CSS adicionales
  validation?: 'realtime' | 'onBlur' | 'onSubmit';
  gridColumn?: number;            // Columnas que ocupa en grid
  gridRow?: number;              // Filas que ocupa en grid
  hidden?: boolean;              // Campo oculto
}
```

## 🎯 Ejemplos de Uso Común

### Formulario de Registro Completo

```tsx
const registrationFields = [
  {
    name: 'firstName',
    type: 'text',
    label: 'Nombre',
    required: true,
    gridColumn: 1
  },
  {
    name: 'lastName',
    type: 'text',
    label: 'Apellido',
    required: true,
    gridColumn: 1
  },
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
    showPasswordToggle: true,
    minLength: 8
  },
  {
    name: 'bio',
    type: 'textarea',
    label: 'Biografía',
    rows: 4,
    maxLength: 500,
    showCharCount: true
  },
  {
    name: 'avatar',
    type: 'file-upload',
    label: 'Foto de perfil',
    accept: 'image/*',
    preview: true
  }
];
```

### Formulario de Configuración

```tsx
const settingsFields = [
  {
    name: 'theme',
    type: 'select',
    label: 'Tema',
    options: [
      { value: 'light', label: 'Claro' },
      { value: 'dark', label: 'Oscuro' },
      { value: 'auto', label: 'Automático' }
    ]
  },
  {
    name: 'language',
    type: 'searchable-select',
    label: 'Idioma',
    options: languageOptions,
    searchable: true
  },
  {
    name: 'notifications',
    type: 'checkbox-group',
    label: 'Notificaciones',
    options: [
      { value: 'email', label: 'Email' },
      { value: 'push', label: 'Push' },
      { value: 'sms', label: 'SMS' }
    ]
  },
  {
    name: 'newsletter',
    type: 'toggle',
    label: 'Newsletter',
    description: 'Recibir noticias semanales'
  }
];
```

## 📋 Checklist de Implementación

Al crear un nuevo tipo de campo:

- [ ] Definir interface en `FieldTypes.ts`
- [ ] Crear componente en `fields/`
- [ ] Agregar al dispatcher en `FormField`
- [ ] Actualizar documentación
- [ ] Crear ejemplos de uso
- [ ] Añadir tests (si aplica)

---

¿Necesitas un tipo de campo específico? ¡Consulta la [API Reference](./api-reference.md)! 🚀