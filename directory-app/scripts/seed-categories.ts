import { PrismaClient } from "@prisma/client";
import { getCategories } from "../src/lib/categories-static";
import { getSubcategoryImage } from "../src/lib/subcategory-images";

const prisma = new PrismaClient();

// Basic slugifier to generate URL-safe path segments
const slugify = (value: string) =>
    value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " en ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

async function seedCategories() {
    const categories = getCategories();
    let categoryCount = 0;
    let subcategoryCount = 0;

    for (const cat of categories) {
        const slug = cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}`;
        const category = await prisma.category.upsert({
            where: { slug },
            update: {
                name: cat.name,
                description: cat.description || null,
                image: cat.thumbnail || null,
                seoTitle: cat.name,
                seoDescription: cat.description || null,
            },
            create: {
                name: cat.name,
                slug,
                description: cat.description || null,
                image: cat.thumbnail || null,
                seoTitle: cat.name,
                seoDescription: cat.description || null,
            },
        });
        categoryCount += 1;

        for (const subName of cat.subcategories) {
            const subSlug = `${slug.replace(/\/$/, "")}/${slugify(subName)}`;
            await prisma.subCategory.upsert({
                where: { slug: subSlug },
                update: {
                    name: subName,
                    description: null,
                    image: getSubcategoryImage(slug, subName),
                    categoryId: category.id,
                },
                create: {
                    name: subName,
                    slug: subSlug,
                    description: null,
                    image: getSubcategoryImage(slug, subName),
                    categoryId: category.id,
                },
            });
            subcategoryCount += 1;
        }
    }

    console.log(`Seeded ${categoryCount} categories and ${subcategoryCount} subcategories.`);
}

seedCategories()
    .catch((err) => {
        console.error("Seeding failed:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
