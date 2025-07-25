/**
 * Server Actions para Google Analytics Data API v1
 * Consultas y obtención de datos desde GA4
 */

'use server';

import {
    getAnalyticsClient,
    getAnalyticsPublicConfig,
    ANALYTICS_CONSTANTS,
    checkAnalyticsConfiguration,
} from '@/lib/analytics/client';
import {
    getDateRanges,
    transformToTrendData,
    transformToTopPagesData,
    transformToDeviceData,
    transformToTrafficSourceData,
    transformToMetrics,
    validateGAResponse,
} from '@/lib/analytics/utils';
import type {
    AnalyticsDashboardData,
    AnalyticsMetrics,
    AnalyticsTrendData,
    TopPagesData,
    DeviceData,
    TrafficSourceData,
    AnalyticsQueryParams,
    AnalyticsConfigurationStatus,
} from '@/types/Analytics/AnalyticsInterface';

// Obtener métricas principales del dashboard
export async function getAnalyticsMetrics(
    startDate: string,
    endDate: string,
): Promise<AnalyticsMetrics> {
    try {
        const client = getAnalyticsClient();
        const { propertyId } = getAnalyticsPublicConfig();

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            metrics: [
                { name: ANALYTICS_CONSTANTS.METRICS.SESSIONS },
                { name: ANALYTICS_CONSTANTS.METRICS.PAGE_VIEWS },
                { name: ANALYTICS_CONSTANTS.METRICS.ENGAGEMENT_RATE },
                { name: ANALYTICS_CONSTANTS.METRICS.USER_ENGAGEMENT_DURATION },
                { name: ANALYTICS_CONSTANTS.METRICS.ACTIVE_USERS },
            ],
        });

        if (!validateGAResponse(response)) {
            throw new Error('Respuesta inválida de Google Analytics');
        }

        return transformToMetrics(response);
    } catch (error) {
        console.error('Error al obtener métricas de Analytics:', error);
        throw new Error(
            `Error al obtener métricas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    }
}

// Obtener datos de tendencias (últimos 30 días)
export async function getAnalyticsTrends(
    startDate: string,
    endDate: string,
): Promise<AnalyticsTrendData[]> {
    try {
        const client = getAnalyticsClient();
        const { propertyId } = getAnalyticsPublicConfig();

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: ANALYTICS_CONSTANTS.DIMENSIONS.DATE }],
            metrics: [
                { name: ANALYTICS_CONSTANTS.METRICS.SESSIONS },
                { name: ANALYTICS_CONSTANTS.METRICS.PAGE_VIEWS },
                { name: ANALYTICS_CONSTANTS.METRICS.ACTIVE_USERS },
            ],
            orderBys: [{ dimension: { dimensionName: ANALYTICS_CONSTANTS.DIMENSIONS.DATE } }],
        });

        if (!validateGAResponse(response)) {
            throw new Error('Respuesta inválida de Google Analytics');
        }

        return transformToTrendData(response);
    } catch (error) {
        console.error('Error al obtener tendencias de Analytics:', error);
        throw new Error(
            `Error al obtener tendencias: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    }
}

// Obtener top de páginas más visitadas
export async function getTopPages(
    startDate: string,
    endDate: string,
    limit: number = 10,
): Promise<TopPagesData[]> {
    try {
        const client = getAnalyticsClient();
        const { propertyId } = getAnalyticsPublicConfig();

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [
                { name: ANALYTICS_CONSTANTS.DIMENSIONS.PAGE_PATH },
                { name: ANALYTICS_CONSTANTS.DIMENSIONS.PAGE_TITLE },
            ],
            metrics: [
                { name: ANALYTICS_CONSTANTS.METRICS.PAGE_VIEWS },
                { name: ANALYTICS_CONSTANTS.METRICS.USER_ENGAGEMENT_DURATION },
            ],
            orderBys: [
                { metric: { metricName: ANALYTICS_CONSTANTS.METRICS.PAGE_VIEWS }, desc: true },
            ],
            limit,
        });

        if (!validateGAResponse(response)) {
            throw new Error('Respuesta inválida de Google Analytics');
        }

        return transformToTopPagesData(response);
    } catch (error) {
        console.error('Error al obtener top páginas de Analytics:', error);
        throw new Error(
            `Error al obtener top páginas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    }
}

// Obtener distribución por dispositivos
export async function getDeviceData(startDate: string, endDate: string): Promise<DeviceData[]> {
    try {
        const client = getAnalyticsClient();
        const { propertyId } = getAnalyticsPublicConfig();

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: ANALYTICS_CONSTANTS.DIMENSIONS.DEVICE_CATEGORY }],
            metrics: [{ name: ANALYTICS_CONSTANTS.METRICS.SESSIONS }],
            orderBys: [
                { metric: { metricName: ANALYTICS_CONSTANTS.METRICS.SESSIONS }, desc: true },
            ],
        });

        if (!validateGAResponse(response)) {
            throw new Error('Respuesta inválida de Google Analytics');
        }

        return transformToDeviceData(response);
    } catch (error) {
        console.error('Error al obtener datos de dispositivos:', error);
        throw new Error(
            `Error al obtener datos de dispositivos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    }
}

// Obtener fuentes de tráfico
export async function getTrafficSources(
    startDate: string,
    endDate: string,
    limit: number = 10,
): Promise<TrafficSourceData[]> {
    try {
        const client = getAnalyticsClient();
        const { propertyId } = getAnalyticsPublicConfig();

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [
                { name: ANALYTICS_CONSTANTS.DIMENSIONS.SOURCE },
                { name: ANALYTICS_CONSTANTS.DIMENSIONS.MEDIUM },
            ],
            metrics: [{ name: ANALYTICS_CONSTANTS.METRICS.SESSIONS }],
            orderBys: [
                { metric: { metricName: ANALYTICS_CONSTANTS.METRICS.SESSIONS }, desc: true },
            ],
            limit,
        });

        if (!validateGAResponse(response)) {
            throw new Error('Respuesta inválida de Google Analytics');
        }

        return transformToTrafficSourceData(response);
    } catch (error) {
        console.error('Error al obtener fuentes de tráfico:', error);
        throw new Error(
            `Error al obtener fuentes de tráfico: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    }
}

// Obtener datos completos del dashboard
export async function getAnalyticsDashboardData(params?: {
    startDate?: string;
    endDate?: string;
}): Promise<AnalyticsDashboardData> {
    // Verificar configuración antes de hacer cualquier consulta
    const configCheck = checkAnalyticsConfiguration();
    if (!configCheck.isConfigured) {
        // Retornar respuesta con datos vacíos pero información de configuración
        return {
            metrics: {
                sessions: 0,
                pageViews: 0,
                engagementRate: 0,
                userEngagementDuration: 0,
                activeUsers: 0,
            },
            trends: [],
            topPages: [],
            devices: [],
            trafficSources: [],
            lastUpdated: new Date().toISOString(),
            configurationStatus: {
                isConfigured: false,
                missingVariables: configCheck.missingVariables,
                error: configCheck.error,
            },
        };
    }

    try {
        // Usar últimos 30 días por defecto
        const dateRanges = getDateRanges();
        const startDate = params?.startDate || dateRanges.last30Days.startDate;
        const endDate = params?.endDate || dateRanges.last30Days.endDate;

        // Ejecutar todas las consultas en paralelo
        const [metrics, trends, topPages, devices, trafficSources] = await Promise.all([
            getAnalyticsMetrics(startDate, endDate),
            getAnalyticsTrends(startDate, endDate),
            getTopPages(startDate, endDate, 10),
            getDeviceData(startDate, endDate),
            getTrafficSources(startDate, endDate, 10),
        ]);

        return {
            metrics,
            trends,
            topPages,
            devices,
            trafficSources,
            lastUpdated: new Date().toISOString(),
            configurationStatus: {
                isConfigured: true,
                missingVariables: [],
            },
        };
    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        throw new Error(
            `Error al obtener datos del dashboard: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    }
}

// Función de testing para verificar conexión
export async function testAnalyticsConnection(): Promise<{ success: boolean; message: string }> {
    try {
        const client = getAnalyticsClient();
        const { propertyId } = getAnalyticsPublicConfig();
        const dateRanges = getDateRanges();

        // Hacer una consulta simple para verificar la conexión
        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRanges.yesterday],
            metrics: [{ name: ANALYTICS_CONSTANTS.METRICS.ACTIVE_USERS }],
            limit: 1,
        });

        if (!validateGAResponse(response)) {
            throw new Error('Respuesta inválida de Google Analytics');
        }

        return {
            success: true,
            message: 'Conexión con Google Analytics exitosa',
        };
    } catch (error) {
        console.error('Error en test de conexión:', error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Error desconocido al conectar con Analytics',
        };
    }
}
