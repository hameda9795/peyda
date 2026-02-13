import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe, MapPin, Star } from "lucide-react";

export function BusinessPassportSection() {
    return (
        <section className="passport-section">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="passport-grid">
                    <div className="passport-card">
                        <div className="passport-stamp">VERIFIED</div>
                        <div className="passport-title">Business Passport</div>
                        <div className="passport-field">
                            <span>Bedrijf</span>
                            <strong>Jouw Bedrijfsnaam</strong>
                        </div>
                        <div className="passport-field">
                            <span>Locatie</span>
                            <strong>Utrecht, NL</strong>
                        </div>
                        <div className="passport-field">
                            <span>Categorie</span>
                            <strong>Lokale dienst</strong>
                        </div>
                        <div className="passport-badges">
                            <span className="passport-badge">Geverifieerd</span>
                            <span className="passport-badge">SEO-ready</span>
                            <span className="passport-badge">Reviews aan</span>
                            <span className="passport-badge">Direct contact</span>
                        </div>
                    </div>

                    <div className="passport-copy">
                        <h2>Het lokale paspoort dat jouw bedrijf sneller vindbaar maakt.</h2>
                        <p>
                            Geef je bedrijf een herkenbare, rijke pagina die vertrouwen opbouwt en
                            helpt om hoger te scoren in lokale zoekopdrachten. Alles is ontworpen om
                            klanten sneller te laten kiezen.
                        </p>
                        <div className="passport-list">
                            <span><BadgeCheck className="w-4 h-4 text-emerald-600" /> Verzamelt reviews en social proof</span>
                            <span><MapPin className="w-4 h-4 text-emerald-600" /> Lokale zoekresultaten met duidelijke regio</span>
                            <span><Star className="w-4 h-4 text-emerald-600" /> Highlight badges voor topkwaliteit</span>
                            <span><Globe className="w-4 h-4 text-emerald-600" /> Deelbaar profiel voor Google en social</span>
                        </div>
                        <Link href="/bedrijf-aanmelden" className="passport-cta">
                            Maak jouw bedrijfspaspoort
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
