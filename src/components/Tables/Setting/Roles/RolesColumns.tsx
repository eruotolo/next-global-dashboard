'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteRole } from '@/actions/Settings/Roles';
import {
    BtnConfigCell,
    BtnDeleteCell,
    BtnEditCell,
} from '@/components/BtnActionCell/BtnActionCell';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserRoleStore } from '@/store/userroleStore';
import type { RolePermissionInterface } from '@/types/settings/Roles/RolesInterface';

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

import type { RoleInterface } from '@/types/settings/Roles/RolesInterface';

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
                        label="Editar rol"
                        permission={['Editar']}
                    />

                    <BtnConfigCell
                        onAction={() => setOpenAssignPermission(true)}
                        label="Asignar permisos"
                        permission={['Editar']}
                    />

                    <BtnDeleteCell
                        itemId={roleId}
                        onDelete={handleDelete}
                        permission={['Eliminar']}
                        label="Eliminar rol"
                        className="text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {openEditRole && (
                <DynamicEditRoleModal
                    id={roleId}
                    refreshAction={refreshAll}
                    open={openEditRole}
                    onCloseAction={handleEditRoleCloseModal}
                />
            )}
            {openAssignPermission && (
                <DynamicAssignPermissionModal
                    id={roleId}
                    refreshAction={refreshAll}
                    open={openAssignPermission}
                    onCloseAction={handleAssignPermissionCloseModal}
                />
            )}
        </>
    );
}

export const RolesColumns = (): ColumnDef<RolePermissionInterface>[] => [
    {
        id: 'Nombres',
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nombres
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
        accessorKey: 'permissions',
        header: () => (
            <div className="flex min-w-[100px] font-semibold whitespace-nowrap">Permisos</div>
        ),
        cell: ({ row }) => {
            const permissions = row.original.permissionRole || [];
            const permissionNames =
                permissions
                    .map((perm) => perm.permission?.name)
                    .filter(Boolean)
                    .join(', ') || 'Sin permisos';
            return <div className="flex w-[100px]">{permissionNames}</div>;
        },
    },
    {
        id: 'acciones',
        cell: ({ row }) => <ActionCell row={row} />,
    },
];
