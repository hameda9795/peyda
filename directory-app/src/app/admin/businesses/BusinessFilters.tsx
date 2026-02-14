"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FiltersData {
    provinces: Array<{ name: string; slug: string }>;
    categories: Array<{ id: string; name: string }>;
}

export function BusinessFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<FiltersData>({
        provinces: [],
        categories: [],
    });

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [isExpanded, setIsExpanded] = useState(false);

    // Fetch filters data
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await fetch('/api/admin/businesses?limit=0');
                const data = await response.json();
                if (data.filters) {
                    setFilters(data.filters);
                }
            } catch (error) {
                console.error('Error fetching filters:', error);
            }
        };
        fetchFilters();
    }, []);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== 'all') {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            params.set('page', '1');
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/businesses?${createQueryString('search', search)}`);
    };

    const handleFilterChange = (key: string, value: string) => {
        router.push(`/admin/businesses?${createQueryString(key, value)}`);
    };

    const clearFilters = () => {
        setSearch('');
        router.push('/admin/businesses');
    };

    const hasActiveFilters = searchParams.get('search') ||
        (searchParams.get('status') && searchParams.get('status') !== 'all') ||
        (searchParams.get('province') && searchParams.get('province') !== 'all') ||
        (searchParams.get('categoryId') && searchParams.get('categoryId') !== 'all');

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            {/* Search Row */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search businesses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button type="submit" variant="default">
                    Search
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={clearFilters}
                        className="text-gray-500"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                )}
            </form>

            {/* Expanded Filters */}
            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    {/* Status Filter */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Status
                        </label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchParams.get('status') || 'all'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    {/* Province Filter */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Province
                        </label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchParams.get('province') || 'all'}
                            onChange={(e) => handleFilterChange('province', e.target.value)}
                        >
                            <option value="all">All Provinces</option>
                            {filters.provinces.map((province) => (
                                <option key={province.slug} value={province.slug}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Category
                        </label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchParams.get('categoryId') || 'all'}
                            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {filters.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Sort By
                        </label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={`${searchParams.get('sortBy') || 'createdAt'}-${searchParams.get('sortOrder') || 'desc'}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split('-');
                                router.push(`/admin/businesses?${createQueryString('sortBy', sortBy)}&${createQueryString('sortOrder', sortOrder)}`);
                            }}
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="rating-desc">Highest Rated</option>
                            <option value="rating-asc">Lowest Rated</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
