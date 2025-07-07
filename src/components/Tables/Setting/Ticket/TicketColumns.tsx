'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteTicket } from '@/actions/Settings/Tickets';
import { BtnDeleteCell, BtnEditCell } from '@/components/BtnActionCell/BtnActionCell';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DynamicEditTicketModal = dynamic(
    () => import('@/components/Modal/Setting/Tickets/EditTicketsModal'),
    {
        ssr: false,
    },
);

import type { SimpleTicketQuery } from '@/types/settings/Tickets/TicketInterface';

interface ActionCellProps {
    row: {
        original: SimpleTicketQuery;
    };
    refreshTable: () => Promise<void>;
}

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const ticketId = row.original.id;
    const [openEditTicket, setOpenEditTicket] = useState(false);

    const handleEditTicketCloseModal = () => {
        setOpenEditTicket(false);
    };

    const handleDelete = async (ticketId: string) => {
        try {
            const success = await deleteTicket(ticketId);
            if (success) {
                await refreshTable();
                toast.success('Delete successful', {
                    description: 'El ticket se ha eliminado.',
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
                        onAction={() => setOpenEditTicket(true)}
                        label="Editar ticket"
                        permission={['Editar']}
                    />
                    <BtnDeleteCell
                        itemId={ticketId}
                        onDelete={handleDelete}
                        permission={['Eliminar']}
                        label="Eliminar ticket"
                        className="text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            {openEditTicket && (
                <DynamicEditTicketModal
                    id={ticketId}
                    refreshAction={refreshTable}
                    open={openEditTicket}
                    onCloseAction={handleEditTicketCloseModal}
                />
            )}
        </>
    );
}

export const TicketColumns = (
    refreshTable: () => Promise<void>,
): ColumnDef<SimpleTicketQuery>[] => [
    {
        accessorKey: 'Código',
        header: ({ column }) => (
            <div className="flex justify-center font-semibold whitespace-nowrap">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Código
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const code = `${row.original.code}`;
            return (
                <div className="flex items-center justify-center">
                    <div>{code}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'Título',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Título
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const title = `${row.original.title}`;
            return <div>{title}</div>;
        },
    },
    {
        id: 'Nombre Completo',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Usuario que subió el ticket
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorFn: (row) => `${row.userName} ${row.userLastName}`,
        cell: ({ row }) => {
            const fullName = `${row.original.userName} ${row.original.userLastName}`;
            return <div>{fullName}</div>;
        },
    },
    {
        accessorKey: 'Estado',
        header: () => (
            <div className="flex min-w-[100px] justify-center font-semibold whitespace-nowrap">
                Estatus
            </div>
        ),
        cell: ({ row }) => {
            const estado = `${row.original.status}`;
            const getBgClass = () => {
                switch (estado) {
                    case 'OPEN':
                        return 'text-green-500 bg-green-100 border-green-400';
                    case 'IN_PROGRESS':
                        return 'text-yellow-500 bg-yellow-100 border-yellow-400';
                    case 'RESOLVED':
                        return 'text-blue-500 bg-blue-100 border-blue-400';
                    case 'CLOSED':
                        return 'text-gray-500 bg-gray-100 border-gray-400';
                    default:
                        return 'text-gray-500 bg-gray-100 border-gray-400';
                }
            };

            return (
                <div className="flex items-center justify-center">
                    <div
                        className={clsx(
                            'w-[120px] rounded-[30px] px-2 py-1 text-center text-[13px] font-medium',
                            getBgClass(),
                        )}
                    >
                        {estado}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'Prioridad',
        header: () => (
            <div className="flex min-w-[100px] justify-center font-semibold whitespace-nowrap">
                Prioridad
            </div>
        ),
        cell: ({ row }) => {
            const prioridad = `${row.original.priority}`;
            const getBgClass = () => {
                switch (prioridad) {
                    case 'LOW':
                        return 'text-green-500 bg-green-100 border-green-400';
                    case 'MEDIUM':
                        return 'text-yellow-500 bg-yellow-100 border-yellow-400';
                    case 'HIGH':
                        return 'text-orange-500 bg-orange-100 border-orange-400';
                    case 'URGENT':
                        return 'text-red-500 bg-red-100 border-red-400';
                }
            };
            return (
                <div className="flex items-center justify-center">
                    <div
                        className={clsx(
                            'w-[120px] rounded-[30px] px-2 py-1 text-center text-[13px] font-medium',
                            getBgClass(),
                        )}
                    >
                        {prioridad}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell row={row} refreshTable={refreshTable} />,
    },
];
