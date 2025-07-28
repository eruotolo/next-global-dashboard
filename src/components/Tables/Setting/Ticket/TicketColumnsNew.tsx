'use client';

import { useState } from 'react';

import { MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import type { CellContext, ColumnDef } from '@tanstack/react-table';

import { deleteTicket } from '@/actions/Settings/Tickets';
import { BtnDeleteCell, BtnEditCell } from '@/components/BtnActionCell/BtnActionCell';
import {
    createActionColumn,
    createBadgeCell,
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
import type { SimpleTicketQuery } from '@/types/settings/Tickets/TicketInterface';

// --- Carga Dinámica de Modales ---
const DynamicEditTicketModal = dynamic(
    () => import('@/components/Modal/Setting/Tickets/EditTicketsModal'),
    { ssr: false },
);

// --- Mapas de Estilo para Badges ---
const statusColorMap: Record<string, string> = {
    OPEN: 'text-green-500 bg-green-100 border-green-400',
    IN_PROGRESS: 'text-yellow-500 bg-yellow-100 border-yellow-400',
    RESOLVED: 'text-blue-500 bg-blue-100 border-blue-400',
    CLOSED: 'text-gray-500 bg-gray-100 border-gray-400',
};

const priorityColorMap: Record<string, string> = {
    LOW: 'text-green-500 bg-green-100 border-green-400',
    MEDIUM: 'text-yellow-500 bg-yellow-100 border-yellow-400',
    HIGH: 'text-orange-500 bg-orange-100 border-orange-400',
    URGENT: 'text-red-500 bg-red-100 border-red-400',
};

// --- Componente de Celda de Acción con Lógica de Estado y UI Completa ---
function TicketActionCell(cellProps: CellContext<SimpleTicketQuery, any>) {
    const { row } = cellProps;
    const { refreshData } = useTableContext();
    const ticket = row.original;
    const [openEditTicket, setOpenEditTicket] = useState(false);

    const handleDelete = async () => {
        toast.promise(deleteTicket(ticket.id), {
            loading: 'Eliminando ticket...',
            success: () => {
                refreshData();
                return 'Ticket eliminado con éxito';
            },
            error: 'No se pudo eliminar el ticket',
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
                        onAction={() => setOpenEditTicket(true)}
                        label="Editar ticket"
                        permission={['Editar']}
                    />
                    <BtnDeleteCell
                        itemId={ticket.id}
                        onDelete={handleDelete}
                        permission={['Eliminar']}
                        label="Eliminar ticket"
                        className="text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {openEditTicket && (
                <DynamicEditTicketModal
                    id={ticket.id}
                    refreshAction={refreshData}
                    open={openEditTicket}
                    onCloseAction={() => setOpenEditTicket(false)}
                />
            )}
        </>
    );
}

// --- Definición de Columnas ---
export const ticketColumnsNew: ColumnDef<SimpleTicketQuery>[] = [
    {
        accessorKey: 'code',
        header: createSortableHeader('Código'),
    },
    {
        accessorKey: 'title',
        header: createSortableHeader('Título'),
    },
    {
        id: 'fullName',
        accessorFn: (row) => `${row.userName} ${row.userLastName}`,
        header: createSortableHeader('Usuario'),
    },
    {
        accessorKey: 'status',
        header: () => <div className="text-center">Estatus</div>,
        cell: createBadgeCell('status', statusColorMap),
    },
    {
        accessorKey: 'priority',
        header: () => <div className="text-center">Prioridad</div>,
        cell: createBadgeCell('priority', priorityColorMap),
    },
    createActionColumn(TicketActionCell),
];
