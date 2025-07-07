'use client';

import type { Table, VisibilityState } from '@tanstack/react-table';
import { ChevronDownIcon, ColumnsIcon, Download, FileText, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface DynamicTableToolbarProps<TData> {
    table: Table<TData>;
    filterPlaceholder?: string;
    data: TData[];
    globalFilter: string;
    setGlobalFilterAction: (value: string) => void;
    enableExport?: boolean;
    columnVisibility: VisibilityState; // Nueva prop
    setColumnVisibility: (value: VisibilityState) => void; // Nueva prop
}

export function DataTableToolbar<TData>({
    table,
    filterPlaceholder = 'Filtrar...',
    globalFilter,
    setGlobalFilterAction,
    enableExport = true,
}: DynamicTableToolbarProps<TData>) {
    const isFiltered = table.getState().globalFilter || table.getState().columnFilters.length > 0;

    const handleExportToExcel = () => {
        try {
            const filteredData = table.getFilteredRowModel().rows.map((row) => {
                const rowData: Record<string, string | number | boolean> = {};
                for (const column of table
                    .getAllColumns()
                    .filter((column) => column.getIsVisible())) {
                    const columnId = column.id;
                    const cellValue = row.getValue(columnId);
                    const headerValue =
                        typeof column.columnDef.header === 'string'
                            ? column.columnDef.header
                            : columnId;
                    const safeHeaderValue = headerValue.replace(/[^a-zA-Z0-9]/g, '_');
                    rowData[safeHeaderValue] = (
                        cellValue != null
                            ? typeof cellValue === 'object'
                                ? cellValue instanceof Date
                                    ? cellValue.toISOString()
                                    : JSON.stringify(cellValue)
                                : cellValue
                            : ''
                    ) as string | number | boolean;
                }
                return rowData;
            });
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
            XLSX.writeFile(workbook, 'datos_exportados.xlsx');
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
        }
    };

    const handleExportToPDF = async () => {
        try {
            const { default: jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');
            const doc = new jsPDF();
            const tableHeaders = table
                .getAllColumns()
                .filter((column) => column.getIsVisible())
                .map((column) => {
                    return typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id;
                });
            const tableData = table.getFilteredRowModel().rows.map((row) => {
                return table
                    .getAllColumns()
                    .filter((column) => column.getIsVisible())
                    .map((column) => {
                        const value = row.getValue(column.id);
                        return value !== null && value !== undefined ? String(value) : '';
                    });
            });
            autoTable(doc, {
                head: [tableHeaders],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [66, 66, 66] },
            });
            doc.save('datos_exportados.pdf');
        } catch (error) {
            console.error('Error al exportar a PDF:', error);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={filterPlaceholder}
                    value={globalFilter}
                    onChange={(event) => setGlobalFilterAction(event.target.value)}
                    className="h-[40px] w-[150px] bg-white md:w-[75%]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setGlobalFilterAction('');
                            table.resetColumnFilters();
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Limpiar
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                {enableExport && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Exportar
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportToExcel}>
                                <Download className="mr-2 h-4 w-4" />
                                Exportar a Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportToPDF}>
                                <FileText className="mr-2 h-4 w-4" />
                                Exportar a PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ColumnsIcon className="mr-2 h-4 w-4" />
                            Columnas
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide() && column.id !== 'drag')
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {typeof column.columnDef.header === 'string'
                                        ? column.columnDef.header
                                        : column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
