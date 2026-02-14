import { Suspense } from 'react';
import { AnalyticsDashboard } from './AnalyticsDashboard';

export const metadata = {
    title: 'Analytics - Admin Dashboard',
    description: 'View website analytics and performance metrics',
};

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
                <p className="text-gray-500 mt-1">Monitor your directory performance and user engagement</p>
            </div>

            <Suspense fallback={<div>Loading analytics...</div>}>
                <AnalyticsDashboard />
            </Suspense>
        </div>
    );
}
