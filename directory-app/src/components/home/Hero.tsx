"use client";

import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Hero() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="relative w-full py-20 lg:py-32 flex items-center justify-center overflow-hidden bg-white">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-80" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

            {/* Decorative blobs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

            <div className="container relative z-10 px-4 flex flex-col items-center text-center max-w-5xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-600 mb-6 shadow-sm"
                >
                    <span className="relative flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Ontdek het beste van Utrecht
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight"
                >
                    Vind lokale experts <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">voor elke klus</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-zinc-500 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed"
                >
                    Van de beste restaurants tot betrouwbare loodgieters. <br className="hidden md:block" /> Alles wat je nodig hebt in Utrecht, verzameld op één premium platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full max-w-xl relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-white border border-zinc-200 rounded-2xl p-2 shadow-xl shadow-indigo-100/50">
                        <Search className="ml-4 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Wat zoek je vandaag? (bijv. kapper, loodgieter)"
                            className="flex-1 bg-transparent border-none outline-none px-4 text-zinc-900 placeholder:text-zinc-400 h-10 ring-0 focus:ring-0"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-zinc-900 text-white font-medium text-sm px-6 py-3 rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 flex items-center gap-2"
                        >
                            Zoeken <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 flex items-center gap-8 text-sm text-zinc-400"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-xs overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <p>Vertrouwd door <strong>15.000+</strong> Utrechters</p>
                </motion.div>
            </div>
        </section>
    );
}
