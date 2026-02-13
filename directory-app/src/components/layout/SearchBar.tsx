"use client";

import { Search, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");

    // Sync input with URL query param on load
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setQuery(q);
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-zinc-100/50 border border-zinc-200 rounded-full px-4 py-2 w-64 md:w-80 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
            <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
            <input
                type="text"
                placeholder="Zoek bedrijven, diensten..."
                className="bg-transparent border-none outline-none text-sm text-zinc-900 placeholder:text-zinc-500 w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {/* Visual separator and fake MapPin for location context (future feature) */}
            <div className="h-4 w-px bg-zinc-300 mx-2 shrink-0" />
            <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
        </form>
    );
}
