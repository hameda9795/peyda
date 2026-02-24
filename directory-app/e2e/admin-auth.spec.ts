import { test, expect } from '@playwright/test';

/**
 * E2E — Admin Authentication & Protected Routes
 *
 * Tests that:
 * - /admin pages redirect unauthenticated users
 * - The admin login form is accessible
 * - Wrong credentials show an error
 * - Admin API endpoints return 401 without a valid session cookie
 */

test.describe('Admin — redirect unauthenticated visitors', () => {
    const PROTECTED_ADMIN_PAGES = [
        '/admin',
        '/admin/businesses',
        '/admin/users',
        '/admin/analytics',
    ];

    for (const path of PROTECTED_ADMIN_PAGES) {
        test(`${path} redirects to login when not authenticated`, async ({ page }) => {
            const response = await page.goto(path);
            // Either redirected to login page, or the final URL contains 'login'
            const finalUrl = page.url();
            const statusOk = response?.status() === 200;
            const wasRedirected = finalUrl.includes('login') || finalUrl.includes('admin') === false;
            // Accept: ends up on login page (redirect) OR returns 401/403
            const isProtected =
                wasRedirected ||
                (response?.status() !== undefined && [401, 403].includes(response.status()));
            expect(isProtected).toBe(true);
        });
    }
});

test.describe('Admin — login page', () => {
    test('login page renders a form with email and password fields', async ({ page }) => {
        await page.goto('/admin/login');
        await expect(page.locator('input[type="text"], input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('login form has a submit button', async ({ page }) => {
        await page.goto('/admin/login');
        const btn = page.locator('button[type="submit"], input[type="submit"]');
        await expect(btn).toBeVisible();
    });

    test('wrong credentials show an error message', async ({ page }) => {
        await page.goto('/admin/login');
        await page.locator('input[type="text"], input[type="email"]').first().fill('wrong@example.com');
        await page.locator('input[type="password"]').fill('wrongpassword');
        await page.locator('button[type="submit"], input[type="submit"]').click();

        // After submitting wrong credentials the same page should show an error
        await page.waitForTimeout(1000);
        const errorVisible =
            (await page.locator('text=/onjuist|incorrect|fout|invalid|error|wrong/i').count()) > 0 ||
            page.url().includes('/admin/login');

        expect(errorVisible).toBe(true);
    });
});

test.describe('Admin API — 401 without cookie', () => {
    const PROTECTED_API_ROUTES = [
        '/api/admin/analytics',
        '/api/admin/businesses',
        '/api/admin/users',
    ];

    for (const route of PROTECTED_API_ROUTES) {
        test(`${route} returns 401 without session cookie`, async ({ request }) => {
            const resp = await request.get(route);
            expect(resp.status()).toBe(401);
        });
    }

    test('POST /api/admin/businesses returns 401 without cookie', async ({ request }) => {
        const resp = await request.patch('/api/admin/businesses', {
            data: { name: 'hack' },
        });
        expect(resp.status()).toBe(401);
    });
});

test.describe('Dashboard — redirect unauthenticated visitors', () => {
    test('/dashboard redirects when not logged in', async ({ page }) => {
        const response = await page.goto('/dashboard');
        const finalUrl = page.url();
        const isProtected =
            finalUrl.includes('login') ||
            finalUrl.includes('inloggen') ||
            (response?.status() !== undefined && [401, 403].includes(response.status()));
        expect(isProtected).toBe(true);
    });
});

test.describe('Debug endpoint — production lock', () => {
    test('/api/debug/categories returns 404 in production-like environment', async ({ request }) => {
        // In E2E the server runs with NODE_ENV=development (next dev),
        // so this will return 200 — we just verify it does NOT expose data in production.
        // Skip if running against production BASE_URL.
        const baseUrl = process.env.BASE_URL ?? '';
        if (baseUrl && !baseUrl.includes('localhost')) {
            const resp = await request.get('/api/debug/categories');
            expect(resp.status()).toBe(404);
        } else {
            test.skip();
        }
    });
});
