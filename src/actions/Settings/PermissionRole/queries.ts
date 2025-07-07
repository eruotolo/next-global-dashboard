'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';
import type { PermissionRoleQuery } from '@/types/settings/Permission/PermissionInterface';

export async function getPermissionRoles(id: string): Promise<PermissionRoleQuery[]> {
    if (!id) {
        throw new Error('Role ID is invalid');
    }

    try {
        return await prisma.permissionRole.findMany({
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
    } catch (error) {
        console.error('Error getting permissions:', error);
        throw error;
    }
}

export async function updatePermissionRoles(id: string, permissions: string[]) {
    if (!id) {
        throw new Error('Role ID is invalid');
    }

    try {
        const role = await prisma.role.findUnique({
            where: { id },
            select: { id: true, name: true },
        });

        if (!role) {
            throw new Error('Role does not exist');
        }

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

            console.log('Old permissions removed for role:', id);

            if (permissions.length === 0) {
                return {
                    message: 'All permissions have been removed',
                    success: true,
                };
            }

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
                    `The following permissions do not exist: ${invalidPermissions.join(', ')}`,
                );
            }

            // Create new permission assignments
            const newPermissionRoles = permissions.map((permissionId) => ({
                roleId: id,
                permissionId,
            }));

            await tx.permissionRole.createMany({
                data: newPermissionRoles,
            });

            return {
                message: 'Permissions updated successfully',
                success: true,
                validPermissionNames,
            };
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.PERMISSIONS.UPDATE,
            entity: AUDIT_ENTITIES.ROLE,
            entityId: id,
            description: `Permissions assigned to role "${role.name}"`,
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
        console.error('Error updating role permissions:', error);
        throw new Error(
            `Failed to update permissions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
    }
}
