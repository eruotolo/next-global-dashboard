'use client';

import { useCallback, useEffect, useState } from 'react';

import { getAllUsers } from '@/actions/Settings/Users';
import NewUserModalNew from '@/components/Modal/Setting/Users/NewUserModalNew';
import { userColumns } from '@/components/Tables/Setting/User/UserColumns';
import { TanTable } from '@/components/TanTable';
import type { UserQueryWithRoles } from '@/types/settings/Users/UsersInterface';

export default function UserTable() {
    const [userData, setUserData] = useState<UserQueryWithRoles[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setUserData(data);
            setError(null);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            setError('Error al obtener los usuarios');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Usuarios
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
            </div>
            <div className="mt-[20px]">
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <TanTable
                    columns={userColumns}
                    data={userData}
                    loading={isLoading}
                    filterPlaceholder="Buscar en todos los campos..."
                    toolbarActions={<NewUserModalNew refreshAction={fetchUsers} />}
                    refreshData={fetchUsers}
                />
            </div>
        </>
    );
}
