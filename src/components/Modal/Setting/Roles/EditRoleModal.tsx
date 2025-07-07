'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getRoleById, updateRole } from '@/actions/Settings/Roles';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { EditModalProps } from '@/types/settings/Generic/InterfaceGeneric';

// Importar nuestro nuevo sistema de formularios
import { FormWrapper, FormField, SubmitButton, validationSchemas } from '@/components/forms';

interface RoleFormData {
    name: string;
}

export default function EditRoleModal({ id, refreshAction, open, onCloseAction }: EditModalProps) {
    const [roleData, setRoleData] = useState<RoleFormData>({ name: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadRole() {
            if (id && open) {
                setIsLoading(true);
                try {
                    const role = await getRoleById(id);
                    if (role) {
                        setRoleData({ name: role.name || '' });
                    }
                } catch (e) {
                    console.error('Error loading role:', e);
                    toast.error('Error', {
                        description: 'Error al cargar el rol',
                    });
                }
                setIsLoading(false);
            }
        }

        loadRole();
    }, [id, open]);

    const handleSuccess = () => {
        refreshAction();
        onCloseAction(false);
        // Toast se maneja automáticamente por useServerAction
    };

    const handleError = (error: string) => {
        // Toast se maneja automáticamente por useServerAction
    };

    const handleSubmit = async (formData: FormData) => {
        return await updateRole(id, formData);
    };

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onCloseAction}>
                <DialogContent className="overflow-hidden sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Editar Rol</DialogTitle>
                        <DialogDescription>Cargando datos del rol...</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center p-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="overflow-hidden sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar Rol</DialogTitle>
                    <DialogDescription>Modifica el nombre del rol existente.</DialogDescription>
                </DialogHeader>

                <FormWrapper<RoleFormData>
                    defaultValues={roleData}
                    onSubmit={handleSubmit}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    mode="onChange"
                >
                    <div className="mb-[15px] grid grid-cols-1">
                        <FormField
                            name="name"
                            label="Nombre del rol"
                            placeholder="Introduce el nombre del rol"
                            validation={validationSchemas.required('El nombre del rol es obligatorio')}
                            className="w-full"
                        />
                    </div>

                    <DialogFooter className="mt-6 items-end">
                        <Button type="button" variant="outline" onClick={() => onCloseAction(false)}>
                            Cancelar
                        </Button>
                        <SubmitButton>Actualizar</SubmitButton>
                    </DialogFooter>
                </FormWrapper>
            </DialogContent>
        </Dialog>
    );
}
