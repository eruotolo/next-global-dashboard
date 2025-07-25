'use client';

import NewTicketsModal from '@/components/Modal/Setting/Tickets/NewTicketsModal';
import { DataTableManager } from '@/components/Table';
import { ticketTableConfig } from './ticketConfig';

export default function TicketTableNew() {
    return (
        <DataTableManager
            entityConfig={ticketTableConfig}
            title="Tickets"
            description="Crear, Editar y Eliminar"
            createModal={NewTicketsModal}
        />
    );
}
