'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { getAllRoles } from '@/actions/Settings/Roles';
import { getUserRoles, updateUserRoles } from '@/actions/Settings/UserRoles';
import { Form } from '@/components/Form';
import { CheckboxGroupField } from '@/components/Form/fields/CheckboxGroupField';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';
import type { RolePermissionInterface, UserRoleQuery } from '@/types/settings/Roles/RolesInterface';

import { type AssignRoleUserFormValues, AssignRoleUserSchema } from './userSchemas';


export default function AssignRoleUserModal({
    id,
    open,
    onCloseAction,
    refreshAction,
}: EditModalPropsAlt) {
    const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);
    const [defaultValues, setDefaultValues] = useState<AssignRoleUserFormValues | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (open) {
                try {
                    // Cargar todas las opciones de roles
                    const roles = await getAllRoles();
                    const options = roles.map((r: RolePermissionInterface) => ({
                        label: r.name,
                        value: r.id,
                    }));
                    setRoleOptions(options);

                    // Cargar los roles ya asignados para este usuario
                    const userRoles = await getUserRoles(id);
                    const assignedIds = userRoles
                        .filter(
                            (relation): relation is UserRoleQuery & { roleId: string } =>
                                relation.roleId !== null,
                        )
                        .map((relation) => relation.roleId);
                    setDefaultValues({ userId: id, roles: assignedIds });
                } catch (err) {
                    console.error(err);
                    toast.error('Error', {
                        description: 'No se pudieron cargar los datos de los roles.',
                    });
                }
            }
        }
        fetchData();
    }, [open, id]);


    const handleUpdateRoles = async (formData: FormData) => {
        const roles = formData.getAll('roles[]') as string[];
        const result = await updateUserRoles(id, roles);
        if (!result.success) {
            throw new Error(result.message || 'Error al actualizar los roles');
        }
    };

    const handleSuccess = () => {
        toast.success('Roles actualizados', {
            description: 'Los roles del usuario se han actualizado correctamente.',
        });
        refreshAction?.();
        onCloseAction(false);
    };

    const handleError = (error: string) => {
        toast.error('Actualización Fallida', {
            description: error || 'Error al intentar actualizar los roles.',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Asignar Roles al Usuario</DialogTitle>
                    <DialogDescription>
                        Selecciona los roles que deseas asignar a este usuario.
                    </DialogDescription>
                </DialogHeader>

                {defaultValues && (
                    <Form
                        schema={AssignRoleUserSchema}
                        action={handleUpdateRoles}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        submitText="Guardar Cambios"
                        onCancel={() => onCloseAction(false)}
                        defaultValues={defaultValues}
                        className="space-y-6"
                    >
                        <CheckboxGroupField
                            name="roles"
                            label="Roles Disponibles"
                            options={roleOptions}
                            layout="grid"
                            required
                        />
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
