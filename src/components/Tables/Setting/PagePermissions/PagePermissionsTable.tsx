'use client';

import { useCallback, useEffect, useState } from 'react';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { createPage, updatePage } from '@/actions/Settings/Pages/mutations';
import type { Page } from '@/actions/Settings/Pages/queries';
import { getPages } from '@/actions/Settings/Pages/queries';
import { getRoles } from '@/actions/Settings/Roles/queries';
import { getPagePermissionsColumns } from '@/components/Tables/Setting/PagePermissions/PagePermissionsColumns';
import { TanTable } from '@/components/TanTable';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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

export default function PagePermissionsTable() {
    const [pages, setPages] = useState<Page[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<PageFormData>({
        name: '',
        path: '',
        description: '',
    });
    const [editingPageId, setEditingPageId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [pagesData, rolesData] = await Promise.all([getPages(), getRoles()]);
            setPages(pagesData);
            setRoles(rolesData);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error al cargar los datos');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    const handleEdit = useCallback((page: Page) => {
        setEditingPageId(page.id);
        setFormData({
            name: page.name,
            path: page.path,
            description: page.description || '',
        });
        setIsDialogOpen(true);
    }, []);

    const resetForm = () => {
        setFormData({ name: '', path: '', description: '' });
        setEditingPageId(null);
    };

    // Generar columnas dinámicamente incluyendo roles
    const columns = getPagePermissionsColumns(roles, pages, setPages, handleEdit);

    const toolbarActions = (
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
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="path">Ruta</Label>
                        <Input
                            id="path"
                            value={formData.path}
                            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
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
                        <Button type="submit">{editingPageId ? 'Actualizar' : 'Crear'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );

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
            </div>
            <div className="mt-[20px]">
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <TanTable
                    columns={columns}
                    data={pages}
                    loading={isLoading}
                    filterPlaceholder="Buscar páginas..."
                    toolbarActions={toolbarActions}
                    refreshData={fetchData}
                />
            </div>
        </>
    );
}