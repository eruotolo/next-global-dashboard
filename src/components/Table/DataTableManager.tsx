'use client';

import { useEffect, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useZustandAdapter, useServerActionAdapter } from './adapters';
import type { DataTableManagerProps } from './types/TableTypes';

/**
 * Componente principal del sistema de tablas genérico
 */
export function DataTableManager<T>({
    entityConfig,
    title,
    description,
    createModal: CreateModal,
    className = '',
}: DataTableManagerProps<T>) {
    // Usar el adaptador apropiado basado en el tipo de dataSource
    const zustandResult =
        entityConfig.dataSource.type === 'zustand'
            ? useZustandAdapter<T>(entityConfig.dataSource)
            : null;

    const serverActionResult =
        entityConfig.dataSource.type === 'serverAction'
            ? useServerActionAdapter<T>(entityConfig.dataSource)
            : null;

    // Seleccionar el resultado apropiado
    const adapterResult = zustandResult || serverActionResult;

    if (!adapterResult) {
        throw new Error(
            `Tipo de dataSource no soportado: ${(entityConfig.dataSource as any).type}`,
        );
    }

    // Procesar columnas (sin acciones por ahora para evitar errores)
    const processedColumns = useMemo(() => {
        return entityConfig.columns;
    }, [entityConfig.columns]);

    // Inicialización
    useEffect(() => {
        if (!adapterResult.initialized && !adapterResult.loading) {
            adapterResult.initialize();
        }
    }, [adapterResult.initialized, adapterResult.loading, adapterResult.initialize]);

    // Manejo de errores
    if (adapterResult.error) {
        return (
            <div className={`space-y-4 ${className}`}>
                <DataTableHeader
                    title={title}
                    description={description}
                    CreateModal={CreateModal}
                    refreshAction={adapterResult.refresh}
                />
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <div className="text-red-800">
                        <strong>Error al cargar datos:</strong> {adapterResult.error}
                    </div>
                    <button
                        onClick={adapterResult.refresh}
                        className="mt-2 rounded bg-red-100 px-3 py-1 text-sm text-red-800 hover:bg-red-200"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Render principal
    return (
        <div className={`space-y-4 ${className}`}>
            <DataTableHeader
                title={title}
                description={description}
                CreateModal={CreateModal}
                refreshAction={adapterResult.refresh}
            />

            <div className="mt-[20px]">
                <DataTable
                    columns={processedColumns}
                    data={adapterResult.data}
                    loading={adapterResult.loading}
                    filterPlaceholder={entityConfig.filterPlaceholder || 'Buscar...'}
                />
            </div>
        </div>
    );
}

// Componente Header
interface DataTableHeaderProps {
    title: string;
    description: string;
    CreateModal: React.ComponentType<{ refreshAction: () => void }>;
    refreshAction: () => Promise<void>;
}

function DataTableHeader({ title, description, CreateModal, refreshAction }: DataTableHeaderProps) {
    return (
        <div className="flex h-auto w-full justify-between">
            <div>
                <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                    {title}
                </h5>
                <p className="text-muted-foreground text-[13px]">{description}</p>
            </div>
            <div>
                <CreateModal refreshAction={refreshAction} />
            </div>
        </div>
    );
}
