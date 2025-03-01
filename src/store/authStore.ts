import { create } from 'zustand';

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
        roles: string[];
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
    setSession: (session) => set({ session }),
    fetchSession: async () => {
        try {
            const response = await fetch(API_SESSION_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch session');
            }
            const data: Session = await response.json();
            //console.log('Fetched session:', data); // Log para depuración
            set({ session: data });
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
