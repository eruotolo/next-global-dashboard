'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';
import type { RoleInterface } from '@/types/settings/Roles/RolesInterface';

export async function createRole(formData: FormData) {
    try {
        const name = formData.get('name') as string;

        if (!name) {
            return { error: 'Role name is required and cannot be empty' };
        }

        const role = await prisma.role.create({
            data: {
                name,
                state: 1,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'createRole',
            entity: 'Role',
            entityId: role.id,
            description: `Role "${name}" created`,
            metadata: { roleName: name, roleId: role.id },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/users');
        return { role };
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating role:', error.message);
            return { error: 'Could not create role. Please verify the data and try again.' };
        }
        return { error: 'Unknown error creating role' };
    }
}

export async function deleteRole(id: string) {
    try {
        if (!id) {
            return { error: 'Role ID is required' };
        }

        const roleToDelete = await prisma.role.findUnique({
            where: { id },
        });

        if (!roleToDelete) {
            return { error: 'Role does not exist' };
        }

        const roleRemoved = await prisma.role.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'deleteRole',
            entity: 'Role',
            entityId: id,
            description: `Role "${roleToDelete.name}" deleted`,
            metadata: { roleName: roleToDelete.name, roleId: id },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/users');
        return { role: roleRemoved, message: 'Role deleted successfully' };
    } catch (error) {
        console.error('Error deleting role:', error);
        throw error;
    }
}

export async function updateRole(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const stateValue = formData.get('state');
        const state = stateValue ? Number(stateValue) : undefined;

        const roleBeforeUpdate = await prisma.role.findUnique({
            where: { id },
        });

        if (!roleBeforeUpdate) {
            return { error: 'Role does not exist' };
        }

        const updateData: Partial<RoleInterface> = {};
        if (name) updateData.name = name;
        if (state !== undefined) updateData.state = state;

        const roleUpdated = await prisma.role.update({
            where: { id },
            data: updateData,
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'updateRole',
            entity: 'Role',
            entityId: id,
            description: `Role "${roleBeforeUpdate.name}" updated`,
            metadata: {
                before: {
                    name: roleBeforeUpdate.name,
                    state: roleBeforeUpdate.state,
                },
                after: {
                    name: roleUpdated.name,
                    state: roleUpdated.state,
                },
                changes: {
                    name:
                        name !== roleBeforeUpdate.name
                            ? { from: roleBeforeUpdate.name, to: name }
                            : undefined,
                    state:
                        state !== roleBeforeUpdate.state
                            ? { from: roleBeforeUpdate.state, to: state }
                            : undefined,
                },
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/users');
        return { role: roleUpdated, message: 'Role updated successfully' };
    } catch (error) {
        console.error('Error updating role:', error);
        throw error;
    }
}
