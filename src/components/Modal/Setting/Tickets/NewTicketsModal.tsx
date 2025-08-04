'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { TicketPriority, TicketStatus } from '@prisma/client';

import { createTicket } from '@/actions/Settings/Tickets';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
import { Form, ImageField, RichTextField, SelectField, TextField } from '@/components/Form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import useAuthStore from '@/store/authStore';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

import { PRIORITY_LABELS, STATUS_LABELS, TicketCreateSchema } from './ticketSchemas';

export default function NewTicketsModal({ refreshAction }: UpdateData) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const session = useAuthStore((state) => state.session);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    // Opciones para los Select fields
    const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const handleSuccess = () => {
        toast.success('Nuevo Ticket Successful', {
            description: 'El ticket se ha creado correctamente.',
        });
        refreshAction?.();
        setIsOpen(false);
        setIsSubmitting(false);
    };

    const handleError = (error: string) => {
        toast.error('Nuevo Ticket Failed', {
            description: error || 'Error al intentar crear el ticket',
        });
        setIsSubmitting(false);
    };

    const handleCreateTicket = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            // Agregar datos de usuario de la sesión
            formData.append('userId', session?.user?.id || '');
            formData.append('userName', session?.user?.name || '');
            formData.append('userLastName', session?.user?.lastName || '');

            const result = await createTicket(formData);

            if (result?.error) {
                throw new Error(result.error);
            }
        } catch (error) {
            setIsSubmitting(false);
            throw error;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <BtnActionNew label="Nuevo" permission={['Ver']} />
            <DialogContent className="max-h-[90vh] overflow-hidden overflow-y-auto sm:max-w-[900px] lg:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Ticket</DialogTitle>
                    <DialogDescription>
                        Complete los campos requeridos para crear un nuevo ticket de soporte
                        técnico. Asegúrese de proporcionar información detallada para una mejor
                        asistencia.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    schema={TicketCreateSchema}
                    action={handleCreateTicket}
                    defaultValues={{
                        status: TicketStatus.OPEN,
                        priority: TicketPriority.LOW,
                        title: '',
                        description: '',
                    }}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    submitText={isSubmitting ? 'Creando...' : 'Crear'}
                    onCancel={() => setIsOpen(false)}
                    layout="grid"
                    className="grid-cols-1 gap-4 lg:grid-cols-4"
                    disabled={isSubmitting}
                    aria-label="Formulario de creación de ticket"
                >
                    <div className="col-span-1 space-y-4 lg:col-span-2">
                        <TextField
                            name="title"
                            label="Título del ticket"
                            placeholder="Ej: Error en módulo de facturación"
                            required
                            maxLength={100}
                            aria-describedby="title-help"
                            disabled={isSubmitting}
                        />
                        <div id="title-help" className="text-muted-foreground text-xs">
                            Proporcione un título descriptivo (5-100 caracteres)
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <SelectField
                                name="status"
                                label="Estado inicial"
                                options={statusOptions}
                                placeholder="Seleccione estado"
                                required
                                aria-describedby="status-create-help"
                                disabled={isSubmitting}
                            />

                            <SelectField
                                name="priority"
                                label="Nivel de prioridad"
                                options={priorityOptions}
                                placeholder="Seleccione prioridad"
                                required
                                aria-describedby="priority-create-help"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="text-muted-foreground space-y-1 text-xs">
                            <div id="status-create-help">
                                Estado: Generalmente se inicia como "Abierto"
                            </div>
                            <div id="priority-create-help">
                                Prioridad: Seleccione según la urgencia del problema
                            </div>
                        </div>

                        <div>
                            <RichTextField
                                name="description"
                                label="Descripción detallada"
                                placeholder="Describe el problema paso a paso, cuándo ocurre, qué intentaste hacer..."
                                imageFolder="editor-images"
                                required
                                aria-describedby="description-help"
                                disabled={isSubmitting}
                            />
                            <div
                                id="description-help"
                                className="text-muted-foreground mt-1 text-xs"
                            >
                                Incluya detalles específicos para facilitar la resolución (mínimo 10
                                caracteres)
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-2">
                        <div className="space-y-2">
                            <ImageField
                                name="image"
                                label="Imagen de soporte (opcional)"
                                preview
                                maxSize={2}
                                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                                disabled={isSubmitting}
                                aria-describedby="image-help"
                            />
                            <div id="image-help" className="text-muted-foreground text-xs">
                                Adjunte una captura de pantalla o imagen que ayude a explicar el
                                problema (máx. 2MB)
                            </div>
                            {isSubmitting && (
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                    Procesando ticket...
                                </div>
                            )}
                        </div>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
