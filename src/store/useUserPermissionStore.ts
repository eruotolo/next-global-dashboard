import { create } from 'zustand';

interface UserPermissionStore {
    permissions: string[];
    setPermissions: (permissions: string[]) => void;
    hasPermission: (permiso: string) => boolean;
}

export const useUserPermissionStore = create<UserPermissionStore>((set, get) => ({
    permissions: [],

    setPermissions: (permissions: string[]) => set({ permissions }),

    hasPermission: (permiso: string) => get().permissions.includes(permiso),
}));
