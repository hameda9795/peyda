"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SubCategory {
    name: string;
    slug: string;
    count?: number;
    image?: string;
}

interface SubCategoryListProps {
    parentSlug: string;
    subcategories: SubCategory[];
}

export function SubCategoryList({ parentSlug, subcategories }: SubCategoryListProps) {
    return (
        <section className="py-12 bg-zinc-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subcategories.map((sub, index) => (
                        <motion.div
                            key={sub.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={`${parentSlug}/${sub.slug}`}
                                className="group block h-full bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-4 flex items-center gap-4">
                                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        {sub.image && (
                                            <img
                                                src={sub.image}
                                                alt={sub.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                                            {sub.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-zinc-500">
                                                Bekijk aanbod
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
