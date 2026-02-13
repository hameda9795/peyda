export type OpeningHour = {
    day: string;
    open: string;
    close: string;
    closed: boolean;
};

export type Service = {
    name: string;
    description?: string;
    price?: string;
};

export type BusinessFormData = {
    // Basic Info
    name: string;
    category: string;
    categorySlug?: string;
    categoryName?: string;
    subcategories: string[];
    shortDescription: string;

    // Address
    street: string;
    postalCode: string;
    city: string;
    neighborhood: string;

    // Contact
    phone: string;
    email: string;
    website: string;
    instagram: string;
    facebook: string;
    linkedin: string;

    // Opening Hours
    openingHours: OpeningHour[];

    // Services & Amenities
    services: Service[];
    amenities: string[];
    paymentMethods: string[];
    languages: string[];

    // Images
    logo: File | null;
    coverImage: File | null;
    gallery: File[];
    videoUrl: string;

    // Additional
    kvkNumber: string;
    foundedYear: string;
    certifications: string[];
    bookingUrl: string;
    ctaType: 'call' | 'booking' | 'quote';
    serviceArea: string;
    faq: { question: string; answer: string }[];
};

export type StepProps = {
    formData: BusinessFormData;
    updateFormData: (data: Partial<BusinessFormData>) => void;
};

// Predefined options
export const AMENITIES_OPTIONS = [
    'Wi-Fi',
    'Parkeren',
    'Rolstoeltoegankelijk',
    'Toilet',
    'Airconditioning',
    'Terras',
    'Kinderen welkom',
    'Huisdieren welkom',
    'Reserveren mogelijk',
    'Afhalen mogelijk',
    'Bezorging',
];

export const PAYMENT_METHODS = [
    'Contant',
    'PIN',
    'Creditcard',
    'Apple Pay',
    'Google Pay',
    'iDEAL',
    'Tikkie',
    'Op rekening',
];

export const LANGUAGES = [
    'Nederlands',
    'Engels',
    'Duits',
    'Frans',
    'Spaans',
    'Turks',
    'Arabisch',
    'Pools',
];

export const UTRECHT_NEIGHBORHOODS = [
    'Binnenstad',
    'Oost',
    'West',
    'Zuid',
    'Noord',
    'Overvecht',
    'Vleuten-De Meern',
    'Leidsche Rijn',
    'Wittevrouwen',
    'Lombok',
    'Oudwijk',
    'Tuindorp',
    'Zuilen',
    'Lunetten',
    'Hoograven',
    'Tolsteeg',
    'Kanaleneiland',
    'Transwijk',
];
