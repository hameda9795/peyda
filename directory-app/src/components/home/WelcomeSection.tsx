"use client";

import Link from "next/link";
import { ArrowRight, Check, Search, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthModal } from "@/providers/AuthModalProvider";

interface WelcomeSectionProps {
    totalBusinesses?: number;
}

export function WelcomeSection({ totalBusinesses = 0 }: WelcomeSectionProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const { openRegisterModal } = useAuthModal();

    const atlasPins = [
        {
            id: "ams",
            label: "AMS",
            title: "Amsterdam",
            href: "/steden/amsterdam",
            className: "pin-1",
            type: "city",
        },
        {
            id: "utr",
            label: "UTR",
            title: "Utrecht",
            href: "/steden/utrecht",
            className: "pin-2",
            type: "city",
        },
        {
            id: "rtd",
            label: "RTD",
            title: "Rotterdam",
            href: "/steden/rotterdam",
            className: "pin-3",
            type: "city",
        },
        {
            id: "food",
            label: "ETEN",
            title: "Eten & Drinken",
            href: "/categorieen/eten-drinken",
            className: "pin-4",
            type: "category",
        },
    ];

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="atlas-hero">
            <div className="atlas-map-wrap">
                <div className="atlas-map" aria-hidden="true">
                    <img src="/nl-map.svg" alt="" className="atlas-nl-map" />
                </div>
                <nav className="atlas-pins" aria-label="Snelle navigatie naar steden en categorieen">
                    {atlasPins.map((pin) => (
                        <Link
                            key={pin.id}
                            href={pin.href}
                            className={`atlas-pin ${pin.className}`}
                            aria-label={`${pin.type === "city" ? "Bekijk stad" : "Bekijk categorie"} ${pin.title}`}
                            title={pin.title}
                        >
                            <span>{pin.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="atlas-hero-grid">
                    <div className="atlas-hero-left">
                        <h1 className="text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3.75rem] font-bold leading-[1.2] sm:leading-[1.1] mb-5 text-white display-font tracking-tight">
                            Vind lokale bedrijven die passen bij jouw buurt
                            <span className="text-white/70 block sm:inline"> en ontdek het beste aanbod.</span>
                        </h1>

                        <p className="atlas-subtitle">
                            Van restaurants tot aannemers: ontdek betrouwbare ondernemers, vergelijk
                            opties en neem direct contact op via het lokale atlas van Nederland.
                        </p>

                        <div className="search-container relative max-w-[650px] z-20">
                            <div className="search-glow"></div>
                            <div className="relative p-2 sm:p-2 bg-white/95 backdrop-blur-xl rounded-[1.2rem] sm:rounded-full shadow-2xl border border-white/30 flex flex-col sm:flex-row gap-2 transition-transform hover:scale-[1.01] duration-300">
                                <div className="flex items-center flex-1 px-3 sm:px-4">
                                    <Search className="h-5 w-5 text-zinc-400 shrink-0" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        placeholder="Zoek op bedrijf, product of dienst..."
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-zinc-900 placeholder:text-zinc-400 py-3.5 sm:py-3 px-3 text-[15px] sm:text-[1.05rem] h-14 sm:h-12"
                                    />
                                </div>
                                <button onClick={handleSearch} className="w-full sm:w-auto mt-1 sm:mt-0 bg-[#E07A3F] text-[#111827] hover:bg-[#C76933] font-bold py-3.5 sm:py-0 sm:h-[48px] px-8 rounded-[1rem] sm:rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 shrink-0">
                                    Zoeken
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>



                        <div className="atlas-trust-row">
                            <span className="atlas-trust-pill">Lokale SEO</span>
                            <span className="atlas-trust-pill">Echte reviews</span>
                            <span className="atlas-trust-pill">Direct contact</span>
                        </div>
                    </div>

                    <div className="atlas-hero-right">
                        <div className="owner-card">
                            <div className="owner-kicker">
                                <Sparkles className="w-4 h-4" />
                                Voor ondernemers
                            </div>
                            <h2 className="owner-title display-font">
                                Zet je bedrijf op de kaart en word sneller gevonden.
                            </h2>
                            <div className="owner-list">
                                <span>
                                    <Check className="w-4 h-4 text-emerald-200" />
                                    Professionele bedrijfspagina met SEO-velden
                                </span>
                                <span>
                                    <Check className="w-4 h-4 text-emerald-200" />
                                    Meer zichtbaarheid in Google en lokale zoekopdrachten
                                </span>
                                <span>
                                    <Check className="w-4 h-4 text-emerald-200" />
                                    Reviews, foto's en directe CTA's
                                </span>
                            </div>
                            <div className="owner-cta">
                                <button onClick={openRegisterModal} className="owner-btn">
                                    Bedrijf aanmelden
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <Link href="/over-ons" className="owner-link">
                                    Zo werkt lokale zichtbaarheid
                                    <TrendingUp className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-2 w-full">
                                <div className="bg-white/10 border border-white/20 rounded-[0.75rem] p-3 text-center text-[0.8rem] text-white/70 whitespace-nowrap flex flex-col items-center justify-center min-w-0">
                                    <strong className="block text-[1.1rem] text-white mb-0.5 font-bold truncate w-full">5 stappen</strong>
                                    <span className="truncate w-full block">Aanmelden</span>
                                </div>
                                <div className="bg-white/10 border border-white/20 rounded-[0.75rem] p-3 text-center text-[0.8rem] text-white/70 whitespace-nowrap flex flex-col items-center justify-center min-w-0">
                                    <strong className="block text-[1.1rem] text-white mb-0.5 font-bold truncate w-full">24/7</strong>
                                    <span className="truncate w-full block">Vindbaarheid</span>
                                </div>
                                <div className="bg-white/10 border border-white/20 rounded-[0.75rem] p-3 text-center text-[0.8rem] text-white/70 whitespace-nowrap flex flex-col items-center justify-center min-w-0">
                                    <strong className="block text-[1.1rem] text-white mb-0.5 font-bold truncate w-full">NL</strong>
                                    <span className="truncate w-full block">Landelijk bereik</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
