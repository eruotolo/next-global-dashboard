'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { getUserById, updateUser } from '@/actions/Settings/Users';
import { DateField, Form, ImageField, TextField, UserEditSchema } from '@/components/Form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useUserRoleStore } from '@/store/userroleStore';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';
import type { UserQueryWithDetails } from '@/types/settings/Users/UsersInterface';

export default function EditUserModalNew({
    id,
    refreshAction,
    open,
    onCloseAction,
}: EditModalPropsAlt) {
    const [userData, setUserData] = useState<UserQueryWithDetails | null>(null);
    const { fetchUsers } = useUserRoleStore();

    useEffect(() => {
        async function loadUser() {
            if (id && open) {
                try {
                    const user = await getUserById(id as string);
                    if (user) {
                        setUserData(user);
                    }
                } catch (error) {
                    console.error('Error loading user:', error);
                    toast.error('Error', {
                        description: 'Error al cargar el usuario',
                    });
                }
            }
        }

        loadUser();
    }, [id, open]);

    const handleSuccess = () => {
        toast.success('Usuario Actualizado', {
            description: 'El usuario se ha actualizado correctamente.',
        });
        fetchUsers();
        refreshAction?.();
        onCloseAction(false);
    };

    const handleError = (error: string) => {
        toast.error('Actualización Fallida', {
            description: error || 'Error al intentar actualizar el usuario',
        });
    };

    const handleUpdateUser = async (formData: FormData) => {
        const result = await updateUser(id as string, formData);

        if (result?.error) {
            throw new Error(result.error);
        }
    };

    // Preparar datos iniciales para el formulario
    const defaultValues = userData
        ? {
              name: userData.name || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              birthdate: userData.birthdate ? new Date(userData.birthdate) : undefined,
              address: userData.address || '',
              city: userData.city || '',
          }
        : null;

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="overflow-hidden sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del usuario existente. Los campos son opcionales, solo se
                        actualizarán los que tengan valores.
                    </DialogDescription>
                </DialogHeader>

                {defaultValues && (
                    <Form
                        schema={UserEditSchema}
                        action={handleUpdateUser}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        submitText="Actualizar Usuario"
                        onCancel={() => onCloseAction(false)}
                        defaultValues={defaultValues}
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
                                    <TextField
                                        name="phone"
                                        label="Teléfono"
                                        type="tel"
                                        placeholder="Teléfono"
                                        required
                                    />
                                    <DateField
                                        name="birthdate"
                                        label="Fecha de Nacimiento"
                                        required
                                    />
                                </div>

                                <TextField
                                    name="address"
                                    label="Dirección"
                                    placeholder="Dirección"
                                    required
                                />

                                <TextField
                                    name="city"
                                    label="Ciudad"
                                    placeholder="Ciudad"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <ImageField
                                    name="image"
                                    label="Foto de Perfil"
                                    maxSize={4}
                                    className="h-[220px]"
                                />
                            </div>
                        </div>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
