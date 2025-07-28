// Componente Client optimizado

'use client';

import { useMemo, useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { PerfectTableProps } from '../types/TableConfig';
import { PerfectTableGenerator } from '../core/PerfectTableGenerator';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PerfectTableClientProps<T = any> extends PerfectTableProps<T> {
    serverActions?: any;
    schemaConfig?: any;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export function PerfectTableClient<T = any>({
    entity,
    config: userConfig,
    data: propData = [],
    loading: propLoading = false,
    serverActions,
    schemaConfig,
    pagination,
    actions,
    enableSelection,
    enableBulkActions,
    title,
    description,
    createButton,
    onRowClick,
    onSelectionChange,
    className,
    height,
}: PerfectTableClientProps<T>) {
    const [isPending, startTransition] = useTransition();
    const [selectedRows, setSelectedRows] = useState<T[]>([]);
    const [optimisticData, setOptimisticData] = useState<T[]>(propData);

    // Generar configuración automática mejorada con schema de Prisma
    const tableConfig = useMemo(() => {
        const baseConfig = PerfectTableGenerator.generateTableConfig(entity, {
            ...userConfig,
            // Merge con configuración del schema
            ...(schemaConfig && {
                columns: schemaConfig.fields?.map((field: any) => ({
                    id: field.name,
                    header: field.name,
                    type: field.type,
                    required: field.required,
                })),
            }),
            // Props directos override la configuración
            actions: actions || userConfig?.actions,
            enableSelection: enableSelection ?? userConfig?.enableSelection,
            enableBulkActions: enableBulkActions ?? userConfig?.enableBulkActions,
            title: title || userConfig?.title,
            description: description || userConfig?.description,
            createButton: createButton ?? userConfig?.createButton,
        });

        return baseConfig;
    }, [
        entity,
        userConfig,
        schemaConfig,
        actions,
        enableSelection,
        enableBulkActions,
        title,
        description,
        createButton,
    ]);

    // Refresh optimizado con optimistic updates
    const refreshAction = useCallback(async () => {
        if (!serverActions) return;

        startTransition(async () => {
            try {
                const newData = await serverActions.getAll();
                setOptimisticData(newData);
                toast.success('Datos actualizados correctamente');
            } catch (error) {
                console.error('Error refreshing data:', error);
                toast.error('Error al actualizar los datos');
            }
        });
    }, [serverActions]);

    // Operaciones CRUD optimizadas
    const handleCreate = useCallback(
        async (data: Partial<T>) => {
            if (!serverActions) return;

            startTransition(async () => {
                try {
                    const newItem = await serverActions.create(data);
                    setOptimisticData((prev) => [newItem, ...prev]);
                    toast.success(`${entity} creado correctamente`);
                } catch (error) {
                    console.error('Error creating item:', error);
                    toast.error(`Error al crear ${entity.toLowerCase()}`);
                }
            });
        },
        [serverActions, entity],
    );

    const handleUpdate = useCallback(
        async (id: string, data: Partial<T>) => {
            if (!serverActions) return;

            startTransition(async () => {
                try {
                    const updatedItem = await serverActions.update(id, data);
                    setOptimisticData((prev) =>
                        prev.map((item) => ((item as any).id === id ? updatedItem : item)),
                    );
                    toast.success(`${entity} actualizado correctamente`);
                } catch (error) {
                    console.error('Error updating item:', error);
                    toast.error(`Error al actualizar ${entity.toLowerCase()}`);
                }
            });
        },
        [serverActions, entity],
    );

    const handleDelete = useCallback(
        async (id: string) => {
            if (!serverActions) return;

            startTransition(async () => {
                try {
                    await serverActions.delete(id);
                    setOptimisticData((prev) => prev.filter((item) => (item as any).id !== id));
                    toast.success(`${entity} eliminado correctamente`);
                } catch (error) {
                    console.error('Error deleting item:', error);
                    toast.error(`Error al eliminar ${entity.toLowerCase()}`);
                }
            });
        },
        [serverActions, entity],
    );

    // Operaciones bulk
    const handleBulkDelete = useCallback(
        async (ids: string[]) => {
            if (!serverActions) return;

            startTransition(async () => {
                try {
                    const deletedCount = await serverActions.bulkDelete(ids);
                    setOptimisticData((prev) =>
                        prev.filter((item) => !ids.includes((item as any).id)),
                    );
                    setSelectedRows([]);
                    toast.success(`${deletedCount} ${entity.toLowerCase()}(s) eliminado(s)`);
                } catch (error) {
                    console.error('Error bulk deleting:', error);
                    toast.error('Error al eliminar elementos seleccionados');
                }
            });
        },
        [serverActions, entity],
    );

    // Generar columnas para TanStack Table con acciones mejoradas
    const columns = useMemo(() => {
        return PerfectTableGenerator.generateTanStackColumns(tableConfig, refreshAction, {
            onUpdate: handleUpdate,
            onDelete: handleDelete,
            onCreate: handleCreate,
        });
    }, [tableConfig, refreshAction, handleUpdate, handleDelete, handleCreate]);

    // Manejar selección
    const handleSelectionChange = useCallback(
        (newSelectedRows: T[]) => {
            setSelectedRows(newSelectedRows);
            onSelectionChange?.(newSelectedRows);
        },
        [onSelectionChange],
    );

    // Placeholder de filtro inteligente
    const filterPlaceholder = useMemo(() => {
        return `Buscar ${tableConfig.title?.toLowerCase() || entity.toLowerCase()}...`;
    }, [tableConfig.title, entity]);

    return (
        <div className={`space-y-4 ${className || ''}`} style={{ height }}>
            {/* Header mejorado */}
            <div className="flex items-center justify-between">
                <div>
                    {tableConfig.title && (
                        <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                            {tableConfig.title}
                        </h5>
                    )}
                    {tableConfig.description && (
                        <p className="text-muted-foreground text-[13px]">
                            {tableConfig.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Botón de refresh */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshAction}
                        disabled={isPending}
                        className="h-8 bg-transparent"
                    >
                        <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                    </Button>

                    {/* Botón de crear */}
                    {tableConfig.createButton && (
                        <div>
                            {typeof tableConfig.createButton === 'function' ? (
                                <tableConfig.createButton
                                    refreshAction={refreshAction}
                                    onCreate={handleCreate}
                                />
                            ) : (
                                <Button size="sm">Crear {entity.toLowerCase()}</Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Acciones bulk */}
            {enableBulkActions && selectedRows.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                    <span className="text-sm text-blue-700">
                        {selectedRows.length} elemento(s) seleccionado(s)
                    </span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBulkDelete(selectedRows.map((row: any) => row.id))}
                        disabled={isPending}
                    >
                        Eliminar seleccionados
                    </Button>
                </div>
            )}

            {/* Tabla principal */}
            <div className={height ? 'flex-1 overflow-hidden' : undefined}>
                <DataTable
                    columns={columns}
                    data={optimisticData}
                    loading={propLoading || isPending}
                    filterPlaceholder={filterPlaceholder}
                    onSelectionChange={handleSelectionChange}
                    pagination={pagination}
                />
            </div>
        </div>
    );
}
