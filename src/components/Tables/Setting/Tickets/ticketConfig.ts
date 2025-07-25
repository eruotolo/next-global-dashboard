import { getAllTickets } from '@/actions/Settings/Tickets';
import { ColumnFactory, ActionCellFactory } from '@/components/Table';
import type { EntityTableConfig } from '@/components/Table/types';
import type { SimpleTicketQuery } from '@/types/settings/Tickets/TicketInterface';
import { transformTicketData } from './ticketTransformers';

export const ticketTableConfig: EntityTableConfig<SimpleTicketQuery> = {
    entity: 'tickets',

    columns: [
        ColumnFactory.sortableText('code', 'Código', {
            minWidth: 100,
            searchable: true,
        }),

        ColumnFactory.sortableText('title', 'Título', {
            searchable: true,
        }),

        ColumnFactory.fullName(['userName', 'userLastName'], 'Usuario que subió el ticket', {
            fields: ['userName', 'userLastName'],
            separator: ' ',
        }),

        ColumnFactory.statusBadge('status', 'Estado', {
            OPEN: {
                className: 'text-green-500 bg-green-100 border-green-400',
                label: 'Abierto',
            },
            IN_PROGRESS: {
                className: 'text-yellow-500 bg-yellow-100 border-yellow-400',
                label: 'En Progreso',
            },
            RESOLVED: {
                className: 'text-blue-500 bg-blue-100 border-blue-400',
                label: 'Resuelto',
            },
            CLOSED: {
                className: 'text-gray-500 bg-gray-100 border-gray-400',
                label: 'Cerrado',
            },
        }),

        ColumnFactory.statusBadge('priority', 'Prioridad', {
            LOW: {
                className: 'text-green-500 bg-green-100 border-green-400',
                label: 'Baja',
            },
            MEDIUM: {
                className: 'text-yellow-500 bg-yellow-100 border-yellow-400',
                label: 'Media',
            },
            HIGH: {
                className: 'text-orange-500 bg-orange-100 border-orange-400',
                label: 'Alta',
            },
            URGENT: {
                className: 'text-red-500 bg-red-100 border-red-400',
                label: 'Urgente',
            },
        }),
    ],

    dataSource: {
        type: 'serverAction',
        serverAction: getAllTickets,
        transform: transformTicketData,
    },

    filterPlaceholder: 'Buscar en todos los campos...',
};

export const ticketActionsConfig = ActionCellFactory.createTicketsActionConfig();
