/**
 * Componente ErrorCard - Estados de error para componentes Analytics
 * Manejo elegante de errores con opciones de retry
 */

import { RefreshCw, AlertCircle, Wifi, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ErrorCardProps {
    error: Error | string;
    onRetry?: () => void;
    title?: string;
    type?: 'metric' | 'chart' | 'table' | 'pie';
    className?: string;
}

// Determinar el tipo de error y mostrar mensaje apropiado
const getErrorDetails = (error: Error | string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const lowerMessage = errorMessage.toLowerCase();

    // Error de conexión/red
    if (
        lowerMessage.includes('network') ||
        lowerMessage.includes('conexión') ||
        lowerMessage.includes('fetch')
    ) {
        return {
            icon: <Wifi className="h-5 w-5" />,
            title: 'Error de Conexión',
            description:
                'No se pudo conectar con Google Analytics. Verifica tu conexión a internet.',
            type: 'network' as const,
        };
    }

    // Error de configuración
    if (
        lowerMessage.includes('credentials') ||
        lowerMessage.includes('unauthorized') ||
        lowerMessage.includes('configuración')
    ) {
        return {
            icon: <Settings className="h-5 w-5" />,
            title: 'Error de Configuración',
            description:
                'Las credenciales de Google Analytics no están configuradas correctamente.',
            type: 'config' as const,
        };
    }

    // Error de datos
    if (
        lowerMessage.includes('data') ||
        lowerMessage.includes('response') ||
        lowerMessage.includes('datos')
    ) {
        return {
            icon: <AlertCircle className="h-5 w-5" />,
            title: 'Error de Datos',
            description: 'Los datos de Analytics no se pudieron procesar correctamente.',
            type: 'data' as const,
        };
    }

    // Error genérico
    return {
        icon: <AlertCircle className="h-5 w-5" />,
        title: 'Error Inesperado',
        description: errorMessage || 'Ocurrió un error desconocido al cargar los datos.',
        type: 'generic' as const,
    };
};

// Obtener sugerencias según el tipo de error
const getErrorSuggestions = (errorType: string) => {
    switch (errorType) {
        case 'network':
            return [
                'Verifica tu conexión a internet',
                'Intenta recargar la página',
                'Comprueba que Google Analytics esté disponible',
            ];
        case 'config':
            return [
                'Verifica las credenciales en el archivo .env.local',
                'Confirma que el Service Account tiene permisos',
                'Revisa que el Property ID sea correcto',
            ];
        case 'data':
            return [
                'Los datos pueden no estar disponibles aún',
                'Intenta con un rango de fechas diferente',
                'Verifica que la propiedad tenga datos',
            ];
        default:
            return [
                'Intenta recargar los datos',
                'Si el problema persiste, contacta al administrador',
            ];
    }
};

export default function ErrorCard({
    error,
    onRetry,
    title,
    type = 'metric',
    className,
}: ErrorCardProps) {
    const errorDetails = getErrorDetails(error);
    const suggestions = getErrorSuggestions(errorDetails.type);

    return (
        <Card className={cn('border-destructive/20', className)}>
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                    {errorDetails.icon}
                    {title || errorDetails.title}
                </CardTitle>
                <CardDescription>{errorDetails.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Alert con detalles del error */}
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                        {typeof error === 'string' ? error : error.message}
                    </AlertDescription>
                </Alert>

                {/* Sugerencias */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Posibles soluciones:</h4>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-xs">•</span>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Botón de retry */}
                {onRetry && (
                    <div className="flex justify-center pt-2">
                        <Button
                            variant="outline"
                            onClick={onRetry}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reintentar
                        </Button>
                    </div>
                )}

                {/* Información adicional según el tipo de componente */}
                {type === 'chart' && (
                    <div className="text-muted-foreground py-8 text-center">
                        <div className="border-muted flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
                            <div className="text-center">
                                <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                                <p className="text-sm">Gráfico no disponible</p>
                            </div>
                        </div>
                    </div>
                )}

                {type === 'table' && (
                    <div className="text-muted-foreground py-8 text-center">
                        <div className="space-y-2">
                            <div className="bg-muted flex h-8 items-center justify-center rounded">
                                <span className="text-sm">Tabla no disponible</span>
                            </div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-muted/50 h-6 rounded" />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
