/**
 * Componente TrendChart - Gráfico de líneas para tendencias
 * Muestra evolución de métricas en el tiempo usando Recharts
 */

'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateForDisplay, formatNumber, getChartColors } from '@/lib/analytics/utils';
import type { AnalyticsTrendData } from '@/types/Analytics/AnalyticsInterface';

interface TrendChartProps {
    data: AnalyticsTrendData[];
    title?: string;
    description?: string;
    height?: number;
    className?: string;
}

// Tooltip personalizado para el gráfico
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background rounded-lg border p-3 shadow-md">
                <p className="mb-2 font-medium">{formatDateForDisplay(label)}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="capitalize">{entry.dataKey}:</span>
                        <span className="font-medium">{formatNumber(entry.value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function TrendChart({
    data,
    title = 'Tendencias (Últimos 30 días)',
    description = 'Evolución de métricas principales',
    height = 300,
    className,
}: TrendChartProps) {
    const colors = getChartColors();

    // Calcular totales para mostrar en badges
    const totals = data.reduce(
        (acc, item) => ({
            sessions: acc.sessions + item.sessions,
            pageViews: acc.pageViews + item.pageViews,
            activeUsers: acc.activeUsers + item.activeUsers,
        }),
        { sessions: 0, pageViews: 0, activeUsers: 0 },
    );

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>

                    {/* Badges con totales */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                            Sesiones: {formatNumber(totals.sessions)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            Páginas: {formatNumber(totals.pageViews)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            Usuarios: {formatNumber(totals.activeUsers)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {data.length === 0 ? (
                    <div className="text-muted-foreground flex h-[300px] items-center justify-center">
                        <div className="text-center">
                            <p className="text-lg font-medium">Sin datos disponibles</p>
                            <p className="text-sm">No se pudieron cargar las tendencias</p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={height}>
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDateForDisplay}
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                                tickMargin={10}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                                tickFormatter={formatNumber}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {/* Línea de sesiones */}
                            <Line
                                type="monotone"
                                dataKey="sessions"
                                stroke={colors.primary}
                                strokeWidth={2}
                                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
                            />

                            {/* Línea de páginas vista */}
                            <Line
                                type="monotone"
                                dataKey="pageViews"
                                stroke={colors.success}
                                strokeWidth={2}
                                dot={{ fill: colors.success, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: colors.success, strokeWidth: 2 }}
                            />

                            {/* Línea de usuarios activos */}
                            <Line
                                type="monotone"
                                dataKey="activeUsers"
                                stroke={colors.warning}
                                strokeWidth={2}
                                dot={{ fill: colors.warning, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: colors.warning, strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
