'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { useUserPermissionStore } from '@/store/useUserPermissionStore';

interface BtnActionNewProps {
    label: string;
    permission?: string[];
}

// Hook para verificar permisos fácilmente
const useHasPermission = (permissions?: string[]) => {
    const hasPermission = useUserPermissionStore((state) => state.hasPermission);
    if (!permissions || permissions.length === 0) return true;

    // Verifica si el usuario tiene al menos uno de los permisos especificados
    return permissions.some((perm) => hasPermission(perm));
};

export default function BtnActionNew({ label, permission = ['Crear'] }: BtnActionNewProps) {
    const permitted = useHasPermission(permission);

    return (
        <DialogTrigger asChild>
            <Button
                className={`cursor-pointer ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!permitted}
            >
                <Plus className="mr-2 h-4 w-4" />
                {label}
            </Button>
        </DialogTrigger>
    );
}
