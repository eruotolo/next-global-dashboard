'use server';

import prisma from '@/lib/db/db';
import { put } from '@vercel/blob';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import type { UserData } from '@/types/Users/UsersInterface';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';

export async function createUser(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const birthdate = formData.get('birthdate') as string;
        const address = formData.get('address') as string;
        const city = formData.get('city') as string;
        const password = formData.get('password') as string;
        const imageFile = formData.get('image') as File | null;

        if (
            !name ||
            !lastName ||
            !email ||
            !phone ||
            !birthdate ||
            !address ||
            !city ||
            !password
        ) {
            return { error: 'Faltan campos obligatorios' };
        }

        let imageUrl: string | undefined;
        if (imageFile && imageFile.size > 0) {
            const fileExtension = imageFile.name.split('.').pop() || 'jpg';
            const fileName = `profile/${email.replace('@', '-at-')}-${Date.now()}.${fileExtension}`;
            const blob = await put(fileName, imageFile, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            imageUrl = blob.url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                lastName,
                birthdate: new Date(birthdate),
                phone,
                address,
                city,
                password: hashedPassword,
                image: imageUrl,
                state: 1,
            },
        });

        // Registrar la creación del usuario en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.USER.CREATE,
            entity: AUDIT_ENTITIES.USER,
            entityId: user.id,
            description: `Usuario "${name} ${lastName}" creado`,
            metadata: { 
                userId: user.id,
                email,
                name,
                lastName
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/users');
        return { user, message: 'Usuario creado exitosamente' };
    } catch (error) {
        console.error('Error creating user:', error);
        return { error: 'Error al crear el usuario' };
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteUser(id: string) {
    try {
        if (!id) {
            return { error: 'El ID del usuario es obligatorio' };
        }

        // Obtener información del usuario antes de eliminarlo
        const userToDelete = await prisma.user.findUnique({
            where: { id },
        });

        if (!userToDelete) {
            return { error: 'El usuario no existe' };
        }

        const userRemoved = await prisma.user.delete({
            where: { id },
        });

        // Registrar la eliminación del usuario en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.USER.DELETE,
            entity: AUDIT_ENTITIES.USER,
            entityId: id,
            description: `Usuario "${userToDelete.name} ${userToDelete.lastName || ''}" eliminado`,
            metadata: { 
                userId: id,
                email: userToDelete.email,
                name: userToDelete.name,
                lastName: userToDelete.lastName
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/users'); // Refresca la caché para la tabla

        return { user: userRemoved, message: 'Usuario eliminado exitosamente' };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { error: 'Error al eliminar el usuario' };
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateUser(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'El ID del usuario es obligatorio' };
        }

        // Obtener información del usuario antes de actualizarlo
        const userBeforeUpdate = await prisma.user.findUnique({
            where: { id },
        });

        if (!userBeforeUpdate) {
            return { error: 'El usuario no existe' };
        }

        const name = formData.get('name') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const birthdate = formData.get('birthdate') as string;
        const address = formData.get('address') as string;
        const city = formData.get('city') as string;
        const password = formData.get('password') as string;
        const imageFile = formData.get('image') as File | null;

        // Construir objeto de datos solo con campos proporcionados
        const data: Partial<UserData> = {};
        if (name) data.name = name;
        if (lastName) data.lastName = lastName;
        if (email) data.email = email;
        if (phone) data.phone = phone;
        if (birthdate) data.birthdate = new Date(birthdate);
        if (address) data.address = address;
        if (city) data.city = city;
        if (password) data.password = await bcrypt.hash(password, 10);

        // Manejar la subida de imagen si existe
        if (imageFile && imageFile.size > 0) {
            const fileExtension = imageFile.name.split('.').pop() || 'jpg';
            const fileName = `profile/${id}-${Date.now()}.${fileExtension}`;
            const blob = await put(fileName, imageFile, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            data.image = blob.url;
        }

        const userUpdated = await prisma.user.update({
            where: { id },
            data,
        });

        // Registrar la actualización del usuario en la auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.USER.UPDATE,
            entity: AUDIT_ENTITIES.USER,
            entityId: id,
            description: `Usuario "${userBeforeUpdate.name} ${userBeforeUpdate.lastName || ''}" actualizado`,
            metadata: {
                userId: id,
                before: {
                    name: userBeforeUpdate.name,
                    lastName: userBeforeUpdate.lastName,
                    email: userBeforeUpdate.email,
                    phone: userBeforeUpdate.phone,
                    address: userBeforeUpdate.address,
                    city: userBeforeUpdate.city,
                },
                after: {
                    name: userUpdated.name,
                    lastName: userUpdated.lastName,
                    email: userUpdated.email,
                    phone: userUpdated.phone,
                    address: userUpdated.address,
                    city: userUpdated.city,
                },
                changes: {
                    name: name !== userBeforeUpdate.name ? { from: userBeforeUpdate.name, to: name } : undefined,
                    lastName: lastName !== userBeforeUpdate.lastName ? { from: userBeforeUpdate.lastName, to: lastName } : undefined,
                    email: email !== userBeforeUpdate.email ? { from: userBeforeUpdate.email, to: email } : undefined,
                    phone: phone !== userBeforeUpdate.phone ? { from: userBeforeUpdate.phone, to: phone } : undefined,
                    address: address !== userBeforeUpdate.address ? { from: userBeforeUpdate.address, to: address } : undefined,
                    city: city !== userBeforeUpdate.city ? { from: userBeforeUpdate.city, to: city } : undefined,
                    password: password ? "Password changed" : undefined,
                    image: data.image ? "Image updated" : undefined,
                }
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/users'); // Refresca la caché para la tabla

        return {
            user: userUpdated,
            message: 'Usuario actualizado exitosamente',
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return { error: 'Error al actualizar el usuario' };
    } finally {
        await prisma.$disconnect();
    }
}
