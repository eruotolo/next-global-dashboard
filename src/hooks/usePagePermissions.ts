import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import { checkPageAccess } from '@/actions/Pages/queries';

interface UsePagePermissionsProps {
    path: string;
}

interface PagePermission {
    hasAccess: boolean;
    isLoading: boolean;
    error: string | null;
}

export const usePagePermissions = ({ path }: UsePagePermissionsProps): PagePermission => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const session = useAuthStore((state) => state.session);

    useEffect(() => {
        const verifyAccess = async () => {
            if (!session?.user) {
                setHasAccess(false);
                setIsLoading(false);
                return;
            }

            try {
                const normalizedPath = path.startsWith('/') ? path : `/${path}`;
                const result = await checkPageAccess(normalizedPath, session.user.roles);
                setHasAccess(result.hasAccess);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error checking permissions');
                setHasAccess(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAccess();
    }, [path, session]);

    return { hasAccess, isLoading, error };
}; 