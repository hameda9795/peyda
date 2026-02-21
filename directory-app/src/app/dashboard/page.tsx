import { Eye, Phone, Globe, MapPin, Star, TrendingUp, Award, MessageSquare } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getBusinessData, getReviewsData, getAnalyticsData, getSEOScore } from "./actions";
import { getCurrentUser } from "@/app/actions";

// Mock data for fallback
const mockBusinessData = {
    name: "Voorbeeld Bedrijf",
    slug: "voorbeeld-bedrijf",
    city: "Amsterdam",
    neighborhood: "Centrum",
    provinceSlug: "noord-holland",
    category: "Restaurant",
    subcategory: "Italiaans",
    rating: 4.5,
    reviewCount: 12,
    stats: {
        profileViews: 342,
        phoneClicks: 28,
        websiteClicks: 15,
        directionsClicks: 45,
    },
    weeklyChange: {
        profileViews: 12,
        phoneClicks: 5,
        websiteClicks: 3,
    },
    recentReviews: [
        {
            id: "1",
            author: "Jan de Vries",
            rating: 5,
            content: "Geweldige service en uitstekend eten!",
            date: "2 dagen geleden",
            hasResponse: false
        },
        {
            id: "2",
            author: "Maria Jansen",
            rating: 4,
            content: "Goed restaurant, iets lange wachttijd.",
            date: "5 dagen geleden",
            hasResponse: true
        }
    ]
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
    // Get current user and their business
    const currentUser = await getCurrentUser();

    // If no user or no business, redirect to registration page with message
    if (!currentUser || !currentUser.businessId) {
        redirect('/bedrijf-aanmelden?message=no-business');
    }

    // Always use the current user's business ID (ignore URL params for security)
    const userBusinessId = currentUser.businessId;

    // Try to fetch real data
    const businessData = await getBusinessData(userBusinessId);
    const analyticsData = await getAnalyticsData(userBusinessId);
    const reviewsData = await getReviewsData(userBusinessId);

    // Use real data if available, otherwise mock
    const data = businessData ? {
        name: businessData.name,
        slug: businessData.slug,
        city: businessData.city,
        neighborhood: businessData.neighborhood,
        provinceSlug: businessData.provinceSlug,
        category: businessData.category,
        subcategory: businessData.subcategory,
        rating: businessData.rating,
        reviewCount: businessData.reviewCount,
        stats: analyticsData?.stats || businessData.stats,
        weeklyChange: analyticsData?.weeklyChange || { profileViews: 12, phoneClicks: 5, websiteClicks: 3 },
        recentReviews: reviewsData?.reviews?.slice(0, 2) || []
    } : mockBusinessData;

    const { name, stats, weeklyChange, recentReviews, rating, reviewCount } = data as typeof mockBusinessData;

    // Fetch actual SEO Data
    const seoScoreData = await getSEOScore(userBusinessId);
    const seoScore = seoScoreData?.overallScore || 0;

    // Helper for URL building
    const sanitize = (text: string) => text ? text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '';
    const dynProv = sanitize(data.provinceSlug || 'nederland');
    const dynCity = sanitize(data.city || 'stad');
    const dynHood = sanitize(data.neighborhood || 'centrum');
    const dynCat = sanitize(data.category || 'bedrijf');
    const dynSubcat = sanitize(data.subcategory || 'algemeen');
    const liveProfileUrl = `/${dynProv}/${dynCity}/${dynHood}/${dynCat}/${dynSubcat}/${data.slug}`;

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Welkom terug! 👋
                </h1>
                <p className="text-slate-600">
                    Hier is een overzicht van hoe <span className="font-semibold">{name}</span> presteert
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Profile Views */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        {weeklyChange.profileViews !== undefined && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                +{weeklyChange.profileViews}%
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{stats.profileViews}</p>
                    <p className="text-sm text-slate-500">Profiel bekeken</p>
                    <p className="text-xs text-slate-400 mt-1">Deze maand</p>
                </div>

                {/* Phone Clicks */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        {weeklyChange.phoneClicks !== undefined && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                +{weeklyChange.phoneClicks}%
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{stats.phoneClicks}</p>
                    <p className="text-sm text-slate-500">Telefoongesprekken</p>
                    <p className="text-xs text-slate-400 mt-1">Potentiële klanten</p>
                </div>

                {/* Website Clicks */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-6 h-6 text-purple-600" />
                        </div>
                        {weeklyChange.websiteClicks !== undefined && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                +{weeklyChange.websiteClicks}%
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{stats.websiteClicks}</p>
                    <p className="text-sm text-slate-500">Website bezoekers</p>
                    <p className="text-xs text-slate-400 mt-1">Via uw profiel</p>
                </div>

                {/* Directions */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{stats.directionsClicks}</p>
                    <p className="text-sm text-slate-500">Routebeschrijving</p>
                    <p className="text-xs text-slate-400 mt-1">Mensen onderweg</p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* SEO Score */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">SEO Score</h3>
                            <p className="text-xs text-slate-500">Uw zichtbaarheid</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Circular Progress */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative w-32 h-32">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        className="text-slate-200"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - seoScore / 100)}`}
                                        className="text-blue-600"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-slate-800">{seoScore}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Basis informatie</span>
                                <span className="text-green-600 font-medium">Compleet</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Foto&apos;s</span>
                                <span className="text-orange-600 font-medium">3/10</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Beoordelingen</span>
                                <span className="text-red-600 font-medium">{reviewCount}/20</span>
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/seo${userBusinessId ? `?businessId=${userBusinessId}` : ''}`}
                            className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Verbeter SEO Score
                        </Link>
                    </div>
                </div>

                {/* Rating & Reviews */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                <Star className="w-5 h-5 text-white fill-current" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Beoordelingen</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-slate-800">{rating}</span>
                                    <span className="text-sm text-slate-500">({reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <Link
                            href={`/dashboard/reviews${userBusinessId ? `?businessId=${userBusinessId}` : ''}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Alles bekijken →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentReviews.map((review: any) => (
                            <div
                                key={review.id}
                                className="border border-slate-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-medium text-slate-800">{review.author}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-slate-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-400">{review.date}</span>
                                        </div>
                                    </div>
                                    {!review.hasResponse && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                            Nog niet beantwoord
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{review.content}</p>
                                {!review.hasResponse && (
                                    <Link
                                        href={`/dashboard/reviews${userBusinessId ? `?businessId=${userBusinessId}` : ''}`}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Reageren →
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Snelle acties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href={`/dashboard/profile${userBusinessId ? `?businessId=${userBusinessId}` : ''}`}
                        className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                        <Award className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="font-medium text-slate-800">Update profiel</p>
                            <p className="text-xs text-slate-500">Informatie bijwerken</p>
                        </div>
                    </Link>
                    <Link
                        href={`/dashboard/reviews${userBusinessId ? `?businessId=${userBusinessId}` : ''}`}
                        className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                        <MessageSquare className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="font-medium text-slate-800">Vraag een review</p>
                            <p className="text-xs text-slate-500">Stuur link naar klant</p>
                        </div>
                    </Link>
                    <a
                        href={liveProfileUrl}
                        target="_blank"
                        className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                        <Eye className="w-8 h-8 text-purple-600" />
                        <div>
                            <p className="font-medium text-slate-800">Bekijk profiel</p>
                            <p className="text-xs text-slate-500">Zie hoe klanten u zien</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
