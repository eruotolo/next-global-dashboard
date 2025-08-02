'use client';

import { toast } from 'sonner';

import { updatePage } from '@/actions/Settings/Pages/mutations';
import type { Page } from '@/actions/Settings/Pages/queries';
import { Form, TextAreaField, TextField } from '@/components/Form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { PageEditSchema } from './pageSchemas';

interface EditPageModalProps {
    page: Page | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    refreshAction: () => void;
}

export default function EditPageModal({
    page,
    isOpen,
    onOpenChange,
    refreshAction,
}: EditPageModalProps) {
    const handleSuccess = () => {
        toast.success('Página Actualizada', {
            description: 'La página se ha actualizado correctamente.',
        });
        refreshAction();
        onOpenChange(false);
    };

    const handleError = (error: string) => {
        toast.error('Error al Actualizar Página', {
            description: error || 'Error al intentar actualizar la página',
        });
    };

    const handleUpdatePage = async (formData: FormData) => {
        if (!page?.id) {
            throw new Error('ID de página no encontrado');
        }

        await updatePage(page.id, {
            name: formData.get('name') as string,
            path: formData.get('path') as string,
            description: (formData.get('description') as string) || undefined,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Página</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de la página. La ruta debe comenzar con /.
                    </DialogDescription>
                </DialogHeader>

                {page && (
                    <Form
                        schema={PageEditSchema}
                        action={handleUpdatePage}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        submitText="Actualizar Página"
                        onCancel={() => onOpenChange(false)}
                        className="space-y-4"
                        defaultValues={{
                            name: page.name,
                            path: page.path,
                            description: page.description || '',
                        }}
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
                )}
            </DialogContent>
        </Dialog>
    );
}
