'use client';

import type React from 'react';

import { useMemo } from 'react';
import type { PerfectTableProps } from './types/TableConfig';
import { PerfectTableGenerator } from './core/PerfectTableGenerator';
import { PrismaSchemaParser } from './core/PrismaSchemaParser';
import { useAutoData } from './datasource/DataSourceAdapter';
import { DataTable } from '@/components/ui/data-table/data-table';

// Componente header automático
function PerfectTableHeader({
    title,
    description,
    createButton,
    entity,
    refresh,
}: {
    title?: string;
    description?: string;
    createButton?: boolean | React.ComponentType<any>;
    entity: string;
    refresh: () => Promise<void>;
}) {
    if (!title && !description && !createButton) {
        return null;
    }

    const CreateComponent = typeof createButton === 'function' ? createButton : null;

    return (
        <div className="flex h-auto w-full justify-between">
            <div>
                {title && (
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        {title}
                    </h5>
                )}
                {description && <p className="text-muted-foreground text-[13px]">{description}</p>}
            </div>
            {createButton && (
                <div>
                    {CreateComponent ? (
                        <CreateComponent refreshAction={refresh} />
                    ) : (
                        <div className="text-sm text-gray-500">Botón de crear para {entity}</div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * PerfectTable - Componente de tabla perfecto con configuración automática
 * MEJORADO para Next.js 15 + Prisma + PostgreSQL
 *
 * Ejemplos de uso:
 *
 * // Zero config - genera tabla completa automáticamente
 * <PerfectTable entity="User" />
 *
 * // Configuración mínima
 * <PerfectTable
 *   entity="User"
 *   actions={['view', 'edit', 'delete']}
 *   enableSelection={true}
 * />
 *
 * // Configuración avanzada con Prisma
 * <PerfectTable
 *   entity="User"
 *   enablePrismaAutoConfig={true}
 *   config={{
 *     columnOverrides: {
 *       email: { linkable: true },
 *       name: { width: 200 }
 *     },
 *     hiddenColumns: ['birthdate'],
 *     customColumns: [
 *       { id: 'avatar', header: 'Avatar', render: AvatarCell }
 *     ]
 *   }}
 * />
 */
export function PerfectTable<T = any>({
    entity,
    config: userConfig,
    actions,
    enableSelection,
    enableBulkActions,
    title,
    description,
    createButton,
    data: propData,
    loading: propLoading,
    onRowClick,
    onSelectionChange,
    className,
    height,
    // Nuevas props mejoradas
    enablePrismaAutoConfig = true,
}: PerfectTableProps<T> & {
    enablePrismaAutoConfig?: boolean;
}) {
    // 1. Generar configuración automática desde Prisma schema
    const prismaConfig = useMemo(() => {
        if (!enablePrismaAutoConfig) return null;
        return PrismaSchemaParser.generateTableConfig(entity);
    }, [entity, enablePrismaAutoConfig]);

    // 2. Generar configuración de tabla mejorada
    const tableConfig = useMemo(() => {
        const baseConfig = {
            ...userConfig,
            // Merge con configuración de Prisma
            ...(prismaConfig && {
                fields: prismaConfig.fields,
                relations: prismaConfig.relations,
                specialColumns: prismaConfig.specialColumns,
            }),
            // Props directos override la configuración
            actions: actions || userConfig?.actions,
            enableSelection: enableSelection ?? userConfig?.enableSelection,
            enableBulkActions: enableBulkActions ?? userConfig?.enableBulkActions,
            title: title || userConfig?.title,
            description: description || userConfig?.description,
            createButton: createButton ?? userConfig?.createButton,
        };

        return PerfectTableGenerator.generateTableConfig(entity, baseConfig);
    }, [
        entity,
        userConfig,
        prismaConfig,
        actions,
        enableSelection,
        enableBulkActions,
        title,
        description,
        createButton,
    ]);

    // 3. Obtener datos automáticamente (mejorado con Prisma includes)
    const autoData = useAutoData<T>(entity, {
        ...tableConfig.dataSource,
        // Auto-includes basados en el schema de Prisma
        ...(prismaConfig && {
            includes: PrismaSchemaParser.getAutoIncludes(entity),
        }),
    });

    // 4. Usar datos de props si se proporcionan, sino usar datos automáticos
    const finalData = propData ?? autoData.data;
    const finalLoading = propLoading ?? autoData.loading;
    const refreshAction = autoData.refresh;

    // 5. Generar columnas para TanStack Table (mejorado)
    const columns = useMemo(() => {
        return PerfectTableGenerator.generateTanStackColumns(tableConfig, refreshAction);
    }, [tableConfig, refreshAction]);

    // 6. Generar placeholder de filtro inteligente
    const filterPlaceholder = useMemo(() => {
        return `Buscar ${tableConfig.title?.toLowerCase() || entity.toLowerCase()}...`;
    }, [tableConfig.title, entity]);

    return (
        <div className={`space-y-4 ${className || ''}`} style={{ height }}>
            {/* Header automático mejorado */}
            <PerfectTableHeader
                title={tableConfig.title}
                description={tableConfig.description}
                createButton={tableConfig.createButton}
                entity={entity}
                refresh={refreshAction}
            />

            {/* Información del schema de Prisma (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && prismaConfig && (
                <div className="rounded bg-gray-50 p-2 text-xs text-gray-500">
                    <details>
                        <summary className="cursor-pointer">
                            Configuración automática de Prisma ({prismaConfig.fields?.length}{' '}
                            campos, {prismaConfig.relations?.length} relaciones)
                        </summary>
                        <pre className="mt-2 text-xs">{JSON.stringify(prismaConfig, null, 2)}</pre>
                    </details>
                </div>
            )}

            {/* Tabla principal - reutiliza DataTable existente */}
            <div className={height ? 'flex-1 overflow-hidden' : undefined}>
                <DataTable
                    columns={columns}
                    data={finalData}
                    loading={finalLoading}
                    filterPlaceholder={filterPlaceholder}
                />
            </div>
        </div>
    );
}

// Componentes de conveniencia mejorados
export function UserTable(props: Omit<PerfectTableProps, 'entity'>) {
    return <PerfectTable entity="User" enablePrismaAutoConfig={true} {...props} />;
}

export function RoleTable(props: Omit<PerfectTableProps, 'entity'>) {
    return <PerfectTable entity="Role" enablePrismaAutoConfig={true} {...props} />;
}

export function TicketTable(props: Omit<PerfectTableProps, 'entity'>) {
    return <PerfectTable entity="Ticket" enablePrismaAutoConfig={true} {...props} />;
}

// Export default
export default PerfectTable;
