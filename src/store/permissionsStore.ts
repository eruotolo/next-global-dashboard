import { create } from 'zustand';

interface PermissionCache {
    [path: string]: {
        hasAccess: boolean;
        timestamp: number;
    };
}

interface PermissionsStore {
    permissionsCache: PermissionCache;
    setPermission: (path: string, hasAccess: boolean) => void;
    getPermission: (path: string) => { hasAccess: boolean; isValid: boolean } | null;
    clearCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

const usePermissionsStore = create<PermissionsStore>((set, get) => ({
    permissionsCache: {},

    setPermission: (path: string, hasAccess: boolean) => {
        set((state) => ({
            permissionsCache: {
                ...state.permissionsCache,
                [path]: {
                    hasAccess,
                    timestamp: Date.now(),
                },
            },
        }));
    },

    getPermission: (path: string) => {
        const cache = get().permissionsCache[path];
        if (!cache) return null;

        const isValid = Date.now() - cache.timestamp < CACHE_DURATION;
        return isValid ? { hasAccess: cache.hasAccess, isValid } : null;
    },

    clearCache: () => {
        set({ permissionsCache: {} });
    },
}));

export default usePermissionsStore;
