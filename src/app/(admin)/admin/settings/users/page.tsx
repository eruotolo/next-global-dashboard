'use client';

import RoleTable from '@/components/Tables/Setting/Roles/RoleTable';
import UserTable from '@/components/Tables/Setting/User/UserTable';
import { useEffect } from 'react';
import { useUserRoleStore } from '@/store/userroleStore';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function UsersPage() {
    const { refreshAll } = useUserRoleStore();

    useEffect(() => {
        refreshAll(); // carga inicial de los datos generales
    }, [refreshAll]);

    return (
        <ProtectedRoute roles={['Administrador', 'SuperAdministrador']}>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="col-span-3 p-6 rounded-xl md:col-span-2 bg-muted/50 aspect-video">
                        <UserTable />
                    </div>
                    <div className="col-span-3 p-6 rounded-xl md:col-span-1 bg-muted/50 aspect-video">
                        <RoleTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
