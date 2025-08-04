'use client';

import { useController } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { RichTextFieldProps } from '../types/fields';

export function RichTextField({
    name,
    label,
    imageFolder = 'editor-images',
    placeholder,
    required,
    disabled,
    className,
    description,
    maxLength,
}: RichTextFieldProps) {
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId } = useFormField(name);

    const { field } = useController({
        name,
        defaultValue: '',
    });

    const isFieldDisabled = disabled || isDisabled;

    return (
        <div className={cn('space-y-2', className)}>
            <Label
                htmlFor={fieldId}
                className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
            >
                {label}
            </Label>

            <div className={cn(hasError && 'rounded-md ring-2 ring-red-500')}>
                <RichTextEditor
                    content={field.value}
                    onChangeAction={field.onChange}
                    imageFolder={imageFolder}
                />
            </div>

            {maxLength && (
                <div className="text-muted-foreground text-right text-xs">
                    {field.value.length}/{maxLength}
                </div>
            )}

            {description && (
                <p id={descriptionId} className="text-muted-foreground text-sm">
                    {description}
                </p>
            )}

            {hasError && (
                <p id={errorId} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
