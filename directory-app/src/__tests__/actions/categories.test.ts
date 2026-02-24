/**
 * Unit tests — Categories Actions (with mocked Prisma)
 *
 * Tests getCategories, getCategory, getCategoryBySlug, getSubcategoryBySlug
 * with a fully in-memory Prisma mock (no real DB needed).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks (hoisted, so they run before module imports) ─────────────────────────
const { mockPrisma } = vi.hoisted(() => {
    const mockPrisma = {
        category: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        subCategory: {
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    };
    return { mockPrisma };
});

vi.mock('@/lib/db', () => ({ db: mockPrisma }));

vi.mock('next/cache', () => ({
    unstable_cache: (fn: (...args: any[]) => any) => fn,
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
    revalidatePath: vi.fn(),
}));

vi.mock('@/lib/category-images', () => ({
    getCategoryImage: (_slug: string) => '/images/default-category.jpg',
}));

vi.mock('@/lib/subcategory-images', () => ({
    getSubcategoryImage: (_catSlug: string, _name: string) => '/images/default-sub.jpg',
}));

import {
    getCategories,
    getCategory,
    getCategoryBySlug,
    getSubcategoryBySlug,
} from '@/lib/actions/categories';

// ── Fixtures ───────────────────────────────────────────────────────────────────
const mockCategory = {
    id: 'cat-uuid-1',
    name: 'Beauty',
    slug: '/utrecht/beauty',
    description: 'Schoonheids­salons en kappers',
    icon: '💅',
    image: null,
    seoTitle: null,
    seoDescription: null,
    subcategories: [
        { id: 'sub-1', name: 'Kapper', slug: '/utrecht/beauty/kapper', image: null, categoryId: 'cat-uuid-1' },
        { id: 'sub-2', name: 'Nagelstudio', slug: '/utrecht/beauty/nagelstudio', image: null, categoryId: 'cat-uuid-1' },
    ],
    _count: { subcategories: 2 },
};

// ── getCategories ──────────────────────────────────────────────────────────────
describe('getCategories', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns mapped categories with fallback image', async () => {
        mockPrisma.category.findMany.mockResolvedValueOnce([mockCategory]);
        const result = await getCategories();
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Beauty');
        expect(result[0].image).toBe('/images/default-category.jpg'); // fallback because image is null
    });

    it('deduplicates categories with the same base name', async () => {
        const dup = { ...mockCategory, id: 'cat-uuid-2', name: 'Beauty in Utrecht' };
        mockPrisma.category.findMany.mockResolvedValueOnce([mockCategory, dup]);
        const result = await getCategories();
        expect(result).toHaveLength(1); // duplicate removed
    });

    it('throws when Prisma fails', async () => {
        mockPrisma.category.findMany.mockRejectedValueOnce(new Error('DB error'));
        await expect(getCategories()).rejects.toThrow('Failed to fetch categories');
    });
});

// ── getCategory ────────────────────────────────────────────────────────────────
describe('getCategory', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns category when found by id', async () => {
        mockPrisma.category.findUnique.mockResolvedValueOnce(mockCategory);
        const result = await getCategory('cat-uuid-1');
        expect(result?.id).toBe('cat-uuid-1');
        expect(mockPrisma.category.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: 'cat-uuid-1' } })
        );
    });

    it('returns null when category is not found', async () => {
        mockPrisma.category.findUnique.mockResolvedValueOnce(null);
        const result = await getCategory('nonexistent');
        expect(result).toBeNull();
    });

    it('throws when Prisma fails', async () => {
        mockPrisma.category.findUnique.mockRejectedValueOnce(new Error('conn error'));
        await expect(getCategory('cat-uuid-1')).rejects.toThrow('Failed to fetch category');
    });
});

// ── getCategoryBySlug ──────────────────────────────────────────────────────────
describe('getCategoryBySlug', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns category with normalised slug variants tried in order', async () => {
        // findUnique fails for all variants, findFirst succeeds
        mockPrisma.category.findUnique.mockResolvedValue(null);
        mockPrisma.category.findFirst.mockResolvedValueOnce(mockCategory);

        const result = await getCategoryBySlug('beauty');
        expect(result?.name).toBe('Beauty');
    });

    it('returns null when no category found for any slug variant', async () => {
        mockPrisma.category.findUnique.mockResolvedValue(null);
        mockPrisma.category.findFirst.mockResolvedValue(null);

        const result = await getCategoryBySlug('does-not-exist');
        expect(result).toBeNull();
    });

    it('strips /utrecht/ prefix from incoming slug', async () => {
        mockPrisma.category.findUnique.mockResolvedValueOnce(mockCategory);

        await getCategoryBySlug('/utrecht/beauty');
        // first variant tried is /utrecht/{cleanSlug}
        expect(mockPrisma.category.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ slug: '/utrecht/beauty' }) })
        );
    });

    it('maps subcategory images with fallback', async () => {
        mockPrisma.category.findUnique.mockResolvedValueOnce(mockCategory);

        const result = await getCategoryBySlug('beauty');
        const sub = result?.subcategories[0] as any;
        expect(sub?.image).toBe('/images/default-sub.jpg');
    });

    it('returns null on Prisma error (graceful fallback)', async () => {
        mockPrisma.category.findUnique.mockRejectedValue(new Error('timeout'));
        mockPrisma.category.findFirst.mockRejectedValue(new Error('timeout'));
        const result = await getCategoryBySlug('beauty');
        expect(result).toBeNull();
    });
});

// ── getSubcategoryBySlug ───────────────────────────────────────────────────────
describe('getSubcategoryBySlug', () => {
    beforeEach(() => vi.clearAllMocks());

    const mockSubcategory = {
        id: 'sub-1',
        name: 'Kapper',
        slug: '/utrecht/beauty/kapper',
        image: null,
        categoryId: 'cat-uuid-1',
        category: mockCategory,
    };

    it('returns subcategory when found', async () => {
        mockPrisma.subCategory.findFirst.mockResolvedValueOnce(mockSubcategory);

        const result = await getSubcategoryBySlug('beauty', 'kapper');
        expect(result?.name).toBe('Kapper');
    });

    it('returns null when subcategory not found', async () => {
        mockPrisma.subCategory.findFirst.mockResolvedValue(null);
        const result = await getSubcategoryBySlug('beauty', 'nonexistent');
        expect(result).toBeNull();
    });

    it('returns null on Prisma error', async () => {
        mockPrisma.subCategory.findFirst.mockRejectedValue(new Error('DB error'));
        const result = await getSubcategoryBySlug('beauty', 'kapper');
        expect(result).toBeNull();
    });

    it('adds fallback image to returned subcategory', async () => {
        mockPrisma.subCategory.findFirst.mockResolvedValueOnce(mockSubcategory);
        const result = await getSubcategoryBySlug('beauty', 'kapper');
        expect((result as any)?.image).toBe('/images/default-sub.jpg');
    });
});
