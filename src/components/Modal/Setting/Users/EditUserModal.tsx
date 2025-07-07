'use client';

import { FilePenLine } from 'lucide-react';
import Form from 'next/form';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { getUserById, updateUser } from '@/actions/Settings/Users';
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
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';
import type { UserQueryWithDetails } from '@/types/settings/Users/UsersInterface';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="custom-button">
            {pending ? 'Actualizando...' : 'Actualizar'}
        </button>
    );
}

export default function EditUserModal({
    id,
    refreshAction,
    open,
    onCloseAction,
}: EditModalPropsAlt) {
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('/shadcn.jpg');
    const [userData, setUserData] = useState<UserQueryWithDetails | null>(null);
    const [, startTransition] = useTransition();

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
                } catch (error) {
                    console.log(error);
                }
            }
        }

        loadUser();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validación para archivos SVG
            if (file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml') {
                setError(
                    'No se permiten archivos SVG. Por favor, carga una imagen en formato JPG, PNG o similar.',
                );
                e.target.value = '';
                setImagePreview(userData?.image || '/shadcn.jpg');
                return;
            }

            // Validación de tamaño (4MB)
            const maxSizeInBytes = 4194304;
            if (file.size > maxSizeInBytes) {
                setError('La imagen no puede superar 4MB.');
                e.target.value = '';
                setImagePreview(userData?.image || '/shadcn.jpg');
                return;
            }

            setError('');
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
                onCloseAction(false);
                toast.success('Editado Successful', {
                    description: 'El usuario se ha editado correctamente.',
                });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="overflow-hidden sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>Editar usuario</DialogDescription>
                </DialogHeader>
                <Form action={handleSubmit}>
                    {/* Campo hidden para preservar imagen actual */}
                    {userData?.image && (
                        <input type="hidden" name="currentImage" value={userData.image} />
                    )}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="mb-[15px] flex gap-2">
                                <div className="flex w-full flex-col">
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
                                <div className="flex w-full flex-col">
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

                            <div className="mb-[15px] flex gap-2">
                                <div className="flex w-full flex-col">
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
                                <div className="flex w-full flex-col">
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
                                className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <FilePenLine className="mr-2 h-5 w-5" />
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
