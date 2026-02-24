import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { BusinessTable } from './BusinessTable';
import { BusinessFilters } from './BusinessFilters';

interface Props {
    searchParams: Promise<{
        search?: string;
        status?: string;
        province?: string;
        categoryId?: string;
        sortBy?: string;
        sortOrder?: string;
        page?: string;
    }>;
}

export default async function AdminBusinessesPage({ searchParams }: Props) {
    const params = await searchParams;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Businesses</h1>
                    <p className="text-gray-500 mt-1">Manage and monitor all businesses in the directory</p>
                </div>
                <Link
                    href="/admin/bedrijven/nieuw"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Nieuw bedrijf
                </Link>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <BusinessFilters />
            </Suspense>

            <Suspense fallback={<div>Loading businesses...</div>}>
                <BusinessTable initialParams={params} />
            </Suspense>
        </div>
    );
}
