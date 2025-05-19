'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAuditLogs, type AuditAction, type AuditEntity } from '@/lib/audit/auditLogger';
import type { Prisma } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
    });

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
                page: pagination.page,
                pageSize: pagination.pageSize,
            });

            setLogs(result.logs || []);
            setPagination({
                page: result.pagination.page,
                pageSize: result.pagination.pageSize,
                total: result.pagination.total,
                totalPages: Math.ceil(result.pagination.total / result.pagination.pageSize),
            });
        } catch (error) {
            console.error('Error al cargar logs de auditoría:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.page, pagination.pageSize]);

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
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));
    };

    const resetFilters = () => {
        setFilters({
            userId: '',
            action: '',
            entity: '',
            startDate: '',
            endDate: '',
        });
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));
    };

    const getActionBadgeColor = (action: string) => {
        if (action.includes('login_success') || action.includes('create'))
            return 'bg-green-100 text-green-800';
        if (action.includes('login_failed') || action.includes('delete'))
            return 'bg-red-100 text-red-800';
        if (action.includes('update')) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
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

    const goToPage = (page: number) => {
        setPagination((prev) => ({
            ...prev,
            page,
        }));
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Logs de Auditoría</CardTitle>
                    <CardDescription>
                        Visualiza y filtra los registros de actividad del sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div>
                            <Label className="custom-label">ID de Usuario</Label>
                            <Input
                                placeholder="ID de usuario"
                                value={filters.userId}
                                onChange={(e) => handleFilterChange('userId', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="custom-label">Acción</Label>
                            <Select
                                value={filters.action || 'all'}
                                onValueChange={(value) =>
                                    handleFilterChange('action', value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar acción" />
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
                            <Label className="custom-label">Entidad</Label>
                            <Select
                                value={filters.entity || 'all'}
                                onValueChange={(value) =>
                                    handleFilterChange('entity', value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar entidad" />
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
                            <Label className="custom-label">Fecha de Inicio</Label>
                            <Input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="custom-label">Fecha de Fin</Label>
                            <Input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mb-6">
                        <Button variant="outline" onClick={resetFilters}>
                            Limpiar filtros
                        </Button>
                        <Button onClick={applyFilters}>Aplicar filtros</Button>
                    </div>
                    {/* Tabla de logs */}
                    {loading ? (
                        <div className="text-center py-10">Cargando logs de auditoría...</div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha y Hora</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Acción</TableHead>
                                            <TableHead>Entidad</TableHead>
                                            <TableHead>Descripción</TableHead>
                                            <TableHead>IP</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center">
                                                    No se encontraron registros.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs.map((log) => (
                                                <TableRow key={log.id}>
                                                    {/* FECHA */}
                                                    <TableCell>
                                                        {formatDate(
                                                            log.createdAt
                                                                ? log.createdAt.toISOString()
                                                                : '',
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {log.userName ||
                                                            (log.userId
                                                                ? `Usuario ${log.userId}`
                                                                : '-')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={getActionBadgeColor(
                                                                log.action,
                                                            )}
                                                        >
                                                            {log.action.replace(/_/g, ' ')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{log.entity}</TableCell>
                                                    <TableCell>{log.description}</TableCell>
                                                    {/* IP */}
                                                    <TableCell>
                                                        {log.ipAddress &&
                                                        log.ipAddress.trim() !== ''
                                                            ? log.ipAddress
                                                            : '127.0.0.1'}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {/* Paginación */}
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    Página {pagination.page} de {pagination.totalPages}
                                </div>
                                <div className="inline-flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => goToPage(1)}
                                        disabled={pagination.page === 1}
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => goToPage(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => goToPage(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => goToPage(pagination.totalPages)}
                                        disabled={pagination.page === pagination.totalPages}
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
