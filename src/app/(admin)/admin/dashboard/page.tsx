'use client';

import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div className="p-6">
                <AnalyticsDashboard />
            </div>
        </ProtectedRoute>
    );
}
