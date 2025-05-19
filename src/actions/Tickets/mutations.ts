'use server';

import prisma from '@/dbprisma/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { TicketStatus, TicketPriority } from '@prisma/client';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { logAuditEvent } from '@/lib/audit/auditLogger';

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
        sendSmtpEmail.subject = 'Nuevo ticket creado';
        sendSmtpEmail.to = [{ email: 'edgardoruotolo@crowadvance.com' }];
        sendSmtpEmail.sender = { name: 'Chubby Dashboard', email: 'crowadvancegx@gmail.com' };
        sendSmtpEmail.htmlContent = `
            <h1>Se ha creado un nuevo ticket.</h1>
            <p>El número del ticket es: <strong>${code}</strong>.</p>
            <p>La prioridad del ticket es: <strong>${priority}</strong>.</p>           
        `;

        // Enviar el email
        await apiInstance.sendTransacEmail(sendSmtpEmail);

        // Registrar la creación del ticket en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'create_ticket',
            entity: 'Ticket',
            entityId: newTickets.id,
            description: `Ticket "${code}" creado`,
            metadata: {
                ticketId: newTickets.id,
                code,
                title,
                description,
                status,
                priority,
                userId,
                userName: `${userName} ${userLastName}`.trim(),
                hasImage: !!imageUrl
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/setting/tickets');
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

        // Obtener información del ticket antes de eliminarlo
        const ticketToDelete = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!ticketToDelete) {
            return { error: 'El ticket no existe' };
        }

        const ticketRemoved = await prisma.ticket.delete({
            where: { id },
        });

        // Registrar la eliminación del ticket en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'delete_ticket',
            entity: 'Ticket',
            entityId: id,
            description: `Ticket "${ticketToDelete.code}" eliminado`,
            metadata: {
                ticketId: id,
                code: ticketToDelete.code,
                title: ticketToDelete.title,
                status: ticketToDelete.status,
                priority: ticketToDelete.priority,
                userId: ticketToDelete.userId,
                userName: `${ticketToDelete.userName} ${ticketToDelete.userLastName || ''}`.trim(),
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/setting/tickets');

        return { ticket: ticketRemoved, message: 'Ticket eliminado exitosamente' };
    } catch (error) {
        console.error('Error deleting ticket:', error);
        return { error: 'Error al eliminar el ticket' };
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateTicket(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'El ID del ticket es obligatorio' };
        }

        // Obtener el ticket actual para comparar cambios
        const currentTicket = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!currentTicket) {
            return { error: 'El ticket no existe' };
        }

        // Obtener los datos del formulario
        const title = (formData.get('title') as string) || currentTicket.title;
        const description = (formData.get('description') as string) || currentTicket.description;
        const status = formData.get('status') as TicketStatus;
        const priority = formData.get('priority') as TicketPriority;
        const imageFile = formData.get('image') as File | null;

        const validStatuses = Object.values(TicketStatus);
        const validPriorities = Object.values(TicketPriority);

        if (!validStatuses.includes(status)) {
            throw new Error(`Estado inválido: ${status}`);
        }

        if (!validPriorities.includes(priority)) {
            throw new Error(`Prioridad inválida: ${priority}`);
        }

        // Preparar los datos para actualizar
        const updateData: any = {
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
            action: 'update_ticket',
            entity: 'Ticket',
            entityId: id,
            description: `Ticket "${currentTicket.code}" actualizado`,
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

        revalidatePath('/admin/setting/tickets');

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
