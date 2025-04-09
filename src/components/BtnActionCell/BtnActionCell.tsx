import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2, Key, UserPen, Eye, Cog } from 'lucide-react';
import { useUserPermissionStore } from '@/store/useUserPermissionStore';

interface BtnActionCellProps {
    onAction: () => void;
    label: string;
    className?: string;
    permission?: string[];
}

interface BtnDeleteCellProps {
    onDelete: (id: string) => void;
    label: string;
    className?: string;
    permission?: string[];
    itemId: string;
}

// Hook para verificar permisos fácilmente
const useHasPermission = (permissions?: string[]) => {
    const hasPermission = useUserPermissionStore((state) => state.hasPermission);
    if (!permissions || permissions.length === 0) return true;

    // Valida si el usuario tiene al menos uno de los permisos especificados
    return permissions.some((perm) => hasPermission(perm));
};

export function BtnViewCell({ onAction, label }: BtnActionCellProps) {
    return (
        <DropdownMenuItem onClick={onAction}>
            <Eye className="mr-2 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnEditCell({ onAction, label }: BtnActionCellProps) {
    return (
        <DropdownMenuItem onClick={onAction}>
            <UserPen className="mr-2 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnChangePasswordCell({ onAction, label }: BtnActionCellProps) {
    return (
        <DropdownMenuItem onClick={onAction}>
            <Key className="mr-2 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnConfigCell({ onAction, label }: BtnActionCellProps) {
    return (
        <DropdownMenuItem onClick={onAction}>
            <Cog className="mr-2 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnDeleteCell({
    onDelete,
    itemId,
    label,
    className,
    permission = ['Eliminar'], // Permiso por defecto
}: BtnDeleteCellProps) {
    const permitted = useHasPermission(permission);
    if (!permitted) return null; // No se renderiza si no tiene el permiso 'Eliminar'

    const handleDelete = () => {
        onDelete(itemId);
    };

    return (
        <DropdownMenuItem onClick={handleDelete} className={className}>
            <Trash2 className="mr-2 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}
