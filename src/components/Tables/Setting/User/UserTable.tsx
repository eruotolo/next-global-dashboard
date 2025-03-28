'use client';

import { useEffect } from 'react';
import { useUserRoleStore } from '@/store/userroleStore';
import { DataTable } from '@/components/ui/data-table/data-table';
import { UserColumns } from '@/components/Tables/Setting/User/UserColumns';
import UserNewModal from '@/components/Modal/Setting/Users/UserNewModal';

export default function UserTable() {
    const { userData, isLoadingUsers, fetchUsers } = useUserRoleStore();

    // Inicializar datos de usuarios cuando se monta el componente
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <>
            <div className="flex justify-between w-full h-auto">
                <div>
                    <h5 className="font-medium tracking-tight leading-none mb-[5px] text-[20px]">
                        Usuarios
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <UserNewModal refreshAction={fetchUsers} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={UserColumns(fetchUsers)}
                    data={userData}
                    loading={isLoadingUsers}
                    filterPlaceholder="Buscar en todos los campos..."
                />
            </div>
        </>
    );
}
