import { Business } from './types';

export const mockBusiness: Business = {
    id: '1',
    name: 'De Koffie Kamer Utrecht',
    slug: 'de-koffie-kamer-utrecht',
    category: 'Horeca',
    subcategories: ['Koffiebar', 'Lunchroom', 'Bakkerij'],
    tags: ['Specialty Coffee', 'Vegan Opties', 'Terras', 'Werkplek'],
    shortDescription: 'De gezelligste koffiebar in hartje Utrecht met ambachtelijke gebakjes en specialty coffee.',
    longDescription: `
    <p>Welkom bij De Koffie Kamer Utrecht, dé plek waar passie voor koffie en gezelligheid samenkomen. Gelegen in de levendige wijk Wittevrouwen, bieden wij een oase van rust en kwaliteit.</p>
    <p>Onze barista's werken uitsluitend met fair-trade bonen van lokale branderijen. Naast onze geprezen espresso's en filterkoffies, kunt u genieten van huisgemaakte taarten, verse croissants en een uitgebreide lunchkaart met diverse veganistische en glutenvrije opties.</p>
    <p>Of u nu komt om rustig te werken met onze snelle Wi-Fi, of om bij te kletsen met vrienden op ons zonnige terras, bij De Koffie Kamer voelt u zich direct thuis.</p>
  `,
    highlights: [
        'Beste Koffie van Utrecht 2025 publieksprijs',
        'Gratis snelle Wi-Fi & laptopvriendelijk',
        'Zonnig terras aan de gracht',
        '100% biologische & fair-trade bonen'
    ],
    services: [
        { name: 'Koffie op locatie', description: 'Professionele barista service voor evenementen.', price: 'Op aanvraag' },
        { name: 'Workshops', description: 'Leer de kunst van latte art en filterkoffie.', price: '€45 p.p.' },
        { name: 'High Tea', description: 'Onbeperkt thee en etagères vol lekkernijen.', price: '€27,50 p.p.' }
    ],
    products: [
        { name: 'Huisblend Koffiebonen 500g', price: '€14,50' },
        { name: 'Koffie Kamer Mok', price: '€12,00' }
    ],
    images: {
        logo: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=200&auto=format&fit=crop',
        cover: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1920&auto=format&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
        ]
    },
    address: {
        street: 'Biltstraat 123',
        city: 'Utrecht',
        postalCode: '3572 AA',
        neighborhood: 'Wittevrouwen',
        coordinates: { lat: 52.0945, lng: 5.1320 }
    },
    contact: {
        phone: '+31 30 123 4567',
        email: 'hallo@koffiekamer-utrecht.nl',
        website: 'https://www.example.com',
        socials: {
            instagram: 'https://instagram.com',
            facebook: 'https://facebook.com'
        }
    },
    openingHours: [
        { day: 'Maandag', open: '08:00', close: '18:00', closed: false },
        { day: 'Dinsdag', open: '08:00', close: '18:00', closed: false },
        { day: 'Woensdag', open: '08:00', close: '18:00', closed: false },
        { day: 'Donderdag', open: '08:00', close: '21:00', closed: false },
        { day: 'Vrijdag', open: '08:00', close: '21:00', closed: false },
        { day: 'Zaterdag', open: '09:00', close: '18:00', closed: false },
        { day: 'Zondag', open: '10:00', close: '17:00', closed: false }
    ],
    paymentMethods: ['Pin', 'Creditcard', 'Contant', 'Apple Pay'],
    languages: ['Nederlands', 'Engels'],
    amenities: ['Wi-Fi', 'Toilet', 'Rolstoeltoegankelijk', 'Diervriendelijk', 'Airconditioning'],
    serviceArea: 'Utrecht Stad, Wittevrouwen, Biltstraat',
    bookingUrl: 'https://example.com/reserveren',
    cta: {
        text: 'Tafel Reserveren',
        link: '#reserveren',
        type: 'booking'
    },
    reviews: {
        average: 4.8,
        count: 342,
        items: [
            {
                id: 'r1',
                author: 'Sophie de Vries',
                rating: 5,
                date: '2 dagen geleden',
                content: 'Geweldige sfeer en de beste havermelk cappuccino van Utrecht! Het personeel is altijd vriendelijk, zelfs als het druk is.',
                ownerResponse: 'Bedankt Sophie! Wat fijn om te horen dat je van onze koffie geniet. Tot snel!'
            },
            {
                id: 'r2',
                author: 'Jan Jansen',
                rating: 4,
                date: '1 week geleden',
                content: 'Lekkere taart en goede koffie. In het weekend wel erg druk, dus reserveren is handig.'
            }
        ]
    },
    faq: [
        {
            question: 'Kan ik met mijn laptop werken?',
            answer: 'Ja zeker! Doordeweeks zijn laptops van harte welkom. In de weekenden vragen we om laptop-vrij te blijven om ruimte te maken voor gezelligheid.'
        },
        {
            question: 'Hebben jullie glutenvrije opties?',
            answer: 'Ja, we hebben altijd minimaal 2 glutenvrije taartjes en diverse lunchopties beschikbaar.'
        }
    ],
    certifications: ['Fair Trade Certified', 'Best Barista 2024 Nominee'],
    kvk: '12345678',
    foundedYear: 2018,
    details: {
        policies: 'Annuleren kan tot 2 uur van tevoren. Honden zijn welkom op het terras en in het voorste gedeelte.',
        lastUpdate: '21 januari 2026',
        status: 'published'
    },
    seo: {
        title: 'De Koffie Kamer Utrecht | Specialty Coffee & Lunch in Wittevrouwen',
        metaDescription: 'Ontdek De Koffie Kamer in Utrecht Wittevrouwen. Dé plek voor specialty coffee, huisgemaakte taart en gezonde lunch. Gratis Wi-Fi en zonnig terras.',
        h1: 'De Koffie Kamer Utrecht',
        keywords: ['koffie utrecht', 'lunch wittevrouwen', 'specialty coffee', 'flexwerken utrecht'],
        canonicalUrl: 'https://utrecht-directory.nl/bedrijf/de-koffie-kamer-utrecht',
        localSeoText: 'Gelegen aan de bruisende Biltstraat in Utrecht Wittevrouwen, bieden wij de beste koffie-ervaring in de buurt.'
    }
};
