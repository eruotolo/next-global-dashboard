'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkPageAccess } from '@/actions/Settings/Pages/queries';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import useAuthStore from '@/store/authStore';

interface PagePermissionGuardProps {
    children: React.ReactNode;
}

export default function PagePermissionGuard({ children }: PagePermissionGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const session = useAuthStore((state) => state.session);
    const [isChecking, setIsChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            if (!session?.user?.roles || pathname === '/admin/dashboard') {
                setIsChecking(false);
                setHasAccess(true);
                return;
            }

            try {
                const result = await checkPageAccess(pathname, session.user.roles);
                setHasAccess(result.hasAccess);
            } catch (error) {
                console.error('Error checking page access:', error);
                setHasAccess(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkAccess();
    }, [pathname, session?.user?.roles]);

    // Manejar la redirección en un useEffect separado
    useEffect(() => {
        if (!isChecking && !hasAccess) {
            router.push('/admin/unauthorized');
        }
    }, [isChecking, hasAccess, router]);

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!hasAccess) {
        return null;
    }

    return <>{children}</>;
}
