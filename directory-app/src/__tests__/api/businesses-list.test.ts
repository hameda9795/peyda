/**
 * Unit Tests — /api/businesses/list route
 *
 * Verifies the GET handler for the business list endpoint.
 * Returns HTML with business rows for each DB record.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock: Prisma db ───────────────────────────────────────────────────────────
const { mockFindMany } = vi.hoisted(() => ({ mockFindMany: vi.fn() }));

vi.mock('@/lib/db', () => ({
    db: {
        business: { findMany: mockFindMany },
    },
}));

import { GET } from '@/app/api/businesses/list/route';
import { NextResponse } from 'next/server';

// ── Fixtures ──────────────────────────────────────────────────────────────────
const sampleBusinesses = [
    {
        id: 'biz-1',
        name: 'De Koffie Kamer',
        slug: 'de-koffie-kamer-utrecht',
        city: 'Utrecht',
        status: 'approved',
        createdAt: new Date('2025-01-15'),
    },
    {
        id: 'biz-2',
        name: 'Kapper Centrum',
        slug: 'kapper-centrum',
        city: 'Amsterdam',
        status: 'pending',
        createdAt: new Date('2025-02-01'),
    },
];

describe('GET /api/businesses/list', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns a 200 response', async () => {
        mockFindMany.mockResolvedValue(sampleBusinesses);
        const response = await GET();
        expect(response.status).toBe(200);
    });

    it('returns HTML content-type', async () => {
        mockFindMany.mockResolvedValue(sampleBusinesses);
        const response = await GET();
        const contentType = response.headers.get('content-type');
        expect(contentType).toContain('text/html');
    });

    it('includes business names in the response body', async () => {
        mockFindMany.mockResolvedValue(sampleBusinesses);
        const response = await GET();
        const html = await response.text();
        expect(html).toContain('De Koffie Kamer');
        expect(html).toContain('Kapper Centrum');
    });

    it('includes business slugs in the response body', async () => {
        mockFindMany.mockResolvedValue(sampleBusinesses);
        const response = await GET();
        const html = await response.text();
        expect(html).toContain('de-koffie-kamer-utrecht');
    });

    it('includes business IDs in the response body', async () => {
        mockFindMany.mockResolvedValue(sampleBusinesses);
        const response = await GET();
        const html = await response.text();
        expect(html).toContain('biz-1');
        expect(html).toContain('biz-2');
    });

    it('shows empty state when no businesses exist', async () => {
        mockFindMany.mockResolvedValue([]);
        const response = await GET();
        const html = await response.text();
        expect(html).toContain('empty');
    });

    it('queries DB with limit of 50 ordered by createdAt desc', async () => {
        mockFindMany.mockResolvedValue([]);
        await GET();
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                take: 50,
                orderBy: { createdAt: 'desc' },
            })
        );
    });
});
