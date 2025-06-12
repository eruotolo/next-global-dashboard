'use server';

import prisma from '@/lib/db/db';
import bcrypt from 'bcrypt';

function generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

export async function recoverPassword(email: string) {
    try {
        // Verificar si el usuario existe
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { message: 'Error: No se encontró un usuario con ese email' };
        }

        // Generar nueva contraseña
        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // Importar Brevo de manera correcta
        const brevoModule = await import('@getbrevo/brevo');

        // Crear la instancia de la API
        const apiKey = process.env.BREVO_API_KEY || '';
        const apiInstance = new brevoModule.TransactionalEmailsApi();

        // Configurar la clave API
        const apiKeyInstance = brevoModule.TransactionalEmailsApiApiKeys.apiKey;
        apiInstance.setApiKey(apiKeyInstance, apiKey);

        // Configurar el email
        const sendSmtpEmail = new brevoModule.SendSmtpEmail();
        sendSmtpEmail.subject = 'Recuperación de Contraseña';
        sendSmtpEmail.to = [{ email: email }];
        sendSmtpEmail.sender = { name: 'Chubby Dashboard', email: 'crowadvancegx@gmail.com' };
        sendSmtpEmail.htmlContent = `
          <h1>Recuperación de Contraseña</h1>
          <p>Tu nueva contraseña es: <strong>${newPassword}</strong></p>
          <p>Por favor, cámbiala después de iniciar sesión.</p>
        `;

        // Enviar el email
        await apiInstance.sendTransacEmail(sendSmtpEmail);

        return { message: 'Se ha enviado una nueva contraseña a tu email' };
    } catch (error) {
        console.error('Error en recoverPassword:', error);
        return { message: 'Error: No se pudo procesar la solicitud' };
    }
}
