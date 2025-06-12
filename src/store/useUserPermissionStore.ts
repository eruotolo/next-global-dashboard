import { create } from 'zustand';

interface UserPermissionStore {
    permissions: string[];
    roles: string[];
    setPermissions: (permissions: string[]) => void;
    setRoles: (roles: string[]) => void;
    hasPermission: (permiso: string) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
}

export const useUserPermissionStore = create<UserPermissionStore>((set, get) => ({
    permissions: [],
    roles: [],

    setPermissions: (permissions: string[]) => set({ permissions }),
    setRoles: (roles: string[]) => set({ roles }),

    hasPermission: (permiso: string) => get().permissions.includes(permiso),
    hasRole: (role: string) => get().roles.includes(role),
    hasAnyRole: (roles: string[]) => roles.some((role) => get().roles.includes(role)),
}));
