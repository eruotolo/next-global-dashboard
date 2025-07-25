/**
 * Interfaces para Google Analytics Data API v1
 * Tipos TypeScript para el Dashboard de Analytics
 */

// Métricas principales del dashboard
export interface AnalyticsMetrics {
    sessions: number;
    pageViews: number;
    engagementRate: number;
    userEngagementDuration: number;
    activeUsers: number;
}

// Datos para gráficos de tendencias (líneas)
export interface AnalyticsTrendData {
    date: string;
    sessions: number;
    pageViews: number;
    activeUsers: number;
}

// Top de páginas más visitadas
export interface TopPagesData {
    pagePath: string;
    pageTitle: string;
    pageViews: number;
    uniquePageviews: number;
    userEngagementDuration: number;
}

// Distribución por dispositivos
export interface DeviceData {
    deviceCategory: string;
    sessions: number;
    percentage: number;
}

// Fuentes de tráfico
export interface TrafficSourceData {
    source: string;
    medium: string;
    sessions: number;
    percentage: number;
}

// Estado de configuración de Analytics
export interface AnalyticsConfigurationStatus {
    isConfigured: boolean;
    missingVariables: string[];
    error?: string;
}

// Datos completos del dashboard
export interface AnalyticsDashboardData {
    metrics: AnalyticsMetrics;
    trends: AnalyticsTrendData[];
    topPages: TopPagesData[];
    devices: DeviceData[];
    trafficSources: TrafficSourceData[];
    lastUpdated: string;
    configurationStatus?: AnalyticsConfigurationStatus; // Para indicar problemas de configuración
}

// Parámetros para queries de Analytics
export interface AnalyticsQueryParams {
    startDate: string;
    endDate: string;
    propertyId: string;
}

// Respuesta de la API de Google Analytics
export interface GoogleAnalyticsResponse {
    rows?: Array<{
        dimensionValues?: Array<{ value?: string | null }> | null;
        metricValues?: Array<{ value?: string | null }> | null;
    }> | null;
    totals?: Array<{
        metricValues?: Array<{ value?: string | null }> | null;
    }> | null;
}

// Estados de carga y error
export interface AnalyticsState {
    data: AnalyticsDashboardData | null;
    isLoading: boolean;
    error: string | null;
    lastFetch: Date | null;
}

// Configuración del cliente Analytics
export interface AnalyticsConfig {
    propertyId: string;
    serviceAccountKey: string;
    refreshInterval: number;
}

// Métricas comparativas (para comparar períodos)
export interface ComparativeMetrics {
    current: AnalyticsMetrics;
    previous: AnalyticsMetrics;
    changePercentage: {
        sessions: number;
        pageViews: number;
        engagementRate: number;
        userEngagementDuration: number;
        activeUsers: number;
    };
}

// Filtros para el dashboard
export interface AnalyticsFilters {
    dateRange: {
        startDate: string;
        endDate: string;
    };
    deviceCategory?: string;
    country?: string;
    source?: string;
}

// Tipo para los hooks de SWR
export interface UseAnalyticsReturn {
    data: AnalyticsDashboardData | undefined;
    error: Error | undefined;
    isLoading: boolean;
    isValidating: boolean;
    mutate: () => void;
}
