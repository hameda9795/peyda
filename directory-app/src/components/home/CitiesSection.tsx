import Link from "next/link";
import Image from "next/image";
import { NETHERLANDS_PROVINCES, getTopCities } from "@/lib/netherlands-data";
import { ArrowRight, MapPin } from "lucide-react";

// Real images for Dutch cities from Unsplash
const CITY_IMAGES: Record<string, string> = {
    "amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop&q=80",
    "rotterdam": "https://images.unsplash.com/photo-1543168256-418811576931?w=400&h=300&fit=crop&q=80",
    "den-haag": "https://images.unsplash.com/photo-1582553506259-558e9b4f3a45?w=400&h=300&fit=crop&q=80",
    "utrecht-stad": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",
    "eindhoven": "https://images.unsplash.com/photo-1600623471616-8c1966c91ff6?w=400&h=300&fit=crop&q=80",
    "groningen-stad": "https://images.unsplash.com/photo-1605101100278-5d1deb2b6498?w=400&h=300&fit=crop&q=80",
    "tilburg": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&q=80",
    "almere": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop&q=80",
    "breda": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop&q=80",
    "nijmegen": "https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=400&h=300&fit=crop&q=80",
    "apeldoorn": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80",
    "haarlem": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=400&h=300&fit=crop&q=80",
};

// Fallback gradient backgrounds for cities without specific images
const CITY_GRADIENTS = [
    "from-orange-400 to-amber-500",
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-cyan-500",
    "from-rose-400 to-orange-500",
    "from-teal-400 to-emerald-500",
    "from-amber-400 to-orange-500",
];

export function CitiesSection() {
    const topCities = getTopCities(12);

    return (
        <section className="cities-section py-8 px-3">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-6">
                    <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full mb-4">
                        🇳🇱 Heel Nederland
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Steden van Nederland
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Ontdek lokale bedrijven in de grootste steden van Nederland
                    </p>
                </div>

                {/* Top Cities Grid - With Images */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-8">
                    {topCities.map((city, index) => {
                        const imageUrl = CITY_IMAGES[city.slug];
                        const gradient = CITY_GRADIENTS[index % CITY_GRADIENTS.length];

                        return (
                            <Link
                                key={city.slug}
                                href={`/steden/${city.slug}`}
                                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                {/* Background Image or Gradient */}
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={city.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        priority={index < 2}
                                    />
                                ) : (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-4">
                                    <h3 className="text-white text-lg font-bold mb-1 drop-shadow-lg">
                                        {city.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-white/80 text-sm">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{city.province}</span>
                                    </div>
                                    {city.population && (
                                        <span className="mt-2 inline-flex items-center px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                                            {(city.population / 1000).toFixed(0)}K inwoners
                                        </span>
                                    )}
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Provinces Grid */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-center mb-5 text-gray-800">
                        Alle Provincies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {NETHERLANDS_PROVINCES.map((province) => (
                            <Link
                                key={province.slug}
                                href={`/provincies/${province.slug}`}
                                className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${province.gradient} flex items-center justify-center text-xl shadow-sm`}>
                                    {province.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                        {province.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {province.cities.length} steden
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* View All Cities Button */}
                <div className="mt-8 text-center">
                    <Link
                        href="/steden"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                    >
                        Bekijk alle steden
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
