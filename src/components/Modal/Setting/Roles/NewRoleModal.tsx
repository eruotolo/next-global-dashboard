'use client';

import Form from 'next/form';
import { useState } from 'react';
import { toast } from 'sonner';
import { createRole } from '@/actions/Settings/Roles';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
import BtnSubmit from '@/components/BtnSubmit/BtnSubmit';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

export default function NewRoleModal({ refreshAction }: UpdateData) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');

    const resetFormFields = () => {
        setName('');
        setError('');
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            resetFormFields();
        }
    };

    const onSubmit = async (formData: FormData) => {
        setError('');

        const name = formData.get('name');

        if (!name || typeof name !== 'string' || name.trim() === '') {
            setError('El nombre es requerido');
            return;
        }

        try {
            const response = await createRole(formData);

            if (response.error) {
                setError(response.error);
                return;
            }

            toast.success('Nuevo Role Successful', {
                description: 'El role se ha creado correctamente.',
            });
            refreshAction();
            resetFormFields();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(`Error al crear el país. Inténtalo de nuevo. (${errorMessage})`);
            toast.error('Nuevo Role Failed', {
                description: 'Error al intentar crear el role',
            });
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
                <Form action={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nombre del rol"
                            className="w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {error && <p className="custome-form-error">{error}</p>}
                    </div>
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <DialogFooter className="mt-6 items-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <BtnSubmit />
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
