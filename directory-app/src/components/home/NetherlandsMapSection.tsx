"use client";

import Link from "next/link";
import { MapPin, ArrowRight, Sparkles, Building2, ChevronRight, TrendingUp } from "lucide-react";
import { useState } from "react";

// Province color mapping
const PROVINCE_COLORS: Record<string, string> = {
    "noord-holland": "#a855f7",
    "zuid-holland": "#d946ef",
    "utrecht": "#8b5cf6",
    "noord-brabant": "#f59e0b",
    "gelderland": "#6366f1",
    "limburg": "#ef4444",
    "overijssel": "#0ea5e9",
    "groningen": "#06b6d4",
    "friesland": "#14b8a6",
    "drenthe": "#10b981",
    "flevoland": "#3b82f6",
    "zeeland": "#ec4899",
};

// City emoji icons
const CITY_ICONS: Record<string, string> = {
    "amsterdam": "🏙️",
    "rotterdam": "🌉",
    "den-haag": "🏛️",
    "utrecht": "🗼",
    "utrecht-stad": "🗼",
    "eindhoven": "💡",
    "groningen": "🎓",
    "groningen-stad": "🎓",
    "maastricht": "⛰️",
    "arnhem": "🌲",
    "tilburg": "🎭",
    "breda": "🏰",
    "almere": "🏗️",
    "nijmegen": "🌿",
    "enschede": "🏭",
    "haarlem": "🌷",
};

export interface ProvinceData {
    name: string;
    slug: string;
    icon: string;
    cities: string[];
    businessCount: number;
    image?: string;
}

export interface CityData {
    name: string;
    slug: string;
    province: string;
    businessCount: number;
}

interface NetherlandsMapSectionProps {
    provinces: ProvinceData[];
    topCities: CityData[];
    totalBusinesses: number;
}

export function NetherlandsMapSection({ provinces, topCities, totalBusinesses }: NetherlandsMapSectionProps) {
    const [activeProvince, setActiveProvince] = useState<string | null>(null);

    // Sort provinces by business count for display
    const sortedProvinces = [...provinces].sort((a, b) => b.businessCount - a.businessCount);
    const provinceCount = provinces.length;
    const cityCount = topCities.length;

    return (
        <section className="relative overflow-hidden py-8 sm:py-12 md:py-20 px-3 sm:px-4">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100/40 to-teal-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-violet-100/30 to-purple-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

            <div className="container mx-auto max-w-7xl relative">
                {/* Header */}
                <div className="mb-8 sm:mb-12 text-center">
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 border border-emerald-200/50 shadow-sm text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-700">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                        Ontdek Nederland
                    </span>
                    <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                        Vind bedrijven in heel
                        <span className="block sm:inline text-emerald-600"> Nederland</span>
                    </h2>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                        Verken {totalBusinesses.toLocaleString()}+ bedrijven in 12 provincies
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-100 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">
                            {provinceCount}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Provincies</div>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-100 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-600">{cityCount}+</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Steden</div>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-100 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600">
                            {totalBusinesses >= 1000 ? `${(totalBusinesses / 1000).toFixed(1)}K` : totalBusinesses}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Bedrijven</div>
                    </div>
                </div>

                {/* Top Cities - Horizontal Scroll */}
                {topCities.length > 0 && (
                    <div className="mb-8 sm:mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                Populaire Steden
                            </h3>
                            <Link href="/steden" className="text-xs sm:text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1">
                                Alle steden
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {topCities.map((city, index) => (
                                <Link
                                    key={city.slug}
                                    href={`/steden/${city.slug}`}
                                    className="flex-shrink-0 group"
                                >
                                    <div className="relative w-[140px] sm:w-[160px] h-[100px] sm:h-[120px] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        {/* Gradient overlay based on index */}
                                        <div className={`absolute inset-0 opacity-80 bg-gradient-to-br ${index === 0 ? 'from-violet-600 to-purple-700' :
                                            index === 1 ? 'from-emerald-600 to-teal-700' :
                                                index === 2 ? 'from-amber-500 to-orange-600' :
                                                    index === 3 ? 'from-rose-500 to-pink-600' :
                                                        index === 4 ? 'from-blue-500 to-indigo-600' :
                                                            'from-cyan-500 to-teal-600'
                                            }`} />

                                        {/* Content */}
                                        <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between">
                                            <div className="text-2xl sm:text-3xl">
                                                {CITY_ICONS[city.slug] || "🏙️"}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm sm:text-base">{city.name}</h4>
                                                <p className="text-white/70 text-[10px] sm:text-xs">{city.businessCount} bedrijven</p>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Provinces Grid */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">Alle Provincies</h3>
                                <p className="text-[10px] sm:text-xs text-slate-500">Kies een provincie om te verkennen</p>
                            </div>
                        </div>
                        <Link
                            href="/provincies"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors"
                        >
                            Bekijk alle
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Provinces Grid */}
                    <div className="p-3 sm:p-4 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {sortedProvinces.map((province) => {
                                const accent = PROVINCE_COLORS[province.slug] || '#10b981';
                                return (
                                    <Link
                                        key={province.slug}
                                        href={`/provincies/${province.slug}`}
                                        className="group relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[220px] bg-slate-900 shadow-lg shadow-slate-900/10"
                                        onMouseEnter={() => setActiveProvince(province.slug)}
                                        onMouseLeave={() => setActiveProvince(null)}
                                    >
                                        <div className="absolute inset-0">
                                            {province.image ? (
                                                <img
                                                    src={province.image}
                                                    alt={province.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: accent }}>
                                                    <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem00MCA0MGg0MHY0MEg0MHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/20" />
                                                </div>
                                            )}
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    background: `linear-gradient(180deg, ${accent}33 0%, rgba(15,23,42,0.75) 80%, rgba(15,23,42,0.95) 100%)`
                                                }}
                                            />
                                        </div>

                                        <div className="relative p-4 sm:p-5 h-full flex flex-col justify-between">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl font-semibold text-white shadow-md"
                                                    style={{ backgroundColor: accent }}
                                                >
                                                    {province.icon}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 font-semibold">
                                                        Provincie
                                                    </p>
                                                    <h4 className="text-white font-bold text-lg sm:text-xl truncate">
                                                        {province.name}
                                                    </h4>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-white font-semibold text-sm sm:text-base">
                                                        {province.businessCount} bedrijven
                                                    </div>
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white transition-all duration-200 group-hover:bg-white group-hover:text-slate-900"
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {province.cities.slice(0, 3).map((city) => (
                                                        <span
                                                            key={city}
                                                            className="text-[10px] px-2 py-1 rounded-full bg-white/15 text-white/90 border border-white/10 backdrop-blur"
                                                        >
                                                            {city}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile CTA */}
                    <div className="p-3 sm:hidden border-t border-slate-100">
                        <Link
                            href="/provincies"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            <Building2 className="w-4 h-4" />
                            Bekijk alle provincies
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section >
    );
}
