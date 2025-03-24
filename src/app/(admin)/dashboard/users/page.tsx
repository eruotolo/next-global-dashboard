import RoleTable from '@/components/Tables/Setting/Roles/RoleTable';
import UserTable from '@/components/Tables/Setting/User/UserTable';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | Usuarios',
    description: 'Gestión de usuarios del sistema',
};

export default function UsersPage() {
    return (
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
    );
}
