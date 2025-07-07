/**
 * Campo de Select con búsqueda integrado con React Hook Form
 * Versión mejorada del SearchableSelect original
 */

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from '../core/FormWrapper';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { FieldValidation } from '../utils/types';

interface SearchableSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SearchableSelectFieldProps {
  name: string;
  label: string;
  options: SearchableSelectOption[];
  validation?: FieldValidation;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (search: string) => void;
}

/**
 * Campo de Select con búsqueda y validación integrada
 */
export function SearchableSelectField({
  name,
  label,
  options,
  validation,
  disabled,
  className = '',
  helpText,
  placeholder = 'Selecciona una opción...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No se encontraron resultados.',
  loading = false,
  onOpenChange,
  onSearch
}: SearchableSelectFieldProps) {
  const { form, isPending } = useFormContext();
  const { setValue, watch, formState: { errors } } = form;
  const [open, setOpen] = useState(false);

  const error = errors[name];
  const fieldDisabled = disabled || isPending || loading;
  const value = watch(name) || '';

  const selectedOption = options.find(option => option.value === value);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSelect = (selectedValue: string) => {
    setValue(name, selectedValue, { 
      shouldValidate: true,
      shouldDirty: true 
    });
    setOpen(false);
  };

  // Agrupar opciones si tienen grupos
  const groupedOptions = options.reduce((groups, option) => {
    const group = option.group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, SearchableSelectOption[]>);

  const renderOptions = () => {
    if (Object.keys(groupedOptions).length === 1 && groupedOptions.default) {
      // Sin grupos, renderizar directamente
      return groupedOptions.default.map((option) => (
        <CommandItem
          key={option.value}
          value={option.label}
          disabled={option.disabled}
          onSelect={() => !option.disabled && handleSelect(option.value)}
        >
          <Check
            className={cn(
              'mr-2 h-4 w-4',
              value === option.value ? 'opacity-100' : 'opacity-0'
            )}
          />
          {option.label}
        </CommandItem>
      ));
    }

    // Con grupos
    return Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
      <CommandGroup key={groupName} heading={groupName !== 'default' ? groupName : undefined}>
        {groupOptions.map((option) => (
          <CommandItem
            key={option.value}
            value={option.label}
            disabled={option.disabled}
            onSelect={() => !option.disabled && handleSelect(option.value)}
          >
            <Check
              className={cn(
                'mr-2 h-4 w-4',
                value === option.value ? 'opacity-100' : 'opacity-0'
              )}
            />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
    ));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={fieldDisabled}
            className={cn(
              "w-full justify-between",
              !selectedOption && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              selectedOption?.label || placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={searchPlaceholder}
              onValueChange={onSearch}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {renderOptions()}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
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

/**
 * Hook para manejar opciones asíncronas
 */
import { useEffect } from 'react';

interface UseAsyncOptionsProps {
  searchTerm?: string;
  fetchOptions: (search: string) => Promise<SearchableSelectOption[]>;
  debounceMs?: number;
}

export function useAsyncOptions({ 
  searchTerm = '', 
  fetchOptions, 
  debounceMs = 300 
}: UseAsyncOptionsProps) {
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await fetchOptions(searchTerm);
        setOptions(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar opciones');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchOptions, debounceMs]);

  return { options, loading, error };
}