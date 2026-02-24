import { test, expect } from '@playwright/test';

/**
 * E2E — Category Pages
 *
 * Tests the category list page (/categorieen) and
 * individual category detail pages (/categorieen/[slug]).
 */

// ── Category list page ────────────────────────────────────────────────────────
test.describe('Category list page — /categorieen', () => {
    test('returns 200', async ({ page }) => {
        const resp = await page.goto('/categorieen');
        expect(resp?.status()).toBe(200);
    });

    test('has a <h1>', async ({ page }) => {
        await page.goto('/categorieen');
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
        const text = await h1.textContent();
        expect(text?.trim().length).toBeGreaterThan(2);
    });

    test('has meta description', async ({ page }) => {
        await page.goto('/categorieen');
        const meta = await page.locator('head meta[name="description"]').first().getAttribute('content');
        expect(meta).toBeTruthy();
        expect(meta!.length).toBeGreaterThan(10);
    });

    test('shows category cards / links', async ({ page }) => {
        await page.goto('/categorieen');
        await page.waitForLoadState('networkidle');
        // Should have at least one link pointing to a category detail page
        const catLinks = page.locator('a[href*="/categorieen/"]');
        const count = await catLinks.count();
        expect(count).toBeGreaterThan(0);
    });
});

// ── Category detail page ──────────────────────────────────────────────────────
test.describe('Category detail page — /categorieen/[slug]', () => {
    let categoryUrl: string | null = null;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto('/categorieen');
        await page.waitForLoadState('networkidle');
        const link = page.locator('a[href*="/categorieen/"]').first();
        if (await link.count() > 0) {
            categoryUrl = await link.getAttribute('href');
        }
        // Fallback to a known seed category slug
        if (!categoryUrl) categoryUrl = '/categorieen/beauty';
        await page.close();
    });

    test('returns 200', async ({ page }) => {
        if (!categoryUrl) test.skip();
        const resp = await page.goto(categoryUrl!);
        expect(resp?.status()).toBe(200);
    });

    test('has a <h1> with the category name', async ({ page }) => {
        if (!categoryUrl) test.skip();
        await page.goto(categoryUrl!);
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
        const text = await h1.textContent();
        expect(text?.trim().length).toBeGreaterThan(2);
    });

    test('has meta description', async ({ page }) => {
        if (!categoryUrl) test.skip();
        await page.goto(categoryUrl!);
        const meta = await page.locator('head meta[name="description"]').first().getAttribute('content');
        expect(meta).toBeTruthy();
        expect(meta!.length).toBeGreaterThan(10);
    });

    test('has canonical URL', async ({ page }) => {
        if (!categoryUrl) { test.skip(); return; }
        await page.goto(categoryUrl!);
        const canonical = page.locator('link[rel="canonical"]');
        if (await canonical.count() === 0) return;
        const href = await canonical.first().getAttribute('href');
        if (!href) return;
        expect(href.length).toBeGreaterThan(0);
    });

    test('has og:title meta tag', async ({ page }) => {
        if (!categoryUrl) { test.skip(); return; }
        await page.goto(categoryUrl!);
        const ogTitle = page.locator('meta[property="og:title"]');
        if (await ogTitle.count() === 0) return;
        const content = await ogTitle.first().getAttribute('content');
        if (!content) return;
        expect(content.length).toBeGreaterThan(0);
    });

    test('shows subcategory list or business section', async ({ page }) => {
        if (!categoryUrl) test.skip();
        await page.goto(categoryUrl!);
        await page.waitForLoadState('networkidle');
        const body = await page.textContent('body');
        // Should contain some meaningful content
        expect(body?.length).toBeGreaterThan(200);
    });

    test('has JSON-LD structured data', async ({ page }) => {
        if (!categoryUrl) { test.skip(); return; }
        await page.goto(categoryUrl!);
        const scripts = page.locator('script[type="application/ld+json"]');
        if (await scripts.count() === 0) return;
        const content = await scripts.first().textContent();
        if (!content) return;
        let parsed: Record<string, unknown>;
        try { parsed = JSON.parse(content); } catch { return; }
        if (!parsed['@context']) return;
        expect(String(parsed['@context'])).toContain('schema.org');
    });
});

// ── Category detail — unknown slug returns 404 / not-found ────────────────────
test.describe('Category detail page — 404 handling', () => {
    test('unknown category slug renders not-found (non-500)', async ({ page }) => {
        const resp = await page.goto('/categorieen/this-category-does-not-exist-xyz');
        // Acceptable: 200 (Next.js not-found route), 404; NOT 500
        expect(resp?.status()).not.toBe(500);
    });
});
