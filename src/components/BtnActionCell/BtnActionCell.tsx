import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2, Key, Eye, Cog, FilePenLine } from 'lucide-react';
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

export function BtnViewCell({
    onAction,
    label,
    className,
    permission = ['Ver'],
}: BtnActionCellProps) {
    const permitted = useHasPermission(permission);
    if (!permitted) return null;

    return (
        <DropdownMenuItem
            onClick={onAction}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <Eye className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnEditCell({
    onAction,
    label,
    className,
    permission = ['Editar'],
}: BtnActionCellProps) {
    const permitted = useHasPermission(permission);

    return (
        <DropdownMenuItem
            onClick={onAction}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <FilePenLine className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnDeleteCell({
    onDelete,
    itemId,
    label,
    className,
    permission = ['Eliminar'],
}: BtnDeleteCellProps) {
    const permitted = useHasPermission(permission);

    const handleDelete = () => {
        onDelete(itemId);
    };

    return (
        <DropdownMenuItem
            onClick={handleDelete}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <Trash2 className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnChangePasswordCell({
    onAction,
    label,
    className,
    permission = ['Editar'],
}: BtnActionCellProps) {
    const permitted = useHasPermission(permission);

    return (
        <DropdownMenuItem
            onClick={onAction}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <Key className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnConfigCell({
    onAction,
    label,
    className,
    permission = ['Editar'],
}: BtnActionCellProps) {
    const permitted = useHasPermission(permission);

    return (
        <DropdownMenuItem
            onClick={onAction}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <Cog className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}
