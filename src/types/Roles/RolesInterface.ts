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

export interface RolePermissionInterface {
    id: string;
    name: string;
    state: number;
    permissionRole?: {
        id: string;
        roleId: string | null;
        permissionId: string | null;
        permission: {
            id: string;
            name: string;
        } | null;
    }[];
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
