import { BusinessGrid } from "@/components/BusinessGrid";
import { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = {
    title: "Zoeken | Utrecht Business Directory",
    description: "Zoekresultaten voor lokale bedrijven in Utrecht.",
};

type Props = {
    searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = searchParams;
    const query = q?.toLowerCase() || "";

    // Search businesses in database
    const rawResults = query
        ? await db.business.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { shortDescription: { contains: query, mode: 'insensitive' } },
                    { longDescription: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                subCategory: {
                    include: {
                        category: true
                    }
                }
            },
            take: 50
        })
        : [];

    // Map to Business type format
    const results = rawResults.map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        category: b.subCategory.category.name,
        subcategories: [b.subCategory.name],
        tags: b.tags,
        shortDescription: b.shortDescription || '',
        longDescription: b.longDescription || '',
        highlights: (b.highlights as string[]) || [],
        services: (b.services as { name: string; description?: string; price?: string }[]) || [],
        products: [],
        images: {
            logo: b.logo || '/placeholder.jpg',
            cover: b.coverImage || '/placeholder.jpg',
            gallery: (b.gallery as string[]) || []
        },
        videoUrl: b.videoUrl || undefined,
        address: {
            street: b.street || '',
            city: b.city,
            postalCode: b.postalCode || '',
            neighborhood: b.neighborhood || '',
            coordinates: { lat: 0, lng: 0 }
        },
        contact: {
            phone: b.phone || '',
            email: b.email || '',
            website: b.website || '',
            socials: {
                instagram: b.instagram || undefined,
                facebook: b.facebook || undefined,
                linkedin: b.linkedin || undefined
            }
        },
        openingHours: (b.openingHours as any[]) || [],
        paymentMethods: (b.paymentMethods as string[]) || [],
        languages: (b.languages as string[]) || [],
        amenities: (b.amenities as string[]) || [],
        serviceArea: b.serviceArea || '',
        bookingUrl: b.bookingUrl || undefined,
        cta: {
            text: 'Bekijk',
            link: `/utrecht/bedrijf/${b.slug}`,
            type: 'call' as const
        },
        reviews: {
            average: b.rating,
            count: b.reviewCount,
            items: []
        },
        faq: (b.faq as { question: string; answer: string }[]) || [],
        certifications: (b.certifications as string[]) || [],
        kvk: b.kvkNumber || undefined,
        foundedYear: b.foundedYear || undefined,
        details: {
            policies: '',
            lastUpdate: b.updatedAt.toISOString(),
            status: 'published' as const
        },
        seo: {
            title: b.seoTitle || b.name,
            metaDescription: b.seoDescription || b.shortDescription || '',
            h1: b.name,
            keywords: (b.seoKeywords as string[]) || [],
            canonicalUrl: '',
            localSeoText: b.seoLocalText || ''
        }
    }));

    return (
        <div className="min-h-screen bg-zinc-50 py-12">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/20 border border-zinc-200 p-8 mb-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-80" />
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
                            {query ? `Zoekresultaten voor "${q}"` : "Vind wat je zoekt in Utrecht"}
                        </h1>
                        <p className="text-zinc-500 mb-8 max-w-xl mx-auto text-lg">
                            {query
                                ? `${results.length} resultaten gevonden voor jouw zoekopdracht.`
                                : "Voer een zoekterm in om de beste lokale bedrijven te vinden."}
                        </p>

                        <form action="/search" method="GET" className="max-w-2xl mx-auto flex flex-col gap-4">
                            <div className="relative group w-full">
                                <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 rounded-2xl blur-[14px] opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                                <div className="relative flex items-center bg-white border border-zinc-200 rounded-2xl p-1 shadow-xl shadow-indigo-100/30 transition-all duration-300 focus-within:border-indigo-300">
                                    <div className="pl-4 pr-2 flex items-center justify-center">
                                        <SearchIcon className="h-6 w-6 text-zinc-400 focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={q || ""}
                                        placeholder="Bijv. Restaurant, Kapper, Loodgieter..."
                                        className="flex-1 bg-transparent border-none outline-none px-2 text-base md:text-lg text-zinc-900 placeholder:text-zinc-400 h-14 font-medium min-w-0"
                                        autoFocus={!query}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-zinc-900 text-white font-semibold text-base md:text-lg px-8 py-4 rounded-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-zinc-900/10 flex items-center justify-center gap-2"
                            >
                                <span>Zoeken</span>
                            </button>
                        </form>
                    </div>
                </div>

                {results.length > 0 ? (
                    <BusinessGrid
                        businesses={results}
                        title={`Bedrijven matching "${q}"`}
                    />
                ) : (
                    query && (
                        <div className="text-center py-20 bg-white rounded-xl border border-zinc-200 border-dashed">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                                <SearchIcon className="h-8 w-8" />
                            </div>
                            <h2 className="text-xl font-semibold text-zinc-900 mb-2">Geen resultaten gevonden</h2>
                            <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                                We konden geen bedrijven vinden die matchen met "{q}". Probeer een andere zoekterm of blader door de categorieën.
                            </p>
                            <Link
                                href="/categorieen"
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Bekijk alle categorieën
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
