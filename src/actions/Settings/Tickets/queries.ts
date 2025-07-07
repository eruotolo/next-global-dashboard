'use server';

import prisma from '@/lib/db/db';
import type { GetTicketQuery, SimpleTicketQuery } from '@/types/settings/Tickets/TicketInterface';

export async function getAllTickets(): Promise<SimpleTicketQuery[]> {
    try {
        const getAllTicket: SimpleTicketQuery[] = await prisma.ticket.findMany({
            select: {
                id: true,
                code: true,
                title: true,
                userName: true,
                userLastName: true,
                status: true,
                priority: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return getAllTicket;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

export async function getTicketById(id: string): Promise<GetTicketQuery | null> {
    try {
        const getTicket = await prisma.ticket.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                code: true,
                title: true,
                description: true,
                image: true,
                status: true,
                priority: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!getTicket) {
            throw new Error(`Ticket with ID ${id} not found`);
        }

        return getTicket;
    } catch (error) {
        console.error('Error getting ticket:', error);
        throw new Error('Could not get the ticket.');
    }
}
