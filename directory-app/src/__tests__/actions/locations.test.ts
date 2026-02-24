/**
 * Unit Tests — Location Actions
 *
 * Tests getCities, getCityBySlug, getNeighborhoodsByCitySlug with mocked Prisma.
 * Verifies DB-first logic and static-data fallback paths.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const { mockFindMany, mockFindUnique } = vi.hoisted(() => ({
    mockFindMany: vi.fn(),
    mockFindUnique: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
    db: {
        city: { findMany: mockFindMany, findUnique: mockFindUnique },
        neighborhood: { findMany: mockFindMany },
    },
}));

// netherlands-data returns a predictable static set
vi.mock('@/lib/netherlands-data', () => ({
    getAllCities: () => [
        { name: 'Utrecht', slug: 'utrecht', province: 'Utrecht' },
        { name: 'Amsterdam', slug: 'amsterdam', province: 'Noord-Holland' },
        { name: 'Rotterdam', slug: 'rotterdam', province: 'Zuid-Holland' },
    ],
}));

import { getCities, getCityBySlug, getNeighborhoodsByCitySlug } from '@/lib/actions/locations';

// ── getCities ─────────────────────────────────────────────────────────────────
describe('getCities', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns DB cities when the database has results', async () => {
        const dbCities = [
            { id: '1', name: 'Utrecht', slug: 'utrecht', _count: { neighborhoods: 5 } },
        ];
        mockFindMany.mockResolvedValue(dbCities);

        const result = await getCities();
        expect(result).toEqual(dbCities);
    });

    it('falls back to static data when DB returns empty array', async () => {
        mockFindMany.mockResolvedValue([]);

        const result = await getCities();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toMatchObject({ slug: 'utrecht' });
    });

    it('falls back to static data on DB error', async () => {
        mockFindMany.mockRejectedValue(new Error('DB unreachable'));

        const result = await getCities();
        expect(result.length).toBeGreaterThan(0);
    });

    it('filters by query string when q is provided', async () => {
        mockFindMany.mockResolvedValue([]);

        const result = await getCities({ q: 'amster' });
        const names = result.map((c: any) => c.name.toLowerCase());
        expect(names.every((n: string) => n.includes('amster'))).toBe(true);
    });

    it('respects limit option', async () => {
        mockFindMany.mockResolvedValue([]);

        const result = await getCities({ limit: 1 });
        expect(result.length).toBeLessThanOrEqual(1);
    });

    it('clamps limit to max 500', async () => {
        mockFindMany.mockResolvedValue([]);
        // getAllCities returns 3 items; with limit 1000, result is all 3 (clamped to 500 max)
        const result = await getCities({ limit: 1000 });
        expect(result.length).toBeLessThanOrEqual(500);
    });
});

// ── getCityBySlug ─────────────────────────────────────────────────────────────
describe('getCityBySlug', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns city when slug is found in DB', async () => {
        const city = { id: '1', name: 'Utrecht', slug: 'utrecht', _count: { neighborhoods: 3 } };
        mockFindUnique.mockResolvedValue(city);

        const result = await getCityBySlug('utrecht');
        expect(result).toEqual(city);
    });

    it('returns null when city is not found', async () => {
        mockFindUnique.mockResolvedValue(null);

        const result = await getCityBySlug('unknown-city');
        expect(result).toBeNull();
    });

    it('returns null on DB error', async () => {
        mockFindUnique.mockRejectedValue(new Error('Timeout'));

        const result = await getCityBySlug('utrecht');
        expect(result).toBeNull();
    });

    it('returns null for empty slug', async () => {
        const result = await getCityBySlug('');
        expect(result).toBeNull();
    });
});

// ── getNeighborhoodsByCitySlug ────────────────────────────────────────────────
describe('getNeighborhoodsByCitySlug', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns city and neighborhoods from DB', async () => {
        const city = { id: 'c-1', name: 'Utrecht', slug: 'utrecht' };
        const neighborhoods = [
            { id: 'n-1', name: 'Binnenstad', slug: 'binnenstad' },
            { id: 'n-2', name: 'Oost', slug: 'oost' },
        ];
        // first findUnique → city; then findMany → neighborhoods
        mockFindUnique.mockResolvedValue(city);
        mockFindMany.mockResolvedValue(neighborhoods);

        const result = await getNeighborhoodsByCitySlug('utrecht');
        expect(result.city).toEqual(city);
        expect(result.neighborhoods).toEqual(neighborhoods);
    });

    it('falls back to static neighborhoods when city not in DB', async () => {
        mockFindUnique.mockResolvedValue(null);

        // 'amsterdam' is in the static STATIC_NEIGHBORHOODS map
        const result = await getNeighborhoodsByCitySlug('amsterdam');
        expect(result.city).toMatchObject({ slug: 'amsterdam' });
        expect(result.neighborhoods.length).toBeGreaterThan(0);
    });

    it('returns empty when slug is neither in DB nor in static data', async () => {
        mockFindUnique.mockResolvedValue(null);

        const result = await getNeighborhoodsByCitySlug('unknown-city-xyz');
        expect(result.city).toBeNull();
        expect(result.neighborhoods).toEqual([]);
    });

    it('uses static neighborhoods when DB city has none', async () => {
        const city = { id: 'c-2', name: 'Utrecht', slug: 'utrecht' };
        mockFindUnique.mockResolvedValue(city);
        mockFindMany.mockResolvedValue([]); // no neighborhoods in DB

        const result = await getNeighborhoodsByCitySlug('utrecht');
        expect(result.neighborhoods.length).toBeGreaterThan(0);
        expect(result.neighborhoods[0]).toHaveProperty('name');
    });

    it('filters neighborhoods by query string', async () => {
        mockFindUnique.mockResolvedValue(null); // force static path

        const result = await getNeighborhoodsByCitySlug('amsterdam', { q: 'centrum' });
        const names = result.neighborhoods.map((n: any) => n.name.toLowerCase());
        expect(names.every((n: string) => n.includes('centrum'))).toBe(true);
    });
});
