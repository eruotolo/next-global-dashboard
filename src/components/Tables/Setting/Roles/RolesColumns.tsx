'use client';
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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { deleteRole } from '@/actions/roles';

interface RolesColumnsProps {
    id: string;
    name: string;
    state: number;
}

interface ActionCellProps {
    row: {
        original: RolesColumnsProps;
    };
    refreshTable: () => void;
}

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const roleId = row.original.id;

    const handleDelete = async (roleId: string) => {
        try {
            const success = await deleteRole(roleId);
            if (success) {
                await refreshTable();
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
                    <DropdownMenuItem>Ver rol</DropdownMenuItem>
                    <DropdownMenuItem>Editar rol</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(roleId)}>
                        Eliminar rol
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export const RolesColumns = (refreshTable: () => void): ColumnDef<RolesColumnsProps>[] => [
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
        id: 'acciones',
        cell: ({ row }) => <ActionCell row={row} refreshTable={refreshTable} />,
    },
];
