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
import type { UserInterface } from '@/tipos/Users/UsersInterface';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Trash2, Key, UserPen, Eye, UserCog } from 'lucide-react';
import { toast } from 'sonner';

import { deleteUser } from '@/actions/Users';

const DynamicChangeUserPassModal = dynamic(
    () => import('@/components/Modal/Setting/Users/ChangeUserPasswordModal'),
    { ssr: false },
);

const DynamicAssignRoleUserModal = dynamic(
    () => import('@/components/Modal/Setting/Users/AssignRoleUserModal'),
    { ssr: false },
);

const DynamicEditUserModal = dynamic(
    () => import('@/components/Modal/Setting/Users/EditUserModal'),
    { ssr: false },
);

const DynamicPreviewUserModal = dynamic(
    () => import('@/components/Modal/Setting/Users/ViewUserModal'),
    { ssr: false },
);

interface ActionCellProps {
    row: {
        original: UserInterface;
    };
    refreshTable: () => Promise<void>;
}

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const userId = row.original.id;
    const [openChangePass, setOpenChangePass] = useState(false);
    const [openAssignRoles, setOpenAssignRoles] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);
    const [openPreviewUser, setOpenPreviewUser] = useState(false);

    const handleChangePassCloseModal = (isOpen: boolean) => {
        setOpenChangePass(isOpen);
    };

    const handleAssignRolesCloseModal = () => {
        setOpenAssignRoles(false);
    };

    const handleEditUserCloseModal = () => {
        setOpenEditUser(false);
    };

    const handlePreviewUserCloseModal = () => {
        setOpenPreviewUser(false);
    };

    const handleDelete = async (userId: string) => {
        try {
            const success = await deleteUser(userId);
            if (success) {
                await refreshTable();
                toast.success('Delete successful', {
                    description: 'El usuario se ha eliminado.',
                });
            } else {
                console.error('Error: No se pudo eliminar el elemento.');
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            toast.error('Delete Failed', {
                description: 'Error al intentar eliminar el usuario',
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
                    <DropdownMenuItem onClick={() => setOpenPreviewUser(true)}>
                        <Eye />
                        Ver perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenEditUser(true)}>
                        <UserPen />
                        Editar usuario
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenChangePass(true)}>
                        <Key />
                        Cambiar Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenAssignRoles(true)}>
                        <UserCog />
                        Asignar Roles
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(userId)}>
                        <Trash2 />
                        Eliminar usuario
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {openChangePass && (
                <DynamicChangeUserPassModal
                    id={userId}
                    refresh={refreshTable}
                    open={openChangePass}
                    onClose={handleChangePassCloseModal}
                    successMessage="El password se ha cambiado correctamente."
                />
            )}
            {openAssignRoles && (
                <DynamicAssignRoleUserModal
                    id={userId}
                    refreshAction={refreshTable}
                    open={openAssignRoles}
                    onClose={handleAssignRolesCloseModal}
                />
            )}
            {openEditUser && (
                <DynamicEditUserModal
                    id={userId}
                    refreshAction={refreshTable}
                    open={openEditUser}
                    onClose={handleEditUserCloseModal}
                />
            )}
            {openPreviewUser && (
                <DynamicPreviewUserModal
                    id={userId}
                    open={openPreviewUser}
                    onClose={handlePreviewUserCloseModal}
                />
            )}
        </>
    );
}

export const UserColumns = (
    refreshTable: () => Promise<void>,
): ColumnDef<UserInterface, unknown>[] => [
    {
        id: 'fullName',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Nombre Completo
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        accessorFn: (row) => `${row.name} ${row.lastName}`,
        cell: ({ row }) => {
            const fullName = `${row.original.name} ${row.original.lastName}`;
            return <div>{fullName}</div>;
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Email
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const email = row.getValue('email') as string;
            return (
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                    {email}
                </a>
            );
        },
    },
    {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => {
            const phone = row.getValue('phone') as string;
            const formatPhone = (phone: string) => {
                return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
            };
            return (
                <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
                    {formatPhone(phone)}
                </a>
            );
        },
    },
    {
        id: 'roles',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Roles
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        accessorFn: (row) => {
            return row.roles?.map((userRole) => userRole.role?.name).join(', ') || 'Sin roles';
        },
        cell: ({ row }) => {
            const roles = row.original.roles;
            const roleNames =
                roles?.map((userRole) => userRole.role?.name).join(', ') || 'Sin roles';
            return <div className="w-[150px] flex">{roleNames}</div>;
        },
    },
    {
        id: 'acciones',
        cell: ({ row }) => <ActionCell row={row} refreshTable={refreshTable} />,
    },
];
