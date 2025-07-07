'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllTickets } from '@/actions/Settings/Tickets';
import NewTicketsModal from '@/components/Modal/Setting/Tickets/NewTicketsModal';
import { TicketColumns } from '@/components/Tables/Setting/Ticket/TicketColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { SimpleTicketQuery } from '@/types/settings/Tickets/TicketInterface';

export default function TicketTable() {
    const [ticketData, setTicketData] = useState<SimpleTicketQuery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllTickets();
            //console.log(data);
            const transformedData = data.map((ticket) => ({
                id: ticket.id,
                code: ticket.code,
                title: ticket.title,
                userName: ticket.userName,
                userLastName: ticket.userLastName,
                status: ticket.status,
                priority: ticket.priority,
            }));
            setTicketData(transformedData);
            setError(null);
        } catch (error) {
            console.error('Error al obtener los roles:', error);
            setError('Error al obtener los tickets');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const refreshTable = async () => {
        await fetchTickets();
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Tickets
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewTicketsModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <DataTable
                    columns={TicketColumns(refreshTable)}
                    data={ticketData}
                    loading={isLoading}
                    filterPlaceholder="Buscar en todos los campos..."
                />
            </div>
        </>
    );
}
