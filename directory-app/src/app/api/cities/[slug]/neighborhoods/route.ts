import { NextResponse } from "next/server";
import { getNeighborhoodsByCitySlug } from "@/lib/actions/locations";

type RouteParams = {
    params: Promise<{ slug: string }>;
};

export async function GET(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { slug  } = await params;
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") || undefined;
        const limitParam = Number(searchParams.get("limit") || "300");
        const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 1000) : 300;

        const result = await getNeighborhoodsByCitySlug(slug, { q, limit });

        if (!result.city) {
            return NextResponse.json({ error: "City not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to fetch neighborhoods:", error);
        return NextResponse.json(
            { error: "Failed to fetch neighborhoods" },
            { status: 500 }
        );
    }
}
