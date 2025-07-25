'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
    TextColumnOptions,
    CurrencyColumnOptions,
    StatusConfig,
    FullNameConfig,
} from '../types';

// Columna de texto básica con ordenamiento
export function sortableText<T>(
    key: keyof T,
    label: string,
    options: TextColumnOptions = {},
): ColumnDef<T> {
    return {
        id: String(key),
        accessorKey: key as string,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className={options.minWidth ? `min-w-[${options.minWidth}px]` : ''}
            >
                {label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const value = row.getValue(String(key)) as string;
            const displayValue = options.transform ? options.transform(value) : value;

            return (
                <div
                    className={options.minWidth ? `min-w-[${options.minWidth}px]` : ''}
                    style={{
                        minWidth: options.minWidth,
                        maxWidth: options.maxWidth,
                    }}
                >
                    {displayValue}
                </div>
            );
        },
        enableSorting: true,
        enableGlobalFilter: options.searchable !== false,
    };
}

// Columna de texto simple sin ordenamiento
export function text<T>(
    key: keyof T,
    label: string,
    options: TextColumnOptions = {},
): ColumnDef<T> {
    return {
        id: String(key),
        accessorKey: key as string,
        header: () => <div className="font-semibold whitespace-nowrap">{label}</div>,
        cell: ({ row }) => {
            const value = row.getValue(String(key)) as string;
            const displayValue = options.transform ? options.transform(value) : value;

            return (
                <div
                    style={{
                        minWidth: options.minWidth,
                        maxWidth: options.maxWidth,
                    }}
                >
                    {displayValue}
                </div>
            );
        },
        enableSorting: false,
        enableGlobalFilter: options.searchable !== false,
    };
}

// Columna para mostrar nombre completo combinando múltiples campos
export function fullName<T>(
    fields: (keyof T)[],
    label: string,
    config: FullNameConfig = { fields: [], separator: ' ' },
): ColumnDef<T> {
    return {
        id: 'fullName',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                {label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorFn: (row) => {
            const values = fields.map((field) => (row[field] as string) || '');
            return values.join(config.separator || ' ').trim();
        },
        cell: ({ row }) => {
            const original = row.original;
            const values = fields.map((field) => (original[field] as string) || '');
            const fullName = values.join(config.separator || ' ').trim();
            return <div>{fullName}</div>;
        },
        enableSorting: true,
        enableGlobalFilter: true,
    };
}

// Columna para emails con enlace clickeable
export function email<T>(key: keyof T, label = 'Email'): ColumnDef<T> {
    return {
        id: String(key),
        accessorKey: key as string,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                {label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const email = row.getValue(String(key)) as string;
            return (
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                    {email}
                </a>
            );
        },
        enableSorting: true,
        enableGlobalFilter: true,
    };
}

// Columna para teléfonos con formato y enlace clickeable
export function phone<T>(key: keyof T, label = 'Teléfono'): ColumnDef<T> {
    const formatPhone = (phone: string) => {
        return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    };

    return {
        id: String(key),
        accessorKey: key as string,
        header: () => <div className="font-semibold whitespace-nowrap">{label}</div>,
        cell: ({ row }) => {
            const phone = row.getValue(String(key)) as string;
            const formattedPhone = formatPhone(phone);

            return (
                <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
                    {formattedPhone}
                </a>
            );
        },
        enableSorting: false,
        enableGlobalFilter: true,
    };
}

// Columna para mostrar valores monetarios con formato de moneda
export function currency<T>(
    key: keyof T,
    label: string,
    options: CurrencyColumnOptions = {},
): ColumnDef<T> {
    const { currency = '$', decimals = 2, locale = 'es-ES', ...textOptions } = options;

    return {
        id: String(key),
        accessorKey: key as string,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                {label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const value = row.getValue(String(key)) as number;
            const formatted = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(value);

            return (
                <div
                    className="text-right font-mono"
                    style={{
                        minWidth: textOptions.minWidth,
                        maxWidth: textOptions.maxWidth,
                    }}
                >
                    {formatted}
                </div>
            );
        },
        enableSorting: true,
        enableGlobalFilter: false,
    };
}

// Columna para mostrar estados con badges de colores
export function statusBadge<T>(
    key: keyof T,
    label: string,
    statusConfig: StatusConfig,
): ColumnDef<T> {
    return {
        id: String(key),
        accessorKey: key as string,
        header: () => (
            <div className="flex min-w-[100px] justify-center font-semibold whitespace-nowrap">
                {label}
            </div>
        ),
        cell: ({ row }) => {
            const status = row.getValue(String(key)) as string;
            const config = statusConfig[status];

            if (!config) {
                return <div className="text-gray-500">Desconocido</div>;
            }

            const displayLabel = config.label || status;

            return (
                <div className="flex items-center justify-center">
                    <div
                        className={`w-[120px] rounded-[30px] px-2 py-1 text-center text-[13px] font-medium ${config.className}`}
                    >
                        {displayLabel}
                    </div>
                </div>
            );
        },
        enableSorting: false,
        enableGlobalFilter: true,
    };
}

// Columna personalizada con renderer específico
export function custom<T>(
    key: keyof T,
    label: string,
    renderer: (value: unknown, row: T) => React.ReactNode,
    sortable = false,
): ColumnDef<T> {
    return {
        id: String(key),
        accessorKey: key as string,
        header: sortable
            ? ({ column }) => (
                  <Button
                      variant="ghost"
                      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                  >
                      {label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
              )
            : () => <div className="font-semibold whitespace-nowrap">{label}</div>,
        cell: ({ row }) => {
            const value = row.getValue(String(key));
            return renderer(value, row.original);
        },
        enableSorting: sortable,
        enableGlobalFilter: true,
    };
}

// Columna de acciones (placeholder, se rellena automáticamente)
export function actions<T>(): ColumnDef<T> {
    return {
        id: 'acciones',
        header: () => <div className="text-center font-semibold">Acciones</div>,
        cell: () => (
            <div className="text-center">
                <span className="text-gray-400">Cargando...</span>
            </div>
        ),
        enableSorting: false,
        enableGlobalFilter: false,
    };
}

// Configuración de estados para tickets del sistema
export function getTicketStatusConfig(): StatusConfig {
    return {
        OPEN: {
            className: 'text-green-500 bg-green-100 border-green-400',
            label: 'Abierto',
        },
        IN_PROGRESS: {
            className: 'text-yellow-500 bg-yellow-100 border-yellow-400',
            label: 'En Progreso',
        },
        RESOLVED: {
            className: 'text-blue-500 bg-blue-100 border-blue-400',
            label: 'Resuelto',
        },
        CLOSED: {
            className: 'text-gray-500 bg-gray-100 border-gray-400',
            label: 'Cerrado',
        },
    };
}

// Configuración de prioridades para tickets del sistema
export function getTicketPriorityConfig(): StatusConfig {
    return {
        LOW: {
            className: 'text-green-500 bg-green-100 border-green-400',
            label: 'Baja',
        },
        MEDIUM: {
            className: 'text-yellow-500 bg-yellow-100 border-yellow-400',
            label: 'Media',
        },
        HIGH: {
            className: 'text-orange-500 bg-orange-100 border-orange-400',
            label: 'Alta',
        },
        URGENT: {
            className: 'text-red-500 bg-red-100 border-red-400',
            label: 'Urgente',
        },
    };
}

// Configuración genérica de estados (activo/inactivo)
export function getGenericStatusConfig(): StatusConfig {
    return {
        '1': {
            className: 'text-green-500 bg-green-100 border-green-400',
            label: 'Activo',
        },
        '0': {
            className: 'text-red-500 bg-red-100 border-red-400',
            label: 'Inactivo',
        },
        active: {
            className: 'text-green-500 bg-green-100 border-green-400',
            label: 'Activo',
        },
        inactive: {
            className: 'text-red-500 bg-red-100 border-red-400',
            label: 'Inactivo',
        },
    };
}

// Renderizador para mostrar permisos de roles en formato lista
export function renderRolePermissions(permissions: unknown): React.ReactNode {
    if (!permissions || !Array.isArray(permissions)) {
        return <div className="flex w-[100px]">Sin permisos</div>;
    }

    const permissionNames =
        permissions
            .map((perm: { permission?: { name?: string } }) => perm.permission?.name)
            .filter(Boolean)
            .join(', ') || 'Sin permisos';

    return <div className="flex w-[100px]">{permissionNames}</div>;
}

// Renderizador para mostrar roles de usuario en formato lista
export function renderUserRoles(roles: unknown): React.ReactNode {
    if (!roles || !Array.isArray(roles)) {
        return <div className="flex w-[150px]">Sin roles</div>;
    }

    const roleNames =
        roles
            .map((userRole: { role?: { name?: string } }) => userRole.role?.name)
            .filter(Boolean)
            .join(', ') || 'Sin roles';

    return <div className="flex w-[150px]">{roleNames}</div>;
}
