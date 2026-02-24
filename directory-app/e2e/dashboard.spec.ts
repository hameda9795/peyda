import { test, expect } from '@playwright/test';

/**
 * E2E — Dashboard Page (/dashboard)
 *
 * Tests redirect behaviour for unauthenticated users,
 * and basic page structure for the dashboard route.
 */

test.describe('Dashboard — unauthenticated redirect', () => {
    test('redirects unauthenticated user away from /dashboard', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        // Should NOT stay on /dashboard without credentials
        // Expected: redirect to /bedrijf-aanmelden or /login or similar
        const url = page.url();
        expect(url).not.toMatch(/\/dashboard$/);
    });

    test('redirected destination returns 200', async ({ page }) => {
        const resp = await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        // Final page after redirect should be OK
        expect(resp?.status()).toBe(200);
    });

    test('redirect includes a meaningful message or page', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        const body = await page.textContent('body');
        // Should show login, registration form, or some recognizable UI
        const hasMeaningfulContent = /bedrijf|aanmelden|inloggen|registreer|login/i.test(body ?? '');
        expect(hasMeaningfulContent).toBe(true);
    });

    test('redirect target has a <h1> or visible heading', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
    });
});

// ── Dashboard URL with message param ─────────────────────────────────────────
test.describe('Dashboard — query params', () => {
    test('/bedrijf-aanmelden?message=no-business returns 200', async ({ page }) => {
        const resp = await page.goto('/bedrijf-aanmelden?message=no-business');
        expect(resp?.status()).toBe(200);
    });

    test('shows registration form on ?message=no-business', async ({ page }) => {
        await page.goto('/bedrijf-aanmelden?message=no-business');
        await page.waitForLoadState('networkidle');
        const body = await page.textContent('body');
        expect(/bedrijf|aanmelden|naam|registreer/i.test(body ?? '')).toBe(true);
    });
});

// ── Dashboard sub-routes ──────────────────────────────────────────────────────
test.describe('Dashboard sub-routes — unauthenticated', () => {
    const subRoutes = ['/dashboard/profile', '/dashboard/reviews', '/dashboard/seo'];

    for (const route of subRoutes) {
        test(`${route} redirects or returns non-500`, async ({ page }) => {
            const resp = await page.goto(route);
            await page.waitForLoadState('networkidle');
            // Should redirect or show an accessible page - NOT crash with 500
            expect(resp?.status()).not.toBe(500);
            // After redirect, the final URL should be reachable
            const finalResp = await page.request.get(page.url());
            expect(finalResp.status()).toBe(200);
        });
    }
});
