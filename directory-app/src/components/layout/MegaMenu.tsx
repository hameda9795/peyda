"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { type BusinessCategory } from "@/lib/types";
import { getCategoryIcon } from "./category-icons";

interface MegaMenuProps {
    categories: BusinessCategory[];
}

export function MegaMenu({ categories }: MegaMenuProps) {
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Initial category defaults to the first one when opening
    React.useEffect(() => {
        if (isOpen && !activeCategory && categories.length > 0) {
            setActiveCategory(categories[0].name);
        }
    }, [isOpen, activeCategory, categories]);

    // Close menu on route change
    React.useEffect(() => {
        setIsOpen(false);
        setActiveCategory(null);
    }, [pathname]);

    // Close on click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentCategory = categories.find((c) => c.name === activeCategory) || categories[0];

    return (
        <div className="relative group" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-300",
                    isOpen
                        ? "text-zinc-900 bg-zinc-100 rounded-full"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-full"
                )}
            >
                Categorieën
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform duration-300 text-zinc-400",
                        isOpen && "rotate-180 text-zinc-900"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Page Overlay / Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm"
                            aria-hidden="true"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4 pt-3 pb-2"
                        >
                            {/* Glassmorphism Panel */}
                            <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-3xl shadow-2xl ring-1 ring-black/5 flex h-[650px] w-full max-w-[1100px]">

                                {/* Decorative gradients */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20" />
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

                                {/* Sidebar: Categories List */}
                                <div className="w-[300px] border-r border-zinc-100/50 bg-zinc-50/30 flex flex-col py-3 overflow-y-auto max-h-full custom-scrollbar pr-1 relative z-10">
                                    {categories.map((category) => {
                                        const Icon = getCategoryIcon(category.slug);
                                        const isActive = activeCategory === category.name;

                                        return (
                                            <button
                                                key={category.slug}
                                                onMouseEnter={() => setActiveCategory(category.name)}
                                                className={cn(
                                                    "group flex items-center justify-between mx-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                                                    isActive
                                                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-zinc-200/50 scale-[1.02]"
                                                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "p-1.5 rounded-lg transition-colors",
                                                        isActive ? "bg-indigo-50 text-indigo-600" : "bg-zinc-100 text-zinc-500 group-hover:bg-white group-hover:text-zinc-700"
                                                    )}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-medium truncate max-w-[160px]">
                                                        {category.name.replace(' in Utrecht', '')}
                                                    </span>
                                                </div>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-pill"
                                                        className="w-1.5 h-1.5 rounded-full bg-indigo-600"
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 p-8 relative z-10 flex flex-col h-full bg-white/40 overflow-y-auto custom-scrollbar">
                                    {currentCategory ? (
                                        <motion.div
                                            key={currentCategory.slug}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="h-full flex flex-col"
                                        >
                                            {/* Header */}
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 text-white">
                                                        {React.createElement(getCategoryIcon(currentCategory.slug), { className: "h-6 w-6" })}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                                                            {currentCategory.name.replace(' in Utrecht', '')}
                                                        </h3>
                                                        <p className="text-xs text-zinc-500 font-medium mt-0.5 line-clamp-1">
                                                            {currentCategory.description || "Ontdek alle bedrijven in deze categorie"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/categorieen/${currentCategory.slug.replace(/^\/?utrecht\//, '').replace(/^\/?nederland\//, '').replace(/^\//, '')}`}
                                                    className="group flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
                                                >
                                                    Bekijk alles
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </div>

                                            {/* Main Content Grid */}
                                            <div className="grid grid-cols-2 gap-8 flex-1">

                                                {/* Subcategories */}
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                                                            Populair
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {currentCategory.subcategories.map((sub: any, idx) => {
                                                                // Dynamically import to avoid circular dependencies if any, but since it's a lib func it's fine
                                                                const { getSubcategoryImage } = require('@/lib/subcategory-images');
                                                                const subName = typeof sub === 'string' ? sub : sub.name;
                                                                const subSlug = typeof sub === 'string'
                                                                    ? sub.toLowerCase().replace(/\s+/g, '-')
                                                                    : (sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-'));

                                                                const image = (typeof sub !== 'string' && sub.image)
                                                                    ? sub.image
                                                                    : getSubcategoryImage(currentCategory.slug, subName);

                                                                // Clean slugs for proper URL structure
                                                                const cleanCategorySlug = currentCategory.slug
                                                                    .replace(/^\/?utrecht\//, '')
                                                                    .replace(/^\/?nederland\//, '')
                                                                    .replace(/^\//, '');

                                                                // Extract just the last segment of the subcategory slug
                                                                // e.g., "/utrecht/beauty/kapper-dames" -> "kapper-dames"
                                                                const slugParts = subSlug.split('/').filter(Boolean);
                                                                const cleanSubSlug = slugParts[slugParts.length - 1] || subSlug.replace(/\//g, '-');

                                                                const finalHref = `/categorieen/${cleanCategorySlug}/${cleanSubSlug}`;

                                                                return (
                                                                    <Link
                                                                        key={idx}
                                                                        href={finalHref}
                                                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors group/sub"
                                                                    >
                                                                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                            <img
                                                                                src={image}
                                                                                alt={subName}
                                                                                className="w-full h-full object-cover transition-transform duration-300 group-hover/sub:scale-110"
                                                                            />
                                                                        </div>
                                                                        <span className="text-sm font-medium text-zinc-600 group-hover/sub:text-indigo-600 transition-colors">
                                                                            {subName}
                                                                        </span>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                                                            <TrendingUp className="h-3 w-3" />
                                                            Trending Zoekopdrachten
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {(currentCategory.keywords || []).map((keyword, idx) => (
                                                                <Link
                                                                    key={idx}
                                                                    href="#"
                                                                    className="block text-sm text-zinc-500 hover:text-indigo-600 hover:translate-x-1 transition-all"
                                                                >
                                                                    • {keyword}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Visual Feature */}
                                                <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden group">
                                                    {/* Image Overlay Gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={currentCategory.image}
                                                        alt={currentCategory.name}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />

                                                    <div className="absolute bottom-6 left-6 right-6 z-20">
                                                        <span className="inline-block px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-medium mb-3">
                                                            Uitgelicht
                                                        </span>
                                                        <h4 className="text-white text-lg font-bold leading-tight mb-2">
                                                            De beste {currentCategory.name.replace(' in Utrecht', '').toLowerCase()} in de stad
                                                        </h4>
                                                        <p className="text-zinc-300 text-sm line-clamp-2">
                                                            {currentCategory.seoDescription || currentCategory.description || "Bekijk onze curatie van top-beoordeelde bedrijven en verborgen parels in Utrecht."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                                            Loading...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
