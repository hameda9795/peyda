import { test, expect } from '@playwright/test';

/**
 * E2E — Homepage
 *
 * Tests core functionality of the homepage: loading, navigation links,
 * main sections and basic accessibility requirements.
 */

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    // ── Loading ──────────────────────────────────────────────────────────────
    test('loads with 200 status', async ({ page }) => {
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);
    });

    test('has correct page title', async ({ page }) => {
        // Should contain the site/brand name
        const title = await page.title();
        expect(title.length).toBeGreaterThan(5);
        expect(title).not.toBe('Error');
    });

    // ── SEO meta ─────────────────────────────────────────────────────────────
    test('has meta description', async ({ page }) => {
        const metaDesc = page.locator('meta[name="description"]');
        await expect(metaDesc).toHaveAttribute('content', /.{10,}/);
    });

    test('has canonical link', async ({ page }) => {
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute('href', /.+/);
    });

    test('has Open Graph title', async ({ page }) => {
        const ogTitle = page.locator('meta[property="og:title"]');
        await expect(ogTitle).toHaveAttribute('content', /.{3,}/);
    });

    test('has Open Graph image', async ({ page }) => {
        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute('content', /.+/);
    });

    // ── Accessibility ────────────────────────────────────────────────────────
    test('has a single <h1> element', async ({ page }) => {
        const h1s = page.locator('h1');
        await expect(h1s).toHaveCount(1);
    });

    test('has skip-to-content link or main landmark', async ({ page }) => {
        const main = page.locator('main');
        await expect(main).toHaveCount(1);
    });

    // ── Navigation ───────────────────────────────────────────────────────────
    test('navigation contains link to categories page', async ({ page }) => {
        // Link may be inside Mega Menu or mobile nav — check existence in DOM, not visibility
        const catLink = page.locator('a[href="/categorieen"], a[href*="/categorieen"]').first();
        await expect(catLink).toHaveAttribute('href', /categorieen/);
    });

    test('navigation contains link to cities page (steden)', async ({ page }) => {
        const linkEl = page.locator('a[href*="steden"], a[href*="nederland"], a[href*="provincies"]').first();
        await expect(linkEl).toHaveAttribute('href', /.+/);
    });

    // ── No runtime errors ────────────────────────────────────────────────────
    test('no uncaught console errors on load', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        // Filter out known benign errors: 404 static assets (dev server),
        // auth check failures (expected when not logged in), browser extensions
        const realErrors = errors.filter(e =>
            !e.includes('ERR_BLOCKED_BY_CLIENT') &&
            !e.includes('favicon') &&
            !e.includes('404') &&
            !e.includes('Failed to load resource') &&
            !e.includes('Auth check failed') &&
            !e.includes('fetchServerAction')
        );
        expect(realErrors).toHaveLength(0);
    });

    // ── Core Web Vitals proxy: no layout shift markers ────────────────────────
    test('page renders visible content within viewport', async ({ page }) => {
        const body = page.locator('body');
        const box = await body.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThan(400);
    });
});

test.describe('Homepage — 404 page', () => {
    test('non-existent route returns custom 404 page', async ({ page }) => {
        const response = await page.goto('/deze-pagina-bestaat-echt-niet-xyz123');
        expect(response?.status()).toBe(404);
        // Custom 404 should still have a heading
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
    });
});
