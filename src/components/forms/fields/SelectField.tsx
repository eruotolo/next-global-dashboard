/**
 * Campo de Select mejorado integrado con React Hook Form
 */

import { useFormContext } from '../core/FormWrapper';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FieldValidation } from '../utils/types';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  validation?: FieldValidation;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  placeholder?: string;
}

/**
 * Campo de Select con validación integrada
 */
export function SelectField({
  name,
  label,
  options,
  validation,
  disabled,
  className = '',
  helpText,
  placeholder = 'Selecciona una opción'
}: SelectFieldProps) {
  const { form, isPending } = useFormContext();
  const { setValue, watch, formState: { errors } } = form;

  const error = errors[name];
  const fieldDisabled = disabled || isPending;
  const value = watch(name) || '';

  const handleChange = (value: string) => {
    setValue(name, value, { 
      shouldValidate: true,
      shouldDirty: true 
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      
      <Select 
        value={value}
        onValueChange={handleChange}
        disabled={fieldDisabled}
      >
        <SelectTrigger className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
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