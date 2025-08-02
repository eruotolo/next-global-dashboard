// Componente principal
export { Form } from './Form';

// Campos con React Hook Form
export { TextField } from './fields/TextField';
export { TextAreaField } from './fields/TextAreaField';
export { SearchableSelectField } from './fields/SearchableSelectField';
export { CheckboxGroupField } from './fields/CheckboxGroupField';
export { FileDropzoneField } from './fields/FileDropzoneField';
export { DateField } from './fields/DateField';
export { ImageField } from './fields/ImageField';

// Hooks
export { useForm } from './hooks/useForm';
export { useFormField } from './hooks/useFormField';

// Tipos
export type { FormProps, FormFieldProps, SelectOption } from './types/form';
export type {
    TextFieldProps,
    TextAreaFieldProps,
    SearchableSelectFieldProps,
    CheckboxGroupFieldProps,
    FileDropzoneFieldProps,
    UploadedFile,
} from './types/fields';

// Los esquemas de validación ahora están ubicados en cada componente específico
