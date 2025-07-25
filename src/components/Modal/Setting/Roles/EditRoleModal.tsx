'use client';

import Form from 'next/form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EditModalProps } from '@/types/settings/Generic/InterfaceGeneric';

export default function EditRoleModal({ id, refreshAction, open, onCloseAction }: EditModalProps) {
    const [error, setError] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        async function loadRole() {
            if (id && open) {
                try {
                    const role = await getRoleById(id);
                    if (role) {
                        setName(role.name || '');
                    }
                } catch (e) {
                    console.error('Error loading role:', e);
                    setError('Error al cargar el rol');
                }
            }
        }

        loadRole();
    }, [id, open]);

    const onSubmit = async (formData: FormData) => {
        const name = formData.get('name');

        if (!name || typeof name !== 'string' || name.trim() === '') {
            setError('El nombre es requerido');
            return;
        }

        try {
            const response = await updateRole(id, formData);
            if (response?.error) {
                setError(response.error);
                return;
            }
            refreshAction();
            onCloseAction(false);
            toast.success('Rol Actualizado', {
                description: 'El rol se ha actualizado correctamente.',
            });
        } catch (error) {
            setError('Error al actualizar el rol. Inténtalo de nuevo.');
            console.error(error);
            toast.error('Actualización Fallida', {
                description: 'Error al intentar actualizar el rol',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="overflow-hidden sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar Rol</DialogTitle>
                    <DialogDescription>Modifica el nombre del rol existente.</DialogDescription>
                </DialogHeader>
                <Form action={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Label className="custom-label">Nombre del Rol</Label>
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
                    <DialogFooter className="mt-6 items-end">
                        <Button type="submit" className="custom-button">
                            Actualizar
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
