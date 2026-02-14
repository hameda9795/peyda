import { getBusinessBySlug, getRelatedBusinessesBySlug } from "@/lib/actions/business";
import { BusinessHero } from "@/components/business/BusinessHero";
import { BusinessInfoSidebar } from "@/components/business/BusinessInfoSidebar";
import { BusinessContent } from "@/components/business/BusinessContent";
import { RelatedBusinesses } from "@/components/business/RelatedBusinesses";
import { TrackPageView } from "@/components/business/TrackPageView";
import { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
    params: Promise<{
        province: string;
        city: string;
        neighborhood: string;
        category: string;
        subcategory: string;
        business: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { business: slug } = await params;
    const business = await getBusinessBySlug(slug);

    if (!business) {
        return {
            title: 'Bedrijf niet gevonden',
        };
    }

    return {
        title: business.seo.title,
        description: business.seo.metaDescription,
        alternates: {
            canonical: business.seo.canonicalUrl,
        },
        openGraph: {
            title: business.seo.title,
            description: business.seo.metaDescription,
            url: business.seo.canonicalUrl,
            images: [
                {
                    url: business.images.cover,
                    width: 1200,
                    height: 630,
                    alt: business.name,
                }
            ],
            locale: 'nl_NL',
            type: 'website',
        }
    };
}

export default async function BusinessPage({ params }: Props) {
    const resolvedParams = await params;
    const {
        province,
        city,
        neighborhood,
        category,
        subcategory,
        business: slug
    } = resolvedParams;

    const [business, relatedBusinesses] = await Promise.all([
        getBusinessBySlug(slug),
        getRelatedBusinessesBySlug(slug, 4)
    ]);

    if (!business) {
        notFound();
    }

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nldirectory.nl';
    const currentUrl = `${BASE_URL}/${province}/${city}/${neighborhood}/${category}/${subcategory}/${slug}`;

    // JSON-LD Schema - LocalBusiness
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "image": business.images.gallery,
        "@id": currentUrl,
        "url": business.contact.website || currentUrl,
        "telephone": business.contact.phone,
        "priceRange": "€€",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": business.address.street,
            "addressLocality": business.address.city,
            "postalCode": business.address.postalCode,
            "addressRegion": province,
            "addressCountry": "NL"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": business.address.coordinates.lat,
            "longitude": business.address.coordinates.lng
        },
        "openingHoursSpecification": business.openingHours?.map(h => ({
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": h.day,
            "opens": h.open,
            "closes": h.close
        })) || [],
        ...(business.reviews.count > 0 && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": business.reviews.average,
                "reviewCount": business.reviews.count,
                "bestRating": 5,
                "worstRating": 1
            }
        }),
        "sameAs": [
            business.contact.socials.facebook,
            business.contact.socials.instagram,
            business.contact.socials.linkedin,
            business.contact.socials.twitter
        ].filter(Boolean)
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
                "name": decodeURIComponent(province).replace(/-/g, ' '),
                "item": `${BASE_URL}/provincies/${province}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": decodeURIComponent(city).replace(/-/g, ' '),
                "item": `${BASE_URL}/steden/${city}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": decodeURIComponent(neighborhood).replace(/-/g, ' '),
                "item": `${BASE_URL}/wijken/${city}/${neighborhood}`
            },
            {
                "@type": "ListItem",
                "position": 5,
                "name": decodeURIComponent(category).replace(/-/g, ' '),
                "item": `${BASE_URL}/categorieen/${category}`
            },
            {
                "@type": "ListItem",
                "position": 6,
                "name": business.name,
                "item": currentUrl
            }
        ]
    };

    // JSON-LD Schema - FAQPage (if FAQ exists)
    const faqSchema = business.faq && business.faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": business.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    // JSON-LD Schema - Service (if services exist)
    const serviceSchema = business.services && business.services.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": business.category,
        "provider": {
            "@type": "LocalBusiness",
            "name": business.name,
            "@id": currentUrl
        },
        "areaServed": {
            "@type": "City",
            "name": business.address.city
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `Diensten van ${business.name}`,
            "itemListElement": business.services.map((service: any, index: number) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": service.name || service,
                    "description": service.description || `${service.name || service} aangeboden door ${business.name} in ${business.address.city}`
                },
                "position": index + 1,
                ...(service.price && {
                    "price": service.price,
                    "priceCurrency": "EUR"
                })
            }))
        }
    } : null;

    // JSON-LD Schema - Individual Reviews (for rich snippets)
    const reviewsSchema = business.reviews.items && business.reviews.items.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "@id": currentUrl,
        "review": business.reviews.items.slice(0, 10).map((review: any) => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": 5,
                "worstRating": 1
            },
            "author": {
                "@type": "Person",
                "name": review.author
            },
            "datePublished": review.date,
            "reviewBody": review.content,
            ...(review.ownerResponse && {
                "comment": {
                    "@type": "Comment",
                    "author": {
                        "@type": "Organization",
                        "name": business.name
                    },
                    "text": review.ownerResponse
                }
            })
        })),
        "aggregateRating": business.reviews.count > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": business.reviews.average,
            "reviewCount": business.reviews.count,
            "bestRating": 5,
            "worstRating": 1
        } : undefined
    } : null;

    // JSON-LD Schema - Product/Service with Reviews (for Google Shopping & Services)
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${business.category} diensten van ${business.name}`,
        "description": business.shortDescription,
        "brand": {
            "@type": "Brand",
            "name": business.name
        },
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "LocalBusiness",
                "name": business.name,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": business.address.street,
                    "addressLocality": business.address.city,
                    "postalCode": business.address.postalCode,
                    "addressCountry": "NL"
                }
            }
        },
        ...(business.reviews.count > 0 && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": business.reviews.average,
                "reviewCount": business.reviews.count,
                "bestRating": 5,
                "worstRating": 1
            }
        })
    };

    // Decode URL parameters for display
    const decodedProvince = decodeURIComponent(province);
    const decodedCity = decodeURIComponent(city);
    const decodedNeighborhood = decodeURIComponent(neighborhood);
    const decodedCategory = decodeURIComponent(category);
    const decodedSubcategory = decodeURIComponent(subcategory);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Track page view */}
            <TrackPageView business={business} />

            {/* LocalBusiness Schema */}
            <Script
                id="business-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />

            {/* BreadcrumbList Schema */}
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* FAQPage Schema */}
            {faqSchema && (
                <Script
                    id="faq-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            {/* Service Schema */}
            {serviceSchema && (
                <Script
                    id="service-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
                />
            )}

            {/* Reviews Schema */}
            {reviewsSchema && (
                <Script
                    id="reviews-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
                />
            )}

            {/* Product Schema */}
            <Script
                id="product-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                        <Link href="/" className="hover:text-slate-900">Home</Link>
                        <span>/</span>
                        <Link href={`/provincies/${province}`} className="hover:text-slate-900 capitalize">
                            {decodedProvince}
                        </Link>
                        <span>/</span>
                        <Link href={`/steden/${city}`} className="hover:text-slate-900 capitalize">
                            {decodedCity}
                        </Link>
                        <span>/</span>
                        <Link href={`/wijken/${city}/${neighborhood}`} className="hover:text-slate-900 capitalize">
                            {decodedNeighborhood.replace(/-/g, ' ')}
                        </Link>
                        <span>/</span>
                        <Link href={`/categorieen/${category}`} className="hover:text-slate-900 capitalize">
                            {decodedCategory.replace(/-/g, ' ')}
                        </Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{business.name}</span>
                    </nav>
                </div>
            </div>

            <BusinessHero business={business} />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content Column */}
                    <main className="flex-1 bg-white rounded-xl shadow-xl p-6 md:p-10 border border-slate-100 min-h-[500px]">
                        <BusinessContent business={business} />
                    </main>

                    {/* Sticky Sidebar Column */}
                    <aside className="lg:w-[380px] shrink-0 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <BusinessInfoSidebar business={business} />
                        </div>
                    </aside>

                </div>

                {/* Related Businesses */}
                {relatedBusinesses.length > 0 && (
                    <RelatedBusinesses
                        businesses={relatedBusinesses}
                        currentCategory={business.category}
                        categorySlug={category}
                    />
                )}
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
        </div>
    );
}
