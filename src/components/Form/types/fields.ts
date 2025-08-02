import type { FormFieldProps, SelectOption } from './form';

export interface TextFieldProps extends FormFieldProps {
    type?: 'text' | 'email' | 'password' | 'tel' | 'url';
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    showPasswordToggle?: boolean;
}

export interface DateFieldProps extends FormFieldProps {
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
}

export interface SelectFieldProps extends FormFieldProps {
    options: SelectOption[];
    placeholder?: string;
}

export interface SearchableSelectFieldProps extends FormFieldProps {
    options: SelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
}

export interface CheckboxFieldProps extends FormFieldProps {
    description?: string;
}

export interface CheckboxGroupFieldProps extends FormFieldProps {
    options: SelectOption[];
    layout?: 'vertical' | 'horizontal' | 'grid';
}

export interface RichTextFieldProps extends FormFieldProps {
    imageFolder?: string;
    placeholder?: string;
    maxLength?: number;
}

export interface ImageFieldProps extends FormFieldProps {
    folder?: string;
    preview?: boolean;
    maxSize?: number; // MB
    acceptedTypes?: string[];
}

export interface FileDropzoneFieldProps extends FormFieldProps {
    folder: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number; // MB
    acceptedTypes?: string[];
    preview?: boolean;
}

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: Date;
}
