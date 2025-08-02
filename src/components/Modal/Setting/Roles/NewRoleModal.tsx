'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { createRole } from '@/actions/Settings/Roles';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
import { Form, TextField } from '@/components/Form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

import { RoleCreateSchema } from './roleSchemas';

export default function NewRoleModal({ refreshAction }: UpdateData) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    const handleSuccess = () => {
        toast.success('Nuevo Role Successful', {
            description: 'El role se ha creado correctamente.',
        });
        refreshAction();
        setIsOpen(false);
    };

    const handleError = (error: string) => {
        toast.error('Nuevo Role Failed', {
            description: error || 'Error al intentar crear el role',
        });
    };

    const handleCreateRole = async (formData: FormData) => {
        const result = await createRole(formData);

        if (result?.error) {
            throw new Error(result.error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <BtnActionNew label="Nuevo" permission={['Crear']} />
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Rol</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo rol que deseas crear.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    schema={RoleCreateSchema}
                    action={handleCreateRole}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    submitText="Crear Rol"
                    onCancel={() => setIsOpen(false)}
                    className="space-y-4"
                >
                    <TextField
                        name="name"
                        label="Nombre del rol"
                        placeholder="Introduce el nombre del rol"
                        required
                    />
                </Form>
            </DialogContent>
        </Dialog>
    );
}
