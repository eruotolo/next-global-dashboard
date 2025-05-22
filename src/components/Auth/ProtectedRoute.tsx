'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import { usePagePermissions } from '@/hooks/usePagePermissions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
    children: ReactNode;
    fallbackPath?: string;
}

export default function ProtectedRoute({
    children,
    fallbackPath = '/admin/unauthorized',
}: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const session = useAuthStore((state) => state.session);
    const { hasAccess, isLoading, error } = usePagePermissions({ path: pathname });
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        // Dar tiempo para que la sesión se establezca
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isTransitioning) return;

        if (!session) {
            router.push('/login');
            return;
        }

        if (!isLoading && !hasAccess) {
            router.push(fallbackPath);
        }
    }, [session, hasAccess, isLoading, router, fallbackPath, isTransitioning]);

    if (isLoading || isTransitioning) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!session || !hasAccess) {
        return null;
    }

    return <>{children}</>;
}
