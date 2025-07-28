// Componente principal
export { Form } from './Form';

// Campos con React Hook Form
export { TextField } from './fields/TextField';
export { SearchableSelectField } from './fields/SearchableSelectField';
export { CheckboxGroupField } from './fields/CheckboxGroupField';
export { FileDropzoneField } from './fields/FileDropzoneField';

// Hooks
export { useForm } from './hooks/useForm';
export { useFormField } from './hooks/useFormField';

// Tipos
export type { FormProps, FormFieldProps, SelectOption } from './types/form';
export type {
    TextFieldProps,
    SearchableSelectFieldProps,
    CheckboxGroupFieldProps,
    FileDropzoneFieldProps,
    UploadedFile,
} from './types/fields';

// Esquemas de validación
export * from './validation/schemas';
