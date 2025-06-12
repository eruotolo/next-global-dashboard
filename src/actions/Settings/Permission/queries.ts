'use server';

import prisma from '@/lib/db/db';
import type { PermissionQuery } from '@/types/settings/Permission/PermissionInterface';

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
            throw new Error(`Permission with ID ${id} not found`);
        }

        return getPermission;
    } catch (error) {
        console.error('Error getting permission:', error);
        throw new Error('Could not get the permission.');
    }
}
