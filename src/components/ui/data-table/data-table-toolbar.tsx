'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Table } from '@tanstack/react-table';
import { Download, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterPlaceholder?: string;
    data: TData[];
    globalFilter: string; // Añadimos globalFilter
    setGlobalFilter: (value: string) => void; // Añadimos setter para globalFilter
}

export function DataTableToolbar<TData>({
    table,
    filterPlaceholder = 'Filtrar...',
    data,
    globalFilter,
    setGlobalFilter,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().globalFilter || table.getState().columnFilters.length > 0;

    const handleExportToExcel = () => {
        const filteredData = table.getFilteredRowModel().rows.map((row) => {
            const rowData: Record<string, any> = {};

            table
                .getAllColumns()
                .filter((column) => column.getIsVisible())
                .forEach((column) => {
                    const columnId = column.id;
                    const cellValue = row.getValue(columnId);
                    const headerValue =
                        typeof column.columnDef.header === 'string'
                            ? column.columnDef.header
                            : columnId;

                    rowData[headerValue] = cellValue;
                });

            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
        XLSX.writeFile(workbook, 'datos_exportados.xlsx');
    };

    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={filterPlaceholder}
                    value={globalFilter ?? ''}
                    onChange={(event) => setGlobalFilter(event.target.value)} // Actualizamos el filtro global
                    className="h-[40px] w-[150px] bg-white md:w-[75%]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setGlobalFilter(''); // Limpiamos el filtro global
                            table.resetColumnFilters(); // También limpiamos filtros de columnas si los hay
                        }}
                        className="px-2 h-8 lg:px-3"
                    >
                        Limpiar
                        <X className="ml-2 w-4 h-4" />
                    </Button>
                )}
            </div>
            <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={handleExportToExcel}
            >
                <Download className="mr-2 w-4 h-4" />
                Exportar a Excel
            </Button>
        </div>
    );
}
