"use server";

import { db as prisma } from "@/lib/db";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const normalize = (value?: string | null) => value?.trim() || undefined;

export async function getCities(options?: { limit?: number; q?: string }) {
    const limit = clamp(options?.limit ?? 200, 1, 500);
    const q = normalize(options?.q);

    try {
        const cities = await prisma.city.findMany({
            where: q
                ? {
                    name: {
                        contains: q,
                        mode: "insensitive",
                    },
                }
                : undefined,
            orderBy: { name: "asc" },
            take: limit,
            include: {
                _count: {
                    select: { neighborhoods: true },
                },
            },
        });

        return cities;
    } catch (error) {
        console.error("Failed to fetch cities:", error);
        throw new Error("Failed to fetch cities");
    }
}

export async function getCityBySlug(slug: string) {
    const normalized = normalize(slug)?.toLowerCase();
    if (!normalized) return null;

    try {
        return await prisma.city.findUnique({
            where: { slug: normalized },
            include: {
                _count: {
                    select: { neighborhoods: true },
                },
            },
        });
    } catch (error) {
        console.error("Failed to fetch city by slug:", error);
        return null;
    }
}

export async function getNeighborhoodsByCitySlug(
    slug: string,
    options?: { limit?: number; q?: string }
) {
    const normalized = normalize(slug)?.toLowerCase();
    if (!normalized) return { city: null, neighborhoods: [] as { id: string; name: string; slug: string }[] };

    const limit = clamp(options?.limit ?? 300, 1, 1000);
    const q = normalize(options?.q);

    try {
        const city = await prisma.city.findUnique({
            where: { slug: normalized },
            select: { id: true, name: true, slug: true },
        });

        if (!city) {
            return { city: null, neighborhoods: [] as { id: string; name: string; slug: string }[] };
        }

        const neighborhoods = await prisma.neighborhood.findMany({
            where: {
                cityId: city.id,
                ...(q
                    ? {
                        name: {
                            contains: q,
                            mode: "insensitive",
                        },
                    }
                    : {}),
            },
            orderBy: { name: "asc" },
            take: limit,
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        return { city, neighborhoods };
    } catch (error) {
        console.error("Failed to fetch neighborhoods:", error);
        throw new Error("Failed to fetch neighborhoods");
    }
}
