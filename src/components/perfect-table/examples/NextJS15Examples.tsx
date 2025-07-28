// Ejemplos de uso optimizados para Next.js 15

import { Suspense } from 'react';
import { PerfectTableServer } from '../components/PerfectTableServer';
import { PerfectTable } from '../PerfectTable';
import { TableSkeleton } from '../components/TableSkeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * EJEMPLO 1: Server Component con streaming (Next.js 15)
 * - Data fetching en el servidor
 * - Streaming con Suspense
 * - Error boundaries
 */
export function UserDashboardPage() {
    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-2xl font-bold">Dashboard de Usuarios</h1>

            <ErrorBoundary>
                <Suspense fallback={<TableSkeleton />}>
                    <PerfectTableServer
                        entity="User"
                        enableStreaming={true}
                        filters={{ state: 1 }} // Solo usuarios activos
                        pagination={{ page: 1, limit: 20 }}
                        enableSelection={true}
                        enableBulkActions={true}
                    />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}

/**
 * EJEMPLO 2: Client Component con Server Actions
 * - Optimistic updates
 * - Real-time refresh
 * - CRUD operations
 */
export function UserManagementClient() {
    return (
        <PerfectTable
            entity="User"
            enableServerActions={true}
            enableOptimisticUpdates={true}
            enablePrismaAutoConfig={true}
            config={{
                prismaIncludes: {
                    roles: {
                        include: {
                            role: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                enableBulkOperations: true,
                cacheStrategy: 'revalidate-on-demand',
            }}
            actions={['view', 'edit', 'change-password', 'assign-roles', 'delete']}
            enableSelection={true}
            enableBulkActions={true}
            onSelectionChange={(users) => {
                console.log('Usuarios seleccionados:', users);
            }}
        />
    );
}

/**
 * EJEMPLO 3: Tabla híbrida (Server + Client)
 * - Initial data del servidor
 * - Interactividad del cliente
 * - Mejor SEO y performance
 */
export async function HybridUserTable() {
    // Fetch inicial en el servidor
    const initialUsers = await fetch('/api/users').then((r) => r.json());

    return (
        <PerfectTable
            entity="User"
            data={initialUsers} // Data inicial del servidor
            enableServerActions={true} // Operaciones en el cliente
            enableOptimisticUpdates={true}
            config={{
                // Configuración híbrida
                dataSource: {
                    type: 'server-action',
                    initialData: initialUsers,
                    revalidateOnFocus: true,
                    revalidateOnReconnect: true,
                },
            }}
        />
    );
}

/**
 * EJEMPLO 4: Tabla con filtros avanzados y paginación
 */
export function AdvancedTicketTable() {
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                {/* Filtros personalizados */}
                <select className="rounded border px-3 py-2">
                    <option value="">Todos los estados</option>
                    <option value="OPEN">Abierto</option>
                    <option value="IN_PROGRESS">En progreso</option>
                    <option value="RESOLVED">Resuelto</option>
                </select>

                <select className="rounded border px-3 py-2">
                    <option value="">Todas las prioridades</option>
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                </select>
            </div>

            <PerfectTableServer
                entity="Ticket"
                filters={
                    {
                        // Los filtros se aplicarían automáticamente
                    }
                }
                pagination={{
                    page: 1,
                    limit: 25,
                }}
                config={{
                    columnOverrides: {
                        status: {
                            colorMap: {
                                OPEN: 'green',
                                IN_PROGRESS: 'yellow',
                                RESOLVED: 'blue',
                                CLOSED: 'gray',
                            },
                        },
                        priority: {
                            colorMap: {
                                LOW: 'green',
                                MEDIUM: 'yellow',
                                HIGH: 'orange',
                                URGENT: 'red',
                            },
                        },
                    },
                }}
            />
        </div>
    );
}

/**
 * EJEMPLO 5: Tabla con validaciones automáticas de Prisma
 */
export function ValidatedRoleTable() {
    return (
        <PerfectTable
            entity="Role"
            enablePrismaAutoConfig={true}
            config={{
                // Las validaciones se generan automáticamente desde el schema
                autoValidation: true,
                validationRules: {
                    // Reglas adicionales personalizadas
                    name: {
                        minLength: 3,
                        maxLength: 50,
                        pattern: /^[a-zA-Z\s]+$/,
                    },
                },
            }}
            onValidationError={(errors) => {
                console.log('Errores de validación:', errors);
            }}
        />
    );
}

/**
 * EJEMPLO 6: Dashboard completo con múltiples tablas
 */
export function CompleteDashboard() {
    return (
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
            {/* Usuarios recientes */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Usuarios Recientes</h2>
                <ErrorBoundary>
                    <Suspense fallback={<TableSkeleton rows={3} />}>
                        <PerfectTableServer
                            entity="User"
                            pagination={{ page: 1, limit: 5 }}
                            config={{
                                hiddenColumns: ['phone', 'address', 'city'],
                                actions: ['view', 'edit'],
                            }}
                        />
                    </Suspense>
                </ErrorBoundary>
            </div>

            {/* Tickets pendientes */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Tickets Pendientes</h2>
                <ErrorBoundary>
                    <Suspense fallback={<TableSkeleton rows={3} />}>
                        <PerfectTableServer
                            entity="Ticket"
                            filters={{ status: 'OPEN' }}
                            pagination={{ page: 1, limit: 5 }}
                            config={{
                                columnOverrides: {
                                    priority: {
                                        colorMap: {
                                            URGENT: 'red',
                                            HIGH: 'orange',
                                            MEDIUM: 'yellow',
                                            LOW: 'green',
                                        },
                                    },
                                },
                            }}
                        />
                    </Suspense>
                </ErrorBoundary>
            </div>

            {/* Roles del sistema */}
            <div className="space-y-4 lg:col-span-2">
                <h2 className="text-lg font-semibold">Gestión de Roles</h2>
                <ErrorBoundary>
                    <Suspense fallback={<TableSkeleton rows={4} />}>
                        <PerfectTableServer
                            entity="Role"
                            enableSelection={true}
                            enableBulkActions={true}
                            actions={['edit', 'assign-permissions', 'delete']}
                        />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
}
