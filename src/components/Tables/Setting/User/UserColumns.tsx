'use client';

import { useState } from 'react';

import { MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import type { CellContext, ColumnDef } from '@tanstack/react-table';

import { deleteUser } from '@/actions/Settings/Users';
import {
    BtnChangePasswordCell,
    BtnConfigCell,
    BtnDeleteCell,
    BtnEditCell,
    BtnResetPasswordCell,
    BtnViewCell,
} from '@/components/BtnActionCell/BtnActionCell';
import {
    createActionColumn,
    createSortableHeader,
} from '@/components/TanTable/ColumnFactory';
import { useTableContext } from '@/components/TanTable/TableContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserQueryWithRoles } from '@/types/settings/Users/UsersInterface';

// --- Carga Dinámica de Modales ---
const DynamicChangeUserPassModal = dynamic(
    () => import('@/components/Modal/Setting/Users/ChangeUserPasswordModal'),
    { ssr: false },
);

const DynamicAssignRoleUserModal = dynamic(
    () => import('@/components/Modal/Setting/Users/AssignRoleUserModal'),
    { ssr: false },
);

const DynamicEditUserModal = dynamic(
    () => import('@/components/Modal/Setting/Users/EditUserModalNew'),
    { ssr: false },
);

const DynamicPreviewUserModal = dynamic(
    () => import('@/components/Modal/Setting/Users/ViewUserModal'),
    { ssr: false },
);

const DynamicResetPassword = dynamic(
    () => import('@/components/Modal/Setting/Users/ResetPassword'),
    { ssr: false },
);

// --- Componente de Celda de Acción con Lógica de Estado y UI Completa ---
function UserActionCell(cellProps: CellContext<UserQueryWithRoles, any>) {
    const { row } = cellProps;
    const { refreshData } = useTableContext();
    const user = row.original;
    const [openChangePass, setOpenChangePass] = useState(false);
    const [openAssignRoles, setOpenAssignRoles] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);
    const [openPreviewUser, setOpenPreviewUser] = useState(false);
    const [openResetPassword, setOpenResetPassword] = useState(false);

    const handleDelete = async () => {
        toast.promise(deleteUser(user.id), {
            loading: 'Eliminando usuario...',
            success: () => {
                refreshData();
                return 'Usuario eliminado con éxito';
            },
            error: 'No se pudo eliminar el usuario',
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

                    <BtnViewCell
                        onAction={() => setOpenPreviewUser(true)}
                        label="Ver perfil"
                        permission={['Ver']}
                    />

                    <BtnEditCell
                        onAction={() => setOpenEditUser(true)}
                        label="Editar usuario"
                        permission={['Editar']}
                    />

                    <BtnConfigCell
                        onAction={() => setOpenAssignRoles(true)}
                        label="Asignar roles"
                        permission={['Editar']}
                    />

                    <BtnChangePasswordCell
                        onAction={() => setOpenChangePass(true)}
                        label="Cambiar contraseña"
                        permission={['Editar']}
                    />

                    <BtnResetPasswordCell
                        onAction={() => setOpenResetPassword(true)}
                        label="Resetear contraseña"
                        permission={['Editar']}
                    />

                    <BtnDeleteCell
                        itemId={user.id}
                        onDelete={handleDelete}
                        permission={['Eliminar']}
                        label="Eliminar usuario"
                        className="text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {openChangePass && (
                <DynamicChangeUserPassModal
                    id={user.id}
                    refresh={refreshData}
                    open={openChangePass}
                    onCloseAction={(isOpen) => setOpenChangePass(isOpen)}
                    successMessage="El password se ha cambiado correctamente."
                />
            )}
            {openAssignRoles && (
                <DynamicAssignRoleUserModal
                    id={user.id}
                    refreshAction={refreshData}
                    open={openAssignRoles}
                    onCloseAction={() => setOpenAssignRoles(false)}
                />
            )}
            {openEditUser && (
                <DynamicEditUserModal
                    id={user.id}
                    refreshAction={refreshData}
                    open={openEditUser}
                    onCloseAction={() => setOpenEditUser(false)}
                />
            )}
            {openPreviewUser && (
                <DynamicPreviewUserModal
                    id={user.id}
                    open={openPreviewUser}
                    onCloseAction={() => setOpenPreviewUser(false)}
                />
            )}
            {openResetPassword && (
                <DynamicResetPassword
                    userId={user.id}
                    userName={`${user.name} ${user.lastName}`}
                    userEmail={user.email}
                    onSuccess={refreshData}
                    open={openResetPassword}
                    onCloseAction={() => setOpenResetPassword(false)}
                />
            )}
        </>
    );
}

// --- Definición de Columnas ---
export const userColumns: ColumnDef<UserQueryWithRoles>[] = [
    {
        id: 'Nombre Completo',
        accessorKey: 'fullname',
        header: createSortableHeader('Nombre Completo'),
        accessorFn: (row) => `${row.name} ${row.lastName}`,
        cell: ({ row }) => {
            const fullName = `${row.original.name} ${row.original.lastName}`;
            return <div>{fullName}</div>;
        },
    },
    {
        accessorKey: 'email',
        header: createSortableHeader('Email'),
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
        header: createSortableHeader('Roles'),
        accessorFn: (row) => {
            return row.roles?.map((userRole) => userRole.role?.name).join(', ') || 'Sin roles';
        },
        cell: ({ row }) => {
            const roles = row.original.roles;
            const roleNames =
                roles?.map((userRole) => userRole.role?.name).join(', ') || 'Sin roles';
            return <div className="flex w-[150px]">{roleNames}</div>;
        },
    },
    createActionColumn(UserActionCell),
];