import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id  } = await params;

        const submission = await db.businessSubmission.findUnique({
            where: { id },
        });

        if (!submission) {
            return NextResponse.json(
                { error: 'Submission not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(submission);
    } catch (error) {
        console.error('Error fetching submission:', error);
        return NextResponse.json(
            { error: 'Failed to fetch submission' },
            { status: 500 }
        );
    }
}
