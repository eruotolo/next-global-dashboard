'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, FilePenLine, Trash2, Cog } from 'lucide-react';
import { toast } from 'sonner';

import { deleteRole } from '@/actions/Roles';
import { useUserRoleStore } from '@/store/userroleStore';
import type { RolePermissionInterface } from '@/types/Roles/RolesInterface';

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

import type { RoleInterface } from '@/tipos/Roles/RolesInterface';
interface ActionCellProps {
    row: {
        original: RoleInterface;
    };
}

function ActionCell({ row }: ActionCellProps) {
    const roleId = row.original.id;
    const [openEditRole, setOpenEditRole] = useState(false);
    const [openAssignPermission, setOpenAssignPermission] = useState(false);
    const { refreshAll } = useUserRoleStore();

    const handleEditRoleCloseModal = () => {
        setOpenEditRole(false);
    };

    const handleAssignPermissionCloseModal = () => {
        setOpenAssignPermission(false);
    };

    const handleDelete = async (roleId: string) => {
        try {
            const success = await deleteRole(roleId);
            if (success) {
                await refreshAll();
                toast.success('Delete successful', {
                    description: 'El rol se ha eliminado.',
                });
            } else {
                console.error('Error: No se pudo eliminar el elemento.');
            }
        } catch (error) {
            console.error('Error al eliminar el rol:', error);
            toast.error('Delete Failed', {
                description: 'Error al intentar eliminar el rol',
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 w-8 h-8">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenEditRole(true)}>
                        <FilePenLine />
                        Editar rol
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenAssignPermission(true)}>
                        <Cog />
                        Asignar permisos
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(roleId)}>
                        <Trash2 />
                        Eliminar rol
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {openEditRole && (
                <DynamicEditRoleModal
                    id={roleId}
                    refresh={refreshAll}
                    open={openEditRole}
                    onClose={handleEditRoleCloseModal}
                />
            )}
            {openAssignPermission && (
                <DynamicAssignPermissionModal
                    id={roleId}
                    refreshAction={refreshAll}
                    open={openAssignPermission}
                    onClose={handleAssignPermissionCloseModal}
                />
            )}
        </>
    );
}

export const RolesColumns = (refreshTable: () => void): ColumnDef<RolePermissionInterface>[] => [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 w-4 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const roleName = `${row.original.name}`;
            return <div>{roleName}</div>;
        },
    },
    {
        id: 'Permisos',
        header: () => (
            <div className="flex  font-semibold whitespace-nowrap min-w-[100px]">Permisos</div>
        ),
        cell: ({ row }) => {
            const permissions = row.original.permissionRole || [];
            const permissionNames =
                permissions
                    .map((perm) => perm.permission?.name)
                    .filter(Boolean)
                    .join(', ') || 'Sin permisos';
            return <div className="w-[100px] flex">{permissionNames}</div>;
        },
    },
    {
        id: 'acciones',
        cell: ({ row }) => <ActionCell row={row} />,
    },
];
