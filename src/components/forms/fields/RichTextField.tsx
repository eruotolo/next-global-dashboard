/**
 * Campo de Rich Text Editor integrado con React Hook Form
 */

import { type ReactNode } from 'react';
import { useFormContext } from '../core/FormWrapper';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/rich-text-editor';
import type { FieldValidation } from '../utils/types';

interface RichTextFieldProps {
  name: string;
  label: string;
  validation?: FieldValidation;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  imageFolder?: string;
  placeholder?: string;
}

/**
 * Campo de Rich Text Editor con validación integrada
 */
export function RichTextField({
  name,
  label,
  validation,
  disabled,
  className = '',
  helpText,
  imageFolder = 'editor-images',
  placeholder
}: RichTextFieldProps) {
  const { form, isPending } = useFormContext();
  const { setValue, watch, formState: { errors } } = form;

  const error = errors[name];
  const fieldDisabled = disabled || isPending;
  const content = watch(name) || '';

  const handleChange = (content: string) => {
    setValue(name, content, { 
      shouldValidate: true,
      shouldDirty: true 
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      
      <div className={error ? 'border-destructive rounded-md border-2' : ''}>
        <RichTextEditor
          content={content}
          onChangeAction={handleChange}
          imageFolder={imageFolder}
        />
        {fieldDisabled && (
          <div className="absolute inset-0 bg-muted/50 rounded-md" />
        )}
      </div>
      
      {helpText && (
        <p className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-destructive">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}