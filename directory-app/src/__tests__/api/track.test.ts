/**
 * Tests for POST /api/track
 *
 * Validates:
 *  - Input validation (missing fields, invalid types)
 *  - Rate limiting (max 30 requests per IP per 60s)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── vi.hoisted: declare mock fns BEFORE vi.mock so hoisting works ──────────────
const mocks = vi.hoisted(() => ({
    mockInteractionCount: vi.fn(),
    mockInteractionCreate: vi.fn().mockResolvedValue({}),
    mockAnalyticsUpsert: vi.fn().mockResolvedValue({}),
}));

// ── DB mock ───────────────────────────────────────────────────────────────────
vi.mock('@/lib/db', () => ({
    db: {
        businessInteraction: {
            count: mocks.mockInteractionCount,
            create: mocks.mockInteractionCreate,
            findFirst: vi.fn().mockResolvedValue(null),
        },
        businessAnalytics: {
            upsert: mocks.mockAnalyticsUpsert,
        },
    },
}));

import { POST } from '@/app/api/track/route';

// Destructure for convenient access in tests
const { mockInteractionCount, mockInteractionCreate, mockAnalyticsUpsert } = mocks;

// ── Helper ────────────────────────────────────────────────────────────────────
function makeReq(body: object, ip = '1.2.3.4') {
    return new Request('http://localhost/api/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': ip,
            'user-agent': 'TestAgent/1.0',
        },
        body: JSON.stringify(body),
    }) as any;
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('POST /api/track — Input validation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: not rate limited (0 recent interactions)
        mockInteractionCount.mockResolvedValue(0);
    });

    it('returns 400 when businessId is missing', async () => {
        const res = await POST(makeReq({ type: 'view' }));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toBeTruthy();
    });

    it('returns 400 when type is missing', async () => {
        const res = await POST(makeReq({ businessId: 'biz-1' }));
        expect(res.status).toBe(400);
    });

    it('returns 400 for invalid interaction type', async () => {
        const res = await POST(makeReq({ businessId: 'biz-1', type: 'HACK_VIEW' }));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toMatch(/invalid/i);
    });

    it('returns 400 for SQL-injection-like type string', async () => {
        const res = await POST(makeReq({ businessId: 'biz-1', type: "view'; DROP TABLE--" }));
        expect(res.status).toBe(400);
    });

    it('accepts all valid interaction types and returns 200', async () => {
        const validTypes = [
            'view', 'phone_click', 'whatsapp_click',
            'website_click', 'directions_click', 'email_click', 'booking_click',
        ];

        for (const type of validTypes) {
            const res = await POST(makeReq({ businessId: 'biz-1', type }));
            expect(res.status, `type "${type}" should return 200`).toBe(200);
        }
    });

    it('returns 200 for valid request and stores the interaction in DB', async () => {
        const res = await POST(makeReq({ businessId: 'biz-1', type: 'view', visitorId: 'visitor-abc' }));
        expect(res.status).toBe(200);
        expect(mockInteractionCreate).toHaveBeenCalledOnce();
        expect(mockAnalyticsUpsert).toHaveBeenCalledOnce();
    });
});

describe('POST /api/track — Rate limiting', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 429 when IP has exceeded 30 requests in 60 seconds', async () => {
        // Simulate 30 existing interactions for this IP
        mockInteractionCount.mockResolvedValue(30);

        const res = await POST(makeReq({ businessId: 'biz-1', type: 'view' }));
        expect(res.status).toBe(429);
        const body = await res.json();
        expect(body.error).toMatch(/too many/i);
    });

    it('does NOT hit DB interaction create when rate limited', async () => {
        mockInteractionCount.mockResolvedValue(31);
        await POST(makeReq({ businessId: 'biz-1', type: 'view' }));
        expect(mockInteractionCreate).not.toHaveBeenCalled();
    });

    it('allows request when IP has exactly 29 requests (below limit)', async () => {
        mockInteractionCount.mockResolvedValue(29);
        const res = await POST(makeReq({ businessId: 'biz-1', type: 'view' }));
        expect(res.status).toBe(200);
    });

    it('skips rate limit check when no IP is present (allows private/internal calls)', async () => {
        const req = new Request('http://localhost/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessId: 'biz-1', type: 'view' }),
        }) as any;

        // No IP → count should not be called
        const res = await POST(req);
        expect(res.status).toBe(200);
        expect(mockInteractionCount).not.toHaveBeenCalled();
    });
});
