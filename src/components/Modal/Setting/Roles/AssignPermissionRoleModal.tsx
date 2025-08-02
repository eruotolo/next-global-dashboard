'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { getAllPermissions } from '@/actions/Settings/Permission';
import { getPermissionRoles, updatePermissionRoles } from '@/actions/Settings/PermissionRole';
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
import type { PermissionQuery } from '@/types/settings/Permission/PermissionInterface';

import { type AssignPermissionRoleFormValues, AssignPermissionRoleSchema } from './roleSchemas';

export default function AssignPermissionRoleModal({
    id,
    open,
    onCloseAction,
    refreshAction,
}: EditModalPropsAlt) {
    const [permissionOptions, setPermissionOptions] = useState<{ label: string; value: string }[]>(
        [],
    );
    const [defaultValues, setDefaultValues] = useState<AssignPermissionRoleFormValues | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (open) {
                try {
                    // Cargar todas las opciones de permisos
                    const permissions = await getAllPermissions();
                    const options = permissions.map((p: PermissionQuery) => ({
                        label: p.name,
                        value: p.id,
                    }));
                    setPermissionOptions(options);

                    // Cargar los permisos ya asignados para este rol
                    const assigned = await getPermissionRoles(id);
                    const assignedIds = assigned
                        .map((pr) => pr.permissionId)
                        .filter(Boolean) as string[];
                    setDefaultValues({ roleId: id, permissions: assignedIds });
                } catch (err) {
                    console.error(err);
                    toast.error('Error', {
                        description: 'No se pudieron cargar los datos de los permisos.',
                    });
                }
            }
        }
        fetchData();
    }, [open, id]);

    const handleUpdatePermissions = async (formData: FormData) => {
        const permissions = formData.getAll('permissions[]') as string[];
        const result = await updatePermissionRoles(id, permissions);
        if (!result.success) {
            throw new Error(result.message || 'Error al actualizar los permisos');
        }
    };

    const handleSuccess = () => {
        toast.success('Permisos actualizados', {
            description: 'Los permisos del rol se han actualizado correctamente.',
        });
        refreshAction?.();
        onCloseAction(false);
    };

    const handleError = (error: string) => {
        toast.error('Actualización Fallida', {
            description: error || 'Error al intentar actualizar los permisos.',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Asignar Permisos al Rol</DialogTitle>
                    <DialogDescription>
                        Selecciona los permisos que deseas asignar a este rol.
                    </DialogDescription>
                </DialogHeader>

                {defaultValues && (
                    <Form
                        schema={AssignPermissionRoleSchema}
                        action={handleUpdatePermissions}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        submitText="Guardar Cambios"
                        onCancel={() => onCloseAction(false)}
                        defaultValues={defaultValues}
                        className="space-y-6"
                    >
                        <CheckboxGroupField
                            name="permissions"
                            label="Permisos Disponibles"
                            options={permissionOptions}
                            layout="grid"
                            required
                        />
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
