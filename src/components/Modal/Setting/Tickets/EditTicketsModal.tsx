'use client';

import Form from 'next/form';
import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';

import type { EditModalPropsAlt } from '@/types/Generic/InterfaceGeneric';
import type { GetTicketQuery } from '@/types/Tickets/TicketInterface';
import { TicketStatus, TicketPriority } from '@prisma/client';

import { getTicketById, updateTicket } from '@/actions/Tickets';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="custom-button">
            {pending ? 'Actualizando...' : 'Actualizar'}
        </button>
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

export default function EditTicketsModal({ id, refreshAction, open, onClose }: EditModalPropsAlt) {
    const {
        register,
        reset,
        formState: { errors, isValid },
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
    const [isPending, startTransition] = useTransition();

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
                onClose(false);
                toast.success('Editado Successful', {
                    description: 'El ticket se ha editado correctamente.',
                });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="overflow-hidden sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Ticket</DialogTitle>
                    <DialogDescription>Editar ticket</DialogDescription>
                </DialogHeader>
                <Form action={handleSubmit}>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-2 mb-[15px]">
                            <div className="mb-[15px]">
                                <Input id="title" {...register('title')} type="text" disabled />
                            </div>
                            <div className="grid grid-cols-2 mb-[15px] gap-4">
                                <div className="col-span-1">
                                    <div>
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
                                                {Object.values(TicketStatus).map((statusOption) => (
                                                    <SelectItem
                                                        key={statusOption}
                                                        value={statusOption}
                                                    >
                                                        {STATUS_LABELS[statusOption]}
                                                    </SelectItem>
                                                ))}
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
                                </div>
                                <div className="col-span-1">
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
                                            {Object.values(TicketPriority).map((priorityOption) => (
                                                <SelectItem
                                                    key={priorityOption}
                                                    value={priorityOption}
                                                >
                                                    {PRIORITY_LABELS[priorityOption]}
                                                </SelectItem>
                                            ))}
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
                                <Textarea
                                    id="description"
                                    placeholder="Ingrese la descripcion"
                                    {...register('description', {
                                        required: 'La descripcion es obligatoria',
                                    })}
                                    className="h-[200px]"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-span-2 mb-[15px]">
                            <Image
                                src={imagePreview}
                                width={415}
                                height={420}
                                alt="Vista previa de la imagen"
                                className="h-[300px] w-[415px] object-cover rounded-[10px]"
                            />
                        </div>
                    </div>
                    {error && <p className="custome-form-error">{error}</p>}
                    <DialogFooter className="mt-4">
                        <SubmitButton />
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
