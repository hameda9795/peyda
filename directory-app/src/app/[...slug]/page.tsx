import { getBusinessBySlug } from "@/lib/actions/business";
import { BusinessHero } from "@/components/business/BusinessHero";
import { BusinessInfoSidebar } from "@/components/business/BusinessInfoSidebar";
import { BusinessContent } from "@/components/business/BusinessContent";
import { MobileBusinessBar } from "@/components/business/MobileBusinessBar";
import { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
    params: Promise<{
        slug: string[];
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug  } = await params;

    const businessSlug = slug[slug.length - 1];
    const business = await getBusinessBySlug(businessSlug);

    if (!business) {
        return {
            title: 'Pagina niet gevonden',
        };
    }

    const title = (business.seo.title || `${business.name} – ${business.category} in ${business.address.city}`).trim();
    const description = (business.seo.metaDescription || business.shortDescription || `${business.category} in ${business.address.city}`).trim();
    const canonical = business.seo.canonicalUrl || `/${slug.join('/')}`;
    const ogImage = business.images.cover || business.images.logo || '';
    const ogAlt = `${business.name} in ${business.address.city} ${business.address.neighborhood}`;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            images: ogImage ? [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: ogAlt,
                }
            ] : undefined,
            locale: 'nl_NL',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        }
    };
}

export default async function CatchAllPage({ params }: Props) {
    const { slug  } = await params;

    // The business slug is always the last segment
    const businessSlug = slug[slug.length - 1];
    const business = await getBusinessBySlug(businessSlug);

    if (!business) {
        notFound();
    }

    // Extract location info from URL segments if available
    // Expected: [province, city, neighborhood, category, subcategory, business]
    // But can handle any number of segments
    const province = slug[0] || 'nederland';
    const city = slug[1] || business.address.city.toLowerCase().replace(/\s+/g, '-');
    const neighborhood = slug[2] || (business.address.neighborhood || 'centrum').toLowerCase().replace(/\s+/g, '-');
    const category = slug[3] || business.category.toLowerCase().replace(/\s+/g, '-');

    // JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "image": business.images.gallery,
        "@id": business.seo.canonicalUrl,
        "url": business.contact.website,
        "telephone": business.contact.phone,
        "priceRange": "€€",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": business.address.street,
            "addressLocality": business.address.city,
            "postalCode": business.address.postalCode,
            "addressCountry": "NL"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": business.address.coordinates.lat,
            "longitude": business.address.coordinates.lng
        },
        "openingHoursSpecification": business.openingHours.map(h => ({
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": h.day,
            "opens": h.open,
            "closes": h.close
        })),
        "sameAs": [
            business.contact.socials.facebook,
            business.contact.socials.instagram,
            business.contact.socials.linkedin,
            business.contact.socials.twitter
        ].filter(Boolean)
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
            <Script
                id="business-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-1.5 text-sm text-slate-500 overflow-x-auto whitespace-nowrap pb-0.5 scrollbar-hide">
                        <Link href="/" className="hover:text-slate-900 shrink-0">Home</Link>
                        <span className="shrink-0">/</span>
                        <Link href={`/provincies/${province}`} className="hover:text-slate-900 capitalize shrink-0">
                            {decodeURIComponent(province)}
                        </Link>
                        <span className="shrink-0">/</span>
                        <Link href={`/steden/${city}`} className="hover:text-slate-900 capitalize shrink-0">
                            {decodeURIComponent(city).replace(/-/g, ' ')}
                        </Link>
                        <span className="shrink-0">/</span>
                        <Link href={`/wijken/${city}/${neighborhood}`} className="hover:text-slate-900 capitalize shrink-0">
                            {decodeURIComponent(neighborhood).replace(/-/g, ' ')}
                        </Link>
                        <span className="shrink-0">/</span>
                        <Link href={`/categorieen/${category}`} className="hover:text-slate-900 capitalize shrink-0">
                            {decodeURIComponent(category).replace(/-/g, ' ')}
                        </Link>
                        <span className="shrink-0">/</span>
                        <span className="text-slate-900 font-medium">{business.name}</span>
                    </nav>
                </div>
            </div>

            <BusinessHero business={business} />

            <div className="container mx-auto px-4 mt-0 md:-mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content Column */}
                    <main className="flex-1 bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-10 border border-slate-100 min-h-[500px]">
                        <BusinessContent business={business} />
                    </main>

                    {/* Sticky Sidebar Column */}
                    <aside className="lg:w-[380px] shrink-0 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <BusinessInfoSidebar business={business} />
                        </div>
                    </aside>

                </div>
            </div>

            {/* Footer Navigation */}
            <div className="container mx-auto px-4 mt-16 text-center">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">NL Business Directory</h3>
                <div className="flex justify-center gap-4 text-sm text-slate-500 flex-wrap">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span>•</span>
                    <Link href={`/categorieen/${category}`} className="hover:text-blue-600">{business.category}</Link>
                    <span>•</span>
                    <Link href={`/wijken/${city}/${neighborhood}`} className="hover:text-blue-600">{business.address.neighborhood}</Link>
                    <span>•</span>
                    <Link href={`/steden/${city}`} className="hover:text-blue-600">{business.address.city}</Link>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <MobileBusinessBar business={business} />
        </div>
    );
}
