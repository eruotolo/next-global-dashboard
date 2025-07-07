'use client';

import { useState } from 'react';
import { createRole } from '@/actions/Settings/Roles';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
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
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

// Importar nuestro nuevo sistema de formularios
import { FormWrapper, FormField, SubmitButton, validationSchemas } from '@/components/forms';

interface RoleFormData {
    name: string;
}

export default function NewRoleModal({ refreshAction }: UpdateData) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        // ✅ El FormWrapper maneja automáticamente el reset cuando se cierra
    };

    const handleSuccess = () => {
        // ✅ Toast automático desde FormWrapper cuando hay response.message
        refreshAction(); // Refrescar la tabla
        setIsOpen(false); // Cerrar modal
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

                {/* 🆕 FormWrapper reemplaza Form de Next.js */}
                <FormWrapper<RoleFormData>
                    defaultValues={{ name: '' }}
                    onSubmit={createRole}
                    onSuccess={handleSuccess}
                    mode="onChange" // Validación en tiempo real
                >
                    <div className="mb-[15px] grid grid-cols-1">
                        {/* 🆕 FormField con validación automática */}
                        <FormField
                            name="name"
                            label="Nombre del rol"
                            placeholder="Introduce el nombre del rol"
                            validation={validationSchemas.required('El nombre del rol es obligatorio')}
                            className="w-full"
                        />
                        {/* ✅ Los errores se muestran automáticamente bajo el campo */}
                    </div>

                    <DialogFooter className="mt-6 items-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>

                        {/* 🆕 SubmitButton con estado de loading automático */}
                        <SubmitButton>Crear</SubmitButton>
                    </DialogFooter>
                </FormWrapper>
            </DialogContent>
        </Dialog>
    );
}
