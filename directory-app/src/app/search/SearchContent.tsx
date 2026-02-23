"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, 
    Filter, 
    MapPin, 
    Star, 
    TrendingUp, 
    Clock, 
    MessageSquare,
    ArrowRight,
    Building2,
    Sparkles,
    X,
    SlidersHorizontal,
    Grid3X3,
    List,
    ChevronDown,
    Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Business } from "@/lib/types";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface SearchContentProps {
    initialQuery: string;
    initialCategory: string;
    initialSort: string;
    results: Business[];
    categories: Category[];
    totalCount: number;
}

const sortOptions = [
    { value: "relevance", label: "Relevantie", icon: Sparkles },
    { value: "rating", label: "Best beoordeeld", icon: Star },
    { value: "reviews", label: "Meeste reviews", icon: MessageSquare },
    { value: "newest", label: "Nieuwste", icon: Clock },
];

const quickFilters = [
    { label: "Restaurant", icon: "🍽️" },
    { label: "Kapper", icon: "💈" },
    { label: "Loodgieter", icon: "🔧" },
    { label: "Tandarts", icon: "🦷" },
    { label: "Fysio", icon: "💪" },
    { label: "Advocaat", icon: "⚖️" },
];

export function SearchContent({ 
    initialQuery, 
    initialCategory,
    initialSort,
    results, 
    categories,
    totalCount 
}: SearchContentProps) {
    const [query, setQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedSort, setSelectedSort] = useState(initialSort);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isSearching, setIsSearching] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update query when initialQuery changes
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    // Simulate search loading state
    const handleSearch = () => {
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (selectedSort !== "relevance") params.set("sort", selectedSort);
        window.location.href = `/search?${params.toString()}`;
    };

    const clearFilters = () => {
        setQuery("");
        setSelectedCategory("all");
        setSelectedSort("relevance");
        window.location.href = "/search";
    };

    const hasActiveFilters = query || selectedCategory !== "all" || selectedSort !== "relevance";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10">
                {/* Hero Search Section */}
                <section className="relative pt-16 pb-12 px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Title */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-10"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-indigo-100 mb-6"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-medium text-slate-600">
                                    Ontdek {totalCount}+ lokale bedrijven
                                </span>
                            </motion.div>
                            
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                {initialQuery ? (
                                    <span className="flex items-center justify-center gap-3 flex-wrap">
                                        <span>Zoekresultaten voor</span>
                                        <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                                            &ldquo;{initialQuery}&rdquo;
                                        </span>
                                    </span>
                                ) : (
                                    <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-emerald-700 bg-clip-text text-transparent">
                                        Vind wat je zoekt in Utrecht
                                    </span>
                                )}
                            </h1>
                            
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                                {initialQuery 
                                    ? `${results.length} bedrijven gevonden die matchen met jouw zoekopdracht`
                                    : "Zoek door duizenden lokale bedrijven, diensten en winkels in jouw buurt"
                                }
                            </p>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="relative max-w-3xl mx-auto"
                        >
                            <div className={`relative group transition-all duration-500 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                                {/* Glow Effect */}
                                <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 rounded-3xl blur-xl opacity-0 transition-opacity duration-500 ${searchFocused ? 'opacity-30' : 'group-hover:opacity-20'}`} />
                                
                                {/* Search Input Container */}
                                <div className="relative bg-white rounded-2xl shadow-2xl shadow-indigo-100/50 border border-slate-200/60 overflow-hidden">
                                    <div className="flex items-center p-2">
                                        <div className="pl-4 pr-3">
                                            {isSearching ? (
                                                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                                            ) : (
                                                <Search className="w-6 h-6 text-slate-400" />
                                            )}
                                        </div>
                                        
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onFocus={() => setSearchFocused(true)}
                                            onBlur={() => setSearchFocused(false)}
                                            placeholder="Zoek op naam, categorie, of dienst..."
                                            className="flex-1 bg-transparent border-none outline-none py-4 text-lg text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                        
                                        {query && (
                                            <button
                                                type="button"
                                                onClick={() => setQuery("")}
                                                className="p-2 mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                        
                                        <button
                                            type="submit"
                                            className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                                        >
                                            <span>Zoeken</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {/* Mobile Search Button */}
                                    <button
                                        type="submit"
                                        className="md:hidden w-full bg-slate-900 text-white py-3 font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Search className="w-5 h-5" />
                                        <span>Zoeken</span>
                                    </button>
                                </div>
                            </div>

                            {/* Quick Filters */}
                            {!query && mounted && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-wrap justify-center gap-2 mt-6"
                                >
                                    <span className="text-sm text-slate-400 py-2">Populair:</span>
                                    {quickFilters.map((filter) => (
                                        <button
                                            key={filter.label}
                                            type="button"
                                            onClick={() => {
                                                setQuery(filter.label);
                                                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                                            }}
                                            className="px-4 py-2 bg-white/80 hover:bg-white border border-slate-200/60 hover:border-indigo-300 rounded-full text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                                        >
                                            <span className="mr-1">{filter.icon}</span>
                                            {filter.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </motion.form>
                    </div>
                </section>

                {/* Filters & Results Section */}
                <section className="px-4 pb-20">
                    <div className="max-w-7xl mx-auto">
                        {/* Filter Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="sticky top-4 z-30 mb-8"
                        >
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    {/* Left Side - Filters */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {/* Category Dropdown */}
                                        <div className="relative">
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                                                }}
                                                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                                            >
                                                <option value="all">Alle categorieën</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.slug}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>

                                        {/* Sort Dropdown */}
                                        <div className="relative">
                                            <select
                                                value={selectedSort}
                                                onChange={(e) => {
                                                    setSelectedSort(e.target.value);
                                                    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                                                }}
                                                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                                            >
                                                {sortOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>

                                        {/* Clear Filters */}
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-2.5"
                                            >
                                                <X className="w-4 h-4" />
                                                Wis filters
                                            </button>
                                        )}
                                    </div>

                                    {/* Right Side - View Toggle & Count */}
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-slate-500 hidden sm:block">
                                            <span className="font-semibold text-slate-900">{results.length}</span> resultaten
                                        </span>
                                        
                                        {/* View Mode Toggle */}
                                        <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                            <button
                                                onClick={() => setViewMode("grid")}
                                                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
                                            >
                                                <Grid3X3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode("list")}
                                                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
                                            >
                                                <List className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Results */}
                        <AnimatePresence mode="wait">
                            {results.length > 0 ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={viewMode === "grid" 
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                        : "flex flex-col gap-4"
                                    }
                                >
                                    {results.map((business, index) => (
                                        <BusinessCard 
                                            key={business.id} 
                                            business={business} 
                                            index={index}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center py-20"
                                >
                                    <EmptyState query={initialQuery} onClear={clearFilters} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </div>
        </div>
    );
}

// Business Card Component
function BusinessCard({ 
    business, 
    index,
    viewMode 
}: { 
    business: Business; 
    index: number;
    viewMode: "grid" | "list";
}) {
    const isGrid = viewMode === "grid";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                delay: index * 0.05,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-indigo-300/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ${
                isGrid ? "" : "flex flex-col sm:flex-row"
            }`}
        >
            {/* Image */}
            <div className={`relative overflow-hidden bg-slate-100 ${
                isGrid ? "aspect-[4/3]" : "sm:w-64 aspect-[4/3] sm:aspect-auto"
            }`}>
                <Image
                    src={business.images.cover || '/images/placeholder-business.jpg'}
                    alt={business.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes={isGrid ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" : "300px"}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-800">{business.reviews.average}</span>
                    <span className="text-xs text-slate-500">({business.reviews.count})</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                        {business.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className={`p-5 flex-1 flex flex-col ${isGrid ? "" : "sm:py-6"}`}>
                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {business.name}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                    {business.shortDescription}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{business.address.city}</span>
                    {business.address.neighborhood && (
                        <>
                            <span className="text-slate-300">•</span>
                            <span className="truncate text-slate-400">{business.address.neighborhood}</span>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                        {business.subcategories[0]}
                    </span>
                    
                    <Link 
                        href={`/utrecht/bedrijf/${business.slug}`}
                        className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group/link"
                    >
                        <span>Bekijk</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

// Empty State Component
function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
    return (
        <div className="max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <Search className="w-12 h-12 text-slate-400" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">
                Geen resultaten gevonden
            </h3>
            
            <p className="text-slate-500 mb-8">
                We konden geen bedrijven vinden die matchen met &ldquo;{query}&rdquo;. 
                Probeer een andere zoekterm of verander je filters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={onClear}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                >
                    <X className="w-4 h-4" />
                    Wis alle filters
                </button>
                
                <Link
                    href="/categorieen"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all hover:border-slate-300"
                >
                    <Building2 className="w-4 h-4" />
                    Bekijk categorieën
                </Link>
            </div>
        </div>
    );
}
