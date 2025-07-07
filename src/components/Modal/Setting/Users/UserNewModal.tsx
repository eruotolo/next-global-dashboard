'use client';

import { FilePenLine } from 'lucide-react';
import Form from 'next/form';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createUser } from '@/actions/Settings/Users';
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
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';
import type { UserFormData } from '@/types/settings/Users/UsersInterface';

export default function UserNewModal({ refreshAction }: UpdateData) {
    const {
        register,
        formState: { errors, isValid },
        reset,
    } = useForm<UserFormData>({ mode: 'onChange' });
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('/shadcn.jpg');

    // Manejar cambio de imagen y vista previa
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const maxSizeInBytes = 1000000; // 1MB

        if (file) {
            if (file.size > maxSizeInBytes) {
                setError('La imagen no puede superar 1MB.');
                e.target.value = '';
                setImagePreview('/shadcn.jpg');
                return;
            }
            setError('');
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // Enviar formulario con Server Action
    const onSubmit = async (formData: FormData) => {
        try {
            const response = await createUser(formData);

            if (response.error) {
                setError(response.error);
                return;
            }

            // Éxito: cerrar modal, refrescar tabla y resetear formulario
            refreshAction();
            reset();
            toast.success('Nuevo Usuario Successful', {
                description: 'El usuario se ha creado correctamente.',
            });
            setImagePreview('/shadcn.jpg');
            setError('');
        } catch (err) {
            reset();
            toast.error('Nuevo Usuario Failed', {
                description: 'Error al intentar crear el usuario',
            });
            setImagePreview('/shadcn.jpg');
            setError('Error al crear el usuario. Inténtalo de nuevo.');
            console.error(err);
        }
    };

    return (
        <Dialog>
            <BtnActionNew label="Nuevo" permission={['Crear']} />
            <DialogContent className="overflow-hidden sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                        Introduce los datos del nuevo usuario, como el nombre y correo electrónico.
                        Asegúrate de que toda la información esté correcta antes de proceder a crear
                        la cuenta.
                    </DialogDescription>
                </DialogHeader>
                <Form action={onSubmit}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-2">
                            <div className="mb-[15px] flex">
                                <div className="mr-[10px] flex w-full flex-col">
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Nombre"
                                        className="w-full"
                                        autoComplete="off"
                                        {...register('name', {
                                            required: 'El nombre es obligatorio',
                                        })}
                                    />
                                    {errors.name && (
                                        <p className="custome-form-error">{errors.name.message}</p>
                                    )}
                                </div>
                                <div className="flex w-full flex-col">
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Apellido"
                                        autoComplete="off"
                                        {...register('lastName', {
                                            required: 'El apellido es obligatorio',
                                        })}
                                    />
                                    {errors.lastName && (
                                        <p className="custome-form-error">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    {...register('email', {
                                        required: 'El email es obligatorio',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Email inválido',
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="custome-form-error">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="mb-[15px] grid grid-cols-3 gap-4">
                                <div className="col-span-2 w-full">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Teléfono"
                                        autoComplete="off"
                                        {...register('phone', {
                                            required: 'El teléfono es obligatorio',
                                        })}
                                    />
                                    {errors.phone && (
                                        <p className="custome-form-error">{errors.phone.message}</p>
                                    )}
                                </div>
                                <div className="col-span-1">
                                    <Input
                                        id="birthdate"
                                        type="date"
                                        autoComplete="off"
                                        {...register('birthdate', {
                                            required: 'La fecha de nacimiento es obligatoria',
                                        })}
                                    />
                                    {errors.birthdate && (
                                        <p className="custome-form-error">
                                            {errors.birthdate.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="address"
                                    type="text"
                                    placeholder="Dirección"
                                    autoComplete="off"
                                    {...register('address', {
                                        required: 'La dirección es obligatoria',
                                    })}
                                />
                                {errors.address && (
                                    <p className="custome-form-error">{errors.address.message}</p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="Ciudad"
                                    autoComplete="off"
                                    {...register('city', {
                                        required: 'La ciudad es obligatoria',
                                    })}
                                />
                                {errors.city && (
                                    <p className="custome-form-error">{errors.city.message}</p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Contraseña"
                                    {...register('password', {
                                        required: 'La contraseña es obligatoria',
                                        minLength: {
                                            value: 6,
                                            message: 'Mínimo 6 caracteres',
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className="custome-form-error">{errors.password.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="col-span-1 pl-[20px]">
                            <Image
                                src={imagePreview}
                                width={220}
                                height={220}
                                alt="Vista previa de la imagen"
                                className="h-[220px] w-[220px] rounded-[50%] object-cover"
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
    );
}
