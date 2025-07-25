import { useCallback, useEffect, useState } from 'react';
import { BaseAdapter } from './BaseAdapter';
import type { ServerActionDataSource } from '../types/TableTypes';

/**
 * Adaptador para integrar Server Actions directas con el sistema de tablas
 * Maneja el estado local (useState) y la llamada a server actions
 * Similar al patrón usado en TicketTable
 */
export class ServerActionAdapter<T> extends BaseAdapter<T> {
    private serverAction: () => Promise<any[]>;
    private transform?: (data: any[]) => T[];

    constructor(serverAction: () => Promise<any[]>, transform?: (data: any[]) => T[]) {
        super();
        this.serverAction = serverAction;
        this.transform = transform;
    }

    // ====================================
    // IMPLEMENTACIÓN DE MÉTODOS ABSTRACTOS
    // ====================================

    /**
     * Inicializa el adaptador cargando los datos iniciales
     */
    async initialize(): Promise<void> {
        await this.executeWithErrorHandling(async () => {
            await this.fetchData();
            this.setInitialized(true);
        }, 'Error al inicializar ServerActionAdapter');
    }

    /**
     * Refresca los datos llamando al server action
     */
    async refresh(): Promise<void> {
        await this.executeWithErrorHandling(async () => {
            await this.fetchData();
        }, 'Error al refrescar datos desde Server Action');
    }

    // ====================================
    // MÉTODOS PRIVADOS
    // ====================================

    /**
     * Obtiene los datos del server action y los procesa
     */
    private async fetchData(): Promise<void> {
        try {
            const rawData = await this.serverAction();

            if (!Array.isArray(rawData)) {
                throw new Error('Server Action debe retornar un array');
            }

            const transformedData = this.transformData(rawData, this.transform);
            this.setData(transformedData);
        } catch (error) {
            console.error('Error en fetchData:', error);
            throw error;
        }
    }
}

/**
 * Hook para usar ServerActionAdapter en componentes React
 * Maneja el ciclo de vida del adaptador automáticamente
 */
export function useServerActionAdapter<T>(dataSource: ServerActionDataSource<T>, deps: any[] = []) {
    const [adapter] = useState(
        () => new ServerActionAdapter<T>(dataSource.serverAction, dataSource.transform),
    );

    const [state, setState] = useState(() => adapter.getState());

    // Función para actualizar el estado local
    const updateState = useCallback(() => {
        setState(adapter.getState());
    }, [adapter]);

    // Inicializar adaptador
    useEffect(() => {
        let isMounted = true;

        const initializeAdapter = async () => {
            try {
                await adapter.initialize();
                if (isMounted) {
                    updateState();
                }
            } catch (error) {
                console.error('Error inicializando ServerActionAdapter:', error);
                if (isMounted) {
                    updateState();
                }
            }
        };

        initializeAdapter();

        return () => {
            isMounted = false;
        };
    }, deps);

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            adapter.cleanup();
        };
    }, [adapter]);

    // Funciones de acción
    const refresh = useCallback(async () => {
        try {
            await adapter.refresh();
            updateState();
        } catch (error) {
            console.error('Error en refresh:', error);
            updateState();
        }
    }, [adapter, updateState]);

    const initialize = useCallback(async () => {
        try {
            await adapter.initialize();
            updateState();
        } catch (error) {
            console.error('Error en initialize:', error);
            updateState();
        }
    }, [adapter, updateState]);

    const reset = useCallback(() => {
        adapter.cleanup();
        updateState();
    }, [adapter, updateState]);

    return {
        ...state,
        refresh,
        initialize,
        reset,
    };
}

/**
 * Factory para crear configuraciones de ServerActionAdapter
 * Simplifica la integración con server actions comunes
 */
export class ServerActionAdapterFactory {
    /**
     * Crea un adaptador básico sin transformación
     */
    static createBasic<T>(serverAction: () => Promise<T[]>): ServerActionAdapter<T> {
        return new ServerActionAdapter<T>(serverAction);
    }

    /**
     * Crea un adaptador con función de transformación
     */
    static createWithTransform<TRaw, TTransformed>(
        serverAction: () => Promise<TRaw[]>,
        transform: (data: TRaw[]) => TTransformed[],
    ): ServerActionAdapter<TTransformed> {
        return new ServerActionAdapter<TTransformed>(serverAction, transform);
    }

    /**
     * Configuración específica para tickets con transformación
     * Replica la lógica de TicketTable
     */
    static createTicketsAdapter(getAllTickets: () => Promise<any[]>) {
        const transformTicketData = (data: any[]) => {
            return data.map((ticket) => ({
                id: ticket.id,
                code: ticket.code,
                title: ticket.title,
                userName: ticket.userName,
                userLastName: ticket.userLastName,
                status: ticket.status,
                priority: ticket.priority,
            }));
        };

        return ServerActionAdapterFactory.createWithTransform(getAllTickets, transformTicketData);
    }

    /**
     * Wrapper para server actions con manejo de errores personalizado
     */
    static createWithErrorHandling<T>(
        serverAction: () => Promise<T[]>,
        errorHandler?: (error: any) => void,
        transform?: (data: any[]) => T[],
    ): ServerActionAdapter<T> {
        const wrappedAction = async () => {
            try {
                return await serverAction();
            } catch (error) {
                if (errorHandler) {
                    errorHandler(error);
                }
                throw error;
            }
        };

        return new ServerActionAdapter<T>(wrappedAction, transform);
    }
}

/**
 * Utilitarios para testing y debugging de ServerActionAdapter
 */
export class ServerActionAdapterDebug {
    /**
     * Crea un mock server action para testing
     */
    static createMockServerAction<T>(
        mockData: T[],
        delay: number = 500,
        shouldFail: boolean = false,
    ): () => Promise<T[]> {
        return async () => {
            // Simular delay de red
            await new Promise((resolve) => setTimeout(resolve, delay));

            if (shouldFail) {
                throw new Error('Mock server action error');
            }

            return mockData;
        };
    }

    /**
     * Wrapper para loggear todas las operaciones del adaptador
     */
    static createLoggingAdapter<T>(
        serverAction: () => Promise<any[]>,
        transform?: (data: any[]) => T[],
        label: string = 'ServerActionAdapter',
    ): ServerActionAdapter<T> {
        const wrappedAction = async () => {
            console.log(`[${label}] Iniciando server action...`);
            const start = performance.now();

            try {
                const result = await serverAction();
                const duration = performance.now() - start;
                console.log(`[${label}] Server action completada en ${duration.toFixed(2)}ms`, {
                    resultCount: result.length,
                });
                return result;
            } catch (error) {
                const duration = performance.now() - start;
                console.error(
                    `[${label}] Server action falló después de ${duration.toFixed(2)}ms:`,
                    error,
                );
                throw error;
            }
        };

        const wrappedTransform = transform
            ? (data: any[]) => {
                  console.log(`[${label}] Transformando datos...`, {
                      inputCount: data.length,
                  });
                  const result = transform(data);
                  console.log(`[${label}] Transformación completada`, {
                      outputCount: result.length,
                  });
                  return result;
              }
            : undefined;

        return new ServerActionAdapter<T>(wrappedAction, wrappedTransform);
    }

    /**
     * Valida que un server action retorne el formato esperado
     */
    static async validateServerAction(
        serverAction: () => Promise<any[]>,
        expectedFields: string[] = [],
    ): Promise<{ valid: boolean; issues: string[] }> {
        const issues: string[] = [];

        try {
            const result = await serverAction();

            // Verificar que retorne un array
            if (!Array.isArray(result)) {
                issues.push('Server action debe retornar un array');
                return { valid: false, issues };
            }

            // Verificar campos esperados en el primer elemento
            if (result.length > 0 && expectedFields.length > 0) {
                const firstItem = result[0];
                const missingFields = expectedFields.filter((field) => !(field in firstItem));

                if (missingFields.length > 0) {
                    issues.push(`Campos faltantes en datos: ${missingFields.join(', ')}`);
                }
            }
        } catch (error) {
            issues.push(`Error ejecutando server action: ${error}`);
        }

        return {
            valid: issues.length === 0,
            issues,
        };
    }
}

/**
 * Hook compuesto que combina múltiples server actions
 * Útil para casos donde se necesitan datos de múltiples fuentes
 */
export function useMultipleServerActions<T1, T2>(
    action1: () => Promise<T1[]>,
    action2: () => Promise<T2[]>,
    combiner: (data1: T1[], data2: T2[]) => any[],
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [result1, result2] = await Promise.all([action1(), action2()]);
            const combinedData = combiner(result1, result2);
            setData(combinedData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Error en useMultipleServerActions:', err);
        } finally {
            setLoading(false);
        }
    }, [action1, action2, combiner]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refresh: fetchData,
    };
}
