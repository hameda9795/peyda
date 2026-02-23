"use client";

import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

// Hook that safely gets search params (returns null during SSR)
function useSearchParamSafe() {
    return useSyncExternalStore(
        () => () => {}, // no-op subscribe
        () => {
            if (typeof window === 'undefined') return '';
            const params = new URLSearchParams(window.location.search);
            return params.get("q") || '';
        },
        () => '' // SSR snapshot
    );
}

function SearchBarContent({ isTransparent }: { isTransparent?: boolean }) {
    const router = useRouter();
    const initialQuery = useSearchParamSafe();
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={`hidden lg:flex items-center border rounded-full px-3 h-9 w-64 md:w-80 transition-all shadow-sm ${isTransparent ? 'bg-white/10 border-white/20 focus-within:ring-2 focus-within:ring-white/30 backdrop-blur-md' : 'bg-zinc-100/50 border-zinc-200 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
            <Search className={`h-4 w-4 mr-2 shrink-0 ${isTransparent ? 'text-white/60' : 'text-zinc-400'}`} />
            <input
                type="text"
                placeholder="Zoek bedrijven, diensten..."
                className={`bg-transparent border-none outline-none text-sm w-full h-full ${isTransparent ? 'text-white placeholder:text-white/60' : 'text-zinc-900 placeholder:text-zinc-500'}`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className={`h-4 w-px mx-2 shrink-0 ${isTransparent ? 'bg-white/20' : 'bg-zinc-300'}`} />
            <MapPin className={`h-4 w-4 shrink-0 ${isTransparent ? 'text-white/50' : 'text-zinc-400'}`} />
        </form>
    );
}

export function SearchBar({ isTransparent }: { isTransparent?: boolean }) {
    return <SearchBarContent isTransparent={isTransparent} />;
}
