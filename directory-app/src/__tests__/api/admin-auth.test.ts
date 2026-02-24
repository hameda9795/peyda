/**
 * Tests for POST /api/admin/auth (login) and DELETE /api/admin/auth (logout).
 *
 * We mock `next/headers` so we can control what cookies are read/written
 * without a running Next.js server.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── vi.hoisted: declare mock fns BEFORE vi.mock so hoisting works ──────────────
const mocks = vi.hoisted(() => ({
    mockCookieSet: vi.fn(),
    mockCookieDelete: vi.fn(),
    mockCookieGet: vi.fn(),
}));

// ── Mock next/headers before importing the route ──────────────────────────────
vi.mock('next/headers', () => ({
    cookies: vi.fn().mockResolvedValue({
        set: mocks.mockCookieSet,
        delete: mocks.mockCookieDelete,
        get: mocks.mockCookieGet,
    }),
}));

// ── Import route handlers after mocks are set up ──────────────────────────────
import { POST, DELETE } from '@/app/api/admin/auth/route';

// Destructure for convenient access in tests
const { mockCookieSet, mockCookieDelete } = mocks;

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRequest(body: object) {
    return new Request('http://localhost/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }) as any;
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('POST /api/admin/auth — Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Env vars are set in vitest.config.ts:
        //   ADMIN_EMAIL=testadmin  ADMIN_PASSWORD=testpassword123
        //   ADMIN_SESSION_VALUE=test-session-token-abc123xyz
    });

    it('returns 200 and sets cookie for correct credentials', async () => {
        const res = await POST(makeRequest({
            email: 'testadmin',
            password: 'testpassword123',
        }));

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(true);

        // Cookie must have been set with the session value
        expect(mockCookieSet).toHaveBeenCalledOnce();
        const [name, value] = mockCookieSet.mock.calls[0];
        expect(name).toBe('admin_session');
        expect(value).toBe('test-session-token-abc123xyz');
    });

    it('returns 401 for wrong password', async () => {
        const res = await POST(makeRequest({
            email: 'testadmin',
            password: 'wrongpassword',
        }));

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(mockCookieSet).not.toHaveBeenCalled();
    });

    it('returns 401 for wrong email', async () => {
        const res = await POST(makeRequest({
            email: 'hacker',
            password: 'testpassword123',
        }));

        expect(res.status).toBe(401);
        expect(mockCookieSet).not.toHaveBeenCalled();
    });

    it('returns 401 for empty credentials', async () => {
        const res = await POST(makeRequest({ email: '', password: '' }));
        expect(res.status).toBe(401);
    });

    it('returns 500 when env vars are missing', async () => {
        const savedEmail = process.env.ADMIN_EMAIL;
        const savedPass = process.env.ADMIN_PASSWORD;
        const savedSession = process.env.ADMIN_SESSION_VALUE;

        delete process.env.ADMIN_EMAIL;
        delete process.env.ADMIN_PASSWORD;
        delete process.env.ADMIN_SESSION_VALUE;

        const res = await POST(makeRequest({
            email: 'testadmin',
            password: 'testpassword123',
        }));

        expect(res.status).toBe(500);

        // Restore
        process.env.ADMIN_EMAIL = savedEmail;
        process.env.ADMIN_PASSWORD = savedPass;
        process.env.ADMIN_SESSION_VALUE = savedSession;
    });

    it('does NOT set cookie for missing env vars (no silent auth bypass)', async () => {
        const savedSession = process.env.ADMIN_SESSION_VALUE;
        delete process.env.ADMIN_SESSION_VALUE;

        await POST(makeRequest({ email: 'testadmin', password: 'testpassword123' }));
        expect(mockCookieSet).not.toHaveBeenCalled();

        process.env.ADMIN_SESSION_VALUE = savedSession;
    });
});

describe('DELETE /api/admin/auth — Logout', () => {
    it('deletes the admin_session cookie', async () => {
        const req = new Request('http://localhost/api/admin/auth', {
            method: 'DELETE',
        }) as any;

        const res = await DELETE();
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(true);
        expect(mockCookieDelete).toHaveBeenCalledWith('admin_session');
    });
});
