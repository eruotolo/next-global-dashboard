'use client';

import PagePermissionsManager from '@/components/Settings/PagePermissions/PagePermissionsManager';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function PermissionsPage() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="bg-muted/50 col-span-1 rounded-xl p-6 md:col-span-2">
                        <PagePermissionsManager />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
