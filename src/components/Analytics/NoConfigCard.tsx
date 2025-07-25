/**
 * Componente NoConfigCard - Mostrar estado amigable cuando Analytics no está configurado
 * Aparece cuando faltan variables de entorno requeridas
 */

import { Settings, ExternalLink, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface NoConfigCardProps {
    missingVariables: string[];
    error?: string;
    className?: string;
}

export default function NoConfigCard({ missingVariables, error, className }: NoConfigCardProps) {
    const handleCopyVariable = (variable: string) => {
        navigator.clipboard.writeText(variable);
    };

    const openGA4Docs = () => {
        window.open(
            'https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries',
            '_blank',
        );
    };

    return (
        <Card className={cn('border-orange-200 bg-orange-50', className)}>
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-900">Analytics No Configurado</CardTitle>
                <CardDescription className="text-orange-700">
                    Para ver los datos de Google Analytics, es necesario configurar las variables de
                    entorno
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Variables faltantes */}
                <div>
                    <h4 className="mb-2 text-sm font-medium text-orange-900">
                        Variables Requeridas:
                    </h4>
                    <div className="space-y-2">
                        {missingVariables.map((variable) => (
                            <div
                                key={variable}
                                className="bg-orange-25 flex items-center justify-between rounded-md border border-orange-200 p-2"
                            >
                                <code className="text-sm text-orange-800">{variable}</code>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyVariable(variable)}
                                    className="h-6 px-2 text-orange-600 hover:bg-orange-100"
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error específico si existe */}
                {error && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-sm text-red-700">
                            <strong>Error de configuración:</strong> {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Pasos para configurar */}
                <div className="rounded-lg border border-orange-200 bg-white p-4">
                    <h4 className="mb-2 text-sm font-medium text-orange-900">
                        Pasos para Configurar:
                    </h4>
                    <ol className="space-y-1 text-sm text-orange-700">
                        <li>1. Crear proyecto en Google Cloud Console</li>
                        <li>2. Habilitar Google Analytics Data API</li>
                        <li>3. Crear Service Account y descargar JSON</li>
                        <li>4. Obtener Property ID de GA4</li>
                        <li>5. Agregar variables al archivo .env.local</li>
                    </ol>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        onClick={openGA4Docs}
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Documentación
                    </Button>
                    <Badge variant="secondary" className="justify-center text-xs">
                        Configuración solo requerida en desarrollo
                    </Badge>
                </div>

                {/* Nota adicional */}
                <div className="text-muted-foreground rounded-md bg-gray-50 p-3 text-xs">
                    <p>
                        <strong>Nota:</strong> Este mensaje aparece cuando faltan las variables de
                        entorno de Google Analytics. Una vez configuradas correctamente, el
                        dashboard mostrará los datos en tiempo real.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
