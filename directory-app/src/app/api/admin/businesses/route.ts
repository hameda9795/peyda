import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Filter parameters
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        const province = searchParams.get('province') || '';
        const categoryId = searchParams.get('categoryId') || '';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        if (province && province !== 'all') {
            where.provinceSlug = province;
        }

        if (categoryId && categoryId !== 'all') {
            where.subCategory = {
                categoryId: categoryId
            };
        }

        // Build orderBy
        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        // Fetch businesses with relations
        const [businesses, total] = await Promise.all([
            db.business.findMany({
                where,
                include: {
                    subCategory: {
                        include: {
                            category: true,
                        },
                    },
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.business.count({ where }),
        ]);

        // Get unique provinces for filter
        const provinces = await db.business.findMany({
            where: { province: { not: null } },
            select: { province: true, provinceSlug: true },
            distinct: ['province'],
        });

        // Get categories for filter
        const categories = await db.category.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({
            businesses,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            filters: {
                provinces: provinces.map(p => ({
                    name: p.province,
                    slug: p.provinceSlug,
                })).filter(p => p.name && p.slug),
                categories,
            },
        });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch businesses' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, action, data } = body;

        if (!id || !action) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        let updateData: any = {};

        switch (action) {
            case 'approve':
                updateData = { status: 'approved', isActive: true };
                break;
            case 'reject':
                updateData = { status: 'rejected', isActive: false };
                break;
            case 'publish':
                updateData = { status: 'approved', isActive: true };
                break;
            case 'unpublish':
                updateData = { status: 'draft', isActive: false };
                break;
            case 'update':
                updateData = { ...data, updatedAt: new Date() };
                break;
            case 'delete':
                // Handle delete separately
                await db.business.delete({ where: { id } });
                return NextResponse.json({ success: true });
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        const business = await db.business.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, business });
    } catch (error) {
        console.error('Error updating business:', error);
        return NextResponse.json(
            { error: 'Failed to update business' },
            { status: 500 }
        );
    }
}
