'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { useEffect, useState, useCallback } from 'react';

import { getAllRoles } from '@/actions/roles';
import { RolesColumns } from '@/components/Tables/Setting/Roles/RolesColumns';
import type { RoleInterface } from '@/types/Roles/RolesInterface';

import NewRoleModal from '@/components/Modal/Setting/roles/NewRoleModal';

export default function RoleTable() {
    const [rolesData, setRolesData] = useState<RoleInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Estado para el cargando
    const [error, setError] = useState<string | null>(null); // Manejo de errores

    const fetchRoles = useCallback(async () => {
        try {
            const data = await getAllRoles();
            //console.log('Roles:', data);
            const transformedData =
                data?.map((role) => ({
                    id: role.id,
                    name: role.name,
                    state: role.state,
                })) || [];
            setRolesData(transformedData);
            setError(null);
        } catch (err) {
            console.error('Error al obtener los roles:', err);
            setError('Error al obtener los roles. Inténtalo de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    //console.log('Roles transformedData:', rolesData);

    // useEffect para ejecutar fetchRoles al montar el componente
    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const _refreshTable = async () => {
        await fetchRoles();
    };

    return (
        <>
            <div className="flex justify-between w-full h-auto">
                <div>
                    <h5 className="font-medium tracking-tight leading-none mb-[5px] text-[20px]">
                        Roles
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewRoleModal refresh={_refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <DataTable
                    columns={RolesColumns(_refreshTable)}
                    data={rolesData}
                    loading={isLoading}
                    filterPlaceholder="Buscar en todos los campos..."
                />
            </div>
        </>
    );
}
