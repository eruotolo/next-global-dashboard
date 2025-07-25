import type { SimpleTicketQuery } from '@/types/settings/Tickets/TicketInterface';

export const transformTicketData = (data: any[]): SimpleTicketQuery[] => {
    return data.map((ticket) => ({
        id: ticket.id,
        code: ticket.code,
        title: ticket.title,
        userName: ticket.userName,
        userLastName: ticket.userLastName,
        status: ticket.status,
        priority: ticket.priority,
    }));
};
