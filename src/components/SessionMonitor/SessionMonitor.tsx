'use client';

import useSessionStore from '@/store/sessionStore';
import { useEffect } from 'react';

export default function SessionMonitor() {
    const { startMonitoring, stopMonitoring } = useSessionStore();

    useEffect(() => {
        startMonitoring();
        return () => stopMonitoring();
    }, [startMonitoring, stopMonitoring]);

    return null;
}
