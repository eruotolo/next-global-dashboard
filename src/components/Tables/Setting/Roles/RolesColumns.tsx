'use client';

import { useState } from 'react';

import { MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import type { CellContext, ColumnDef } from '@tanstack/react-table';

import { deleteRole } from '@/actions/Settings/Roles';
import {
    BtnConfigCell,
    BtnDeleteCell,
    BtnEditCell,
} from '@/components/BtnActionCell/BtnActionCell';
import { createActionColumn, createSortableHeader } from '@/components/TanTable/ColumnFactory';
import { useTableContext } from '@/components/TanTable/TableContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { RolePermissionInterface } from '@/types/settings/Roles/RolesInterface';

// --- Carga Dinámica de Modales ---
const DynamicEditRoleModal = dynamic(
    () => import('@/components/Modal/Setting/Roles/EditRoleModal'),
    {
        ssr: false,
    },
);

const DynamicAssignPermissionModal = dynamic(
    () => import('@/components/Modal/Setting/Roles/AssignPermissionRoleModal'),
    {
        ssr: false,
    },
);

// --- Componente de Celda de Acción con Lógica de Estado y UI Completa ---
function RoleActionCell(cellProps: CellContext<RolePermissionInterface, any>) {
    const { row } = cellProps;
    const { refreshData } = useTableContext();
    const role = row.original;
    const [openEditRole, setOpenEditRole] = useState(false);
    const [openAssignPermission, setOpenAssignPermission] = useState(false);

    const handleDelete = async () => {
        toast.promise(deleteRole(role.id), {
            loading: 'Eliminando role...',
            success: () => {
                refreshData();
                return 'Role eliminado con éxito';
            },
            error: 'No se pudo eliminar el role',
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <BtnEditCell
                        onAction={() => setOpenEditRole(true)}
                        label="Editar role"
                        permission={['Editar']}
                    />
                    <BtnConfigCell
                        onAction={() => setOpenAssignPermission(true)}
                        label="Asignar permisos"
                        permission={['Editar']}
                    />
                    <BtnDeleteCell
                        itemId={role.id}
                        onDelete={handleDelete}
                        permission={['Eliminar']}
                        label="Eliminar role"
                        className="text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {openEditRole && (
                <DynamicEditRoleModal
                    id={role.id}
                    refreshAction={refreshData}
                    open={openEditRole}
                    onCloseAction={() => setOpenEditRole(false)}
                />
            )}
            {openAssignPermission && (
                <DynamicAssignPermissionModal
                    id={role.id}
                    refreshAction={refreshData}
                    open={openAssignPermission}
                    onCloseAction={() => setOpenAssignPermission(false)}
                />
            )}
        </>
    );
}

// --- Definición de Columnas ---
export const RolesColumns: ColumnDef<RolePermissionInterface>[] = [
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: createSortableHeader('Nombre'),
    },
    {
        id: 'Permisos',
        accessorKey: 'permissionRole',
        header: createSortableHeader('Permisos'),
        cell: ({ row }) => {
            const permissions = row.original.permissionRole || [];
            const permissionNames = permissions
                .map((perm) => perm.permission?.name)
                .filter(Boolean)
                .join(', ');

            return (
                <div className="max-w-xs truncate" title={permissionNames || 'Sin permisos'}>
                    {permissionNames || 'Sin permisos'}
                </div>
            );
        },
    },
    createActionColumn(RoleActionCell),
];
