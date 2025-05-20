'use client';

import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function DashboardPage() {
    return (
        <ProtectedRoute roles={['Usuario', 'Administrador', 'SuperAdministrador', 'Colaborador', 'Editor']}>
            <div className="rounded-xl bg-muted/50 aspect-video">
                <div className="p-4">
                    <p className="p-4 font-inter">Dashboard</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
