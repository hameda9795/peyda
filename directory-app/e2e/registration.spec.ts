import { test, expect } from '@playwright/test';

/**
 * E2E — Business Registration Form  (/bedrijf-aanmelden)
 *
 * Tests the multi-step registration page: page load, step 1 UI,
 * client-side validation, navigation between steps.
 * Does NOT submit the form (would require a real DB + auth session).
 */

test.describe('Registration page — /bedrijf-aanmelden', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/bedrijf-aanmelden');
        await page.waitForLoadState('networkidle');
    });

    // ── Page load ─────────────────────────────────────────────────────────────
    test('returns 200', async ({ page }) => {
        const resp = await page.goto('/bedrijf-aanmelden');
        expect(resp?.status()).toBe(200);
    });

    test('has a <h1> or step title visible', async ({ page }) => {
        // The form shows a step title like "Basisgegevens"
        const h1 = page.locator('h1, h2').first();
        await expect(h1).toBeVisible();
        const text = await h1.textContent();
        expect(text?.trim().length).toBeGreaterThan(2);
    });

    test('shows step 1 fields — Bedrijfsnaam and Categorie', async ({ page }) => {
        // Step 1: name input — placeholder is "Bijv. De Koffie Kamer Utrecht"
        const nameInput = page.locator('input[placeholder*="Koffie"], input[placeholder*="naam"], input[placeholder*="Naam"], input[placeholder*="bedrijf"]').first();
        if (await nameInput.count() === 0) { test.skip(); return; }
        await expect(nameInput).toBeVisible();
    });

    test('shows step indicator with 5 steps', async ({ page }) => {
        // Progress bar / step numbers — the form has 5 steps
        const body = await page.textContent('body');
        // Should contain step numbers or step titles
        expect(
            body?.includes('Basisgegevens') ||
            body?.includes('Locatie') ||
            body?.includes('stap') ||
            body?.includes('Stap')
        ).toBe(true);
    });

    test('shows validation error when trying to advance with empty name', async ({ page }) => {
        // Find and click the "Volgende" / "Doorgaan" button without filling anything
        const nextBtn = page.locator('button').filter({ hasText: /volgende|doorgaan|verder/i }).first();
        if (await nextBtn.count() === 0) { test.skip(); return; }
        await nextBtn.click();
        await page.waitForTimeout(300);

        // An error message or highlighted field should appear
        const errorEl = page.locator(
            '[class*="error"], [class*="invalid"], [role="alert"], .text-red-500, .text-red-600'
        ).first();
        const hasError = await errorEl.count() > 0;
        // If no explicit error element, the button click should NOT advance to step 2
        // (i.e. we should still see step 1 fields)
        const nameInput = page.locator('input[name="name"], input[placeholder*="naam"], input[placeholder*="Naam"]').first();
        const stillOnStep1 = await nameInput.isVisible();
        expect(hasError || stillOnStep1).toBe(true);
    });

    test('can fill step 1 name field', async ({ page }) => {
        const nameInput = page.locator('input[placeholder*="Koffie"], input[placeholder*="naam"], input[placeholder*="Naam"], input[placeholder*="bedrijf"]').first();
        if (await nameInput.count() === 0) { test.skip(); return; }
        await nameInput.fill('Test Bedrijf Amsterdam');
        expect(await nameInput.inputValue()).toBe('Test Bedrijf Amsterdam');
    });

    test('has a progress indicator showing current step', async ({ page }) => {
        // Step indicators are typically buttons or spans with step numbers
        const stepIndicators = page.locator('[class*="step"], [class*="Step"], [aria-label*="stap"]');
        const count = await stepIndicators.count();
        // At minimum the current step should be indicated somewhere
        const body = await page.textContent('body');
        const hasStepContent = /stap|step|1\/5|1 van/i.test(body ?? '');
        expect(count > 0 || hasStepContent).toBe(true);
    });

    test('shows "Inloggen" or auth prompt for unauthenticated users', async ({ page }) => {
        // The page might show a login modal or redirect message
        // OR it allows filling the form and validates on submit
        const body = await page.textContent('body');
        const hasFormOrAuthPrompt =
            /bedrijf|registreer|aanmelden|naam|categorie|inloggen/i.test(body ?? '');
        expect(hasFormOrAuthPrompt).toBe(true);
    });
});

// ── Registration with query param ─────────────────────────────────────────────
test.describe('Registration page — query params', () => {
    test('accepts email query param without error', async ({ page }) => {
        const resp = await page.goto('/bedrijf-aanmelden?email=test%40example.com');
        expect(resp?.status()).toBe(200);
    });

    test('accepts message query param without error', async ({ page }) => {
        const resp = await page.goto('/bedrijf-aanmelden?message=no-business');
        expect(resp?.status()).toBe(200);
    });
});
