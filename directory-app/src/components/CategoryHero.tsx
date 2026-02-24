"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface CategoryHeroProps {
    title: string;
    description?: string;
    image?: string;
    breadcrumbs: BreadcrumbItem[];
}

export function CategoryHero({ title, description, image, breadcrumbs }: CategoryHeroProps) {
    return (
        <div className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-zinc-900">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-zinc-900 opacity-80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    {/* Breadcrumbs */}
                    <nav className="flex items-center justify-center gap-2 text-sm text-zinc-300 mb-8">
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                        {breadcrumbs.map((item, index) => (
                            <div key={item.href} className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-zinc-500" />
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "hover:text-white transition-colors",
                                        index === breadcrumbs.length - 1 ? "text-white font-medium" : ""
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
                            {description}
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
