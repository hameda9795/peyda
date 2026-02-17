"use client";

import Link from "next/link";
import { ArrowRight, Check, Search, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthModal } from "@/providers/AuthModalProvider";

export function WelcomeSection() {
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
                        <div className="atlas-badge">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                            </span>
                            15.000+ bedrijven en diensten in Nederland
                        </div>

                        <h1 className="atlas-title display-font">
                            Vind lokale bedrijven die passen bij jouw buurt
                            <span> en ontdek het beste aanbod.</span>
                        </h1>

                        <p className="atlas-subtitle">
                            Van restaurants tot aannemers: ontdek betrouwbare ondernemers, vergelijk
                            opties en neem direct contact op via het lokale atlas van Nederland.
                        </p>

                        <div className="search-container">
                            <div className="search-glow"></div>
                            <div className="search-bar">
                                <Search className="ml-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder="Zoek op bedrijf, product of dienst..."
                                />
                                <button onClick={handleSearch} className="search-btn">
                                    Zoeken
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="text-white/60 text-sm">Populair:</span>
                            {["Restaurants", "Kappers", "Loodgieters", "Advocaten"].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => router.push(`/search?q=${item.toLowerCase()}`)}
                                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm transition-all"
                                >
                                    {item}
                                </button>
                            ))}
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
                            <div className="owner-metrics">
                                <div className="owner-metric">
                                    <strong>3 stappen</strong>
                                    Aanmelden
                                </div>
                                <div className="owner-metric">
                                    <strong>24/7</strong>
                                    Vindbaarheid
                                </div>
                                <div className="owner-metric">
                                    <strong>NL</strong>
                                    Landelijk bereik
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
