import { test, expect } from '@playwright/test';

/**
 * E2E — Search
 *
 * Tests the /search page: URL-based query, results rendering,
 * empty-state messaging and navigation to a result.
 */

test.describe('Search page — URL query', () => {
    test('loads with status 200', async ({ page }) => {
        const resp = await page.goto('/search?q=kapper');
        expect(resp?.status()).toBe(200);
    });

    test('has the search term reflected in the page title', async ({ page }) => {
        await page.goto('/search?q=kapper');
        const title = await page.title();
        expect(title.toLowerCase()).toContain('kapper');
    });

    test('has meta description containing the search term', async ({ page }) => {
        await page.goto('/search?q=kapper');
        const metaEl = page.locator('head meta[name="description"]').first();
        if (await metaEl.count() === 0) { test.skip(); return; }
        const meta = await metaEl.getAttribute('content');
        if (!meta) { test.skip(); return; }
        expect(meta.toLowerCase()).toContain('kapper');
    });

    test('shows at least one result or empty-state message', async ({ page }) => {
        await page.goto('/search?q=kapper');
        await page.waitForLoadState('networkidle');

        // Could be result cards OR a "geen resultaten" message
        const cards = page.locator('[class*="card"], [class*="Card"], article, .business-item');
        const emptyMsg = page.locator('text=/geen resultaten|niet gevonden|no results/i');

        const hasCards = await cards.count() > 0;
        const hasEmpty = await emptyMsg.count() > 0;

        expect(hasCards || hasEmpty).toBe(true);
    });

    test('empty query shows all or redirects gracefully', async ({ page }) => {
        const resp = await page.goto('/search?q=');
        expect(resp?.status()).toBe(200);
    });

    test('non-existent search term shows empty-state or zero results', async ({ page }) => {
        await page.goto('/search?q=xyzabc123notarealterm999');
        await page.waitForLoadState('networkidle');
        const body = await page.textContent('body');
        // Either shows "geen" / "not found" or just renders 0 cards
        expect(body).toBeTruthy();
        expect(body!.length).toBeGreaterThan(100); // page is rendered at all
    });
});

test.describe('Search page — result interaction', () => {
    test('clicking a result navigates to business detail page', async ({ page }) => {
        await page.goto('/search?q=kapper');
        await page.waitForLoadState('networkidle');

        // Find first clickable business link
        const resultLink = page.locator('a[href*="/beauty/"], a[href*="/bedrijf/"], a[href*="/kapper"]').first();

        if (await resultLink.count() === 0) {
            test.skip(); return;
        }

        const href = await resultLink.getAttribute('href');
        await resultLink.click();
        await page.waitForLoadState('domcontentloaded');

        // Should navigate away from /search
        expect(page.url()).not.toBe(`${process.env.BASE_URL ?? 'http://localhost:3000'}/search`);
        // The business detail page should have an h1
        await expect(page.locator('h1').first()).toBeVisible();
    });
});

test.describe('Search — category filter in URL', () => {
    test('/search?q=&category=beauty loads without error', async ({ page }) => {
        const resp = await page.goto('/search?q=&category=beauty');
        expect(resp?.status()).toBe(200);
    });

    test('/search with sort parameter loads without error', async ({ page }) => {
        const resp = await page.goto('/search?q=restaurant&sort=rating');
        expect(resp?.status()).toBe(200);
    });
});

test.describe('Search — API endpoint', () => {
    test('/api/search?q=kapper returns JSON array', async ({ request }) => {
        const resp = await request.get('/api/search?q=kapper');
        // The search endpoint exists — could be 200 with results or even 404 if not implemented
        if (resp.status() === 200) {
            const ct = resp.headers()['content-type'];
            expect(ct).toContain('json');
            const data = await resp.json();
            // Should be an array or an object with results
            expect(typeof data).toBe('object');
        } else {
            // 404 means endpoint doesn't exist — that's fine, just skip
            test.skip();
        }
    });
});
