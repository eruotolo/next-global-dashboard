import type React from 'react';
export type ColumnType =
    | 'text'
    | 'number'
    | 'date'
    | 'boolean'
    | 'email'
    | 'phone'
    | 'image'
    | 'badge'
    | 'action'
    | 'selection'
    | 'custom';

export type DataSourceType = 'zustand' | 'local' | 'server-action' | 'auto';

export type ActionType =
    | 'view'
    | 'edit'
    | 'delete'
    | 'change-password'
    | 'assign-roles'
    | 'assign-permissions'
    | 'config'
    | 'custom'
    | string;

export interface ColumnConfig {
    id: string;
    header: string;
    accessorKey?: string;
    accessorFn?: (row: any) => any;
    type?: ColumnType;
    sortable?: boolean;
    filterable?: boolean;
    width?: number;
    className?: string;
    render?: (props: { row: any; value: any }) => React.ReactNode;

    // Configuración específica por tipo
    linkable?: boolean;
    colorMap?: Record<string, string>;
    dateFormat?: string;
    numberFormat?: string;
    imagePreview?: boolean;
}

export interface ActionConfig {
    id: string;
    label: string;
    icon?: React.ComponentType<any>;
    permission?: string[];
    className?: string;
    onClick?: (row: any) => void;
    modal?: React.ComponentType<any>;
    serverAction?: string;
}

export interface DataSourceConfig<T = any> {
    type: DataSourceType;

    // Para Zustand
    store?: any;
    dataSelector?: (state: any) => T[];
    loadingSelector?: (state: any) => boolean;
    refreshAction?: (state: any) => Promise<void>;

    // Para estado local
    serverAction?: () => Promise<T[]>;

    // Para casos custom
    customHook?: () => {
        data: T[];
        loading: boolean;
        refresh: () => Promise<void>;
    };
}

export interface TableConfig<T = any> {
    entity: string;
    columns?: ColumnConfig[];
    actions?: ActionType[] | ActionConfig[];
    dataSource?: DataSourceConfig<T>;

    // Funcionalidades
    enableSelection?: boolean;
    enableBulkActions?: boolean;
    enableVirtualization?: boolean;
    enableAdvancedSearch?: boolean;
    enableExport?: boolean;

    // UI/UX
    title?: string;
    description?: string;
    createButton?: boolean | React.ComponentType<any>;

    // Overrides
    columnOverrides?: Record<string, Partial<ColumnConfig>>;
    hiddenColumns?: string[];
    customColumns?: ColumnConfig[];

    // Permisos
    permissions?: {
        view?: string[];
        edit?: string[];
        delete?: string[];
    };
}

export interface PerfectTableProps<T = any> {
    entity: string;
    config?: Partial<TableConfig<T>>;

    // Props directos para override rápido
    actions?: ActionType[] | ActionConfig[];
    enableSelection?: boolean;
    enableBulkActions?: boolean;
    title?: string;
    description?: string;
    createButton?: boolean | React.ComponentType<any>;

    // Data override (para casos específicos)
    data?: T[];
    loading?: boolean;

    // Callbacks
    onRowClick?: (row: T) => void;
    onSelectionChange?: (selectedRows: T[]) => void;

    // Styling
    className?: string;
    height?: number;
}
