# API Reference

Referencia completa de la API del sistema FormBuilder.

## 🎯 FormBuilder Component

### Props

```tsx
interface FormBuilderProps<T = any> {
  schema: ZodSchema<T>;
  action: (formData: FormData) => Promise<ActionResult>;
  fields: FieldConfig[];
  defaultValues?: Partial<T>;
  layout?: LayoutConfig;
  options?: FormOptions;
  className?: string;
  submitLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  disabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (errors: FormErrors) => void;
  onFieldChange?: (fieldName: string, value: any) => void;
  renderSubmitButton?: (props: SubmitButtonProps) => React.ReactNode;
  renderCancelButton?: (props: CancelButtonProps) => React.ReactNode;
}
```

#### Propiedades Requeridas

| Prop | Tipo | Descripción |
|------|------|-------------|
| `schema` | `ZodSchema<T>` | Esquema de validación Zod |
| `action` | `(formData: FormData) => Promise<ActionResult>` | Server Action para procesar el formulario |
| `fields` | `FieldConfig[]` | Array de configuración de campos |

#### Propiedades Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `defaultValues` | `Partial<T>` | `{}` | Valores por defecto del formulario |
| `layout` | `LayoutConfig` | `{ type: 'stack', gap: 4 }` | Configuración del layout |
| `options` | `FormOptions` | Ver tabla | Opciones de comportamiento |
| `className` | `string` | - | Clases CSS adicionales |
| `submitLabel` | `string` | `'Enviar'` | Texto del botón de envío |
| `cancelLabel` | `string` | `'Cancelar'` | Texto del botón de cancelar |
| `loadingLabel` | `string` | `'Enviando...'` | Texto durante la carga |
| `disabled` | `boolean` | `false` | Deshabilitar todo el formulario |

#### Callbacks

| Callback | Tipo | Descripción |
|----------|------|-------------|
| `onSuccess` | `(data: T) => void` | Se ejecuta cuando el envío es exitoso |
| `onError` | `(errors: FormErrors) => void` | Se ejecuta cuando hay errores |
| `onFieldChange` | `(fieldName: string, value: any) => void` | Se ejecuta cuando cambia un campo |

#### Render Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `renderSubmitButton` | `(props: SubmitButtonProps) => ReactNode` | Personalizar botón de envío |
| `renderCancelButton` | `(props: CancelButtonProps) => ReactNode` | Personalizar botón de cancelar |

### FormOptions

```tsx
interface FormOptions {
  progressiveEnhancement?: boolean;  // default: true
  realTimeValidation?: boolean;      // default: true
  autoSave?: boolean;                // default: false
  resetOnSuccess?: boolean;          // default: true
  focusFirstError?: boolean;         // default: true
  submitOnEnter?: boolean;           // default: true
  showCharacterCount?: boolean;      // default: false
  validateOnBlur?: boolean;          // default: true
}
```

### LayoutConfig

```tsx
interface LayoutConfig {
  type: 'stack' | 'grid' | 'flex';
  columns?: number;
  gap?: number;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}
```

### ActionResult

```tsx
interface ActionResult {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  data?: any;
}
```

## 🏗️ Field Configuration

### BaseFieldConfig

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
  gridColumn?: number;            // Columnas en grid layout
  gridRow?: number;              // Filas en grid layout
  hidden?: boolean;              // Campo oculto
}
```

### TextField Configuration

```tsx
interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password' | 'url' | 'phone';
  maxLength?: number;
  minLength?: number;
  pattern?: string;               // Regex pattern
  icon?: React.ReactNode;
  autoComplete?: string;
  showPasswordToggle?: boolean;   // Solo para password
}
```

### TextareaFieldConfig

```tsx
interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}
```

### SelectFieldConfig

```tsx
interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select' | 'searchable-select' | 'multi-select';
  options: FieldOption[];
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  maxSelections?: number;         // Solo multi-select
  createOption?: boolean;         // Permitir crear opciones
  noOptionsMessage?: string;
}

interface FieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

### FileFieldConfig

```tsx
interface FileFieldConfig extends BaseFieldConfig {
  type: 'file-upload' | 'multi-file-upload';
  accept?: string;                // Tipos de archivo MIME
  multiple?: boolean;
  maxFiles?: number;              // Solo multi-file-upload
  maxSize?: number;               // Bytes por archivo
  maxTotalSize?: number;          // Bytes total (multi-file)
  preview?: boolean;              // Mostrar preview
  cropAspectRatio?: number;       // Ratio para crop
  compressionQuality?: number;    // 0-1 para compresión
  allowedTypes?: string[];        // MIME types permitidos
  dragDrop?: boolean;             // Habilitar drag & drop
}
```

### RichTextFieldConfig

```tsx
interface RichTextFieldConfig extends BaseFieldConfig {
  type: 'rich-text';
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  extensions?: string[];          // TipTap extensions
  placeholder?: string;
  toolbar?: boolean;
  menuBar?: boolean;
}
```

### CheckboxFieldConfig

```tsx
interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox' | 'checkbox-group';
  options?: FieldOption[];        // Para checkbox-group
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;               // Para layout grid
  checkAllOption?: boolean;       // Opción "Seleccionar todo"
}
```

### RadioFieldConfig

```tsx
interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio';
  options: FieldOption[];
  layout?: 'vertical' | 'horizontal';
}
```

### DateFieldConfig

```tsx
interface DateFieldConfig extends BaseFieldConfig {
  type: 'date' | 'datetime' | 'time';
  format?: string;
  minDate?: Date;
  maxDate?: Date;
}
```

### ToggleFieldConfig

```tsx
interface ToggleFieldConfig extends BaseFieldConfig {
  type: 'toggle';
  size?: 'sm' | 'md' | 'lg';
}
```

## 🔧 Hooks

### useFormValidation

```tsx
function useFormValidation({
  schema: ZodSchema,
  defaultValues?: Record<string, any>,
  validateOnChange?: boolean,
  validateOnBlur?: boolean,
  debounceMs?: number,
  customValidators?: CustomValidator[]
}): {
  validationState: FormValidationState;
  formData: Record<string, any>;
  touchedFields: Set<string>;
  validateField: (name: string, value: any) => Promise<FieldValidationResult>;
  validateForm: (data?: Record<string, any>) => Promise<ValidationResult>;
  updateField: (name: string, value: any) => void;
  handleFieldBlur: (name: string, value: any) => void;
  clearFieldError: (name: string) => void;
  clearAllErrors: () => void;
  resetValidation: () => void;
  isFieldTouched: (name: string) => boolean;
  getFieldError: (name: string) => string;
  hasFieldError: (name: string) => boolean;
}
```

### useFormState

```tsx
function useFormState({
  defaultValues?: Record<string, any>,
  onSuccess?: (data: any) => void,
  onError?: (errors: any) => void,
  resetOnSuccess?: boolean
}): {
  state: FormState;
  isPending: boolean;
  updateField: (name: string, value: any) => void;
  setErrors: (errors: Record<string, string | string[]>) => void;
  clearErrors: () => void;
  setLoading: (isLoading: boolean) => void;
  resetForm: () => void;
  executeAction: (action: Function, formData: FormData) => void;
  getFieldValue: (name: string) => any;
  getFieldError: (name: string) => string | string[];
  hasFieldError: (name: string) => boolean;
  isFieldTouched: (name: string) => boolean;
}
```

### useServerAction

```tsx
function useServerAction({
  onSuccess?: (data: any) => void,
  onError?: (errors: any) => void,
  showToast?: boolean,
  successMessage?: string,
  errorMessage?: string
}): {
  formRef: RefObject<HTMLFormElement>;
  executeWithData: (action: Function, data: Record<string, any>) => Promise<ActionResult>;
  executeWithFormData: (action: Function, formData: FormData) => Promise<ActionResult>;
  executeFromForm: (action: Function) => Promise<ActionResult | null>;
  handleSubmit: (action: Function) => (event: FormEvent) => Promise<void>;
  resetForm: () => void;
  createFormData: (data: Record<string, any>) => FormData;
  extractFormData: (form: HTMLFormElement) => FormData;
  handleActionResult: (result: ActionResult) => void;
}
```

### useFormContext

```tsx
function useFormContext(): {
  state: FormState;
  updateField: (name: string, value: any) => void;
  validateField: (name: string, value: any) => Promise<string | null>;
  resetForm: () => void;
  submitForm: () => void;
}
```

## 📊 Tipos de Validación

### ValidationResult

```tsx
interface ValidationResult {
  success: boolean;
  data?: any;
  error?: string;
  issues?: ZodIssue[];
}
```

### FieldValidationResult

```tsx
interface FieldValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}
```

### CustomValidator

```tsx
interface CustomValidator {
  field: string;
  validator: (value: any, formData: Record<string, any>) => Promise<FieldValidationResult>;
  trigger?: 'change' | 'blur' | 'submit';
}
```

## 🎨 Estilos y Temas

### CSS Classes

El sistema utiliza las siguientes clases CSS que puedes personalizar:

```css
/* Contenedor principal */
.form-builder { }

/* Wrapper de campo individual */
.form-field-wrapper { }

/* Estados de campo */
.form-field[data-error="true"] { }
.form-field:focus-within { }
.form-field[disabled] { }

/* Mensajes */
.form-error { }
.form-warning { }
.form-description { }

/* Layout */
.form-grid { }
.form-stack { }
.form-flex { }
```

### Tokens de Diseño

```css
:root {
  --form-gap: 1rem;
  --form-border-radius: 0.375rem;
  --form-border-color: hsl(var(--border));
  --form-error-color: hsl(var(--destructive));
  --form-warning-color: hsl(var(--warning));
  --form-success-color: hsl(var(--success));
}
```

## 🔧 Utilidades

### Server Action Helper

```tsx
// utils/serverActionHelper.ts
export function createServerAction<T>(
  schema: ZodSchema<T>,
  handler: (data: T) => Promise<any>
) {
  return async (formData: FormData): Promise<ActionResult> => {
    const rawData = Object.fromEntries(formData);
    const result = schema.safeParse(rawData);
    
    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors
      };
    }
    
    try {
      const data = await handler(result.data);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Server error'
      };
    }
  };
}

// Uso
const createUser = createServerAction(userSchema, async (data) => {
  return await db.user.create({ data });
});
```

### Schema Builder Helper

```tsx
// utils/schemaBuilder.ts
export class SchemaBuilder {
  static email(message = 'Email inválido') {
    return z.string().email(message);
  }
  
  static password(minLength = 8) {
    return z.string()
      .min(minLength, `Mínimo ${minLength} caracteres`)
      .regex(/[A-Z]/, 'Debe contener una mayúscula')
      .regex(/[0-9]/, 'Debe contener un número');
  }
  
  static phone() {
    return z.string()
      .regex(/^[\+]?[0-9\s\-\(\)]{7,15}$/, 'Formato de teléfono inválido');
  }
  
  static file(maxSize = 5242880) { // 5MB
    return z.instanceof(File)
      .refine(file => file.size <= maxSize, 'Archivo muy grande');
  }
}

// Uso
const userSchema = z.object({
  email: SchemaBuilder.email(),
  password: SchemaBuilder.password(),
  phone: SchemaBuilder.phone()
});
```

## 🚨 Error Handling

### Tipos de Errores

```tsx
// Errores de validación
interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid' | 'custom' | 'server';
  value?: any;
}

// Errores del formulario
interface FormErrors {
  [fieldName: string]: string | string[];
}
```

### Manejo Global de Errores

```tsx
// utils/errorHandler.ts
export function handleFormError(error: unknown): ActionResult {
  if (error instanceof ZodError) {
    return {
      success: false,
      errors: error.flatten().fieldErrors
    };
  }
  
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message
    };
  }
  
  return {
    success: false,
    error: 'Error desconocido'
  };
}
```

## 📱 Responsive Behavior

### Breakpoints

```tsx
const responsiveLayout: LayoutConfig = {
  type: 'grid',
  columns: 4,
  gap: 6,
  breakpoints: {
    sm: 1,  // 1 columna en móvil
    md: 2,  // 2 columnas en tablet
    lg: 3,  // 3 columnas en desktop
    xl: 4   // 4 columnas en pantallas grandes
  }
};
```

### Adaptación Automática

Los campos se adaptan automáticamente a diferentes tamaños de pantalla siguiendo estos patrones:

- **Móvil**: Stack vertical, campos full-width
- **Tablet**: Grid de 1-2 columnas
- **Desktop**: Grid de 2-4 columnas según configuración

---

¿Necesitas más información? ¡Consulta los [ejemplos prácticos](./casos-de-uso.md)! 🚀