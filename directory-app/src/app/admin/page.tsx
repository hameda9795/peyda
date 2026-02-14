import Link from 'next/link';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Building2,
    Users,
    Clock,
    XCircle,
    CheckCircle,
    TrendingUp,
    ArrowRight,
    Star,
    Eye,
} from 'lucide-react';

export default async function AdminDashboard() {
    // Fetch stats
    const [
        totalBusinesses,
        publishedBusinesses,
        pendingBusinesses,
        rejectedBusinesses,
        recentBusinesses,
        topBusinesses,
    ] = await Promise.all([
        db.business.count(),
        db.business.count({ where: { status: 'approved', isActive: true } }),
        db.business.count({ where: { status: 'pending' } }),
        db.business.count({ where: { status: 'rejected' } }),
        db.business.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                subCategory: {
                    include: {
                        category: true,
                    },
                },
            },
        }),
        db.business.findMany({
            take: 5,
            where: { status: 'approved' },
            orderBy: { rating: 'desc' },
            select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                rating: true,
                reviewCount: true,
            },
        }),
    ]);

    // Calculate total views from analytics
    const analytics = await db.businessAnalytics.findMany({
        select: { profileViews: true },
    });
    const totalViews = analytics.reduce((sum, a) => sum + a.profileViews, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your directory</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
                        <Building2 className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBusinesses}</div>
                        <p className="text-xs text-gray-500">
                            {publishedBusinesses} published
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <Clock className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pendingBusinesses}</div>
                        <p className="text-xs text-gray-500">
                            awaiting review
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{publishedBusinesses}</div>
                        <p className="text-xs text-gray-500">
                            active listings
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews.toLocaleString('nl-NL')}</div>
                        <p className="text-xs text-gray-500">
                            profile views
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent & Top Businesses */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Businesses */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Recent Businesses</CardTitle>
                        <Link href="/admin/businesses" className="text-sm text-indigo-600 hover:text-indigo-700">
                            View all →
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBusinesses.length === 0 ? (
                                <p className="text-sm text-gray-500">No businesses yet</p>
                            ) : (
                                recentBusinesses.map((business) => (
                                    <Link
                                        key={business.id}
                                        href={`/admin/businesses/${business.id}`}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{business.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {business.city} • {business.subCategory?.category?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    business.status === 'approved'
                                                        ? 'bg-green-100 text-green-700'
                                                        : business.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {business.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Rated Businesses */}
                <Card className="col-span-1 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Top Rated Businesses</CardTitle>
                        <Link href="/admin/businesses?sortBy=rating&sortOrder=desc" className="text-sm text-indigo-600 hover:text-indigo-700">
                            View all →
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topBusinesses.length === 0 ? (
                                <p className="text-sm text-gray-500">No businesses yet</p>
                            ) : (
                                topBusinesses.map((business) => (
                                    <Link
                                        key={business.id}
                                        href={`/admin/businesses/${business.id}`}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <Star className="h-5 w-5 text-yellow-600 fill-current" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{business.name}</p>
                                                <p className="text-sm text-gray-500">{business.city}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{business.rating.toFixed(1)}</span>
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-gray-400">({business.reviewCount})</span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/admin/businesses?status=pending"
                            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Pending</p>
                                <p className="text-sm text-gray-500">{pendingBusinesses} awaiting</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/businesses"
                            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">All Businesses</p>
                                <p className="text-sm text-gray-500">{totalBusinesses} total</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/analytics"
                            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Analytics</p>
                                <p className="text-sm text-gray-500">View reports</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/users"
                            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Users</p>
                                <p className="text-sm text-gray-500">Manage accounts</p>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
