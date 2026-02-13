import "@/app/seo.css";
import "@/app/home.css";
import Link from "next/link";
import type { Metadata } from "next";
import { CITY_KEYWORDS } from "@/lib/city-keywords";

export const metadata: Metadata = {
  title: "Steden | Lokale Bedrijvengids Nederland",
  description: "Ontdek lokale bedrijven en diensten in alle grote steden van Nederland. Van Amsterdam tot Groningen, vind wat je zoekt.",
  openGraph: {
    title: "Steden | Lokale Bedrijvengids",
    description: "Ontdek lokale bedrijven en diensten in alle grote steden van Nederland",
  }
};

export default function CitiesPage() {
  const cities = Object.values(CITY_KEYWORDS);
  const majorCities = cities.filter(c =>
    ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "groningen", "leiden", "delft"].includes(c.slug)
  );
  const otherCities = cities.filter(c =>
    !["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "groningen", "leiden", "delft"].includes(c.slug)
  );

  return (
    <main className="seo-shell">
      <div className="seo-container">
        {/* Hero */}
        <section className="seo-hero">
          <div className="seo-hero-grid">
            <div>
              <span className="seo-kicker">🏙️ Steden</span>
              <h1 className="seo-title">Ontdek Bedrijven per Stad</h1>
              <p className="seo-subtitle">
                Vind lokale bedrijven, winkels en diensten in alle grote steden van Nederland.
                Van Amsterdam tot Groningen, wij helpen je de beste professionals te vinden.
              </p>
              <div className="seo-hero-actions">
                <Link href="/categorieen" className="seo-cta">
                  Bekijk alle categorieën
                </Link>
              </div>
            </div>
            <div className="seo-hero-panel">
              <div className="seo-icon-badge">🗺️</div>
              <div className="seo-card-title">Nederland</div>
              <p className="seo-card-meta">
                Ontdek lokale bedrijven in {cities.length} steden door heel Nederland.
              </p>
              <div className="seo-stat-grid">
                <div className="seo-stat">
                  <span>Steden</span>
                  {cities.length}
                </div>
                <div className="seo-stat">
                  <span>Provincies</span>
                  12
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Major Cities */}
        <section className="seo-section">
          <h2 className="seo-section-title">Grote Steden</h2>
          <div className="seo-grid">
            {majorCities.map((city) => (
              <Link
                key={city.slug}
                href={`/steden/${city.slug}`}
                className="seo-card"
              >
                <div className="seo-card-title">{city.name}</div>
                <div className="seo-card-meta">
                  {city.province} • {city.primaryKeywords[0]}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Cities */}
        <section className="seo-section">
          <h2 className="seo-section-title">Overige Steden</h2>
          <div className="seo-grid">
            {otherCities.map((city) => (
              <Link
                key={city.slug}
                href={`/steden/${city.slug}`}
                className="seo-card"
              >
                <div className="seo-card-title">{city.name}</div>
                <div className="seo-card-meta">
                  {city.province || 'Nederland'}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation Links */}
        <section className="seo-section">
          <h2 className="seo-section-title">Meer Ontdekken</h2>
          <div className="seo-rail">
            <div className="seo-rail-item">
              <Link href="/categorieen" className="seo-chip">
                Alle categorieën
              </Link>
            </div>
            <div className="seo-rail-item">
              <Link href="/provincies" className="seo-chip">
                Per provincie
              </Link>
            </div>
            <div className="seo-rail-item">
              <Link href="/" className="seo-chip">
                Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
