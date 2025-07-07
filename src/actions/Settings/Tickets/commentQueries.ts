'use server';

import { TicketStatus } from '@prisma/client';
import prisma from '@/lib/db/db';

interface CreateCommentParams {
    ticketId: string;
    content: string;
    userId: string;
    userName: string;
    userLastName: string;
}

export async function getTicketComments(ticketId: string) {
    try {
        const comments = await prisma.ticketComment.findMany({
            where: {
                ticketId: ticketId,
            },
            orderBy: {
                createdAt: 'desc', // Cambiado a desc para mostrar los más recientes primero
            },
            select: {
                id: true,
                content: true,
                userId: true,
                userName: true,
                userLastName: true,
                createdAt: true,
            },
        });

        return { comments, error: null };
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        return { comments: [], error: 'No se pudieron obtener los comentarios.' };
    }
}

export async function createTicketComment({
    ticketId,
    content,
    userId,
    userName,
    userLastName,
}: CreateCommentParams) {
    if (!userId || !userName || !userLastName) {
        return { comment: null, error: 'Datos de usuario incompletos' };
    }

    try {
        const comment = await prisma.$transaction(async (tx) => {
            // Crear el comentario
            const newComment = await tx.ticketComment.create({
                data: {
                    content,
                    ticketId,
                    userId,
                    userName,
                    userLastName,
                },
            });

            // Actualizar el estado del ticket a IN_PROGRESS si está en OPEN
            const ticket = await tx.ticket.findUnique({
                where: { id: ticketId },
                select: { status: true },
            });

            if (ticket?.status === TicketStatus.OPEN) {
                await tx.ticket.update({
                    where: { id: ticketId },
                    data: { status: TicketStatus.IN_PROGRESS },
                });
            }

            return newComment;
        });

        return { comment, error: null };
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        return { comment: null, error: 'No se pudo crear el comentario.' };
    }
}

export async function deleteTicketComment(commentId: string) {
    try {
        await prisma.ticketComment.delete({
            where: {
                id: commentId,
            },
        });

        return { error: null };
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        return { error: 'No se pudo eliminar el comentario.' };
    }
}
