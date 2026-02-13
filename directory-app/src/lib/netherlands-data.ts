// Complete Netherlands Provinces and Cities Data
// All 12 provinces with their major cities/municipalities

export interface City {
    name: string;
    slug: string;
    population?: number;
    isCapital?: boolean;
}

export interface Province {
    name: string;
    slug: string;
    capital: string;
    icon: string;
    gradient: string;
    image?: string;
    cities: City[];
}

export const NETHERLANDS_PROVINCES: Province[] = [
    {
        name: "Noord-Holland",
        slug: "noord-holland",
        capital: "Haarlem",
        icon: "🏛️",
        gradient: "from-orange-400 to-red-500",
        image: "https://images.unsplash.com/photo-1505739770657-0f5e625b5ddb?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Amsterdam", slug: "amsterdam", population: 873000, isCapital: false },
            { name: "Haarlem", slug: "haarlem", population: 162000, isCapital: true },
            { name: "Zaanstad", slug: "zaanstad", population: 157000 },
            { name: "Haarlemmermeer", slug: "haarlemmermeer", population: 156000 },
            { name: "Almere", slug: "almere", population: 218000 },
            { name: "Amstelveen", slug: "amstelveen", population: 91000 },
            { name: "Hilversum", slug: "hilversum", population: 92000 },
            { name: "Purmerend", slug: "purmerend", population: 81000 },
            { name: "Alkmaar", slug: "alkmaar", population: 110000 },
            { name: "Hoorn", slug: "hoorn", population: 74000 },
            { name: "Den Helder", slug: "den-helder", population: 55000 },
            { name: "Velsen", slug: "velsen", population: 68000 },
        ]
    },
    {
        name: "Zuid-Holland",
        slug: "zuid-holland",
        capital: "Den Haag",
        icon: "🌷",
        gradient: "from-blue-400 to-indigo-500",
        image: "https://images.unsplash.com/photo-1505731137685-1ecb430a43f8?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Rotterdam", slug: "rotterdam", population: 655000 },
            { name: "Den Haag", slug: "den-haag", population: 548000, isCapital: true },
            { name: "Leiden", slug: "leiden", population: 125000 },
            { name: "Dordrecht", slug: "dordrecht", population: 120000 },
            { name: "Zoetermeer", slug: "zoetermeer", population: 125000 },
            { name: "Delft", slug: "delft", population: 104000 },
            { name: "Schiedam", slug: "schiedam", population: 79000 },
            { name: "Vlaardingen", slug: "vlaardingen", population: 73000 },
            { name: "Gouda", slug: "gouda", population: 74000 },
            { name: "Alphen aan den Rijn", slug: "alphen-aan-den-rijn", population: 112000 },
            { name: "Spijkenisse", slug: "spijkenisse", population: 72000 },
            { name: "Katwijk", slug: "katwijk", population: 66000 },
        ]
    },
    {
        name: "Utrecht",
        slug: "utrecht",
        capital: "Utrecht",
        icon: "🏰",
        gradient: "from-violet-400 to-purple-500",
        image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Utrecht", slug: "utrecht-stad", population: 361000, isCapital: true },
            { name: "Amersfoort", slug: "amersfoort", population: 160000 },
            { name: "Nieuwegein", slug: "nieuwegein", population: 64000 },
            { name: "Veenendaal", slug: "veenendaal", population: 68000 },
            { name: "Zeist", slug: "zeist", population: 65000 },
            { name: "Houten", slug: "houten", population: 51000 },
            { name: "IJsselstein", slug: "ijsselstein", population: 34000 },
            { name: "Woerden", slug: "woerden", population: 53000 },
            { name: "De Bilt", slug: "de-bilt", population: 43000 },
            { name: "Soest", slug: "soest", population: 47000 },
        ]
    },
    {
        name: "Noord-Brabant",
        slug: "noord-brabant",
        capital: "'s-Hertogenbosch",
        icon: "🎭",
        gradient: "from-rose-400 to-pink-500",
        image: "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Eindhoven", slug: "eindhoven", population: 238000 },
            { name: "'s-Hertogenbosch", slug: "s-hertogenbosch", population: 158000, isCapital: true },
            { name: "Tilburg", slug: "tilburg", population: 224000 },
            { name: "Breda", slug: "breda", population: 185000 },
            { name: "Helmond", slug: "helmond", population: 93000 },
            { name: "Oss", slug: "oss", population: 92000 },
            { name: "Roosendaal", slug: "roosendaal", population: 77000 },
            { name: "Bergen op Zoom", slug: "bergen-op-zoom", population: 67000 },
            { name: "Waalwijk", slug: "waalwijk", population: 48000 },
            { name: "Veldhoven", slug: "veldhoven", population: 46000 },
        ]
    },
    {
        name: "Gelderland",
        slug: "gelderland",
        capital: "Arnhem",
        icon: "🌲",
        gradient: "from-emerald-400 to-teal-500",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Nijmegen", slug: "nijmegen", population: 179000 },
            { name: "Arnhem", slug: "arnhem", population: 164000, isCapital: true },
            { name: "Apeldoorn", slug: "apeldoorn", population: 165000 },
            { name: "Ede", slug: "ede", population: 119000 },
            { name: "Doetinchem", slug: "doetinchem", population: 58000 },
            { name: "Harderwijk", slug: "harderwijk", population: 48000 },
            { name: "Zutphen", slug: "zutphen", population: 48000 },
            { name: "Tiel", slug: "tiel", population: 42000 },
            { name: "Wageningen", slug: "wageningen", population: 39000 },
            { name: "Barneveld", slug: "barneveld", population: 60000 },
        ]
    },
    {
        name: "Limburg",
        slug: "limburg",
        capital: "Maastricht",
        icon: "⛰️",
        gradient: "from-amber-400 to-orange-500",
        image: "https://images.unsplash.com/photo-1529429617124-aee0bd31b815?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Maastricht", slug: "maastricht", population: 122000, isCapital: true },
            { name: "Venlo", slug: "venlo", population: 102000 },
            { name: "Sittard-Geleen", slug: "sittard-geleen", population: 92000 },
            { name: "Heerlen", slug: "heerlen", population: 87000 },
            { name: "Roermond", slug: "roermond", population: 59000 },
            { name: "Weert", slug: "weert", population: 50000 },
            { name: "Kerkrade", slug: "kerkrade", population: 45000 },
            { name: "Venray", slug: "venray", population: 44000 },
            { name: "Landgraaf", slug: "landgraaf", population: 37000 },
            { name: "Brunssum", slug: "brunssum", population: 28000 },
        ]
    },
    {
        name: "Overijssel",
        slug: "overijssel",
        capital: "Zwolle",
        icon: "🏞️",
        gradient: "from-cyan-400 to-blue-500",
        image: "https://images.unsplash.com/photo-1597507600960-2c45888cd1c0?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Zwolle", slug: "zwolle", population: 130000, isCapital: true },
            { name: "Enschede", slug: "enschede", population: 160000 },
            { name: "Deventer", slug: "deventer", population: 101000 },
            { name: "Hengelo", slug: "hengelo", population: 81000 },
            { name: "Almelo", slug: "almelo", population: 73000 },
            { name: "Kampen", slug: "kampen", population: 54000 },
            { name: "Oldenzaal", slug: "oldenzaal", population: 32000 },
            { name: "Rijssen-Holten", slug: "rijssen-holten", population: 38000 },
            { name: "Hardenberg", slug: "hardenberg", population: 61000 },
            { name: "Raalte", slug: "raalte", population: 38000 },
        ]
    },
    {
        name: "Groningen",
        slug: "groningen",
        capital: "Groningen",
        icon: "🎓",
        gradient: "from-teal-400 to-emerald-500",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Groningen", slug: "groningen-stad", population: 234000, isCapital: true },
            { name: "Hoogezand-Sappemeer", slug: "hoogezand-sappemeer", population: 35000 },
            { name: "Veendam", slug: "veendam", population: 27000 },
            { name: "Stadskanaal", slug: "stadskanaal", population: 32000 },
            { name: "Winschoten", slug: "winschoten", population: 18000 },
            { name: "Delfzijl", slug: "delfzijl", population: 25000 },
            { name: "Leek", slug: "leek", population: 20000 },
            { name: "Appingedam", slug: "appingedam", population: 12000 },
        ]
    },
    {
        name: "Friesland",
        slug: "friesland",
        capital: "Leeuwarden",
        icon: "⚓",
        gradient: "from-sky-400 to-blue-500",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Leeuwarden", slug: "leeuwarden", population: 124000, isCapital: true },
            { name: "Súdwest-Fryslân", slug: "sudwest-fryslan", population: 90000 },
            { name: "Smallingerland", slug: "smallingerland", population: 56000 },
            { name: "Heerenveen", slug: "heerenveen", population: 50000 },
            { name: "Harlingen", slug: "harlingen", population: 16000 },
            { name: "Franeker", slug: "franeker", population: 13000 },
            { name: "Dokkum", slug: "dokkum", population: 13000 },
            { name: "Sneek", slug: "sneek", population: 34000 },
        ]
    },
    {
        name: "Drenthe",
        slug: "drenthe",
        capital: "Assen",
        icon: "🌾",
        gradient: "from-lime-400 to-green-500",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Assen", slug: "assen", population: 69000, isCapital: true },
            { name: "Emmen", slug: "emmen", population: 107000 },
            { name: "Hoogeveen", slug: "hoogeveen", population: 56000 },
            { name: "Meppel", slug: "meppel", population: 34000 },
            { name: "Coevorden", slug: "coevorden", population: 35000 },
            { name: "Roden", slug: "roden", population: 19000 },
            { name: "Beilen", slug: "beilen", population: 11000 },
        ]
    },
    {
        name: "Flevoland",
        slug: "flevoland",
        capital: "Lelystad",
        icon: "🌊",
        gradient: "from-blue-400 to-cyan-500",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Almere", slug: "almere", population: 218000 },
            { name: "Lelystad", slug: "lelystad", population: 81000, isCapital: true },
            { name: "Dronten", slug: "dronten", population: 42000 },
            { name: "Zeewolde", slug: "zeewolde", population: 23000 },
            { name: "Urk", slug: "urk", population: 21000 },
            { name: "Noordoostpolder", slug: "noordoostpolder", population: 47000 },
        ]
    },
    {
        name: "Zeeland",
        slug: "zeeland",
        capital: "Middelburg",
        icon: "🐚",
        gradient: "from-indigo-400 to-violet-500",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
        cities: [
            { name: "Middelburg", slug: "middelburg", population: 49000, isCapital: true },
            { name: "Vlissingen", slug: "vlissingen", population: 45000 },
            { name: "Goes", slug: "goes", population: 38000 },
            { name: "Terneuzen", slug: "terneuzen", population: 54000 },
            { name: "Zierikzee", slug: "zierikzee", population: 11000 },
            { name: "Hulst", slug: "hulst", population: 28000 },
            { name: "Veere", slug: "veere", population: 22000 },
        ]
    }
];

// Get all cities flattened
export function getAllCities(): (City & { province: string; provinceSlug: string })[] {
    return NETHERLANDS_PROVINCES.flatMap(province =>
        province.cities.map(city => ({
            ...city,
            province: province.name,
            provinceSlug: province.slug
        }))
    );
}

// Get top cities by population
export function getTopCities(limit: number = 12) {
    return getAllCities()
        .sort((a, b) => (b.population || 0) - (a.population || 0))
        .slice(0, limit);
}

// Get province by slug
export function getProvinceBySlug(slug: string): Province | undefined {
    return NETHERLANDS_PROVINCES.find(p => p.slug === slug);
}

// Get city by slug
export function getCityBySlug(slug: string) {
    for (const province of NETHERLANDS_PROVINCES) {
        const city = province.cities.find(c => c.slug === slug);
        if (city) {
            return { ...city, province: province.name, provinceSlug: province.slug };
        }
    }
    return undefined;
}

// Category icons mapping
export const CATEGORY_ICONS: Record<string, string> = {
    "eten-drinken": "🍽️",
    "restaurants": "🍽️",
    "winkels": "🛍️",
    "beauty": "💅",
    "gezondheid": "🏥",
    "sport": "🏃",
    "klussen": "🔧",
    "bouw-renovatie": "🏗️",
    "schoonmaak": "🧹",
    "auto-vervoer": "🚗",
    "fiets": "🚲",
    "it-tech": "💻",
    "zakelijk": "💼",
    "onderwijs": "📚",
    "kind-gezin": "👶",
    "huisdieren": "🐕",
    "wonen": "🏠",
    "overnachten": "🏨",
    "uitgaan": "🎭",
    "bruiloft-events": "💒",
    "cultuur": "🎨",
    "interieur": "🛋️",
    "logistiek": "📦",
    "juridisch": "⚖️",
    "financieel": "💰",
    "druk-reclame": "🖨️",
    "productie": "🏭",
    "duurzaam": "🌱",
    "lokaal": "🏘️",
    "gemeenschap": "🤝",
    "diensten": "🏛️",
};

// Category gradients mapping
export const CATEGORY_GRADIENTS: Record<string, string> = {
    "eten-drinken": "from-orange-50 to-amber-100",
    "restaurants": "from-orange-50 to-amber-100",
    "winkels": "from-rose-50 to-pink-100",
    "beauty": "from-fuchsia-50 to-purple-100",
    "gezondheid": "from-teal-50 to-cyan-100",
    "sport": "from-green-50 to-emerald-100",
    "klussen": "from-slate-100 to-gray-200",
    "bouw-renovatie": "from-amber-50 to-yellow-100",
    "it-tech": "from-indigo-50 to-violet-100",
    "zakelijk": "from-blue-50 to-indigo-100",
};
