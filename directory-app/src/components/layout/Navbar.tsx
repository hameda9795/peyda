"use client";

import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import { SearchBar } from "./SearchBar";

export function Navbar({ categories = [] }: { categories?: any[] }) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
            <div className="container px-4 h-16 flex items-center justify-between mx-auto">
                <div className="flex items-center gap-4 lg:gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                            <span className="text-white font-bold text-sm">NL</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-zinc-900 hidden sm:block">
                            NL<span className="text-zinc-500 text-base font-medium ml-1">Directory</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <MegaMenu categories={categories} />
                        <Link
                            href="/steden"
                            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                            Steden
                        </Link>
                        <Link
                            href="/artikelen"
                            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                            Artikelen
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:block">
                        <SearchBar />
                    </div>

                    {/* Mobile Search Button */}
                    <Link
                        href="/search"
                        className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                        <Search className="h-5 w-5" />
                    </Link>

                    {/* Notifications */}
                    <button className="relative p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-emerald-500 rounded-full border border-white" />
                    </button>

                    {/* CTA Button */}
                    <Link
                        href="/bedrijf-aanmelden"
                        className="hidden sm:block px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-full transition-colors shadow-lg shadow-emerald-200"
                    >
                        Bedrijf toevoegen
                    </Link>
                </div>
            </div>
        </header>
    );
}
