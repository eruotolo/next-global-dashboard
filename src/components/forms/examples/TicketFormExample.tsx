/**
 * Ejemplo de formulario de ticket usando Rich Text Editor
 * Muestra cómo usar FormField con diferentes tipos
 */

import { useState } from 'react';
import { createTicket } from '@/actions/Settings/Tickets'; // Asumiendo que existe
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
  RichTextField,
  SelectField,
  CheckboxField,
  StandardFormActions,
  validationSchemas
} from '@/components/forms';

interface TicketFormData {
  title: string;
  description: string; // Rich text
  priority: string;
  urgent: boolean;
  category: string;
}

const priorityOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' }
];

const categoryOptions = [
  { value: 'bug', label: 'Error/Bug' },
  { value: 'feature', label: 'Nueva Funcionalidad' },
  { value: 'support', label: 'Soporte' },
  { value: 'improvement', label: 'Mejora' }
];

export default function TicketFormExample() {
    const [isOpen, setIsOpen] = useState(false);

    const handleSuccess = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button onClick={() => setIsOpen(true)}>
                Crear Ticket (Ejemplo)
            </Button>
            
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Ticket</DialogTitle>
                    <DialogDescription>
                        Ejemplo de formulario con Rich Text Editor y otros campos avanzados.
                    </DialogDescription>
                </DialogHeader>
                
                <FormWrapper<TicketFormData>
                    defaultValues={{
                        title: '',
                        description: '',
                        priority: '',
                        urgent: false,
                        category: ''
                    }}
                    onSubmit={createTicket}
                    onSuccess={handleSuccess}
                    mode="onChange"
                >
                    <div className="space-y-4">
                        {/* Campo de texto normal */}
                        <FormField
                            name="title"
                            label="Título del Ticket"
                            placeholder="Describe brevemente el problema"
                            validation={{
                                ...validationSchemas.required('El título es obligatorio'),
                                ...validationSchemas.minLength(5, 'El título debe tener al menos 5 caracteres')
                            }}
                        />
                        
                        {/* Rich Text Editor usando FormField */}
                        <FormField
                            name="description"
                            label="Descripción Detallada"
                            type="richtext"
                            imageFolder="ticket-images"
                            validation={validationSchemas.required('La descripción es obligatoria')}
                            helpText="Describe el problema en detalle. Puedes usar formato rich text."
                        />
                        
                        {/* Select usando FormField */}
                        <FormField
                            name="category"
                            label="Categoría"
                            type="select"
                            options={categoryOptions}
                            placeholder="Selecciona una categoría"
                            validation={validationSchemas.required('La categoría es obligatoria')}
                        />
                        
                        {/* Select usando componente especializado */}
                        <SelectField
                            name="priority"
                            label="Prioridad"
                            options={priorityOptions}
                            placeholder="Selecciona la prioridad"
                            validation={validationSchemas.required('La prioridad es obligatoria')}
                            helpText="La prioridad determina el orden de atención"
                        />
                        
                        {/* Checkbox usando FormField */}
                        <FormField
                            name="urgent"
                            label="Marcar como urgente"
                            type="checkbox"
                            description="Este ticket requiere atención inmediata"
                            helpText="Los tickets urgentes se procesan con mayor prioridad"
                        />
                        
                        {/* Checkbox usando componente especializado */}
                        <CheckboxField
                            name="urgent"
                            label="Alternativa: Checkbox especializado"
                            description="Mismo resultado, diferentes opciones de implementación"
                        />
                    </div>
                    
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <StandardFormActions 
                            submitText="Crear Ticket"
                            justify="end"
                        />
                    </DialogFooter>
                </FormWrapper>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Ejemplo usando RichTextField como componente separado
 */
export function TicketFormWithRichTextField() {
    return (
        <FormWrapper
            defaultValues={{ title: '', content: '' }}
            onSubmit={async (formData) => {
                console.log('Form data:', formData);
                return { message: 'Ticket creado' };
            }}
        >
            <FormField
                name="title"
                label="Título"
                validation={validationSchemas.required()}
            />
            
            {/* Rich Text Field como componente separado */}
            <RichTextField
                name="content"
                label="Contenido del Ticket"
                imageFolder="tickets"
                validation={validationSchemas.required('El contenido es obligatorio')}
                helpText="Usa el editor para dar formato a tu contenido"
            />
            
            <StandardFormActions />
        </FormWrapper>
    );
}