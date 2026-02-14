"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Business {
    id: string;
    name: string;
    slug: string;
    city: string;
    province: string | null;
    status: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    subCategory: {
        name: string;
        category: {
            name: string;
        };
    };
    analytics: {
        profileViews: number;
    } | null;
}

interface Props {
    initialParams: {
        search?: string;
        status?: string;
        province?: string;
        categoryId?: string;
        sortBy?: string;
        sortOrder?: string;
        page?: string;
    };
}

export function BusinessTable({ initialParams }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBusinesses = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (initialParams.search) params.set('search', initialParams.search);
            if (initialParams.status) params.set('status', initialParams.status);
            if (initialParams.province) params.set('province', initialParams.province);
            if (initialParams.categoryId) params.set('categoryId', initialParams.categoryId);
            if (initialParams.sortBy) params.set('sortBy', initialParams.sortBy);
            if (initialParams.sortOrder) params.set('sortOrder', initialParams.sortOrder);
            params.set('page', page.toString());
            params.set('limit', '20');

            const response = await fetch(`/api/admin/businesses?${params.toString()}`);
            const data = await response.json();

            setBusinesses(data.businesses || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching businesses:', error);
        } finally {
            setLoading(false);
        }
    }, [initialParams, page]);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    const handleAction = async (id: string, action: string) => {
        try {
            const response = await fetch(`/api/admin/businesses/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (response.ok) {
                fetchBusinesses();
            }
        } catch (error) {
            console.error('Error performing action:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            approved: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            rejected: 'bg-red-100 text-red-700',
            draft: 'bg-gray-100 text-gray-700',
        };
        const style = styles[status as keyof typeof styles] || styles.draft;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Use fixed array to avoid hydration mismatch
    const skeletonItems = [1, 2, 3, 4, 5];

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="animate-pulse space-y-4">
                    {skeletonItems.map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Business
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Location
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Category
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Status
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Rating
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Date
                            </th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {businesses.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    No businesses found
                                </td>
                            </tr>
                        ) : (
                            businesses.map((business) => (
                                <tr key={business.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {business.isVerified && (
                                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {business.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {business.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{business.city}</p>
                                        {business.province && (
                                            <p className="text-sm text-gray-500">{business.province}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{business.subCategory?.category?.name}</p>
                                        <p className="text-sm text-gray-500">{business.subCategory?.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(business.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="font-medium">{business.rating.toFixed(1)}</span>
                                            <span className="text-gray-500">({business.reviewCount})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">
                                            {new Date(business.createdAt).toLocaleDateString('nl-NL')}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/businesses/${business.id}`}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </Link>

                                            {business.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(business.id, 'approve')}
                                                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(business.id, 'reject')}
                                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    </button>
                                                </>
                                            )}

                                            {business.status === 'approved' && (
                                                <button
                                                    onClick={() => handleAction(business.id, 'unpublish')}
                                                    className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                                                    title="Unpublish"
                                                >
                                                    <XCircle className="h-4 w-4 text-yellow-600" />
                                                </button>
                                            )}

                                            <Link
                                                href={`/admin/businesses/${business.id}/edit`}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4 text-gray-600" />
                                            </Link>

                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this business?')) {
                                                        handleAction(business.id, 'delete');
                                                    }
                                                }}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                    <p className="text-sm text-gray-500">
                        Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, total)} of {total} results
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
