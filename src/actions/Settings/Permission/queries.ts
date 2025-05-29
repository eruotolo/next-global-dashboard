'use server';

import prisma from '@/lib/db/db';
import type { PermissionQuery } from '@/types/Permission/PermissionInterface';

export async function getAllPermissions(): Promise<PermissionQuery[]> {
    try {
        const getAllPermission: PermissionQuery[] = await prisma.permission.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        return getAllPermission;
    } catch (error) {
        console.error('Error fetching permission:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function getPermissionById(id: string): Promise<PermissionQuery | null> {
    try {
        const getPermission = await prisma.permission.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!getPermission) {
            throw new Error(`Permiso con ID ${id} no encontrado`);
        }

        return getPermission;
    } catch (error) {
        console.error('Error al obtener el permiso:', error);
        throw new Error('No se pudo obtener el permiso.');
    } finally {
        await prisma.$disconnect();
    }
}
