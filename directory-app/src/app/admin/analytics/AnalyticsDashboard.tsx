"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Eye,
    Phone,
    Globe,
    MapPin,
    Mail,
    Calendar,
    Building2,
    TrendingUp,
    TrendingDown,
    MessageCircle,
} from 'lucide-react';

interface MonthlyData {
    month: string;
    profileViews: number;
    phoneClicks: number;
    whatsappClicks: number;
    websiteClicks: number;
    directionsClicks: number;
    emailClicks: number;
    bookingClicks: number;
    uniqueVisitors: number;
}

interface TopBusiness {
    id: string;
    name: string;
    slug: string;
    city: string;
    totalViews: number;
}

interface AnalyticsData {
    monthlyData: MonthlyData[];
    totals: {
        profileViews: number;
        phoneClicks: number;
        whatsappClicks: number;
        websiteClicks: number;
        directionsClicks: number;
        emailClicks: number;
        bookingClicks: number;
    };
    topBusinesses: TopBusiness[];
    businessStats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        draft: number;
    };
}

export function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('12');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/admin/analytics?period=${period}`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [period]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1,2,3,4].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return <div className="text-center py-12 text-gray-500">Failed to load analytics</div>;
    }

    const { monthlyData, totals, topBusinesses, businessStats } = data;

    // Calculate trends (compare last month to previous month)
    const lastMonth = monthlyData[monthlyData.length - 1];
    const prevMonth = monthlyData[monthlyData.length - 2];
    const getTrend = (current: number, previous: number) => {
        if (previous === 0) return null;
        const change = ((current - previous) / previous) * 100;
        return {
            value: change.toFixed(1),
            isPositive: change >= 0,
        };
    };

    const viewsTrend = getTrend(lastMonth?.profileViews || 0, prevMonth?.profileViews || 0);
    const phoneTrend = getTrend(lastMonth?.phoneClicks || 0, prevMonth?.phoneClicks || 0);
    const whatsappTrend = getTrend(lastMonth?.whatsappClicks || 0, prevMonth?.whatsappClicks || 0);
    const websiteTrend = getTrend(lastMonth?.websiteClicks || 0, prevMonth?.websiteClicks || 0);
    const directionsTrend = getTrend(lastMonth?.directionsClicks || 0, prevMonth?.directionsClicks || 0);

    return (
        <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="3">Last 3 months</option>
                        <option value="6">Last 6 months</option>
                        <option value="12">Last 12 months</option>
                        <option value="24">Last 24 months</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Views */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        {viewsTrend && (
                            <div className={`flex items-center gap-1 text-sm ${viewsTrend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {viewsTrend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {viewsTrend.value}%
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totals.profileViews.toLocaleString('nl-NL')}</p>
                    <p className="text-sm text-gray-500">Total Profile Views</p>
                </div>

                {/* Phone Clicks */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        {phoneTrend && (
                            <div className={`flex items-center gap-1 text-sm ${phoneTrend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {phoneTrend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {phoneTrend.value}%
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totals.phoneClicks.toLocaleString('nl-NL')}</p>
                    <p className="text-sm text-gray-500">Phone Clicks</p>
                </div>

                {/* Website Clicks */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-6 h-6 text-purple-600" />
                        </div>
                        {websiteTrend && (
                            <div className={`flex items-center gap-1 text-sm ${websiteTrend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {websiteTrend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {websiteTrend.value}%
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totals.websiteClicks.toLocaleString('nl-NL')}</p>
                    <p className="text-sm text-gray-500">Website Clicks</p>
                </div>

                {/* WhatsApp Clicks */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        {whatsappTrend && (
                            <div className={`flex items-center gap-1 text-sm ${whatsappTrend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {whatsappTrend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {whatsappTrend.value}%
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totals.whatsappClicks.toLocaleString('nl-NL')}</p>
                    <p className="text-sm text-gray-500">WhatsApp Clicks</p>
                </div>

                {/* Directions Clicks */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                        {directionsTrend && (
                            <div className={`flex items-center gap-1 text-sm ${directionsTrend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {directionsTrend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {directionsTrend.value}%
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totals.directionsClicks.toLocaleString('nl-NL')}</p>
                    <p className="text-sm text-gray-500">Directions Clicks</p>
                </div>
            </div>

            {/* Business Stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{businessStats.total}</p>
                        <p className="text-sm text-gray-500">Total Businesses</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-700">{businessStats.approved}</p>
                        <p className="text-sm text-green-600">Published</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-700">{businessStats.pending}</p>
                        <p className="text-sm text-yellow-600">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-700">{businessStats.draft}</p>
                        <p className="text-sm text-gray-500">Draft</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-700">{businessStats.rejected}</p>
                        <p className="text-sm text-red-600">Rejected</p>
                    </div>
                </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
                <div className="h-64">
                    <div className="flex items-end justify-between h-full gap-2">
                        {monthlyData.map((month, index) => {
                            const maxViews = Math.max(...monthlyData.map((m) => m.profileViews), 1);
                            const height = (month.profileViews / maxViews) * 100;
                            return (
                                <div key={month.month} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors relative group"
                                        style={{ height: `${height}%`, minHeight: month.profileViews > 0 ? '4px' : '0' }}
                                    >
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {month.profileViews.toLocaleString('nl-NL')}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2">
                                        {new Date(month.month + '-01').toLocaleDateString('nl-NL', { month: 'short' })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Top Businesses */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Businesses</h3>
                {topBusinesses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No data available</p>
                ) : (
                    <div className="space-y-3">
                        {topBusinesses.map((business, index) => (
                            <Link
                                key={business.id}
                                href={`/admin/businesses/${business.id}`}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium text-gray-900">{business.name}</p>
                                        <p className="text-sm text-gray-500">{business.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{business.totalViews.toLocaleString('nl-NL')}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Other Clicks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{totals.emailClicks.toLocaleString('nl-NL')}</p>
                            <p className="text-sm text-gray-500">Email Clicks</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{totals.bookingClicks.toLocaleString('nl-NL')}</p>
                            <p className="text-sm text-gray-500">Booking Clicks</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
