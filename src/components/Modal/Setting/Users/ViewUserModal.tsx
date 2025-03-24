'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import type { EditModalProps, UserQueryWithDetails } from '@/types/Users/UsersInterface';
import { getUserById } from '@/actions/users';

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

export default function ViewUserModal({ id, open, onClose }: EditModalProps) {
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
        <Dialog open={open} onOpenChange={onClose}>
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
                            <div className="flex mb-[15px] gap-2">
                                <div className="flex flex-col w-full">
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        defaultValue={userData?.name || ''}
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col w-full">
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
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={userData?.email || ''}
                                    disabled
                                />
                            </div>

                            <div className="flex mb-[15px] gap-2">
                                <div className="flex flex-col w-full">
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        defaultValue={userData?.phone || ''}
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col w-full">
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
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    defaultValue={userData?.address || ''}
                                    disabled
                                />
                            </div>

                            <div className="mb-[15px]">
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
