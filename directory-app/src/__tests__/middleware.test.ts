/**
 * Tests for src/middleware.ts
 *
 * Validates:
 *  - /admin/* routes redirect to /admin/login without valid cookie
 *  - /admin/login with valid cookie redirects to /admin
 *  - /dashboard/* redirects to /?login=true without session_token cookie
 *  - /api/admin/auth/* is always accessible (login endpoint itself)
 */
import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRequest(pathname: string, cookies: Record<string, string> = {}) {
    const url = `http://localhost${pathname}`;
    const req = new NextRequest(url);

    // Inject cookies
    Object.entries(cookies).forEach(([name, value]) => {
        (req as any).cookies.set(name, value);
    });

    return req;
}

const VALID_ADMIN_COOKIE = 'test-session-token-abc123xyz'; // matches vitest.config.ts env
const VALID_SESSION_TOKEN = 'some-user-session-token';

// ── Admin routes ───────────────────────────────────────────────────────────────
describe('Middleware — Admin route protection', () => {
    it('redirects /admin to /admin/login when no cookie', () => {
        const req = makeRequest('/admin');
        const res = middleware(req);

        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toContain('/admin/login');
    });

    it('redirects /admin/businesses to /admin/login when no cookie', () => {
        const req = makeRequest('/admin/businesses');
        const res = middleware(req);

        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toContain('/admin/login');
    });

    it('redirects /admin/users to /admin/login when cookie is wrong', () => {
        const req = makeRequest('/admin/users', {
            admin_session: 'wrong-value',
        });
        const res = middleware(req);

        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toContain('/admin/login');
    });

    it('allows /admin when cookie is valid', () => {
        const req = makeRequest('/admin', {
            admin_session: VALID_ADMIN_COOKIE,
        });
        const res = middleware(req);

        // Should pass through (not a redirect)
        expect(res.status).not.toBe(307);
        expect(res.headers.get('location')).toBeNull();
    });

    it('allows /admin/businesses when cookie is valid', () => {
        const req = makeRequest('/admin/businesses', {
            admin_session: VALID_ADMIN_COOKIE,
        });
        const res = middleware(req);

        expect(res.status).not.toBe(307);
    });

    it('redirects /admin/login → /admin when already logged in', () => {
        const req = makeRequest('/admin/login', {
            admin_session: VALID_ADMIN_COOKIE,
        });
        const res = middleware(req);

        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toMatch(/\/admin$/);
    });

    it('allows /admin/login without cookie (login page is public)', () => {
        const req = makeRequest('/admin/login');
        const res = middleware(req);

        expect(res.status).not.toBe(307);
    });

    it('allows /api/admin/auth POST without cookie (login API is public)', () => {
        const req = makeRequest('/api/admin/auth');
        const res = middleware(req);

        expect(res.status).not.toBe(307);
    });
});

// ── User dashboard routes ──────────────────────────────────────────────────────
describe('Middleware — User dashboard protection', () => {
    it('redirects /dashboard to /?login=true without session_token', () => {
        const req = makeRequest('/dashboard');
        const res = middleware(req);

        expect(res.status).toBe(307);
        const location = res.headers.get('location') || '';
        expect(location).toContain('login=true');
    });

    it('redirects /dashboard/profile to /?login=true without session_token', () => {
        const req = makeRequest('/dashboard/profile');
        const res = middleware(req);

        expect(res.status).toBe(307);
        const location = res.headers.get('location') || '';
        expect(location).toContain('login=true');
    });

    it('allows /dashboard when session_token cookie is present', () => {
        const req = makeRequest('/dashboard', {
            session_token: VALID_SESSION_TOKEN,
        });
        const res = middleware(req);

        expect(res.status).not.toBe(307);
    });

    it('redirects /bedrijf-aanmelden → /dashboard when session_token exists', () => {
        const req = makeRequest('/bedrijf-aanmelden', {
            session_token: VALID_SESSION_TOKEN,
        });
        const res = middleware(req);

        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toContain('/dashboard');
    });
});
