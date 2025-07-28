import type { ColumnDef } from '@tanstack/react-table';
import type {
    TableConfig,
    ColumnConfig,
    ActionConfig,
    DataSourceConfig,
} from '../types/TableConfig';
import { ConventionApplier, INTELLIGENT_CONVENTIONS } from './Conventions';
import {
    createColumn,
    fullNameColumn,
    rolesColumn,
    permissionsColumn,
} from '../columns/ColumnFactory';
import { createActionColumn, getDefaultActionsForEntity } from '../actions/ActionFactory';

// Mapeo de entidades a sus campos conocidos
const ENTITY_FIELD_MAPPING: Record<string, any> = {
    User: {
        fields: [
            { name: 'name', type: 'String', required: true },
            { name: 'lastName', type: 'String', required: true },
            { name: 'email', type: 'String', required: true },
            { name: 'phone', type: 'String', required: false },
            { name: 'birthdate', type: 'DateTime', required: false },
            { name: 'address', type: 'String', required: false },
            { name: 'city', type: 'String', required: false },
            { name: 'image', type: 'String', required: false },
            { name: 'state', type: 'Int', required: false },
        ],
        relations: [{ name: 'roles', type: 'UserRole[]' }],
        specialColumns: ['fullName', 'roles'],
    },
    Role: {
        fields: [
            { name: 'name', type: 'String', required: true },
            { name: 'state', type: 'Int', required: false },
        ],
        relations: [{ name: 'permissionRole', type: 'PermissionRole[]' }],
        specialColumns: ['permissions'],
    },
    Ticket: {
        fields: [
            { name: 'code', type: 'String', required: true },
            { name: 'title', type: 'String', required: true },
            { name: 'status', type: 'Enum', required: true },
            { name: 'priority', type: 'Enum', required: true },
            { name: 'userName', type: 'String', required: false },
            { name: 'userLastName', type: 'String', required: false },
        ],
        relations: [],
        specialColumns: ['fullName'],
    },
};

export class PerfectTableGenerator {
    static generateTableConfig<T>(
        entity: string,
        userConfig?: Partial<TableConfig<T>>,
    ): TableConfig<T> {
        const entityMetadata = this.getEntityMetadata(entity);
        const autoColumns = this.generateColumns(
            entity,
            entityMetadata,
            userConfig?.columnOverrides,
        );
        const finalColumns = this.applyColumnOverrides(
            autoColumns,
            userConfig?.columnOverrides,
            userConfig?.hiddenColumns,
            userConfig?.customColumns,
        );
        const autoActions = this.generateActions(entity, userConfig?.actions);
        const autoDataSource = this.detectDataSource(entity, userConfig?.dataSource);

        const config: TableConfig<T> = {
            entity,
            columns: finalColumns,
            actions: autoActions,
            dataSource: autoDataSource,
            title: userConfig?.title || this.generateTitle(entity),
            description: userConfig?.description || 'Crear, Editar y Eliminar',
            enableSelection: userConfig?.enableSelection ?? false,
            enableBulkActions: userConfig?.enableBulkActions ?? false,
            enableVirtualization: userConfig?.enableVirtualization ?? false,
            enableAdvancedSearch: userConfig?.enableAdvancedSearch ?? true,
            enableExport: userConfig?.enableExport ?? true,
            createButton: userConfig?.createButton ?? true,
            permissions: userConfig?.permissions || this.generatePermissions(entity),
            ...userConfig,
        };

        return config;
    }

    private static getEntityMetadata(entity: string) {
        return (
            ENTITY_FIELD_MAPPING[entity] || {
                fields: [],
                relations: [],
                specialColumns: [],
            }
        );
    }

    private static generateColumns(
        entity: string,
        metadata: any,
        columnOverrides?: Record<string, Partial<ColumnConfig>>,
    ): ColumnConfig[] {
        const columns: ColumnConfig[] = [];

        if (metadata.specialColumns?.includes('fullName')) {
            columns.push(fullNameColumn());
        } else {
            metadata.fields
                .filter((field: any) => !ConventionApplier.shouldHideField(field.name))
                .forEach((field: any) => {
                    if (
                        field.name === 'name' &&
                        metadata.fields.some((f: any) => f.name === 'lastName')
                    ) {
                        return;
                    }
                    const columnConfig = this.createColumnFromField(field);
                    if (columnConfig) {
                        columns.push(columnConfig);
                    }
                });
        }

        metadata.fields
            .filter(
                (field: any) =>
                    !ConventionApplier.shouldHideField(field.name) &&
                    !['name', 'lastName'].includes(field.name),
            )
            .forEach((field: any) => {
                const columnConfig = this.createColumnFromField(field);
                if (columnConfig) {
                    columns.push(columnConfig);
                }
            });

        if (metadata.specialColumns?.includes('roles')) {
            columns.push(rolesColumn());
        }

        if (metadata.specialColumns?.includes('permissions')) {
            columns.push(permissionsColumn());
        }

        return columns;
    }

    private static createColumnFromField(field: any): ColumnConfig | null {
        if (ConventionApplier.shouldHideField(field.name)) {
            return null;
        }

        const columnType = ConventionApplier.inferColumnType(field.name, field.type);
        const header = ConventionApplier.generateHeader(field.name);

        const config: ColumnConfig = {
            id: field.name,
            header,
            accessorKey: field.name,
            type: columnType,
            sortable: ['text', 'number', 'date', 'email'].includes(columnType),
            filterable: ['text', 'email'].includes(columnType),
        };

        if (columnType === 'email' || columnType === 'phone') {
            config.linkable = true;
        }

        if (columnType === 'badge') {
            config.colorMap = ConventionApplier.getBadgeColorMap(field.name);
        }

        return config;
    }

    private static applyColumnOverrides(
        baseColumns: ColumnConfig[],
        overrides?: Record<string, Partial<ColumnConfig>>,
        hiddenColumns?: string[],
        customColumns?: ColumnConfig[],
    ): ColumnConfig[] {
        let finalColumns = [...baseColumns];

        if (overrides) {
            finalColumns = finalColumns.map((column) => {
                const override = overrides[column.id];
                return override ? { ...column, ...override } : column;
            });
        }

        if (hiddenColumns) {
            finalColumns = finalColumns.filter((column) => !hiddenColumns.includes(column.id));
        }

        if (customColumns) {
            finalColumns.push(...customColumns);
        }

        return finalColumns;
    }

    private static generateActions(entity: string, userActions?: any[]): ActionConfig[] {
        if (userActions) {
            return userActions.map((action) => {
                if (typeof action === 'string') {
                    return this.createActionFromString(action, entity);
                }
                return action;
            });
        }

        return getDefaultActionsForEntity(entity);
    }

    private static createActionFromString(actionType: string, entity: string): ActionConfig {
        const baseConfig: ActionConfig = {
            id: actionType,
            label: this.getActionLabel(actionType, entity),
            permission: INTELLIGENT_CONVENTIONS.permissionMapping[
                actionType as keyof typeof INTELLIGENT_CONVENTIONS.permissionMapping
            ] || ['Editar'],
        };

        if (actionType === 'delete') {
            baseConfig.className = 'text-red-600';
        }

        return baseConfig;
    }

    private static getActionLabel(actionType: string, entity: string): string {
        const entityLower = entity.toLowerCase();

        switch (actionType) {
            case 'view':
                return 'Ver perfil';
            case 'edit':
                return `Editar ${entityLower}`;
            case 'delete':
                return `Eliminar ${entityLower}`;
            case 'change-password':
                return 'Cambiar contraseña';
            case 'assign-roles':
                return 'Asignar roles';
            case 'assign-permissions':
                return 'Asignar permisos';
            default:
                return actionType;
        }
    }

    private static detectDataSource<T>(
        entity: string,
        userDataSource?: DataSourceConfig<T>,
    ): DataSourceConfig<T> {
        if (userDataSource) {
            return userDataSource;
        }

        const detection = ConventionApplier.detectDataSource(entity);

        return {
            type: detection.type as any,
            ...detection.config,
        };
    }

    private static generateTitle(entity: string): string {
        const entityLower = entity.toLowerCase();

        const titleMap: Record<string, string> = {
            user: 'Usuarios',
            role: 'Roles',
            ticket: 'Tickets',
            permission: 'Permisos',
        };

        return titleMap[entityLower] || entity + 's';
    }

    private static generatePermissions(entity: string) {
        return {
            view: ['Ver', `Ver${entity}`],
            edit: ['Editar', `Editar${entity}`],
            delete: ['Eliminar', `Eliminar${entity}`],
        };
    }

    static generateTanStackColumns<T>(
        config: TableConfig<T>,
        refreshAction?: () => Promise<void>,
    ): ColumnDef<T>[] {
        const columns: ColumnDef<T>[] = [];

        if (config.enableSelection) {
            columns.push(
                createColumn({
                    id: 'select',
                    header: '',
                    type: 'selection',
                }) as ColumnDef<T>,
            );
        }

        config.columns?.forEach((columnConfig) => {
            columns.push(createColumn(columnConfig) as ColumnDef<T>);
        });

        if (config.actions && config.actions.length > 0) {
            const actionConfigs = config.actions.map((action) =>
                typeof action === 'string'
                    ? this.createActionFromString(action, config.entity)
                    : action,
            );

            columns.push(createActionColumn(actionConfigs, refreshAction) as ColumnDef<T>);
        }

        return columns;
    }
}
