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
