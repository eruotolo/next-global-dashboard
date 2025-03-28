'use server';

import prisma from '@/dbprisma/db';
import type { RoleQuery, RolesArray } from '@/tipos/Roles/RolesInterface';

export async function getAllRoles(): Promise<RoleQuery[]> {
    try {
        const getAllRoles: RolesArray = await prisma.role.findMany({
            where: {
                name: {
                    not: 'SuperAdministrador',
                },
            },
            select: {
                id: true,
                name: true,
                state: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return getAllRoles;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
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
            throw new Error(`Rol con ID ${id} no encontrado`);
        }

        return getRole;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw new Error('No se pudo obtener el usuario.'); // Mensaje controlado
    } finally {
        await prisma.$disconnect();
    }
}
