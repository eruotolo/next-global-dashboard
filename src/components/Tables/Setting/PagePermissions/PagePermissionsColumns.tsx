'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { CellContext, ColumnDef } from '@tanstack/react-table';

import { deletePage, updatePageRole } from '@/actions/Settings/Pages/mutations';
import type { Page } from '@/actions/Settings/Pages/queries';
import { createActionColumn, createSortableHeader } from '@/components/TanTable/ColumnFactory';
import { useTableContext } from '@/components/TanTable/TableContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Role {
    id: string;
    name: string;
}

interface PageActionCellProps extends CellContext<Page, any> {
    onEdit: (page: Page) => void;
}

// --- Componente de Celda de Acción ---
function PageActionCell(cellProps: PageActionCellProps) {
    const { row, onEdit } = cellProps;
    const { refreshData } = useTableContext();
    const page = row.original;

    const handleDelete = async () => {
        toast.promise(deletePage(page.id), {
            loading: 'Eliminando página...',
            success: () => {
                refreshData();
                return 'Página eliminada correctamente';
            },
            error: 'Error al eliminar la página',
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(page)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar página
                </DropdownMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar página
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará la página y todos sus
                                permisos asociados.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-700"
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// --- Función para generar columnas dinámicamente ---
export function getPagePermissionsColumns(
    roles: Role[],
    pages: Page[],
    setPages: React.Dispatch<React.SetStateAction<Page[]>>,
    onEdit: (page: Page) => void,
): ColumnDef<Page>[] {
    const handlePermissionChange = async (pageId: string, roleId: string, isChecked: boolean) => {
        try {
            await updatePageRole(pageId, roleId, isChecked ? 'add' : 'remove');
            setPages(
                pages.map((page) => {
                    if (page.id === pageId) {
                        const role = roles.find((r) => r.id === roleId);
                        if (!role) {
                            throw new Error('Rol no encontrado');
                        }
                        const pageRoles = isChecked
                            ? [...page.pageRoles, { roleId, role }]
                            : page.pageRoles.filter((pr) => pr.roleId !== roleId);
                        return { ...page, pageRoles };
                    }
                    return page;
                }),
            );
            toast.success('Permisos actualizados correctamente');
        } catch (error) {
            console.error('Error updating permission:', error);
            toast.error('Error al actualizar los permisos');
        }
    };

    return [
        // Columna de Nombre
        {
            accessorKey: 'name',
            header: createSortableHeader('Página'),
            cell: ({ row }) => <div className="font-mono text-[13px]">{row.original.name}</div>,
        },
        // Columna de Ruta
        {
            accessorKey: 'path',
            header: createSortableHeader('Ruta'),
            cell: ({ row }) => <div className="font-mono text-[13px]">{row.original.path}</div>,
        },
        // Columnas dinámicas para cada rol
        ...roles.map((role) => ({
            id: role.id,
            header: () => (
                <div className="flex min-w-[100px] justify-center font-semibold whitespace-nowrap">
                    {role.name}
                </div>
            ),
            cell: ({ row }: { row: { original: Page } }) => (
                <div className="flex justify-center">
                    <Checkbox
                        checked={row.original.pageRoles.some((pr) => pr.roleId === role.id)}
                        onCheckedChange={(checked) =>
                            handlePermissionChange(row.original.id, role.id, checked as boolean)
                        }
                    />
                </div>
            ),
        })),
        // Columna de Acciones
        createActionColumn((cellProps: CellContext<Page, any>) => (
            <PageActionCell {...cellProps} onEdit={onEdit} />
        )),
    ];
}
