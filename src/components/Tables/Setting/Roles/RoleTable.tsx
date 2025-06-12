'use client';

import { useEffect } from 'react';
import { useUserRoleStore } from '@/store/userroleStore';
import { DataTable } from '@/components/ui/data-table/data-table';
import { RolesColumns } from '@/components/Tables/Setting/Roles/RolesColumns';
import NewRoleModal from '@/components/Modal/Setting/Roles/NewRoleModal';

export default function RoleTable() {
    const { rolesData, isLoadingRoles, fetchRoles } = useUserRoleStore();

    // Inicializar datos de roles cuando se monta el componente
    useEffect(() => {
        fetchRoles();
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
                <div>
                    <NewRoleModal refreshAction={fetchRoles} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={RolesColumns()}
                    data={rolesData}
                    loading={isLoadingRoles}
                    filterPlaceholder="Buscar..."
                />
            </div>
        </>
    );
}
