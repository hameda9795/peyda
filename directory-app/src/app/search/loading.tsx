"use client";

import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";

export default function SearchLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            </div>

            <div className="relative z-10 pt-16 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-6"
                        >
                            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                            <span className="text-sm font-medium text-slate-400">Bezig met zoeken...</span>
                        </motion.div>
                        
                        <div className="h-12 bg-slate-200 rounded-lg max-w-md mx-auto mb-4 animate-pulse" />
                        <div className="h-6 bg-slate-200 rounded-lg max-w-lg mx-auto animate-pulse" />
                    </div>

                    {/* Search Bar Skeleton */}
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="h-16 bg-white rounded-2xl shadow-lg border border-slate-200 animate-pulse" />
                    </div>

                    {/* Filter Bar Skeleton */}
                    <div className="max-w-7xl mx-auto mb-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex gap-3">
                                    <div className="h-10 w-40 bg-slate-200 rounded-xl animate-pulse" />
                                    <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse" />
                                </div>
                                <div className="h-10 w-24 bg-slate-200 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Results Grid Skeleton */}
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl overflow-hidden border border-slate-200"
                            >
                                {/* Image Skeleton */}
                                <div className="aspect-[4/3] bg-slate-200 animate-pulse" />
                                
                                {/* Content Skeleton */}
                                <div className="p-5">
                                    <div className="h-5 bg-slate-200 rounded mb-2 animate-pulse" />
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4 animate-pulse" />
                                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4 animate-pulse" />
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                                        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
