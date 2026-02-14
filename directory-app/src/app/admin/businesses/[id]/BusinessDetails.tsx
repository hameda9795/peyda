"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Pencil,
    Trash2,
    Eye,
    Star,
    MapPin,
    Phone,
    Globe,
    Mail,
    Calendar,
    MessageSquare,
    ExternalLink,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthlyAnalytics {
    month: string;
    profileViews: number;
    phoneClicks: number;
    whatsappClicks: number;
    websiteClicks: number;
    directionsClicks: number;
    emailClicks: number;
    bookingClicks: number;
}

interface AnalyticsData {
    business: {
        id: string;
        name: string;
        slug: string;
        city: string;
    };
    monthlyData: MonthlyAnalytics[];
    totals: {
        profileViews: number;
        phoneClicks: number;
        whatsappClicks: number;
        websiteClicks: number;
        directionsClicks: number;
        emailClicks: number;
        bookingClicks: number;
    };
    totalContacts: number;
    trends: {
        profileViews: { value: string; isPositive: boolean } | null;
        phoneClicks: { value: string; isPositive: boolean } | null;
        whatsappClicks: { value: string; isPositive: boolean } | null;
        websiteClicks: { value: string; isPositive: boolean } | null;
        directionsClicks: { value: string; isPositive: boolean } | null;
    };
}

interface Business {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    longDescription: string | null;
    street: string | null;
    postalCode: string | null;
    city: string;
    province: string | null;
    provinceSlug: string | null;
    neighborhood: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    logo: string | null;
    coverImage: string | null;
    kvkNumber: string | null;
    foundedYear: number | null;
    serviceArea: string | null;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    isActive: boolean;
    status: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    subCategory: {
        id: string;
        name: string;
        category: {
            id: string;
            name: string;
        };
    };
    reviews: Array<{
        id: string;
        author: string;
        email: string;
        rating: number;
        content: string;
        ownerResponse: string | null;
        isPublished: boolean;
        createdAt: Date | string;
    }>;
    analytics: {
        id: string;
        month: Date;
        profileViews: number;
        phoneClicks: number;
        websiteClicks: number;
        directionsClicks: number;
        emailClicks: number;
        bookingClicks: number;
    } | null;
}

interface Props {
    business: Business;
}

export function BusinessDetails({ business }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'analytics'>('details');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [period, setPeriod] = useState('12');

    // Fetch analytics when tab is analytics
    useEffect(() => {
        if (activeTab === 'analytics') {
            const fetchAnalytics = async () => {
                setAnalyticsLoading(true);
                try {
                    const response = await fetch(`/api/admin/businesses/${business.id}/analytics?period=${period}`);
                    const data = await response.json();
                    setAnalyticsData(data);
                } catch (error) {
                    console.error('Error fetching analytics:', error);
                } finally {
                    setAnalyticsLoading(false);
                }
            };
            fetchAnalytics();
        }
    }, [activeTab, business.id, period]);

    const handleAction = async (action: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/businesses/${business.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (response.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Error performing action:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/businesses/${business.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/admin/businesses');
            }
        } catch (error) {
            console.error('Error deleting business:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            approved: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            rejected: 'bg-red-100 text-red-700',
            draft: 'bg-gray-100 text-gray-700',
        };
        const style = styles[status] || styles.draft;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${style}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Calculate total analytics (from single object)
    const totalViews = business.analytics?.profileViews || 0;
    const totalPhoneClicks = business.analytics?.phoneClicks || 0;
    const totalWebsiteClicks = business.analytics?.websiteClicks || 0;
    const totalDirectionsClicks = business.analytics?.directionsClicks || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/businesses"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                            {business.isVerified && (
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                            )}
                            {getStatusBadge(business.status)}
                        </div>
                        <p className="text-gray-500 mt-1">/{business.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open(`/nederland/${business.slug}`, '_blank')}
                        className="gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        View Public Page
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/admin/businesses/${business.id}/edit`)}
                        className="gap-2"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
                {business.status === 'pending' && (
                    <>
                        <Button
                            onClick={() => handleAction('approve')}
                            disabled={loading}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                        </Button>
                        <Button
                            onClick={() => handleAction('reject')}
                            disabled={loading}
                            variant="outline"
                            className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <XCircle className="h-4 w-4" />
                            Reject
                        </Button>
                    </>
                )}

                {business.status === 'approved' && (
                    <>
                        <Button
                            onClick={() => handleAction('unpublish')}
                            disabled={loading}
                            variant="outline"
                            className="gap-2"
                        >
                            <XCircle className="h-4 w-4" />
                            Unpublish
                        </Button>
                        {business.isVerified ? (
                            <Button
                                onClick={() => handleAction('unverify')}
                                disabled={loading}
                                variant="outline"
                                className="gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Remove Verified
                            </Button>
                        ) : (
                            <Button
                                onClick={() => handleAction('verify')}
                                disabled={loading}
                                className="gap-2"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Mark as Verified
                            </Button>
                        )}
                    </>
                )}

                <Button
                    onClick={handleDelete}
                    disabled={loading}
                    variant="ghost"
                    className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 mr-auto"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'details'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Business Details
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'reviews'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Reviews ({business.reviews.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'analytics'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Analytics
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-600">
                                    {business.shortDescription || business.description || 'No description provided'}
                                </p>
                                {business.longDescription && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-gray-600 whitespace-pre-wrap">{business.longDescription}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {business.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{business.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {business.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{business.email}</p>
                                        </div>
                                    </div>
                                )}
                                {business.website && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Website</p>
                                            <a
                                                href={business.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-indigo-600 hover:underline flex items-center gap-1"
                                            >
                                                {business.website}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {business.kvkNumber && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">KVK Number</p>
                                            <p className="font-medium">{business.kvkNumber}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium">
                                        {business.street && `${business.street}, `}
                                        {business.postalCode} {business.city}
                                    </p>
                                    {business.province && (
                                        <p className="text-gray-500">{business.province}</p>
                                    )}
                                    {business.neighborhood && (
                                        <p className="text-gray-500">{business.neighborhood}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Rating</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="font-medium">{business.rating.toFixed(1)}</span>
                                        <span className="text-gray-400">({business.reviewCount})</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Profile Views</span>
                                    <span className="font-medium">{totalViews}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Phone Clicks</span>
                                    <span className="font-medium">{totalPhoneClicks}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Website Clicks</span>
                                    <span className="font-medium">{totalWebsiteClicks}</span>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
                            <div className="space-y-2">
                                <p className="font-medium">{business.subCategory?.category?.name}</p>
                                <p className="text-gray-500">{business.subCategory?.name}</p>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Created</p>
                                        <p className="font-medium">
                                            {new Date(business.createdAt).toLocaleDateString('nl-NL', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="font-medium">
                                            {new Date(business.updatedAt).toLocaleDateString('nl-NL', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="bg-white rounded-xl border border-slate-200">
                    {business.reviews.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No reviews yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {business.reviews.map((review) => (
                                <div key={review.id} className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{review.author}</p>
                                            <p className="text-sm text-gray-500">{review.email}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map((i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < review.rating
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-3">{review.content}</p>
                                    {review.ownerResponse && (
                                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Owner Response:</p>
                                            <p className="text-sm text-gray-600">{review.ownerResponse}</p>
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-400 mt-3">
                                        {new Date(review.createdAt).toLocaleDateString('nl-NL', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    {/* Period Selector */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Performance Analytics</h2>
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

                    {analyticsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1,2,3,4,5,6].map((i) => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : analyticsData ? (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Profile Views */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-blue-600" />
                                        </div>
                                        {analyticsData.trends.profileViews && (
                                            <div className={`flex items-center gap-1 text-sm ${analyticsData.trends.profileViews.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {analyticsData.trends.profileViews.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                {analyticsData.trends.profileViews.value}%
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totals.profileViews.toLocaleString('nl-NL')}</p>
                                    <p className="text-sm text-gray-500">Total Profile Views</p>
                                </div>

                                {/* Phone Clicks */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-green-600" />
                                        </div>
                                        {analyticsData.trends.phoneClicks && (
                                            <div className={`flex items-center gap-1 text-sm ${analyticsData.trends.phoneClicks.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {analyticsData.trends.phoneClicks.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                {analyticsData.trends.phoneClicks.value}%
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totals.phoneClicks.toLocaleString('nl-NL')}</p>
                                    <p className="text-sm text-gray-500">Phone Clicks</p>
                                </div>

                                {/* WhatsApp Clicks */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        {analyticsData.trends.whatsappClicks && (
                                            <div className={`flex items-center gap-1 text-sm ${analyticsData.trends.whatsappClicks.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {analyticsData.trends.whatsappClicks.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                {analyticsData.trends.whatsappClicks.value}%
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totals.whatsappClicks.toLocaleString('nl-NL')}</p>
                                    <p className="text-sm text-gray-500">WhatsApp Clicks</p>
                                </div>

                                {/* Website Clicks */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Globe className="w-6 h-6 text-purple-600" />
                                        </div>
                                        {analyticsData.trends.websiteClicks && (
                                            <div className={`flex items-center gap-1 text-sm ${analyticsData.trends.websiteClicks.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {analyticsData.trends.websiteClicks.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                {analyticsData.trends.websiteClicks.value}%
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totals.websiteClicks.toLocaleString('nl-NL')}</p>
                                    <p className="text-sm text-gray-500">Website Clicks</p>
                                </div>
                            </div>

                            {/* Second Row - Additional Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Total Contacts */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                        <Phone className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalContacts.toLocaleString('nl-NL')}</p>
                                    <p className="text-sm text-gray-500">Total Contacts (Phone + WhatsApp + Email + Booking)</p>
                                </div>

                                {/* Directions Clicks */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-orange-600" />
                                        </div>
                                        {analyticsData.trends.directionsClicks && (
                                            <div className={`flex items-center gap-1 text-sm ${analyticsData.trends.directionsClicks.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {analyticsData.trends.directionsClicks.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                {analyticsData.trends.directionsClicks.value}%
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totals.directionsClicks.toLocaleString('nl-NL')}</p>
                                    <p className="text-sm text-gray-500">Directions Clicks</p>
                                </div>

                                {/* Email Clicks */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6">
                                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                        <Mail className="w-6 h-6 text-pink-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totals.emailClicks.toLocaleString('nl-NL')}</p>
                                    <p className="text-sm text-gray-500">Email Clicks</p>
                                </div>
                            </div>

                            {/* Monthly Trend Chart */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Profile Views</h3>
                                <div className="h-48">
                                    <div className="flex items-end justify-between h-full gap-1">
                                        {analyticsData.monthlyData.map((month) => {
                                            const maxViews = Math.max(...analyticsData.monthlyData.map((m) => m.profileViews), 1);
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

                            {/* Monthly Data Table */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-3 px-3 text-sm font-semibold text-gray-900">Month</th>
                                                <th className="text-right py-3 px-3 text-sm font-semibold text-gray-900">Views</th>
                                                <th className="text-right py-3 px-3 text-sm font-semibold text-gray-900">Phone</th>
                                                <th className="text-right py-3 px-3 text-sm font-semibold text-gray-900">WhatsApp</th>
                                                <th className="text-right py-3 px-3 text-sm font-semibold text-gray-900">Website</th>
                                                <th className="text-right py-3 px-3 text-sm font-semibold text-gray-900">Directions</th>
                                                <th className="text-right py-3 px-3 text-sm font-semibold text-gray-900">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {analyticsData.monthlyData.map((month) => (
                                                <tr key={month.month}>
                                                    <td className="py-3 px-3 text-gray-900">
                                                        {new Date(month.month + '-01').toLocaleDateString('nl-NL', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                        })}
                                                    </td>
                                                    <td className="py-3 px-3 text-right text-gray-900">{month.profileViews}</td>
                                                    <td className="py-3 px-3 text-right text-gray-900">{month.phoneClicks}</td>
                                                    <td className="py-3 px-3 text-right text-gray-900">{month.whatsappClicks}</td>
                                                    <td className="py-3 px-3 text-right text-gray-900">{month.websiteClicks}</td>
                                                    <td className="py-3 px-3 text-right text-gray-900">{month.directionsClicks}</td>
                                                    <td className="py-3 px-3 text-right text-gray-900">{month.emailClicks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                            <p className="text-gray-500">No analytics data available</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
