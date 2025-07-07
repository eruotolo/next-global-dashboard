'use client';

import { TicketPriority, TicketStatus } from '@prisma/client';
import { FilePenLine } from 'lucide-react';
import Form from 'next/form';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createTicket } from '@/actions/Settings/Tickets';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/rich-text-editor';
//import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useAuthStore from '@/store/authStore';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';
import type { SimpleTicketQuery } from '@/types/settings/Tickets/TicketInterface';

export default function NewTicketsModal({ refreshAction }: UpdateData) {
    const {
        register,
        reset,
        formState: { errors, isValid },
        setValue,
    } = useForm<SimpleTicketQuery>({
        mode: 'onChange',
        defaultValues: {
            status: TicketStatus.OPEN,
            priority: TicketPriority.LOW,
        },
    });

    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('/soporte.png');
    const session = useAuthStore((state) => state.session);
    const [description, setDescription] = useState('');

    // Manejar cambio de imagen y vista previa
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const maxSizeInBytes = 2000000; // 2MB

        if (file) {
            if (file.size > maxSizeInBytes) {
                setError('La imagen no puede superar 1MB.');
                e.target.value = '';
                setImagePreview('/soporte.png');
                return;
            }
            setError('');
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const onSubmit = async (formData: FormData) => {
        formData.append('userId', session?.user?.id || '');
        formData.append('userName', session?.user?.name || '');
        formData.append('userLastName', session?.user?.lastName || '');
        formData.append('description', description);

        try {
            const response = await createTicket(formData);

            if (response.error) {
                setError(response.error);
                return;
            }

            // Éxito: cerrar modal, refrescar tabla y resetear formulario
            refreshAction();
            reset();
            toast.success('Nuevo Ticket Successful', {
                description: 'El ticket se ha creado correctamente.',
            });
            setImagePreview('/soporte.png');
            setDescription('');
            setError('');
        } catch (error) {
            reset();
            toast.error('Nuevo Ticket Failed', {
                description: 'Error al intentar crear el ticket',
            });
            setImagePreview('/soporte.png');
            setError('Error al crear el ticket. Inténtalo de nuevo.');
            console.error(error);
        }
    };

    return (
        <>
            <Dialog>
                <BtnActionNew label="Nuevo" permission={['Ver']} />
                <DialogContent className="overflow-hidden sm:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Tickets</DialogTitle>
                        <DialogDescription>
                            Introduce los detalles del nuevo ticket de soporte técnico, como el
                            título y la descripción del problema. Asegúrate de que toda la
                            información esté correcta antes de proceder a crear el ticket.
                        </DialogDescription>
                    </DialogHeader>
                    <Form action={onSubmit}>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2 mb-[15px]">
                                <div className="mb-[15px]">
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Ingrese el titulo"
                                        {...register('title', {
                                            required: 'El titulo es obligatorio',
                                        })}
                                    />
                                    {errors.title && (
                                        <p className="custome-form-error">{errors.title.message}</p>
                                    )}
                                </div>
                                <div className="mb-[15px] grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <div>
                                            <Select
                                                onValueChange={(value) =>
                                                    setValue('status', value as TicketStatus)
                                                }
                                                {...register('status')}
                                                defaultValue=""
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={TicketStatus.OPEN}>
                                                        Abierto
                                                    </SelectItem>
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
                                            onValueChange={(value) =>
                                                setValue('priority', value as TicketPriority)
                                            }
                                            defaultValue=""
                                            {...register('priority')}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccione prioridad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={TicketPriority.LOW}>
                                                    Baja
                                                </SelectItem>
                                                <SelectItem value={TicketPriority.MEDIUM}>
                                                    Media
                                                </SelectItem>
                                                <SelectItem value={TicketPriority.HIGH}>
                                                    Alta
                                                </SelectItem>
                                                <SelectItem value={TicketPriority.URGENT}>
                                                    Urgente
                                                </SelectItem>
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
                                    <RichTextEditor
                                        content={description}
                                        onChangeAction={(content) => {
                                            setDescription(content);
                                            setValue('description', content, {
                                                shouldValidate: true,
                                            });
                                        }}
                                        imageFolder="editor-images"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 mb-[15px]">
                                <Image
                                    src={imagePreview}
                                    width={415}
                                    height={220}
                                    alt="Vista previa de la imagen"
                                    className="h-[230px] w-[415px] object-cover"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    <FilePenLine className="mr-2 h-5 w-5" />
                                    Cambiar foto de perfil
                                </label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    {...register('image')}
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <DialogFooter className="mt-6">
                            <DialogClose asChild>
                                <button type="submit" className="custom-button" disabled={!isValid}>
                                    Crear
                                </button>
                            </DialogClose>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
