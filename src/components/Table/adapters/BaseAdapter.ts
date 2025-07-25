import type { DataAdapter, DataAdapterState, DataAdapterActions } from '../types';

/**
 * Clase abstracta base para todos los adaptadores de datos
 * Proporciona la estructura común y métodos base que deben implementar
 * todos los adaptadores específicos (Zustand, Server Actions, etc.)
 */
export abstract class BaseAdapter<T> implements DataAdapter<T> {
    protected _data: T[] = [];
    protected _loading: boolean = false;
    protected _error: string | null = null;
    protected _initialized: boolean = false;

    // ====================================
    // GETTERS PÚBLICOS
    // ====================================

    /** Datos actuales del adaptador */
    get data(): T[] {
        return this._data;
    }

    /** Estado de carga */
    get loading(): boolean {
        return this._loading;
    }

    /** Mensaje de error si existe */
    get error(): string | null {
        return this._error;
    }

    /** Si el adaptador ha sido inicializado */
    get initialized(): boolean {
        return this._initialized;
    }

    // ====================================
    // MÉTODOS ABSTRACTOS
    // ====================================

    /**
     * Inicializa el adaptador y carga los datos iniciales
     * Debe ser implementado por cada adaptador específico
     */
    abstract initialize(): Promise<void>;

    /**
     * Refresca los datos del adaptador
     * Debe ser implementado por cada adaptador específico
     */
    abstract refresh(): Promise<void>;

    // ====================================
    // MÉTODOS PROTEGIDOS PARA SUBCLASES
    // ====================================

    /**
     * Establece el estado de loading
     * @param loading - Nuevo estado de loading
     */
    protected setLoading(loading: boolean): void {
        this._loading = loading;
    }

    /**
     * Establece los datos
     * @param data - Nuevos datos
     */
    protected setData(data: T[]): void {
        this._data = data;
    }

    /**
     * Establece un error
     * @param error - Mensaje de error o null para limpiar
     */
    protected setError(error: string | null): void {
        this._error = error;
    }

    /**
     * Marca el adaptador como inicializado
     * @param initialized - Estado de inicialización
     */
    protected setInitialized(initialized: boolean): void {
        this._initialized = initialized;
    }

    /**
     * Limpia el error actual
     */
    protected clearError(): void {
        this._error = null;
    }

    /**
     * Resetea el adaptador a su estado inicial
     */
    protected reset(): void {
        this._data = [];
        this._loading = false;
        this._error = null;
        this._initialized = false;
    }

    // ====================================
    // MÉTODOS DE UTILIDAD
    // ====================================

    /**
     * Ejecuta una operación asíncrona con manejo de loading y errores
     * @param operation - Operación a ejecutar
     * @param errorMessage - Mensaje de error personalizado
     */
    protected async executeWithErrorHandling(
        operation: () => Promise<void>,
        errorMessage: string = 'Error en operación de datos',
    ): Promise<void> {
        try {
            this.setLoading(true);
            this.clearError();
            await operation();
        } catch (error) {
            console.error(`${errorMessage}:`, error);
            const errorMsg = error instanceof Error ? error.message : errorMessage;
            this.setError(errorMsg);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Valida que los datos sean un array válido
     * @param data - Datos a validar
     */
    protected validateData(data: unknown): data is T[] {
        return Array.isArray(data);
    }

    /**
     * Transforma datos crudos usando una función de transformación opcional
     * @param rawData - Datos crudos del servidor
     * @param transform - Función de transformación opcional
     */
    protected transformData(rawData: any[], transform?: (data: any[]) => T[]): T[] {
        if (transform) {
            return transform(rawData);
        }
        return rawData as T[];
    }

    // ====================================
    // CLEANUP OPCIONAL
    // ====================================

    /**
     * Limpieza cuando el adaptador se desmonta
     * Puede ser sobrescrito por subclases que necesiten cleanup específico
     */
    cleanup(): void {
        this.reset();
    }

    // ====================================
    // MÉTODOS DE ESTADO PARA DEBUG
    // ====================================

    /**
     * Retorna el estado completo del adaptador para debugging
     */
    getState(): DataAdapterState<T> & { initialized: boolean } {
        return {
            data: this._data,
            loading: this._loading,
            error: this._error,
            initialized: this._initialized,
        };
    }

    /**
     * Log del estado actual para debugging
     */
    logState(label?: string): void {
        const prefix = label ? `[${label}]` : '[BaseAdapter]';
        console.log(`${prefix} Estado:`, {
            itemCount: this._data.length,
            loading: this._loading,
            error: this._error,
            initialized: this._initialized,
        });
    }
}

/**
 * Factory function para crear adaptadores
 * Útil para casos donde se necesita crear adaptadores dinámicamente
 */
export type AdapterFactory<T> = () => BaseAdapter<T>;

/**
 * Interfaz para configuración de adaptadores
 */
export interface AdapterConfig {
    /** Nombre descriptivo del adaptador */
    name: string;
    /** Tiempo de timeout para operaciones (ms) */
    timeout?: number;
    /** Reintentos automáticos en caso de error */
    retries?: number;
    /** Intervalo entre reintentos (ms) */
    retryDelay?: number;
}

/**
 * Clase base extendida con configuración avanzada
 * Para adaptadores que requieren configuración adicional
 */
export abstract class ConfigurableBaseAdapter<T> extends BaseAdapter<T> {
    protected config: AdapterConfig;

    constructor(config: AdapterConfig) {
        super();
        this.config = {
            timeout: 30000, // 30 segundos por defecto
            retries: 2,
            retryDelay: 1000,
            ...config,
        };
    }

    /**
     * Ejecuta operación con reintentos automáticos
     * @param operation - Operación a ejecutar
     * @param retries - Número de reintentos (opcional, usa config por defecto)
     */
    protected async executeWithRetries<R>(
        operation: () => Promise<R>,
        retries: number = this.config.retries || 2,
    ): Promise<R> {
        let lastError: Error;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                if (attempt < retries) {
                    console.warn(
                        `[${this.config.name}] Intento ${attempt + 1} fallido, reintentando en ${this.config.retryDelay}ms...`,
                    );
                    await this.delay(this.config.retryDelay || 1000);
                }
            }
        }

        throw lastError!;
    }

    /**
     * Utilidad para delay
     * @param ms - Milisegundos a esperar
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Obtiene la configuración actual
     */
    getConfig(): AdapterConfig {
        return { ...this.config };
    }
}
