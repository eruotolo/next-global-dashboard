/**
 * Hook useAnalytics - Gestión de datos Analytics con SWR
 * Maneja cache, revalidación automática y estados de carga
 */

'use client';

import useSWR from 'swr';
import { getAnalyticsDashboardData } from '@/actions/Analytics';
import type {
    AnalyticsDashboardData,
    UseAnalyticsReturn,
} from '@/types/Analytics/AnalyticsInterface';

interface UseAnalyticsOptions {
    startDate?: string;
    endDate?: string;
    refreshInterval?: number;
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
}

// Función fetcher que llama a la Server Action
const fetcher = async (params?: {
    startDate?: string;
    endDate?: string;
}): Promise<AnalyticsDashboardData> => {
    try {
        return await getAnalyticsDashboardData(params);
    } catch (error) {
        console.error('Error en fetcher de Analytics:', error);
        throw error;
    }
};

// Hook principal para Analytics
export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
    const {
        startDate,
        endDate,
        refreshInterval = 5 * 60 * 1000, // 5 minutos por defecto
        revalidateOnFocus = false,
        revalidateOnReconnect = true,
    } = options;

    // Crear clave única para SWR basada en los parámetros
    const swrKey =
        startDate || endDate
            ? ['analytics-dashboard', { startDate, endDate }]
            : 'analytics-dashboard';

    // Configurar SWR
    const { data, error, isLoading, isValidating, mutate } = useSWR(
        swrKey,
        () => fetcher(startDate || endDate ? { startDate, endDate } : undefined),
        {
            refreshInterval,
            revalidateOnFocus,
            revalidateOnReconnect,
            revalidateIfStale: true,
            revalidateOnMount: true,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            onError: (error) => {
                console.error('Error en useAnalytics:', error);
            },
            onSuccess: (data) => {
                console.log('Datos de Analytics cargados exitosamente:', data?.lastUpdated);
            },
        },
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    };
}

// Hook específico para métricas principales (más ligero)
export function useAnalyticsMetrics(options: UseAnalyticsOptions = {}) {
    const { data, error, isLoading, isValidating, mutate } = useAnalytics(options);

    return {
        metrics: data?.metrics,
        error,
        isLoading,
        isValidating,
        refresh: mutate,
    };
}

// Hook específico para tendencias
export function useAnalyticsTrends(options: UseAnalyticsOptions = {}) {
    const { data, error, isLoading, isValidating, mutate } = useAnalytics(options);

    return {
        trends: data?.trends || [],
        error,
        isLoading,
        isValidating,
        refresh: mutate,
    };
}

// Hook específico para páginas top
export function useTopPages(options: UseAnalyticsOptions = {}) {
    const { data, error, isLoading, isValidating, mutate } = useAnalytics(options);

    return {
        topPages: data?.topPages || [],
        error,
        isLoading,
        isValidating,
        refresh: mutate,
    };
}

// Hook específico para dispositivos
export function useDeviceData(options: UseAnalyticsOptions = {}) {
    const { data, error, isLoading, isValidating, mutate } = useAnalytics(options);

    return {
        devices: data?.devices || [],
        error,
        isLoading,
        isValidating,
        refresh: mutate,
    };
}

// Hook para gestionar el estado de conexión de Analytics
export function useAnalyticsStatus() {
    const { data, error, isLoading } = useSWR(
        'analytics-status',
        async () => {
            const { testAnalyticsConnection } = await import('@/actions/Analytics');
            return testAnalyticsConnection();
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: 30 * 60 * 1000, // 30 minutos
        },
    );

    return {
        isConnected: data?.success ?? false,
        connectionMessage: data?.message,
        isChecking: isLoading,
        error,
    };
}

// Utilidad para precargar datos de Analytics
export function preloadAnalytics(options: UseAnalyticsOptions = {}) {
    const { startDate, endDate } = options;

    // Simplificado - solo ejecuta la función fetcher directamente
    const params = startDate || endDate ? { startDate, endDate } : undefined;
    return fetcher(params);
}

// Hook para limpiar cache de Analytics
export function useClearAnalyticsCache() {
    const clearCache = () => {
        // Usar el mutate de SWR global para limpiar cache
        const { mutate } = useSWR('analytics-dashboard', null);
        mutate(undefined, { revalidate: false });
    };

    return clearCache;
}
