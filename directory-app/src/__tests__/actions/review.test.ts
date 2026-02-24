/**
 * Unit tests — Review Actions (with mocked Prisma)
 *
 * Tests createReview: validation, happy path (prisma.review model),
 * raw-SQL fallback path, and error handling.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
    const mockPrisma: any = {
        $executeRaw: vi.fn(),
        $queryRaw: vi.fn(),
        business: {
            update: vi.fn(),
        },
        // NOTE: prisma.review is NOT present by default so we test the raw-SQL fallback
    };
    return { mockPrisma };
});

vi.mock('@/lib/db', () => ({ db: mockPrisma }));
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
    unstable_cache: (fn: any) => fn,
}));

import { createReview } from '@/lib/actions/review';

// ── Helpers ───────────────────────────────────────────────────────────────────
const validData = () => ({
    name: 'Jan de Vries',
    email: 'jan@example.com',
    rating: 4,
    content: 'Uitstekende service!',
});

describe('createReview', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Ensure no leftover review model from previous test
        delete mockPrisma.review;
        // Default raw SQL mocks
        mockPrisma.$executeRaw.mockResolvedValue(1);
        mockPrisma.$queryRaw.mockResolvedValue([{ average: 4.5, count: 2 }]);
        mockPrisma.business.update.mockResolvedValue({ id: 'biz-1' });
    });

    // ── Validation ─────────────────────────────────────────────────────────────
    it('returns error when businessId is missing', async () => {
        const result = await createReview('', validData());
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/business id/i);
    });

    it('returns error when name is missing', async () => {
        const result = await createReview('biz-1', { ...validData(), name: '' });
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/required/i);
    });

    it('returns error when email is missing', async () => {
        const result = await createReview('biz-1', { ...validData(), email: '' });
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/required/i);
    });

    it('returns error when content is missing', async () => {
        const result = await createReview('biz-1', { ...validData(), content: '' });
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/required/i);
    });

    it('returns error when rating is 0', async () => {
        const result = await createReview('biz-1', { ...validData(), rating: 0 });
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/required/i);
    });

    // ── Raw SQL fallback (no prisma.review model) ──────────────────────────────
    it('uses raw SQL fallback when prisma.review is absent', async () => {
        const result = await createReview('biz-1', validData());
        expect(result.success).toBe(true);
        // Raw SQL path calls $executeRaw for INSERT and then again for UPDATE
        expect(mockPrisma.$executeRaw).toHaveBeenCalled();
        expect(mockPrisma.$queryRaw).toHaveBeenCalled();
        // business.update is NOT called in the raw SQL path (update uses $executeRaw)
        expect(mockPrisma.business.update).not.toHaveBeenCalled();
    });

    it('returns review payload on raw SQL success', async () => {
        const result = await createReview('biz-1', validData());
        expect(result.success).toBe(true);
        expect(result.review).toMatchObject({
            name: 'Jan de Vries',
            email: 'jan@example.com',
            rating: 4,
            content: 'Uitstekende service!',
        });
    });

    it('uses avgRating from raw SQL stats to update business', async () => {
        mockPrisma.$queryRaw.mockResolvedValue([{ average: '3.7', count: '5' }]);
        const result = await createReview('biz-1', validData());
        expect(result.success).toBe(true);
        // Raw SQL path: $executeRaw called for INSERT + UPDATE, $queryRaw for AVG
        expect(mockPrisma.$executeRaw).toHaveBeenCalledTimes(2);
        expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    });

    // ── Prisma review model present ────────────────────────────────────────────
    it('uses prisma.review.create when the model exists', async () => {
        const mockReview = { id: 'rev-1', ...validData() };
        const reviewCreate = vi.fn().mockResolvedValue(mockReview);
        const reviewFindMany = vi.fn().mockResolvedValue([
            { rating: 5 },
            { rating: 4 },
        ]);
        mockPrisma.review = { create: reviewCreate, findMany: reviewFindMany };
        mockPrisma.business.update.mockResolvedValue({ id: 'biz-1' });

        const result = await createReview('biz-1', validData());
        expect(result.success).toBe(true);
        expect(reviewCreate).toHaveBeenCalled();
        expect(reviewFindMany).toHaveBeenCalled();
        expect(mockPrisma.business.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ rating: 4.5, reviewCount: 2 }),
            })
        );
    });

    // ── Error handling ─────────────────────────────────────────────────────────
    it('returns success:false on DB error (raw SQL path)', async () => {
        // Ensure we are on the raw SQL path (no review model)
        expect(mockPrisma.review).toBeUndefined();
        mockPrisma.$executeRaw.mockRejectedValue(new Error('DB down'));
        const result = await createReview('biz-1', validData());
        expect(result.success).toBe(false);
        expect(result.error).toBe('DB down');
    });
});
