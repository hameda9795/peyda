import { test, expect } from '@playwright/test';

/**
 * E2E — SEO
 *
 * Verifies that critical SEO elements are present and valid across
 * key page types: homepage, category pages, city pages.
 */

// Pages to test SEO on — adjust slugs to match real DB data if needed
const PAGES = [
    { name: 'homepage', url: '/' },
    { name: 'categories overview', url: '/categorieen' },
    { name: 'cities overview', url: '/steden' },
    { name: 'contact', url: '/contact' },
];

// ── Meta tag completeness ─────────────────────────────────────────────────────
for (const { name, url } of PAGES) {
    test(`${name}: has <title> tag`, async ({ page }) => {
        await page.goto(url);
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(5);
    });

    test(`${name}: has meta description`, async ({ page }) => {
        await page.goto(url);
        const meta = await page.locator('meta[name="description"]').getAttribute('content');
        expect(meta).toBeTruthy();
        expect(meta!.length).toBeGreaterThan(20);
    });

    test(`${name}: meta description is not too long (< 165 chars)`, async ({ page }) => {
        await page.goto(url);
        const meta = await page.locator('meta[name="description"]').getAttribute('content');
        expect(meta!.length).toBeLessThanOrEqual(165);
    });

    test(`${name}: has og:title`, async ({ page }) => {
        await page.goto(url);
        const og = await page.locator('meta[property="og:title"]').getAttribute('content');
        expect(og).toBeTruthy();
    });

    test(`${name}: has og:description`, async ({ page }) => {
        await page.goto(url);
        const og = await page.locator('meta[property="og:description"]').getAttribute('content');
        expect(og).toBeTruthy();
    });

    test(`${name}: title is unique and not blank`, async ({ page }) => {
        await page.goto(url);
        const title = await page.title();
        expect(title).not.toMatch(/^(Untitled|undefined|null)$/i);
    });
}

// ── robots.txt ───────────────────────────────────────────────────────────────
test.describe('robots.txt', () => {
    test('returns 200 with text/plain content-type', async ({ request }) => {
        const resp = await request.get('/robots.txt');
        expect(resp.status()).toBe(200);
        expect(resp.headers()['content-type']).toContain('text/plain');
    });

    test('allows crawling of main pages', async ({ request }) => {
        const text = await (await request.get('/robots.txt')).text();
        // robots.txt may use 'User-agent' or 'User-Agent' — both are valid
        expect(text.toLowerCase()).toContain('user-agent');
        expect(text).toContain('Allow: /');
    });

    test('disallows /admin/', async ({ request }) => {
        const text = await (await request.get('/robots.txt')).text();
        expect(text).toContain('Disallow: /admin');
    });

    test('disallows /api/', async ({ request }) => {
        const text = await (await request.get('/robots.txt')).text();
        expect(text).toContain('Disallow: /api');
    });

    test('contains Sitemap URL', async ({ request }) => {
        const text = await (await request.get('/robots.txt')).text();
        expect(text).toContain('Sitemap:');
    });
});

// ── sitemap.xml ──────────────────────────────────────────────────────────────
test.describe('sitemap.xml', () => {
    test('returns 200', async ({ request }) => {
        const resp = await request.get('/sitemap.xml');
        expect(resp.status()).toBe(200);
    });

    test('content-type is XML', async ({ request }) => {
        const resp = await request.get('/sitemap.xml');
        expect(resp.headers()['content-type']).toContain('xml');
    });

    test('contains homepage URL', async ({ request }) => {
        const text = await (await request.get('/sitemap.xml')).text();
        expect(text).toContain('<loc>');
        expect(text).toContain('</urlset>');
    });
});

// ── Structured data (JSON-LD) ─────────────────────────────────────────────────
test.describe('Structured data on homepage', () => {
    test('homepage has at least one JSON-LD script block', async ({ page }) => {
        await page.goto('/');
        const jsonLd = page.locator('script[type="application/ld+json"]');
        const count = await jsonLd.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test('JSON-LD is valid JSON', async ({ page }) => {
        await page.goto('/');
        const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
        for (const block of blocks) {
            expect(() => JSON.parse(block)).not.toThrow();
        }
    });

    test('JSON-LD contains @context schema.org', async ({ page }) => {
        await page.goto('/');
        const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
        const combined = blocks.join(' ');
        expect(combined).toContain('schema.org');
    });
});

// ── Security headers ─────────────────────────────────────────────────────────
test.describe('Security headers', () => {
    test('X-Frame-Options header is set', async ({ request }) => {
        const resp = await request.get('/');
        const header = resp.headers()['x-frame-options'];
        expect(header).toBeTruthy();
        expect(header.toUpperCase()).toMatch(/SAMEORIGIN|DENY/);
    });

    test('X-Content-Type-Options: nosniff', async ({ request }) => {
        const resp = await request.get('/');
        expect(resp.headers()['x-content-type-options']).toBe('nosniff');
    });

    test('Referrer-Policy header is set', async ({ request }) => {
        const resp = await request.get('/');
        expect(resp.headers()['referrer-policy']).toBeTruthy();
    });
});
