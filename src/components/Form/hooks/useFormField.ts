'use client';

import { useFormContext } from 'react-hook-form';
import { useFormStateContext } from '../FormProvider';

export function useFormField(name: string) {
    const form = useFormContext();
    const state = useFormStateContext();

    const fieldState = form.getFieldState(name, form.formState);
    const fieldError = fieldState.error;

    return {
        error: fieldError?.message,
        hasError: !!fieldError,
        isDisabled: state.isSubmitting,
        fieldId: `field-${name}`,
        errorId: `error-${name}`,
        descriptionId: `description-${name}`,
        ...form.register(name),
    };
}
