import { create } from 'zustand';
import { useUserPermissionStore } from '@/store/useUserPermissionStore';

// Definimos la interfaz para la sesión
interface Session {
    user?: {
        id?: string;
        email?: string;
        name?: string;
        lastName?: string;
        phone?: string;
        address?: string;
        city?: string;
        image?: string;
        state?: number | null;
        birthdate?: string | Date;
        roles: string[];
        permissions?: string[]; // Agregamos permisos como opcional
    };
    expires?: string;
}

// Definimos la interfaz para el store
interface AuthStore {
    session: Session | null;
    setSession: (session: Session | null) => void;
    fetchSession: () => Promise<void>;
}

const API_SESSION_URL = '/api/auth/session';

const useAuthStore = create<AuthStore>((set) => ({
    session: null,
    setSession: (session) => {
        set({ session });
        // Sincroniza los permisos con useUserPermissionStore
        if (session?.user?.permissions) {
            useUserPermissionStore.getState().setPermissions(session.user.permissions);
        }
    },
    fetchSession: async () => {
        try {
            const response = await fetch(API_SESSION_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch session');
            }
            const data: Session = await response.json();
            set({ session: data });
            // Sincroniza los permisos cuando se obtiene la sesión
            if (data?.user?.permissions) {
                useUserPermissionStore.getState().setPermissions(data.user.permissions);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Failed to fetch session:', error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    },
}));

export default useAuthStore;
