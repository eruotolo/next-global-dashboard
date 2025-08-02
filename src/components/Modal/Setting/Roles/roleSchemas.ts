import { z } from 'zod';

import type { RoleQuery } from '@/types/settings/Roles/RolesInterface';

// Schema para crear roles (solo nombre, sin id ni state)
export const RoleCreateSchema: z.ZodType<Pick<RoleQuery, 'name'>> = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(30, 'El nombre no puede exceder 30 caracteres'),
});

// Schema para asignar permisos a roles
export const AssignPermissionRoleSchema = z.object({
    roleId: z.string().min(1, 'ID del rol requerido'),
    permissions: z.array(z.string()).min(0, 'Seleccione los permisos deseados'),
});

// Schema completo para roles (incluyendo id y state)
export const RoleCompleteSchema: z.ZodType<RoleQuery> = z.object({
    id: z.string(),
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(30, 'El nombre no puede exceder 30 caracteres'),
    state: z.number(),
});

// Tipos derivados para inferencia automática
export type RoleCreateFormValues = z.infer<typeof RoleCreateSchema>;
export type AssignPermissionRoleFormValues = z.infer<typeof AssignPermissionRoleSchema>;
export type RoleCompleteFormValues = z.infer<typeof RoleCompleteSchema>;
