/**
 * Tests for GET /api/debug/categories
 *
 * This endpoint must be completely inaccessible in production.
 * In development it may return data.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('@/lib/db', () => ({
    db: {
        category: {
            findMany: vi.fn().mockResolvedValue([
                {
                    id: '1',
                    name: 'Test Cat',
                    slug: '/utrecht/test',
                    subcategories: [],
                    _count: { subcategories: 0 },
                },
            ]),
        },
    },
}));

import { GET } from '@/app/api/debug/categories/route';

describe('GET /api/debug/categories — Production lock', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
        // Restore NODE_ENV
        (process.env as any).NODE_ENV = originalEnv;
    });

    it('returns 404 in production', async () => {
        (process.env as any).NODE_ENV = 'production';
        const res = await GET();
        expect(res.status).toBe(404);
    });

    it('returns 404 in test environment (NODE_ENV=test)', async () => {
        // Vitest sets NODE_ENV=test — the endpoint should still be blocked
        (process.env as any).NODE_ENV = 'test';
        const res = await GET();
        expect(res.status).toBe(404);
    });

    it('returns 200 in development', async () => {
        (process.env as any).NODE_ENV = 'development';
        const res = await GET();
        expect(res.status).toBe(200);
    });

    it('production response body does not contain any category data', async () => {
        (process.env as any).NODE_ENV = 'production';
        const res = await GET();
        const body = await res.json();
        // Should only have an error key — no categories, no duplicates
        expect(body).not.toHaveProperty('categories');
        expect(body).not.toHaveProperty('duplicateNames');
    });
});
