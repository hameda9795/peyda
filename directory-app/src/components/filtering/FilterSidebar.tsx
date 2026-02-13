"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

export function FilterSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get current filters
    const currentPriceRanges = searchParams.get("price")?.split(",").map(Number) || [];
    const currentMinRating = Number(searchParams.get("rating")) || 0;
    const currentIsOpen = searchParams.get("open") === "true";

    const updateFilters = (key: string, value: any) => {
        const params = new URLSearchParams(searchParams.toString());

        if (key === "price") {
            const range = value as number;
            let newRanges = [...currentPriceRanges];
            if (newRanges.includes(range)) {
                newRanges = newRanges.filter(r => r !== range);
            } else {
                newRanges.push(range);
            }

            if (newRanges.length > 0) {
                params.set("price", newRanges.join(","));
            } else {
                params.delete("price");
            }
        } else if (key === "rating") {
            if (currentMinRating === value) {
                params.delete("rating");
            } else {
                params.set("rating", value.toString());
            }
        } else if (key === "open") {
            if (currentIsOpen) {
                params.delete("open");
            } else {
                params.set("open", "true");
            }
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <aside className="w-full space-y-8">
            {/* Status Filter */}
            <div>
                <h3 className="font-semibold text-zinc-900 mb-4">Status</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${currentIsOpen ? "bg-indigo-600" : "bg-zinc-200"}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${currentIsOpen ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    <span className="text-sm text-zinc-600 group-hover:text-zinc-900">Nu geopend</span>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={currentIsOpen}
                        onChange={() => updateFilters("open", !currentIsOpen)}
                    />
                </label>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="font-semibold text-zinc-900 mb-4">Prijsklasse</h3>
                <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((price) => {
                        const labels: Record<number, string> = {
                            1: "Goedkoop",
                            2: "Gemiddeld",
                            3: "Luxe"
                        };
                        return (
                            <button
                                key={price}
                                onClick={() => updateFilters("price", price)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium border transition-all ${currentPriceRanges.includes(price)
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                                    }`}
                            >
                                <span className="font-bold tracking-widest">{Array(price).fill("€").join("")}</span>
                                <span className="text-xs opacity-80 font-normal">{labels[price]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <h3 className="font-semibold text-zinc-900 mb-4">Beoordeling</h3>
                <div className="space-y-2">
                    {[4, 3, 2].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="rating"
                                checked={currentMinRating === rating}
                                onChange={() => updateFilters("rating", rating)}
                                className="w-4 h-4 text-indigo-600 border-zinc-300 focus:ring-indigo-500"
                            />
                            <div className="flex items-center gap-1">
                                <div className="flex text-yellow-400">
                                    {Array(5).fill(0).map((_, i) => (
                                        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-current" : "text-zinc-200"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-zinc-500 group-hover:text-zinc-700">& hoger</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}
