import "@/app/seo.css";
import "@/app/home.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBusinessBySlug, getRelatedBusinessesBySlug } from "@/lib/actions/business";
import { getCategories } from "@/lib/actions/categories";
import { NETHERLANDS_PROVINCES } from "@/lib/netherlands-data";
import { TrackedLink } from "@/components/TrackedLinks";
import { TrackPageView } from "@/components/business/TrackPageView";
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateLocalBusinessSchema,
  type FaqItem
} from "@/lib/json-ld-schema";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl';

type Props = {
  params: Promise<{ slug: string }>;
};

// Find province by city name
const findProvinceByCityName = (cityName: string) => {
  const lower = cityName.toLowerCase();
  for (const province of NETHERLANDS_PROVINCES) {
    const match = province.cities.find((city) => city.name.toLowerCase() === lower);
    if (match) return province;
  }
  return null;
};

// Helper to format opening hours for display
const formatHoursForDisplay = (hours: any[]) => {
  if (!hours || !Array.isArray(hours)) return null;

  const dayNames: Record<string, string> = {
    'monday': 'Maandag',
    'tuesday': 'Dinsdag',
    'wednesday': 'Woensdag',
    'thursday': 'Donderdag',
    'friday': 'Vrijdag',
    'saturday': 'Zaterdag',
    'sunday': 'Zondag',
    'maandag': 'Maandag',
    'dinsdag': 'Dinsdag',
    'woensdag': 'Woensdag',
    'donderdag': 'Donderdag',
    'vrijdag': 'Vrijdag',
    'zaterdag': 'Zaterdag',
    'zondag': 'Zondag'
  };

  return hours.map(h => ({
    ...h,
    dayName: dayNames[h.day?.toLowerCase()] || h.day
  }));
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return { title: "Bedrijf niet gevonden | NL Directory" };
  }

  const province = findProvinceByCityName(business.address.city);

  return {
    title: business.seo?.title || `${business.name} | ${business.category} in ${business.address.city}`,
    description: business.seo?.metaDescription || business.shortDescription,
    openGraph: {
      title: business.name,
      description: business.shortDescription || `Ontdek ${business.name}, ${business.category} in ${business.address.city}`,
      images: business.images?.cover ? [business.images.cover] : [],
    }
  };
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const relatedBusinesses = await getRelatedBusinessesBySlug(slug, 4);
  const categories = await getCategories();

  const province = findProvinceByCityName(business.address.city);
  const pageUrl = `${BASE_URL}/bedrijven/${slug}`;
  const formattedHours = formatHoursForDisplay(business.openingHours);

  // Generate FAQs
  const faqs: FaqItem[] = business.faq?.length > 0
    ? business.faq
    : [
        {
          question: `Wat zijn de openingstijden van ${business.name}?`,
          answer: formattedHours
            ? formattedHours.map(h => `${h.dayName}: ${h.closed ? 'Gesloten' : `${h.open} - ${h.close}`}`).join('\n')
            : `Neem contact op voor de actuele openingstijden.`
        },
        {
          question: `Waar is ${business.name} gevestigd?`,
          answer: `${business.name} is gevestigd in ${business.address.city}${business.address.neighborhood ? `, ${business.address.neighborhood}` : ''}.`
        },
        {
          question: `Welke diensten biedt ${business.name} aan?`,
          answer: business.services && business.services.length > 0
            ? business.services.map((s: any) => s.name).join(', ')
            : `Neem contact op voor meer informatie over de aangeboden diensten.`
        }
      ];

  // Generate JSON-LD schemas
  const breadcrumbs = [
    { name: "Home", url: BASE_URL, position: 1 },
    ...(province ? [{ name: "Steden", url: `${BASE_URL}/steden`, position: 2 }] : []),
    ...(province ? [{ name: province.name, url: `${BASE_URL}/provincies/${province.slug}`, position: 3 }] : []),
    ...(province ? [{ name: business.address.city, url: `${BASE_URL}/steden/${province.slug}`, position: 4 }] : []),
    { name: business.name, url: pageUrl, position: 5 },
  ];

  const schemaScripts = JSON.stringify([
    generateWebPageSchema({
      name: business.seo?.title || `${business.name} | ${business.category}`,
      description: business.seo?.metaDescription || business.shortDescription || '',
      url: pageUrl
    }),
    generateBreadcrumbSchema(breadcrumbs),
    generateLocalBusinessSchema({
      name: business.name,
      description: business.shortDescription || business.longDescription || '',
      url: pageUrl,
      image: business.images?.cover,
      logo: business.images?.logo,
      telephone: business.contact.phone,
      email: business.contact.email,
      website: business.contact.website,
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: province?.name,
      postalCode: business.address.postalCode,
      addressCountry: "NL",
      openingHours: business.openingHours,
      rating: business.reviews?.average,
      reviewCount: business.reviews?.count,
      foundedYear: business.foundedYear,
      kvkNumber: business.kvk,
      categories: [business.category]
    }),
    ...(faqs.length > 0 ? [generateFaqSchema(faqs)] : [])
  ]);

  return (
    <>
      {/* Track page view */}
      <TrackPageView business={business} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaScripts }}
      />
      <main className="seo-shell">
        <div className="seo-container">
          {/* Breadcrumb */}
          <nav className="seo-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/steden">Steden</Link>
            {province && (
              <>
                <span>/</span>
                <Link href={`/provincies/${province.slug}`}>{province.name}</Link>
              </>
            )}
            {province && (
              <>
                <span>/</span>
                <Link href={`/steden/${province.slug}`}>{business.address.city}</Link>
              </>
            )}
            <span>/</span>
            <span>{business.name}</span>
          </nav>

          {/* Hero Section */}
          <section className="seo-hero">
            <div className="seo-hero-grid">
              <div>
                <span className="seo-kicker">{business.category}</span>
                <h1 className="seo-title">{business.name}</h1>
                <p className="seo-subtitle">
                  {business.shortDescription}
                </p>
                <div className="seo-meta">
                  {province && <span>{province.icon} {business.address.city}</span>}
                  {business.address.neighborhood && <span>{business.address.neighborhood}</span>}
                  {business.reviews?.average > 0 && (
                    <span>⭐ {business.reviews.average.toFixed(1)} ({business.reviews.count} reviews)</span>
                  )}
                </div>
                <div className="seo-hero-actions">
                  {business.contact.phone && (
                    <TrackedLink businessId={business.id} type="phone" href={`tel:${business.contact.phone}`} className="seo-cta">
                      Bel nu
                    </TrackedLink>
                  )}
                  {business.bookingUrl && (
                    <TrackedLink businessId={business.id} type="booking" href={business.bookingUrl} className="seo-chip">
                      Reserveren
                    </TrackedLink>
                  )}
                  <Link href={`/categorieen/${business.subcategories?.[0]?.toLowerCase() || ''}`} className="seo-chip">
                    Bekijk meer {business.category.toLowerCase()}
                  </Link>
                </div>
              </div>
              <div className="seo-hero-panel">
                {business.images?.cover ? (
                  <img
                    src={business.images.cover}
                    alt={business.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ) : (
                  <div className="seo-icon-badge">🏢</div>
                )}
                {business.images?.logo && (
                  <img
                    src={business.images.logo}
                    alt={`${business.name} logo`}
                    style={{ width: '80px', height: '80px', objectFit: 'contain', marginTop: '-40px', position: 'relative', zIndex: 1, background: 'white', borderRadius: '8px', padding: '8px' }}
                  />
                )}
                <div className="seo-card-title">{business.name}</div>
                <p className="seo-card-meta">
                  {business.address.street}, {business.address.postalCode} {business.address.city}
                </p>
                <div className="seo-stat-grid">
                  <div className="seo-stat">
                    <span>Telefoon</span>
                    {business.contact.phone || '-'}
                  </div>
                  <div className="seo-stat">
                    <span>Website</span>
                    {business.contact.website ? (
                      <TrackedLink businessId={business.id} type="website" href={business.contact.website} className="">
                        Bekijk
                      </TrackedLink>
                    ) : '-'}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Main Content */}
        <div className="seo-container">
          {/* Description */}
          <section className="seo-section">
            <h2 className="seo-section-title">Over {business.name}</h2>
            <div className="seo-surface">
              {business.longDescription ? (
                <div className="content-text">
                  {business.longDescription.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p>{business.shortDescription}</p>
              )}
            </div>
          </section>

          {/* Contact Info Grid */}
          <section className="seo-section">
            <h2 className="seo-section-title">Contactinformatie</h2>
            <div className="seo-grid-3">
              {/* Address */}
              <div className="seo-card">
                <div className="seo-card-title">📍 Adres</div>
                <div className="seo-card-meta">
                  {business.address.street && <p>{business.address.street}</p>}
                  {business.address.postalCode && <p>{business.address.postalCode}</p>}
                  <p>{business.address.city}</p>
                  {business.address.neighborhood && <p>{business.address.neighborhood}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="seo-card">
                <div className="seo-card-title">📞 Contact</div>
                <div className="seo-card-meta">
                  {business.contact.phone && (
                    <p><TrackedLink businessId={business.id} type="phone" href={`tel:${business.contact.phone}`}>{business.contact.phone}</TrackedLink></p>
                  )}
                  {business.contact.email && (
                    <p><TrackedLink businessId={business.id} type="email" href={`mailto:${business.contact.email}`}>{business.contact.email}</TrackedLink></p>
                  )}
                  {business.contact.website && (
                    <p><TrackedLink businessId={business.id} type="website" href={business.contact.website}>Bezoek website</TrackedLink></p>
                  )}
                </div>
              </div>

              {/* Opening Hours */}
              <div className="seo-card">
                <div className="seo-card-title">🕐 Openingstijden</div>
                <div className="seo-card-meta">
                  {formattedHours?.map((h: any) => (
                    <p key={h.day}>
                      <strong>{h.dayName}:</strong>{' '}
                      {h.closed ? 'Gesloten' : `${h.open} - ${h.close}`}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          {business.services && business.services.length > 0 && (
            <section className="seo-section">
              <h2 className="seo-section-title">Diensten</h2>
              <div className="seo-chip-row">
                {business.services.map((service: any, idx: number) => (
                  <span key={idx} className="seo-chip">
                    {service.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Amenities & Payment */}
          <section className="seo-section">
            <div className="seo-grid-2">
              {business.amenities && business.amenities.length > 0 && (
                <div>
                  <h3 className="seo-section-title" style={{ fontSize: '1.2rem' }}>Voorzieningen</h3>
                  <div className="seo-chip-row">
                    {business.amenities.map((amenity: string, idx: number) => (
                      <span key={idx} className="seo-chip">{amenity}</span>
                    ))}
                  </div>
                </div>
              )}
              {business.paymentMethods && business.paymentMethods.length > 0 && (
                <div>
                  <h3 className="seo-section-title" style={{ fontSize: '1.2rem' }}>Betaalmethoden</h3>
                  <div className="seo-chip-row">
                    {business.paymentMethods.map((method: string, idx: number) => (
                      <span key={idx} className="seo-chip">{method}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Social Media */}
          {(business.contact.socials?.instagram || business.contact.socials?.facebook || business.contact.socials?.linkedin) && (
            <section className="seo-section">
              <h2 className="seo-section-title">Volg ons</h2>
              <div className="seo-chip-row">
                {business.contact.socials?.instagram && (
                  <TrackedLink businessId={business.id} type="website" href={business.contact.socials.instagram} className="seo-chip">
                    Instagram
                  </TrackedLink>
                )}
                {business.contact.socials?.facebook && (
                  <TrackedLink businessId={business.id} type="website" href={business.contact.socials.facebook} className="seo-chip">
                    Facebook
                  </TrackedLink>
                )}
                {business.contact.socials?.linkedin && (
                  <TrackedLink businessId={business.id} type="website" href={business.contact.socials.linkedin} className="seo-chip">
                    LinkedIn
                  </TrackedLink>
                )}
              </div>
            </section>
          )}

          {/* Reviews Summary */}
          {business.reviews && business.reviews.count > 0 && (
            <section className="seo-section seo-surface">
              <h2 className="seo-section-title">Reviews</h2>
              <div className="seo-rating">
                <span className="seo-rating-score">
                  ⭐ {business.reviews.average.toFixed(1)}
                </span>
                <span className="seo-rating-count">
                  ({business.reviews.count} reviews)
                </span>
              </div>
            </section>
          )}

          {/* FAQ */}
          {faqs.length > 0 && (
            <section className="seo-section">
              <h2 className="seo-section-title">Veelgestelde vragen</h2>
              <div className="faq-list">
                {faqs.map((faq: FaqItem, idx: number) => (
                  <details key={idx} className="faq-item">
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related Businesses */}
          {relatedBusinesses.length > 0 && (
            <section className="seo-section">
              <h2 className="seo-section-title">Meer {business.category} in de buurt</h2>
              <div className="seo-grid">
                {relatedBusinesses.map((related: any) => (
                  <Link
                    key={related.id}
                    href={`/bedrijven/${related.slug}`}
                    className="seo-card"
                  >
                    <div className="seo-card-title">{related.name}</div>
                    <div className="seo-card-meta">
                      {related.category} • {related.address.city}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Navigation Links */}
          <section className="seo-section">
            <h2 className="seo-section-title">Meer ontdekken</h2>
            <div className="seo-rail">
              <div className="seo-rail-item">
                <Link href={`/steden/${province?.slug || 'utrecht'}`} className="seo-chip">
                  Alle bedrijven in {business.address.city}
                </Link>
              </div>
              <div className="seo-rail-item">
                <Link href="/categorieen" className="seo-chip">
                  Alle categorieën
                </Link>
              </div>
              <div className="seo-rail-item">
                <Link href="/steden" className="seo-chip">
                  Overzicht alle steden
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
