// @vitest-environment jsdom
/**
 * Component Tests — BusinessGrid
 *
 * Tests empty state, business card rendering, title, rating, links.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: any) => (
            <div className={className} {...props}>{children}</div>
        ),
    },
}));

vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} {...props} />
    ),
}));

vi.mock('next/link', () => ({
    default: ({ href, children, className }: any) => (
        <a href={href} className={className}>{children}</a>
    ),
}));

import { BusinessGrid } from '@/components/BusinessGrid';
import type { Business } from '@/lib/types';

// ── Fixture factory ───────────────────────────────────────────────────────────
function makeBusiness(overrides: Partial<Business> = {}): Business {
    return {
        id: 'biz-1',
        name: 'Test Salon',
        slug: 'test-salon',
        category: 'beauty',
        subcategories: ['Kapper'],
        tags: [],
        shortDescription: 'Professionele kapper in Utrecht',
        longDescription: '',
        highlights: [],
        services: [],
        products: [],
        images: { logo: '/logo.jpg', cover: '/cover.jpg', gallery: [] },
        address: { street: 'Teststraat 1', city: 'Utrecht', postalCode: '3511 AB', neighborhood: 'Centrum', coordinates: { lat: 52.09, lng: 5.12 } },
        contact: { phone: '030-1234567', email: 'info@test.nl', website: 'https://test.nl', socials: {} },
        openingHours: [],
        paymentMethods: [],
        languages: [],
        amenities: [],
        serviceArea: '',
        bookingUrl: '',
        cta: { text: 'Bellen', link: 'tel:030-1234567', type: 'call' },
        reviews: { average: 4.5, count: 8, items: [] },
        faq: [],
        certifications: [],
        kvk: '12345678',
        foundedYear: 2010,
        details: { policies: '', lastUpdate: '01-01-2025', status: 'published' },
        seo: { title: '', metaDescription: '', h1: '', keywords: [], canonicalUrl: '', localSeoText: '', structuredData: null },
        ...overrides,
    } as Business;
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('BusinessGrid', () => {
    it('renders empty state when businesses array is empty', () => {
        render(<BusinessGrid businesses={[]} />);
        expect(screen.getByText(/geen bedrijven gevonden/i)).toBeInTheDocument();
    });

    it('does NOT render the empty state when there are businesses', () => {
        render(<BusinessGrid businesses={[makeBusiness()]} />);
        expect(screen.queryByText(/geen bedrijven gevonden/i)).not.toBeInTheDocument();
    });

    it('renders business name', () => {
        render(<BusinessGrid businesses={[makeBusiness({ name: 'Super Kapper' })]} />);
        expect(screen.getByText('Super Kapper')).toBeInTheDocument();
    });

    it('renders short description', () => {
        render(<BusinessGrid businesses={[makeBusiness()]} />);
        expect(screen.getByText('Professionele kapper in Utrecht')).toBeInTheDocument();
    });

    it('renders city name', () => {
        render(<BusinessGrid businesses={[makeBusiness()]} />);
        expect(screen.getByText('Utrecht')).toBeInTheDocument();
    });

    it('renders rating value', () => {
        render(<BusinessGrid businesses={[makeBusiness()]} />);
        expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('renders a link to the business detail page', () => {
        render(<BusinessGrid businesses={[makeBusiness({ slug: 'test-salon' })]} />);
        const link = screen.getByRole('link', { name: /bekijk details/i });
        expect(link).toHaveAttribute('href', '/utrecht/bedrijf/test-salon');
    });

    it('renders the h2 title when title prop is provided', () => {
        render(<BusinessGrid businesses={[makeBusiness()]} title="Populaire kappers" />);
        expect(screen.getByRole('heading', { level: 2, name: 'Populaire kappers' })).toBeInTheDocument();
    });

    it('does NOT render h2 when title prop is omitted', () => {
        render(<BusinessGrid businesses={[makeBusiness()]} />);
        expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('renders cover image with correct alt text', () => {
        render(<BusinessGrid businesses={[makeBusiness({ name: 'Mooie Kapper' })]} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', expect.stringContaining('Mooie Kapper'));
    });

    it('renders multiple business cards', () => {
        const businesses = [
            makeBusiness({ id: '1', name: 'Salon A', slug: 'salon-a' }),
            makeBusiness({ id: '2', name: 'Salon B', slug: 'salon-b' }),
            makeBusiness({ id: '3', name: 'Salon C', slug: 'salon-c' }),
        ];
        render(<BusinessGrid businesses={businesses} />);
        expect(screen.getByText('Salon A')).toBeInTheDocument();
        expect(screen.getByText('Salon B')).toBeInTheDocument();
        expect(screen.getByText('Salon C')).toBeInTheDocument();
    });

    it('renders subcategory label when available', () => {
        render(<BusinessGrid businesses={[makeBusiness({ subcategories: ['Kapper'] })]} />);
        expect(screen.getByText('Kapper')).toBeInTheDocument();
    });

    it('falls back to category when subcategories is empty', () => {
        render(<BusinessGrid businesses={[makeBusiness({ subcategories: [], category: 'beauty' })]} />);
        expect(screen.getByText('beauty')).toBeInTheDocument();
    });
});
