"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Heart, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { CSSProperties } from "react";

interface Business {
    id: string;
    name: string;
    slug?: string;
    category?: string;
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

interface BusinessScrollSectionProps {
    title: string;
    businesses: Business[];
    viewAllHref?: string;
    viewAllText?: string;
    accentIndex?: number;
}

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
    {
        primary: "#8b5cf6",
        secondary: "#ec4899",
        soft: "rgba(139,92,246,0.18)",
        soft2: "rgba(236,72,153,0.16)",
        glow: "0 30px 80px -50px rgba(139,92,246,0.75)",
    },
];

export function BusinessScrollSection({
    title,
    businesses,
    viewAllHref,
    viewAllText = "Bekijk alles",
    accentIndex = 0,
}: BusinessScrollSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const accent = ACCENT_PALETTE[accentIndex % ACCENT_PALETTE.length];
    const accentStyle = {
        "--rail-accent": accent.primary,
        "--rail-accent-2": accent.secondary,
        "--rail-accent-soft": accent.soft,
        "--rail-accent-soft-2": accent.soft2,
        "--rail-glow": accent.glow,
    } as CSSProperties;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (businesses.length === 0) return null;

    return (
        <section
            className={`category-rail ${accentIndex % 2 === 1 ? "category-rail--alt" : ""}`}
            style={accentStyle}
        >
            <div className="category-rail__inner">
                <div className="category-rail__head">
                    <div className="category-rail__title">
                        <h2 className="category-rail__name">{title}</h2>
                    </div>

                    {viewAllHref && (
                        <Link href={viewAllHref} className="category-rail__cta">
                            {viewAllText}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                <div className="category-rail__scroller-wrap">
                    <button
                        onClick={() => scroll('left')}
                        className="category-rail__nav category-rail__nav--left"
                        aria-label="Scroll links"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div ref={scrollRef} className="category-rail__scroller">
                        {businesses.slice(0, 10).map((business, index) => (
                            <BusinessCard
                                key={business.id}
                                business={business}
                                index={index}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="category-rail__nav category-rail__nav--right"
                        aria-label="Scroll rechts"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}

function BusinessCard({ business, index }: { business: Business; index: number }) {
    const coverImage = business.images?.cover || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
    const hasReviews = (business.reviewCount ?? 0) > 0;
    const rating = hasReviews && business.rating ? business.rating : null;
    const businessSlug = business.slug || business.id;

    // Build full URL: /province/city/neighborhood/category/subcategory/business
    const provinceSlug = business.provinceSlug || 'utrecht';
    const citySlug = business.citySlug || 'utrecht';
    const neighborhoodSlug = business.neighborhoodSlug || 'centrum';
    const categorySlug = business.categorySlug || 'overig';
    const subcategorySlug = business.subcategorySlug || 'algemeen';

    const href = `/${provinceSlug}/${citySlug}/${neighborhoodSlug}/${categorySlug}/${subcategorySlug}/${businessSlug}`;

    return (
        <Link
            href={href}
            className="category-rail__card"
            style={{ "--stagger": index } as CSSProperties}
        >
            <div className="category-rail__card-frame">
                {isSafeImage(coverImage) ? (
                    <Image
                        src={coverImage}
                        alt={business.name}
                        fill
                        sizes="160px"
                        className="category-rail__image"
                    />
                ) : (
                    <img
                        src={coverImage}
                        alt={business.name}
                        loading="lazy"
                        decoding="async"
                        className="category-rail__image"
                    />
                )}

                <div className="category-rail__overlay"></div>

                <button
                    className="category-rail__fav"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    aria-label="Opslaan"
                >
                    <Heart className="w-3.5 h-3.5" />
                </button>

                <div className="category-rail__content">
                    {hasReviews && rating !== null ? (
                        <div className="category-rail__rating">
                            <Star className="w-3 h-3" />
                            <span>{rating.toFixed(1)}</span>
                        </div>
                    ) : (
                        <div className="category-rail__rating category-rail__rating--new">
                            <span>Nieuw</span>
                        </div>
                    )}

                    <h3 className="category-rail__biz-name">
                        {business.name}
                    </h3>

                    <div className="category-rail__location">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{business.address?.city || "NL"}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default BusinessScrollSection;
