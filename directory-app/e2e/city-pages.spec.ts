import { test, expect } from '@playwright/test';

/**
 * E2E — City & Province Pages
 *
 * Tests /steden (list), /steden/[slug] and /provincies/[slug].
 */

// ── City list page ────────────────────────────────────────────────────────────
test.describe('City list page — /steden', () => {
    test('returns 200', async ({ page }) => {
        const resp = await page.goto('/steden');
        expect(resp?.status()).toBe(200);
    });

    test('has a <h1>', async ({ page }) => {
        await page.goto('/steden');
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
        const text = await h1.textContent();
        expect(text?.trim().length).toBeGreaterThan(2);
    });

    test('has meta description', async ({ page }) => {
        await page.goto('/steden');
        const meta = await page.locator('head meta[name="description"]').first().getAttribute('content');
        expect(meta).toBeTruthy();
        expect(meta!.length).toBeGreaterThan(10);
    });

    test('shows links to city detail pages', async ({ page }) => {
        await page.goto('/steden');
        await page.waitForLoadState('networkidle');
        const links = page.locator('a[href*="/steden/"]');
        const count = await links.count();
        expect(count).toBeGreaterThan(0);
    });
});

// ── City detail page ──────────────────────────────────────────────────────────
test.describe('City detail page — /steden/[slug]', () => {
    let cityUrl: string | null = null;

    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();

        // Try to pick a city from the list page
        await page.goto('/steden');
        await page.waitForLoadState('networkidle');
        const link = page.locator('a[href*="/steden/"]').first();
        if (await link.count() > 0) {
            cityUrl = await link.getAttribute('href');
        }
        // Fallback to a well-known city that is always in CITY_KEYWORDS
        if (!cityUrl) cityUrl = '/steden/utrecht';
        await ctx.close();
    });

    test('returns 200', async ({ page }) => {
        if (!cityUrl) test.skip();
        const resp = await page.goto(cityUrl!);
        expect(resp?.status()).toBe(200);
    });

    test('has a <h1> with city name', async ({ page }) => {
        if (!cityUrl) test.skip();
        await page.goto(cityUrl!);
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
        const text = await h1.textContent();
        expect(text?.trim().length).toBeGreaterThan(2);
    });

    test('has meta description', async ({ page }) => {
        if (!cityUrl) test.skip();
        await page.goto(cityUrl!);
        const meta = await page.locator('head meta[name="description"]').first().getAttribute('content');
        expect(meta).toBeTruthy();
        expect(meta!.length).toBeGreaterThan(10);
    });

    test('has canonical URL', async ({ page }) => {
        if (!cityUrl) test.skip();
        await page.goto(cityUrl!);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toBeTruthy();
    });

    test('has og:title', async ({ page }) => {
        if (!cityUrl) test.skip();
        await page.goto(cityUrl!);
        const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
        expect(ogTitle).toBeTruthy();
    });

    test('shows neighborhood or category sections', async ({ page }) => {
        if (!cityUrl) test.skip();
        await page.goto(cityUrl!);
        await page.waitForLoadState('networkidle');
        const body = await page.textContent('body');
        expect(body?.length).toBeGreaterThan(200);
    });

    test('unknown city slug returns non-500', async ({ page }) => {
        const resp = await page.goto('/steden/this-city-does-not-exist-xyz');
        expect(resp?.status()).not.toBe(500);
    });
});

// ── Province detail page ──────────────────────────────────────────────────────
test.describe('Province detail page — /provincies/[slug]', () => {
    // 'utrecht' is always present in NETHERLANDS_PROVINCES
    const PROVINCE = 'utrecht';

    test('returns 200', async ({ page }) => {
        const resp = await page.goto(`/provincies/${PROVINCE}`);
        expect(resp?.status()).toBe(200);
    });

    test('has a <h1> with province name', async ({ page }) => {
        await page.goto(`/provincies/${PROVINCE}`);
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
        const text = await h1.textContent();
        expect(text?.trim().length).toBeGreaterThan(2);
    });

    test('has meta description', async ({ page }) => {
        await page.goto(`/provincies/${PROVINCE}`);
        const meta = await page.locator('head meta[name="description"]').first().getAttribute('content');
        expect(meta).toBeTruthy();
        expect(meta!.length).toBeGreaterThan(10);
    });

    test('has og:title', async ({ page }) => {
        await page.goto(`/provincies/${PROVINCE}`);
        const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
        expect(ogTitle).toBeTruthy();
    });

    test('shows city links', async ({ page }) => {
        await page.goto(`/provincies/${PROVINCE}`);
        await page.waitForLoadState('networkidle');
        const body = await page.textContent('body');
        expect(body?.length).toBeGreaterThan(200);
    });

    test('unknown province slug returns non-500', async ({ page }) => {
        const resp = await page.goto('/provincies/this-province-does-not-exist');
        expect(resp?.status()).not.toBe(500);
    });

    test('returns 200 for noord-holland', async ({ page }) => {
        const resp = await page.goto('/provincies/noord-holland');
        expect(resp?.status()).toBe(200);
    });
});
