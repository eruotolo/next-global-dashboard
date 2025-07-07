'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import RoleTable from '@/components/Tables/Setting/Roles/RoleTable';
import UserTable from '@/components/Tables/Setting/User/UserTable';
import { useUserRoleStore } from '@/store/userroleStore';

export default function UsersPage() {
    const { refreshAll } = useUserRoleStore();

    useEffect(() => {
        refreshAll(); // carga inicial de los datos generales
    }, [refreshAll]);

    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 col-span-3 rounded-xl p-6 md:col-span-2">
                        <UserTable />
                    </div>
                    <div className="bg-muted/50 col-span-3 rounded-xl p-6 md:col-span-1">
                        <RoleTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
