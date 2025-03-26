'use server';

import prisma from '@/lib/db/db';
import bcrypt from 'bcrypt';
import { sendMail } from '@/lib/mail/mail';

function generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

export async function recoveryAccount(
    prevState: { success: boolean; message: string | null },
    formData: FormData,
): Promise<{ success: boolean; message: string | null }> {
    try {
        const email = formData.get('email') as string;

        if (!email) {
            return {
                success: false,
                message: 'El correo electrónico es requerido',
            };
        }

        // Verificar si el usuario existe
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return {
                success: false,
                message: 'No se encontró una cuenta con este correo',
            };
        }

        // Generar nueva contraseña
        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                createdAt: new Date(),
            },
        });

        // Enviar email con la nueva contraseña
        await sendMail({
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
        <h1>Recuperación de cuenta</h1>
        <p>Su nueva contraseña es: <strong>${newPassword}</strong></p>
        <p>Por favor, cambie esta contraseña después de iniciar sesión.</p>
      `,
        });

        return {
            success: true,
            message: 'Se ha enviado una nueva contraseña a su correo',
        };
    } catch (error) {
        console.error('Error en recuperación:', error);
        return {
            success: false,
            message: 'Ocurrió un error al procesar su solicitud',
        };
    } finally {
        await prisma.$disconnect();
    }
}
