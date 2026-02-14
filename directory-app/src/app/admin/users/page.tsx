"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    MoreHorizontal,
    Eye,
    Power,
    Trash2,
    Mail,
    Calendar,
    Building2,
    User,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface User {
    id: string;
    email: string;
    name: string | null;
    lastLoginAt: string | null;
    createdAt: string;
    business: {
        id: string;
        name: string;
        slug: string;
        city: string;
        status: string;
        isActive: boolean;
    };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            params.set('page', page.toString());
            params.set('limit', '20');

            const response = await fetch(`/api/admin/users?${params.toString()}`);
            const data = await response.json();

            setUsers(data.users || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleAction = async (userId: string, action: string) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, action }),
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error performing action:', error);
        }
    };

    const getStatusBadge = (status: string, isActive: boolean) => {
        if (!isActive) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>;
        }
        const styles: Record<string, string> = {
            approved: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            rejected: 'bg-red-100 text-red-700',
            draft: 'bg-gray-100 text-gray-700',
        };
        const style = styles[status] || styles.draft;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Users</h1>
                <p className="text-gray-500 mt-1">Manage business owners and their accounts</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by name, email or business..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button type="submit" variant="default">
                    Search
                </Button>
            </form>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                    User
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                    Business
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                    Last Login
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                    Joined
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1,2,3,4,5].map((i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.name || 'No name'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/businesses/${user.business.id}`}
                                                className="flex items-center gap-2 hover:text-indigo-600"
                                            >
                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                <span>{user.business.name}</span>
                                            </Link>
                                            <p className="text-sm text-gray-500">{user.business.city}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(user.business.status, user.business.isActive)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.lastLoginAt ? (
                                                <p className="text-gray-900">
                                                    {new Date(user.lastLoginAt).toLocaleDateString('nl-NL', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            ) : (
                                                <p className="text-gray-400">Never</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">
                                                {new Date(user.createdAt).toLocaleDateString('nl-NL', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/businesses/${user.business.id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Business"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-600" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleAction(
                                                            user.id,
                                                            user.business.isActive ? 'deactivate' : 'activate'
                                                        )
                                                    }
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title={user.business.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    <Power
                                                        className={`h-4 w-4 ${
                                                            user.business.isActive
                                                                ? 'text-green-600'
                                                                : 'text-gray-400'
                                                        }`}
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this user?')) {
                                                            handleAction(user.id, 'delete');
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
                                Previous
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
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
