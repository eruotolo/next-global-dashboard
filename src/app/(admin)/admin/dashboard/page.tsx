'use client';

import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div className="p-6">
                <AnalyticsDashboard />
            </div>
        </ProtectedRoute>
    );
}
