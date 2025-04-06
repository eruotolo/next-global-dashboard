'use server';

import prisma from '@/dbprisma/db';
import type { UserRoleQuery } from '@/tipos/Roles/RolesInterface';
import { revalidatePath } from 'next/cache';

export async function getUserRoles(id: string): Promise<UserRoleQuery[]> {
    if (!id) {
        throw new Error('El ID del usuario es inválido');
    }

    try {
        const userRoles = await prisma.userRole.findMany({
            where: {
                userId: id,
            },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        state: true,
                    },
                },
            },
        });

        // No necesitamos mapear, simplemente devolvemos los datos tal como vienen
        return userRoles;
    } catch (error) {
        console.error('Error al obtener los roles del usuario:', error);
        throw new Error(
            `Fallo al obtener los roles del usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateUserRoles(id: string, roles: string[]) {
    if (!id || typeof id !== 'string') {
        throw new Error('El ID del usuario es inválido');
    }

    if (!Array.isArray(roles) || roles.some((roleId) => typeof roleId !== 'string')) {
        throw new Error('Los roles deben ser un array de IDs válidos');
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Eliminar roles existentes
            await tx.userRole.deleteMany({
                where: { userId: id },
            });

            if (roles.length === 0) {
                return {
                    message: 'Todos los roles fueron eliminados',
                    success: true,
                };
            }

            // Verificar que los roles existen
            const existingRoles = await tx.role.findMany({
                where: { id: { in: roles } },
                select: { id: true },
            });
            const validRoleIds = existingRoles.map((r) => r.id);
            const invalidRoles = roles.filter((roleId) => !validRoleIds.includes(roleId));

            if (invalidRoles.length > 0) {
                throw new Error(`Los siguientes roles no existen: ${invalidRoles.join(', ')}`);
            }

            // Asignar nuevos roles
            const newUserRoles = roles.map((roleId) => ({
                userId: id,
                roleId,
            }));

            await tx.userRole.createMany({
                data: newUserRoles,
            });

            return {
                message: 'Roles actualizados correctamente',
                success: true,
            };
        });

        revalidatePath('/admin/settings/users');
        return result;
    } catch (error) {
        console.error('Error al actualizar los roles del usuario:', error);
        throw new Error(
            `Fallo al actualizar los roles: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    } finally {
        await prisma.$disconnect();
    }
}
