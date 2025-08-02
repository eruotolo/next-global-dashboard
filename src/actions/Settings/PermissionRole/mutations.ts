'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';
import { AssignPermissionRoleSchema } from '@/components/Modal/Setting/Roles/roleSchemas';

export async function assignPermissionsToRole(formData: FormData) {
    try {
        // Extraer datos del formData
        const roleId = formData.get('roleId') as string;
        const permissions = formData.getAll('permissions') as string[];

        // Validar datos con Zod
        const validatedData = AssignPermissionRoleSchema.parse({
            roleId,
            permissions,
        });

        // Verificar que el rol existe
        const role = await prisma.role.findUnique({
            where: { id: validatedData.roleId },
            select: { id: true, name: true },
        });

        if (!role) {
            return { error: 'El rol especificado no existe' };
        }

        // Obtener permisos actuales para auditoría
        const currentPermissions = await prisma.permissionRole.findMany({
            where: { roleId: validatedData.roleId },
            include: {
                permission: {
                    select: { id: true, name: true },
                },
            },
        });

        const currentPermissionIds = currentPermissions
            .map((pr) => pr.permissionId)
            .filter(Boolean) as string[];
        const currentPermissionNames = currentPermissions
            .map((pr) => pr.permission?.name)
            .filter(Boolean) as string[];

        // Ejecutar transacción para actualizar permisos
        const result = await prisma.$transaction(async (tx) => {
            // Eliminar todos los permisos actuales del rol
            await tx.permissionRole.deleteMany({
                where: { roleId: validatedData.roleId },
            });

            // Si no hay permisos seleccionados, solo eliminar los existentes
            if (validatedData.permissions.length === 0) {
                return {
                    message: 'Todos los permisos han sido removidos del rol',
                };
            }

            // Verificar que todos los permisos seleccionados existen
            const existingPermissions = await tx.permission.findMany({
                where: { id: { in: validatedData.permissions } },
                select: { id: true, name: true },
            });

            const validPermissionIds = existingPermissions.map((p) => p.id);
            const invalidPermissionIds = validatedData.permissions.filter(
                (permissionId) => !validPermissionIds.includes(permissionId),
            );

            if (invalidPermissionIds.length > 0) {
                throw new Error(
                    `Los siguientes permisos no existen: ${invalidPermissionIds.join(', ')}`,
                );
            }

            // Crear nuevas asignaciones de permisos
            const newPermissionRoles = validatedData.permissions.map((permissionId) => ({
                roleId: validatedData.roleId,
                permissionId,
            }));

            await tx.permissionRole.createMany({
                data: newPermissionRoles,
            });

            return {
                message: 'Permisos asignados correctamente al rol',
                assignedPermissions: existingPermissions.map((p) => p.name),
            };
        });

        // Registrar evento de auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.PERMISSIONS.UPDATE,
            entity: AUDIT_ENTITIES.ROLE,
            entityId: validatedData.roleId,
            description: `Permisos asignados al rol "${role.name}"`,
            metadata: {
                roleId: validatedData.roleId,
                roleName: role.name,
                before: {
                    permissionIds: currentPermissionIds,
                    permissionNames: currentPermissionNames,
                },
                after: {
                    permissionIds: validatedData.permissions,
                    permissionNames:
                        validatedData.permissions.length > 0
                            ? (
                                  await prisma.permission.findMany({
                                      where: { id: { in: validatedData.permissions } },
                                      select: { name: true },
                                  })
                              ).map((p) => p.name)
                            : [],
                },
                added: validatedData.permissions.filter((p) => !currentPermissionIds.includes(p)),
                removed: currentPermissionIds.filter((p) => !validatedData.permissions.includes(p)),
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        // Revalidar la ruta para actualizar el caché
        revalidatePath('/admin/settings/roles');
        revalidatePath('/admin/settings/users');

        return {
            success: true,
            message: result.message,
            assignedPermissions: result.assignedPermissions || [],
        };
    } catch (error) {
        console.error('Error asignando permisos al rol:', error);

        if (error instanceof Error) {
            return { error: error.message };
        }

        return { error: 'Error desconocido al asignar permisos al rol' };
    }
}
