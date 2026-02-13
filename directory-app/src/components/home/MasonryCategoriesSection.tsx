"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, TrendingUp, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    _count?: {
        subcategories?: number;
        businesses?: number;
    };
    subcategories?: { id: string; name: string }[];
}

interface Business {
    id: string;
    name: string;
    slug?: string;
    categorySlug?: string;
    subcategorySlug?: string;
    rating?: number;
    reviewCount?: number;
    images?: {
        cover?: string;
        logo?: string;
    };
    address?: {
        city?: string;
    };
    provinceSlug?: string;
    citySlug?: string;
    neighborhoodSlug?: string;
}

interface CategoryWithBusinesses {
    slug: string;
    title: string;
    icon: string;
    gradient: string;
    businesses: Business[];
    subcategoryCount: number;
    image?: string;
}

interface MasonryCategoriesSectionProps {
    categories: CategoryWithBusinesses[];
}

// Beautiful gradient backgrounds for cards
const CARD_GRADIENTS = [
    "from-violet-600 via-purple-600 to-indigo-700",
    "from-emerald-500 via-teal-500 to-cyan-600",
    "from-orange-500 via-amber-500 to-yellow-500",
    "from-rose-500 via-pink-500 to-fuchsia-600",
    "from-blue-500 via-indigo-500 to-violet-600",
    "from-teal-500 via-emerald-500 to-green-600",
    "from-amber-500 via-orange-500 to-red-500",
    "from-cyan-500 via-blue-500 to-indigo-600",
];

// Placeholder images for businesses
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

export function MasonryCategoriesSection({ categories }: MasonryCategoriesSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (categories.length === 0) return null;

    // Take top 6 categories for the masonry grid
    const displayCategories = categories.slice(0, 6);

    return (
        <section
            ref={sectionRef}
            className="masonry-section py-12 px-4 md:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="masonry-header mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="masonry-header-icon">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            Ontdek Categorieën
                        </span>
                    </div>
                    <h2 className="masonry-title">
                        Populaire <span className="masonry-title-gradient">Bedrijfscategorieën</span>
                    </h2>
                    <p className="masonry-subtitle">
                        Verken de beste bedrijven in elke categorie
                    </p>
                </div>

                {/* Masonry Grid */}
                <div className={`masonry-grid ${isVisible ? 'masonry-visible' : ''}`}>
                    {displayCategories.map((category, index) => (
                        <MasonryCard
                            key={category.slug}
                            category={category}
                            index={index}
                            gradient={CARD_GRADIENTS[index % CARD_GRADIENTS.length]}
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-8 text-center">
                    <Link
                        href="/categorieen"
                        className="masonry-view-all"
                    >
                        <span>Bekijk alle categorieën</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function MasonryCard({
    category,
    index,
    gradient
}: {
    category: CategoryWithBusinesses;
    index: number;
    gradient: string;
}) {
    // Determine card size based on index for varied layout
    const isLarge = index === 0 || index === 3;
    const isMedium = index === 1 || index === 4;

    // Use category image from database, fallback to placeholder
    const coverImage = category.image || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

    const cleanSlug = category.slug
        .replace('/utrecht/', '')
        .replace('/nederland/', '')
        .replace(/^\//, '');

    return (
        <Link
            href={`/categorieen/${cleanSlug}`}
            className={`masonry-card masonry-card-${isLarge ? 'large' : isMedium ? 'medium' : 'small'}`}
            style={{ '--card-index': index } as React.CSSProperties}
        >
            {/* Background Image */}
            <div className="masonry-card-bg">
                {isSafeImage(coverImage) ? (
                    <Image
                        src={coverImage}
                        alt={category.title}
                        fill
                        sizes={isLarge ? "400px" : "250px"}
                        className="masonry-card-image"
                    />
                ) : (
                    <img
                        src={coverImage}
                        alt={category.title}
                        loading="lazy"
                        className="masonry-card-image"
                    />
                )}

                {/* Gradient Overlay */}
                <div className={`masonry-card-overlay bg-gradient-to-t ${gradient}`} />

                {/* Glass Effect Overlay */}
                <div className="masonry-card-glass" />
            </div>

            {/* Card Content */}
            <div className="masonry-card-content">
                {/* Top Badge */}
                <div className="masonry-card-badge">
                    <TrendingUp className="w-3 h-3" />
                    <span>{category.businesses.length} bedrijven</span>
                </div>

                {/* Icon */}
                <div className="masonry-card-icon">
                    {category.icon}
                </div>

                {/* Title & Description */}
                <h3 className="masonry-card-title">{category.title}</h3>

                <p className="masonry-card-desc">
                    {category.subcategoryCount} subcategorieën beschikbaar
                </p>

                {/* Featured Businesses Preview - only for large cards */}
                {isLarge && category.businesses.length > 0 && (
                    <div className="masonry-card-preview">
                        <div className="masonry-preview-avatars">
                            {category.businesses.slice(0, 3).map((business, i) => (
                                <div
                                    key={business.id}
                                    className="masonry-preview-avatar"
                                    style={{ '--avatar-index': i } as React.CSSProperties}
                                >
                                    {business.images?.logo ? (
                                        <img
                                            src={business.images.logo}
                                            alt={business.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[10px] font-bold">
                                            {business.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="masonry-preview-info">
                            <div className="flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-semibold">4.8</span>
                            </div>
                            <span className="text-[10px] text-white/70">Gemiddeld</span>
                        </div>
                    </div>
                )}

                {/* Arrow Indicator */}
                <div className="masonry-card-arrow">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            {/* Shine Effect */}
            <div className="masonry-card-shine" />
        </Link>
    );
}
