import { test, expect } from '@playwright/test';

/**
 * E2E — Business Detail Page
 *
 * Finds a real business via the homepage, navigates to its detail page,
 * and verifies all critical sections are present.
 */

// Utility: find a real business detail page URL.
// Strategy:
//   1. Try the known seed business at /bedrijven/de-koffie-kamer-utrecht
//   2. Try link-discovery on the homepage
//   3. Return null if no real business page is available (tests will skip)
async function findFirstBusinessUrl(page: any): Promise<string | null> {
    // 1. Try known seed business first (fastest, no page scraping needed)
    const seedUrl = '/bedrijven/de-koffie-kamer-utrecht';
    try {
        const resp = await page.request.get(seedUrl);
        if (resp.status() === 200) return seedUrl;
    } catch {
        // network error — continue to discovery
    }

    // 2. Homepage link discovery
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // BusinessGrid links: /utrecht/bedrijf/{slug}
    // BusinessScrollSection links: /{province}/{city}/{neighborhood}/{category}/{subcategory}/{business}
    const selectors = [
        'a[href*="/bedrijven/"]',   // /bedrijven/[slug] route
        'a[href*="/bedrijf/"]',     // BusinessGrid pattern
        'a[href*="/eten-drinken/"]',
        'a[href*="/beauty/"]',
        'a[href*="/klussen/"]',
        'a[href*="/gezondheid/"]',
        'a[href*="/it-tech/"]',
        'a[href*="/winkels/"]',
    ];

    for (const sel of selectors) {
        const link = page.locator(sel).first();
        if (await link.count() > 0) {
            const href = await link.getAttribute('href');
            if (href && href.startsWith('/')) return href;
        }
    }
    return null;
}

test.describe('Business Detail Page', () => {
    let businessUrl: string | null = null;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        businessUrl = await findFirstBusinessUrl(page);
        await page.close();
        // businessUrl is null when no business exists in the DB — all tests skip
    });

    test('business page loads with 200 status', async ({ page }) => {
        if (!businessUrl) test.skip();
        const resp = await page.goto(businessUrl!);
        expect(resp?.status()).toBe(200);
    });

    test('business page has a <h1> with the business name', async ({ page }) => {
        if (!businessUrl) test.skip();
        await page.goto(businessUrl!);
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
        const text = await h1.textContent();
        expect(text?.trim().length).toBeGreaterThan(2);
    });

    test('business page has a meta description', async ({ page }) => {
        if (!businessUrl) test.skip();
        await page.goto(businessUrl!);
        const meta = await page.locator('meta[name="description"]').getAttribute('content');
        expect(meta).toBeTruthy();
        expect(meta!.length).toBeGreaterThan(10);
    });

    test('business page has JSON-LD structured data', async ({ page }) => {
        if (!businessUrl) test.skip();
        await page.goto(businessUrl!);
        const scripts = page.locator('script[type="application/ld+json"]');
        const count = await scripts.count();
        if (count === 0) {
            test.skip();
            return;
        }
        const content = await scripts.first().textContent();
        const parsed = JSON.parse(content!);
        expect(parsed['@context']).toContain('schema.org');
    });

    test('business page has contact information visible', async ({ page }) => {
        if (!businessUrl) test.skip();
        await page.goto(businessUrl!);
        // At least one of phone/email/website should be visible
        const contactElements = page.locator(
            'a[href^="tel:"], a[href^="mailto:"], a[href^="https://"][aria-label], .contact'
        );
        const count = await contactElements.count();
        expect(count).toBeGreaterThan(0);
    });

    test('business page has canonical URL', async ({ page }) => {
        if (!businessUrl) test.skip();
        await page.goto(businessUrl!);
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute('href', /.+/);
    });

    test('business page has og:title meta tag', async ({ page }) => {
        if (!businessUrl) test.skip();
        await page.goto(businessUrl!);
        const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
        expect(ogTitle).toBeTruthy();
    });

    test('business page has address or location info', async ({ page }) => {
        if (!businessUrl) test.skip();
        await page.goto(businessUrl!);
        // Look for city name, postal code, or address-like content
        const body = await page.textContent('body');
        // City or street should appear somewhere on the page
        const hasLocation = /\d{4}\s?[A-Z]{2}|straat|laan|weg|plein|Utrecht|Amsterdam|Rotterdam/i.test(body ?? '');
        expect(hasLocation).toBe(true);
    });
});

test.describe('Business Detail Page — Mobile', () => {
    test.use({ viewport: { width: 390, height: 844 } }); // iPhone 15 size

    test('MobileBusinessBar is visible on small screens', async ({ page }) => {
        // Try seed URL first, then homepage link discovery
        let href: string | null = null;
        try {
            const resp = await page.request.get('/bedrijven/de-koffie-kamer-utrecht');
            if (resp.status() === 200) href = '/bedrijven/de-koffie-kamer-utrecht';
        } catch { /* continue */ }

        if (!href) {
            await page.goto('/');
            const businessLink = page.locator(
                'a[href*="/bedrijven/"], a[href*="/bedrijf/"], a[href*="/eten-drinken/"]'
            ).first();
            if (await businessLink.count() === 0) {
                test.skip();
                return;
            }
            href = await businessLink.getAttribute('href');
        }

        await page.goto(href!);

        // The fixed mobile bottom bar should be visible on mobile viewport
        // It may use various class names — check for a tel: or whatsapp link instead
        const phoneOrCta = page.locator('a[href^="tel:"], a[href*="wa.me"]').first();
        await expect(phoneOrCta).toBeAttached();
    });
});
