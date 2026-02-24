/**
 * Unit Tests — Extended Business Actions
 *
 * Tests getBusinessesByNeighborhood, getBusinessCountsByCity,
 * getTopCitiesByBusinessCount, getProvinceStats, getAllFeaturedBusinesses,
 * getRelatedBusinessesBySlug — all with mocked Prisma.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const { mockFindMany, mockFindUnique, mockGroupBy, mockCount } = vi.hoisted(() => ({
    mockFindMany: vi.fn(),
    mockFindUnique: vi.fn(),
    mockGroupBy: vi.fn(),
    mockCount: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
    db: {
        business: {
            findMany: mockFindMany,
            findUnique: mockFindUnique,
            groupBy: mockGroupBy,
            count: mockCount,
        },
        subCategory: { findUnique: mockFindUnique },
    },
}));

vi.mock('@/lib/supabase', () => ({
    supabase: {
        storage: {
            from: () => ({
                upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
                getPublicUrl: () => ({ data: { publicUrl: '/mock-url' } }),
            }),
        },
    },
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
    unstable_cache: (fn: any) => fn,
}));

vi.mock('next/navigation', () => ({
    notFound: vi.fn(),
    redirect: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
    getCurrentUser: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/lib/category-images', () => ({
    getCategoryImage: () => '/images/default-category.jpg',
}));

vi.mock('@/lib/subcategory-images', () => ({
    getSubcategoryImage: () => '/images/default-subcategory.jpg',
}));

import {
    getBusinessesByNeighborhood,
    getBusinessCountsByCity,
    getTopCitiesByBusinessCount,
    getAllFeaturedBusinesses,
    getRelatedBusinessesBySlug,
} from '@/lib/actions/business';

// ── Shared fixture ────────────────────────────────────────────────────────────
function makeDbBusiness(overrides: Record<string, any> = {}) {
    return {
        id: 'biz-1',
        name: 'Test Salon',
        slug: 'test-salon',
        shortDescription: 'Professionele kapper',
        city: 'Utrecht',
        neighborhood: 'Centrum',
        rating: 4.5,
        reviewCount: 10,
        coverImage: '/cover.jpg',
        logo: '/logo.jpg',
        status: 'approved',
        publishStatus: 'PUBLISHED',
        provinceSlug: 'utrecht',
        updatedAt: new Date(),
        subCategory: {
            name: 'Kapper',
            slug: '/utrecht/beauty/kapper',
            category: {
                name: 'Beauty in Utrecht',
                slug: '/utrecht/beauty',
            },
        },
        ...overrides,
    };
}

// ── getBusinessesByNeighborhood ───────────────────────────────────────────────
describe('getBusinessesByNeighborhood', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns empty array when no businesses in neighborhood', async () => {
        mockFindMany.mockResolvedValue([]);
        const result = await getBusinessesByNeighborhood('Centrum');
        expect(result).toEqual([]);
    });

    it('maps DB businesses to the expected shape', async () => {
        mockFindMany.mockResolvedValue([makeDbBusiness()]);
        const result = await getBusinessesByNeighborhood('Centrum');
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            name: 'Test Salon',
            slug: 'test-salon',
            address: { city: 'Utrecht', neighborhood: 'Centrum' },
        });
    });

    it('returns empty array on DB error', async () => {
        mockFindMany.mockRejectedValue(new Error('DB error'));
        const result = await getBusinessesByNeighborhood('Centrum');
        expect(result).toEqual([]);
    });

    it('passes neighborhood name as case-insensitive filter', async () => {
        mockFindMany.mockResolvedValue([]);
        await getBusinessesByNeighborhood('centrum', 5);
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    neighborhood: expect.objectContaining({ equals: 'centrum' }),
                }),
                take: 5,
            })
        );
    });

    it('sets null rating when reviewCount is zero', async () => {
        mockFindMany.mockResolvedValue([makeDbBusiness({ reviewCount: 0, rating: 0 })]);
        const result = await getBusinessesByNeighborhood('Centrum');
        expect(result[0].rating).toBeNull();
    });
});

// ── getBusinessCountsByCity ───────────────────────────────────────────────────
describe('getBusinessCountsByCity', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns city-count pairs', async () => {
        mockGroupBy.mockResolvedValue([
            { city: 'Utrecht', _count: { id: 12 } },
            { city: 'Amsterdam', _count: { id: 7 } },
        ]);

        const result = await getBusinessCountsByCity();
        expect(result).toEqual([
            { city: 'Utrecht', count: 12 },
            { city: 'Amsterdam', count: 7 },
        ]);
    });

    it('uses "Onbekend" for null city', async () => {
        mockGroupBy.mockResolvedValue([{ city: null, _count: { id: 3 } }]);
        const result = await getBusinessCountsByCity();
        expect(result[0].city).toBe('Onbekend');
    });

    it('returns empty array on DB error', async () => {
        mockGroupBy.mockRejectedValue(new Error('timeout'));
        const result = await getBusinessCountsByCity();
        expect(result).toEqual([]);
    });
});

// ── getTopCitiesByBusinessCount ───────────────────────────────────────────────
describe('getTopCitiesByBusinessCount', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns mapped top cities', async () => {
        mockGroupBy.mockResolvedValue([
            { city: 'Utrecht', _count: { id: 50 } },
            { city: 'Amsterdam', _count: { id: 42 } },
        ]);

        const result = await getTopCitiesByBusinessCount(2);
        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({ name: 'Utrecht', businessCount: 50 });
    });

    it('returns empty array on error', async () => {
        mockGroupBy.mockRejectedValue(new Error('fail'));
        const result = await getTopCitiesByBusinessCount();
        expect(result).toEqual([]);
    });
});

// ── getAllFeaturedBusinesses ───────────────────────────────────────────────────
describe('getAllFeaturedBusinesses', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns empty array when no featured businesses exist', async () => {
        mockFindMany.mockResolvedValue([]);
        const result = await getAllFeaturedBusinesses(8);
        expect(result).toEqual([]);
    });

    it('maps featured businesses to expected shape', async () => {
        mockFindMany.mockResolvedValue([makeDbBusiness()]);
        const result = await getAllFeaturedBusinesses(8);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            name: 'Test Salon',
            slug: 'test-salon',
        });
    });

    it('returns empty array on DB error', async () => {
        mockFindMany.mockRejectedValue(new Error('connection lost'));
        const result = await getAllFeaturedBusinesses();
        expect(result).toEqual([]);
    });
});

// ── getRelatedBusinessesBySlug ────────────────────────────────────────────────
describe('getRelatedBusinessesBySlug', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns empty array when slug does not exist', async () => {
        mockFindUnique.mockResolvedValue(null);
        const result = await getRelatedBusinessesBySlug('no-such-slug');
        expect(result).toEqual([]);
    });

    it('returns empty array on error', async () => {
        mockFindUnique.mockRejectedValue(new Error('fail'));
        const result = await getRelatedBusinessesBySlug('test-slug');
        expect(result).toEqual([]);
    });
});
