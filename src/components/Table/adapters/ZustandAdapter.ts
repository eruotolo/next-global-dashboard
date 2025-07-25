import { useEffect, useRef, useState } from 'react';
import type { StoreApi } from 'zustand';
import { BaseAdapter } from './BaseAdapter';
import type { ZustandConfig, ZustandDataSource } from '../types/TableTypes';

/**
 * Adaptador para integrar stores de Zustand con el sistema de tablas
 * Maneja la sincronización automática con el store y proporciona
 * una interfaz consistente para el DataTableManager
 */
export class ZustandAdapter<T> extends BaseAdapter<T> {
    private store: StoreApi<any>;
    private config: ZustandConfig;
    private unsubscribe: (() => void) | null = null;

    constructor(storeFactory: () => StoreApi<any>, config: ZustandConfig) {
        super();
        this.store = storeFactory();
        this.config = config;
    }

    // ====================================
    // IMPLEMENTACIÓN DE MÉTODOS ABSTRACTOS
    // ====================================

    /**
     * Inicializa el adaptador y establece la suscripción al store
     */
    async initialize(): Promise<void> {
        await this.executeWithErrorHandling(async () => {
            // Obtener estado inicial del store
            this.syncWithStore();

            // Suscribirse a cambios del store
            this.subscribeToStore();

            // Intentar cargar datos si no existen
            const currentData = this.getValueFromStore(this.config.selectors.data);
            if (!currentData || currentData.length === 0) {
                await this.fetchFromStore();
            }

            this.setInitialized(true);
        }, 'Error al inicializar ZustandAdapter');
    }

    /**
     * Refresca los datos llamando al método fetch del store
     */
    async refresh(): Promise<void> {
        await this.executeWithErrorHandling(async () => {
            await this.fetchFromStore();
        }, 'Error al refrescar datos desde Zustand store');
    }

    // ====================================
    // MÉTODOS DE INTEGRACIÓN CON ZUSTAND
    // ====================================

    /**
     * Sincroniza el estado interno con el store de Zustand
     */
    private syncWithStore(): void {
        const state = this.store.getState();

        // Obtener datos
        const data = this.getValueFromStore(this.config.selectors.data);
        if (this.validateData(data)) {
            this.setData(data);
        }

        // Obtener estado de loading
        const loading = this.getValueFromStore(this.config.selectors.loading);
        if (typeof loading === 'boolean') {
            this.setLoading(loading);
        }

        // Obtener error si está configurado
        if (this.config.selectors.error) {
            const error = this.getValueFromStore(this.config.selectors.error);
            if (typeof error === 'string' || error === null) {
                this.setError(error);
            }
        }
    }

    /**
     * Se suscribe a cambios en el store de Zustand
     */
    private subscribeToStore(): void {
        this.unsubscribe = this.store.subscribe((state, prevState) => {
            // Verificar cambios en datos
            const currentData = state[this.config.selectors.data];
            const prevData = prevState[this.config.selectors.data];

            if (currentData !== prevData && this.validateData(currentData)) {
                this.setData(currentData);
            }

            // Verificar cambios en loading
            const currentLoading = state[this.config.selectors.loading];
            const prevLoading = prevState[this.config.selectors.loading];

            if (currentLoading !== prevLoading && typeof currentLoading === 'boolean') {
                this.setLoading(currentLoading);
            }

            // Verificar cambios en error
            if (this.config.selectors.error) {
                const currentError = state[this.config.selectors.error];
                const prevError = prevState[this.config.selectors.error];

                if (currentError !== prevError) {
                    this.setError(currentError);
                }
            }
        });
    }

    /**
     * Llama al método fetch del store
     */
    private async fetchFromStore(): Promise<void> {
        const state = this.store.getState();
        const fetchMethod = state[this.config.selectors.fetch];

        if (typeof fetchMethod === 'function') {
            await fetchMethod();
            // La sincronización se hará automáticamente por la suscripción
        } else {
            throw new Error(
                `Método fetch '${this.config.selectors.fetch}' no encontrado en el store`,
            );
        }
    }

    /**
     * Obtiene un valor del store usando un selector string
     */
    private getValueFromStore(selector: string): any {
        const state = this.store.getState();
        return state[selector];
    }

    // ====================================
    // CLEANUP
    // ====================================

    /**
     * Limpia la suscripción al store
     */
    cleanup(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        super.cleanup();
    }
}

/**
 * Hook para usar ZustandAdapter en componentes React
 * Maneja el ciclo de vida del adaptador automáticamente
 */
export function useZustandAdapter<T>(dataSource: ZustandDataSource, deps: any[] = []) {
    const [adapter] = useState(
        () => new ZustandAdapter<T>(dataSource.store, { selectors: dataSource.selectors }),
    );

    const [state, setState] = useState(() => adapter.getState());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Inicializar adaptador
    useEffect(() => {
        let isMounted = true;

        const initializeAdapter = async () => {
            try {
                await adapter.initialize();
                if (isMounted) {
                    setState(adapter.getState());
                }
            } catch (error) {
                console.error('Error inicializando ZustandAdapter:', error);
            }
        };

        initializeAdapter();

        return () => {
            isMounted = false;
        };
    }, deps);

    // Polling para sincronizar estado
    useEffect(() => {
        const updateState = () => {
            setState(adapter.getState());
        };

        // Actualización inmediata
        updateState();

        // Polling cada 100ms para cambios
        intervalRef.current = setInterval(updateState, 100);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [adapter]);

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            adapter.cleanup();
        };
    }, [adapter]);

    // Funciones de acción
    const refresh = async () => {
        await adapter.refresh();
        setState(adapter.getState());
    };

    const initialize = async () => {
        await adapter.initialize();
        setState(adapter.getState());
    };

    const reset = () => {
        adapter.cleanup();
        setState(adapter.getState());
    };

    return {
        ...state,
        refresh,
        initialize,
        reset,
    };
}

/**
 * Factory para crear configuraciones de ZustandAdapter
 * Simplifica la creación de configuraciones para stores comunes
 */
export class ZustandAdapterFactory {
    /**
     * Crea configuración para stores con patrón estándar
     * (data, loading, fetch)
     */
    static createStandardConfig(
        storeFactory: () => StoreApi<any>,
        dataSelector: string,
        loadingSelector: string,
        fetchSelector: string,
        errorSelector?: string,
    ): { store: () => StoreApi<any>; selectors: ZustandConfig['selectors'] } {
        return {
            store: storeFactory,
            selectors: {
                data: dataSelector,
                loading: loadingSelector,
                fetch: fetchSelector,
                ...(errorSelector && { error: errorSelector }),
            },
        };
    }

    /**
     * Configuración específica para useUserRoleStore (roles)
     */
    static createRolesConfig() {
        // El import dinámico evita problemas de dependencias circulares
        return ZustandAdapterFactory.createStandardConfig(
            () => require('@/store/userroleStore').useUserRoleStore.getState(),
            'rolesData',
            'isLoadingRoles',
            'fetchRoles',
            'error',
        );
    }

    /**
     * Configuración específica para useUserRoleStore (users)
     */
    static createUsersConfig() {
        return ZustandAdapterFactory.createStandardConfig(
            () => require('@/store/userroleStore').useUserRoleStore.getState(),
            'userData',
            'isLoadingUsers',
            'fetchUsers',
            'error',
        );
    }
}

/**
 * Utilitarios para debugging de ZustandAdapter
 */
export class ZustandAdapterDebug {
    /**
     * Registra el estado completo de un store para debugging
     */
    static logStoreState(storeFactory: () => StoreApi<any>, label?: string): void {
        const store = storeFactory();
        const state = store.getState();
        console.log(`[ZustandAdapter${label ? ` - ${label}` : ''}] Store state:`, state);
    }

    /**
     * Valida que los selectores existan en el store
     */
    static validateSelectors(
        storeFactory: () => StoreApi<any>,
        selectors: ZustandConfig['selectors'],
    ): { valid: boolean; missing: string[] } {
        const store = storeFactory();
        const state = store.getState();
        const missing: string[] = [];

        // Verificar selectores requeridos
        if (!(selectors.data in state)) missing.push(selectors.data);
        if (!(selectors.loading in state)) missing.push(selectors.loading);
        if (!(selectors.fetch in state)) missing.push(selectors.fetch);

        // Verificar selector opcional de error
        if (selectors.error && !(selectors.error in state)) {
            missing.push(selectors.error);
        }

        return {
            valid: missing.length === 0,
            missing,
        };
    }
}
