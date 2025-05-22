'use server';

import { headers } from 'next/headers';
import prisma from '@/dbprisma/db';
import type { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

// Tipos de acciones que se pueden auditar
export type AuditAction =
    | 'login_success'
    | 'login_failed'
    | 'logout'
    | 'create_role'
    | 'update_role'
    | 'delete_role'
    | 'update_permissions'
    | 'create_user'
    | 'update_user'
    | 'delete_user'
    | 'assign_role_user'
    | 'remove_role_user'
    | 'create_ticket'
    | 'update_ticket'
    | 'delete_ticket';

// Entidades del sistema que pueden ser auditadas
export type AuditEntity = 'User' | 'Role' | 'Permission' | 'Ticket' | 'System';

// Parámetros para el registro de auditoría
export interface AuditLogParams {
    action: AuditAction;
    entity?: AuditEntity;
    entityId?: string;
    description: string;
    metadata?: Prisma.JsonValue;
    userId?: string;
    userName?: string;
}

/**
 * Registra un evento de auditoría en la base de datos
 */
export async function logAuditEvent({
    action,
    entity,
    entityId,
    description,
    metadata,
    userId,
    userName,
}: AuditLogParams) {
    try {
        // Si no se proporcionan userId y userName, intentar obtenerlos de la sesión
        if (!userId || !userName) {
            const session = await getServerSession(authOptions);
            userId = userId || session?.user?.id;
            userName = userName || `${session?.user?.name} ${session?.user?.lastName || ''}`.trim();
        }

        // Obtener información del cliente
        const headersList = await headers();
        const ipAddress = headersList.get('x-forwarded-for') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Crear el registro de auditoría
        await prisma.auditLog.create({
            data: {
                userId,
                userName,
                action,
                entity,
                entityId,
                description,
                ipAddress,
                userAgent,
                metadata: metadata || {},
            },
        });

        console.log(`Evento de auditoría registrado: ${action} - ${description}`);
    } catch (error) {
        console.error('Error al registrar evento de auditoría:', error);
    }
}

/**
 * Obtiene los registros de auditoría con opciones de filtrado y paginación
 */
export async function getAuditLogs({
    userId,
    action,
    entity,
    entityId,
    startDate,
    endDate,
    page = 1,
    pageSize = 10,
}: {
    userId?: string;
    action?: AuditAction;
    entity?: AuditEntity;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
}) {
    try {
        // Construir el filtro
        const where: Prisma.AuditLogWhereInput = {};

        if (userId) where.userId = userId;
        if (action) where.action = action;
        if (entity) where.entity = entity;
        if (entityId) where.entityId = entityId;

        // Filtro de fecha
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = startDate;
            if (endDate) where.createdAt.lte = endDate;
        }

        // Obtener el total de registros
        const total = await prisma.auditLog.count({ where });

        // Obtener los registros paginados
        const logs = await prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            logs,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    } catch (error) {
        console.error('Error al obtener registros de auditoría:', error);
        throw new Error('No se pudieron obtener los registros de auditoría');
    }
}
