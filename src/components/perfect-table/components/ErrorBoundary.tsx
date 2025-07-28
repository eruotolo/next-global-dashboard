// Error Boundary para manejo robusto de errores

'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // Llamar callback de error si existe
        this.props.onError?.(error, errorInfo);
    }

    retry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Usar fallback personalizado si se proporciona
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error} retry={this.retry} />;
            }

            // Fallback por defecto
            return <DefaultErrorFallback error={this.state.error} retry={this.retry} />;
        }

        return this.props.children;
    }
}

// Componente de error por defecto
function DefaultErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <h3 className="mb-2 text-lg font-semibold text-red-900">Algo salió mal</h3>

            <p className="mb-4 max-w-md text-red-700">
                {error?.message ||
                    'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'}
            </p>

            {process.env.NODE_ENV === 'development' && error?.stack && (
                <details className="mb-4 text-left">
                    <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                        Ver detalles del error
                    </summary>
                    <pre className="mt-2 max-w-md overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                        {error.stack}
                    </pre>
                </details>
            )}

            <div className="flex gap-2">
                <Button
                    onClick={retry}
                    variant="outline"
                    size="sm"
                    className="border-red-300 bg-transparent text-red-700 hover:bg-red-100"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reintentar
                </Button>

                <Button
                    onClick={() => window.location.reload()}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                >
                    Recargar página
                </Button>
            </div>
        </div>
    );
}

// Hook para usar Error Boundary programáticamente
export function useErrorBoundary() {
    const [error, setError] = React.useState<Error | null>(null);

    const captureError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return captureError;
}
