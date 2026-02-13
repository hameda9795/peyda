import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract files
        const logo = formData.get('logo') as File | null;
        const coverImage = formData.get('coverImage') as File | null;
        const galleryFiles: File[] = [];

        // Get all gallery files
        formData.forEach((value, key) => {
            if (key.startsWith('gallery_') && value instanceof File) {
                galleryFiles.push(value);
            }
        });

        // Get JSON data
        const dataJson = formData.get('data') as string;
        const data = JSON.parse(dataJson);

        // Upload images to Supabase Storage
        const uploadedImages = {
            logo: null as string | null,
            coverImage: null as string | null,
            gallery: [] as string[],
        };

        // Upload logo
        if (logo && logo.size > 0) {
            const logoPath = `business-images/${Date.now()}-logo-${logo.name}`;
            const { data: logoData, error: logoError } = await supabase.storage
                .from('uploads')
                .upload(logoPath, logo);

            if (!logoError && logoData) {
                const { data: { publicUrl } } = supabase.storage
                    .from('uploads')
                    .getPublicUrl(logoPath);
                uploadedImages.logo = publicUrl;
            }
        }

        // Upload cover image
        if (coverImage && coverImage.size > 0) {
            const coverPath = `business-images/${Date.now()}-cover-${coverImage.name}`;
            const { data: coverData, error: coverError } = await supabase.storage
                .from('uploads')
                .upload(coverPath, coverImage);

            if (!coverError && coverData) {
                const { data: { publicUrl } } = supabase.storage
                    .from('uploads')
                    .getPublicUrl(coverPath);
                uploadedImages.coverImage = publicUrl;
            }
        }

        // Upload gallery images
        for (const galleryFile of galleryFiles) {
            if (galleryFile.size > 0) {
                const galleryPath = `business-images/${Date.now()}-gallery-${galleryFile.name}`;
                const { data: galleryData, error: galleryError } = await supabase.storage
                    .from('uploads')
                    .upload(galleryPath, galleryFile);

                if (!galleryError && galleryData) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('uploads')
                        .getPublicUrl(galleryPath);
                    uploadedImages.gallery.push(publicUrl);
                }
            }
        }

        // Save submission to database
        const submission = await db.businessSubmission.create({
            data: {
                email: data.email,
                formData: {
                    ...data,
                    images: uploadedImages,
                },
                status: 'pending',
            },
        });

        return NextResponse.json({
            success: true,
            submissionId: submission.id,
            message: 'Bedrijfsgegevens ontvangen. AI verwerking wordt gestart.',
        });
    } catch (error) {
        console.error('Error submitting business:', error);
        return NextResponse.json(
            { error: 'Er is een fout opgetreden bij het verzenden.' },
            { status: 500 }
        );
    }
}
