'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Page } from '@/actions/Settings/Pages/queries';
import { getPages } from '@/actions/Settings/Pages/queries';
import { getRoles } from '@/actions/Settings/Roles/queries';
import EditPageModal from '@/components/Modal/Setting/Permissions/EditPageModal';
import NewPageModal from '@/components/Modal/Setting/Permissions/NewPageModal';
import { getPagePermissionsColumns } from '@/components/Tables/Setting/PagePermissions/PagePermissionsColumns';
import { TanTable } from '@/components/TanTable';

interface Role {
    id: string;
    name: string;
}

export default function PagePermissionsTable() {
    const [pages, setPages] = useState<Page[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);

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

    const handleEdit = useCallback((page: Page) => {
        setEditingPage(page);
        setIsEditModalOpen(true);
    }, []);

    // Generar columnas dinámicamente incluyendo roles
    const columns = getPagePermissionsColumns(roles, pages, setPages, handleEdit);

    const toolbarActions = <NewPageModal refreshAction={fetchData} />;

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

                <EditPageModal
                    page={editingPage}
                    isOpen={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    refreshAction={fetchData}
                />
            </div>
        </>
    );
}
