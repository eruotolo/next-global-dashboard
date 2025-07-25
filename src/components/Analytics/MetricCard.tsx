/**
 * Componente MetricCard - Card para mostrar métricas principales
 * Muestra número principal, cambio porcentual y trend
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    formatNumber,
    formatPercentage,
    formatDuration,
    calculatePercentageChange,
} from '@/lib/analytics/utils';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    title: string;
    value: number;
    previousValue?: number;
    format?: 'number' | 'percentage' | 'duration';
    description?: string;
    icon?: React.ReactNode;
    className?: string;
}

export default function MetricCard({
    title,
    value,
    previousValue,
    format = 'number',
    description,
    icon,
    className,
}: MetricCardProps) {
    // Calcular cambio porcentual si hay valor anterior
    const changePercentage =
        previousValue !== undefined ? calculatePercentageChange(value, previousValue) : null;

    // Formatear el valor principal según el tipo
    const formatValue = (val: number) => {
        switch (format) {
            case 'percentage':
                return formatPercentage(val);
            case 'duration':
                return formatDuration(val);
            default:
                return formatNumber(val);
        }
    };

    // Determinar color y ícono del trend
    const getTrendProps = (
        change: number | null,
    ): {
        color: 'default' | 'secondary' | 'destructive' | 'outline';
        icon: typeof TrendingUp | typeof TrendingDown | typeof Minus;
        text: string;
    } => {
        if (change === null) return { color: 'secondary', icon: Minus, text: 'Sin datos previos' };

        if (change > 0) {
            // Para tasa de rebote, el aumento es negativo
            const isNegativeTrend =
                format === 'percentage' && title.toLowerCase().includes('rebote');
            return {
                color: isNegativeTrend ? 'destructive' : 'default',
                icon: TrendingUp,
                text: `+${formatPercentage(Math.abs(change))}`,
            };
        } else if (change < 0) {
            // Para tasa de rebote, la disminución es positiva
            const isPositiveTrend =
                format === 'percentage' && title.toLowerCase().includes('rebote');
            return {
                color: isPositiveTrend ? 'default' : 'secondary',
                icon: TrendingDown,
                text: `-${formatPercentage(Math.abs(change))}`,
            };
        } else {
            return {
                color: 'secondary',
                icon: Minus,
                text: '0%',
            };
        }
    };

    const trendProps = getTrendProps(changePercentage);
    const TrendIcon = trendProps.icon;

    return (
        <Card className={cn('transition-all hover:shadow-md', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {/* Valor principal */}
                    <div className="text-2xl font-bold">{formatValue(value)}</div>

                    {/* Cambio porcentual si está disponible */}
                    {changePercentage !== null && (
                        <div className="flex items-center space-x-2">
                            <Badge
                                variant={trendProps.color}
                                className="flex items-center gap-1 text-xs"
                            >
                                <TrendIcon className="h-3 w-3" />
                                {trendProps.text}
                            </Badge>
                            <span className="text-muted-foreground text-xs">
                                vs período anterior
                            </span>
                        </div>
                    )}

                    {/* Descripción adicional */}
                    {description && (
                        <CardDescription className="text-xs">{description}</CardDescription>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
