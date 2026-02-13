

import { getFeaturedBusinesses } from "@/lib/data";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";

export async function FeaturedBusinesses() {
    const businesses = await getFeaturedBusinesses();

    return (
        <section className="py-20 px-4 md:px-8 bg-zinc-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="text-indigo-600 font-semibold tracking-wider text-xs uppercase mb-2 block">
                            Onze Aanbevelingen
                        </span>
                        <h2 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">Uitgelicht in Utrecht</h2>
                        <p className="text-zinc-500 text-lg max-w-2xl">
                            Ontdek populaire plekken en verborgen parels die door onze community worden aanbevolen.
                        </p>
                    </div>
                    <Link href="/businesses" className="hidden md:flex items-center px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm">
                        Bekijk alle bedrijven
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {businesses.map((business) => (
                        <Link
                            key={business.id}
                            href={`/business/${business.id}`}
                            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100 transition-all duration-300 h-full"
                        >
                            <div className="relative h-48 overflow-hidden bg-zinc-200">
                                <img
                                    src={business.images.cover}
                                    alt={business.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3">
                                    <button className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-zinc-400 hover:text-red-500 transition-colors shadow-sm">
                                        <Heart className="h-4 w-4" />
                                    </button>
                                </div>
                                {/* 'featured' is not in current type, we can infer or skip */}
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                        {business.category}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-bold text-zinc-900">{business.reviews.average}</span>
                                        <span className="text-xs text-zinc-400">({business.reviews.count})</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {business.name}
                                </h3>

                                <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
                                    {business.shortDescription}
                                </p>

                                <div className="pt-4 border-t border-zinc-100 mt-auto flex items-center justify-between">
                                    <div className="flex items-center text-zinc-400 text-xs">
                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                        {business.address.city}
                                    </div>

                                    <div className="flex gap-1">
                                        {business.tags.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
