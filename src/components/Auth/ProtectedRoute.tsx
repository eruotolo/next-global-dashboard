'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import useAuthStore from '@/store/authStore';
import PagePermissionGuard from './PagePermissionGuard';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const session = useAuthStore((state) => state.session);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const isLoading = useAuthStore((state) => state.isLoading);
    const fetchSession = useAuthStore((state) => state.fetchSession);

    useEffect(() => {
        let mounted = true;

        const initSession = async () => {
            if (!isInitialized && mounted) {
                try {
                    await fetchSession();
                } catch (error) {
                    console.error('Error initializing session:', error);
                }
            }
        };

        initSession();

        return () => {
            mounted = false;
        };
    }, [isInitialized, fetchSession]);

    useEffect(() => {
        if (isInitialized && !session && !isLoading) {
            console.log('No session found after initialization, redirecting to login');
            router.push('/login');
        }
    }, [isInitialized, session, isLoading, router]);

    if (!isInitialized || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return <PagePermissionGuard>{children}</PagePermissionGuard>;
}
