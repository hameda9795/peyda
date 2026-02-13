"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { subcategories: true },
                },
                subcategories: {
                    take: 100,
                    orderBy: {
                        name: 'asc'
                    }
                }
            },
            orderBy: {
                name: "asc",
            },
        });

        const { getSubcategoryImage } = require("@/lib/subcategory-images");

        return categories.map(cat => ({
            ...cat,
            subcategories: cat.subcategories.map(sub => ({
                ...sub,
                image: sub.image || getSubcategoryImage(cat.slug, sub.name)
            }))
        }));
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw new Error("Failed to fetch categories");
    }
}

export async function getCategory(id: string) {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                subcategories: true,
            },
        });
        return category;
    } catch (error) {
        console.error("Failed to fetch category:", error);
        throw new Error("Failed to fetch category");
    }
}

export async function createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    image?: string;
    seoTitle?: string;
    seoDescription?: string;
}) {
    try {
        await prisma.category.create({
            data: {
                ...data,
                description: data.description || undefined,
                icon: data.icon || undefined,
                image: data.image || undefined,
                seoTitle: data.seoTitle || undefined,
                seoDescription: data.seoDescription || undefined,
            },
        });
        revalidatePath("/admin/categories");
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("Failed to create category:", error);
        // @ts-ignore
        if (error.code === "P2002") {
            throw new Error("A category with this slug already exists.");
        }
        throw new Error("Failed to create category");
    }
    redirect("/admin/categories");
}

export async function updateCategory(
    id: string,
    data: {
        name: string;
        slug: string;
        description?: string;
        icon?: string;
        image?: string;
        seoTitle?: string;
        seoDescription?: string;
    }
) {
    try {
        await prisma.category.update({
            where: { id },
            data: {
                ...data,
                description: data.description || undefined,
                icon: data.icon || undefined,
                image: data.image || undefined,
                seoTitle: data.seoTitle || undefined,
                seoDescription: data.seoDescription || undefined,
            },
        });
        revalidatePath("/admin/categories");
        revalidatePath(`/admin/categories/${id}`);
        revalidatePath("/", "layout");
        if (data.slug) {
            revalidatePath(`/utrecht/${data.slug}`);
        }
    } catch (error) {
        console.error("Failed to update category:", error);
        throw new Error("Failed to update category");
    }
    redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath("/admin/categories");
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("Failed to delete category:", error);
        throw new Error("Failed to delete category");
    }
}

export async function getSubcategory(id: string) {
    try {
        const subcategory = await prisma.subCategory.findUnique({
            where: { id },
        });
        return subcategory;
    } catch (error) {
        console.error("Failed to fetch subcategory:", error);
        throw new Error("Failed to fetch subcategory");
    }
}

export async function createSubcategory(
    categoryId: string,
    data: {
        name: string;
        slug: string;
        description?: string;
        image?: string;
        seoTitle?: string;
        seoDescription?: string;
    }
) {
    try {
        await prisma.subCategory.create({
            data: {
                ...data,
                description: data.description || undefined,
                image: data.image || undefined,
                seoTitle: data.seoTitle || undefined,
                seoDescription: data.seoDescription || undefined,
                categoryId,
            },
        });
        revalidatePath(`/admin/categories/${categoryId}`);
        revalidatePath("/admin/categories");
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("Failed to create subcategory:", error);
        throw new Error("Failed to create subcategory");
    }
}

export async function deleteSubcategory(id: string) {
    try {
        // Find the subcategory first to get the categoryId for revalidation
        const subcategory = await prisma.subCategory.findUnique({
            where: { id },
        });

        if (subcategory) {
            await prisma.subCategory.delete({
                where: { id },
            });
            revalidatePath(`/admin/categories/${subcategory.categoryId}`);
            revalidatePath("/admin/categories");
            revalidatePath("/", "layout");
        }
    } catch (error) {
        throw new Error("Failed to delete subcategory");
    }
}

export async function getCategoryBySlug(slug: string) {
    try {
        // Normalize slug - remove any prefix
        const cleanSlug = slug
            .replace(/^\/+/, '')
            .replace(/^utrecht\//, '')
            .replace(/^nederland\//, '');

        // Try different slug formats
        const slugVariants = [
            `/utrecht/${cleanSlug}`,
            `/nederland/${cleanSlug}`,
            cleanSlug
        ];

        let category = null;
        for (const variant of slugVariants) {
            category = await prisma.category.findUnique({
                where: { slug: variant },
                include: {
                    subcategories: {
                        orderBy: { name: 'asc' }
                    },
                },
            });
            if (category) break;
        }

        // If still not found, try case-insensitive search
        if (!category) {
            category = await prisma.category.findFirst({
                where: {
                    slug: {
                        contains: cleanSlug,
                        mode: 'insensitive'
                    }
                },
                include: {
                    subcategories: {
                        orderBy: { name: 'asc' }
                    },
                },
            });
        }

        if (!category) return null;

        const { getSubcategoryImage } = require("@/lib/subcategory-images");
        return {
            ...category,
            subcategories: category.subcategories.map(sub => ({
                ...sub,
                image: sub.image || getSubcategoryImage(category.slug, sub.name)
            }))
        };
    } catch (error) {
        console.error("Failed to fetch category by slug:", error);
        return null;
    }
}

export async function updateSubcategory(
    id: string,
    data: {
        name: string;
        slug: string;
        description?: string;
        image?: string;
        seoTitle?: string;
        seoDescription?: string;
    }
) {
    try {
        const subcategory = await prisma.subCategory.update({
            where: { id },
            data: {
                ...data,
                description: data.description || undefined,
                image: data.image || undefined,
                seoTitle: data.seoTitle || undefined,
                seoDescription: data.seoDescription || undefined,
            },
        });
        revalidatePath(`/admin/categories/${subcategory.categoryId}`);
        revalidatePath("/admin/categories");
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("Failed to update subcategory:", error);
        throw new Error("Failed to update subcategory");
    }
}

export async function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) {
    try {
        // Normalize slugs
        const cleanCategorySlug = categorySlug
            .replace(/^\/+/, '')
            .replace(/^utrecht\//, '')
            .replace(/^nederland\//, '');

        const cleanSubSlug = subcategorySlug
            .replace(/^\/+/, '')
            .replace(/^utrecht\//, '')
            .replace(/^nederland\//, '');

        // Try multiple category slug formats
        const categoryVariants = [
            `/utrecht/${cleanCategorySlug}`,
            `/nederland/${cleanCategorySlug}`,
            cleanCategorySlug
        ];

        // Try multiple subcategory slug formats (with both slash and dash variants)
        const dashToSlash = cleanSubSlug.replace(/-/g, '/');
        const subSlugVariants = [
            cleanSubSlug,
            dashToSlash,
            `${cleanCategorySlug}/${cleanSubSlug}`,
            `${cleanCategorySlug}/${dashToSlash}`,
            `/utrecht/${cleanCategorySlug}/${cleanSubSlug}`,
            `/nederland/${cleanCategorySlug}/${cleanSubSlug}`,
            // Also try with "beauty" prefix since some slugs are stored as /utrecht/beauty/kapper-dames
            `beauty/${cleanSubSlug}`,
            `/utrecht/beauty/${cleanSubSlug}`,
            `/nederland/beauty/${cleanSubSlug}`
        ];

        let subcategory = null;

        // First try with all variants
        for (const catVariant of categoryVariants) {
            for (const subVariant of subSlugVariants) {
                subcategory = await prisma.subCategory.findFirst({
                    where: {
                        OR: [
                            { slug: subVariant },
                            { slug: { endsWith: `/${cleanSubSlug}` } }
                        ],
                        category: {
                            slug: catVariant
                        }
                    },
                    include: {
                        category: true,
                    }
                });
                if (subcategory) break;
            }
            if (subcategory) break;
        }

        // If still not found, try looser match - search by slug ending with the subcategory slug
        if (!subcategory) {
            subcategory = await prisma.subCategory.findFirst({
                where: {
                    OR: [
                        { slug: { endsWith: `/${cleanSubSlug}`, mode: 'insensitive' } },
                        { slug: { endsWith: `/${dashToSlash}`, mode: 'insensitive' } },
                        { slug: { contains: cleanSubSlug, mode: 'insensitive' } },
                        { slug: { contains: dashToSlash, mode: 'insensitive' } }
                    ],
                    category: {
                        slug: {
                            contains: cleanCategorySlug,
                            mode: 'insensitive'
                        }
                    }
                },
                include: {
                    category: true,
                }
            });
        }

        if (!subcategory) return null;

        const { getSubcategoryImage } = require("@/lib/subcategory-images");
        return {
            ...subcategory,
            image: subcategory.image || getSubcategoryImage(subcategory.category.slug, subcategory.name)
        };
    } catch (error) {
        console.error("Failed to fetch subcategory by slug:", error);
        return null;
    }
}
