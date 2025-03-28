'use client';

import Form from 'next/form';
import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { FilePenLine } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import type { UserQueryWithDetails } from '@/tipos/Users/UsersInterface';
import type { EditModalPropsAlt } from '@/tipos/Generic/InterfaceGeneric';

import { getUserById, updateUser } from '@/actions/Users';

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
import { Label } from '@/components/ui/label';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="custom-button">
            {pending ? 'Actualizando...' : 'Actualizar'}
        </button>
    );
}

export default function EditUserModal({ id, refreshAction, open, onClose }: EditModalPropsAlt) {
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('/shadcn.jpg');
    const [userData, setUserData] = useState<UserQueryWithDetails | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function loadUser() {
            if (id) {
                try {
                    const user = await getUserById(id as string);
                    if (user) {
                        setUserData(user);
                        if (user.image) {
                            setImagePreview(user.image);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
        loadUser();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await updateUser(id as string, formData);

            if (result?.error) {
                setError(result.error);
            } else {
                refreshAction?.();
                onClose(false);
                toast.success('Editado Successful', {
                    description: 'El usuario se ha editado correctamente.',
                });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="overflow-hidden sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>Editar usuario</DialogDescription>
                </DialogHeader>
                <Form action={handleSubmit}>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="flex mb-[15px] gap-2">
                                <div className="flex flex-col w-full">
                                    <Label className="custom-label">Nombre</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="off"
                                        defaultValue={userData?.name || ''}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <Label className="custom-label">Apellido</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Apellido"
                                        autoComplete="off"
                                        defaultValue={userData?.lastName || ''}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    defaultValue={userData?.email || ''}
                                    required
                                />
                            </div>

                            <div className="flex mb-[15px] gap-2">
                                <div className="flex flex-col w-full">
                                    <Label className="custom-label">Correo Electrónico</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        placeholder="Teléfono"
                                        autoComplete="off"
                                        defaultValue={userData?.phone || ''}
                                        required
                                        pattern="[0-9]{7,15}"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <Label className="custom-label">Fecha de Nacimiento</Label>
                                    <Input
                                        id="birthdate"
                                        name="birthdate"
                                        type="date"
                                        placeholder="Fecha de nacimiento"
                                        autoComplete="off"
                                        defaultValue={
                                            userData?.birthdate
                                                ? new Date(userData.birthdate)
                                                      .toISOString()
                                                      .split('T')[0]
                                                : ''
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Dirección</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Dirección"
                                    autoComplete="off"
                                    defaultValue={userData?.address || ''}
                                    required
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Ciudad</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="Ciudad"
                                    autoComplete="off"
                                    defaultValue={userData?.city || ''}
                                    required
                                />
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
                                className="flex justify-center items-center py-2 px-4 w-full font-medium text-white bg-gray-600 rounded-md cursor-pointer hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none mt-[34px] text-[13px]"
                            >
                                <FilePenLine className="mr-2 w-5 h-5" />
                                Cambiar foto de perfil
                            </label>
                            <Input
                                id="file-upload"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
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
