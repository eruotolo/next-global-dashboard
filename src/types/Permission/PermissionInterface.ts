export interface PermissionRoleQuery {
    id: string;
    roleId: string | null;
    permissionId: string | null;
    permission: {
        id: string;
        name: string;
    } | null;
}

export interface PermissionQuery {
    id: string;
    name: string;
}
