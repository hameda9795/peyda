"use client";

import { Business } from "@/lib/types";
import { Star, MapPin, CheckCircle, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { trackWhatsAppClick, trackPhoneClick, trackBookingClick } from "@/lib/tracking";

interface BusinessHeroProps {
    business: Business;
}

export function BusinessHero({ business }: BusinessHeroProps) {
    const phoneDigits = business.contact.phone?.replace(/\D/g, "");
    const whatsappLink = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hoi ${business.name}, ik heb interesse.`)}` : null;

    const handleWhatsAppClick = () => { if (business.id) trackWhatsAppClick(business.id); };
    const handlePhoneClick = () => { if (business.id) trackPhoneClick(business.id); };
    const handleCtaClick = () => { if (business.id) trackBookingClick(business.id); };

    return (
        <>
            {/* ===================== MOBILE LAYOUT (< md) ===================== */}
            <div className="md:hidden">
                {/* Cover photo strip */}
                <div className="relative w-full h-[200px] bg-slate-200 overflow-hidden">
                    <Image
                        src={business.images.cover || '/images/placeholder-business.jpg'}
                        alt={business.name}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    {/* subtle bottom fade */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/60 to-transparent" />
                </div>

                {/* Info card */}
                <div className="bg-white px-4 pt-3 pb-4 border-b border-slate-100 shadow-sm">
                    <div className="flex items-start gap-3">
                        {/* Logo */}
                        <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden shrink-0 -mt-7 relative z-10">
                            <Image
                                src={business.images.logo || '/images/placeholder-logo.jpg'}
                                alt={`${business.name} logo`}
                                fill
                                sizes="56px"
                                className="object-cover"
                            />
                        </div>

                        {/* Name + badges */}
                        <div className="flex-1 min-w-0 pt-1">
                            {/* Category + verified badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    {business.category}
                                </span>
                                {business.details.status === 'published' && (
                                    <span className="flex items-center gap-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                        <CheckCircle className="w-3 h-3" /> Geverifieerd
                                    </span>
                                )}
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight break-words">
                                {business.name}
                            </h1>
                        </div>
                    </div>

                    {/* Rating + address row */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                            <span className="font-semibold text-slate-900">{business.reviews.average}</span>
                            <span className="text-slate-400 text-xs">({business.reviews.count} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-xs">{business.address.neighborhood}, {business.address.city}</span>
                        </div>
                        {business.details.status === 'published' && (
                            <span className="text-xs font-semibold text-emerald-600">● Nu geopend</span>
                        )}
                    </div>

                    {/* Service area / trust pills (max 2 to save space) */}
                    {(business.serviceArea || (business.reviews.count > 0)) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {business.serviceArea && (
                                <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full max-w-full truncate">
                                    📍 {business.serviceArea}
                                </span>
                            )}
                            {business.reviews.count > 0 && (
                                <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                                    ⭐ {business.reviews.count}+ reviews
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ===================== DESKTOP LAYOUT (≥ md) ===================== */}
            <div className="hidden md:block relative w-full h-[60vh] min-h-[460px] lg:h-[70vh] bg-slate-900 overflow-hidden">
                {/* Cover Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={business.images.cover || '/images/placeholder-business.jpg'}
                        alt={`${business.name} - ${business.category} in ${business.address.city}`}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8 lg:pb-12 text-white">
                    <div className="flex flex-row items-end gap-6 lg:gap-8 w-full">

                        {/* Logo */}
                        <div className="shrink-0">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white/10 bg-white shadow-2xl overflow-hidden relative">
                                <Image
                                    src={business.images.logo || '/images/placeholder-logo.jpg'}
                                    alt={`${business.name} Logo`}
                                    fill
                                    sizes="128px"
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Main Text Info */}
                        <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-emerald-400">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                                    {business.category}
                                </span>
                                {business.details.status === 'published' && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm">
                                        <CheckCircle className="w-3 h-3" /> Geverifieerd
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-sm break-words">
                                {business.name}
                            </h1>

                            <div className="flex flex-row items-center gap-4 text-slate-300 text-sm md:text-base">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-white">{business.reviews.average}</span>
                                    <span className="text-slate-400">({business.reviews.count} reviews)</span>
                                </div>
                                <span className="text-slate-600">•</span>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {business.address.neighborhood}, {business.address.city}
                                </div>
                                {business.details.status === 'published' && (
                                    <span className="text-green-400 font-medium">Nu geopend</span>
                                )}
                            </div>

                            {/* Trust pills */}
                            <div className="flex flex-wrap gap-2 text-xs md:text-sm text-slate-200">
                                {business.serviceArea && (
                                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 max-w-xs truncate">
                                        Bezorging: {business.serviceArea}
                                    </span>
                                )}
                                {business.foundedYear && (
                                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">Sinds {business.foundedYear}</span>
                                )}
                                {business.certifications && business.certifications.length > 0 && (
                                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                                        Gecertificeerd: {business.certifications[0]}
                                    </span>
                                )}
                                {business.reviews.count > 0 && (
                                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                                        {business.reviews.count}+ klantreviews
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 shrink-0">
                            <Link
                                href={business.cta.link}
                                onClick={handleCtaClick}
                                className="flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg text-base whitespace-nowrap"
                            >
                                {business.cta.text}
                            </Link>
                            <div className="flex gap-2">
                                {business.contact.phone && (
                                    <a
                                        href={`tel:${business.contact.phone}`}
                                        onClick={handlePhoneClick}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-white/10 text-white backdrop-blur-sm transition-all"
                                        aria-label="Bel"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>Bel</span>
                                    </a>
                                )}
                                {whatsappLink && (
                                    <a
                                        href={whatsappLink}
                                        onClick={handleWhatsAppClick}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-white/10 text-white backdrop-blur-sm transition-all"
                                        aria-label="WhatsApp"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span>WhatsApp</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

