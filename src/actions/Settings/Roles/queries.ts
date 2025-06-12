'use server';

import prisma from '@/lib/db/db';
import type { RoleQuery, RolePermissionInterface } from '@/types/settings/Roles/RolesInterface';

export async function getAllRoles(): Promise<RolePermissionInterface[]> {
    // Cambiamos el tipo
    try {
        const getAllRoles = await prisma.role.findMany({
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
        //console.log('Datos devueltos por getAllRoles:', JSON.stringify(getAllRoles, null, 2));
        return getAllRoles;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

export async function getRoleById(id: string): Promise<RoleQuery | null> {
    try {
        const getRole = await prisma.role.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                state: true,
            },
        });

        if (!getRole) {
            throw new Error(`Role with ID ${id} not found`);
        }

        return getRole;
    } catch (error) {
        console.error('Error getting role:', error);
        throw new Error('Could not get the role.');
    }
}

export async function getRoles() {
    try {
        const roles = await prisma.role.findMany({
            where: {
                state: 1,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return roles;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw new Error('Failed to fetch roles');
    }
}
