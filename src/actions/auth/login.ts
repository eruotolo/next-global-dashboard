'use server';

import { signIn } from 'next-auth/react';

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Email y contraseña son obligatorios' };
    }

    // Nota: En el cliente, usaremos signIn directamente
    // Este Server Action es para mantener consistencia con el patrón
    return { email, password };
  } catch (error) {
    console.error('Error en loginAction:', error);
    return { error: 'Error inesperado' };
  }
}