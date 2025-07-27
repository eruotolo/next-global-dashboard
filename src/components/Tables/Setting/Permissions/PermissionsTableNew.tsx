'use client';

import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updatePageRole } from '@/actions/Settings/Pages/mutations';
import { getPagesForTable, type PageWithRoles } from '@/actions/Settings/Pages/unifiedQueries';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnFactory } from '@/components/Table/factories/ColumnFactory';
import { createActionColumn } from '@/components/Table/factories/ActionCellFactory';
import { 
    permissionsActionConfig,
    NewPageModalComponent 
} from './permissionsConfig';

export default function PermissionsTableNew() {
    const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
    const [pages, setPages] = useState<PageWithRoles[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPagesForTable();
            setPages(data);
        } catch (err) {
            console.error('Error fetching pages:', err);
            setError('Error al cargar los datos');
            toast.error('Error al cargar los datos');
        } finally {
            setIsLoading(false);
        }
    };

    // Función para manejar cambios de permisos
    const handlePermissionChange = async (pageId: string, roleId: string, isChecked: boolean) => {
        try {
            await updatePageRole(pageId, roleId, isChecked ? 'add' : 'remove');
            
            // Actualizar el estado local para reflejar el cambio inmediatamente
            setPages(prevPages => 
                prevPages.map(page => {
                    if (page.id === pageId) {
                        const role = page.availableRoles.find(r => r.id === roleId);
                        if (!role) return page;

                        const updatedPageRoles = isChecked
                            ? [...page.pageRoles, { roleId, role: { name: role.name } }]
                            : page.pageRoles.filter(pr => pr.roleId !== roleId);
                        
                        return { ...page, pageRoles: updatedPageRoles };
                    }
                    return page;
                })
            );
            
            toast.success('Permisos actualizados correctamente');
        } catch (error) {
            console.error('Error updating permission:', error);
            toast.error('Error al actualizar los permisos');
        }
    };

    // Generar columnas dinámicas
    const generateColumns = () => {
        if (!pages.length) return [];

        const roles = pages[0]?.availableRoles || [];
        
        const baseColumns = [
            // Columna de nombre de página
            ColumnFactory.sortableText<PageWithRoles>('name', 'Página', {
                searchable: true,
                minWidth: 150,
            }),
            // Columna de ruta
            ColumnFactory.sortableText<PageWithRoles>('path', 'Ruta', {
                searchable: true,
                minWidth: 200,
            }),
            // Columna de descripción
            ColumnFactory.text<PageWithRoles>('description', 'Descripción', {
                searchable: true,
                maxWidth: 300,
            }),
        ];

        // Columnas dinámicas de roles con checkboxes
        const roleColumns = ColumnFactory.roleCheckboxColumns<PageWithRoles>(
            roles,
            handlePermissionChange
        );

        // Columna de acciones con configuración específica
        const actionsColumn = createActionColumn<PageWithRoles>(
            permissionsActionConfig,
            fetchData
        );

        return [...baseColumns, ...roleColumns, actionsColumn];
    };

    const columns = generateColumns();

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
                <Button onClick={() => setIsNewPageModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Página
                </Button>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={columns}
                    data={pages}
                    loading={isLoading}
                    filterPlaceholder="Buscar páginas y rutas..."
                />
            </div>
            
            {/* Modal para crear nueva página */}
            {isNewPageModalOpen && (
                <NewPageModalComponent
                    id=""
                    open={isNewPageModalOpen}
                    onCloseAction={() => setIsNewPageModalOpen(false)}
                    refreshAction={async () => {
                        await fetchData();
                        setIsNewPageModalOpen(false);
                    }}
                />
            )}
        </>
    );
}