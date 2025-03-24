'use client';

import Form from 'next/form';
import { useState } from 'react';
import { createRole } from '@/actions/roles';
import type { UpdateData } from '@/types/generic/InterfaceGeneric';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SquarePlus } from 'lucide-react';
import { toast } from 'sonner';

export default function NewRoleModal({ refresh }: UpdateData) {
    const [error, setError] = useState('');
    const [name, setName] = useState('');

    const reset = () => {
        setName('');
        setError('');
    };

    const onSubmit = async (formData: FormData) => {
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

            refresh();
            reset();
            toast.success('Nuevo Role Successful', {
                description: 'El role se ha creado correctamente.',
            });
        } catch (error) {
            setError('Error al crear el usuario. Inténtalo de nuevo.');
            console.error(error);
            toast.error('Nuevo Role Failed', {
                description: 'Error al intentar crear el role',
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="botones">
                <SquarePlus className="mr-2 w-4 h-4" />
                Nuevo
            </DialogTrigger>
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
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <button type="submit" className="custom-button">
                                Crear
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
