'use server';

import prisma from '@/lib/db/db';
import type { PermissionQuery } from '@/types/settings/Permission/PermissionInterface';

export async function getAllPermissions(): Promise<PermissionQuery[]> {
    try {
        return await prisma.permission.findMany({
            select: {
                id: true,
                name: true,
            },
        });
    } catch (error) {
        console.error('Error fetching permission:', error);
        throw error;
    }
}

export async function getPermissionById(id: string): Promise<PermissionQuery | null> {
    try {
        return await prisma.permission.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
            },
        });
    } catch (error) {
        console.error('Error getting permission:', error);
        throw error;
    }
}
