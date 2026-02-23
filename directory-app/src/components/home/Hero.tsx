"use client";

import { motion } from "framer-motion";
import { Search, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Hero() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-24 pb-16">
            {/* --- Premium Background Effects --- */}
            {/* Ambient Base Layer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-zinc-50/0 to-white/0 dark:from-indigo-950/20 dark:via-zinc-950/0 dark:to-zinc-950/0" />

            {/* Animated Glow Orbs */}
            <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] opacity-70 animate-[float_8s_ease-in-out_infinite]" />
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-200/40 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] opacity-70 animate-[float_10s_ease-in-out_infinite_reverse]" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-[0.03] dark:opacity-[0.05]" />

            <div className="container relative z-10 px-4 flex flex-col items-center text-center max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-8 shadow-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white border-r border-zinc-300 dark:border-zinc-700 pr-2 mr-2 hidden sm:inline-block">Live</span>
                    De beste gids voor Utrecht
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]"
                >
                    Vind lokale de <br className="hidden md:block" />
                    <span className="relative inline-block">
                        <span className="absolute -inset-2 bg-indigo-100/50 dark:bg-indigo-900/30 blur-2xl rounded-full"></span>
                        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500 dark:from-indigo-400 dark:to-emerald-400">
                            beste experts
                        </span>
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl lg:text-2xl font-medium mb-10 max-w-3xl leading-relaxed px-4 sm:px-0"
                >
                    Van de beste restaurants tot betrouwbare loodgieters. Alles wat je nodig hebt in Utrecht, verzameld op één premium platform.
                </motion.p>

                {/* Premium Search Component */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl relative group z-20"
                >
                    {/* Animated Border Glow setup */}
                    <div className={`absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 rounded-3xl blur-[14px] opacity-20 transition-all duration-500 ${isFocused ? 'opacity-40 blur-[20px]' : 'group-hover:opacity-30'}`}></div>

                    <div className={`relative flex items-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border ${isFocused ? 'border-indigo-300 dark:border-indigo-500/50' : 'border-zinc-200/60 dark:border-zinc-800'} rounded-3xl p-2.5 shadow-2xl shadow-indigo-100/30 dark:shadow-indigo-900/20 transition-all duration-300`}>
                        <div className="pl-4 pr-2 flex items-center justify-center">
                            <Search className={`h-6 w-6 transition-colors duration-300 ${isFocused ? 'text-indigo-500 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Waar ben je naar op zoek?"
                            className="flex-1 bg-transparent border-none outline-none px-2 text-base md:text-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 h-12 md:h-14 font-medium min-w-0"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm md:text-base px-6 md:px-8 py-3.5 md:py-4 rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-zinc-900/10 flex items-center gap-2 whitespace-nowrap"
                        >
                            <span>Zoeken</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Key Features Grid */}
                    <div className="mt-8 grid grid-cols-3 gap-3 md:gap-4 w-full text-center">
                        <div className="bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-3 md:p-4 backdrop-blur-md shadow-sm">
                            <div className="text-base md:text-lg font-bold text-zinc-900 dark:text-white">5 stappen</div>
                            <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Aanmelden</div>
                        </div>
                        <div className="bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-3 md:p-4 backdrop-blur-md shadow-sm">
                            <div className="text-base md:text-lg font-bold text-zinc-900 dark:text-white">24/7</div>
                            <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Vindbaarheid</div>
                        </div>
                        <div className="bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-3 md:p-4 backdrop-blur-md shadow-sm">
                            <div className="text-base md:text-lg font-bold text-zinc-900 dark:text-white">NL</div>
                            <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Landelijk bereik</div>
                        </div>
                    </div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-16 md:mt-20 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full max-w-4xl justify-center"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-10 w-10 md:h-12 md:w-12 rounded-full border-[3px] border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shadow-sm relative z-[i] hover:-translate-y-1 transition-transform">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                            </div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                15.000+ <span className="text-zinc-500 dark:text-zinc-400 font-normal">Tevreden gebruikers</span>
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-zinc-200 dark:bg-zinc-800"></div>

                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-zinc-900 dark:text-white">Geverifieerde Bedrijven</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">100% veilig & vertrouwd</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
