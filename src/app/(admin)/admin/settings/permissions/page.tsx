'use client';

import PagePermissionsManager from '@/components/Settings/PagePermissions/PagePermissionsManager';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function PermissionsPage() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="col-span-1 p-6 rounded-xl md:col-span-2 bg-muted/50">
                        <PagePermissionsManager />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 