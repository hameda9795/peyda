/**
 * SEO Unit Tests — robots.ts and sitemap static pages
 *
 * robots.txt is critical for SEO:
 *  - /admin/* must always be blocked from crawlers
 *  - /api/* must always be blocked
 *  - All public pages must be allowed
 */
import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';

describe('robots() — Crawler rules', () => {
    it('returns a sitemap URL', () => {
        const result = robots();
        expect(result.sitemap).toContain('sitemap.xml');
        expect(result.sitemap).toMatch(/^https?:\/\//);
    });

    it('has at least one rule', () => {
        const result = robots();
        expect(Array.isArray(result.rules)).toBe(true);
        expect(result.rules.length).toBeGreaterThan(0);
    });

    it('wildcard rule allows "/" (all public pages)', () => {
        const result = robots();
        const wildcardRule = (result.rules as any[]).find(
            (r: any) => r.userAgent === '*'
        );
        expect(wildcardRule).toBeDefined();
        const allow = Array.isArray(wildcardRule.allow)
            ? wildcardRule.allow
            : [wildcardRule.allow];
        expect(allow).toContain('/');
    });

    // 🔐 Security: admin panel must NEVER be indexed
    it('blocks /admin/ for all crawlers', () => {
        const result = robots();
        (result.rules as any[]).forEach((rule: any) => {
            const disallow = Array.isArray(rule.disallow)
                ? rule.disallow
                : [rule.disallow];
            expect(disallow).toContain('/admin/');
        });
    });

    // 🔐 Security: API routes must never be indexed
    it('blocks /api/ for all crawlers', () => {
        const result = robots();
        (result.rules as any[]).forEach((rule: any) => {
            const disallow = Array.isArray(rule.disallow)
                ? rule.disallow
                : [rule.disallow];
            expect(disallow).toContain('/api/');
        });
    });

    it('blocks /bedrijf-aanmelden/verwerken/ (registration flow)', () => {
        const result = robots();
        const wildcardRule = (result.rules as any[]).find(
            (r: any) => r.userAgent === '*'
        );
        const disallow = Array.isArray(wildcardRule.disallow)
            ? wildcardRule.disallow
            : [wildcardRule.disallow];
        expect(disallow).toContain('/bedrijf-aanmelden/verwerken/');
    });

    it('has a specific Googlebot rule', () => {
        const result = robots();
        const googlebotRule = (result.rules as any[]).find(
            (r: any) => r.userAgent === 'Googlebot'
        );
        expect(googlebotRule).toBeDefined();
    });

    it('Googlebot rule also blocks /admin/', () => {
        const result = robots();
        const googlebotRule = (result.rules as any[]).find(
            (r: any) => r.userAgent === 'Googlebot'
        ) as any;
        const disallow = Array.isArray(googlebotRule.disallow)
            ? googlebotRule.disallow
            : [googlebotRule.disallow];
        expect(disallow).toContain('/admin/');
    });

    it('sitemap URL uses NEXT_PUBLIC_SITE_URL env var', () => {
        const result = robots();
        const expectedBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://peyda.nl';
        expect((result.sitemap as string)).toContain(expectedBase);
    });
});
