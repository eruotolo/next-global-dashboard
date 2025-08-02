import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email('Email inválido'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
