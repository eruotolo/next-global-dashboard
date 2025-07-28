'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Mail, Phone, User } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ColumnConfig } from '../types/TableConfig';
import { ConventionApplier } from '../core/Conventions';

export const createSelectionColumn = (): ColumnDef<any> => ({
    id: 'select',
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Seleccionar todo"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Seleccionar fila"
        />
    ),
    enableSorting: false,
    enableHiding: false,
});

export const createTextColumn = (config: ColumnConfig): ColumnDef<any> => ({
    id: config.id,
    accessorKey: config.accessorKey,
    accessorFn: config.accessorFn,
    header: config.sortable
        ? ({ column }) => (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                  className={config.className}
              >
                  {config.header}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          )
        : config.header,
    cell: ({ row, getValue }) => {
        const value = getValue() as string;
        if (config.render) {
            return config.render({ row: row.original, value });
        }
        return <div className={config.className}>{value || '-'}</div>;
    },
    size: config.width,
});

export const createEmailColumn = (config: ColumnConfig): ColumnDef<any> => ({
    id: config.id,
    accessorKey: config.accessorKey,
    accessorFn: config.accessorFn,
    header: config.sortable
        ? ({ column }) => (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                  {config.header}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          )
        : config.header,
    cell: ({ row, getValue }) => {
        const email = getValue() as string;
        if (config.render) {
            return config.render({ row: row.original, value: email });
        }
        return config.linkable ? (
            <a
                href={`mailto:${email}`}
                className="flex items-center gap-1 text-blue-600 hover:underline"
            >
                <Mail className="h-3 w-3" />
                {email}
            </a>
        ) : (
            <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-gray-400" />
                {email}
            </div>
        );
    },
    size: config.width,
});

export const createPhoneColumn = (config: ColumnConfig): ColumnDef<any> => ({
    id: config.id,
    accessorKey: config.accessorKey,
    accessorFn: config.accessorFn,
    header: config.header,
    cell: ({ row, getValue }) => {
        const phone = getValue() as string;
        if (config.render) {
            return config.render({ row: row.original, value: phone });
        }

        const formatPhone = (phone: string) => {
            return phone?.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') || phone;
        };

        return config.linkable ? (
            <a
                href={`tel:${phone}`}
                className="flex items-center gap-1 text-blue-600 hover:underline"
            >
                <Phone className="h-3 w-3" />
                {formatPhone(phone)}
            </a>
        ) : (
            <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-gray-400" />
                {formatPhone(phone)}
            </div>
        );
    },
    size: config.width,
});

export const createDateColumn = (config: ColumnConfig): ColumnDef<any> => ({
    id: config.id,
    accessorKey: config.accessorKey,
    accessorFn: config.accessorFn,
    header: config.sortable
        ? ({ column }) => (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                  {config.header}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          )
        : config.header,
    cell: ({ row, getValue }) => {
        const date = getValue() as Date | string;
        if (config.render) {
            return config.render({ row: row.original, value: date });
        }

        if (!date) return <div>-</div>;

        const dateObj = new Date(date);
        const formatted = config.dateFormat
            ? dateObj.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
              })
            : dateObj.toLocaleDateString('es-ES');

        return <div>{formatted}</div>;
    },
    size: config.width,
});

export const createBadgeColumn = (config: ColumnConfig): ColumnDef<any> => ({
    id: config.id,
    accessorKey: config.accessorKey,
    accessorFn: config.accessorFn,
    header: config.header,
    cell: ({ row, getValue }) => {
        const value = getValue() as string;
        if (config.render) {
            return config.render({ row: row.original, value });
        }

        if (!value) return <div>-</div>;

        const colorMap = config.colorMap || ConventionApplier.getBadgeColorMap(config.id);

        const getVariant = (value: string) => {
            if (!colorMap) return 'secondary';

            const color = colorMap[value];
            switch (color) {
                case 'green':
                    return 'default';
                case 'yellow':
                    return 'secondary';
                case 'blue':
                    return 'outline';
                case 'red':
                    return 'destructive';
                case 'gray':
                    return 'secondary';
                default:
                    return 'secondary';
            }
        };

        return (
            <div className="flex justify-center">
                <Badge variant={getVariant(value)} className="text-xs">
                    {value}
                </Badge>
            </div>
        );
    },
    size: config.width,
});

export const createImageColumn = (config: ColumnConfig): ColumnDef<any> => ({
    id: config.id,
    accessorKey: config.accessorKey,
    accessorFn: config.accessorFn,
    header: config.header,
    cell: ({ row, getValue }) => {
        const imageUrl = getValue() as string;
        if (config.render) {
            return config.render({ row: row.original, value: imageUrl });
        }

        const name = row.original.name || row.original.title || 'Usuario';

        return (
            <div className="flex justify-center">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={imageUrl || '/placeholder.svg'} alt={name} />
                    <AvatarFallback>
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            </div>
        );
    },
    size: config.width || 80,
});

export const createNumberColumn = (config: ColumnConfig): ColumnDef<any> => ({
    id: config.id,
    accessorKey: config.accessorKey,
    accessorFn: config.accessorFn,
    header: config.sortable
        ? ({ column }) => (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                  {config.header}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          )
        : config.header,
    cell: ({ row, getValue }) => {
        const value = getValue() as number;
        if (config.render) {
            return config.render({ row: row.original, value });
        }

        if (value === null || value === undefined) return <div>-</div>;

        const formatted = config.numberFormat
            ? new Intl.NumberFormat('es-ES', {
                  style: config.numberFormat === 'currency' ? 'currency' : 'decimal',
                  currency: 'EUR',
              }).format(value)
            : value.toString();

        return <div className="text-right">{formatted}</div>;
    },
    size: config.width,
});

export const createBooleanColumn = (config: ColumnConfig): ColumnDef<any> => ({
    id: config.id,
    accessorKey: config.accessorKey,
    accessorFn: config.accessorFn,
    header: config.header,
    cell: ({ row, getValue }) => {
        const value = getValue() as boolean;
        if (config.render) {
            return config.render({ row: row.original, value });
        }

        return (
            <div className="flex justify-center">
                <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Sí' : 'No'}</Badge>
            </div>
        );
    },
    size: config.width || 100,
});

export const createColumn = (config: ColumnConfig): ColumnDef<any> => {
    switch (config.type) {
        case 'selection':
            return createSelectionColumn();
        case 'text':
            return createTextColumn(config);
        case 'email':
            return createEmailColumn(config);
        case 'phone':
            return createPhoneColumn(config);
        case 'date':
            return createDateColumn(config);
        case 'badge':
            return createBadgeColumn(config);
        case 'image':
            return createImageColumn(config);
        case 'number':
            return createNumberColumn(config);
        case 'boolean':
            return createBooleanColumn(config);
        default:
            return createTextColumn(config);
    }
};

export const fullNameColumn = (overrides: Partial<ColumnConfig> = {}): ColumnConfig => ({
    id: 'fullName',
    header: 'Nombre Completo',
    type: 'text',
    sortable: true,
    accessorFn: (row) => `${row.name || ''} ${row.lastName || ''}`.trim(),
    ...overrides,
});

export const rolesColumn = (overrides: Partial<ColumnConfig> = {}): ColumnConfig => ({
    id: 'roles',
    header: 'Roles',
    type: 'badge',
    accessorFn: (row) => {
        if (!row.roles || !Array.isArray(row.roles)) return 'Sin roles';
        return row.roles.map((userRole: any) => userRole.role?.name).join(', ') || 'Sin roles';
    },
    render: ({ value }: { row: any; value: any }) => {
        if (!value || value === 'Sin roles') {
            return React.createElement(Badge, { variant: 'secondary' }, 'Sin roles');
        }
        return React.createElement(
            'div',
            { className: 'flex flex-wrap gap-1' },
            value.split(', ').map((role: string, index: number) =>
                React.createElement(
                    Badge,
                    {
                        key: index,
                        variant: 'outline',
                        className: 'text-xs',
                    },
                    role,
                ),
            ),
        );
    },
    ...overrides,
});

export const permissionsColumn = (overrides: Partial<ColumnConfig> = {}): ColumnConfig => ({
    id: 'permissions',
    header: 'Permisos',
    type: 'badge',
    accessorFn: (row) => {
        if (!row.permissionRole || !Array.isArray(row.permissionRole)) return 'Sin permisos';
        return (
            row.permissionRole
                .map((perm: any) => perm.permission?.name)
                .filter(Boolean)
                .join(', ') || 'Sin permisos'
        );
    },
    render: ({ value }: { row: any; value: any }) => {
        if (!value || value === 'Sin permisos') {
            return React.createElement(Badge, { variant: 'secondary' }, 'Sin permisos');
        }
        return React.createElement(
            'div',
            { className: 'flex flex-wrap gap-1' },
            value.split(', ').map((permission: string, index: number) =>
                React.createElement(
                    Badge,
                    {
                        key: index,
                        variant: 'outline',
                        className: 'text-xs',
                    },
                    permission,
                ),
            ),
        );
    },
    ...overrides,
});
