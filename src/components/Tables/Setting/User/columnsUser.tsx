'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

import { DataTableColumnHeader } from '@/components/Datatable/data-table-column-header';

import { UserNav } from '@/types/Sidebar/UserNav';

export const columnsUser: ColumnDef<UserNav>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue('id')}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>
                        {row.getValue('name')} {row.getValue('lastName')}
                    </span>
                </div>
            );
        },
    },
];
