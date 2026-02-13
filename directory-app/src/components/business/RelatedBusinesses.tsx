import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight } from "lucide-react";

interface RelatedBusiness {
    id: string;
    name: string;
    slug: string;
    category: string;
    categorySlug: string;
    subcategorySlug: string;
    shortDescription?: string;
    rating: number;
    reviewCount: number;
    images: {
        cover: string;
        logo: string;
    };
    address: {
        city: string;
        neighborhood: string;
    };
    provinceSlug: string;
    citySlug: string;
    neighborhoodSlug: string;
}

interface RelatedBusinessesProps {
    businesses: RelatedBusiness[];
    currentCategory: string;
    categorySlug: string;
}

export function RelatedBusinesses({ businesses, currentCategory, categorySlug }: RelatedBusinessesProps) {
    if (businesses.length === 0) return null;

    return (
        <section className="mt-16 border-t border-slate-200 pt-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Vergelijkbare bedrijven
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Andere {currentCategory.toLowerCase()} in de buurt
                    </p>
                </div>
                <Link
                    href={`/categorieen/${categorySlug}`}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Bekijk alles
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {businesses.map((business) => {
                    const href = `/${business.provinceSlug}/${business.citySlug}/${business.neighborhoodSlug}/${business.categorySlug}/${business.subcategorySlug}/${business.slug}`;

                    return (
                        <Link
                            key={business.id}
                            href={href}
                            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <Image
                                    src={business.images.cover || '/images/placeholder-business.svg'}
                                    alt={`${business.name} - ${business.category} in ${business.address.city}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {business.name}
                                    </h3>
                                    <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-700 shrink-0">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs font-bold">{business.rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                {business.shortDescription && (
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                                        {business.shortDescription}
                                    </p>
                                )}

                                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">
                                        {business.address.neighborhood ? `${business.address.neighborhood}, ` : ''}
                                        {business.address.city}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
