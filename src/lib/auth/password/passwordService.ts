'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/lib/auth/authOptions';

import { handlePasswordReset } from './passwordManager';
import type { PasswordResetResult } from './types';

/**
 * Server Action para recuperación de contraseña por email (user recovery)
 * Usado en formularios públicos como /recovery
 */
export async function recoverUserPassword(formData: FormData): Promise<PasswordResetResult> {
    const email = formData.get('email') as string;

    if (!email) {
        return {
            success: false,
            error: 'Email requerido',
            message: 'Email requerido'
        };
    }

    return await handlePasswordReset(email, {
        resetType: 'user_recovery',
        sendEmail: true, // Siempre enviar email en recovery
    });
}

/**
 * Server Action para reset administrativo de contraseña
 * Usado en paneles de administración
 */
export async function resetUserPassword(
    userId: string, 
    options?: { sendEmail?: boolean }
): Promise<PasswordResetResult> {
    if (!userId) {
        return {
            success: false,
            error: 'User ID is required',
            message: 'User ID is required'
        };
    }

    // Obtener información del admin que realiza el reset
    const session = await getServerSession(authOptions);
    const resetByUserName = session?.user?.name
        ? `${session.user.name} ${session.user.lastName || ''}`.trim()
        : 'Administrador';

    const result = await handlePasswordReset(userId, {
        resetType: 'admin_reset',
        sendEmail: options?.sendEmail ?? true,
        resetByUserId: session?.user?.id,
        resetByUserName,
    });

    // Revalidar caché si el reset fue exitoso
    if (result.success) {
        revalidatePath('/admin/settings/users');
    }

    return result;
}

/**
 * Función de compatibilidad con la implementación anterior
 * Permite mantener imports existentes durante la transición
 * @deprecated Use recoverUserPassword instead
 */
export async function recoverPassword(email: string): Promise<PasswordResetResult> {
    return await handlePasswordReset(email, {
        resetType: 'user_recovery',
        sendEmail: true,
    });
}