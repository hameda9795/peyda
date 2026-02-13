import Link from "next/link";
import { getFeaturedBusinesses } from "@/lib/data";
import { Star, MapPin, ExternalLink, Phone } from "lucide-react";

export async function FeaturedSection() {
    const businesses = await getFeaturedBusinesses();

    if (businesses.length === 0) {
        return null;
    }

    return (
        <section className="featured-section py-20 px-4">
            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Section Header */}
                <div className="section-header dark mb-12">
                    <h2>Uitgelichte Bedrijven</h2>
                    <p>Top-beoordeelde ondernemers door onze community aanbevolen</p>
                </div>

                {/* Featured Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {businesses.slice(0, 8).map((business, index) => (
                        <Link
                            key={business.id}
                            href={`/business/${business.id}`}
                            className="featured-card group"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={business.images.cover || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"}
                                    alt={business.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {index < 3 && (
                                    <span className="featured-badge">⭐ Top {index + 1}</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {/* Category */}
                                <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full mb-3">
                                    {business.category}
                                </span>

                                {/* Name */}
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                    {business.name}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(business.reviews.average)
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-600"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        ({business.reviews.count})
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span>{business.address.city}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-white/10">
                                    <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors">
                                        <Phone className="w-4 h-4" />
                                        Bellen
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm font-medium transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                        Bekijken
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All */}
                <div className="mt-12 text-center">
                    <Link
                        href="/bedrijven"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Bekijk alle bedrijven
                    </Link>
                </div>
            </div>
        </section>
    );
}
