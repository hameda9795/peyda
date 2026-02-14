export type OpeningHoursExp = {
    day: string; // e.g., 'Maandag'
    open: string; // e.g., '09:00'
    close: string; // e.g., '18:00'
    closed: boolean;
};

export type Review = {
    id: string;
    author: string;
    rating: number;
    date: string;
    content: string;
    ownerResponse?: string;
};

export type FAQItem = {
    question: string;
    answer: string;
};

export type BusinessCategory = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    seoDescription?: string;
    icon?: string;
    image?: string;
    subcategories: {
        id: string;
        name: string;
        slug: string;
        image?: string;
    }[];
    keywords?: string[];
};

export type Business = {
    id: string;
    name: string;
    slug: string;
    category: string;
    subcategories: string[];
    tags: string[];
    shortDescription: string;
    longDescription: string;
    highlights: string[];

    services: { name: string; description?: string; price?: string }[];
    products?: { name: string; price: string; image?: string }[];

    images: {
        logo: string;
        cover: string;
        gallery: string[];
    };
    videoUrl?: string;

    address: {
        street: string;
        city: string;
        postalCode: string;
        neighborhood: string;
        province?: string;
        coordinates: { lat: number; lng: number };
    };

    contact: {
        phone: string;
        email: string;
        website: string;
        socials: {
            instagram?: string;
            facebook?: string;
            linkedin?: string;
            twitter?: string;
        };
    };

    openingHours: OpeningHoursExp[];
    paymentMethods: string[];
    languages: string[];
    amenities: string[]; // Wi-Fi, Parking, etc.
    serviceArea: string;
    bookingUrl?: string;

    cta: {
        text: string;
        link: string;
        type: 'call' | 'booking' | 'quote';
    };

    reviews: {
        average: number;
        count: number;
        items: Review[];
    };

    faq: FAQItem[];
    portfolio?: { title: string; image: string }[];
    team?: { name: string; role: string; image: string }[];

    certifications: string[];
    kvk?: string;
    foundedYear?: number;

    details: {
        policies: string; // Cancellation, Privacy
        lastUpdate: string;
        status: 'published' | 'draft';
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analytics?: any[];

    seo: {
        title: string;
        metaDescription: string;
        h1: string;
        keywords: string[];
        canonicalUrl: string;
        localSeoText: string; // "Top rated [category] in [neighborhood]"
        structuredData?: Record<string, any>;
    };
};
