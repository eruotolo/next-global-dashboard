'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { getRoleById, updateRole } from '@/actions/Settings/Roles';
import { Form, TextField } from '@/components/Form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useUserRoleStore } from '@/store/userroleStore';
import type { EditModalProps } from '@/types/settings/Generic/InterfaceGeneric';

import { RoleCreateSchema } from './roleSchemas';

export default function EditRoleModal({ id, refreshAction, open, onCloseAction }: EditModalProps) {
    const [roleData, setRoleData] = useState<{ name: string } | null>(null);
    const { fetchRoles } = useUserRoleStore();

    useEffect(() => {
        async function loadRole() {
            if (id && open) {
                try {
                    const role = await getRoleById(id);
                    if (role) {
                        setRoleData({ name: role.name || '' });
                    }
                } catch (error) {
                    console.error('Error loading role:', error);
                    toast.error('Error', {
                        description: 'Error al cargar el rol',
                    });
                }
            }
        }

        loadRole();
    }, [id, open]);

    const handleSuccess = () => {
        toast.success('Rol Actualizado', {
            description: 'El rol se ha actualizado correctamente.',
        });
        fetchRoles();
        refreshAction?.();
        onCloseAction(false);
    };

    const handleError = (error: string) => {
        toast.error('Actualización Fallida', {
            description: error || 'Error al intentar actualizar el rol',
        });
    };

    const handleUpdateRole = async (formData: FormData) => {
        const result = await updateRole(id, formData);

        if (result?.error) {
            throw new Error(result.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar Rol</DialogTitle>
                    <DialogDescription>Modifica el nombre del rol existente.</DialogDescription>
                </DialogHeader>

                {roleData && (
                    <Form
                        schema={RoleCreateSchema}
                        action={handleUpdateRole}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        submitText="Actualizar Rol"
                        onCancel={() => onCloseAction(false)}
                        defaultValues={roleData}
                        className="space-y-4"
                    >
                        <TextField
                            name="name"
                            label="Nombre del rol"
                            placeholder="Introduce el nombre del rol"
                            required
                        />
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
