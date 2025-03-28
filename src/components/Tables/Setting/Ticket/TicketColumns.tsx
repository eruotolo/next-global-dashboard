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
import { ArrowUpDown, MoreHorizontal, FilePenLine, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';

import { deleteTicket } from '@/actions/Tickets';

const DynamicEditTicketModal = dynamic(
    () => import('@/components/Modal/Setting/Tickets/EditTicketsModal'),
    {
        ssr: false,
    },
);

import type { SimpleTicketQuery } from '@/tipos/Tickets/TicketInterface';
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
                    <Button variant="ghost" className="p-0 w-8 h-8">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenEditTicket(true)}>
                        <FilePenLine />
                        Editar ticket
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(ticketId)}
                    >
                        <Trash2 />
                        Eliminar ticket
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {openEditTicket && (
                <DynamicEditTicketModal
                    id={ticketId}
                    refreshAction={refreshTable}
                    open={openEditTicket}
                    onClose={handleEditTicketCloseModal}
                />
            )}
        </>
    );
}

export const TicketColumns = (
    refreshTable: () => Promise<void>,
): ColumnDef<SimpleTicketQuery>[] => [
    {
        accessorKey: 'code',
        header: ({ column }) => (
            <div className="flex justify-center font-semibold whitespace-nowrap">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Código
                    <ArrowUpDown className="ml-2 w-4 h-4" />
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
        accessorKey: 'title',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Título
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const title = `${row.original.title}`;
            return <div>{title}</div>;
        },
    },
    {
        id: 'fullName',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Usuario que subió el ticket
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        accessorFn: (row) => `${row.userName} ${row.userLastName}`,
        cell: ({ row }) => {
            const fullName = `${row.original.userName} ${row.original.userLastName}`;
            return <div>{fullName}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: () => (
            <div className="flex justify-center font-semibold whitespace-nowrap min-w-[100px]">
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
                            'px-2 py-1 rounded-[30px] text-center font-medium text-[13px] w-[120px]',
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
        accessorKey: 'priority',
        header: () => (
            <div className="flex justify-center font-semibold whitespace-nowrap min-w-[100px]">
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
                            'px-2 py-1 rounded-[30px] text-center font-medium text-[13px] w-[120px]',
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
        id: 'acciones',
        cell: ({ row }) => <ActionCell row={row} refreshTable={refreshTable} />,
    },
];
