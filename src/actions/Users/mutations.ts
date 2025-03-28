'use server';

import prisma from '@/dbprisma/db';
import { put } from '@vercel/blob';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import type { UserData } from '@/tipos/Users/UsersInterface';

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

        revalidatePath('/dashboard/users');
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

        const userRemoved = await prisma.user.delete({
            where: { id },
        });

        revalidatePath('/dashboard/users'); // Refresca la caché para la tabla

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

        revalidatePath('/dashboard/users'); // Refresca la caché para la tabla

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
