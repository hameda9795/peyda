"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Heart, ChevronLeft, ChevronRight, TrendingUp, Award, ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { CSSProperties } from "react";

interface Business {
    id: string;
    name: string;
    slug?: string;
    category: string;
    categorySlug?: string;
    subcategories?: string[];
    subcategorySlug?: string;
    shortDescription?: string;
    rating?: number;
    reviewCount?: number;
    images?: {
        cover?: string;
        logo?: string;
    };
    address?: {
        city?: string;
        neighborhood?: string;
    };
    provinceSlug?: string;
    citySlug?: string;
    neighborhoodSlug?: string;
}

interface CategoryScrollSectionProps {
    title: string;
    icon: string;
    businesses: Business[];
    categorySlug: string;
    businessCount?: number;
}

// Helper for premium placeholder generation
const getPremiumPlaceholder = (id: string, name: string) => {
    const gradients = [
        "bg-gradient-to-br from-[#0B2A3C] via-[#1A455E] to-[#2A9D8F]",
        "bg-gradient-to-bl from-[#E07A3F] via-[#C55A1D] to-[#8A3A0B]",
        "bg-gradient-to-tr from-[#2A9D8F] via-[#1E7D71] to-[#0F4740]",
        "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-900 to-black",
        "bg-gradient-to-br from-[#4A5568] via-[#2D3748] to-[#1A202C]",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash) % gradients.length;

    const initials = name
        .split(' ')
        .map(n => n[0])
        .filter(c => /[A-Za-z0-9]/.test(c))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return { gradientClass: gradients[index], initials };
};

const isSafeImage = (src: string) =>
    src.startsWith("/") ||
    src.includes("images.unsplash.com") ||
    src.includes("placehold.co");

const ACCENT_PALETTE = [
    {
        primary: "#0ea5e9",
        secondary: "#22c55e",
        soft: "rgba(14,165,233,0.18)",
        soft2: "rgba(34,197,94,0.16)",
        glow: "0 30px 80px -50px rgba(14,165,233,0.75)",
    },
    {
        primary: "#f97316",
        secondary: "#14b8a6",
        soft: "rgba(249,115,22,0.18)",
        soft2: "rgba(20,184,166,0.16)",
        glow: "0 30px 80px -50px rgba(249,115,22,0.75)",
    },
    {
        primary: "#e11d48",
        secondary: "#f59e0b",
        soft: "rgba(225,29,72,0.16)",
        soft2: "rgba(245,158,11,0.16)",
        glow: "0 30px 80px -50px rgba(225,29,72,0.7)",
    },
    {
        primary: "#10b981",
        secondary: "#38bdf8",
        soft: "rgba(16,185,129,0.18)",
        soft2: "rgba(56,189,248,0.18)",
        glow: "0 30px 80px -50px rgba(16,185,129,0.7)",
    },
];

const hashString = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return hash;
};

const getAccent = (slug: string) => {
    const index = hashString(slug) % ACCENT_PALETTE.length;
    return ACCENT_PALETTE[index];
};

export function CategoryScrollSection({
    title,
    icon,
    businesses,
    categorySlug,
    businessCount,
}: CategoryScrollSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const accent = getAccent(categorySlug);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 350;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (businesses.length === 0) return null;

    return (
        <section className="mx-4 my-3 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="px-5 py-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <div>
                            <h2 className="text-base md:text-lg font-bold text-gray-900">{title}</h2>
                            <p className="text-gray-500 text-xs">{businessCount || businesses.length} bedrijven</p>
                        </div>
                    </div>

                    <Link
                        href={`/categorieen/${categorySlug}`}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Bekijk alles
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Cards */}
                <div className="relative group/container">
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 opacity-0 group-hover/container:opacity-100 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-3 overflow-x-auto scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {businesses.slice(0, 10).map((business, index) => (
                            <CategoryCard
                                key={business.id}
                                business={business}
                                index={index}
                                fallbackCategorySlug={categorySlug}
                                accentColor={accent.primary}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 opacity-0 group-hover/container:opacity-100 transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}

function CategoryCard({
    business,
    index,
    fallbackCategorySlug,
    accentColor
}: {
    business: Business;
    index: number;
    fallbackCategorySlug?: string;
    accentColor: string;
}) {
    const coverImage = business.images?.cover;
    const reviewCount = business.reviewCount || 0;
    const hasReviews = reviewCount > 0;
    const rating = hasReviews && business.rating ? business.rating : null;
    const businessSlug = business.slug || business.id;
    const categorySlug = business.categorySlug || fallbackCategorySlug || 'overig';
    const subcategorySlug = business.subcategorySlug || 'algemeen';

    const provinceSlug = business.provinceSlug || 'utrecht';
    const citySlug = business.citySlug || 'utrecht';
    const neighborhoodSlug = business.neighborhoodSlug || 'centrum';

    const href = `/${provinceSlug}/${citySlug}/${neighborhoodSlug}/${categorySlug}/${subcategorySlug}/${businessSlug}`;

    const placeholder = getPremiumPlaceholder(business.id, business.name);

    return (
        <Link
            href={href}
            className="group flex-shrink-0"
        >
            <div className="relative w-[145px] sm:w-[160px] aspect-[4/5] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Background Image or Premium Placeholder */}
                {coverImage && isSafeImage(coverImage) ? (
                    <Image
                        src={coverImage}
                        alt={business.name}
                        fill
                        sizes="160px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : coverImage ? (
                    <img
                        src={coverImage}
                        alt={business.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${placeholder.gradientClass}`}>
                        {/* Minimalist pattern overlay for texture */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDgsMCA4LDggMCw4IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none" />
                        <span className="text-white/30 font-bold text-5xl display-font tracking-widest mix-blend-overlay group-hover:scale-110 transition-transform duration-500">{placeholder.initials}</span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                {/* Heart */}
                <button
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Heart className="w-3.5 h-3.5" />
                </button>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    {/* Rating */}
                    {hasReviews && rating !== null ? (
                        <div className="flex items-center gap-1 mb-1.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
                            <span className="text-white/60 text-xs">({reviewCount})</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 mb-1.5">
                            <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded">Nieuw</span>
                        </div>
                    )}

                    {/* Name */}
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 leading-tight">
                        {business.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{business.address?.city || "NL"}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Popular Section
interface PopularSectionProps {
    businesses: Business[];
}

export function PopularBusinessesSection({ businesses }: PopularSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 350;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (businesses.length === 0) return null;

    return (
        <section className="mx-4 my-3 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="px-5 py-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <div>
                            <h2 className="text-base md:text-lg font-bold text-gray-900">Hoogst Beoordeeld</h2>
                            <p className="text-gray-500 text-xs">Top {businesses.length} bedrijven</p>
                        </div>
                    </div>

                    <Link
                        href="/populair"
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Bekijk alles
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Cards */}
                <div className="relative group/container">
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 opacity-0 group-hover/container:opacity-100 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-3 overflow-x-auto scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {businesses.slice(0, 10).map((business, index) => (
                            <PopularCard
                                key={business.id}
                                business={business}
                                rank={index + 1}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 opacity-0 group-hover/container:opacity-100 transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}

function PopularCard({ business, rank }: { business: Business; rank: number }) {
    const coverImage = business.images?.cover;
    const reviewCount = business.reviewCount || 0;
    const hasReviews = reviewCount > 0;
    const rating = hasReviews && business.rating ? business.rating : null;
    const businessSlug = business.slug || business.id;
    const categorySlug = business.categorySlug || 'overig';
    const subcategorySlug = business.subcategorySlug || 'algemeen';

    // Build full SEO URL: /province/city/neighborhood/category/subcategory/business
    const provinceSlug = business.provinceSlug || 'utrecht';
    const citySlug = business.citySlug || 'utrecht';
    const neighborhoodSlug = business.neighborhoodSlug || 'centrum';

    const href = `/${provinceSlug}/${citySlug}/${neighborhoodSlug}/${categorySlug}/${subcategorySlug}/${businessSlug}`;

    const placeholder = getPremiumPlaceholder(business.id, business.name);

    return (
        <Link
            href={href}
            className="group flex-shrink-0"
        >
            {/* Card - Same aspect ratio as city cards (4/5) */}
            <div className="relative w-[160px] aspect-[4/5] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Background Image or Premium Placeholder */}
                {coverImage && isSafeImage(coverImage) ? (
                    <Image
                        src={coverImage}
                        alt={business.name}
                        fill
                        sizes="160px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : coverImage ? (
                    <img
                        src={coverImage}
                        alt={business.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${placeholder.gradientClass}`}>
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDgsMCA4LDggMCw4IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none" />
                        <span className="text-white/30 font-bold text-5xl display-font tracking-widest mix-blend-overlay group-hover:scale-110 transition-transform duration-500">{placeholder.initials}</span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                {/* Rank Badge */}
                {rank <= 3 && (
                    <div className={`absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${rank === 1 ? 'bg-amber-500' :
                        rank === 2 ? 'bg-gray-400' :
                            'bg-amber-700'
                        }`}>
                        {rank === 1 ? <Award className="w-4 h-4" /> : rank}
                    </div>
                )}

                {/* Heart */}
                <button
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Heart className="w-3.5 h-3.5" />
                </button>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    {/* Rating */}
                    {hasReviews && rating !== null ? (
                        <div className="flex items-center gap-1 mb-1.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
                            <span className="text-white/60 text-xs">({reviewCount})</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 mb-1.5">
                            <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded">Nieuw</span>
                        </div>
                    )}

                    {/* Name */}
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 leading-tight">
                        {business.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{business.address?.city || "NL"}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
