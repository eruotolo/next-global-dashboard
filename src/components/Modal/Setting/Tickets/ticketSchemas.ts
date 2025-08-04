import { z } from 'zod';

import { TicketPriority, TicketStatus } from '@prisma/client';

import type { GetTicketQuery, } from '@/types/settings/Tickets/TicketInterface';

// Schema para crear tickets (formulario)
export const TicketCreateSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(100, 'El título no puede exceder 100 caracteres')
        .refine(
            (val) => val.length > 0,
            'El título es obligatorio'
        )
        .refine(
            (val) => !/^\s*$/.test(val),
            'El título no puede estar vacío o contener solo espacios'
        ),
    description: z
        .string()
        .trim()
        .min(10, 'La descripción debe tener al menos 10 caracteres para proporcionar contexto suficiente')
        .max(5000, 'La descripción no puede exceder 5000 caracteres')
        .refine(
            (val) => val.length > 0,
            'La descripción es obligatoria'
        )
        .refine(
            (val) => !/^\s*$/.test(val),
            'La descripción no puede estar vacía o contener solo espacios'
        ),
    status: z.nativeEnum(TicketStatus, {
        message: 'Debe seleccionar un estado válido para el ticket',
    }),
    priority: z.nativeEnum(TicketPriority, {
        message: 'Debe seleccionar un nivel de prioridad para el ticket',
    }),
    image: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 2097152, // 2MB en bytes exactos
            'La imagen no puede superar 2MB. Comprima la imagen antes de subirla.'
        )
        .refine(
            (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            'Solo se permiten imágenes en formato JPG, PNG o WebP'
        )
        .refine(
            (file) => !file || file.name.length <= 255,
            'El nombre del archivo es demasiado largo'
        ),
});

// Schema para editar tickets (sin imagen)
export const TicketEditSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(100, 'El título no puede exceder 100 caracteres')
        .refine(
            (val) => val.length > 0,
            'El título es obligatorio'
        )
        .refine(
            (val) => !/^\s*$/.test(val),
            'El título no puede estar vacío o contener solo espacios'
        ),
    description: z
        .string()
        .trim()
        .min(10, 'La descripción debe tener al menos 10 caracteres para proporcionar contexto suficiente')
        .max(5000, 'La descripción no puede exceder 5000 caracteres')
        .refine(
            (val) => val.length > 0,
            'La descripción es obligatoria'
        )
        .refine(
            (val) => !/^\s*$/.test(val),
            'La descripción no puede estar vacía o contener solo espacios'
        ),
    status: z.nativeEnum(TicketStatus, {
        message: 'Debe seleccionar un estado válido para el ticket',
    }),
    priority: z.nativeEnum(TicketPriority, {
        message: 'Debe seleccionar un nivel de prioridad para el ticket',
    }),
});

// Schema para comentarios de tickets
export const TicketCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(3, 'El comentario debe tener al menos 3 caracteres para ser útil')
        .max(1000, 'El comentario no puede exceder 1000 caracteres. Sea más conciso.')
        .refine(
            (val) => val.length > 0,
            'El comentario es obligatorio'
        )
        .refine(
            (val) => !/^\s*$/.test(val),
            'El comentario no puede estar vacío o contener solo espacios'
        )
        .refine(
            (val) => !/^(.)\1{10,}$/.test(val),
            'El comentario no puede contener caracteres repetitivos'
        )
        .transform((str) => str.trim()),
});

// Schema completo para tickets (incluyendo id)
export const TicketCompleteSchema: z.ZodType<GetTicketQuery> = z.object({
    id: z.string(),
    code: z.string(),
    title: z
        .string()
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(100, 'El título no puede exceder 100 caracteres'),
    description: z
        .string()
        .min(10, 'La descripción debe tener al menos 10 caracteres'),
    status: z.nativeEnum(TicketStatus),
    priority: z.nativeEnum(TicketPriority),
    image: z.string().nullable(),
    userId: z.string(),
    userName: z.string(),
    userLastName: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Tipos derivados para inferencia automática
export type TicketCreateFormValues = z.infer<typeof TicketCreateSchema>;
export type TicketEditFormValues = z.infer<typeof TicketEditSchema>;
export type TicketCommentFormValues = z.infer<typeof TicketCommentSchema>;
export type TicketCompleteFormValues = z.infer<typeof TicketCompleteSchema>;

// Constantes para labels con contexto mejorado
export const STATUS_LABELS = {
    [TicketStatus.OPEN]: 'Abierto',
    [TicketStatus.IN_PROGRESS]: 'En Progreso',
    [TicketStatus.CLOSED]: 'Cerrado',
    [TicketStatus.RESOLVED]: 'Resuelto',
} as const;

export const PRIORITY_LABELS = {
    [TicketPriority.LOW]: 'Baja',
    [TicketPriority.MEDIUM]: 'Media',
    [TicketPriority.HIGH]: 'Alta',
    [TicketPriority.URGENT]: 'Urgente',
} as const;

// Constantes adicionales para mejorar la UX
export const STATUS_DESCRIPTIONS = {
    [TicketStatus.OPEN]: 'Ticket recién creado, pendiente de asignación',
    [TicketStatus.IN_PROGRESS]: 'Ticket siendo trabajado por el equipo de soporte',
    [TicketStatus.CLOSED]: 'Ticket cerrado por el usuario o administrador',
    [TicketStatus.RESOLVED]: 'Problema resuelto, esperando confirmación del usuario',
} as const;

export const PRIORITY_DESCRIPTIONS = {
    [TicketPriority.LOW]: 'Problema menor que puede esperar',
    [TicketPriority.MEDIUM]: 'Problema moderado que requiere atención normal',
    [TicketPriority.HIGH]: 'Problema importante que requiere atención prioritaria',
    [TicketPriority.URGENT]: 'Problema crítico que requiere atención inmediata',
} as const;

// Constantes de validación para referencia
export const VALIDATION_CONSTANTS = {
    TITLE_MIN_LENGTH: 5,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 5000,
    COMMENT_MIN_LENGTH: 3,
    COMMENT_MAX_LENGTH: 1000,
    IMAGE_MAX_SIZE: 2097152, // 2MB in bytes
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_FILENAME_LENGTH: 255,
} as const;