// Exportaciones principales del sistema de tablas genérico

// Componente principal
export { DataTableManager } from './DataTableManager';

// Tipos principales
export type {
    EntityTableConfig,
    DataTableManagerProps,
    DataSourceConfig,
    ZustandDataSource,
    ServerActionDataSource,
    ActionConfig,
    StatusConfig,
    TextColumnOptions,
    CurrencyColumnOptions,
    FullNameConfig,
} from './types/TableTypes';

// Adaptadores
export {
    useZustandAdapter,
    useServerActionAdapter,
    ZustandAdapterFactory,
    ServerActionAdapterFactory,
} from './adapters';

// Factories
export { ColumnFactory, ActionCellFactory } from './factories';

// Re-exportar tipos útiles
export type { ColumnDef } from '@tanstack/react-table';
