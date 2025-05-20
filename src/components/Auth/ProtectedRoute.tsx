'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useUserPermissionStore } from '@/store/useUserPermissionStore';
import useAuthStore from '@/store/authStore';

interface ProtectedRouteProps {
    children: ReactNode;
    permissions?: string[];
    roles?: string[];
    fallbackPath?: string;
}

export default function ProtectedRoute({
    children,
    permissions = [],
    roles = [],
    fallbackPath = '/admin/unauthorized',
}: ProtectedRouteProps) {
    const router = useRouter();
    const hasAnyRole = useUserPermissionStore((state) => state.hasAnyRole);
    const session = useAuthStore((state) => state.session);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Solo verificamos roles, ignoramos permisos
    const hasRequiredRole = roles.length === 0 || hasAnyRole(roles);

    // Efecto para cargar la sesión si no está disponible
    useEffect(() => {
        const fetchSessionData = async () => {
            if (!session) {
                await useAuthStore.getState().fetchSession();
            }
            setIsLoading(false);
            setIsInitialLoad(false);
        };

        fetchSessionData();
    }, [session]);

    // Efecto para manejar redirecciones solo después de que la sesión se haya cargado
    useEffect(() => {
        // No hacer nada durante la carga inicial
        if (isInitialLoad) return;

        // Solo redirigir si no estamos cargando
        if (!isLoading) {
            if (!session) {
                router.push('/login');
                return;
            }

            if (!hasRequiredRole) {
                router.push(fallbackPath);
            }
        }
    }, [session, hasRequiredRole, router, fallbackPath, isLoading, isInitialLoad]);

    // Mostrar un estado de carga mientras se verifica la sesión
    if (isLoading) {
        return <div>Cargando...</div>; // O un componente de carga más elaborado
    }

    // Si no hay sesión o no tiene los roles requeridos después de cargar, no mostrar nada
    if (!session || !hasRequiredRole) {
        return null;
    }

    return <>{children}</>;
}
