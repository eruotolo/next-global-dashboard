'use client';

import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div className="bg-muted/50 aspect-video rounded-xl">
                <div className="p-4">
                    <p className="font-inter p-4">Dashboard</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
