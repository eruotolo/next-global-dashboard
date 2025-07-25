/**
 * Funciones de testing para Google Analytics
 * Herramientas para verificar configuración y conexión
 */

import { validateAnalyticsConfig } from './client';
import { testAnalyticsConnection } from '@/actions/Analytics/queries';

// Verificar configuración sin conectar a la API
export const checkAnalyticsConfig = () => {
    const results = {
        propertyId: false,
        serviceAccount: false,
        refreshInterval: false,
        overall: false,
    };

    try {
        // Verificar GOOGLE_ANALYTICS_PROPERTY_ID
        const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
        if (propertyId && propertyId !== 'TU_GA4_PROPERTY_ID_AQUI') {
            results.propertyId = true;
        }

        // Verificar GOOGLE_SERVICE_ACCOUNT_KEY
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey && !serviceAccountKey.includes('TU_PRIVATE_KEY_AQUI')) {
            try {
                const parsed = JSON.parse(serviceAccountKey);
                if (
                    parsed.type === 'service_account' &&
                    parsed.private_key &&
                    parsed.client_email
                ) {
                    results.serviceAccount = true;
                }
            } catch {
                results.serviceAccount = false;
            }
        }

        // Verificar ANALYTICS_REFRESH_INTERVAL
        const refreshInterval = process.env.ANALYTICS_REFRESH_INTERVAL;
        if (refreshInterval && !isNaN(parseInt(refreshInterval))) {
            results.refreshInterval = true;
        }

        // Verificar configuración completa usando la función de validación
        results.overall = validateAnalyticsConfig();

        return results;
    } catch (error) {
        console.error('Error al verificar configuración:', error);
        return results;
    }
};

// Función completa de diagnóstico
export const runAnalyticsDiagnostics = async () => {
    console.log('🔍 Iniciando diagnóstico de Google Analytics...\n');

    // 1. Verificar variables de entorno
    console.log('📋 Verificando configuración...');
    const config = checkAnalyticsConfig();

    console.log(`  ✓ Property ID: ${config.propertyId ? '✅' : '❌'}`);
    console.log(`  ✓ Service Account: ${config.serviceAccount ? '✅' : '❌'}`);
    console.log(`  ✓ Refresh Interval: ${config.refreshInterval ? '✅' : '❌'}`);
    console.log(`  ✓ Configuración general: ${config.overall ? '✅' : '❌'}\n`);

    // 2. Si la configuración es válida, probar conexión
    if (config.overall) {
        console.log('🌐 Probando conexión con Google Analytics...');
        try {
            const connectionTest = await testAnalyticsConnection();

            if (connectionTest.success) {
                console.log(`  ✅ ${connectionTest.message}`);
                console.log('\n🎉 ¡Analytics configurado correctamente!');
                return { success: true, message: 'Configuración completa y funcional' };
            } else {
                console.log(`  ❌ ${connectionTest.message}`);
                console.log(
                    '\n⚠️  La configuración parece correcta pero no se puede conectar a la API.',
                );
                return { success: false, message: connectionTest.message };
            }
        } catch (error) {
            console.log(
                `  ❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            );
            return { success: false, message: 'Error al probar conexión' };
        }
    } else {
        console.log('❌ La configuración está incompleta. Revisa las variables de entorno.\n');

        // Dar instrucciones específicas
        if (!config.propertyId) {
            console.log('🔧 Para configurar GOOGLE_ANALYTICS_PROPERTY_ID:');
            console.log('   1. Ve a https://analytics.google.com');
            console.log('   2. Selecciona tu propiedad GA4');
            console.log('   3. Ve a Admin > Property Settings');
            console.log('   4. Copia el Property ID (números solamente)\n');
        }

        if (!config.serviceAccount) {
            console.log('🔧 Para configurar GOOGLE_SERVICE_ACCOUNT_KEY:');
            console.log('   1. Ve a https://console.cloud.google.com');
            console.log('   2. Crea o selecciona un proyecto');
            console.log('   3. Habilita Google Analytics Data API');
            console.log('   4. Crea un Service Account y descarga el JSON');
            console.log('   5. Copia todo el contenido JSON como string en la variable\n');
        }

        return { success: false, message: 'Configuración incompleta' };
    }
};

// Función específica para mostrar el estado actual
export const getAnalyticsStatus = () => {
    const config = checkAnalyticsConfig();

    return {
        configured: config.overall,
        details: {
            propertyId: config.propertyId,
            serviceAccount: config.serviceAccount,
            refreshInterval: config.refreshInterval,
        },
        message: config.overall
            ? 'Analytics está correctamente configurado'
            : 'Analytics requiere configuración adicional',
    };
};
