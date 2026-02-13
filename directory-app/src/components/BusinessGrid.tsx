"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Business } from "@/lib/types";

interface BusinessGridProps {
    businesses: Business[];
    title?: string;
}

export function BusinessGrid({ businesses, title }: BusinessGridProps) {
    if (businesses.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-zinc-500">Geen bedrijven gevonden in deze categorie.</p>
            </div>
        );
    }

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {title && (
                    <h2 className="text-2xl font-bold text-zinc-900 mb-8">{title}</h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {businesses.map((business, index) => (
                        <motion.div
                            key={business.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                                <Image
                                    src={business.images.cover || '/images/placeholder-business.jpg'}
                                    alt={`${business.name} - ${business.category} in ${business.address.city}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-zinc-900 line-clamp-1">
                                        {business.name}
                                    </h3>
                                    <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-green-700">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span className="text-xs font-bold">{business.reviews.average}</span>
                                    </div>
                                </div>

                                <p className="text-zinc-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                    {business.shortDescription}
                                </p>

                                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-4">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">{business.address.city}</span>
                                </div>

                                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                                    <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-50 rounded-full">
                                        {business.subcategories[0] || business.category}
                                    </span>
                                    {/* Link would go here, for now it's just visual */}
                                    <Link href={`/utrecht/bedrijf/${business.slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                        Bekijk details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
