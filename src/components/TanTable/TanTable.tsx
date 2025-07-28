'use client';

import type * as React from 'react';

import { type ColumnDef, flexRender } from '@tanstack/react-table';

import Loading from '@/components/Loading/Loading';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { TableContextProvider } from './TableContext';
import { TanTablePagination } from './TanTablePagination';
import { TanTableToolbar } from './TanTableToolbar';
import { useTanTable } from './hooks/useTanTable';

interface TanTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    loading?: boolean;
    filterPlaceholder?: string;
    enableExport?: boolean;
    toolbarActions?: React.ReactNode;
    refreshData: () => Promise<void> | void;
}

export function TanTable<TData>({
    data,
    columns,
    loading = false,
    filterPlaceholder = 'Filtrar...',
    enableExport = true,
    toolbarActions,
    refreshData,
}: TanTableProps<TData>) {
    const { table, globalFilter, setGlobalFilter } = useTanTable({ data, columns });

    return (
        <TableContextProvider value={{ refreshData }}>
            <div className="space-y-4">
                <TanTableToolbar
                    table={table}
                    filterPlaceholder={filterPlaceholder}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    enableExport={enableExport}
                    toolbarActions={toolbarActions}
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
                                            <TableCell
                                                key={cell.id}
                                                className="font-mono text-[13px]"
                                            >
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
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No hay resultados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TanTablePagination table={table} />
            </div>
        </TableContextProvider>
    );
}
