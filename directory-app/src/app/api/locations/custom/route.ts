import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify } from '@/lib/slugify';

// POST /api/locations/custom - Submit a custom city/neighborhood
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, name, province, cityId, cityName } = body;

        if (!type || !name || !name.trim()) {
            return NextResponse.json(
                { error: 'Type and name are required' },
                { status: 400 }
            );
        }

        const trimmedName = name.trim();
        const slug = slugify(trimmedName);

        // Check if this is a duplicate (case-insensitive)
        if (type === 'city') {
            // Check existing cities
            const existingCity = await db.city.findFirst({
                where: {
                    OR: [
                        { slug },
                        { name: { equals: trimmedName, mode: 'insensitive' } }
                    ]
                }
            });

            if (existingCity) {
                return NextResponse.json({
                    exists: true,
                    city: existingCity,
                    message: 'City already exists'
                });
            }

            // Create new city
            const city = await db.city.create({
                data: {
                    name: trimmedName,
                    slug,
                    province: province || null,
                    contentStatus: 'pending'
                }
            });

            return NextResponse.json({
                success: true,
                city,
                message: 'City added successfully'
            });
        }

        if (type === 'neighborhood') {
            if (!cityId && !cityName) {
                return NextResponse.json(
                    { error: 'City ID or city name is required for neighborhood' },
                    { status: 400 }
                );
            }

            let targetCityId = cityId;

            // If cityName provided instead of cityId, find or create the city
            if (!targetCityId && cityName) {
                const citySlug = slugify(cityName);
                const existingCity = await db.city.findFirst({
                    where: {
                        OR: [
                            { slug: citySlug },
                            { name: { equals: cityName.trim(), mode: 'insensitive' } }
                        ]
                    }
                });

                if (existingCity) {
                    targetCityId = existingCity.id;
                } else {
                    // Create the city first
                    const newCity = await db.city.create({
                        data: {
                            name: cityName.trim(),
                            slug: citySlug,
                            province: province || null,
                            contentStatus: 'pending'
                        }
                    });
                    targetCityId = newCity.id;
                }
            }

            // Check for duplicate neighborhood in this city
            const existingNeighborhood = await db.neighborhood.findFirst({
                where: {
                    cityId: targetCityId,
                    OR: [
                        { slug },
                        { name: { equals: trimmedName, mode: 'insensitive' } }
                    ]
                }
            });

            if (existingNeighborhood) {
                return NextResponse.json({
                    exists: true,
                    neighborhood: existingNeighborhood,
                    message: 'Neighborhood already exists in this city'
                });
            }

            // Create new neighborhood
            const neighborhood = await db.neighborhood.create({
                data: {
                    name: trimmedName,
                    slug,
                    cityId: targetCityId
                }
            });

            return NextResponse.json({
                success: true,
                neighborhood,
                message: 'Neighborhood added successfully'
            });
        }

        return NextResponse.json(
            { error: 'Invalid type. Must be "city" or "neighborhood"' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Error saving custom location:', error);
        return NextResponse.json(
            { error: 'Failed to save custom location' },
            { status: 500 }
        );
    }
}

// GET /api/locations/custom - Get pending custom locations (admin only)
export async function GET(request: NextRequest) {
    try {
        // Get cities that were recently added (pending status or null contentStatus)
        const recentCities = await db.city.findMany({
            where: {
                OR: [
                    { contentStatus: 'pending' },
                    { contentStatus: null }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
            include: {
                _count: {
                    select: { neighborhoods: true }
                }
            }
        });

        return NextResponse.json({
            cities: recentCities
        });

    } catch (error) {
        console.error('Error fetching custom locations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch custom locations' },
            { status: 500 }
        );
    }
}
