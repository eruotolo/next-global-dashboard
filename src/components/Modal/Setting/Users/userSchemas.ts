import { z } from 'zod';

import type { UserFormPassData, UserInterface } from '@/types/settings/Users/UsersInterface';

// Schema para crear usuarios (campos requeridos para creación)
export const UserCreateSchema: z.ZodType<
    Pick<UserInterface, 'name' | 'lastName' | 'email' | 'phone'> & {
        password: string;
        birthdate: Date;
        address: string;
        city: string;
        roles?: string[];
        image?: File;
    }
> = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    lastName: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede exceder 50 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
    birthdate: z.date({ message: 'La fecha de nacimiento es obligatoria' }),
    address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    image: z.instanceof(File).optional(),
    roles: z.array(z.string()).optional(),
});

// Schema para editar usuarios (sin password, campos opcionales)
export const UserEditSchema: z.ZodType<
    Pick<UserInterface, 'name' | 'lastName' | 'email' | 'phone'> & {
        birthdate: Date;
        address: string;
        city: string;
        roles?: string[];
        image?: File;
    }
> = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    lastName: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede exceder 50 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
    birthdate: z.date({ message: 'La fecha de nacimiento es obligatoria' }),
    address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    image: z.instanceof(File).optional(),
    roles: z.array(z.string()).optional(),
});

// Schema para cambio de contraseña
export const ChangePasswordSchema: z.ZodType<UserFormPassData & { currentPassword: string }> = z
    .object({
        currentPassword: z.string().min(1, 'Contraseña actual requerida'),
        password: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
        confirmPassword: z.string().min(1, 'Confirmar contraseña requerida'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

// Schema completo de usuario (para queries y datos completos)
export const UserCompleteSchema: z.ZodType<UserInterface> = z.object({
    id: z.string(),
    name: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    birthdate: z.date().nullable().optional(),
    address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    password: z.string().optional(),
    image: z.string().nullable().optional(),
    state: z.number().nullable().optional(),
    createdAt: z.date().optional(),
    roles: z
        .array(
            z.object({
                id: z.string(),
                userId: z.string().nullable(),
                roleId: z.string().nullable(),
                role: z
                    .object({
                        id: z.string(),
                        name: z.string(),
                        state: z.number(),
                    })
                    .nullable()
                    .optional(),
            }),
        )
        .optional(),
});

// Schema para asignar roles a usuarios
export const AssignRoleUserSchema = z.object({
    userId: z.string().min(1, 'ID del usuario requerido'),
    roles: z.array(z.string()).min(0, 'Seleccione los roles deseados'),
});

// Schema para recuperación de contraseña
export const ForgotPasswordSchema = z.object({
    email: z.string().email('Email inválido'),
});

// Tipos derivados para inferencia automática
export type UserCreateFormValues = z.infer<typeof UserCreateSchema>;
export type UserEditFormValues = z.infer<typeof UserEditSchema>;
export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
export type UserCompleteFormValues = z.infer<typeof UserCompleteSchema>;
export type AssignRoleUserFormValues = z.infer<typeof AssignRoleUserSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
