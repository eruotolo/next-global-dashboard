'use client';

import { useUserPermissionStore } from '@/store/useUserPermissionStore';
import { DialogTrigger } from '@/components/ui/dialog';
import { SquarePlus } from 'lucide-react';

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
        <DialogTrigger
            className={`botones ${!permitted ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!permitted}
        >
            <SquarePlus className="mr-2 w-4 h-4" />
            {label}
        </DialogTrigger>
    );
}
