'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { toast } from 'sonner';

import { getTicketById, updateTicket } from '@/actions/Settings/Tickets';
import { Form, SelectField } from '@/components/Form';
import TicketComments from '@/components/Modal/Setting/Tickets/TicketComments';
import RichTextDisplay from '@/components/RichTextDisplay/RichTextDisplay';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';
import type { GetTicketQuery } from '@/types/settings/Tickets/TicketInterface';

import {
    PRIORITY_LABELS,
    STATUS_LABELS,
    TicketEditSchema,
} from './ticketSchemas';

export default function EditTicketsModal({
    id,
    refreshAction,
    open,
    onCloseAction,
}: EditModalPropsAlt) {
    const [ticketData, setTicketData] = useState<GetTicketQuery | null>(null);
    const [imagePreview, setImagePreview] = useState('/soporte.png');
    const [isLoading, setIsLoading] = useState(false);

    // Opciones para los Select fields
    const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
    }));
    
    const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    useEffect(() => {
        async function loadTicket() {
            if (id) {
                setIsLoading(true);
                try {
                    const ticket = await getTicketById(id as string);
                    if (ticket) {
                        setTicketData(ticket);
                        // Manejar preview de imagen
                        if (ticket.image) {
                            setImagePreview(ticket.image);
                        }
                    }
                } catch (e) {
                    console.error('Error al cargar el ticket:', e);
                    toast.error('No se pudo cargar el ticket');
                } finally {
                    setIsLoading(false);
                }
            }
        }

        loadTicket();
    }, [id]);

    // Server Action personalizada
    const handleUpdateTicket = async (formData: FormData) => {
        return await updateTicket(id as string, formData);
    };

    const handleSuccess = () => {
        refreshAction?.();
        onCloseAction(false);
        toast.success('Editado Successful', {
            description: 'El ticket se ha editado correctamente.',
        });
    };
    
    const handleError = (error: string) => {
        toast.error('Error al editar', {
            description: error || 'Error al intentar editar el ticket',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px] lg:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>
                        Ticket #{ticketData?.code || 'Cargando...'}
                    </DialogTitle>
                    <DialogDescription>
                        Gestión del ticket - Edite los campos necesarios y guarde los cambios
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="edit">
                    <TabsList 
                        className="grid w-full grid-cols-2"
                        aria-label="Opciones de gestión del ticket"
                    >
                        <TabsTrigger 
                            value="edit"
                            aria-describedby="edit-tab-description"
                        >
                            Editar Tickets
                        </TabsTrigger>
                        <TabsTrigger 
                            value="comments"
                            aria-describedby="comments-tab-description"
                        >
                            Comentarios
                        </TabsTrigger>
                    </TabsList>
                    <div className="sr-only">
                        <div id="edit-tab-description">Editar información del ticket</div>
                        <div id="comments-tab-description">Ver y agregar comentarios al ticket</div>
                    </div>

                    <TabsContent value="edit" className="focus:outline-none">
                        {isLoading ? (
                            <div 
                                className="flex items-center justify-center py-8"
                                role="status"
                                aria-label="Cargando datos del ticket"
                            >
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <span className="sr-only">Cargando datos del ticket...</span>
                            </div>
                        ) : ticketData && (
                            <Form
                                schema={TicketEditSchema}
                                action={handleUpdateTicket}
                                defaultValues={{
                                    title: ticketData.title,
                                    description: ticketData.description || '',
                                    status: ticketData.status,
                                    priority: ticketData.priority,
                                }}
                                onSuccess={handleSuccess}
                                onError={handleError}
                                submitText="Actualizar"
                                layout="grid"
                                className="grid-cols-1 lg:grid-cols-4 gap-4 pt-4"
                                aria-label="Formulario de edición de ticket"
                            >
                                <div className="col-span-1 lg:col-span-2 space-y-4">
                                    <div>
                                        <Label 
                                            className="custom-label"
                                            htmlFor="ticket-title-display"
                                        >
                                            Título del ticket
                                        </Label>
                                        <input
                                            id="ticket-title-display"
                                            type="text"
                                            value={ticketData.title}
                                            disabled
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            aria-describedby="ticket-title-help"
                                        />
                                        <div id="ticket-title-help" className="sr-only">
                                            El título del ticket no se puede modificar
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <SelectField
                                            name="status"
                                            label="Estado"
                                            options={statusOptions}
                                            placeholder="Seleccionar estado"
                                            required
                                            aria-describedby="status-help"
                                        />
                                        
                                        <SelectField
                                            name="priority"
                                            label="Prioridad"
                                            options={priorityOptions}
                                            placeholder="Seleccionar prioridad"
                                            required
                                            aria-describedby="priority-help"
                                        />
                                    </div>
                                    <div className="sr-only">
                                        <div id="status-help">Seleccione el estado actual del ticket</div>
                                        <div id="priority-help">Seleccione la prioridad del ticket</div>
                                    </div>
                                    
                                    <div>
                                        <Label 
                                            className="custom-label"
                                            htmlFor="ticket-description"
                                        >
                                            Descripción
                                        </Label>
                                        <div 
                                            id="ticket-description"
                                            role="region"
                                            aria-label="Contenido de la descripción del ticket"
                                            className="min-h-[100px] rounded-md border border-input p-3"
                                        >
                                            <RichTextDisplay content={ticketData?.description ?? ''} />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-span-1 lg:col-span-2">
                                    <Label className="custom-label">
                                        Imagen del ticket
                                    </Label>
                                    <div className="mt-2 flex justify-center">
                                        <Image
                                            src={imagePreview}
                                            width={415}
                                            height={420}
                                            alt={`Imagen del ticket ${ticketData.code}`}
                                            className="max-w-full h-auto max-h-[300px] rounded-[10px] object-cover border border-gray-200"
                                            priority={false}
                                        />
                                    </div>
                                </div>
                            </Form>
                        )}
                    </TabsContent>

                    <TabsContent value="comments" className="focus:outline-none">
                        <div className="pt-4">
                            <TicketComments ticketId={id as string} />
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}