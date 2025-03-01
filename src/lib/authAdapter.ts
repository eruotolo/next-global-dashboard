import prisma from '@/lib/db';
import { User } from '@prisma/client'; // Importa los tipos generados automáticamente por Prisma

const AuthAdapter = () => {
    // Actualiza los datos de un usuario existente
    const updateUserSession = async (userId: string, userData: Partial<User>): Promise<User> => {
        if (!userId || !userData) {
            throw new Error('User ID and data must be provided.');
        }

        try {
            // Actualiza los datos del usuario en la base de datos
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: userData,
            });

            return updatedUser; // Devuelve el usuario actualizado
        } catch (error: any) {
            throw new Error(`Error updating user session: ${error.message}`);
        }
    };

    // Recupera un usuario por ID
    const getUserById = async (userId: string): Promise<User | null> => {
        if (!userId) {
            throw new Error('User ID must be provided.');
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            return user; // Devuelve el usuario encontrado o null si no existe
        } catch (error: any) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    };

    // Obtiene todos los roles de un usuario
    const getUserRoles = async (userId: string): Promise<string[]> => {
        if (!userId) {
            throw new Error('User ID must be provided.');
        }

        try {
            const userRoles = await prisma.userRole.findMany({
                where: { userId },
                include: {
                    role: true, // Incluir información de la tabla `Role`
                },
            });

            return userRoles.map((userRole) => userRole.role?.name || '');
        } catch (error: any) {
            throw new Error(`Error fetching user roles: ${error.message}`);
        }
    };

    return {
        updateUserSession,
        getUserById,
        getUserRoles,
    };
};

export default AuthAdapter;
