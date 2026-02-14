import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const business = await db.business.findUnique({
            where: { id },
            include: {
                subCategory: {
                    include: {
                        category: true,
                    },
                },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                },
                analytics: true,
            },
        });

        if (!business) {
            return NextResponse.json(
                { error: 'Business not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ business });
    } catch (error) {
        console.error('Error fetching business:', error);
        return NextResponse.json(
            { error: 'Failed to fetch business' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action, data } = body;

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
            case 'verify':
                updateData = { isVerified: true };
                break;
            case 'unverify':
                updateData = { isVerified: false };
                break;
            case 'update':
                updateData = { ...data, updatedAt: new Date() };
                break;
            default:
                if (data) {
                    updateData = { ...data, updatedAt: new Date() };
                }
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await db.business.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting business:', error);
        return NextResponse.json(
            { error: 'Failed to delete business' },
            { status: 500 }
        );
    }
}
