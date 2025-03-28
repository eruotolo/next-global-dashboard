import { signOut } from 'next-auth/react';
import { create } from 'zustand';

const INACTIVITY_TIME = 20 * 60 * 1000; // 20 minutos

interface SessionStore {
    timeoutId: NodeJS.Timeout | null;
    resetTimer: () => void;
    startMonitoring: () => void;
    stopMonitoring: () => void;
}

const useSessionStore = create<SessionStore>((set, get) => ({
    timeoutId: null,

    resetTimer: () => {
        const { timeoutId } = get();
        if (timeoutId) clearTimeout(timeoutId);

        const newTimeoutId = setTimeout(() => {
            signOut({ redirect: true, callbackUrl: '/login' });
        }, INACTIVITY_TIME);

        set({ timeoutId: newTimeoutId });
    },

    startMonitoring: () => {
        const { resetTimer } = get();
        const events: (keyof DocumentEventMap)[] = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
        ];

        for (const event of events) {
            document.addEventListener(event, resetTimer);
        }
        resetTimer();
    },

    stopMonitoring: () => {
        const { resetTimer, timeoutId } = get();
        const events: (keyof DocumentEventMap)[] = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
        ];

        for (const event of events) {
            document.removeEventListener(event, resetTimer);
        }

        if (timeoutId) clearTimeout(timeoutId);
    },
}));

export default useSessionStore;
