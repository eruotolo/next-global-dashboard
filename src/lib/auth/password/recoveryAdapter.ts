'use server';

import { recoverUserPassword } from './passwordService';

/**
 * Adapter para compatibilidad con el sistema de formularios
 * Convierte el resultado de recoverUserPassword a void y maneja los callbacks
 */
export async function recoverPasswordAction(formData: FormData): Promise<void> {
    const result = await recoverUserPassword(formData);

    if (!result.success && result.error) {
        throw new Error(result.error);
    }

    // Si llegamos aquí, la operación fue exitosa
    // El Form component manejará el success automáticamente
}
