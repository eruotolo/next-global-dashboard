import { z } from 'zod';

import type { Page } from '@/actions/Settings/Pages/queries';

// Schema para crear páginas (nombre, path y descripción opcional)
export const PageCreateSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    path: z
        .string()
        .min(1, 'La ruta es requerida')
        .regex(/^\/.*/, 'La ruta debe comenzar con /')
        .regex(/^[\/\w\-]*$/, 'La ruta solo puede contener letras, números, guiones y barras')
        .max(100, 'La ruta no puede exceder 100 caracteres'),
    description: z
        .string()
        .max(200, 'La descripción no puede exceder 200 caracteres')
        .optional(),
});

// Schema para editar páginas (igual que crear)
export const PageEditSchema = PageCreateSchema;

// Schema completo para páginas (incluyendo id y pageRoles)
export const PageCompleteSchema: z.ZodType<Page> = z.object({
    id: z.string(),
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    path: z
        .string()
        .min(1, 'La ruta es requerida')
        .regex(/^\/.*/, 'La ruta debe comenzar con /')
        .regex(/^[\/\w\-]*$/, 'La ruta solo puede contener letras, números, guiones y barras')
        .max(100, 'La ruta no puede exceder 100 caracteres'),
    description: z
        .string()
        .max(200, 'La descripción no puede exceder 200 caracteres')
        .nullable(),
    pageRoles: z.array(z.object({
        roleId: z.string(),
        role: z.object({
            name: z.string(),
        }),
    })),
});

// Tipos derivados para inferencia automática
export type PageCreateFormValues = z.infer<typeof PageCreateSchema>;
export type PageEditFormValues = z.infer<typeof PageEditSchema>;
export type PageCompleteFormValues = z.infer<typeof PageCompleteSchema>;