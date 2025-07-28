'use client';

import * as React from 'react';

import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

// Agrega estas interfaces arriba de tu componente DataTable
interface RoleItem {
    role: {
        name: string;
    };
}

// Función de tipo guard para verificar si un valor es un array de RoleItem
function isRoleArray(value: unknown): value is RoleItem[] {
    return Array.isArray(value) && value.length > 0 && typeof value[0]?.role?.name === 'string';
}

interface UseTanTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
}

export function useTanTable<TData>({ data, columns }: UseTanTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState<string>('');
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const customGlobalFilterFn = (row: any, _columnId: string, filterValue: string) => {
        const searchValue = filterValue.toLowerCase();
        const rowValues = Object.values(row.original).map((value) => {
            if (isRoleArray(value)) {
                return value
                    .map((item) => item.role.name)
                    .join(' ')
                    .toLowerCase();
            }
            return String(value).toLowerCase();
        });
        return rowValues.some((value) => value.includes(searchValue));
    };

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
            rowSelection,
        },
        globalFilterFn: customGlobalFilterFn,
    });

    return { table, globalFilter, setGlobalFilter };
}
