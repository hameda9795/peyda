"use client";

import { Business } from "@/lib/types";
import { Star, MapPin, CheckCircle, Share2, Heart, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { trackWhatsAppClick, trackPhoneClick, trackBookingClick } from "@/lib/tracking";

interface BusinessHeroProps {
    business: Business;
}

export function BusinessHero({ business }: BusinessHeroProps) {
    const phoneDigits = business.contact.phone?.replace(/\D/g, "");
    const whatsappLink = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hoi ${business.name}, ik heb interesse.`)}` : null;

    const handleWhatsAppClick = () => {
        if (business.id) {
            trackWhatsAppClick(business.id);
        }
    };

    const handlePhoneClick = () => {
        if (business.id) {
            trackPhoneClick(business.id);
        }
    };

    const handleCtaClick = () => {
        if (business.id) {
            trackBookingClick(business.id);
        }
    };

    return (
        <div className="relative w-full h-[60vh] min-h-[500px] lg:h-[70vh] bg-slate-900 overflow-hidden">
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
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-4 sm:pb-8 lg:pb-12 text-white">
                <div className="flex flex-col md:flex-row items-start md:items-end lg:items-center gap-4 md:gap-6 lg:gap-8 w-full">

                    {/* Logo (floating) */}
                    <div className="relative -mb-2 sm:-mb-4 md:mb-0 shrink-0 order-1">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl border-4 border-white/10 bg-white shadow-2xl overflow-hidden relative">
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
                    <div className="flex-1 space-y-2 sm:space-y-3 w-full min-w-0 order-2 md:order-1">
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

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-sm break-words">
                            {business.name}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-300 text-sm md:text-base">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold text-white">{business.reviews.average}</span>
                                <span className="text-slate-400">({business.reviews.count} reviews)</span>
                            </div>

                            <span className="hidden sm:inline text-slate-600">•</span>

                            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                                <MapPin className="w-4 h-4" />
                                {business.address.neighborhood}, {business.address.city}
                            </div>

                            {business.details.status === 'published' && (
                                <span className="hidden sm:inline text-green-400 font-medium ml-auto sm:ml-0">
                                    Nu geopend
                                </span>
                            )}
                        </div>

                        {/* Trust / proof row */}
                        <div className="flex flex-wrap gap-2 text-xs md:text-sm text-slate-200 mt-2 max-w-full">
                            {business.serviceArea && (
                                <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 line-clamp-2 sm:line-clamp-1 max-w-full">
                                    Bezorging: {business.serviceArea}
                                </span>
                            )}
                            {business.foundedYear ? (
                                <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">Sinds {business.foundedYear}</span>
                            ) : null}
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
                    <div className="flex flex-wrap sm:flex-row md:flex-col gap-2 sm:gap-3 w-full md:w-auto mt-3 sm:mt-4 md:mt-0 order-3">
                        <Link
                            href={business.cta.link}
                            onClick={handleCtaClick}
                            className="flex-1 sm:flex-initial md:flex-none flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all shadow-lg shadow-white/10 text-sm sm:text-base whitespace-nowrap min-w-0"
                        >
                            <span className="truncate">{business.cta.text}</span>
                        </Link>
                        <div className="flex gap-2 flex-1 sm:flex-initial justify-end">
                            {business.contact.phone && (
                                <a
                                    href={`tel:${business.contact.phone}`}
                                    onClick={handlePhoneClick}
                                    className="flex-1 sm:flex-initial md:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-white/10 text-white backdrop-blur-sm transition-all min-w-[60px] sm:min-w-0"
                                    aria-label="Bel"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span className="hidden sm:inline md:hidden lg:inline">Bel</span>
                                </a>
                            )}
                            {whatsappLink && (
                                <a
                                    href={whatsappLink}
                                    onClick={handleWhatsAppClick}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 sm:flex-initial md:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-white/10 text-white backdrop-blur-sm transition-all min-w-[60px] sm:min-w-0"
                                    aria-label="WhatsApp"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="hidden sm:inline md:hidden lg:inline">WhatsApp</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
