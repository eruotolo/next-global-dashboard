'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { createPage } from '@/actions/Settings/Pages/mutations';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
import { Form, TextField, TextAreaField } from '@/components/Form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

import { PageCreateSchema } from './pageSchemas';

export default function NewPageModal({ refreshAction }: UpdateData) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    const handleSuccess = () => {
        toast.success('Nueva Página Creada', {
            description: 'La página se ha creado correctamente.',
        });
        refreshAction();
        setIsOpen(false);
    };

    const handleError = (error: string) => {
        toast.error('Error al Crear Página', {
            description: error || 'Error al intentar crear la página',
        });
    };

    const handleCreatePage = async (formData: FormData) => {
        await createPage({
            name: formData.get('name') as string,
            path: formData.get('path') as string,
            description: formData.get('description') as string || undefined,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <BtnActionNew label="Agregar Página" permission={['Crear']} />
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Agregar Página</DialogTitle>
                    <DialogDescription>
                        Complete los detalles de la página. La ruta debe comenzar con /.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    schema={PageCreateSchema}
                    action={handleCreatePage}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    submitText="Crear Página"
                    onCancel={() => setIsOpen(false)}
                    className="space-y-4"
                >
                    <TextField
                        name="name"
                        label="Nombre"
                        placeholder="Introduce el nombre de la página"
                        required
                    />
                    
                    <TextField
                        name="path"
                        label="Ruta"
                        placeholder="Ej: /admin/dashboard"
                        required
                        description="La ruta debe comenzar con /"
                    />
                    
                    <TextAreaField
                        name="description"
                        label="Descripción"
                        placeholder="Descripción de la página (opcional)"
                        rows={3}
                    />
                </Form>
            </DialogContent>
        </Dialog>
    );
}