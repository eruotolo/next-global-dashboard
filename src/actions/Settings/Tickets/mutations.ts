'use server';

import { TicketPriority, TicketStatus } from '@prisma/client';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';

// Generar código para tickets
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
            throw new Error(`Invalid status: ${status}`);
        }

        if (!validPriorities.includes(priority as TicketPriority)) {
            throw new Error(`Invalid priority: ${priority}`);
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

        // Código de envío de email comentado para pruebas
        /*
        // Importar Brevo de manera correcta
        const brevoModule = await import('@getbrevo/brevo');

        // Crear la instancia de la API
        const apiKey = process.env.BREVO_API_KEY || '';
        const apiInstance = new brevoModule.TransactionalEmailsApi();

        // Configurar la clave API
        const apiKeyInstance = brevoModule.TransactionalEmailsApiApiKeys.apiKey;
        apiInstance.setApiKey(apiKeyInstance, apiKey);

        // Configuración de envio de email
        const sendSmtpEmail = new brevoModule.SendSmtpEmail();
        sendSmtpEmail.subject = 'New ticket created';
        sendSmtpEmail.to = [{ email: 'edgardoruotolo@crowadvance.com' }];
        sendSmtpEmail.sender = { name: 'Chubby Dashboard', email: 'crowadvancegx@gmail.com' };
        sendSmtpEmail.htmlContent = `
            <h1>A new ticket has been created.</h1>
            <p>The ticket number is: <strong>${code}</strong>.</p>
            <p>The ticket priority is: <strong>${priority}</strong>.</p>
        `;

        // Enviar el email
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        */

        // Registrar la creación del ticket en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.TICKET.CREATE,
            entity: AUDIT_ENTITIES.TICKET,
            entityId: newTickets.id,
            description: `Ticket "${title}" created`,
            metadata: {
                ticketId: newTickets.id,
                code,
                title,
                priority,
                status,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/tickets');
        return { ticket: newTickets, message: 'Ticket created successfully' };
    } catch (error) {
        console.error('Error creating ticket:', error);
        return { error: 'Error creating ticket' };
    }
}

export async function deleteTicket(id: string) {
    try {
        if (!id) {
            return { error: 'Ticket ID is required' };
        }

        const ticketToDelete = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!ticketToDelete) {
            return { error: 'Ticket does not exist' };
        }

        const ticketRemoved = await prisma.ticket.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.TICKET.DELETE,
            entity: AUDIT_ENTITIES.TICKET,
            entityId: id,
            description: `Ticket "${ticketToDelete.title}" deleted`,
            metadata: {
                ticketId: id,
                code: ticketToDelete.code,
                title: ticketToDelete.title,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/tickets');
        return { ticket: ticketRemoved, message: 'Ticket deleted successfully' };
    } catch (error) {
        console.error('Error deleting ticket:', error);
        return { error: 'Error deleting ticket' };
    }
}

export async function updateTicket(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Ticket ID is required' };
        }

        // Obtener el ticket actual para comparar cambios
        const currentTicket = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!currentTicket) {
            return { error: 'Ticket does not exist' };
        }

        // Obtener los datos del formulario
        const title = (formData.get('title') as string) || currentTicket.title;
        const description =
            (formData.get('description') as string) ?? currentTicket.description ?? '';
        const status = formData.get('status') as TicketStatus;
        const priority = formData.get('priority') as TicketPriority;
        const imageFile = formData.get('image') as File | null;

        const validStatuses = Object.values(TicketStatus);
        const validPriorities = Object.values(TicketPriority);

        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }

        if (!validPriorities.includes(priority)) {
            throw new Error(`Invalid priority: ${priority}`);
        }

        // Preparar los datos para actualizar
        const updateData: {
            title: string;
            description: string;
            status: TicketStatus;
            priority: TicketPriority;
            image?: string;
        } = {
            title,
            description,
            status,
            priority,
        };

        // Procesar la imagen si se proporciona una nueva
        if (imageFile && imageFile.size > 0) {
            const fileExtension = imageFile.name.split('.').pop() || 'jpg';
            const fileName = `tickets/${currentTicket.code}-${Date.now()}.${fileExtension}`;
            const blob = await put(fileName, imageFile, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            updateData.image = blob.url;
        }

        // Actualizar el ticket
        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: updateData,
        });

        // Registrar la actualización en el sistema de auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.TICKET.UPDATE,
            entity: AUDIT_ENTITIES.TICKET,
            entityId: id,
            description: `Ticket "${currentTicket.code}" updated`,
            metadata: {
                before: {
                    title: currentTicket.title,
                    description: currentTicket.description,
                    status: currentTicket.status,
                    priority: currentTicket.priority,
                    hasImage: !!currentTicket.image,
                },
                after: {
                    title: updatedTicket.title,
                    description: updatedTicket.description,
                    status: updatedTicket.status,
                    priority: updatedTicket.priority,
                    hasImage: !!updatedTicket.image,
                },
                changes: {
                    title:
                        title !== currentTicket.title
                            ? { from: currentTicket.title, to: title }
                            : undefined,
                    status:
                        status !== currentTicket.status
                            ? { from: currentTicket.status, to: status }
                            : undefined,
                    priority:
                        priority !== currentTicket.priority
                            ? { from: currentTicket.priority, to: priority }
                            : undefined,
                    imageUpdated: imageFile && imageFile.size > 0,
                },
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/tickets');

        return {
            ticket: updatedTicket,
            message: 'Ticket updated successfully',
        };
    } catch (error) {
        console.error('Error updating ticket:', error);
        return { error: 'Error updating ticket' };
    }
}
