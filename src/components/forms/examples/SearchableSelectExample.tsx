/**
 * Ejemplos de uso del SearchableSelect
 * Muestra diferentes implementaciones y casos de uso
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { 
  FormWrapper, 
  FormField,
  SearchableSelectField,
  useAsyncOptions,
  StandardFormActions,
  validationSchemas
} from '@/components/forms';

interface UserFormData {
  country: string;
  city: string;
  category: string;
  users: string;
}

// Opciones estáticas con grupos
const countryOptions = [
  { value: 'ar', label: 'Argentina', group: 'América del Sur' },
  { value: 'br', label: 'Brasil', group: 'América del Sur' },
  { value: 'cl', label: 'Chile', group: 'América del Sur' },
  { value: 'us', label: 'Estados Unidos', group: 'América del Norte' },
  { value: 'ca', label: 'Canadá', group: 'América del Norte' },
  { value: 'mx', label: 'México', group: 'América del Norte' },
  { value: 'es', label: 'España', group: 'Europa' },
  { value: 'fr', label: 'Francia', group: 'Europa' },
  { value: 'de', label: 'Alemania', group: 'Europa' }
];

// Opciones de ciudades (simulando carga dinámica)
const cityOptions = [
  { value: 'buenos_aires', label: 'Buenos Aires' },
  { value: 'cordoba', label: 'Córdoba' },
  { value: 'rosario', label: 'Rosario' },
  { value: 'mendoza', label: 'Mendoza' },
  { value: 'salta', label: 'Salta' },
  { value: 'tucuman', label: 'Tucumán' },
  { value: 'santa_fe', label: 'Santa Fe' },
  { value: 'mar_del_plata', label: 'Mar del Plata' }
];

const categoryOptions = [
  { value: 'tech', label: 'Tecnología' },
  { value: 'design', label: 'Diseño' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Ventas' },
  { value: 'support', label: 'Soporte' },
  { value: 'hr', label: 'Recursos Humanos' }
];

// Simular API de usuarios
const fetchUsers = async (search: string) => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = [
    { value: 'user1', label: 'Juan Pérez' },
    { value: 'user2', label: 'María García' },
    { value: 'user3', label: 'Carlos López' },
    { value: 'user4', label: 'Ana Martínez' },
    { value: 'user5', label: 'Luis Rodríguez' },
    { value: 'user6', label: 'Carmen Fernández' },
    { value: 'user7', label: 'José González' },
    { value: 'user8', label: 'Isabel Ruiz' }
  ];
  
  return users.filter(user => 
    user.label.toLowerCase().includes(search.toLowerCase())
  );
};

export default function SearchableSelectExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Hook para opciones asíncronas
    const { options: userOptions, loading: usersLoading } = useAsyncOptions({
      searchTerm,
      fetchOptions: fetchUsers,
      debounceMs: 300
    });

    const handleSubmit = async (formData: FormData) => {
        console.log('Form Data:', formData);
        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { message: 'Formulario enviado correctamente' };
    };

    const handleSuccess = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button onClick={() => setIsOpen(true)}>
                SearchableSelect Examples
            </Button>
            
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Ejemplos de SearchableSelect</DialogTitle>
                    <DialogDescription>
                        Diferentes implementaciones del SearchableSelect integrado con FormField.
                    </DialogDescription>
                </DialogHeader>
                
                <FormWrapper<UserFormData>
                    defaultValues={{
                        country: '',
                        city: '',
                        category: '',
                        users: ''
                    }}
                    onSubmit={handleSubmit}
                    onSuccess={handleSuccess}
                    mode="onChange"
                >
                    <div className="space-y-4">
                        {/* 1. SearchableSelect con grupos usando FormField */}
                        <FormField
                            name="country"
                            label="País"
                            type="searchableselect"
                            options={countryOptions}
                            placeholder="Selecciona un país..."
                            searchPlaceholder="Buscar país..."
                            emptyMessage="No se encontraron países"
                            validation={validationSchemas.required('El país es obligatorio')}
                            helpText="Los países están agrupados por región"
                        />
                        
                        {/* 2. SearchableSelect simple con FormField */}
                        <FormField
                            name="city"
                            label="Ciudad"
                            type="searchableselect"
                            options={cityOptions}
                            placeholder="Selecciona una ciudad..."
                            searchPlaceholder="Buscar ciudad..."
                            validation={validationSchemas.required('La ciudad es obligatoria')}
                        />
                        
                        {/* 3. SearchableSelect usando componente especializado */}
                        <SearchableSelectField
                            name="category"
                            label="Categoría"
                            options={categoryOptions}
                            placeholder="Selecciona una categoría..."
                            searchPlaceholder="Buscar categoría..."
                            validation={validationSchemas.required('La categoría es obligatoria')}
                            helpText="Componente SearchableSelectField independiente"
                        />
                        
                        {/* 4. SearchableSelect asíncrono */}
                        <FormField
                            name="users"
                            label="Usuario Asignado"
                            type="searchableselect"
                            options={userOptions}
                            placeholder="Busca un usuario..."
                            searchPlaceholder="Escribe para buscar usuarios..."
                            emptyMessage="Escribe al menos 2 caracteres para buscar"
                            loading={usersLoading}
                            onSearch={setSearchTerm}
                            validation={validationSchemas.required('Debes asignar un usuario')}
                            helpText="Los usuarios se cargan dinámicamente al escribir"
                        />
                    </div>
                    
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <StandardFormActions 
                            submitText="Guardar Selecciones"
                            justify="end"
                        />
                    </DialogFooter>
                </FormWrapper>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Ejemplo de SearchableSelect con datos de una API real
 */
export function SearchableSelectWithAPI() {
    const [searchTerm, setSearchTerm] = useState('');

    // Ejemplo de fetch a API real
    const fetchCountries = async (search: string) => {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${search}`);
            const countries = await response.json();
            
            return countries.map((country: any) => ({
                value: country.cca2,
                label: country.name.common
            }));
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    };

    const { options, loading, error } = useAsyncOptions({
        searchTerm,
        fetchOptions: fetchCountries,
        debounceMs: 500
    });

    return (
        <FormWrapper onSubmit={async () => ({ message: 'Enviado' })}>
            <SearchableSelectField
                name="country_api"
                label="País (API Real)"
                options={options}
                loading={loading}
                placeholder="Buscar países en API..."
                searchPlaceholder="Escribe el nombre del país"
                emptyMessage={error || "Escribe para buscar países"}
                onSearch={setSearchTerm}
                validation={validationSchemas.required()}
                helpText="Conectado a la API de restcountries.com"
            />
            
            <StandardFormActions />
        </FormWrapper>
    );
}