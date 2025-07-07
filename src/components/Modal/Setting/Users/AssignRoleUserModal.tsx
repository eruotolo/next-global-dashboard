'use client';

import Form from 'next/form';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { getAllRoles } from '@/actions/Settings/Roles';
import { getUserRoles, updateUserRoles } from '@/actions/Settings/UserRoles';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';
import type { RoleQuery, UserRoleQuery } from '@/types/settings/Roles/RolesInterface';

// Componente para el botón de envío con estado
function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending || disabled} className="custom-button">
            {pending ? 'Actualizando...' : 'Actualizar'}
        </Button>
    );
}

export default function AssignRoleUserModal({
    id,
    open,
    onCloseAction,
    refreshAction,
}: EditModalPropsAlt) {
    const [roleData, setRoleData] = useState<RoleQuery[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Obtener todos los roles disponibles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await getAllRoles();
                setRoleData(data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                setError('No se pudieron cargar los roles disponibles');
            }
        };
        fetchRoles();
    }, []);

    // Obtener los roles asignados al usuario
    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const userRoles = await getUserRoles(id);
                const assignedRoleIds = userRoles
                    .filter(
                        (relation): relation is UserRoleQuery & { roleId: string } =>
                            relation.roleId !== null,
                    )
                    .map((relation) => relation.roleId);
                console.log('Assigned role IDs:', assignedRoleIds); // Debug log
                setSelectedRoles(assignedRoleIds);
            } catch (error) {
                console.error('Error fetching user roles:', error);
                setError('No se pudieron cargar los roles del usuario');
            }
        };
        if (open) {
            fetchUserRoles();
        }
    }, [open, id]);

    // Manejar cambio de selección de roles
    const handleRoleChange = (roleId: string) => {
        console.log('Role change triggered for:', roleId); // Debug log
        setSelectedRoles((prevSelectedRoles) => {
            const newSelectedRoles = prevSelectedRoles.includes(roleId)
                ? prevSelectedRoles.filter((id) => id !== roleId)
                : [...prevSelectedRoles, roleId];
            console.log('Updated selected roles:', newSelectedRoles); // Debug log
            return newSelectedRoles;
        });
    };

    // Acción del formulario con Server Action
    const handleSubmit = async (formData: FormData) => {
        try {
            const roles = formData.getAll('roles') as string[];
            console.log('Roles from FormData:', roles); // Debug log

            // Validar que roles sea un array válido
            if (!Array.isArray(roles)) {
                throw new Error('Formato de roles inválido');
            }

            const result = await updateUserRoles(id, roles);
            if (result.success) {
                refreshAction?.();
                onCloseAction(false);
                toast.success('Asignado Successful', {
                    description: 'Nuevo Rol Asignado Correctamente.',
                });
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error updating roles:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Error desconocido al actualizar los roles',
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
                        {roleData.map((role) => (
                            <div key={role.id} className="flex items-center px-4 py-1">
                                <input
                                    type="checkbox"
                                    id={`role-${role.id}`}
                                    name="roles" // Añadido para FormData
                                    value={role.id} // Añadido para enviar el valor del rol
                                    checked={selectedRoles.includes(role.id)}
                                    onChange={() => handleRoleChange(role.id)}
                                    className={`mr-2 h-4 w-4 ${
                                        selectedRoles.includes(role.id)
                                            ? 'accent-[#262626] focus:ring-offset-0'
                                            : ''
                                    }`}
                                />
                                <label
                                    htmlFor={`role-${role.id}`}
                                    className="text-gris text-[15px]"
                                >
                                    {role.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <DialogFooter>
                        <SubmitButton disabled={roleData.length === 0} />
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
