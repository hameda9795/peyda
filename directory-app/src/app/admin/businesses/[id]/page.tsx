import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { BusinessDetails } from './BusinessDetails';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function BusinessDetailPage({ params }: Props) {
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
        notFound();
    }

    return <BusinessDetails business={business} />;
}
