"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createReview(businessId: string, data: {
    name: string;
    email: string;
    rating: number;
    content: string;
}) {
    try {
        if (!businessId) throw new Error("Business ID is required");
        if (!data.name || !data.email || !data.rating || !data.content) {
            throw new Error("All fields are required");
        }

        // Check if the Prisma Client has the review model generated
        if ((prisma as any).review) {
            const review = await (prisma as any).review.create({
                data: {
                    author: data.name,
                    email: data.email,
                    rating: data.rating,
                    content: data.content,
                    businessId: businessId,
                    isPublished: true // Auto-publish for now
                }
            });

            // Update business average rating with Prisma
            const allReviews = await (prisma as any).review.findMany({
                where: { businessId, isPublished: true },
                select: { rating: true }
            });

            const avgRating = allReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / allReviews.length;

            await prisma.business.update({
                where: { id: businessId },
                data: {
                    rating: avgRating,
                    reviewCount: allReviews.length
                }
            });

            revalidatePath(`/utrecht/bedrijf/${businessId}`);
            revalidatePath('/dashboard');
            return { success: true, review };
        } else {
            // Fallback: Use Raw SQL if client is outdated
            const id = crypto.randomUUID();
            const now = new Date().toISOString();

            // Insert Review
            // Note: Postgres raw queries
            await prisma.$executeRaw`
                INSERT INTO "reviews" ("id", "author", "email", "rating", "content", "businessId", "isPublished", "createdAt", "updatedAt")
                VALUES (${id}, ${data.name}, ${data.email}, ${data.rating}, ${data.content}, ${businessId}, true, ${now}::timestamp, ${now}::timestamp)
            `;

            // Calculate new stats
            const stats = await prisma.$queryRaw`
                SELECT AVG(rating) as average, COUNT(*) as count 
                FROM "reviews" 
                WHERE "businessId" = ${businessId} AND "isPublished" = true
            `;

            const newRating = stats ? (stats as any)[0].average : data.rating;
            const newCount = stats ? (stats as any)[0].count : 1;
            // Ensure newRating is a number
            const safeRating = typeof newRating === 'number' ? newRating : parseFloat(newRating || '0');
            const safeCount = typeof newCount === 'number' ? newCount : parseInt(newCount || '0');

            // Update business using raw SQL because prisma.business.update might fail if it relies on new types
            await prisma.$executeRaw`
                UPDATE "businesses"
                SET "rating" = ${safeRating}, "reviewCount" = ${Number(safeCount)}
                WHERE "id" = ${businessId}
            `;

            revalidatePath('/dashboard');
            return { success: true, review: { id, ...data, createdAt: new Date() } };
        }

    } catch (error: any) {
        console.error("Error creating review:", error);
        return { success: false, error: error.message };
    }
}
