'use client';

import { TicketPriority, TicketStatus } from '@prisma/client';
import Form from 'next/form';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getTicketById, updateTicket } from '@/actions/Settings/Tickets';
import TicketComments from '@/components/Modal/Setting/Tickets/TicketComments';
import RichTextDisplay from '@/components/RichTextDisplay/RichTextDisplay';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';
import type { GetTicketQuery } from '@/types/settings/Tickets/TicketInterface';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="custom-button">
            {pending ? 'Actualizando...' : 'Actualizar'}
        </Button>
    );
}

const STATUS_LABELS = {
    [TicketStatus.OPEN]: 'Abierto',
    [TicketStatus.IN_PROGRESS]: 'En Progreso',
    [TicketStatus.CLOSED]: 'Cerrado',
    [TicketStatus.RESOLVED]: 'Resuelto',
};

const PRIORITY_LABELS = {
    [TicketPriority.LOW]: 'Baja',
    [TicketPriority.MEDIUM]: 'Media',
    [TicketPriority.HIGH]: 'Alta',
    [TicketPriority.URGENT]: 'Urgente',
};

export default function EditTicketsModal({
    id,
    refreshAction,
    open,
    onCloseAction,
}: EditModalPropsAlt) {
    const {
        register,
        formState: { errors },
        setValue,
    } = useForm<GetTicketQuery>({
        mode: 'onChange',
        defaultValues: {
            status: TicketStatus.OPEN,
            priority: TicketPriority.LOW,
        },
    });

    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('/soporte.png');
    const [ticketData, setTicketData] = useState<GetTicketQuery | null>(null);
    const [, startTransition] = useTransition();

    const [status, setStatus] = useState<TicketStatus>(TicketStatus.OPEN);
    const [priority, setPriority] = useState<TicketPriority>(TicketPriority.LOW);

    useEffect(() => {
        async function loadTicket() {
            if (id) {
                try {
                    const ticket = await getTicketById(id as string);
                    console.log('ticket:', ticket);
                    if (ticket) {
                        // Establecer datos del ticket
                        setTicketData(ticket);

                        // Establecer valores en el formulario
                        setValue('title', ticket.title);
                        setValue('description', ticket.description);
                        setValue('status', ticket.status);
                        setValue('priority', ticket.priority);

                        setStatus(ticket.status);
                        setPriority(ticket.priority);

                        // Manejar preview de imagen
                        if (ticket.image) {
                            setImagePreview(ticket.image);
                        }
                    }
                } catch (e) {
                    console.error('Error al cargar el ticket:', e);
                    toast.error('No se pudo cargar el ticket');
                }
            }
        }

        loadTicket();
    }, [id, setValue]);

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await updateTicket(id as string, formData);

            if (result?.error) {
                setError(result.error);
            } else {
                refreshAction?.();
                onCloseAction(false);
                toast.success('Editado Successful', {
                    description: 'El ticket se ha editado correctamente.',
                });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Ticket #{ticketData?.code}</DialogTitle>
                    <DialogDescription>Gestión del ticket</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="edit">
                    <TabsList>
                        <TabsTrigger value="edit">Editar Tickets</TabsTrigger>
                        <TabsTrigger value="comments">Comentarios</TabsTrigger>
                    </TabsList>

                    <TabsContent value="edit">
                        <Form action={handleSubmit} className="pt-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-2 mb-[15px]">
                                    <div className="mb-[15px]">
                                        <Label className="custom-label">Titulo del ticket</Label>
                                        <Input
                                            id="title"
                                            {...register('title')}
                                            type="text"
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-[15px] grid grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <Label className="custom-label">Estado</Label>
                                            <Select
                                                value={status}
                                                onValueChange={(value: TicketStatus) => {
                                                    setStatus(value);
                                                    setValue('status', value);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccionar estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(TicketStatus).map(
                                                        (statusOption) => (
                                                            <SelectItem
                                                                key={statusOption}
                                                                value={statusOption}
                                                            >
                                                                {STATUS_LABELS[statusOption]}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            <input
                                                type="hidden"
                                                {...register('status', {
                                                    required: 'El estado es obligatorio',
                                                })}
                                            />
                                            {errors.status && (
                                                <p className="custome-form-error">
                                                    {errors.status.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            <Label className="custom-label">Prioridad</Label>
                                            <Select
                                                value={priority}
                                                onValueChange={(value: TicketPriority) => {
                                                    setPriority(value);
                                                    setValue('priority', value);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccionar prioridad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(TicketPriority).map(
                                                        (priorityOption) => (
                                                            <SelectItem
                                                                key={priorityOption}
                                                                value={priorityOption}
                                                            >
                                                                {PRIORITY_LABELS[priorityOption]}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            <input
                                                type="hidden"
                                                {...register('priority', {
                                                    required: 'La prioridad es obligatoria',
                                                })}
                                            />
                                            {errors.priority && (
                                                <p className="custome-form-error">
                                                    {errors.priority.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-[15px]">
                                        <Label className="custom-label">Descripción</Label>
                                        <RichTextDisplay content={ticketData?.description ?? ''} />
                                        <input type="hidden" {...register('description')} />
                                    </div>
                                </div>
                                <div className="col-span-2 mb-[15px]">
                                    <Image
                                        src={imagePreview}
                                        width={415}
                                        height={420}
                                        alt="Vista previa de la imagen"
                                        className="h-[300px] w-[415px] rounded-[10px] object-cover"
                                    />
                                </div>
                            </div>
                            {error && <p className="custome-form-error">{error}</p>}
                            <DialogFooter className="mt-4">
                                <SubmitButton />
                            </DialogFooter>
                        </Form>
                    </TabsContent>

                    <TabsContent value="comments">
                        <div className="pt-4">
                            <TicketComments ticketId={id as string} />
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
