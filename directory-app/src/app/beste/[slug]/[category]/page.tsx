import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { db } from "@/lib/db";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";
import { Star, MapPin, Phone, Clock, CheckCircle, Award, TrendingUp } from "lucide-react";

type Props = {
    params: Promise<{
        city: string;
        category: string;
    }>;
};

// Helper to find city info
const findCityInfo = (citySlug: string) => {
    for (const province of NETHERLANDS_PROVINCES) {
        const city = province.cities.find(c => c.slug === citySlug);
        if (city) return { city, province };
    }
    return null;
};

// Helper to create slug
const createSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city: citySlug, category: categorySlug } = await params;

    const cityInfo = findCityInfo(citySlug);
    const cityName = cityInfo?.city.name || citySlug.replace(/-/g, ' ');

    // Get category name
    const category = await db.category.findFirst({
        where: {
            slug: {
                contains: categorySlug,
                mode: 'insensitive'
            }
        }
    });

    const categoryName = category?.name?.replace(' in Utrecht', '').replace(' in Nederland', '') || categorySlug.replace(/-/g, ' ');

    const title = `Beste ${categoryName} in ${cityName} - Top 10 Vergelijking 2026`;
    const description = `Vergelijk de beste ${categoryName} in ${cityName}. Bekijk beoordelingen, prijzen en diensten. Vind de perfecte ${categoryName} bij jou in de buurt.`;

    return {
        title,
        description,
        keywords: [
            `beste ${categoryName} ${cityName}`,
            `${categoryName} ${cityName} vergelijken`,
            `top ${categoryName} ${cityName}`,
            `${categoryName} bij mij in de buurt`,
            `${categoryName} ${cityName} reviews`,
            `${categoryName} ${cityName} prijzen`,
            `goede ${categoryName} ${cityName}`,
        ],
        alternates: {
            canonical: `https://peyda.nl/beste/${citySlug}/${categorySlug}`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'nl_NL',
        },
    };
}

export default async function ComparisonPage({ params }: Props) {
    const { city: citySlug, category: categorySlug } = await params;

    const cityInfo = findCityInfo(citySlug);
    const cityName = cityInfo?.city.name || citySlug.replace(/-/g, ' ');
    const provinceName = cityInfo?.province.name || 'Nederland';
    const provinceSlug = cityInfo?.province.slug || 'nederland';

    // Get category
    const category = await db.category.findFirst({
        where: {
            slug: {
                contains: categorySlug,
                mode: 'insensitive'
            }
        },
        include: {
            subcategories: true
        }
    });

    if (!category) {
        notFound();
    }

    const categoryName = category.name?.replace(' in Utrecht', '').replace(' in Nederland', '') || categorySlug;

    // Get top businesses in this city and category
    const businesses = await db.business.findMany({
        where: {
            city: {
                equals: cityName,
                mode: 'insensitive'
            },
            subCategory: {
                categoryId: category.id
            },
            status: 'approved'
        },
        orderBy: [
            { rating: 'desc' },
            { reviewCount: 'desc' }
        ],
        take: 10,
        include: {
            subCategory: {
                include: {
                    category: true
                }
            }
        }
    });

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl';
    const currentUrl = `${BASE_URL}/beste/${citySlug}/${categorySlug}`;

    // JSON-LD Schema - ItemList for comparison
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Beste ${categoryName} in ${cityName}`,
        "description": `Top 10 ${categoryName} bedrijven in ${cityName}, gesorteerd op beoordeling en reviews`,
        "numberOfItems": businesses.length,
        "itemListElement": businesses.map((b: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "LocalBusiness",
                "name": b.name,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": b.street,
                    "addressLocality": b.city,
                    "postalCode": b.postalCode,
                    "addressCountry": "NL"
                },
                "aggregateRating": b.reviewCount > 0 ? {
                    "@type": "AggregateRating",
                    "ratingValue": b.rating,
                    "reviewCount": b.reviewCount,
                    "bestRating": 5,
                    "worstRating": 1
                } : undefined,
                "url": `${BASE_URL}/${provinceSlug}/${citySlug}/${createSlug(b.neighborhood || 'centrum')}/${categorySlug}/${createSlug(b.subCategory?.slug || 'dienst')}/${b.slug}`
            }
        }))
    };

    // JSON-LD Schema - BreadcrumbList
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Beste bedrijven",
                "item": `${BASE_URL}/beste`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": cityName,
                "item": `${BASE_URL}/steden/${citySlug}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": `Beste ${categoryName}`,
                "item": currentUrl
            }
        ]
    };

    // FAQ Schema for the comparison page
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `Wat is de beste ${categoryName} in ${cityName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": businesses.length > 0 && businesses[0].reviewCount > 0
                        ? `Op basis van klantbeoordelingen is ${businesses[0].name} de best beoordeelde ${categoryName} in ${cityName} met een score van ${businesses[0].rating} sterren.`
                        : `Bekijk onze lijst van ${categoryName} bedrijven in ${cityName} om de beste optie voor jou te vinden.`
                }
            },
            {
                "@type": "Question",
                "name": `Hoeveel ${categoryName} bedrijven zijn er in ${cityName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Er zijn ${businesses.length} ${categoryName} bedrijven geregistreerd in ${cityName} op NL Directory.`
                }
            },
            {
                "@type": "Question",
                "name": `Hoe kies ik de juiste ${categoryName} in ${cityName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Let bij het kiezen van een ${categoryName} in ${cityName} op: klantbeoordelingen, locatie, aangeboden diensten, en prijzen. Vergelijk meerdere opties en lees reviews van andere klanten.`
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* JSON-LD Schemas */}
            <Script
                id="itemlist-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Script
                id="faq-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                        <Link href="/" className="hover:text-slate-900">Home</Link>
                        <span>/</span>
                        <Link href="/beste" className="hover:text-slate-900">Beste bedrijven</Link>
                        <span>/</span>
                        <Link href={`/steden/${citySlug}`} className="hover:text-slate-900">{cityName}</Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{categoryName}</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 text-blue-200 mb-4">
                            <Award className="w-5 h-5" />
                            <span>Top 10 Vergelijking 2026</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Beste {categoryName} in {cityName}
                        </h1>
                        <p className="text-xl text-blue-100 mb-6">
                            Vergelijk de {businesses.length} beste {categoryName} bedrijven in {cityName}.
                            Gebaseerd op echte klantbeoordelingen en reviews.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                                <Star className="w-4 h-4 text-yellow-300" />
                                <span>{businesses.length} bedrijven vergeleken</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                                <MapPin className="w-4 h-4" />
                                <span>{cityName}, {provinceName}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                                <TrendingUp className="w-4 h-4" />
                                <span>Laatste update: Februari 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Business List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                            Top {businesses.length} {categoryName} in {cityName}
                        </h2>

                        {businesses.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                                <p className="text-slate-600">
                                    Er zijn nog geen {categoryName} bedrijven geregistreerd in {cityName}.
                                </p>
                                <Link
                                    href="/bedrijf-aanmelden"
                                    className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Eerste bedrijf aanmelden
                                </Link>
                            </div>
                        ) : (
                            businesses.map((business: any, index: number) => {
                                const businessUrl = `/${provinceSlug}/${citySlug}/${createSlug(business.neighborhood || 'centrum')}/${categorySlug}/${createSlug(business.subCategory?.slug?.split('/').pop() || 'dienst')}/${business.slug}`;

                                return (
                                    <article
                                        key={business.id}
                                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Rank Badge */}
                                            <div className="md:w-20 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold">#{index + 1}</div>
                                                    {index === 0 && (
                                                        <div className="text-xs text-yellow-400 mt-1">BESTE</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Business Image */}
                                            <div className="md:w-48 h-48 md:h-auto relative bg-slate-100">
                                                {business.coverImage ? (
                                                    <img
                                                        src={business.coverImage}
                                                        alt={`${business.name} - ${categoryName} in ${cityName}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <span className="text-6xl">{business.name.charAt(0)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Business Info */}
                                            <div className="flex-1 p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <Link href={businessUrl}>
                                                            <h3 className="text-xl font-bold text-slate-800 hover:text-blue-600">
                                                                {business.name}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {business.neighborhood && `${business.neighborhood}, `}{business.city}
                                                        </p>
                                                    </div>

                                                    {/* Rating */}
                                                    <div className="text-right">
                                                        {business.reviewCount > 0 ? (
                                                            <>
                                                                <div className="flex items-center gap-1 text-yellow-500">
                                                                    <Star className="w-5 h-5 fill-current" />
                                                                    <span className="font-bold text-slate-800">
                                                                        {business.rating?.toFixed(1)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-slate-500">
                                                                    {business.reviewCount} reviews
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                                Nog geen reviews
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                                    {business.shortDescription || `${categoryName} diensten in ${business.neighborhood || cityName}`}
                                                </p>

                                                {/* Highlights */}
                                                {business.highlights && business.highlights.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {business.highlights.slice(0, 3).map((highlight: string, i: number) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full"
                                                            >
                                                                <CheckCircle className="w-3 h-3" />
                                                                {highlight}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        href={businessUrl}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                                    >
                                                        Bekijk profiel
                                                    </Link>
                                                    {business.phone && (
                                                        <a
                                                            href={`tel:${business.phone}`}
                                                            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                            Bellen
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">Snelle statistieken</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Totaal bedrijven</span>
                                    <span className="font-bold text-slate-800">{businesses.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Gemiddelde rating</span>
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                        {(() => {
                                            const businessesWithReviews = businesses.filter((b: any) => b.reviewCount > 0);
                                            if (businessesWithReviews.length === 0) return '-';
                                            const avgRating = businessesWithReviews.reduce((acc: number, b: any) => acc + (b.rating || 0), 0) / businessesWithReviews.length;
                                            return (
                                                <>
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    {avgRating.toFixed(1)}
                                                </>
                                            );
                                        })()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Totaal reviews</span>
                                    <span className="font-bold text-slate-800">
                                        {businesses.reduce((acc: number, b: any) => acc + (b.reviewCount || 0), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">Veelgestelde vragen</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-slate-800 text-sm mb-2">
                                        Wat is de beste {categoryName} in {cityName}?
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        {businesses.length > 0
                                            ? `${businesses[0].name} is momenteel de best beoordeelde ${categoryName} in ${cityName}.`
                                            : `Bekijk onze lijst voor de beste ${categoryName} opties.`
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-800 text-sm mb-2">
                                        Hoe worden de rankings bepaald?
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        Rankings zijn gebaseerd op klantbeoordelingen, aantal reviews, en kwaliteit van dienstverlening.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Related Categories */}
                        {category.subcategories && category.subcategories.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-4">Gerelateerde categorieën</h3>
                                <div className="space-y-2">
                                    {category.subcategories.slice(0, 5).map((sub: any) => (
                                        <Link
                                            key={sub.id}
                                            href={`/beste/${citySlug}/${createSlug(sub.name)}`}
                                            className="block text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Beste {sub.name} in {cityName}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                            <h3 className="font-bold mb-2">Jouw bedrijf hier?</h3>
                            <p className="text-sm text-blue-100 mb-4">
                                Meld je bedrijf gratis aan en bereik meer klanten in {cityName}.
                            </p>
                            <Link
                                href="/bedrijf-aanmelden"
                                className="block text-center py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50"
                            >
                                Gratis aanmelden
                            </Link>
                        </div>
                    </aside>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="bg-slate-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto prose prose-slate">
                        <h2>Over {categoryName} in {cityName}</h2>
                        <p>
                            Op zoek naar de beste {categoryName} in {cityName}? Op deze pagina vind je een
                            overzicht van alle {categoryName} bedrijven in {cityName} en omgeving,
                            gesorteerd op basis van klantbeoordelingen en reviews.
                        </p>
                        <h3>Hoe kies je de juiste {categoryName}?</h3>
                        <p>
                            Bij het kiezen van een {categoryName} in {cityName} is het belangrijk om te
                            letten op verschillende factoren: de locatie (hoe dicht bij jou in de buurt),
                            de klantbeoordelingen, de aangeboden diensten, en natuurlijk de prijzen.
                        </p>
                        <h3>{categoryName} bij mij in de buurt</h3>
                        <p>
                            Alle {categoryName} bedrijven op deze pagina zijn gevestigd in {cityName},
                            {provinceName}. Bekijk de profielen voor exacte locaties en contactgegevens.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
