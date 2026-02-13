"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Heart, ArrowRight } from "lucide-react";
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

interface CategoryMasonrySectionProps {
    title: string;
    icon: string;
    businesses: Business[];
    categorySlug: string;
    bgGradient?: string;
    isReversed?: boolean;
}

// Placeholder images
const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
];

const isSafeImage = (src: string) =>
    src.startsWith("/") ||
    src.includes("images.unsplash.com") ||
    src.includes("placehold.co");

const ACCENT_PALETTE = [
    { primary: "#8b5cf6", secondary: "#a855f7", name: "violet" },
    { primary: "#0ea5e9", secondary: "#06b6d4", name: "sky" },
    { primary: "#10b981", secondary: "#14b8a6", name: "emerald" },
    { primary: "#f97316", secondary: "#f59e0b", name: "orange" },
    { primary: "#ec4899", secondary: "#f472b6", name: "pink" },
    { primary: "#6366f1", secondary: "#818cf8", name: "indigo" },
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

// Card size patterns for masonry effect - repeating pattern
const CARD_SIZES = [
    'tall',    // 0
    'normal',  // 1
    'normal',  // 2
    'wide',    // 3
    'normal',  // 4
    'tall',    // 5
    'normal',  // 6
    'normal',  // 7
    'wide',    // 8
    'normal',  // 9
];

export function CategoryMasonrySection({
    title,
    icon,
    businesses,
    categorySlug,
    isReversed,
}: CategoryMasonrySectionProps) {
    const accent = getAccent(categorySlug);

    if (businesses.length === 0) return null;

    // Take last 10 businesses
    const displayBusinesses = businesses.slice(-10);

    return (
        <section
            className="category-masonry-section"
            style={{
                "--accent-primary": accent.primary,
                "--accent-secondary": accent.secondary,
            } as CSSProperties}
        >
            <div className="category-masonry-inner">
                {/* Header */}
                <div className="category-masonry-header">
                    <div className="category-masonry-title-wrap">
                        <span className="category-masonry-icon">{icon}</span>
                        <h2 className="category-masonry-title">{title}</h2>
                    </div>
                    <Link
                        href={`/categorieen/${categorySlug}`}
                        className="category-masonry-cta"
                    >
                        Bekijk alles
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Masonry Grid */}
                <div className="category-masonry-grid">
                    {displayBusinesses.map((business, index) => (
                        <MasonryBusinessCard
                            key={business.id}
                            business={business}
                            index={index}
                            size={CARD_SIZES[index % CARD_SIZES.length]}
                            fallbackCategorySlug={categorySlug}
                            accent={accent}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function MasonryBusinessCard({
    business,
    index,
    size,
    fallbackCategorySlug,
    accent,
}: {
    business: Business;
    index: number;
    size: string;
    fallbackCategorySlug?: string;
    accent: { primary: string; secondary: string; name: string };
}) {
    const coverImage = business.images?.cover || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
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

    return (
        <Link
            href={href}
            className={`masonry-biz-card masonry-biz-card--${size}`}
            style={{ "--card-index": index } as CSSProperties}
        >
            {/* Image */}
            <div className="masonry-biz-image-wrap">
                {isSafeImage(coverImage) ? (
                    <Image
                        src={coverImage}
                        alt={business.name}
                        fill
                        sizes={size === 'wide' ? "400px" : "200px"}
                        className="masonry-biz-image"
                    />
                ) : (
                    <img
                        src={coverImage}
                        alt={business.name}
                        loading="lazy"
                        className="masonry-biz-image"
                    />
                )}

                {/* Gradient Overlay */}
                <div className="masonry-biz-overlay" />

                {/* Favorite Button */}
                <button
                    className="masonry-biz-fav"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    aria-label="Opslaan"
                >
                    <Heart className="w-3.5 h-3.5" />
                </button>

                {/* Content */}
                <div className="masonry-biz-content">
                    {/* Rating */}
                    {hasReviews && rating !== null ? (
                        <div className="masonry-biz-rating">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{rating.toFixed(1)}</span>
                            <span className="masonry-biz-reviews">({reviewCount})</span>
                        </div>
                    ) : (
                        <div className="masonry-biz-rating masonry-biz-rating--new">
                            <span>Nieuw</span>
                        </div>
                    )}

                    {/* Name */}
                    <h3 className="masonry-biz-name">{business.name}</h3>

                    {/* Location */}
                    <div className="masonry-biz-location">
                        <MapPin className="w-3 h-3" />
                        <span>{business.address?.city || "NL"}</span>
                    </div>
                </div>

                {/* Shine effect */}
                <div className="masonry-biz-shine" />
            </div>
        </Link>
    );
}
