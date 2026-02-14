import { Suspense } from 'react';
import { LocationsManager } from './LocationsManager';

export const metadata = {
    title: 'Locations - Admin Dashboard',
    description: 'Manage cities and neighborhoods',
};

export default function LocationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Locations</h1>
                <p className="text-gray-500 mt-1">Manage cities and neighborhoods in the directory</p>
            </div>

            <Suspense fallback={<div>Loading locations...</div>}>
                <LocationsManager />
            </Suspense>
        </div>
    );
}
