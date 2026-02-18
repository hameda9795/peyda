import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Peyda Bedrijvengids',
        short_name: 'Peyda',
        description: 'De modernste bedrijvengids van Nederland. Vind direct de beste vakmensen in uw regio.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/logo.png', // Assuming logo is large enough, otherwise replace with specific icon
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
