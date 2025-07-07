import type { TicketPriority, TicketStatus } from '@prisma/client';

export interface SimpleTicketQuery {
    id: string;
    code: string;
    title: string;
    description?: string;
    image?: string;
    userId?: string;
    userName: string;
    userLastName: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface GetTicketQuery {
    id: string;
    code: string;
    title: string;
    description: string | null;
    image: string | null;
    userId?: string;
    userName?: string;
    userLastName?: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt?: Date;
    updatedAt?: Date;
}
