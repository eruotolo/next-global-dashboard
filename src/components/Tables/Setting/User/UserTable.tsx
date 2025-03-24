'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { useEffect, useState, useCallback } from 'react';

import { getAllUsers } from '@/actions/users';
import { UserColumns } from '@/components/Tables/Setting/User/UserColumns';
import type { UserInterface } from '@/types/Table/UserInterface';

import UserNewModal from '@/components/Modal/Setting/Users/UserNewModal';

export default function UserTable() {
    const [userData, setUserData] = useState<UserInterface[]>([]); // Estado para los datos
    const [isLoading, setIsLoading] = useState(true); // Estado para el cargando
    const [_error, setError] = useState<string | null>(null); // Manejo de errores

    const fetchUsers = useCallback(async () => {
        try {
            const data = await getAllUsers();
            const transformedData =
                data?.map((user) => ({
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    roles: user.roles.map((role) => ({
                        id: role.id,
                        userId: role.userId || null,
                        roleId: role.roleId || null,
                        role: role.role
                            ? {
                                  id: role.role.id,
                                  name: role.role.name,
                                  state: role.role.state ?? 1, // Aquí reemplazamos null por un valor por defecto.
                              }
                            : null,
                    })),
                })) || [];
            setUserData(transformedData);
            setError(null);
        } catch (err) {
            console.error('Error al obtener los usuarios:', err);
            setError('Error al obtener los usuarios. Inténtalo de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // useEffect para ejecutar fetchUsers al montar el componente
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Función para refrescar la tabla manualmente
    const _refreshTable = async () => {
        await fetchUsers(); // Reutilizamos la misma función fetchUsers
    };

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
                    <UserNewModal refresh={_refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={UserColumns(_refreshTable)}
                    data={userData}
                    loading={isLoading}
                    filterPlaceholder="Buscar en todos los campos..."
                />
            </div>
        </>
    );
}
