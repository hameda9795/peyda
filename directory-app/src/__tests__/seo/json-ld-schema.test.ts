/**
 * SEO Unit Tests — JSON-LD Schema generators (src/lib/json-ld-schema.ts)
 *
 * These functions produce the structured data that Google reads for Rich Results.
 * A bug here = lost rich snippets in search results.
 */
import { describe, it, expect } from 'vitest';
import {
    generateOrganizationSchema,
    generateWebSiteSchema,
    generateBreadcrumbSchema,
    generateWebPageSchema,
    generateFaqSchema,
    generateLocalBusinessSchema,
    generateCollectionPageSchema,
    generatePlaceSchema,
    type BreadcrumbItem,
    type FaqItem,
    type BusinessSchemaData,
} from '@/lib/json-ld-schema';

// ─── Organization Schema ──────────────────────────────────────────────────────
describe('generateOrganizationSchema', () => {
    it('has correct @context and @type', () => {
        const schema = generateOrganizationSchema();
        expect(schema['@context']).toBe('https://schema.org');
        expect(schema['@type']).toBe('Organization');
    });

    it('includes a name and url', () => {
        const schema = generateOrganizationSchema();
        expect(schema.name).toBeTruthy();
        expect(schema.url).toMatch(/^https?:\/\//);
    });

    it('includes a logo URL', () => {
        const schema = generateOrganizationSchema();
        expect(schema.logo).toMatch(/^https?:\/\//);
    });

    it('is valid JSON (serializable)', () => {
        expect(() => JSON.stringify(generateOrganizationSchema())).not.toThrow();
    });
});

// ─── WebSite Schema ───────────────────────────────────────────────────────────
describe('generateWebSiteSchema', () => {
    it('has @type WebSite', () => {
        const schema = generateWebSiteSchema();
        expect(schema['@type']).toBe('WebSite');
    });

    it('has a SearchAction with correct search URL template', () => {
        const schema = generateWebSiteSchema();
        expect(schema.potentialAction['@type']).toBe('SearchAction');
        expect(schema.potentialAction.target.urlTemplate).toContain('{search_term_string}');
    });

    it('search URL points to site domain', () => {
        const schema = generateWebSiteSchema();
        expect(schema.potentialAction.target.urlTemplate).toContain('peyda.nl');
    });
});

// ─── BreadcrumbList Schema ────────────────────────────────────────────────────
describe('generateBreadcrumbSchema', () => {
    const items: BreadcrumbItem[] = [
        { name: 'Home', url: 'https://peyda.nl', position: 1 },
        { name: 'Categorieen', url: 'https://peyda.nl/categorieen', position: 2 },
        { name: 'Beauty', url: 'https://peyda.nl/categorieen/beauty', position: 3 },
    ];

    it('has @type BreadcrumbList', () => {
        expect(generateBreadcrumbSchema(items)['@type']).toBe('BreadcrumbList');
    });

    it('generates correct number of ListItems', () => {
        const schema = generateBreadcrumbSchema(items);
        expect(schema.itemListElement).toHaveLength(3);
    });

    it('each item has correct position, name and url', () => {
        const schema = generateBreadcrumbSchema(items);
        schema.itemListElement.forEach((el: any, i: number) => {
            expect(el['@type']).toBe('ListItem');
            expect(el.position).toBe(i + 1);
            expect(el.name).toBe(items[i].name);
            expect(el.item).toBe(items[i].url);
        });
    });

    it('handles empty breadcrumb array', () => {
        const schema = generateBreadcrumbSchema([]);
        expect(schema.itemListElement).toHaveLength(0);
    });
});

// ─── FAQPage Schema ───────────────────────────────────────────────────────────
describe('generateFaqSchema', () => {
    const faqs: FaqItem[] = [
        { question: 'Wat zijn uw openingstijden?', answer: 'Maandag t/m vrijdag 9-17 uur.' },
        { question: 'Heeft u parkeerplaatsen?', answer: 'Ja, gratis parkeren voor de deur.' },
    ];

    it('has @type FAQPage', () => {
        expect(generateFaqSchema(faqs)['@type']).toBe('FAQPage');
    });

    it('generates correct number of questions', () => {
        const schema = generateFaqSchema(faqs);
        expect(schema.mainEntity).toHaveLength(2);
    });

    it('each question has @type Question with acceptedAnswer', () => {
        const schema = generateFaqSchema(faqs);
        schema.mainEntity.forEach((q: any, i: number) => {
            expect(q['@type']).toBe('Question');
            expect(q.name).toBe(faqs[i].question);
            expect(q.acceptedAnswer['@type']).toBe('Answer');
            expect(q.acceptedAnswer.text).toBe(faqs[i].answer);
        });
    });

    it('handles empty FAQ array', () => {
        const schema = generateFaqSchema([]);
        expect(schema.mainEntity).toHaveLength(0);
    });
});

// ─── LocalBusiness Schema ─────────────────────────────────────────────────────
describe('generateLocalBusinessSchema', () => {
    const baseData: BusinessSchemaData = {
        name: 'Kapper Amsterdam',
        description: 'De beste kapper van Amsterdam.',
        url: 'https://peyda.nl/amsterdam/centrum/beauty/kapper/kapper-amsterdam',
        telephone: '020-1234567',
        addressLocality: 'Amsterdam',
        addressRegion: 'Noord-Holland',
        addressCountry: 'NL',
    };

    it('has @context schema.org and a @type', () => {
        const schema = generateLocalBusinessSchema(baseData);
        expect(schema['@context']).toBe('https://schema.org');
        expect(schema['@type']).toBeTruthy();
    });

    it('defaults to LocalBusiness type when no categories given', () => {
        const schema = generateLocalBusinessSchema(baseData);
        expect(schema['@type']).toBe('LocalBusiness');
    });

    it('returns Restaurant type when categories include "restaurant"', () => {
        const schema = generateLocalBusinessSchema({
            ...baseData,
            categories: ['Eten & Drinken', 'Restaurant'],
        });
        expect(schema['@type']).toBe('Restaurant');
    });

    it('returns Store type when categories include "winkel"', () => {
        const schema = generateLocalBusinessSchema({
            ...baseData,
            categories: ['winkel'],
        });
        expect(schema['@type']).toBe('Store');
    });

    it('includes aggregateRating when rating > 0', () => {
        const schema = generateLocalBusinessSchema({
            ...baseData,
            rating: 4.7,
            reviewCount: 38,
        });
        expect(schema.aggregateRating['@type']).toBe('AggregateRating');
        expect(schema.aggregateRating.ratingValue).toBe(4.7);
        expect(schema.aggregateRating.reviewCount).toBe(38);
        expect(schema.aggregateRating.bestRating).toBe(5);
    });

    it('does NOT include aggregateRating when rating is 0', () => {
        const schema = generateLocalBusinessSchema({ ...baseData, rating: 0 });
        expect(schema.aggregateRating).toBeUndefined();
    });

    it('includes address when addressLocality is provided', () => {
        const schema = generateLocalBusinessSchema(baseData);
        expect(schema.address['@type']).toBe('PostalAddress');
        expect(schema.address.addressLocality).toBe('Amsterdam');
        expect(schema.address.addressCountry).toBe('NL');
    });

    it('includes geo coordinates when lat/lng provided', () => {
        const schema = generateLocalBusinessSchema({
            ...baseData,
            latitude: 52.3702,
            longitude: 4.8952,
        });
        expect(schema.geo['@type']).toBe('GeoCoordinates');
        expect(schema.geo.latitude).toBe(52.3702);
        expect(schema.geo.longitude).toBe(4.8952);
    });

    it('includes kvkNumber as additionalProperty', () => {
        const schema = generateLocalBusinessSchema({ ...baseData, kvkNumber: '12345678' });
        expect(schema.additionalProperty.name).toBe('KVK-nummer');
        expect(schema.additionalProperty.value).toBe('12345678');
    });

    it('includes opening hours when provided', () => {
        const schema = generateLocalBusinessSchema({
            ...baseData,
            openingHours: [
                { day: 'maandag', open: '09:00', close: '17:00' },
                { day: 'zondag', closed: true },
            ],
        });
        // Only non-closed days should appear
        expect(schema.openingHoursSpecification).toHaveLength(1);
        expect(schema.openingHoursSpecification[0].dayOfWeek).toBe('Monday');
    });

    it('is serializable to valid JSON', () => {
        expect(() => JSON.stringify(generateLocalBusinessSchema(baseData))).not.toThrow();
    });
});

// ─── WebPage Schema ───────────────────────────────────────────────────────────
describe('generateWebPageSchema', () => {
    it('has @type WebPage', () => {
        const schema = generateWebPageSchema({
            name: 'Contact',
            description: 'Neem contact op',
            url: 'https://peyda.nl/contact',
        });
        expect(schema['@type']).toBe('WebPage');
    });

    it('sets inLanguage to nl-NL', () => {
        const schema = generateWebPageSchema({
            name: 'Test',
            description: 'Test',
            url: 'https://peyda.nl/test',
        });
        expect(schema.inLanguage).toBe('nl-NL');
    });
});

// ─── CollectionPage Schema ────────────────────────────────────────────────────
describe('generateCollectionPageSchema', () => {
    it('has @type CollectionPage', () => {
        const schema = generateCollectionPageSchema({
            name: 'Alle kappers',
            description: 'Overzicht kappers',
            url: 'https://peyda.nl/categorieen/beauty',
            itemCount: 42,
        });
        expect(schema['@type']).toBe('CollectionPage');
        expect(schema.numberOfItems).toBe(42);
    });
});
