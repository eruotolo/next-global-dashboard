import { clsx } from 'clsx';
import { ArrowUpDown } from 'lucide-react';

import type { CellContext, ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

// --- GENERADORES DE COLUMNAS ---

/**
 * Crea un encabezado de columna con un botón para ordenar.
 * @param title El texto que se mostrará en el encabezado.
 */
export function createSortableHeader(title: string) {
    return ({ column }: { column: any }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

/**
 * Crea una celda que muestra un valor como un badge o píldora con colores condicionales.
 * @param accessorKey La clave para acceder al valor en el objeto de datos de la fila.
 * @param colorMap Un objeto que mapea valores a clases de Tailwind CSS.
 */
export function createBadgeCell<TData>(accessorKey: keyof TData, colorMap: Record<string, string>) {
    return ({ row }: { row: { original: TData } }) => {
        const value = String(row.original[accessorKey]);
        const bgClass = colorMap[value] || 'text-gray-500 bg-gray-100 border-gray-400';

        return (
            <div className="flex items-center justify-center">
                <div
                    className={clsx(
                        'w-[120px] rounded-[30px] px-2 py-1 text-center text-[13px] font-medium',
                        bgClass,
                    )}
                >
                    {value}
                </div>
            </div>
        );
    };
}

/**
 * Crea una columna de acciones renderizando un componente de React personalizado.
 * @param ActionComponent El componente de React que se renderizará en la celda.
 */
export function createActionColumn<TData>(
    ActionComponent: React.FC<CellContext<TData, any>>,
): ColumnDef<TData> {
    return {
        id: 'acciones',
        cell: (cellProps) => <ActionComponent {...cellProps} />,
    };
}
