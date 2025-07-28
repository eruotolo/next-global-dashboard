'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { createUser } from '@/actions/Settings/Users';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
import { DateField, Form, ImageField, TextField, UserCreateSchema } from '@/components/Form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useUserRoleStore } from '@/store/userroleStore';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

export default function NewUserModalNew({ refreshAction }: UpdateData) {
    const [isOpen, setIsOpen] = useState(false);
    const { fetchUsers } = useUserRoleStore();

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    const handleSuccess = () => {
        toast.success('Nuevo Usuario Successful', {
            description: 'El usuario se ha creado correctamente.',
        });
        fetchUsers();
        refreshAction?.();
        setIsOpen(false);
    };

    const handleError = (error: string) => {
        toast.error('Nuevo Usuario Failed', {
            description: error || 'Error al intentar crear el usuario',
        });
    };

    const handleCreateUser = async (formData: FormData) => {
        const result = await createUser(formData);

        if (result?.error) {
            throw new Error(result.error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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

                <Form
                    schema={UserCreateSchema}
                    action={handleCreateUser}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    submitText="Crear Usuario"
                    onCancel={() => setIsOpen(false)}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <TextField
                                    name="name"
                                    label="Nombre"
                                    placeholder="Nombre"
                                    required
                                />
                                <TextField
                                    name="lastName"
                                    label="Apellido"
                                    placeholder="Apellido"
                                    required
                                />
                            </div>

                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Email"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <TextField
                                        name="phone"
                                        label="Teléfono"
                                        type="tel"
                                        placeholder="Teléfono"
                                        required
                                    />
                                </div>
                                <DateField name="birthdate" label="Fecha de Nacimiento" required />
                            </div>

                            <TextField
                                name="address"
                                label="Dirección"
                                placeholder="Dirección"
                                required
                            />

                            <TextField name="city" label="Ciudad" placeholder="Ciudad" required />

                            <TextField
                                name="password"
                                label="Contraseña"
                                type="password"
                                placeholder="Contraseña"
                                required
                            />
                        </div>

                        <div className="col-span-1">
                            <ImageField
                                name="image"
                                label="Foto de Perfil"
                                maxSize={1}
                                className="h-[220px]"
                            />
                        </div>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
