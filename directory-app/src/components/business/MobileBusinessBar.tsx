"use client";

import { Business } from "@/lib/types";
import { Phone, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";
import { trackWhatsAppClick, trackPhoneClick, trackBookingClick } from "@/lib/tracking";

interface MobileBusinessBarProps {
    business: Business;
}

export function MobileBusinessBar({ business }: MobileBusinessBarProps) {
    const phoneDigits = business.contact.phone?.replace(/\D/g, "");
    const whatsappLink = phoneDigits
        ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hoi ${business.name}, ik heb interesse.`)}`
        : null;

    const handlePhoneClick = () => {
        if (business.id) trackPhoneClick(business.id);
    };
    const handleWhatsAppClick = () => {
        if (business.id) trackWhatsAppClick(business.id);
    };
    const handleCtaClick = () => {
        if (business.id) trackBookingClick(business.id);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="flex items-center gap-2 px-3 py-2.5">
                {/* Primary CTA — takes most space */}
                <Link
                    href={business.cta.link}
                    onClick={handleCtaClick}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm py-3 rounded-xl shadow-sm active:scale-95 transition-transform truncate"
                >
                    <span className="truncate">{business.cta.text}</span>
                </Link>

                {/* Phone */}
                {business.contact.phone && (
                    <a
                        href={`tel:${business.contact.phone}`}
                        onClick={handlePhoneClick}
                        aria-label="Bellen"
                        className="flex flex-col items-center justify-center gap-0.5 w-14 h-[50px] rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-transform text-slate-700"
                    >
                        <Phone className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Bel</span>
                    </a>
                )}

                {/* WhatsApp */}
                {whatsappLink && (
                    <a
                        href={whatsappLink}
                        onClick={handleWhatsAppClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="flex flex-col items-center justify-center gap-0.5 w-14 h-[50px] rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-transform text-emerald-700"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-[10px] font-medium">App</span>
                    </a>
                )}

                {/* Website (only if no whatsapp to save space) */}
                {!whatsappLink && business.contact.website && (
                    <a
                        href={business.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Website"
                        className="flex flex-col items-center justify-center gap-0.5 w-14 h-[50px] rounded-xl bg-blue-50 hover:bg-blue-100 active:scale-95 transition-transform text-blue-700"
                    >
                        <Globe className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Site</span>
                    </a>
                )}
            </div>
        </div>
    );
}
