'use client';

import type { Column } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    createPage,
    deletePage,
    updatePage,
    updatePageRole,
} from '@/actions/Settings/Pages/mutations';
import type { Page } from '@/actions/Settings/Pages/queries';
import { getPages } from '@/actions/Settings/Pages/queries';
import { getRoles } from '@/actions/Settings/Roles/queries';
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
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Role {
    id: string;
    name: string;
}

interface PageFormData {
    name: string;
    path: string;
    description: string;
}

interface ActionCellProps {
    row: {
        original: Page;
    };
    onEdit: (page: Page) => void;
    onDelete: (id: string) => void;
}

function ActionCell({ row, onEdit, onDelete }: ActionCellProps) {
    const page = row.original;

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
                                onClick={() => onDelete(page.id)}
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

export default function PagePermissionsManager() {
    const [pages, setPages] = useState<Page[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<PageFormData>({
        name: '',
        path: '',
        description: '',
    });
    const [editingPageId, setEditingPageId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pagesData, rolesData] = await Promise.all([getPages(), getRoles()]);

            setPages(pagesData);
            setRoles(rolesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error al cargar los datos');
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPageId) {
                await updatePage(editingPageId, formData);
                toast.success('Página actualizada correctamente');
            } else {
                await createPage(formData);
                toast.success('Página creada correctamente');
            }
            setIsDialogOpen(false);
            resetForm();
            await fetchData();
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error('Error al guardar la página');
        }
    };

    const handleEdit = (page: Page) => {
        setEditingPageId(page.id);
        setFormData({
            name: page.name,
            path: page.path,
            description: page.description || '',
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePage(id);
            toast.success('Página eliminada correctamente');
            await fetchData();
        } catch (error) {
            console.error('Error deleting page:', error);
            toast.error('Error al eliminar la página');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', path: '', description: '' });
        setEditingPageId(null);
    };

    const columns = [
        {
            accessorKey: 'name',
            header: ({ column }: { column: Column<Page> }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Página
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }: { row: { original: Page } }) => (
                <div className="font-mono text-[13px]">{row.original.name}</div>
            ),
        },
        {
            accessorKey: 'path',
            header: ({ column }: { column: Column<Page> }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Ruta
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }: { row: { original: Page } }) => (
                <div className="font-mono text-[13px]">{row.original.path}</div>
            ),
        },
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
        {
            id: 'actions',
            cell: ({ row }: { row: { original: Page } }) => (
                <ActionCell row={row} onEdit={handleEdit} onDelete={handleDelete} />
            ),
        },
    ];

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Gestión de Permisos
                    </h5>
                    <p className="text-muted-foreground text-[13px]">
                        Administra los permisos de acceso a las páginas por rol
                    </p>
                </div>
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Página
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingPageId ? 'Editar' : 'Agregar'} Página</DialogTitle>
                            <DialogDescription>
                                Complete los detalles de la página. La ruta debe comenzar con /.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="path">Ruta</Label>
                                <Input
                                    id="path"
                                    value={formData.path}
                                    onChange={(e) =>
                                        setFormData({ ...formData, path: e.target.value })
                                    }
                                    required
                                    pattern="^/.*"
                                    title="La ruta debe comenzar con /"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                    {editingPageId ? 'Actualizar' : 'Crear'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={columns}
                    data={pages}
                    loading={isLoading}
                    filterPlaceholder="Buscar en todos los campos..."
                />
            </div>
        </>
    );
}
