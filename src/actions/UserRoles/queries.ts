'use server';

import prisma from '@/dbprisma/db';
import type { UserRoleQuery } from '@/tipos/Roles/RolesInterface';
import { revalidatePath } from 'next/cache';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
        // Obtener información del usuario
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, lastName: true, email: true },
        });

        if (!user) {
            throw new Error('El usuario no existe');
        }

        // Obtener roles actuales antes de la actualización
        const currentUserRoles = await prisma.userRole.findMany({
            where: { userId: id },
            include: {
                role: {
                    select: { id: true, name: true },
                },
            },
        });

        const currentRoleIds = currentUserRoles.map((ur) => ur.role?.id).filter(Boolean) as string[];
        const currentRoleNames = currentUserRoles.map((ur) => ur.role?.name).filter(Boolean) as string[];

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
                select: { id: true, name: true },
            });
            const validRoleIds = existingRoles.map((r) => r.id);
            const validRoleNames = existingRoles.map((r) => r.name);
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
                validRoleNames,
            };
        });

        // Registrar la asignación de roles en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: roles.length > 0 ? 'assign_role_user' : 'remove_role_user',
            entity: 'User',
            entityId: id,
            description: roles.length > 0 
                ? `Roles asignados al usuario "${user.name} ${user.lastName || ''}"`
                : `Todos los roles removidos del usuario "${user.name} ${user.lastName || ''}"`,
            metadata: {
                userId: id,
                userName: `${user.name} ${user.lastName || ''}`.trim(),
                userEmail: user.email,
                before: {
                    roleIds: currentRoleIds,
                    roleNames: currentRoleNames,
                },
                after: {
                    roleIds: roles,
                    roleNames: result.validRoleNames || [],
                },
                added: roles.filter((r) => !currentRoleIds.includes(r)),
                removed: currentRoleIds.filter((r) => !roles.includes(r)),
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
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
