'use server';

import prisma from '@/dbprisma/db';
import { revalidatePath } from 'next/cache';
import type { RoleInterface } from '@/tipos/Roles/RolesInterface';

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
        const roleRemoved = await prisma.role.delete({
            where: { id },
        });

        revalidatePath('/admin/setting/users');

        return { role: roleRemoved, message: 'Rol eliminado exitosamente' };
    } catch (error) {
        console.error('Error deleting role:', error);
        return { error: 'Error al eliminar el usuario' };
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateRole(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const stateValue = formData.get('state');
        const state = stateValue ? Number(stateValue) : null;

        const data: Partial<RoleInterface> = {};
        if (name) data.name = name;
        if (state) data.state = state;

        const roleUpdated = await prisma.role.update({
            where: { id },
            data,
        });

        revalidatePath('/admin/settings/users');

        return { role: roleUpdated, message: 'Rol actualizado exitosamente' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { error: 'Error al actualizar el usuario' };
    } finally {
        await prisma.$disconnect();
    }
}
