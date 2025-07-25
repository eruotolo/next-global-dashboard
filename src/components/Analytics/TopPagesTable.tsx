/**
 * Componente TopPagesTable - Tabla de páginas más visitadas
 * Muestra ranking de páginas con métricas principales
 */

import { ExternalLink, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber, formatDuration } from '@/lib/analytics/utils';
import type { TopPagesData } from '@/types/Analytics/AnalyticsInterface';

interface TopPagesTableProps {
    data: TopPagesData[];
    title?: string;
    description?: string;
    limit?: number;
    showTimeOnPage?: boolean;
    className?: string;
}

export default function TopPagesTable({
    data,
    title = 'Páginas Más Visitadas',
    description = 'Top páginas por número de visualizaciones',
    limit = 10,
    showTimeOnPage = true,
    className,
}: TopPagesTableProps) {
    // Limitar y ordenar datos
    const limitedData = data.sort((a, b) => b.pageViews - a.pageViews).slice(0, limit);

    // Calcular total de vistas para porcentajes
    const totalViews = limitedData.reduce((sum, page) => sum + page.pageViews, 0);

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="h-5 w-5" />
                            {title}
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>

                    {/* Badge con total */}
                    <Badge variant="outline">Total: {formatNumber(totalViews)} vistas</Badge>
                </div>
            </CardHeader>

            <CardContent>
                {limitedData.length === 0 ? (
                    <div className="text-muted-foreground flex items-center justify-center py-8">
                        <div className="text-center">
                            <p className="text-lg font-medium">Sin datos disponibles</p>
                            <p className="text-sm">No se pudieron cargar las páginas</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {limitedData.map((page, index) => {
                            const percentage =
                                totalViews > 0 ? (page.pageViews / totalViews) * 100 : 0;

                            return (
                                <div
                                    key={`${page.pagePath}-${index}`}
                                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                                >
                                    {/* Información de la página */}
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            {/* Ranking */}
                                            <Badge
                                                variant={index < 3 ? 'default' : 'secondary'}
                                                className="flex h-6 min-w-[24px] items-center justify-center p-0 text-xs"
                                            >
                                                {index + 1}
                                            </Badge>

                                            {/* Título de la página */}
                                            <h4
                                                className="truncate text-sm font-medium"
                                                title={page.pageTitle}
                                            >
                                                {page.pageTitle || 'Sin título'}
                                            </h4>
                                        </div>

                                        {/* Ruta de la página */}
                                        <div className="flex items-center gap-2">
                                            <code className="text-muted-foreground bg-muted truncate rounded px-2 py-1 font-mono text-xs">
                                                {page.pagePath}
                                            </code>

                                            {/* Botón para abrir página */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => window.open(page.pagePath, '_blank')}
                                                title="Abrir página"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Métricas */}
                                    <div className="flex items-center gap-4 text-right">
                                        {/* Vistas de página */}
                                        <div>
                                            <div className="text-sm font-medium">
                                                {formatNumber(page.pageViews)}
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                {percentage.toFixed(1)}%
                                            </div>
                                        </div>

                                        {/* Vistas únicas */}
                                        <div className="hidden sm:block">
                                            <div className="text-sm font-medium">
                                                {formatNumber(page.uniquePageviews)}
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                únicas
                                            </div>
                                        </div>

                                        {/* Tiempo en página */}
                                        {showTimeOnPage && (
                                            <div className="hidden md:block">
                                                <div className="text-sm font-medium">
                                                    {formatDuration(page.userEngagementDuration)}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    promedio
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Mostrar total de páginas si hay más */}
                        {data.length > limit && (
                            <div className="border-t pt-2 text-center">
                                <p className="text-muted-foreground text-sm">
                                    Mostrando {limit} de {data.length} páginas
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
