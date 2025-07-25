import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode, ComponentType } from 'react';

// ====================================
// TIPOS BASE PARA EL SISTEMA DE TABLAS
// ====================================

/**
 * Configuración principal para una entidad de tabla
 */
export interface EntityTableConfig<T> {
    /** Identificador único de la entidad */
    entity: string;
    /** Definiciones de columnas de la tabla */
    columns: ColumnDef<T>[];
    /** Configuración de la fuente de datos */
    dataSource: DataSourceConfig<T>;
    /** Placeholder para el filtro de búsqueda */
    filterPlaceholder?: string;
    /** Configuración adicional opcional */
    options?: TableOptions;
}

/**
 * Configuración de fuente de datos (Zustand o Server Action)
 */
export type DataSourceConfig<T> = ZustandDataSource | ServerActionDataSource<T>;

/**
 * Configuración para datos provenientes de Zustand Store
 */
export interface ZustandDataSource {
    type: 'zustand';
    /** Función que retorna el store de Zustand */
    store: () => any;
    /** Selectores para acceder a propiedades del store */
    selectors: {
        /** Selector para los datos */
        data: string;
        /** Selector para el estado de loading */
        loading: string;
        /** Selector para errores (opcional) */
        error?: string;
        /** Método para obtener/refrescar datos */
        fetch: string;
    };
}

/**
 * Configuración para datos provenientes de Server Actions
 */
export interface ServerActionDataSource<T> {
    type: 'serverAction';
    /** Server Action que retorna los datos */
    serverAction: () => Promise<any[]>;
    /** Función opcional para transformar los datos */
    transform?: (data: any[]) => T[];
}

/**
 * Opciones adicionales para la tabla
 */
export interface TableOptions {
    /** Habilitar selección múltiple */
    enableRowSelection?: boolean;
    /** Tamaño de página por defecto */
    defaultPageSize?: number;
    /** Habilitar exportación */
    enableExport?: boolean;
    /** Clases CSS adicionales */
    className?: string;
}

// ====================================
// TIPOS PARA ADAPTADORES DE DATOS
// ====================================

/**
 * Interfaz común para todos los adaptadores de datos
 */
export interface DataAdapter<T> {
    /** Datos actuales */
    data: T[];
    /** Estado de carga */
    loading: boolean;
    /** Mensaje de error si existe */
    error: string | null;
    /** Función para refrescar los datos */
    refresh: () => Promise<void>;
    /** Función para inicializar el adaptador */
    initialize: () => Promise<void>;
    /** Cleanup cuando el adaptador se desmonta */
    cleanup?: () => void;
}

/**
 * Configuración específica para ZustandAdapter
 */
export interface ZustandConfig {
    /** Selectores para acceder a datos del store */
    selectors: {
        data: string;
        loading: string;
        error?: string;
        fetch: string;
    };
}

// ====================================
// TIPOS PARA SISTEMA DE ACCIONES
// ====================================

/**
 * Configuración de acciones para una entidad
 */
export interface ActionConfig<T> {
    /** Acción de editar */
    edit?: EditActionConfig;
    /** Acción de eliminar */
    delete?: DeleteActionConfig;
    /** Acción de ver detalles */
    view?: ViewActionConfig;
    /** Acción de cambiar contraseña (específica para usuarios) */
    changePassword?: ChangePasswordActionConfig;
    /** Acción de configurar (asignar permisos, roles, etc.) */
    config?: ConfigActionConfig;
    /** Acciones personalizadas adicionales */
    custom?: CustomAction<T>[];
}

/**
 * Configuración base para acciones con modal
 */
interface BaseActionConfig {
    /** Permisos requeridos para la acción */
    permission: string[];
    /** Etiqueta a mostrar */
    label: string;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Configuración para acción de editar
 */
export interface EditActionConfig extends BaseActionConfig {
    /** Componente modal para editar */
    modal: ComponentType<ModalProps>;
}

/**
 * Configuración para acción de eliminar
 */
export interface DeleteActionConfig extends BaseActionConfig {
    /** Server Action para eliminar */
    serverAction: (id: string) => Promise<boolean>;
}

/**
 * Configuración para acción de ver
 */
export interface ViewActionConfig extends BaseActionConfig {
    /** Componente modal para ver */
    modal: ComponentType<ModalProps>;
}

/**
 * Configuración para acción de cambiar contraseña
 */
export interface ChangePasswordActionConfig extends BaseActionConfig {
    /** Componente modal para cambiar contraseña */
    modal: ComponentType<ChangePasswordModalProps>;
}

/**
 * Configuración para acción de configurar
 */
export interface ConfigActionConfig extends BaseActionConfig {
    /** Componente modal para configurar */
    modal: ComponentType<ModalProps>;
}

/**
 * Acción personalizada
 */
export interface CustomAction<T> {
    /** Icono de la acción (de Lucide React) */
    icon: ComponentType<{ className?: string }>;
    /** Etiqueta de la acción */
    label: string;
    /** Función a ejecutar */
    action: (item: T) => void | Promise<void>;
    /** Permisos requeridos */
    permission: string[];
    /** Clase CSS adicional */
    className?: string;
}

// ====================================
// TIPOS PARA MODALES
// ====================================

/**
 * Props base para modales de acción
 */
export interface ModalProps {
    /** ID del elemento */
    id: string;
    /** Estado de apertura del modal */
    open: boolean;
    /** Función para cerrar el modal */
    onCloseAction: (isOpen: boolean) => void;
    /** Función para refrescar datos después de la acción */
    refreshAction: () => Promise<void>;
}

/**
 * Props específicos para modal de cambio de contraseña
 */
export interface ChangePasswordModalProps extends ModalProps {
    /** Función de refresh personalizada */
    refresh: () => Promise<void>;
    /** Mensaje de éxito personalizado */
    successMessage?: string;
}

// ====================================
// TIPOS PARA COLUMN FACTORY
// ====================================

/**
 * Opciones para columnas de texto
 */
export interface TextColumnOptions {
    /** Ancho mínimo de la columna */
    minWidth?: number;
    /** Ancho máximo de la columna */
    maxWidth?: number;
    /** Función de transformación de valor */
    transform?: (value: string) => string;
    /** Habilitar búsqueda en esta columna */
    searchable?: boolean;
}

/**
 * Opciones para columnas de moneda
 */
export interface CurrencyColumnOptions extends TextColumnOptions {
    /** Símbolo de moneda */
    currency?: string;
    /** Número de decimales */
    decimals?: number;
    /** Locale para formateo */
    locale?: string;
}

/**
 * Configuración para badges de estado
 */
export interface StatusConfig {
    [key: string]: {
        /** Clases CSS para el badge */
        className: string;
        /** Etiqueta personalizada (opcional) */
        label?: string;
    };
}

/**
 * Configuración para mostrar nombre completo
 */
export interface FullNameConfig {
    /** Campos que componen el nombre completo */
    fields: string[];
    /** Separador entre campos */
    separator?: string;
}

// ====================================
// TIPOS PARA PROPS DE COMPONENTES
// ====================================

/**
 * Props para el DataTableManager
 */
export interface DataTableManagerProps<T> {
    /** Configuración de la entidad */
    entityConfig: EntityTableConfig<T>;
    /** Título de la tabla */
    title: string;
    /** Descripción de la tabla */
    description: string;
    /** Componente modal para crear nueva entidad */
    createModal: ComponentType<{ refreshAction: () => void }>;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Props para ActionCell
 */
export interface ActionCellProps<T> {
    /** Fila de datos */
    row: {
        original: T;
    };
    /** Configuración de acciones */
    config: ActionConfig<T>;
    /** Función para refrescar datos */
    refreshAction: () => Promise<void>;
}

// ====================================
// TIPOS UTILITARIOS
// ====================================

/**
 * Extrae el tipo de datos de una configuración de tabla
 */
export type ExtractDataType<T> = T extends EntityTableConfig<infer U> ? U : never;

/**
 * Helper para crear tipos de configuración fuertemente tipados
 */
export type StrictEntityConfig<T> = EntityTableConfig<T> & {
    _brand: 'EntityConfig';
};

/**
 * Resultado de operación con posible error
 */
export type OperationResult<T = void> = {
    success: boolean;
    data?: T;
    error?: string;
};

// ====================================
// TIPOS PARA HOOKS PERSONALIZADOS
// ====================================

/**
 * Estado del adaptador de datos
 */
export interface DataAdapterState<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

/**
 * Acciones del adaptador de datos
 */
export interface DataAdapterActions {
    refresh: () => Promise<void>;
    initialize: () => Promise<void>;
    reset: () => void;
}

/**
 * Hook result para adaptador de datos
 */
export type UseDataAdapterResult<T> = DataAdapterState<T> & DataAdapterActions;
