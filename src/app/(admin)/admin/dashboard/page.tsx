'use client';

import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div className="rounded-xl bg-muted/50 aspect-video">
                <div className="p-4">
                    <p className="p-4 font-inter">Dashboard</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
