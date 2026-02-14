import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Get business owners with their businesses
        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { business: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const [owners, total] = await Promise.all([
            db.businessOwner.findMany({
                where,
                include: {
                    business: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            city: true,
                            status: true,
                            isActive: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.businessOwner.count({ where }),
        ]);

        return NextResponse.json({
            users: owners,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
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

        const owner = await db.businessOwner.findUnique({
            where: { id },
            include: { business: true },
        });

        if (!owner) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        switch (action) {
            case 'activate':
                await db.business.update({
                    where: { id: owner.businessId },
                    data: { isActive: true },
                });
                break;
            case 'deactivate':
                await db.business.update({
                    where: { id: owner.businessId },
                    data: { isActive: false },
                });
                break;
            case 'delete':
                await db.businessOwner.delete({
                    where: { id },
                });
                break;
            case 'update':
                await db.businessOwner.update({
                    where: { id },
                    data: { name: data.name },
                });
                break;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
