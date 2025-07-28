// Export principal del componente PerfectTable

// Componente principal
export { default as PerfectTable, UserTable, RoleTable, TicketTable } from './PerfectTable';

// Types
export type {
    TableConfig,
    ColumnConfig,
    ActionConfig,
    DataSourceConfig,
    PerfectTableProps,
    ColumnType,
    DataSourceType,
    ActionType,
} from './types/TableConfig';

// Core mejorado
export { PerfectTableGenerator } from './core/PerfectTableGenerator';
export { ConventionApplier, INTELLIGENT_CONVENTIONS } from './core/Conventions';
export { PrismaSchemaParser } from './core/PrismaSchemaParser';

// Column Factories
export {
    createColumn,
    createSelectionColumn,
    createTextColumn,
    createEmailColumn,
    createPhoneColumn,
    createDateColumn,
    createBadgeColumn,
    createImageColumn,
    createNumberColumn,
    createBooleanColumn,
    fullNameColumn,
    rolesColumn,
    permissionsColumn,
} from './columns/ColumnFactory';

// Action Factories
export {
    createActionColumn,
    createViewAction,
    createEditAction,
    createDeleteAction,
    createChangePasswordAction,
    createAssignRolesAction,
    createAssignPermissionsAction,
    getDefaultActionsForEntity,
} from './actions/ActionFactory';

// Data Source Adapters
export {
    useAutoData,
    useZustandData,
    useServerActionData,
    useCustomData,
    useUserData,
    useRoleData,
    useTicketData,
    registerDataSource,
} from './datasource/DataSourceAdapter';
