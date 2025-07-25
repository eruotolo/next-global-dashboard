// Exportaciones principales de tipos para el sistema de tablas
export type {
    // Tipos base
    EntityTableConfig,
    DataSourceConfig,
    ZustandDataSource,
    ServerActionDataSource,
    TableOptions,

    // Adaptadores
    DataAdapter,
    ZustandConfig,
    UseDataAdapterResult,
    DataAdapterState,
    DataAdapterActions,

    // Sistema de acciones
    ActionConfig,
    EditActionConfig,
    DeleteActionConfig,
    ViewActionConfig,
    ChangePasswordActionConfig,
    ConfigActionConfig,
    CustomAction,

    // Modales
    ModalProps,
    ChangePasswordModalProps,

    // Column Factory
    TextColumnOptions,
    CurrencyColumnOptions,
    StatusConfig,
    FullNameConfig,

    // Componentes
    DataTableManagerProps,
    ActionCellProps,

    // Utilidades
    ExtractDataType,
    StrictEntityConfig,
    OperationResult,
} from './TableTypes';
