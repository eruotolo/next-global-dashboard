import type { ReactNode } from 'react';

import type { z } from 'zod';

export interface FormProps<T extends z.ZodType> {
    schema: T;
    action: (formData: FormData) => Promise<void>;
    defaultValues?: Partial<z.infer<T>>;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    layout?: 'default' | 'grid';
    className?: string;
    children: ReactNode;
    submitText?: string;
    cancelText?: string;
    onCancel?: () => void;
}

export interface FormFieldProps {
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    description?: string;
}

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface FormState {
    isSubmitting: boolean;
    errors: Record<string, string>;
    success: boolean;
}
