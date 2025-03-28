'use server';

import prisma from '@/dbprisma/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { TicketStatus, TicketPriority } from '@prisma/client';

const generateTicketCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

export async function createTicket(formData: FormData) {
    try {
        const code = generateTicketCode();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const imageFile = formData.get('image') as File | null;
        const userId = formData.get('userId') as string;
        const userName = formData.get('userName') as string;
        const userLastName = formData.get('userLastName') as string;
        const status = formData.get('status') as string;
        const priority = formData.get('priority') as string;

        let imageUrl: string | undefined;
        if (imageFile && imageFile.size > 0) {
            const fileExtension = imageFile.name.split('.').pop() || 'jpg';
            const fileName = `tickets/${code}-${Date.now()}.${fileExtension}`;
            const blob = await put(fileName, imageFile, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            imageUrl = blob.url;
        }

        const validStatuses = Object.values(TicketStatus);
        const validPriorities = Object.values(TicketPriority);

        if (!validStatuses.includes(status as TicketStatus)) {
            throw new Error(`Estado inválido: ${status}`);
        }

        if (!validPriorities.includes(priority as TicketPriority)) {
            throw new Error(`Prioridad inválida: ${priority}`);
        }

        const newTickets = await prisma.ticket.create({
            data: {
                code,
                title,
                description,
                image: imageUrl,
                userId,
                userName,
                userLastName,
                status: status as TicketStatus,
                priority: priority as TicketPriority,
            },
        });
        revalidatePath('/dashboard/tickets');
        return { newTickets, message: 'Ticket creado exitosamente' };
    } catch (error) {
        console.error('Error creating ticket:', error);
        return { error: 'Error al crear el ticket' };
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteTicket(id: string) {
    try {
        if (!id) {
            return { error: 'El ID del ticket es obligatorio' };
        }

        const ticketRemoved = await prisma.ticket.delete({
            where: { id },
        });

        revalidatePath('/dashboard/tickets');

        return { ticket: ticketRemoved, message: 'Ticket eliminado exitosamente' };
    } catch (error) {
        console.error('Error deleting role:', error);
        return { error: 'Error al eliminar el usuario' };
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateTicket(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'El ID del ticket es obligatorio' };
        }

        const status = formData.get('status') as TicketStatus;
        const priority = formData.get('priority') as TicketPriority;

        const validStatuses = Object.values(TicketStatus);
        const validPriorities = Object.values(TicketPriority);

        if (!validStatuses.includes(status)) {
            throw new Error(`Estado inválido: ${status}`);
        }

        if (!validPriorities.includes(priority)) {
            throw new Error(`Prioridad inválida: ${priority}`);
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: { status, priority },
        });

        revalidatePath('/dashboard/tickets');

        return {
            ticket: updatedTicket,
            message: 'Ticket actualizado exitosamente',
        };
    } catch (error) {
        console.error('Error updating ticket:', error);
        return { error: 'Error al actualizar el ticket' };
    } finally {
        await prisma.$disconnect();
    }
}
