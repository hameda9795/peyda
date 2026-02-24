/**
 * SECURITY TESTS — Admin API routes must return 401 without a valid auth cookie.
 *
 * These tests are the most important tests in the codebase.
 * If ANY of these fail in production, it means sensitive data is publicly accessible.
 *
 * Routes tested:
 *  - GET  /api/admin/analytics
 *  - GET  /api/admin/businesses
 *  - PATCH /api/admin/businesses
 *  - GET  /api/admin/businesses/[id]
 *  - PATCH /api/admin/businesses/[id]
 *  - DELETE /api/admin/businesses/[id]
 *  - GET  /api/admin/users
 *  - PATCH /api/admin/users
 *  - POST /api/admin/generate-all-content
 *  - GET  /api/admin/locations/cities
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── vi.hoisted: declare mock fns BEFORE vi.mock so hoisting works ──────────────
const mocks = vi.hoisted(() => ({
    mockCookieGet: vi.fn().mockReturnValue(undefined), // no cookie by default
}));

// ── Cookie mock: simulates NO valid cookie ─────────────────────────────────────
vi.mock('next/headers', () => ({
    cookies: vi.fn().mockResolvedValue({
        get: mocks.mockCookieGet,
        set: vi.fn(),
        delete: vi.fn(),
    }),
}));

// Destructure for convenient access in tests
const { mockCookieGet } = mocks;

// ── DB mock: should never be called in 401 cases ──────────────────────────────
vi.mock('@/lib/db', () => ({
    db: {
        business: {
            findMany: vi.fn().mockRejectedValue(new Error('DB should not be called')),
            findUnique: vi.fn().mockRejectedValue(new Error('DB should not be called')),
            count: vi.fn().mockRejectedValue(new Error('DB should not be called')),
            update: vi.fn().mockRejectedValue(new Error('DB should not be called')),
            delete: vi.fn().mockRejectedValue(new Error('DB should not be called')),
        },
        businessOwner: {
            findMany: vi.fn().mockRejectedValue(new Error('DB should not be called')),
            count: vi.fn().mockRejectedValue(new Error('DB should not be called')),
            findUnique: vi.fn().mockRejectedValue(new Error('DB should not be called')),
        },
        businessAnalytics: {
            findMany: vi.fn().mockRejectedValue(new Error('DB should not be called')),
        },
        city: {
            findMany: vi.fn().mockRejectedValue(new Error('DB should not be called')),
        },
        category: {
            findMany: vi.fn().mockRejectedValue(new Error('DB should not be called')),
        },
    },
}));

vi.mock('@/lib/ai-content-generator', () => ({
    generateBatchContent: vi.fn().mockRejectedValue(new Error('Should not be called')),
}));

vi.mock('@/lib/category-keywords', () => ({
    CATEGORY_KEYWORDS: {},
}));

// ── Import route handlers ─────────────────────────────────────────────────────
import { GET as analyticsGET } from '@/app/api/admin/analytics/route';
import { GET as businessesGET, PATCH as businessesPATCH } from '@/app/api/admin/businesses/route';
import { GET as businessGET, PATCH as businessPATCH, DELETE as businessDELETE } from '@/app/api/admin/businesses/[id]/route';
import { GET as usersGET, PATCH as usersPATCH } from '@/app/api/admin/users/route';
import { POST as generatePOST } from '@/app/api/admin/generate-all-content/route';
import { GET as citiesGET } from '@/app/api/admin/locations/cities/route';

// ── Helper ────────────────────────────────────────────────────────────────────
function makeReq(method = 'GET', body?: object) {
    return new Request('http://localhost/api/admin/test', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    }) as any;
}

function makeParamsReq(id = 'test-id', method = 'GET', body?: object) {
    return {
        req: makeReq(method, body),
        params: Promise.resolve({ id }),
    };
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('🔐 SECURITY — All Admin API routes return 401 without auth cookie', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock ensures no cookie is found
        mockCookieGet.mockReturnValue(undefined);
    });

    it('GET /api/admin/analytics → 401', async () => {
        const res = await analyticsGET(makeReq());
        expect(res.status).toBe(401);
    });

    it('GET /api/admin/businesses → 401', async () => {
        const res = await businessesGET(makeReq());
        expect(res.status).toBe(401);
    });

    it('PATCH /api/admin/businesses → 401', async () => {
        const res = await businessesPATCH(makeReq('PATCH', { id: '1', action: 'approve' }));
        expect(res.status).toBe(401);
    });

    it('GET /api/admin/businesses/[id] → 401', async () => {
        const { req, params } = makeParamsReq();
        const res = await businessGET(req, { params });
        expect(res.status).toBe(401);
    });

    it('PATCH /api/admin/businesses/[id] → 401', async () => {
        const { req, params } = makeParamsReq('test-id', 'PATCH', { action: 'approve' });
        const res = await businessPATCH(req, { params });
        expect(res.status).toBe(401);
    });

    it('DELETE /api/admin/businesses/[id] → 401', async () => {
        const { req, params } = makeParamsReq('test-id', 'DELETE');
        const res = await businessDELETE(req, { params });
        expect(res.status).toBe(401);
    });

    it('GET /api/admin/users → 401', async () => {
        const res = await usersGET(makeReq());
        expect(res.status).toBe(401);
    });

    it('PATCH /api/admin/users → 401', async () => {
        const res = await usersPATCH(makeReq('PATCH', { id: '1', action: 'activate' }));
        expect(res.status).toBe(401);
    });

    it('POST /api/admin/generate-all-content → 401', async () => {
        const res = await generatePOST(makeReq('POST', { city: 'Utrecht' }));
        expect(res.status).toBe(401);
    });

    it('GET /api/admin/locations/cities → 401', async () => {
        const res = await citiesGET();
        expect(res.status).toBe(401);
    });

    it('DB is never touched for 401 responses (no data leak)', async () => {
        // All DB mock functions are set to throw — if any resolve, the test itself would fail.
        // We just verify no DB mock was called.
        await analyticsGET(makeReq());
        await businessesGET(makeReq());
        await usersGET(makeReq());

        const { db } = await import('@/lib/db');
        expect(db.business.findMany).not.toHaveBeenCalled();
        expect(db.businessAnalytics.findMany).not.toHaveBeenCalled();
        expect(db.businessOwner.findMany).not.toHaveBeenCalled();
    });
});

describe('🔐 SECURITY — Admin routes must reject tampered / wrong cookie value', () => {
    it('rejects a known-old static cookie value (the hardcoded one from git history)', async () => {
        mockCookieGet.mockReturnValue({
            value: 'admin_authenticated_secret_token_2026', // old leaked value
        });

        const res = await analyticsGET(makeReq());
        // The session value in tests is 'test-session-token-abc123xyz' — different from old value
        expect(res.status).toBe(401);
    });

    it('rejects arbitrary string as cookie value', async () => {
        mockCookieGet.mockReturnValue({ value: 'i_am_hacker' });
        const res = await businessesGET(makeReq());
        expect(res.status).toBe(401);
    });

    it('rejects empty string cookie value', async () => {
        mockCookieGet.mockReturnValue({ value: '' });
        const res = await usersGET(makeReq());
        expect(res.status).toBe(401);
    });
});
