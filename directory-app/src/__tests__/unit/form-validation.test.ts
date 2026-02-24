/**
 * Unit tests — Business Registration Form Validation
 *
 * Tests the pure `validateStep` utility used by the multi-step registration form.
 * No DOM / React needed — pure logic only.
 */
import { describe, it, expect } from 'vitest';
import { validateStep } from '@/lib/validation/business-form-validation';
import type { BusinessFormData } from '@/lib/types/business-form';

// ── Base valid form data per step ──────────────────────────────────────────────
const base: BusinessFormData = {
    name: 'Test Kapper',
    category: 'cat-1',
    subcategories: ['sub-1'],
    shortDescription: 'Professionele kapper in Utrecht',
    street: 'Teststraat 1',
    postalCode: '1234AB',
    city: 'Utrecht',
    province: 'Utrecht',
    neighborhood: 'Centrum',
    phone: '030-1234567',
    email: 'test@kapper.nl',
    website: 'https://testkapper.nl',
    instagram: '',
    facebook: '',
    linkedin: '',
    openingHours: [],
    services: [
        { name: 'Knippen', description: '', price: '25' },
        { name: 'Wassen', description: '', price: '10' },
        { name: 'Föhnen', description: '', price: '15' },
    ],
    amenities: [],
    paymentMethods: [],
    languages: ['Nederlands'],
    logo: null,
    coverImage: new File([''], 'cover.jpg'),
    gallery: [],
    videoUrl: '',
    kvkNumber: '12345678',
    foundedYear: '2010',
    certifications: [],
    bookingUrl: '',
    ctaType: 'call',
    serviceArea: '',
    faq: Array.from({ length: 5 }, (_, i) => ({
        question: `Vraag ${i + 1}`,
        answer: `Antwoord ${i + 1}`,
    })),
};

// ── Step 1: Basic info ─────────────────────────────────────────────────────────
describe('validateStep — Step 1 (Basisgegevens)', () => {
    it('is valid when all required fields are filled', () => {
        expect(validateStep(1, base)).toEqual({ isValid: true, error: null });
    });

    it('fails when name is empty', () => {
        const result = validateStep(1, { ...base, name: '' });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Bedrijfsnaam');
    });

    it('fails when category is not selected', () => {
        const result = validateStep(1, { ...base, category: '' });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('categorie');
    });

    it('fails when no subcategory selected', () => {
        const result = validateStep(1, { ...base, subcategories: [] });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('subcategorie');
    });

    it('fails when short description is empty', () => {
        const result = validateStep(1, { ...base, shortDescription: '' });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('omschrijving');
    });
});

// ── Step 2: Address & Contact ──────────────────────────────────────────────────
describe('validateStep — Step 2 (Locatie & Contact)', () => {
    it('is valid when all required fields are filled', () => {
        expect(validateStep(2, base)).toEqual({ isValid: true, error: null });
    });

    it('fails when street is empty', () => {
        expect(validateStep(2, { ...base, street: '' }).isValid).toBe(false);
    });

    it('fails when postalCode is empty', () => {
        expect(validateStep(2, { ...base, postalCode: '' }).isValid).toBe(false);
    });

    it('fails when city is empty', () => {
        expect(validateStep(2, { ...base, city: '' }).isValid).toBe(false);
    });

    it('fails when province is empty', () => {
        expect(validateStep(2, { ...base, province: '' }).isValid).toBe(false);
    });

    it('fails when phone is empty', () => {
        expect(validateStep(2, { ...base, phone: '' }).isValid).toBe(false);
    });

    it('fails when email is empty', () => {
        expect(validateStep(2, { ...base, email: '' }).isValid).toBe(false);
    });

    it('fails when website is empty', () => {
        expect(validateStep(2, { ...base, website: '' }).isValid).toBe(false);
    });

    it('fails when website URL is invalid', () => {
        // Spaces make the URL unparseable even with https:// prefix
        const result = validateStep(2, { ...base, website: 'not a valid url with spaces' });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('URL');
    });

    it('accepts website with http:// prefix', () => {
        expect(validateStep(2, { ...base, website: 'http://example.com' }).isValid).toBe(true);
    });

    it('accepts website without http prefix (adds https automatically)', () => {
        expect(validateStep(2, { ...base, website: 'example.com' }).isValid).toBe(true);
    });
});

// ── Step 3: Services ───────────────────────────────────────────────────────────
describe('validateStep — Step 3 (Diensten)', () => {
    it('is valid when 3+ services are filled', () => {
        expect(validateStep(3, base)).toEqual({ isValid: true, error: null });
    });

    it('fails when fewer than 3 services have a name', () => {
        const result = validateStep(3, {
            ...base,
            services: [
                { name: 'Knippen', description: '', price: '' },
                { name: '', description: '', price: '' },
                { name: '', description: '', price: '' },
            ],
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('3 diensten');
    });

    it('ignores services with empty names', () => {
        const result = validateStep(3, {
            ...base,
            services: [
                { name: 'A', description: '', price: '' },
                { name: 'B', description: '', price: '' },
                { name: '  ', description: '', price: '' }, // whitespace only
            ],
        });
        expect(result.isValid).toBe(false);
    });

    it('passes with exactly 3 valid services', () => {
        expect(validateStep(3, base).isValid).toBe(true);
    });
});

// ── Step 4: Media ──────────────────────────────────────────────────────────────
describe('validateStep — Step 4 (Media)', () => {
    it('is valid when coverImage is provided', () => {
        expect(validateStep(4, base)).toEqual({ isValid: true, error: null });
    });

    it('fails when coverImage is null', () => {
        const result = validateStep(4, { ...base, coverImage: null });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('omslagfoto');
    });
});

// ── Step 5: Details & SEO ──────────────────────────────────────────────────────
describe('validateStep — Step 5 (Details)', () => {
    it('is valid when 5+ FAQs, kvk and no booking required', () => {
        expect(validateStep(5, base)).toEqual({ isValid: true, error: null });
    });

    it('fails when fewer than 5 FAQ answers are filled', () => {
        const result = validateStep(5, {
            ...base,
            faq: [{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }],
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('5 SEO');
    });

    it('fails when kvkNumber is missing', () => {
        const result = validateStep(5, { ...base, kvkNumber: '' });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('KVK');
    });

    it('fails when ctaType is booking but bookingUrl is empty', () => {
        const result = validateStep(5, { ...base, ctaType: 'booking', bookingUrl: '' });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('reserveringslink');
    });

    it('is valid when ctaType is booking and bookingUrl is set', () => {
        const result = validateStep(5, { ...base, ctaType: 'booking', bookingUrl: 'https://book.me/xyz' });
        expect(result.isValid).toBe(true);
    });

    it('ignores FAQ items with empty questions or answers', () => {
        const result = validateStep(5, {
            ...base,
            faq: [
                { question: '', answer: 'A' },       // empty question
                { question: 'Q', answer: '' },        // empty answer
                { question: 'Q2', answer: 'A2' },
                { question: 'Q3', answer: 'A3' },
                { question: 'Q4', answer: 'A4' },
            ],
        });
        // Only 3 valid — should fail
        expect(result.isValid).toBe(false);
    });
});
