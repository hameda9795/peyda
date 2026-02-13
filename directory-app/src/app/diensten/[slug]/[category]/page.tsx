import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { MapPin, Star, Phone, Globe, ChevronRight, Building2 } from "lucide-react";
import {
    getCityBySlug,
    getCategoryBySlug,
    getBusinessesByCityAndCategory,
    getBusinessCountByCityAndCategory
} from "@/lib/actions/location-service";

type Props = {
    params: Promise<{
        city: string;
        category: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city: citySlug, category: categorySlug } = await params;

    const [city, category] = await Promise.all([
        getCityBySlug(citySlug),
        getCategoryBySlug(categorySlug)
    ]);

    if (!city || !category) {
        return { title: 'Pagina niet gevonden' };
    }

    const title = `${category.name} in ${city.name} - Vind de beste ${category.name.toLowerCase()} | NL Directory`;
    const description = `Ontdek de beste ${category.name.toLowerCase()} in ${city.name}, ${city.province.name}. Bekijk beoordelingen, openingstijden en contactgegevens van lokale bedrijven.`;

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nldirectory.nl';

    return {
        title,
        description,
        alternates: {
            canonical: `${BASE_URL}/diensten/${citySlug}/${categorySlug}`
        },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/diensten/${citySlug}/${categorySlug}`,
            locale: 'nl_NL',
            type: 'website',
        },
        keywords: [
            `${category.name} ${city.name}`,
            `${category.name.toLowerCase()} in ${city.name}`,
            `beste ${category.name.toLowerCase()} ${city.name}`,
            `${category.name.toLowerCase()} ${city.province.name}`,
            category.name,
            city.name,
        ]
    };
}

export default async function CityServicePage({ params }: Props) {
    const { city: citySlug, category: categorySlug } = await params;

    const [city, category, businesses, totalCount] = await Promise.all([
        getCityBySlug(citySlug),
        getCategoryBySlug(categorySlug),
        getBusinessesByCityAndCategory(citySlug, categorySlug, 20),
        getBusinessCountByCityAndCategory(citySlug, categorySlug)
    ]);

    if (!city || !category) {
        notFound();
    }

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nldirectory.nl';
    const currentUrl = `${BASE_URL}/diensten/${citySlug}/${categorySlug}`;

    // JSON-LD Schema - ItemList
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `${category.name} in ${city.name}`,
        "description": `Lijst van ${category.name.toLowerCase()} in ${city.name}`,
        "numberOfItems": businesses.length,
        "itemListElement": businesses.map((business, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "LocalBusiness",
                "name": business.name,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": business.address.city,
                    "addressRegion": city.province.name,
                    "addressCountry": "NL"
                },
                "url": `${BASE_URL}/${business.provinceSlug}/${business.citySlug}/${business.neighborhoodSlug}/${business.categorySlug}/${business.subcategorySlug}/${business.slug}`,
                ...(business.rating > 0 && {
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": business.rating,
                        "reviewCount": business.reviewCount || 1
                    }
                })
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
                "name": "Diensten",
                "item": `${BASE_URL}/diensten`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": city.name,
                "item": `${BASE_URL}/steden/${citySlug}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": category.name,
                "item": currentUrl
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
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

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href={`/steden/${citySlug}`} className="hover:text-white transition-colors">
                            {city.name}
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">{category.name}</span>
                    </nav>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-4">
                            {category.icon && (
                                <span className="text-4xl">{category.icon}</span>
                            )}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                {category.name} in {city.name}
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-slate-300 mb-6">
                            Vind de beste {category.name.toLowerCase()} in {city.name}, {city.province.name}.
                            Vergelijk beoordelingen, bekijk openingstijden en vind het perfecte bedrijf voor jouw behoeften.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                <span className="font-semibold">{totalCount}</span>
                                <span className="text-slate-400">bedrijven gevonden</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-400" />
                                <span className="text-slate-400">{city.province.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subcategories Filter */}
            {category.subcategories.length > 0 && (
                <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
                            <span className="text-sm font-medium text-slate-500 shrink-0">Filter:</span>
                            {category.subcategories.slice(0, 8).map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/categorieen/${categorySlug}/${sub.slug}`}
                                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-sm font-medium text-slate-700 whitespace-nowrap transition-colors"
                                >
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Business Listings */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                {businesses.length > 0 ? (
                    <div className="grid gap-6">
                        {businesses.map((business) => {
                            const businessUrl = `/${business.provinceSlug}/${business.citySlug}/${business.neighborhoodSlug}/${business.categorySlug}/${business.subcategorySlug}/${business.slug}`;

                            return (
                                <Link
                                    key={business.id}
                                    href={businessUrl}
                                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 bg-slate-100">
                                            <Image
                                                src={business.images.cover || '/images/placeholder-business.svg'}
                                                alt={`${business.name} - ${category.name} in ${city.name}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 256px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            {business.images.logo && (
                                                <div className="absolute bottom-3 left-3 w-12 h-12 rounded-lg bg-white shadow-lg overflow-hidden">
                                                    <Image
                                                        src={business.images.logo}
                                                        alt={business.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-5 md:p-6">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {business.name}
                                                    </h2>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>
                                                            {business.address.neighborhood ? `${business.address.neighborhood}, ` : ''}
                                                            {business.address.city}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg shrink-0">
                                                    <Star className="w-4 h-4 text-emerald-600 fill-current" />
                                                    <span className="font-bold text-emerald-700">{business.rating.toFixed(1)}</span>
                                                    {business.reviewCount > 0 && (
                                                        <span className="text-emerald-600 text-sm">({business.reviewCount})</span>
                                                    )}
                                                </div>
                                            </div>

                                            {business.shortDescription && (
                                                <p className="text-slate-600 line-clamp-2 mb-4">
                                                    {business.shortDescription}
                                                </p>
                                            )}

                                            {/* Contact Info */}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                {business.contact.phone && (
                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{business.contact.phone}</span>
                                                    </div>
                                                )}
                                                {business.contact.website && (
                                                    <div className="flex items-center gap-1.5 text-blue-600">
                                                        <Globe className="w-4 h-4" />
                                                        <span>Website</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            Geen {category.name.toLowerCase()} gevonden
                        </h2>
                        <p className="text-slate-500 mb-6">
                            Er zijn momenteel geen {category.name.toLowerCase()} geregistreerd in {city.name}.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href={`/categorieen/${categorySlug}`}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                            >
                                Bekijk alle {category.name}
                            </Link>
                            <Link
                                href={`/steden/${citySlug}`}
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                            >
                                Alle bedrijven in {city.name}
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* SEO Content */}
            <section className="bg-white border-t border-slate-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto prose prose-slate">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            {category.name} in {city.name} vinden
                        </h2>
                        <p className="text-slate-600">
                            Op zoek naar {category.name.toLowerCase()} in {city.name}? NL Directory helpt je de beste
                            lokale bedrijven te vinden in {city.province.name}. Bekijk beoordelingen van andere klanten,
                            vergelijk diensten en vind direct contactgegevens en openingstijden.
                        </p>
                        <p className="text-slate-600">
                            {city.name} is een van de belangrijke steden in {city.province.name} met een breed aanbod
                            aan {category.name.toLowerCase()}. Of je nu op zoek bent naar een nieuwe dienstverlener of
                            het beste bedrijf in de buurt wilt vinden, wij helpen je de juiste keuze te maken.
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Links */}
            <section className="bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4 py-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
                        Ontdek meer
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href={`/steden/${citySlug}`}
                            className="px-5 py-2.5 bg-white rounded-full border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                            Alle bedrijven in {city.name}
                        </Link>
                        <Link
                            href={`/categorieen/${categorySlug}`}
                            className="px-5 py-2.5 bg-white rounded-full border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                            Alle {category.name} in Nederland
                        </Link>
                        <Link
                            href={`/provincies/${city.province.slug}`}
                            className="px-5 py-2.5 bg-white rounded-full border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                            {city.province.name}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
