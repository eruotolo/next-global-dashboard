'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { getUserById } from '@/actions/Settings/Users';
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
import { Label } from '@/components/ui/label';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';
import type { UserQueryWithDetails } from '@/types/settings/Users/UsersInterface';

export default function ViewUserModal({ id, open, onCloseAction }: EditModalPropsAlt) {
    const [imagePreview, setImagePreview] = useState('/shadcn.jpg');
    const [userData, setUserData] = useState<UserQueryWithDetails | null>(null);

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
                    console.error('Error load user:', error);
                }
            }
        }

        loadUser();
    }, [id]);

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="overflow-hidden sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Información del Usuario</DialogTitle>
                    <DialogDescription>
                        Aquí puedes ver los detalles completos del usuario, incluyendo su nombre,
                        correo electrónico y otra información relevante.
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="mb-[15px] flex gap-2">
                                <div className="flex w-full flex-col">
                                    <Label className="custom-label">Nombre</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        defaultValue={userData?.name || ''}
                                        disabled
                                    />
                                </div>
                                <div className="flex w-full flex-col">
                                    <Label className="custom-label">Apellido</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        defaultValue={userData?.lastName || ''}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={userData?.email || ''}
                                    disabled
                                />
                            </div>

                            <div className="mb-[15px] flex gap-2">
                                <div className="flex w-full flex-col">
                                    <Label className="custom-label">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        defaultValue={userData?.phone || ''}
                                        disabled
                                    />
                                </div>
                                <div className="flex w-full flex-col">
                                    <Label className="custom-label">Fecha de Nacimiento</Label>
                                    <Input
                                        id="birthdate"
                                        name="birthdate"
                                        type="date"
                                        defaultValue={
                                            userData?.birthdate
                                                ? new Date(userData.birthdate)
                                                      .toISOString()
                                                      .split('T')[0]
                                                : ''
                                        }
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Dirección</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    defaultValue={userData?.address || ''}
                                    disabled
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Ciudad</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    defaultValue={userData?.city || ''}
                                    disabled
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
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <button type="button" className="custom-button">
                                Cerrar
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
