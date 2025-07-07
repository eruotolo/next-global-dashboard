'use server';

import prisma from '@/lib/db/db';
import type {
    UserQueryWithDetails,
    UserQueryWithRoles,
} from '@/types/settings/Users/UsersInterface';

export async function getAllUsers(): Promise<UserQueryWithRoles[]> {
    try {
        return await prisma.user.findMany({
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
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function getUserById(id: string): Promise<UserQueryWithDetails | null> {
    try {
        return await prisma.user.findUnique({
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
    } catch (error) {
        console.error('Error getting user:', error);
        throw new Error('Could not get the user.');
    }
}
