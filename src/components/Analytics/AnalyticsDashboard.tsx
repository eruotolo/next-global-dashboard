/**
 * Componente AnalyticsDashboard - Dashboard principal de Google Analytics
 * Dashboard optimizado con datos históricos confiables
 */

'use client';

import { Activity, Clock, Eye, MousePointer, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';

import DevicePieChart from './DevicePieChart';
import ErrorCard from './ErrorCard';
import LoadingCard from './LoadingCard';
import MetricCard from './MetricCard';
import NoConfigCard from './NoConfigCard';
import TopPagesTable from './TopPagesTable';
import TrendChart from './TrendChart';

/**
 * Componente AnalyticsDashboard - Dashboard principal de Google Analytics
 * Dashboard optimizado con datos históricos confiables
 */

/**
 * Componente AnalyticsDashboard - Dashboard principal de Google Analytics
 * Dashboard optimizado con datos históricos confiables
 */

/**
 * Componente AnalyticsDashboard - Dashboard principal de Google Analytics
 * Dashboard optimizado con datos históricos confiables
 */

/**
 * Componente AnalyticsDashboard - Dashboard principal de Google Analytics
 * Dashboard optimizado con datos históricos confiables
 */

/**
 * Componente AnalyticsDashboard - Dashboard principal de Google Analytics
 * Dashboard optimizado con datos históricos confiables
 */

interface AnalyticsDashboardProps {
    className?: string;
    startDate?: string;
    endDate?: string;
}

export default function AnalyticsDashboard({
    className,
    startDate,
    endDate,
}: AnalyticsDashboardProps) {
    // Hook optimizado para datos históricos con refresh mejorado
    const { data, error, isLoading, isValidating, mutate } = useAnalytics({
        startDate,
        endDate,
        refreshInterval: 2 * 60 * 1000, // 2 minutos para datos más frescos
    });

    // Función para refrescar manualmente
    const handleRefresh = () => {
        mutate();
    };

    // Verificar si la configuración está incompleta usando los datos
    const configStatus = data?.configurationStatus;
    const isConfigIncomplete = configStatus && !configStatus.isConfigured;

    // Mostrar loading en la primera carga
    if (isLoading && !data) {
        return (
            <div className={cn('space-y-6', className)}>
                {/* Header con loading */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Dashboard de Analytics</h2>
                        <p className="text-muted-foreground">
                            Cargando datos de Google Analytics...
                        </p>
                    </div>
                    <Button disabled variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Cargando...
                    </Button>
                </div>

                {/* Grid con componentes de loading */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <LoadingCard type="metric" />
                    <LoadingCard type="metric" />
                    <LoadingCard type="metric" />
                    <LoadingCard type="chart" className="md:col-span-3" />
                    <LoadingCard type="table" className="md:col-span-2" />
                    <LoadingCard type="pie" />
                </div>
            </div>
        );
    }

    // Mostrar configuración incompleta
    if (isConfigIncomplete) {
        return (
            <div className={cn('space-y-6', className)}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Dashboard de Analytics</h2>
                        <p className="text-muted-foreground">
                            Configuración de Google Analytics requerida
                        </p>
                    </div>
                </div>

                {/* Card de configuración */}
                <NoConfigCard
                    missingVariables={configStatus?.missingVariables || []}
                    error={configStatus?.error}
                />
            </div>
        );
    }

    // Mostrar error de API si hay problemas (no de configuración)
    if (error && !data) {
        return (
            <div className={cn('space-y-6', className)}>
                {/* Header con error */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Dashboard de Analytics</h2>
                        <p className="text-muted-foreground text-destructive">
                            Error al cargar datos de Google Analytics
                        </p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reintentar
                    </Button>
                </div>

                {/* Error card principal */}
                <ErrorCard
                    error={error}
                    onRetry={handleRefresh}
                    title="Error en Dashboard de Analytics"
                    className="md:col-span-3"
                />
            </div>
        );
    }

    return (
        <div className={cn('space-y-6', className)}>
            {/* Header con información y controles */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Dashboard de Analytics</h2>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Última actualización:{' '}
                            {data?.lastUpdated
                                ? new Date(data.lastUpdated).toLocaleString('es-ES')
                                : 'Nunca'}
                        </span>
                        {isValidating && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                Actualizando...
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Botón de refresh manual */}
                <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isValidating}>
                    <RefreshCw className={cn('mr-2 h-4 w-4', isValidating && 'animate-spin')} />
                    Actualizar
                </Button>
            </div>

            {/* Grid principal con componentes */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {/* Fila 1: Métricas principales */}
                <MetricCard
                    title="Sesiones"
                    value={data?.metrics?.sessions || 0}
                    format="number"
                    description="Total de sesiones (últimos 30 días)"
                    icon={<Activity className="h-4 w-4" />}
                />

                <MetricCard
                    title="Páginas Vistas"
                    value={data?.metrics?.pageViews || 0}
                    format="number"
                    description="Visualizaciones totales de páginas (últimos 30 días)"
                    icon={<Eye className="h-4 w-4" />}
                />

                <MetricCard
                    title="Tasa de Compromiso"
                    value={data?.metrics?.engagementRate || 0}
                    format="percentage"
                    description="Porcentaje de sesiones comprometidas"
                    icon={<MousePointer className="h-4 w-4" />}
                />

                {/* Fila 2: Gráfico de tendencias (spanning 3 columnas) */}
                <div className="md:col-span-3">
                    {error ? (
                        <ErrorCard error={error} onRetry={handleRefresh} type="chart" />
                    ) : (
                        <TrendChart
                            data={data?.trends || []}
                            title="Tendencias (Últimos 30 días)"
                            description="Evolución de métricas principales en el tiempo"
                        />
                    )}
                </div>

                {/* Fila 3: Top páginas (2 columnas) + Dispositivos (1 columna) */}
                <div className="md:col-span-2">
                    {error ? (
                        <ErrorCard error={error} onRetry={handleRefresh} type="table" />
                    ) : (
                        <TopPagesTable
                            data={data?.topPages || []}
                            title="Páginas Más Visitadas"
                            description="Top páginas por número de visualizaciones"
                            limit={8}
                        />
                    )}
                </div>

                <div>
                    {error ? (
                        <ErrorCard error={error} onRetry={handleRefresh} type="pie" />
                    ) : (
                        <DevicePieChart
                            data={data?.devices || []}
                            title="Dispositivos"
                            description="Distribución por tipo de dispositivo"
                        />
                    )}
                </div>
            </div>

            {/* Footer con información adicional */}
            <div className="text-muted-foreground border-t pt-4 text-center text-xs">
                <p>
                    Datos proporcionados por Google Analytics 4 • Actualización automática cada 2
                    minutos • Última sincronización:{' '}
                    {data?.lastUpdated
                        ? new Date(data.lastUpdated).toLocaleTimeString('es-ES')
                        : 'Pendiente'}
                </p>
            </div>
        </div>
    );
}
