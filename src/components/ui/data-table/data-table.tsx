'use client';

import {
    type ColumnDef,
    type ColumnFiltersState,
    type Row,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import Loading from '@/components/Loading/Loading';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterPlaceholder?: string;
    loading?: boolean;
}

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

export function DataTable<TData, TValue>({
    columns,
    data,
    filterPlaceholder = 'Filtrar...',
    loading = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState<string>('');
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Función de filtrado global personalizada actualizada
    const customGlobalFilterFn = (row: Row<TData>, _columnId: string, filterValue: string) => {
        const searchValue = filterValue.toLowerCase();

        // Obtenemos todos los valores visibles de la fila (sin any)
        const rowValues = Object.values(row.original as Record<string, unknown>).map((value) => {
            if (isRoleArray(value)) {
                // Caso especial para roles: extraemos los nombres de los roles
                return value
                    .map((item) => item.role.name)
                    .join(' ')
                    .toLowerCase();
            }
            return String(value).toLowerCase();
        });

        // Verificamos si algún valor coincide con el término de búsqueda
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
        globalFilterFn: customGlobalFilterFn, // Usamos la función de filtrado personalizada
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                filterPlaceholder={filterPlaceholder}
                data={data}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
            />

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    <Loading />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="font-mono text-[13px]">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
