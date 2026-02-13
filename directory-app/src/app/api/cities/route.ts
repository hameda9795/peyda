import { NextResponse } from "next/server";
import { getCities } from "@/lib/actions/locations";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") || undefined;
        const limitParam = Number(searchParams.get("limit") || "200");
        const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 500) : 200;

        const cities = await getCities({ q, limit });
        return NextResponse.json(cities);
    } catch (error) {
        console.error("Failed to fetch cities:", error);
        return NextResponse.json(
            { error: "Failed to fetch cities" },
            { status: 500 }
        );
    }
}
