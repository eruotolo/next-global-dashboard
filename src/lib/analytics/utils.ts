/**
 * Utilidades para Google Analytics
 * Funciones helper para formateo y transformación de datos
 */

import { format, parseISO, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type {
    GoogleAnalyticsResponse,
    AnalyticsTrendData,
    TopPagesData,
    DeviceData,
    TrafficSourceData,
    AnalyticsMetrics,
} from '@/types/Analytics/AnalyticsInterface';

// Formatear fechas para Google Analytics API (YYYY-MM-DD)
export const formatDateForGA = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

// Formatear fechas para mostrar al usuario
export const formatDateForDisplay = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        return format(date, 'dd/MM/yyyy', { locale: es });
    } catch {
        return dateString;
    }
};

// Generar rangos de fechas comunes
export const getDateRanges = () => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const last7Days = subDays(today, 7);
    const last30Days = subDays(today, 30);
    const last90Days = subDays(today, 90);

    return {
        today: {
            startDate: formatDateForGA(today),
            endDate: formatDateForGA(today),
        },
        yesterday: {
            startDate: formatDateForGA(yesterday),
            endDate: formatDateForGA(yesterday),
        },
        last7Days: {
            startDate: formatDateForGA(last7Days),
            endDate: formatDateForGA(yesterday),
        },
        last30Days: {
            startDate: formatDateForGA(last30Days),
            endDate: formatDateForGA(yesterday),
        },
        last90Days: {
            startDate: formatDateForGA(last90Days),
            endDate: formatDateForGA(yesterday),
        },
    };
};

// Transformar respuesta de GA a datos de tendencias
export const transformToTrendData = (response: GoogleAnalyticsResponse): AnalyticsTrendData[] => {
    if (!response.rows) return [];

    return response.rows.map((row) => ({
        date: row.dimensionValues?.[0]?.value || '',
        sessions: parseInt(row.metricValues?.[0]?.value || '0'),
        pageViews: parseInt(row.metricValues?.[1]?.value || '0'),
        activeUsers: parseInt(row.metricValues?.[2]?.value || '0'),
    }));
};

// Transformar respuesta de GA a top de páginas
export const transformToTopPagesData = (response: GoogleAnalyticsResponse): TopPagesData[] => {
    if (!response.rows) return [];

    return response.rows.map((row) => ({
        pagePath: row.dimensionValues?.[0]?.value || '',
        pageTitle: row.dimensionValues?.[1]?.value || 'Sin título',
        pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
        uniquePageviews: parseInt(row.metricValues?.[0]?.value || '0'), // Usar pageViews como único valor
        userEngagementDuration: parseFloat(row.metricValues?.[1]?.value || '0'),
    }));
};

// Transformar respuesta de GA a datos de dispositivos
export const transformToDeviceData = (response: GoogleAnalyticsResponse): DeviceData[] => {
    if (!response.rows) return [];

    const total = response.rows.reduce((sum, row) => {
        return sum + parseInt(row.metricValues?.[0]?.value || '0');
    }, 0);

    return response.rows.map((row) => {
        const sessions = parseInt(row.metricValues?.[0]?.value || '0');
        return {
            deviceCategory: row.dimensionValues?.[0]?.value || '',
            sessions,
            percentage: total > 0 ? Math.round((sessions / total) * 100) : 0,
        };
    });
};

// Transformar respuesta de GA a fuentes de tráfico
export const transformToTrafficSourceData = (
    response: GoogleAnalyticsResponse,
): TrafficSourceData[] => {
    if (!response.rows) return [];

    const total = response.rows.reduce((sum, row) => {
        return sum + parseInt(row.metricValues?.[0]?.value || '0');
    }, 0);

    return response.rows.map((row) => {
        const sessions = parseInt(row.metricValues?.[0]?.value || '0');
        return {
            source: row.dimensionValues?.[0]?.value || '',
            medium: row.dimensionValues?.[1]?.value || '',
            sessions,
            percentage: total > 0 ? Math.round((sessions / total) * 100) : 0,
        };
    });
};

// Transformar respuesta de GA a métricas principales
export const transformToMetrics = (response: GoogleAnalyticsResponse): AnalyticsMetrics => {
    const totals = response.totals?.[0]?.metricValues || [];

    return {
        sessions: parseInt(totals[0]?.value || '0'),
        pageViews: parseInt(totals[1]?.value || '0'),
        engagementRate: parseFloat(totals[2]?.value || '0'),
        userEngagementDuration: parseFloat(totals[3]?.value || '0'),
        activeUsers: parseInt(totals[4]?.value || '0'),
    };
};

// Formatear números para mostrar (con separadores de miles)
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-ES').format(num);
};

// Formatear porcentajes
export const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
};

// Formatear duración en segundos a formato legible
export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes === 0) {
        return `${remainingSeconds}s`;
    }

    return `${minutes}m ${remainingSeconds}s`;
};

// Calcular cambio porcentual entre dos valores
export const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

// Validar respuesta de Google Analytics
export const validateGAResponse = (response: GoogleAnalyticsResponse): boolean => {
    return response && (response.rows !== undefined || response.totals !== undefined);
};

// Obtener colores para gráficos (consistentes con el tema)
export const getChartColors = () => ({
    primary: '#2563eb', // Azul principal
    success: '#10b981', // Verde (positivo)
    warning: '#f59e0b', // Amarillo (neutro)
    danger: '#ef4444', // Rojo (negativo)
    muted: '#6b7280', // Gris (secundario)
    background: '#f8fafc', // Fondo claro
    text: '#1f2937', // Texto principal
});

// Obtener configuración base para gráficos Recharts
export const getBaseChartConfig = () => ({
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
    colors: getChartColors(),
});
