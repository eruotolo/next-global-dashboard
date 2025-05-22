'use server';

import prisma from '@/dbprisma/db';
import type { PermissionRoleQuery } from '@/types/Permission/PermissionInterface';
import { revalidatePath } from 'next/cache';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function getPermissionRoles(id: string): Promise<PermissionRoleQuery[]> {
    if (!id) {
        throw new Error('El ID del Rol es invalido');
    }

    try {
        const permissionRole = await prisma.permissionRole.findMany({
            where: {
                roleId: id,
            },
            include: {
                permission: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return permissionRole;
    } catch (error) {
        console.error('Error al obtener los permisos:', error);
        throw new Error(
            `Fallo al obtener los permisos del rol: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function updatePermissionRoles(id: string, permissions: string[]) {
    if (!id || typeof id !== 'string') {
        throw new Error('El ID del Rol es invalido');
    }

    try {
        // Obtener información del rol
        const role = await prisma.role.findUnique({
            where: { id },
            select: { id: true, name: true },
        });

        if (!role) {
            throw new Error('El rol no existe');
        }

        // Obtener permisos actuales antes de la actualización
        const currentPermissions = await prisma.permissionRole.findMany({
            where: { roleId: id },
            include: {
                permission: {
                    select: { id: true, name: true },
                },
            },
        });

        const currentPermissionIds = currentPermissions.map((pr) => pr.permissionId);
        const currentPermissionNames = currentPermissions
            .map((pr) => pr.permission?.name)
            .filter(Boolean) as string[];

        const result = await prisma.$transaction(async (tx) => {
            await tx.permissionRole.deleteMany({
                where: { roleId: id },
            });

            console.log('Permisos antiguos eliminados para el rol:', id);

            if (permissions.length === 0) {
                return {
                    message: 'Todos los permisos fueron eliminados',
                    success: true,
                };
            }

            // verificar que los permisos existan
            const existingPermissions = await tx.permission.findMany({
                where: { id: { in: permissions } },
                select: { id: true, name: true },
            });

            const validPermissionIds = existingPermissions.map((p) => p.id);
            const validPermissionNames = existingPermissions.map((p) => p.name);
            const invalidPermissions = permissions.filter(
                (permissionId) => !validPermissionIds.includes(permissionId),
            );

            if (invalidPermissions.length > 0) {
                throw new Error(
                    `Los siguientes permisos no existen: ${invalidPermissions.join(', ')}`,
                );
            }

            // Asignar nuevos permisos
            const newPermissionRoles = permissions.map((permissionId) => ({
                roleId: id,
                permissionId,
            }));

            await tx.permissionRole.createMany({
                data: newPermissionRoles,
            });

            return {
                message: 'Permisos actualizados correctamente',
                success: true,
            };
        });

        // Registrar la actualización de permisos en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'update_permissions',
            entity: 'Role',
            entityId: id,
            description: `Permisos actualizados para el rol "${role.name}"`,
            metadata: {
                roleId: id,
                roleName: role.name,
                before: {
                    permissionIds: currentPermissionIds,
                    permissionNames: currentPermissionNames,
                },
                after: {
                    permissionIds: permissions,
                    permissionNames:
                        permissions.length > 0
                            ? (
                                  await prisma.permission.findMany({
                                      where: { id: { in: permissions } },
                                      select: { name: true },
                                  })
                              ).map((p) => p.name)
                            : [],
                },
                added: permissions.filter(
                    (p) => !(currentPermissionIds.filter(Boolean) as string[]).includes(p),
                ),
                removed: (currentPermissionIds.filter(Boolean) as string[]).filter(
                    (p) => !permissions.includes(p),
                ),
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/users');
        return result;
    } catch (error) {
        console.error('Error al actualizar los permisos:', error);
        throw new Error(
            `Fallo al actualizar los permisos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    } finally {
        await prisma.$disconnect();
    }
}
