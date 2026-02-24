import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
    plugins: [tsconfigPaths()],
    resolve: {
        // Needed so runtime require('@/...') inside source modules resolves correctly
        alias: { '@': resolve(__dirname, 'src') },
    },
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./src/__tests__/setup.ts'],
        // Exclude Playwright E2E tests — those are run by `npm run test:e2e`
        exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
        env: {
            NODE_ENV: 'test',
            ADMIN_EMAIL: 'testadmin',
            ADMIN_PASSWORD: 'testpassword123',
            ADMIN_SESSION_VALUE: 'test-session-token-abc123xyz',
            CRON_SECRET: 'test-cron-secret',
            NEXT_PUBLIC_SITE_URL: 'https://peyda.nl',
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: [
                'src/lib/**/*.ts',
                'src/app/api/**/*.ts',
                'src/middleware.ts',
            ],
            exclude: [
                'src/lib/prisma.ts',
                'src/lib/db.ts',
                '**/*.d.ts',
            ],
        },
    },
});
