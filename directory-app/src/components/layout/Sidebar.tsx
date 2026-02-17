"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Plus, Layers, BookOpen, ChevronDown } from "lucide-react";
import { ArrowRight, Star, TrendingUp, Calendar, Map, CheckCircle2 } from "lucide-react";
import { FilterSidebar } from "@/components/filtering/FilterSidebar";
import { getCategories } from "@/lib/categories-static";

import { useSidebar } from "@/providers/SidebarProvider";
import { useAuthModal } from "@/providers/AuthModalProvider";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();
    const { isOpen, close } = useSidebar();
    const { openRegisterModal } = useAuthModal();
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const categories = getCategories();

    // Check if we are on a category page (e.g., /utrecht/eten-drinken), but NOT root /utrecht or specific business
    const isCategoryPage = pathname.startsWith('/utrecht/') && !pathname.includes('/bedrijf') && pathname.split('/').length === 3;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={close}
                />
            )}

            <aside className={cn(
                "hidden lg:block w-72 shrink-0 border-r border-zinc-200 bg-white sticky top-0 h-screen pt-20 pb-8 overflow-y-auto custom-scrollbar p-6 z-0",
                // Mobile Styles
                isOpen && "block fixed inset-y-0 left-0 z-50 w-72 h-full shadow-2xl transform transition-transform duration-300 ease-in-out lg:static lg:shadow-none lg:z-0 lg:transform-none"
            )}>
                {/* Mobile Header (Close button could go here, but clicking outside works too) */}
                <div className="lg:hidden mb-6 flex items-center justify-between">
                    <span className="text-lg font-bold text-zinc-900">Menu</span>
                </div>

                <div className="space-y-8">

                    {/* Mobile Only: Main Navigation from Navbar */}
                    <div className="lg:hidden pb-6 border-b border-zinc-100">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-2">
                            Menu
                        </h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all",
                                    isCategoriesOpen ? "bg-zinc-50 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <Layers className={cn("h-4.5 w-4.5 transition-colors", isCategoriesOpen ? "text-indigo-600" : "text-zinc-400")} />
                                    Categorieën
                                </span>
                                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isCategoriesOpen && "rotate-180")} />
                            </button>

                            <div className={cn(
                                "grid transition-all duration-200 ease-in-out",
                                isCategoriesOpen ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0"
                            )}>
                                <div className="overflow-hidden">
                                    <div className="pl-4 pr-2 space-y-1 pt-1 border-l-2 border-zinc-100 ml-5">
                                        {categories.map((category) => (
                                            <MobileCategoryItem key={category.slug} category={category} closeSidebar={close} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <SidebarItem icon={BookOpen} label="Artikelen" href="/artikelen" onClick={close} />
                            <SidebarItem icon={Layers} label="Collecties" href="/collections" onClick={close} />
                            <button
                                onClick={() => {
                                    close();
                                    openRegisterModal();
                                }}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm mt-4 w-full"
                            >
                                <Plus className="h-4.5 w-4.5" />
                                Bedrijf toevoegen
                            </button>
                        </div>
                    </div>

                    {/* Dynamically show Filters if on Category Page */}
                    {isCategoryPage && (
                        <div className="pb-6 mb-6 border-b border-zinc-100 animate-in slide-in-from-left-4 duration-500">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 px-2">
                                Filters
                            </h3>
                            {/* We reuse the Logic from FilterSidebar but styled to fit here */}
                            <FilterSidebar />
                        </div>
                    )}

                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-2">
                            Ontdekken
                        </h3>
                        <div className="space-y-1">
                            <SidebarItem icon={TrendingUp} label="Trending Nu" href="/trending" active={pathname === '/trending'} onClick={close} />
                            <SidebarItem icon={Star} label="Populairst" href="/popular" active={pathname === '/popular'} onClick={close} />
                            <SidebarItem icon={Calendar} label="Evenementen Agenda" href="/events" active={pathname === '/events'} onClick={close} />
                            <SidebarItem icon={Map} label="Interactieve Kaart" href="/map" active={pathname === '/map'} onClick={close} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-2">
                            Wijken in Utrecht
                        </h3>
                        <div className="space-y-1">
                            {["Centrum", "Oost", "West", "Noord", "Zuid", "Leidsche Rijn"].map((wijk) => (
                                <Link
                                    key={wijk}
                                    href={`/wijk/${wijk.toLowerCase()}`}
                                    onClick={close}
                                    className="flex items-center justify-between px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors group"
                                >
                                    {wijk}
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 group-hover:translate-x-1 duration-200" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />

                            <h4 className="text-base font-bold mb-2 relative z-10">Ondernemer?</h4>
                            <ul className="space-y-2 mb-4 relative z-10">
                                <li className="flex items-center gap-2 text-indigo-100 text-xs">
                                    <CheckCircle2 className="h-3 w-3" /> Meer zichtbaarheid
                                </li>
                                <li className="flex items-center gap-2 text-indigo-100 text-xs">
                                    <CheckCircle2 className="h-3 w-3" /> Eigen bedrijfspagina
                                </li>
                            </ul>
                            <button
                                onClick={() => {
                                    close();
                                    openRegisterModal();
                                }}
                                className="w-full text-xs bg-white text-indigo-700 font-bold py-2.5 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                            >
                                Gratis aanmelden
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

function SidebarItem({ icon: Icon, label, href, active, onClick }: { icon: any, label: string, href: string, active?: boolean, onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${active
                ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
        >
            <Icon className={`h-4.5 w-4.5 ${active ? "text-indigo-600" : "text-zinc-400"}`} />
            {label}
        </Link>
    )
}

interface MobileCategoryItemProps {
    category: any;
    closeSidebar: () => void;
}

function MobileCategoryItem({ category, closeSidebar }: MobileCategoryItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
        <div>
            <div className="flex items-center justify-between group">
                <Link
                    href={category.slug}
                    onClick={closeSidebar}
                    className="flex-1 py-2 text-sm text-zinc-600 font-medium hover:text-indigo-600 transition-colors truncate"
                >
                    {category.name.replace(' in Utrecht', '')}
                </Link>
                {hasSubcategories && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                    </button>
                )}
            </div>

            {hasSubcategories && (
                <div className={cn(
                    "grid transition-all duration-200 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                    <div className="overflow-hidden">
                        <div className="pl-3 pb-1 space-y-1">
                            {category.subcategories.map((sub: string) => (
                                <Link
                                    key={sub}
                                    href={`${category.slug}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                    onClick={closeSidebar}
                                    className="block py-1.5 text-xs text-zinc-500 hover:text-indigo-600 transition-colors border-l border-zinc-100 pl-3 hover:border-indigo-200"
                                >
                                    {sub}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
