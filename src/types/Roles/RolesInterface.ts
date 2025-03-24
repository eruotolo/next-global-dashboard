export interface RoleQuery {
    id: string;
    name: string;
    state: number;
}

export type RolesArray = RoleQuery[];

export interface RoleInterface {
    id: string;
    name: string;
    state: number;
}

export interface UserRoleQuery {
    id: string;
    userId: string | null;
    roleId: string | null;
    createdAt: Date;
    role: {
        id: string;
        name: string;
        state: number;
    } | null;
}

export interface AssignRoleUserModalProps {
    id: string; // ID del usuario
    refresh: () => Promise<void>; // Función para refrescar la tabla o estado padre
    open: boolean;
    onClose: () => void;
}

export interface RoleFormData {
    name?: string;
    state?: number;
}
