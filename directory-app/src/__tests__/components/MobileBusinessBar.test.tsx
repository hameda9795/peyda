// @vitest-environment jsdom
/**
 * Component Tests — MobileBusinessBar
 *
 * Tests the bottom action bar shown on mobile for a business page.
 * Verifies correct rendering of CTA, phone, WhatsApp and website buttons.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const { trackPhoneClick, trackWhatsAppClick, trackBookingClick } = vi.hoisted(() => ({
    trackPhoneClick: vi.fn(),
    trackWhatsAppClick: vi.fn(),
    trackBookingClick: vi.fn(),
}));

vi.mock('@/lib/tracking', () => ({
    trackPhoneClick,
    trackWhatsAppClick,
    trackBookingClick,
    trackWebsiteClick: vi.fn(),
}));

// Mock next/link to render a plain <a> tag so we can test hrefs without a router
vi.mock('next/link', () => ({
    default: ({ href, children, onClick, className, ...props }: any) => (
        <a href={href} onClick={onClick} className={className} {...props}>
            {children}
        </a>
    ),
}));

import { MobileBusinessBar } from '@/components/business/MobileBusinessBar';
import type { Business } from '@/lib/types';

// ── Fixture factory ───────────────────────────────────────────────────────────
function makeBusiness(overrides: Partial<Business['contact']> = {}, ctaOverrides: Partial<Business['cta']> = {}): Business {
    return {
        id: 'biz-test-1',
        name: 'Test Kapper',
        slug: 'test-kapper',
        category: 'beauty',
        subcategories: [],
        tags: [],
        shortDescription: '',
        longDescription: '',
        highlights: [],
        services: [],
        images: { logo: '', cover: '', gallery: [] },
        address: {
            street: 'Teststraat 1',
            postalCode: '1234AB',
            city: 'Amsterdam',
            neighborhood: 'Centrum',
            province: 'Noord-Holland',
        },
        contact: {
            phone: '06-12345678',
            email: 'test@test.nl',
            website: 'https://test.nl',
            socials: {},
            ...overrides,
        },
        openingHours: [],
        paymentMethods: [],
        languages: [],
        amenities: [],
        serviceArea: '',
        bookingUrl: '',
        cta: {
            text: 'Reserveren',
            link: '/reserveren',
            type: 'booking',
            ...ctaOverrides,
        },
        reviews: { average: 0, count: 0, items: [] },
        faq: [],
        isVerified: false,
        publishStatus: 'PUBLISHED',
        categorySlug: 'beauty',
        subcategorySlug: 'kapper',
        provinceSlug: 'noord-holland',
        citySlug: 'amsterdam',
        neighborhoodSlug: 'centrum',
        certifications: [],
    } as unknown as Business;
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('MobileBusinessBar — CTA button', () => {
    it('always renders the primary CTA button', () => {
        render(<MobileBusinessBar business={makeBusiness()} />);
        expect(screen.getByText('Reserveren')).toBeInTheDocument();
    });

    it('uses the correct CTA link', () => {
        render(<MobileBusinessBar business={makeBusiness({}, { link: '/boek-nu', text: 'Boek Nu' })} />);
        const cta = screen.getByText('Boek Nu').closest('a');
        expect(cta).toHaveAttribute('href', '/boek-nu');
    });

    it('calls trackBookingClick when CTA is clicked', () => {
        render(<MobileBusinessBar business={makeBusiness()} />);
        fireEvent.click(screen.getByText('Reserveren'));
        expect(trackBookingClick).toHaveBeenCalledWith('biz-test-1');
    });
});

describe('MobileBusinessBar — Phone button', () => {
    it('renders phone button when phone is provided', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: '06-12345678' })} />);
        const phoneLink = screen.getByRole('link', { name: /bellen/i });
        expect(phoneLink).toBeInTheDocument();
        expect(phoneLink).toHaveAttribute('href', 'tel:06-12345678');
    });

    it('does NOT render phone button when phone is empty', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: undefined })} />);
        expect(screen.queryByRole('link', { name: /bellen/i })).not.toBeInTheDocument();
    });

    it('calls trackPhoneClick when phone button is clicked', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: '06-12345678' })} />);
        fireEvent.click(screen.getByRole('link', { name: /bellen/i }));
        expect(trackPhoneClick).toHaveBeenCalledWith('biz-test-1');
    });
});

describe('MobileBusinessBar — WhatsApp button', () => {
    it('renders WhatsApp button when phone is provided', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: '0612345678' })} />);
        const waLink = screen.getByRole('link', { name: /whatsapp/i });
        expect(waLink).toBeInTheDocument();
        expect(waLink).toHaveAttribute('href', expect.stringContaining('wa.me'));
    });

    it('WhatsApp link contains the business phone digits', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: '06-12345678' })} />);
        const waLink = screen.getByRole('link', { name: /whatsapp/i });
        expect(waLink).toHaveAttribute('href', expect.stringContaining('0612345678'));
    });

    it('WhatsApp link opens in new tab (security)', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: '0612345678' })} />);
        const waLink = screen.getByRole('link', { name: /whatsapp/i });
        expect(waLink).toHaveAttribute('target', '_blank');
        expect(waLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('calls trackWhatsAppClick when WhatsApp button is clicked', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: '0612345678' })} />);
        fireEvent.click(screen.getByRole('link', { name: /whatsapp/i }));
        expect(trackWhatsAppClick).toHaveBeenCalledWith('biz-test-1');
    });

    it('does NOT render WhatsApp button when phone is undefined', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: undefined })} />);
        expect(screen.queryByRole('link', { name: /whatsapp/i })).not.toBeInTheDocument();
    });
});

describe('MobileBusinessBar — Website button', () => {
    it('renders website button when no WhatsApp (phone absent) but website present', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: undefined, website: 'https://test.nl' })} />);
        const siteLink = screen.getByRole('link', { name: /website/i });
        expect(siteLink).toBeInTheDocument();
        expect(siteLink).toHaveAttribute('href', 'https://test.nl');
    });

    it('does NOT render website button when WhatsApp is shown (prefers WhatsApp)', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: '0612345678', website: 'https://test.nl' })} />);
        expect(screen.queryByRole('link', { name: /website/i })).not.toBeInTheDocument();
    });

    it('website button opens in new tab', () => {
        render(<MobileBusinessBar business={makeBusiness({ phone: undefined, website: 'https://test.nl' })} />);
        const siteLink = screen.getByRole('link', { name: /website/i });
        expect(siteLink).toHaveAttribute('target', '_blank');
        expect(siteLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
});

describe('MobileBusinessBar — Accessibility', () => {
    beforeEach(() => vi.clearAllMocks());

    it('phone link has aria-label', () => {
        render(<MobileBusinessBar business={makeBusiness()} />);
        expect(screen.getByLabelText(/bellen/i)).toBeInTheDocument();
    });

    it('whatsapp link has aria-label', () => {
        render(<MobileBusinessBar business={makeBusiness()} />);
        expect(screen.getByLabelText(/whatsapp/i)).toBeInTheDocument();
    });
});
