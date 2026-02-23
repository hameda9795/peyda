import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Peyda Bedrijvengids',
        short_name: 'Peyda',
        description: 'De modernste bedrijvengids van Nederland. Vind direct de beste vakmensen in uw regio.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        icons: [
            {
                src: '/favicon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/favicon.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
            },
            {
                src: '/favicon.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
            },
        ],
    };
}
