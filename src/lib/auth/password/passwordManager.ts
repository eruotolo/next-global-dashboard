import { randomBytes } from 'node:crypto';

import bcrypt from 'bcrypt';

import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import prisma from '@/lib/db/db';

import { passwordEmailService } from '../email/passwordEmailService';
import type { PasswordResetOptions, PasswordResetResult, UserPasswordResetData } from './types';

/**
 * Genera una contraseña temporal segura usando crypto.randomBytes
 */
function generateSecurePassword(length = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const randomBuffer = randomBytes(length);
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[randomBuffer[i] % charset.length];
    }
    return password;
}

/**
 * Busca usuario por email
 */
async function findUserByEmail(email: string): Promise<UserPasswordResetData | null> {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            password: true,
        },
    });
}

/**
 * Busca usuario por ID
 */
async function findUserById(userId: string): Promise<UserPasswordResetData | null> {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            password: true,
        },
    });
}

/**
 * Actualiza la contraseña del usuario en la base de datos
 */
async function updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
}

/**
 * Registra evento de auditoría para reset de contraseña
 */
async function logPasswordResetEvent(
    user: UserPasswordResetData,
    options: PasswordResetOptions,
    emailSent: boolean,
): Promise<void> {
    const description =
        options.resetType === 'user_recovery'
            ? `Password recovery completed for ${user.email}`
            : `Password reset for user "${user.name} ${user.lastName || ''}"`;

    await logAuditEvent({
        action: AUDIT_ACTIONS.USER.UPDATE,
        entity: AUDIT_ENTITIES.USER,
        entityId: user.id,
        description,
        metadata: {
            userId: user.id,
            email: user.email,
            resetType: options.resetType,
            emailSent,
            resetByUserId: options.resetByUserId,
            resetByUserName: options.resetByUserName,
            previousPasswordHash: `${user.password.substring(0, 10)}...`,
            resetTimestamp: new Date().toISOString(),
        },
        userId: options.resetByUserId,
        userName: options.resetByUserName,
    });
}

/**
 * Función principal unificada para manejo de reset de contraseñas
 * Maneja tanto recovery de usuario como reset administrativo
 */
export async function handlePasswordReset(
    identifier: string, // email para recovery, userId para admin reset
    options: PasswordResetOptions,
): Promise<PasswordResetResult> {
    try {
        // 1. Buscar usuario según el tipo de reset
        let user: UserPasswordResetData | null;

        if (options.resetType === 'user_recovery') {
            user = await findUserByEmail(identifier);
            if (!user) {
                return {
                    success: false,
                    error: 'No se encontró un usuario con ese email',
                    message: 'Usuario no encontrado',
                };
            }
        } else {
            user = await findUserById(identifier);
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                    message: 'Usuario no encontrado',
                };
            }
        }

        // 2. Generar nueva contraseña temporal
        const temporaryPassword = generateSecurePassword(12);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // 3. Actualizar contraseña en la base de datos
        await updateUserPassword(user.id, hashedPassword);

        // 4. Enviar email si está habilitado
        let emailSent = false;

        if (options.sendEmail && passwordEmailService.isConfigured()) {
            const resetBy =
                options.resetType === 'user_recovery'
                    ? 'Usuario'
                    : options.resetByUserName || 'Administrador';

            const emailResult = await passwordEmailService.sendPasswordResetEmail({
                userName: `${user.name} ${user.lastName || ''}`.trim(),
                temporaryPassword,
                resetBy,
                userEmail: user.email,
            });

            emailSent = emailResult.success;

            if (!emailResult.success) {
                console.error('❌ Email sending failed:', emailResult.error);
            }
        } else if (options.sendEmail) {
            console.error('❌ Email service not configured');
        }

        // 5. Registrar auditoría
        await logPasswordResetEvent(user, options, emailSent);

        // 6. Retornar resultado
        const successMessage =
            options.resetType === 'user_recovery'
                ? emailSent
                    ? 'Se ha enviado una nueva contraseña temporal a tu email'
                    : 'Nueva contraseña temporal generada'
                : emailSent
                  ? 'Password reset successfully and email sent'
                  : 'Password reset successfully';

        return {
            success: true,
            temporaryPassword,
            emailSent,
            message: successMessage,
        };
    } catch (error) {
        console.error('Error in handlePasswordReset:', error);

        const errorMessage =
            options.resetType === 'user_recovery'
                ? 'No se pudo procesar la solicitud. Inténtelo de nuevo.'
                : 'Error resetting password. Please try again.';

        return {
            success: false,
            error: errorMessage,
            message: errorMessage,
        };
    }
}
