/**
 * Componente de campo de formulario reutilizable
 * Integra validación y manejo de errores
 */

import { type HTMLInputTypeAttribute, type ReactNode } from 'react';
import { useFormContext } from './FormWrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { SearchableSelectField } from '../fields/SearchableSelectField';
import type { FieldValidation } from '../utils/types';

interface FormFieldProps {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute | 'select' | 'textarea' | 'richtext' | 'checkbox' | 'searchableselect' | 'custom';
  placeholder?: string;
  validation?: FieldValidation;
  options?: Array<{ value: string; label: string; disabled?: boolean; group?: string }>;
  disabled?: boolean;
  accept?: string;
  rows?: number;
  className?: string;
  helpText?: string;
  children?: ReactNode;
  // Props para Rich Text Editor
  imageFolder?: string;
  // Props para Checkbox
  description?: string;
  // Props para SearchableSelect
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  onSearch?: (search: string) => void;
}

/**
 * Campo de formulario con validación integrada
 */
export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  validation,
  options,
  disabled,
  accept,
  rows = 3,
  className = '',
  helpText,
  children,
  imageFolder,
  description,
  searchPlaceholder,
  emptyMessage,
  loading,
  onSearch
}: FormFieldProps) {
  const { form, isPending } = useFormContext();
  const { register, formState: { errors }, setValue, watch } = form;

  const error = errors[name];
  const fieldDisabled = disabled || isPending;

  // Renderizar el campo según el tipo
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Select 
            value={watch(name) || ''}
            onValueChange={(value) => setValue(name, value, { shouldValidate: true })}
            disabled={fieldDisabled}
          >
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'searchableselect':
        // Usar el componente inline para evitar duplicar el label
        return null; // Se renderiza en el return principal
      
      case 'textarea':
        return (
          <Textarea
            {...register(name, validation)}
            placeholder={placeholder}
            disabled={fieldDisabled}
            rows={rows}
            className={error ? 'border-destructive' : ''}
          />
        );
      
      case 'richtext':
        return (
          <div className={error ? 'border-destructive rounded-md border-2' : ''}>
            <RichTextEditor
              content={watch(name) || ''}
              onChangeAction={(content) => setValue(name, content, { shouldValidate: true })}
              imageFolder={imageFolder || 'editor-images'}
            />
          </div>
        );
      
      case 'checkbox':
        // El checkbox se renderiza en el return principal
        return null;
      
      case 'file':
        return (
          <Input
            {...register(name, validation)}
            type="file"
            accept={accept}
            disabled={fieldDisabled}
            className={error ? 'border-destructive' : ''}
          />
        );
      
      case 'custom':
        // Para componentes completamente personalizados
        return null;
      
      default:
        return (
          <Input
            {...register(name, validation)}
            type={type}
            placeholder={placeholder}
            disabled={fieldDisabled}
            className={error ? 'border-destructive' : ''}
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Para checkbox y searchableselect, el label va dentro del componente */}
      {type !== 'checkbox' && type !== 'searchableselect' && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      
      {/* Para checkbox, necesitamos renderizar el label junto con el checkbox */}
      {type === 'checkbox' ? (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={name}
            checked={watch(name) || false}
            onCheckedChange={(checked) => setValue(name, checked, { shouldValidate: true })}
            disabled={fieldDisabled}
            className={error ? 'border-destructive' : ''}
          />
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      ) : type === 'searchableselect' ? (
        /* Para searchableselect, usar el componente completo */
        <SearchableSelectField
          name={name}
          label={label}
          options={options || []}
          validation={validation}
          disabled={fieldDisabled}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          loading={loading}
          onSearch={onSearch}
          helpText={helpText}
        />
      ) : (
        children || renderField()
      )}
      
      {/* Para searchableselect, el helpText y error se manejan internamente */}
      {type !== 'searchableselect' && helpText && (
        <p className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
      
      {type !== 'searchableselect' && error && (
        <p className="text-sm text-destructive">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}

/**
 * Campo de archivo con preview de imagen
 */
interface FileFieldProps extends Omit<FormFieldProps, 'type'> {
  showPreview?: boolean;
  maxSize?: number; // en MB
  previewClassName?: string;
}

export function FileField({ 
  showPreview = false, 
  maxSize = 1,
  previewClassName = 'w-20 h-20 rounded-full object-cover',
  ...props 
}: FileFieldProps) {
  const { form } = useFormContext();
  const { watch } = form;
  
  const fileValue = watch(props.name);
  const previewUrl = fileValue && fileValue[0] 
    ? URL.createObjectURL(fileValue[0])
    : null;

  return (
    <div className="space-y-2">
      <FormField
        {...props}
        type="file"
        accept="image/*"
        validation={{
          ...props.validation,
          validate: {
            ...props.validation?.validate,
            fileSize: (files: FileList) => {
              if (!files || files.length === 0) return true;
              const file = files[0];
              const maxSizeInBytes = maxSize * 1024 * 1024;
              return file.size <= maxSizeInBytes || 
                     `La imagen no puede superar ${maxSize}MB`;
            }
          }
        }}
      />
      
      {showPreview && previewUrl && (
        <div className="mt-2">
          <img 
            src={previewUrl} 
            alt="Preview"
            className={previewClassName}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Campo de contraseña con toggle de visibilidad
 */
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasswordFieldProps extends Omit<FormFieldProps, 'type'> {
  showToggle?: boolean;
}

export function PasswordField({ 
  showToggle = true,
  ...props 
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <FormField
        {...props}
        type={showPassword ? 'text' : 'password'}
      />
      
      {showToggle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-8 h-8 w-8 px-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}