/**
 * Campo de Checkbox integrado con React Hook Form
 */

import { useFormContext } from '../core/FormWrapper';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { FieldValidation } from '../utils/types';

interface CheckboxFieldProps {
  name: string;
  label: string;
  validation?: FieldValidation;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  description?: string;
}

/**
 * Campo de Checkbox con validación integrada
 */
export function CheckboxField({
  name,
  label,
  validation,
  disabled,
  className = '',
  helpText,
  description
}: CheckboxFieldProps) {
  const { form, isPending } = useFormContext();
  const { setValue, watch, formState: { errors } } = form;

  const error = errors[name];
  const fieldDisabled = disabled || isPending;
  const checked = watch(name) || false;

  const handleChange = (checked: boolean) => {
    setValue(name, checked, { 
      shouldValidate: true,
      shouldDirty: true 
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          checked={checked}
          onCheckedChange={handleChange}
          disabled={fieldDisabled}
          className={error ? 'border-destructive' : ''}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
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