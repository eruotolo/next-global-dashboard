'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAuditLogs, type AuditAction, type AuditEntity } from '@/lib/audit/auditLogger';
import type { Prisma } from '@prisma/client';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { ColumnDef } from '@tanstack/react-table';

const actionTypes: AuditAction[] = [
    'login_success',
    'login_failed',
    'logout',
    'create_role',
    'update_role',
    'delete_role',
    'update_permissions',
    'create_user',
    'update_user',
    'delete_user',
    'assign_role_user',
    'remove_role_user',
    'create_ticket',
    'update_ticket',
    'delete_ticket',
];

const entityTypes: AuditEntity[] = ['User', 'Role', 'Permission', 'Ticket', 'System'];

interface AuditLog {
    id: string;
    userId: string | null;
    userName: string | null;
    action: string;
    entity: string | null;
    description: string;
    ipAddress: string | null;
    createdAt: Date;
    entityId: string | null;
    userAgent: string | null;
    metadata: Prisma.JsonValue | null;
}

const getActionBadgeColor = (action: string) => {
    if (action.includes('login_success') || action.includes('create'))
        return 'text-green-500 bg-green-100 border-green-400';
    if (action.includes('login_failed') || action.includes('delete'))
        return 'text-red-500 bg-red-100 border-red-400';
    if (action.includes('update')) return 'text-blue-500 bg-blue-100 border-blue-400';
    return 'text-gray-500 bg-gray-100 border-gray-400';
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';

    try {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'Fecha inválida';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    } catch {
        return 'Fecha inválida';
    }
};

const columns: ColumnDef<AuditLog>[] = [
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Fecha y Hora
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return (
                <div className="font-mono text-[13px]">
                    {formatDate(row.original.createdAt.toString())}
                </div>
            );
        },
    },
    {
        accessorKey: 'userName',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Usuario
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return (
                <div className="font-mono text-[13px]">
                    {row.original.userName || (row.original.userId ? `Usuario ${row.original.userId}` : '-')}
                </div>
            );
        },
    },
    {
        accessorKey: 'action',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Acción
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center">
                    <div
                        className={`px-2 py-1 rounded-[30px] text-center font-medium text-[13px] w-[120px] ${getActionBadgeColor(
                            row.original.action,
                        )}`}
                    >
                        {row.original.action.replace(/_/g, ' ')}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'entity',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Entidad
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return <div className="font-mono text-[13px]">{row.original.entity}</div>;
        },
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Descripción
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return <div className="font-mono text-[13px]">{row.original.description}</div>;
        },
    },
    {
        accessorKey: 'ipAddress',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                IP
                <ArrowUpDown className="ml-2 w-4 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return (
                <div className="font-mono text-[13px]">
                    {row.original.ipAddress && row.original.ipAddress.trim() !== ''
                        ? row.original.ipAddress
                        : '127.0.0.1'}
                </div>
            );
        },
    },
];

function AuditLogsContent() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        userId: '',
        action: '',
        entity: '',
        startDate: '',
        endDate: '',
    });

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const startDate = filters.startDate ? new Date(filters.startDate) : undefined;
            const endDate = filters.endDate ? new Date(filters.endDate) : undefined;

            const result = await getAuditLogs({
                userId: filters.userId || undefined,
                action: filters.action ? (filters.action as AuditAction) : undefined,
                entity: filters.entity ? (filters.entity as AuditEntity) : undefined,
                startDate,
                endDate,
                page: 1,
                pageSize: 50,
            });

            setLogs(result.logs || []);
        } catch (error) {
            console.error('Error al cargar logs de auditoría:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        fetchLogs();
    };

    const resetFilters = () => {
        setFilters({
            userId: '',
            action: '',
            entity: '',
            startDate: '',
            endDate: '',
        });
    };

    return (
        <div>
            <div className="flex justify-between w-full h-auto">
                <div>
                    <h5 className="font-medium tracking-tight leading-none mb-[5px] text-[20px]">
                        Logs de Auditoría
                    </h5>
                    <p className="text-muted-foreground text-[13px]">
                        Visualiza y filtra los registros de actividad del sistema
                    </p>
                </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 mt-[20px]">
                <div>
                    <Input
                        placeholder="Filtrar por usuario"
                        value={filters.userId}
                        onChange={(e) => handleFilterChange('userId', e.target.value)}
                        className="h-8 w-full bg-white"
                    />
                </div>
                <div>
                    <Select
                        value={filters.action || 'all'}
                        onValueChange={(value) =>
                            handleFilterChange('action', value === 'all' ? '' : value)
                        }
                    >
                        <SelectTrigger className="h-8 w-full bg-white">
                            <SelectValue placeholder="Filtrar por acción" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las acciones</SelectItem>
                            {actionTypes.map((action) => (
                                <SelectItem key={action} value={action}>
                                    {action.replace('_', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select
                        value={filters.entity || 'all'}
                        onValueChange={(value) =>
                            handleFilterChange('entity', value === 'all' ? '' : value)
                        }
                    >
                        <SelectTrigger className="h-8 w-full bg-white">
                            <SelectValue placeholder="Filtrar por entidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las entidades</SelectItem>
                            {entityTypes.map((entity) => (
                                <SelectItem key={entity} value={entity}>
                                    {entity}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="h-8 w-full bg-white"
                        placeholder="Fecha de inicio"
                    />
                </div>
                <div>
                    <Input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="h-8 w-full bg-white"
                        placeholder="Fecha de fin"
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-2 mb-6">
                <Button variant="outline" onClick={resetFilters} className="h-8">
                    Limpiar filtros
                </Button>
                <Button onClick={applyFilters} className="h-8">
                    Aplicar filtros
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={logs}
                loading={loading}
                filterPlaceholder="Buscar en todos los campos..."
            />
        </div>
    );
}

export default function AuditLogsPage() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="col-span-1 p-6 rounded-xl md:col-span-2 bg-muted/50">
                        <AuditLogsContent />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
