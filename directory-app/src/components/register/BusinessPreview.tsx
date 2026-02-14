
'use client';

import { useState, useEffect } from 'react';
import { Business } from '@/lib/types';
import { BusinessFormData } from '@/lib/types/business-form';
import { BusinessHero } from "@/components/business/BusinessHero";
import { BusinessInfoSidebar } from "@/components/business/BusinessInfoSidebar";
import { BusinessContent } from "@/components/business/BusinessContent";
import { ArrowLeft, Check, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

interface BusinessPreviewProps {
    formData: BusinessFormData;
    aiData: any;
    onBack: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    error: string | null;
}

export function BusinessPreview({ formData, aiData, onBack, onConfirm, isSubmitting, error }: BusinessPreviewProps) {
    const [previewBusiness, setPreviewBusiness] = useState<Business | null>(null);

    useEffect(() => {
        if (!formData || !aiData) return;

        // Create Object URLs for images
        const logoUrl = formData.logo ? URL.createObjectURL(formData.logo) : '';
        const coverUrl = formData.coverImage ? URL.createObjectURL(formData.coverImage) : '';
        const galleryUrls = formData.gallery.map(file => URL.createObjectURL(file));
        const manualFaq = (formData.faq || []).filter(f => f.question && f.answer);
        const mergedFaq = manualFaq.length ? manualFaq : (aiData.faq || []);

        const business: Business = {
            id: 'preview',
            name: formData.name,
            slug: 'preview-slug',
            category: formData.category,
            subcategories: formData.subcategories,
            tags: aiData.seo?.tags || aiData.seo?.keywords || [],
            shortDescription: aiData.shortDescription || formData.shortDescription,
            longDescription: aiData.longDescription || formData.shortDescription, // Using AI HTML content
            highlights: aiData.highlights || [],

            services: formData.services,

            images: {
                logo: logoUrl || 'https://via.placeholder.com/150', // Fallback
                cover: coverUrl || 'https://via.placeholder.com/1920x600', // Fallback
                gallery: galleryUrls.length > 0 ? galleryUrls : ['https://via.placeholder.com/800x600'],
            },

            address: {
                street: formData.street,
                city: formData.city,
                postalCode: formData.postalCode,
                neighborhood: formData.neighborhood,
                province: formData.province,
                coordinates: { lat: 52.0907, lng: 5.1214 } // Mock coordinates - could be enhanced with geocoding
            },

            contact: {
                phone: formData.phone,
                email: formData.email,
                website: formData.website,
                socials: {
                    instagram: formData.instagram,
                    facebook: formData.facebook,
                    linkedin: formData.linkedin,
                }
            },

            openingHours: formData.openingHours,
            paymentMethods: formData.paymentMethods,
            languages: formData.languages,
            amenities: formData.amenities,
            serviceArea: formData.serviceArea,
            bookingUrl: formData.bookingUrl,

            cta: {
                text: formData.ctaType === 'booking' ? 'Nu Boeken' : formData.ctaType === 'quote' ? 'Offerte Aanvragen' : 'Contact Opnemen',
                link: formData.bookingUrl || `tel:${formData.phone}`,
                type: formData.ctaType
            },

            reviews: {
                average: 0,
                count: 0,
                items: []
            },

            faq: mergedFaq,
            certifications: formData.certifications,
            kvk: formData.kvkNumber,
            foundedYear: parseInt(formData.foundedYear) || new Date().getFullYear(),

            details: {
                policies: '',
                lastUpdate: new Date().toLocaleDateString('nl-NL'),
                status: 'draft'
            },

            seo: aiData.seo || {
                title: '',
                metaDescription: '',
                h1: '',
                keywords: [],
                canonicalUrl: '',
                localSeoText: ''
            }
        };

        setPreviewBusiness(business);

        // Cleanup
        return () => {
            if (logoUrl) URL.revokeObjectURL(logoUrl);
            if (coverUrl) URL.revokeObjectURL(coverUrl);
            galleryUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [formData, aiData]);

    if (!previewBusiness) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-slate-500">Preview genereren...</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
            {/* Control Bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className="font-bold text-slate-900">Voorbeeld Bedrijfspagina</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>Premium Preview</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 mr-2">
                        <AlertTriangle className="w-3 h-3 mr-1.5" />
                        Dit is een voorbeeld. Sommige elementen kunnen afwijken.
                    </div>

                    {error && (
                        <div className="text-xs text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 max-w-[200px] truncate" title={error}>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="ml-2">Publiceren...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span className="ml-2">Publiceer Pagina</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Preview Content */}
            <div className="pointer-events-none select-none"> {/* Disable interaction inside preview generally to avoid navigation, but maybe allow scrolling */}
                <div className="pointer-events-auto">
                    <BusinessHero business={previewBusiness} />

                    <div className="container mx-auto px-4 -mt-8 relative z-20 pb-20">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <main className="flex-1 bg-white rounded-xl shadow-xl p-6 md:p-10 border border-slate-100 min-h-[500px]">
                                <BusinessContent business={previewBusiness} />
                            </main>
                            <aside className="lg:w-[380px] shrink-0 space-y-6">
                                <div className="sticky top-24 space-y-6">
                                    <BusinessInfoSidebar business={previewBusiness} />
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
