import { describe, it, expect } from 'vitest';
import {
    stripSeoSlug,
    cleanCategoryName,
    cleanSubcategorySlug,
} from '@/lib/seo-slug';

// ─── stripSeoSlug ─────────────────────────────────────────────────────────────
describe('stripSeoSlug', () => {
    it('removes /utrecht/ prefix', () => {
        expect(stripSeoSlug('/utrecht/eten-drinken')).toBe('eten-drinken');
    });

    it('removes utrecht/ prefix (without leading slash)', () => {
        expect(stripSeoSlug('utrecht/beauty')).toBe('beauty');
    });

    it('removes /nederland/ prefix', () => {
        expect(stripSeoSlug('/nederland/zorg')).toBe('zorg');
    });

    it('removes nederland/ prefix (without leading slash)', () => {
        expect(stripSeoSlug('nederland/sport')).toBe('sport');
    });

    it('removes only the leading slash when no city prefix present', () => {
        expect(stripSeoSlug('/restaurant')).toBe('restaurant');
    });

    it('returns empty string for null', () => {
        expect(stripSeoSlug(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
        expect(stripSeoSlug(undefined)).toBe('');
    });

    it('returns empty string for empty string', () => {
        expect(stripSeoSlug('')).toBe('');
    });

    it('leaves plain slugs untouched', () => {
        expect(stripSeoSlug('eten-drinken')).toBe('eten-drinken');
    });

    it('handles nested paths: keeps sub-path after prefix', () => {
        expect(stripSeoSlug('/utrecht/eten-drinken/restaurant')).toBe(
            'eten-drinken/restaurant'
        );
    });
});

// ─── cleanCategoryName ────────────────────────────────────────────────────────
describe('cleanCategoryName', () => {
    it('removes " in Utrecht" suffix', () => {
        expect(cleanCategoryName('Restaurants in Utrecht')).toBe('Restaurants');
    });

    it('removes " in Nederland" suffix', () => {
        expect(cleanCategoryName('Kappers in Nederland')).toBe('Kappers');
    });

    it('does not modify names without location suffix', () => {
        expect(cleanCategoryName('Beauty')).toBe('Beauty');
    });

    it('handles empty string', () => {
        expect(cleanCategoryName('')).toBe('');
    });

    it('is case-sensitive — only removes exact casing', () => {
        // "in utrecht" (lowercase) should NOT be removed
        expect(cleanCategoryName('Restaurants in utrecht')).toBe(
            'Restaurants in utrecht'
        );
    });
});

// ─── cleanSubcategorySlug ─────────────────────────────────────────────────────
describe('cleanSubcategorySlug', () => {
    it('extracts the last segment from a nested slug', () => {
        expect(
            cleanSubcategorySlug('/utrecht/beauty/kapper-dames', 'beauty')
        ).toBe('kapper-dames');
    });

    it('works with nested sub-slug and category slug prefix', () => {
        expect(
            cleanSubcategorySlug('eten-drinken/italiaans', 'eten-drinken')
        ).toBe('italiaans');
    });

    it('returns the slug as-is when there is no nesting', () => {
        expect(cleanSubcategorySlug('restaurant', 'eten-drinken')).toBe(
            'restaurant'
        );
    });

    it('strips utrecht prefix from sub-slug', () => {
        expect(
            cleanSubcategorySlug('/utrecht/eten-drinken/sushi', 'eten-drinken')
        ).toBe('sushi');
    });
});
