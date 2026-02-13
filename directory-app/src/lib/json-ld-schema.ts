/**
 * JSON-LD Schema Utilities for SEO Rich Snippets
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BusinessSchemaData {
  name: string;
  description: string;
  url: string;
  image?: string;
  logo?: string;
  telephone?: string;
  email?: string;
  website?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: { day: string; open?: string; close?: string; closed?: boolean }[];
  priceRange?: string;
  rating?: number;
  reviewCount?: number;
  foundedYear?: number;
  kvkNumber?: string;
  serviceArea?: string;
  categories?: string[];
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NL Directory",
    "url": "https://nldirectory.nl",
    "logo": "https://nldirectory.nl/logo.png",
    "sameAs": [
      "https://facebook.com/nldirectory",
      "https://instagram.com/nldirectory",
      "https://twitter.com/nldirectory"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+31-85-123-4567",
      "contactType": "customer service",
      "availableLanguage": "Dutch"
    }
  };
}

/**
 * Generate WebSite schema with search capability
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NL Directory - Lokale Bedrijvengids Nederland",
    "url": "https://nldirectory.nl",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://nldirectory.nl/zoeken?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item) => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generate WebPage schema
 */
export function generateWebPageSchema(params: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": params.name,
    "description": params.description,
    "url": params.url,
    "datePublished": params.datePublished || "2024-01-01",
    "dateModified": params.dateModified || new Date().toISOString(),
    "inLanguage": "nl-NL"
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate City/Place schema
 */
export function generatePlaceSchema(params: {
  name: string;
  description: string;
  url: string;
  address?: {
    addressLocality: string;
    addressRegion?: string;
    addressCountry?: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": params.name,
    "description": params.description,
    "url": params.url,
    "address": params.address ? {
      "@type": "PostalAddress",
      ...params.address
    } : undefined
  };
}

/**
 * Generate LocalBusiness schema for Google Rich Results
 */
export function generateLocalBusinessSchema(data: BusinessSchemaData) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": getBusinessType(data.categories),
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "telephone": data.telephone,
    "email": data.email,
  };

  // Add image/logo
  if (data.image || data.logo) {
    schema.image = data.image || data.logo;
  }

  // Add address
  if (data.streetAddress || data.addressLocality) {
    schema.address = {
      "@type": "PostalAddress",
      "streetAddress": data.streetAddress,
      "addressLocality": data.addressLocality,
      "addressRegion": data.addressRegion,
      "postalCode": data.postalCode,
      "addressCountry": data.addressCountry || "NL"
    };
  }

  // Add coordinates
  if (data.latitude && data.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": data.latitude,
      "longitude": data.longitude
    };
  }

  // Add opening hours
  if (data.openingHours && data.openingHours.length > 0) {
    const hours = formatOpeningHours(data.openingHours);
    if (hours) {
      schema.openingHoursSpecification = hours;
    }
  }

  // Add rating
  if (data.rating && data.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": data.rating,
      "reviewCount": data.reviewCount || 0,
      "bestRating": 5
    };
  }

  // Add price range
  if (data.priceRange) {
    schema.priceRange = data.priceRange;
  }

  // Add founding year
  if (data.foundedYear) {
    schema.foundingDate = data.foundedYear.toString();
  }

  // Add KVK number
  if (data.kvkNumber) {
    schema.additionalProperty = {
      "@type": "PropertyValue",
      "name": "KVK-nummer",
      "value": data.kvkNumber
    };
  }

  return schema;
}

/**
 * Get the appropriate schema.org business type based on category
 */
function getBusinessType(categories?: string[]): string {
  if (!categories) return "LocalBusiness";

  const categoryLower = categories.map(c => c.toLowerCase()).join(' ');

  if (categoryLower.includes('restaurant') || categoryLower.includes('café') || categoryLower.includes('eet')) {
    return "Restaurant";
  }
  if (categoryLower.includes('hotel') || categoryLower.includes('pension') || categoryLower.includes('logies')) {
    return "Hotel";
  }
  if (categoryLower.includes('winkel') || categoryLower.includes('store') || categoryLower.includes('shop')) {
    return "Store";
  }
  if (categoryLower.includes('health') || categoryLower.includes('arts') || categoryLower.includes('praktijk') || categoryLower.includes('dokter')) {
    return "MedicalOrganization";
  }
  if (categoryLower.includes('school') || categoryLower.includes('educatie') || categoryLower.includes('opleiding')) {
    return "EducationalOrganization";
  }
  if (categoryLower.includes('sports') || categoryLower.includes('fitness') || categoryLower.includes('gym')) {
    return "SportsActivityLocation";
  }

  return "LocalBusiness";
}

/**
 * Format opening hours for schema.org
 */
function formatOpeningHours(hours: { day: string; open?: string; close?: string; closed?: boolean }[]) {
  const dayMap: Record<string, string> = {
    'maandag': 'Monday',
    'dinsdag': 'Tuesday',
    'woensdag': 'Wednesday',
    'donderdag': 'Thursday',
    'vrijdag': 'Friday',
    'zaterdag': 'Saturday',
    'zondag': 'Sunday',
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday'
  };

  return hours
    .filter(h => !h.closed && h.open && h.close)
    .map(h => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": dayMap[h.day.toLowerCase()] || h.day,
      "opens": h.open,
      "closes": h.close
    }));
}

/**
 * Generate collection page schema (for category/city listings)
 */
export function generateCollectionPageSchema(params: {
  name: string;
  description: string;
  url: string;
  itemCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": params.name,
    "description": params.description,
    "url": params.url,
    "numberOfItems": params.itemCount
  };
}

/**
 * Generate complete page schema set
 */
export function generatePageSchemas(params: {
  organization?: boolean;
  webSite?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  webPage?: {
    name: string;
    description: string;
    url: string;
  };
  faqs?: FaqItem[];
  place?: {
    name: string;
    description: string;
    url: string;
    address?: {
      addressLocality: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  };
}) {
  const schemas: any[] = [];

  if (params.organization !== false) {
    schemas.push(generateOrganizationSchema());
  }

  if (params.webSite !== false) {
    schemas.push(generateWebSiteSchema());
  }

  if (params.webPage) {
    schemas.push(generateWebPageSchema(params.webPage));
  }

  if (params.faqs && params.faqs.length > 0) {
    schemas.push(generateFaqSchema(params.faqs));
  }

  if (params.place) {
    schemas.push(generatePlaceSchema(params.place));
  }

  return schemas.map(s => JSON.stringify(s)).join('\n');
}
