'use server';

import prisma from '@/lib/db/db';
import { revalidatePath } from 'next/cache';
import type { RoleInterface } from '@/types/Roles/RolesInterface';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function createRole(formData: FormData) {
    try {
        const name = formData.get('name') as string;

        if (!name) {
            return { error: 'El nombre del rol es obligatorio y no puede estar vacío' };
        }

        const role = await prisma.role.create({
            data: {
                name,
                state: 1,
            },
        });

        // Registrar la creación del rol en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'createRole',
            entity: 'Role',
            entityId: role.id,
            description: `Rol "${name}" creado`,
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
            return { error: 'No se pudo crear el rol. Verifique los datos e intente nuevamente.' };
        }
        return { error: 'Error desconocido al crear el rol' };
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteRole(id: string) {
    try {
        if (!id) {
            return { error: 'El ID del rol es obligatorio' };
        }

        // Obtener información del rol antes de eliminarlo
        const roleToDelete = await prisma.role.findUnique({
            where: { id },
        });

        if (!roleToDelete) {
            return { error: 'El rol no existe' };
        }

        const roleRemoved = await prisma.role.delete({
            where: { id },
        });

        // Registrar la eliminación del rol en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'deleteRole',
            entity: 'Role',
            entityId: id,
            description: `Rol "${roleToDelete.name}" eliminado`,
            metadata: { roleName: roleToDelete.name, roleId: id },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/users');
        return { role: roleRemoved, message: 'Rol eliminado exitosamente' };
    } catch (error) {
        console.error('Error deleting role:', error);
        return { error: 'Error al eliminar el rol' };
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateRole(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const stateValue = formData.get('state');
        const state = stateValue ? Number(stateValue) : undefined;

        // Obtener información del rol antes de actualizarlo
        const roleBeforeUpdate = await prisma.role.findUnique({
            where: { id },
        });

        if (!roleBeforeUpdate) {
            return { error: 'El rol no existe' };
        }

        const data: Partial<RoleInterface> = {};
        if (name) data.name = name;
        if (typeof state === 'number') data.state = state;

        const roleUpdated = await prisma.role.update({
            where: { id },
            data,
        });

        // Registrar la actualización del rol en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: 'updateRole',
            entity: 'Role',
            entityId: id,
            description: `Rol "${roleBeforeUpdate.name}" actualizado`,
            metadata: {
                before: { name: roleBeforeUpdate.name, state: roleBeforeUpdate.state },
                after: { name: roleUpdated.name, state: roleUpdated.state },
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

        return { role: roleUpdated, message: 'Rol actualizado exitosamente' };
    } catch (error) {
        console.error('Error updating role:', error);
        return { error: 'Error al actualizar el rol' };
    } finally {
        await prisma.$disconnect();
    }
}
