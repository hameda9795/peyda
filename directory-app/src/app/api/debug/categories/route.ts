import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                subcategories: true,
                _count: {
                    select: { subcategories: true },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        // Check for duplicates by name
        const nameCount: Record<string, number> = {};
        const slugCount: Record<string, number> = {};
        
        categories.forEach((cat: any) => {
            nameCount[cat.name] = (nameCount[cat.name] || 0) + 1;
            slugCount[cat.slug] = (slugCount[cat.slug] || 0) + 1;
        });

        const duplicateNames = Object.entries(nameCount).filter(([_, count]) => count > 1);
        const duplicateSlugs = Object.entries(slugCount).filter(([_, count]) => count > 1);

        return NextResponse.json({
            totalCategories: categories.length,
            duplicateNames,
            duplicateSlugs,
            categories: categories.map((c: any) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                subcategoryCount: c._count.subcategories,
                subcategories: c.subcategories.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    slug: s.slug,
                })),
            })),
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
