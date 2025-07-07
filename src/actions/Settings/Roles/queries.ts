'use server';

import prisma from '@/lib/db/db';
import type { RolePermissionInterface, RoleQuery } from '@/types/settings/Roles/RolesInterface';

export async function getAllRoles(): Promise<RolePermissionInterface[]> {
    // Cambiamos el tipo
    try {
        return await prisma.role.findMany({
            where: {
                name: {
                    not: 'SuperAdministrador',
                },
            },
            select: {
                id: true,
                name: true,
                state: true,
                permissionRole: {
                    select: {
                        id: true,
                        permissionId: true,
                        roleId: true,
                        permission: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

export async function getRoleById(id: string): Promise<RoleQuery | null> {
    try {
        return await prisma.role.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                state: true,
            },
        });
    } catch (error) {
        console.error('Error getting role:', error);
        throw error;
    }
}

export async function getRoles() {
    try {
        return await prisma.role.findMany({
            where: {
                state: 1,
            },
            select: {
                id: true,
                name: true,
            },
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}
