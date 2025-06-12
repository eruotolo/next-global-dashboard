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
        permissions?: string[];
    };
    expires?: string;
}

// Definimos la interfaz para el store
interface AuthStore {
    session: Session | null;
    isInitialized: boolean;
    isLoading: boolean;
    setSession: (session: Session | null) => void;
    fetchSession: () => Promise<void>;
}

const API_SESSION_URL = '/api/auth/session';

let fetchPromise: Promise<void> | null = null;

const useAuthStore = create<AuthStore>((set) => ({
    session: null,
    isInitialized: false,
    isLoading: false,
    setSession: (session) => {
        set({ session });
        if (session?.user?.permissions) {
            useUserPermissionStore.getState().setPermissions(session.user.permissions);
        }
        if (session?.user?.roles) {
            useUserPermissionStore.getState().setRoles(session.user.roles);
        }
    },
    fetchSession: async () => {
        // Si ya hay una petición en curso, esperar a que termine
        if (fetchPromise) {
            await fetchPromise;
            return;
        }

        set({ isLoading: true });

        try {
            fetchPromise = (async () => {
                try {
                    console.log('Fetching session...');
                    const response = await fetch(API_SESSION_URL);
                    if (!response.ok) {
                        throw new Error('Failed to fetch session');
                    }
                    const data: Session = await response.json();
                    console.log('Session fetched successfully');

                    set({ session: data, isInitialized: true });

                    if (data?.user?.permissions) {
                        useUserPermissionStore.getState().setPermissions(data.user.permissions);
                    }
                    if (data?.user?.roles) {
                        useUserPermissionStore.getState().setRoles(data.user.roles);
                    }
                } catch (error) {
                    console.error('Failed to fetch session:', error);
                    set({ session: null, isInitialized: true });
                    throw error;
                }
            })();

            await fetchPromise;
        } finally {
            fetchPromise = null;
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;
