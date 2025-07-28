'use client';

import type React from 'react';

// Componente Server optimizado para Next.js 15

import { Suspense } from 'react';
import { PrismaSchemaParser } from '../core/PrismaSchemaParser';
import { TableServerActionsFactory } from '../server/TableServerActions';
import { PerfectTableClient } from './PerfectTableClient';
import { TableSkeleton } from './TableSkeleton';
import { ErrorBoundary } from './ErrorBoundary';
import type { PerfectTableProps } from '../types/TableConfig';

interface PerfectTableServerProps<T = any> extends Omit<PerfectTableProps<T>, 'data' | 'loading'> {
    // Props específicos para Server Component
    initialData?: T[];
    filters?: Record<string, any>;
    pagination?: {
        page?: number;
        limit?: number;
    };
    // Streaming options
    enableStreaming?: boolean;
    fallback?: React.ReactNode;
}

/**
 * Server Component que maneja data fetching automático
 */
async function PerfectTableDataFetcher<T>({
    entity,
    filters,
    pagination,
    ...props
}: PerfectTableServerProps<T>) {
    try {
        // Crear server actions automáticamente
        const serverActions = TableServerActionsFactory.createServerActions<T>(entity);

        // Fetch data en el servidor
        let data: T[];
        let paginationInfo;

        if (pagination) {
            const result = await serverActions.getPaginated(
                pagination.page || 1,
                pagination.limit || 10,
                filters,
            );
            data = result.data;
            paginationInfo = result.pagination;
        } else {
            data = await serverActions.getAll(filters);
        }

        // Generar configuración automática desde Prisma schema
        const schemaConfig = PrismaSchemaParser.generateTableConfig(entity);

        return (
            <PerfectTableClient
                {...props}
                entity={entity}
                data={data}
                loading={false}
                serverActions={serverActions}
                schemaConfig={schemaConfig}
                pagination={paginationInfo}
            />
        );
    } catch (error) {
        console.error(`Error fetching data for ${entity}:`, error);
        throw error;
    }
}

/**
 * Componente principal con Suspense y Error Boundary
 */
export function PerfectTableServer<T = any>(props: PerfectTableServerProps<T>) {
    const { enableStreaming = true, fallback, ...restProps } = props;

    if (!enableStreaming) {
        // Renderizado tradicional sin streaming
        return (
            <ErrorBoundary fallback={<TableError entity={props.entity} />}>
                <PerfectTableDataFetcher {...restProps} />
            </ErrorBoundary>
        );
    }

    // Renderizado con streaming y Suspense
    return (
        <ErrorBoundary fallback={<TableError entity={props.entity} />}>
            <Suspense fallback={fallback || <TableSkeleton />}>
                <PerfectTableDataFetcher {...restProps} />
            </Suspense>
        </ErrorBoundary>
    );
}

/**
 * Componente de error personalizado
 */
function TableError({ entity }: { entity: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3">
                <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Error al cargar {entity.toLowerCase()}s
            </h3>
            <p className="mb-4 text-gray-600">
                Hubo un problema al obtener los datos. Por favor, intenta nuevamente.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
                Reintentar
            </button>
        </div>
    );
}

// Componentes de conveniencia para Server Components
export function UserTableServer(props: Omit<PerfectTableServerProps, 'entity'>) {
    return <PerfectTableServer entity="User" {...props} />;
}

export function RoleTableServer(props: Omit<PerfectTableServerProps, 'entity'>) {
    return <PerfectTableServer entity="Role" {...props} />;
}

export function TicketTableServer(props: Omit<PerfectTableServerProps, 'entity'>) {
    return <PerfectTableServer entity="Ticket" {...props} />;
}
