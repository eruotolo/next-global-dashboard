/**
 * Cliente de Google Analytics Data API v1
 * Configuración y instancia para conectar con GA4
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import type { AnalyticsConfig } from '@/types/Analytics/AnalyticsInterface';

// Configuración del cliente Analytics
const getAnalyticsConfig = (): AnalyticsConfig => {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const refreshInterval = parseInt(process.env.ANALYTICS_REFRESH_INTERVAL || '300000');

    if (!propertyId) {
        throw new Error(
            'GOOGLE_ANALYTICS_PROPERTY_ID no está configurado en las variables de entorno',
        );
    }

    if (!serviceAccountKey) {
        throw new Error(
            'GOOGLE_SERVICE_ACCOUNT_KEY no está configurado en las variables de entorno',
        );
    }

    return {
        propertyId,
        serviceAccountKey,
        refreshInterval,
    };
};

// Crear cliente de Google Analytics Data API
const createAnalyticsClient = (): BetaAnalyticsDataClient => {
    try {
        const config = getAnalyticsConfig();
        const credentials = JSON.parse(config.serviceAccountKey);

        return new BetaAnalyticsDataClient({
            credentials,
        });
    } catch (error) {
        console.error('Error al crear cliente de Analytics:', error);
        throw new Error(
            `Error de configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    }
};

// Instancia singleton del cliente
let analyticsClient: BetaAnalyticsDataClient | null = null;

export const getAnalyticsClient = (): BetaAnalyticsDataClient => {
    if (!analyticsClient) {
        analyticsClient = createAnalyticsClient();
    }
    return analyticsClient;
};

// Obtener configuración pública
export const getAnalyticsPublicConfig = () => {
    const config = getAnalyticsConfig();
    return {
        propertyId: config.propertyId,
        refreshInterval: config.refreshInterval,
    };
};

// Validar configuración sin crear cliente
export const validateAnalyticsConfig = (): boolean => {
    try {
        const config = getAnalyticsConfig();
        const credentials = JSON.parse(config.serviceAccountKey);

        // Validar campos requeridos del service account
        const requiredFields = [
            'type',
            'project_id',
            'private_key_id',
            'private_key',
            'client_email',
            'client_id',
        ];

        const isValid = requiredFields.every((field) => field in credentials && credentials[field]);

        return isValid && credentials.type === 'service_account';
    } catch (error) {
        console.error('Error al validar configuración de Analytics:', error);
        return false;
    }
};

// Verificar si la configuración de Analytics está completa
export const checkAnalyticsConfiguration = (): {
    isConfigured: boolean;
    missingVariables: string[];
    error?: string;
} => {
    const missingVariables: string[] = [];

    // Verificar variables de entorno requeridas
    if (!process.env.GOOGLE_ANALYTICS_PROPERTY_ID) {
        missingVariables.push('GOOGLE_ANALYTICS_PROPERTY_ID');
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        missingVariables.push('GOOGLE_SERVICE_ACCOUNT_KEY');
    }

    // Si faltan variables básicas, no validar JSON
    if (missingVariables.length > 0) {
        return {
            isConfigured: false,
            missingVariables,
        };
    }

    // Validar formato JSON del service account
    try {
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
        const credentials = JSON.parse(serviceAccountKey);

        const requiredFields = [
            'type',
            'project_id',
            'private_key_id',
            'private_key',
            'client_email',
            'client_id',
        ];

        const missingFields = requiredFields.filter((field) => !credentials[field]);

        if (missingFields.length > 0) {
            return {
                isConfigured: false,
                missingVariables: missingFields.map(
                    (field) => `GOOGLE_SERVICE_ACCOUNT_KEY.${field}`,
                ),
                error: `Service Account JSON incompleto: faltan campos ${missingFields.join(', ')}`,
            };
        }

        if (credentials.type !== 'service_account') {
            return {
                isConfigured: false,
                missingVariables: ['GOOGLE_SERVICE_ACCOUNT_KEY.type'],
                error: 'El JSON debe ser de tipo "service_account"',
            };
        }

        return {
            isConfigured: true,
            missingVariables: [],
        };
    } catch (error) {
        return {
            isConfigured: false,
            missingVariables: ['GOOGLE_SERVICE_ACCOUNT_KEY'],
            error: `JSON inválido en GOOGLE_SERVICE_ACCOUNT_KEY: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        };
    }
};

// Constantes para queries comunes
export const ANALYTICS_CONSTANTS = {
    // Dimensiones comunes
    DIMENSIONS: {
        DATE: 'date',
        PAGE_PATH: 'pagePath',
        PAGE_TITLE: 'pageTitle',
        DEVICE_CATEGORY: 'deviceCategory',
        SOURCE: 'sessionSource',
        MEDIUM: 'sessionMedium',
        COUNTRY: 'country',
    },

    // Métricas comunes
    METRICS: {
        SESSIONS: 'sessions',
        PAGE_VIEWS: 'screenPageViews',
        ACTIVE_USERS: 'activeUsers',
        ENGAGEMENT_RATE: 'engagementRate',
        USER_ENGAGEMENT_DURATION: 'userEngagementDuration',
        // UNIQUE_PAGEVIEWS no existe en GA4 - usar screenPageViews
        // AVG_TIME_ON_PAGE no existe en GA4 - usar userEngagementDuration
    },

    // Rangos de fechas predefinidos
    DATE_RANGES: {
        TODAY: 'today',
        YESTERDAY: 'yesterday',
        LAST_7_DAYS: '7daysAgo',
        LAST_30_DAYS: '30daysAgo',
        LAST_90_DAYS: '90daysAgo',
    },
} as const;
