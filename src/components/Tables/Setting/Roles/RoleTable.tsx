'use client';

import { useEffect, useState } from 'react';

import NewRoleModal from '@/components/Modal/Setting/Roles/NewRoleModal';
import { RolesColumns } from '@/components/Tables/Setting/Roles/RolesColumns';
import { TanTable } from '@/components/TanTable';
import { useUserRoleStore } from '@/store/userroleStore';

export default function RoleTable() {
    const { rolesData, isLoadingRoles, fetchRoles } = useUserRoleStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRoles = async () => {
            try {
                await fetchRoles();
                setError(null);
            } catch (error) {
                console.error('Error al obtener los roles:', error);
                setError('Error al obtener los roles');
            }
        };

        loadRoles();
    }, [fetchRoles]);

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Roles
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
            </div>
            <div className="mt-[20px]">
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <TanTable
                    columns={RolesColumns}
                    data={rolesData}
                    loading={isLoadingRoles}
                    filterPlaceholder="Buscar..."
                    toolbarActions={<NewRoleModal refreshAction={fetchRoles} />}
                    refreshData={fetchRoles}
                />
            </div>
        </>
    );
}
