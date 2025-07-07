import type { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import prisma from '@/dbprisma/db';

const AuthAdapter = () => {
    const updateUserSession = async (userId: string, userData: Partial<User>): Promise<User> => {
        if (!userId || !userData) {
            throw new Error('User ID and data must be provided.');
        }

        try {
            return await prisma.user.update({
                where: { id: userId },
                data: userData,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Error de base de datos: ${error.message}`);
            }
            throw new Error('Error al actualizar la sesión del usuario');
        }
    };

    const getUserById = async (userId: string): Promise<(User & { roles: string[] }) | null> => {
        if (!userId) {
            throw new Error('User ID must be provided.');
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    roles: {
                        include: {
                            role: true,
                        },
                    },
                },
            });

            if (!user) return null;

            const roles = user.roles.map((userRole) => userRole.role?.name || '').filter(Boolean);

            return {
                ...user,
                roles,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Error de base de datos: ${error.message}`);
            }
            throw new Error('Error al obtener el usuario');
        }
    };

    const getUserRoles = async (userId: string): Promise<string[]> => {
        if (!userId) {
            throw new Error('User ID must be provided.');
        }

        try {
            const userRoles = await prisma.userRole.findMany({
                where: { userId },
                include: {
                    role: true,
                },
            });

            return userRoles.map((userRole) => userRole.role?.name || '');
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Error de base de datos: ${error.message}`);
            }
            throw new Error('Error al obtener los roles del usuario');
        }
    };

    return {
        updateUserSession,
        getUserById,
        getUserRoles,
    };
};

export default AuthAdapter;
