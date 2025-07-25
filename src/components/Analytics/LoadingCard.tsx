/**
 * Componente LoadingCard - Estados de carga para componentes Analytics
 * Skeletons profesionales con animación
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingCardProps {
    type?: 'metric' | 'chart' | 'table' | 'pie';
    className?: string;
}

// Loading para MetricCard
const MetricLoadingCard = ({ className }: { className?: string }) => (
    <Card className={cn('transition-all', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </CardContent>
    </Card>
);

// Loading para TrendChart
const ChartLoadingCard = ({ className }: { className?: string }) => (
    <Card className={className}>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {/* Simulación del gráfico */}
                <div className="flex h-[300px] items-end justify-between space-x-2 px-4">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton
                            key={i}
                            className={`w-8 animate-pulse`}
                            style={{
                                height: `${Math.random() * 200 + 50}px`,
                                animationDelay: `${i * 0.1}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Simulación de ejes */}
                <div className="flex justify-between">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-3 w-12" />
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
);

// Loading para TopPagesTable
const TableLoadingCard = ({ className }: { className?: string }) => (
    <Card className={className}>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border p-3"
                    >
                        <div className="flex flex-1 items-center gap-3">
                            <Skeleton className="h-6 w-6 rounded" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="space-y-1 text-right">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                            <div className="hidden space-y-1 text-right sm:block">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

// Loading para DevicePieChart
const PieLoadingCard = ({ className }: { className?: string }) => (
    <Card className={className}>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {/* Simulación del gráfico circular */}
                <div className="flex justify-center">
                    <div className="relative">
                        <Skeleton className="h-40 w-40 rounded-full" />
                        <div className="absolute inset-8">
                            <Skeleton className="bg-background h-24 w-24 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Simulación de la leyenda */}
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg p-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="space-y-1 text-right">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function LoadingCard({ type = 'metric', className }: LoadingCardProps) {
    switch (type) {
        case 'chart':
            return <ChartLoadingCard className={className} />;
        case 'table':
            return <TableLoadingCard className={className} />;
        case 'pie':
            return <PieLoadingCard className={className} />;
        default:
            return <MetricLoadingCard className={className} />;
    }
}
