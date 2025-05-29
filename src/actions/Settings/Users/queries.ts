'use server';

import prisma from '@/lib/db/db';
import type { UserQueryWithRoles, UserQueryWithDetails } from '@/types/Users/UsersInterface';

export async function getAllUsers(): Promise<UserQueryWithRoles[]> {
    try {
        const getAll = await prisma.user.findMany({
            where: {
                roles: {
                    none: {
                        role: {
                            name: 'SuperAdministrador',
                        },
                    },
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                phone: true,
                state: true,
                roles: {
                    select: {
                        id: true,
                        userId: true,
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                                state: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return getAll;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function getUserById(id: string): Promise<UserQueryWithDetails | null> {
    try {
        const getUser = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                phone: true,
                birthdate: true,
                address: true,
                city: true,
                image: true,
            },
        });

        if (!getUser) {
            throw new Error(`Usuario con ID ${id} no encontrado`);
        }

        return getUser;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw new Error('No se pudo obtener el usuario.'); // Mensaje controlado
    }
}
