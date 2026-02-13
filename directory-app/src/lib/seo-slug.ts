const stripLeading = (value: string) => value.replace(/^\/+/, "");

export const stripSeoSlug = (value?: string | null) => {
    if (!value) return "";
    return stripLeading(value)
        .replace(/^utrecht\//, "")
        .replace(/^nederland\//, "");
};

export const cleanCategoryName = (name: string) =>
    name.replace(" in Utrecht", "").replace(" in Nederland", "");

export const cleanSubcategorySlug = (subcategorySlug: string, categorySlug: string) => {
    const cleanSub = stripSeoSlug(subcategorySlug);
    const cleanCategory = stripSeoSlug(categorySlug);

    // Extract just the last segment of the slug
    // e.g., "beauty/kapper-dames" -> "kapper-dames"
    const parts = cleanSub.split('/').filter(Boolean);
    if (parts.length > 0) {
        return parts[parts.length - 1];
    }

    // Fallback: try removing category prefix and converting slashes to dashes
    let result = cleanSub;
    if (cleanCategory && result.startsWith(`${cleanCategory}/`)) {
        result = result.slice(cleanCategory.length + 1);
    }
    return result.replace(/\//g, '-');
};
