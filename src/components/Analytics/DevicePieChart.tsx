/**
 * Componente DevicePieChart - Gráfico circular de distribución por dispositivos
 * Muestra la distribución de sesiones por tipo de dispositivo
 */

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Smartphone, Monitor, Tablet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatPercentage, getChartColors } from '@/lib/analytics/utils';
import type { DeviceData } from '@/types/Analytics/AnalyticsInterface';

interface DevicePieChartProps {
    data: DeviceData[];
    title?: string;
    description?: string;
    showLegend?: boolean;
    className?: string;
}

// Mapear tipos de dispositivos a íconos y colores
const getDeviceConfig = (deviceCategory: string) => {
    const category = deviceCategory.toLowerCase();

    if (category.includes('mobile') || category.includes('móvil')) {
        return {
            icon: <Smartphone className="h-4 w-4" />,
            color: '#10b981', // Verde
            label: 'Móvil',
        };
    }

    if (category.includes('desktop') || category.includes('escritorio')) {
        return {
            icon: <Monitor className="h-4 w-4" />,
            color: '#2563eb', // Azul
            label: 'Escritorio',
        };
    }

    if (category.includes('tablet')) {
        return {
            icon: <Tablet className="h-4 w-4" />,
            color: '#f59e0b', // Amarillo
            label: 'Tablet',
        };
    }

    // Fallback para otros tipos
    return {
        icon: <Monitor className="h-4 w-4" />,
        color: '#6b7280', // Gris
        label: deviceCategory,
    };
};

// Tooltip personalizado
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const config = getDeviceConfig(data.deviceCategory);

        return (
            <div className="bg-background rounded-lg border p-3 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                    {config.icon}
                    <span className="font-medium">{config.label}</span>
                </div>
                <div className="space-y-1 text-sm">
                    <div>Sesiones: {formatNumber(data.sessions)}</div>
                    <div>Porcentaje: {formatPercentage(data.percentage)}</div>
                </div>
            </div>
        );
    }
    return null;
};

export default function DevicePieChart({
    data,
    title = 'Distribución por Dispositivos',
    description = 'Sesiones por tipo de dispositivo',
    showLegend = true,
    className,
}: DevicePieChartProps) {
    // Preparar datos para el gráfico con colores
    const chartData = data.map((item) => ({
        ...item,
        ...getDeviceConfig(item.deviceCategory),
    }));

    // Calcular total de sesiones
    const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0);

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>

                    {/* Badge con total */}
                    <Badge variant="outline">Total: {formatNumber(totalSessions)}</Badge>
                </div>
            </CardHeader>

            <CardContent>
                {data.length === 0 ? (
                    <div className="text-muted-foreground flex h-[300px] items-center justify-center">
                        <div className="text-center">
                            <p className="text-lg font-medium">Sin datos disponibles</p>
                            <p className="text-sm">
                                No se pudieron cargar los datos de dispositivos
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Gráfico circular */}
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        innerRadius={40}
                                        paddingAngle={2}
                                        dataKey="sessions"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Leyenda personalizada con detalles */}
                        <div className="grid grid-cols-1 gap-2">
                            {chartData.map((item, index) => (
                                <div
                                    key={`${item.deviceCategory}-${index}`}
                                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-2 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Indicador de color */}
                                        <div
                                            className="h-4 w-4 flex-shrink-0 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />

                                        {/* Ícono y nombre */}
                                        <div className="flex items-center gap-2">
                                            {item.icon}
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Métricas */}
                                    <div className="text-right">
                                        <div className="text-sm font-medium">
                                            {formatNumber(item.sessions)}
                                        </div>
                                        <div className="text-muted-foreground text-xs">
                                            {formatPercentage(item.percentage)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen adicional */}
                        <div className="border-t pt-2 text-center">
                            <p className="text-muted-foreground text-xs">
                                Datos basados en {formatNumber(totalSessions)} sesiones totales
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
