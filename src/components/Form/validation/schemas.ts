import { z } from 'zod';

// Esquemas base reutilizables
export const baseUserSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    lastName: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede exceder 50 caracteres'),
    email: z.string().email('Email inválido'),
});

// Esquemas específicos para cada formulario
export const UserCreateSchema = baseUserSchema.extend({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
    birthdate: z.date({ message: 'La fecha de nacimiento es obligatoria' }),
    address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    image: z.instanceof(File).optional(),
    roles: z.array(z.string()).optional(),
});

export const UserEditSchema = baseUserSchema.extend({
    phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
    birthdate: z.date({ message: 'La fecha de nacimiento es obligatoria' }),
    address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    image: z.instanceof(File).optional(),
    roles: z.array(z.string()).optional(),
});

export const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Contraseña actual requerida'),
        newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
        confirmPassword: z.string().min(1, 'Confirmar contraseña requerida'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export const TicketCreateSchema = z.object({
    title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    category: z.string().min(1, 'Categoría requerida'),
    priority: z.enum(['low', 'medium', 'high']),
    image: z.instanceof(File).optional(),
});

export const RoleSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(30),
    description: z.string().max(200, 'La descripción no puede exceder 200 caracteres').optional(),
    permissions: z.array(z.string()).min(1, 'Debe seleccionar al menos un permiso'),
});

// Schema simplificado para crear roles (solo nombre)
export const RoleCreateSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(30, 'El nombre no puede exceder 30 caracteres'),
});

export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email('Email inválido'),
});

export const CommentSchema = z.object({
    content: z
        .string()
        .min(1, 'El comentario no puede estar vacío')
        .max(1000, 'El comentario no puede exceder 1000 caracteres'),
    ticketId: z.string().min(1, 'ID del ticket requerido'),
});
