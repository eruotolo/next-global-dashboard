import { useEffect, useRef, useState } from 'react';
import { checkPageAccess } from '@/actions/Settings/Pages/queries';
import useAuthStore from '@/store/authStore';

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
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const lastCheckedRef = useRef<{ path: string; roles: string[] } | null>(null);

    useEffect(() => {
        let isMounted = true;

        const verifyAccess = async () => {
            if (!isInitialized || !session?.user?.roles || !path) {
                if (isMounted) {
                    setHasAccess(false);
                    setIsLoading(false);
                }
                return;
            }

            const roles = session.user.roles;

            // Verificar si ya tenemos el resultado en caché
            if (
                lastCheckedRef.current &&
                lastCheckedRef.current.path === path &&
                JSON.stringify(lastCheckedRef.current.roles) === JSON.stringify(roles)
            ) {
                return;
            }

            try {
                const normalizedPath = path.startsWith('/') ? path : `/${path}`;
                const result = await checkPageAccess(normalizedPath, roles);

                if (isMounted) {
                    setHasAccess(result.hasAccess);
                    lastCheckedRef.current = { path, roles };
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Error checking permissions');
                    setHasAccess(false);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        setIsLoading(true);
        verifyAccess();

        return () => {
            isMounted = false;
        };
    }, [path, session?.user?.roles, isInitialized]);

    return { hasAccess, isLoading, error };
};
