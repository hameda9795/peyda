const fs = require('fs');

const ids = JSON.parse(fs.readFileSync('unsplash_ids.json', 'utf8'));

const getUrls = (topic) => Array.isArray(ids[topic]) ? ids[topic].map(id => 'https://images.unsplash.com/photo-' + id + '?q=80&w=800&auto=format&fit=crop') : [];

const topicsMap = {
    'eten-drinken': getUrls('restaurant').concat(getUrls('bakery'), getUrls('pizza'), getUrls('cafe'), getUrls('bar'), getUrls('vegan')),
    'winkels': getUrls('supermarket').concat(getUrls('butcher'), getUrls('clothes'), getUrls('shoes'), getUrls('tech'), getUrls('furniture'), getUrls('toys'), getUrls('books'), getUrls('flowers'), getUrls('pets'), getUrls('bicycle')),
    'beauty': getUrls('hair').concat(getUrls('nails'), getUrls('spa'), getUrls('makeup'), getUrls('massage')),
    'gezondheid': getUrls('doctor').concat(getUrls('dentist'), getUrls('spa'), getUrls('massage')),
    'sport': getUrls('gym').concat(getUrls('yoga'), getUrls('swim')),
    'klussen': getUrls('tools').concat(getUrls('paint'), getUrls('plumber'), getUrls('electrician')),
    'bouw-renovatie': getUrls('tools').concat(getUrls('house')),
    'schoonmaak': getUrls('cleaning'),
    'auto-vervoer': getUrls('car').concat(getUrls('taxi'), getUrls('repair')),
    'fiets': getUrls('bicycle'),
    'it-tech': getUrls('tech').concat(getUrls('office'), getUrls('printing')),
    'zakelijk': getUrls('office').concat(getUrls('meeting'), getUrls('law'), getUrls('finance')),
    'onderwijs': getUrls('school').concat(getUrls('kids')),
    'kind-gezin': getUrls('kids'),
    'huisdieren': getUrls('pets').concat(getUrls('doctor')),
    'wonen': getUrls('house').concat(getUrls('realestate'), getUrls('interior')),
    'overnachten': getUrls('hotel').concat(getUrls('house')),
    'uitgaan': getUrls('museum').concat(getUrls('party'), getUrls('music')),
    'bruiloft-events': getUrls('wedding').concat(getUrls('party'), getUrls('music'), getUrls('flowers'), getUrls('event')),
    'cultuur': getUrls('museum').concat(getUrls('art'), getUrls('music')),
    'interieur': getUrls('interior').concat(getUrls('furniture')),
    'logistiek': getUrls('boxes').concat(getUrls('shipping'), getUrls('transport')),
    'juridisch': getUrls('law').concat(getUrls('office')),
    'financieel': getUrls('finance'),
    'druk-reclame': getUrls('printing'),
    'productie': getUrls('factory'),
    'duurzaam': getUrls('solar').concat(getUrls('garden')),
    'lokaal': getUrls('community').concat(getUrls('garden')),
    'gemeenschap': getUrls('community').concat(getUrls('party')),
    'diensten': getUrls('office').concat(getUrls('meeting'))
};

const output = `// Automatically generated robust image lists
export const categoryImagePools: Record<string, string[]> = ${JSON.stringify(topicsMap, null, 4)};

// Deterministic random picker
export const getSubcategoryImage = (categorySlug: string, subcategoryName: string): string => {
    // 1. Extract purely the 'base category slug'
    const slugParts = categorySlug.split('/').filter(Boolean);
    const baseCategory = slugParts[slugParts.length - 1]?.toLowerCase() || 'unknown';

    // 2. Get pool for this exact category
    const pool = categoryImagePools[baseCategory] || categoryImagePools['wonen'] || [];
    
    // 3. Fallback to generic URL if empty mapping (should never happen)
    if (!pool || pool.length === 0) {
        return 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop';
    }

    // 4. Use a deterministic hashing function to always yield the same unique image for the exact subcategory name
    let hash = 0;
    const combined = baseCategory + '-' + subcategoryName.trim().toLowerCase();
    for (let i = 0; i < combined.length; i++) {
        hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % pool.length;

    return pool[index];
};
`;

fs.writeFileSync('src/lib/subcategory-images.ts', output);
console.log('Successfully wrote dynamic pools to src/lib/subcategory-images.ts');
