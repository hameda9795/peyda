// Category image mappings - works for all provinces and cities
const baseCategoryImages: Record<string, string> = {
    // Eten & Drinken
    'eten-drinken': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',

    // Winkels & Retail
    'winkels': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',

    // Beauty & Kappers
    'beauty': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop',

    // Gezondheid & Zorg
    'gezondheid': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',

    // Sport & Fitness
    'sport': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',

    // Klussen, Reparatie & Onderhoud
    'klussen': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop',

    // Bouw & Renovatie
    'bouw-renovatie': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop',

    // Schoonmaak & Huishoudelijke diensten
    'schoonmaak': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',

    // Auto, Taxi & Vervoer
    'auto-vervoer': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop',

    // Fiets & Micromobiliteit
    'fiets': 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=600&auto=format&fit=crop',

    // IT, Telefoon & Tech
    'it-tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',

    // Zakelijke diensten (B2B)
    'zakelijk': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',

    // Onderwijs & Cursussen
    'onderwijs': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop',

    // Kind & Gezin
    'kind-gezin': 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=600&auto=format&fit=crop',

    // Huisdieren
    'huisdieren': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',

    // Wonen & Vastgoed
    'wonen': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop',

    // Overnachten
    'overnachten': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',

    // Uitgaan, Vrije tijd & Toerisme
    'uitgaan': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',

    // Bruiloft & Events
    'bruiloft-events': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop',

    // Kunst, Media & Cultuur
    'cultuur': 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop',

    // Interieur & Woondecoratie
    'interieur': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop',

    // Koerier, Verhuizen & Logistiek
    'logistiek': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',

    // Juridisch & Administratief
    'juridisch': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',

    // Financieel & Verzekeren
    'financieel': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop',

    // Drukwerk & Reclame
    'druk-reclame': 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=600&auto=format&fit=crop',

    // Productie, Werkplaats & Maatwerk
    'productie': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop',

    // Duurzaam & Energie
    'duurzaam': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',

    // Lokaal & Buurtinitiatieven
    'lokaal': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop',

    // Gemeenschap & Sociale organisaties
    'gemeenschap': 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&auto=format&fit=crop',

    // Publieke diensten
    'diensten': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop',
};

// Backwards compatibility - generate full paths
export const categoryImages: Record<string, string> = {
    // Utrecht
    '/utrecht/eten-drinken': baseCategoryImages['eten-drinken'],
    '/utrecht/winkels': baseCategoryImages['winkels'],
    '/utrecht/beauty': baseCategoryImages['beauty'],
    '/utrecht/gezondheid': baseCategoryImages['gezondheid'],
    '/utrecht/sport': baseCategoryImages['sport'],
    '/utrecht/klussen': baseCategoryImages['klussen'],
    '/utrecht/bouw-renovatie': baseCategoryImages['bouw-renovatie'],
    '/utrecht/schoonmaak': baseCategoryImages['schoonmaak'],
    '/utrecht/auto-vervoer': baseCategoryImages['auto-vervoer'],
    '/utrecht/fiets': baseCategoryImages['fiets'],
    '/utrecht/it-tech': baseCategoryImages['it-tech'],
    '/utrecht/zakelijk': baseCategoryImages['zakelijk'],
    '/utrecht/onderwijs': baseCategoryImages['onderwijs'],
    '/utrecht/kind-gezin': baseCategoryImages['kind-gezin'],
    '/utrecht/huisdieren': baseCategoryImages['huisdieren'],
    '/utrecht/wonen': baseCategoryImages['wonen'],
    '/utrecht/overnachten': baseCategoryImages['overnachten'],
    '/utrecht/uitgaan': baseCategoryImages['uitgaan'],
    '/utrecht/bruiloft-events': baseCategoryImages['bruiloft-events'],
    '/utrecht/cultuur': baseCategoryImages['cultuur'],
    '/utrecht/interieur': baseCategoryImages['interieur'],
    '/utrecht/logistiek': baseCategoryImages['logistiek'],
    '/utrecht/juridisch': baseCategoryImages['juridisch'],
    '/utrecht/financieel': baseCategoryImages['financieel'],
    '/utrecht/druk-reclame': baseCategoryImages['druk-reclame'],
    '/utrecht/productie': baseCategoryImages['productie'],
    '/utrecht/duurzaam': baseCategoryImages['duurzaam'],
    '/utrecht/lokaal': baseCategoryImages['lokaal'],
    '/utrecht/gemeenschap': baseCategoryImages['gemeenschap'],
    '/utrecht/diensten': baseCategoryImages['diensten'],
};

export const getCategoryImage = (slug: string): string => {
    // Try precise match first
    if (categoryImages[slug]) return categoryImages[slug];

    // Extract base category from slug (e.g., "/amsterdam/eten-drinken" -> "eten-drinken")
    const slugParts = slug.split('/').filter(Boolean);
    const baseCategory = slugParts[slugParts.length - 1];

    // Try to match base category
    if (baseCategory && baseCategoryImages[baseCategory]) {
        return baseCategoryImages[baseCategory];
    }

    // Try partial matching
    for (const [key, url] of Object.entries(baseCategoryImages)) {
        if (slug.toLowerCase().includes(key.toLowerCase())) {
            return url;
        }
    }

    // Fallback to a generic business image based on hash of slug
    const genericImages = [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop', // office
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop', // handshake
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop', // business
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop', // meeting
    ];

    // Use hash of slug to pick consistent image
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        hash = ((hash << 5) - hash) + slug.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % genericImages.length;
    return genericImages[index];
};
