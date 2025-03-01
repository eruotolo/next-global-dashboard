'use client';

import { useEffect } from 'react';
import useSessionStore from '@/store/sessionStore';

export default function SessionMonitor() {
    const { startMonitoring, stopMonitoring } = useSessionStore();

    useEffect(() => {
        startMonitoring();
        return () => stopMonitoring();
    }, [startMonitoring, stopMonitoring]);

    return null;
}
