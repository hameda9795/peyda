import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration.
 *
 * Expects the Next.js dev server to be running on port 3000.
 * Run: npm run dev   (in one terminal)
 *      npm run test:e2e  (in another)
 *
 * Or use `webServer` below to auto-start it.
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],

    use: {
        baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
        trace: 'on-first-retry',
        /* Faster: skip loading images/fonts in most tests */
        launchOptions: {
            args: ['--disable-web-security'],
        },
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    /* Auto-start the Next.js dev server when running e2e tests */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,   // reuse if already running
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
