'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';
import type { UserRoleQuery } from '@/types/settings/Roles/RolesInterface';

export async function getUserRoles(id: string): Promise<UserRoleQuery[]> {
    if (!id) {
        throw new Error('User ID is invalid');
    }

    try {
        return await prisma.userRole.findMany({
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
    } catch (error) {
        console.error('Error getting user roles:', error);
        throw error;
    }
}

export async function updateUserRoles(id: string, roles: string[]) {
    if (!id) {
        throw new Error('User ID is invalid');
    }

    if (!Array.isArray(roles) || roles.some((roleId) => typeof roleId !== 'string')) {
        throw new Error('Roles must be an array of valid IDs');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, lastName: true, email: true },
        });

        if (!user) {
            throw new Error('User does not exist');
        }

        const currentUserRoles = await prisma.userRole.findMany({
            where: { userId: id },
            include: {
                role: {
                    select: { id: true, name: true },
                },
            },
        });

        const currentRoleIds = currentUserRoles
            .map((ur) => ur.role?.id)
            .filter(Boolean) as string[];
        const currentRoleNames = currentUserRoles
            .map((ur) => ur.role?.name)
            .filter(Boolean) as string[];

        const result = await prisma.$transaction(async (tx) => {
            await tx.userRole.deleteMany({
                where: { userId: id },
            });

            if (roles.length === 0) {
                return {
                    message: 'All roles have been removed',
                    success: true,
                };
            }

            const existingRoles = await tx.role.findMany({
                where: { id: { in: roles } },
                select: { id: true, name: true },
            });
            const validRoleIds = existingRoles.map((r) => r.id);
            const validRoleNames = existingRoles.map((r) => r.name);
            const invalidRoles = roles.filter((roleId) => !validRoleIds.includes(roleId));

            if (invalidRoles.length > 0) {
                throw new Error(`The following roles do not exist: ${invalidRoles.join(', ')}`);
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
                message: 'Roles updated successfully',
                success: true,
                validRoleNames,
            };
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: roles.length > 0 ? 'assignRoleUser' : 'removeRoleUser',
            entity: 'User',
            entityId: id,
            description:
                roles.length > 0
                    ? `Roles assigned to user "${user.name} ${user.lastName || ''}"`
                    : `All roles removed from user "${user.name} ${user.lastName || ''}"`,
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
        console.error('Error updating user roles:', error);
        throw new Error(
            `Failed to update roles: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
    }
}
