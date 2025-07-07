'use client';

import Form from 'next/form';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { getAllPermissions } from '@/actions/Settings/Permission';
import { getPermissionRoles, updatePermissionRoles } from '@/actions/Settings/PermissionRole';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';
import type {
    PermissionQuery,
    PermissionRoleQuery,
} from '@/types/settings/Permission/PermissionInterface';

// Componente para el botón de envío con estado
function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending || disabled} className="custom-button">
            {pending ? 'Actualizando...' : 'Actualizar'}
        </Button>
    );
}

export default function AssignPermissionRoleModal({
    id,
    open,
    onCloseAction,
    refreshAction,
}: EditModalPropsAlt) {
    const [permissionData, setPermissionData] = useState<PermissionQuery[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fecthPermissions = async () => {
            try {
                const data = await getAllPermissions();
                setPermissionData(data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
                setError('No se pudieron cargar los permisos disponibles');
            }
        };
        fecthPermissions();
    }, []);

    useEffect(() => {
        const fetchPermissionRoles = async () => {
            try {
                const permissionRoles = await getPermissionRoles(id);
                const assignedPermissionIds = permissionRoles
                    .filter(
                        (relation): relation is PermissionRoleQuery & { permissionId: string } =>
                            relation.permissionId !== null,
                    )
                    .map((relation) => relation.permissionId);
                setSelectedPermissions(assignedPermissionIds);
            } catch (error) {
                console.error('Error fetching permission roles:', error);
                setError('No se pudieron cargar los permisos del usuario');
            }
        };
        if (open) {
            fetchPermissionRoles();
        }
    }, [open, id]);

    const handlePermissionChange = (permissionId: string) => {
        setSelectedPermissions((prevSelectedPermissions) =>
            prevSelectedPermissions.includes(permissionId)
                ? prevSelectedPermissions.filter((id) => id !== permissionId)
                : [...prevSelectedPermissions, permissionId],
        );
    };

    const handleSubmit = async (formData: FormData) => {
        try {
            const permissions = formData.getAll('permissions') as string[];

            const result = await updatePermissionRoles(id, permissions);
            console.log('Result:', result);
            if (result.success) {
                refreshAction?.();
                onCloseAction(false);
                toast.success('Asignado Successful', {
                    description: 'Nuevo Permiso Asignado Correctamente.',
                });
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error updating permissions:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Error desconocido al actualizar los permisos',
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Asignar Permisos y Roles</DialogTitle>
                    <DialogDescription>
                        Configura los permisos y roles del usuario para determinar su nivel de
                        acceso y las acciones que puede realizar en el sistema.
                    </DialogDescription>
                </DialogHeader>
                <Form action={handleSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        {permissionData.map((permission) => (
                            <div
                                key={permission.id}
                                className="flex items-center space-x-2 px-4 py-1"
                            >
                                <Checkbox
                                    id={`permission-${permission.id}`}
                                    name="permissions"
                                    value={permission.id}
                                    checked={selectedPermissions.includes(permission.id)}
                                    onCheckedChange={() => handlePermissionChange(permission.id)}
                                />

                                <Label
                                    htmlFor={`permission-${permission.id}`}
                                    className="text-gris curosor-pointer text-[15px]"
                                >
                                    {permission.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <DialogFooter>
                        <SubmitButton disabled={permissionData.length === 0} />
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
