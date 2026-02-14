"use server";

import { db as prisma } from "@/lib/db";
import { getAllCities } from "@/lib/netherlands-data";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const normalize = (value?: string | null) => value?.trim() || undefined;

// Static neighborhoods for major Dutch cities
const STATIC_NEIGHBORHOODS: Record<string, string[]> = {
    "amsterdam": [
        "Centrum", "Westpoort", "Oost", "Zuid", "Noord", "West", "Nieuw-West", "Oost",
        "Zuid-Oost", "Amsterdam-Centrum", "De Pijp", "Jordaan", "Vondelpark", "Oud-West",
        "Bos en Lommer", "Geuzenveld", "Slotervaart", "Osdorp", "Amsterdam-Noord", "Buikslotermeer",
        "Nieuwendam", "Watergraafsmeer", "IJburg", "Zeeburg", "Indische Buurt", "Oostelijk Havengebied"
    ],
    "rotterdam": [
        "Centrum", "Noord", "Zuid", "West", "Oost", "Kralingen-Crooswijk", "Delfshaven",
        "Overschie", "Hillegersberg-Schiebroek", "Feijenoord", "IJsselmonde", "Hoogvliet",
        "Charlois", "Witte de Withstraat", "Kop van Zuid", "Museumpark", "Blijdorp"
    ],
    "den-haag": [
        "Centrum", "Segbroek", "Loosduinen", "Segbroek", "Laak", "Moerwijk", "Centrum",
        "Scheveningen", "Duindorp", "Voorburg", "Leidschendam", "Nootdorp", "Wassenaar",
        "Mariahoeve", "Beatrixkwartier", "Zuidwest", "Escamp", "Bouwlust", "Morgenstier"
    ],
    "utrecht-stad": [
        "Binnenstad", "Oost", "West", "Zuid", "Noord", "Overvecht", "Vleuten-De Meern",
        "Leidsche Rijn", "Wittevrouwen", "Lombok", "Oudwijk", "Tuindorp", "Zuilen",
        "Lunetten", "Hoograven", "Tolsteeg", "Kanaleneiland", "Transwijk", "Nieuw Hoograven"
    ],
    "utrecht": [
        "Binnenstad", "Oost", "West", "Zuid", "Noord", "Overvecht", "Vleuten-De Meern",
        "Leidsche Rijn", "Wittevrouwen", "Lombok", "Oudwijk", "Tuindorp", "Zuilen",
        "Lunetten", "Hoograven", "Tolsteeg", "Kanaleneiland", "Transwijk", "Nieuw Hoograven"
    ],
    "eindhoven": [
        "Centrum", "Stadion", "Woensel-Noord", "Woensel-Zuid", "Tongelre", "Stratum",
        "Elzenburg", "Gennep", "Luyksgestel", "Knegsel", "Veldhoven", "Waalre"
    ],
    "tilburg": [
        "Centrum", "Noord", "West", "Oost", "Zuid", "Berkel-Enschot", "Udenhout",
        "Brucken", "Theothane", "Groenewoud", "Korte Heuvel", "Koningshoeven"
    ],
    "breda": [
        "Centrum", "Noord", "Zuid", "West", "Oost", "Belcrum", "Breda-Noord",
        "Breda-Zuid", "Ginneken", "Mastbos", "Princenhage", "Hoge Vught", "Low"
    ],
    "amersfoort": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Vathorst", "Klein Eng",
        "Schuilenburg", "Kruiskamp", "Schaffersknoop", "Leusden", "Hoogland",
        "Hooglanderveen", "Nijkerkerveen"
    ],
    "haarlem": [
        "Centrum", "Noord", "Zuid", "West", "Oost", "Spaarndam", "Schalkwijk",
        "Europawijk", "Boerhaavewijk", "Klein Holland", "Stationsbuurt", "Zuidwest"
    ],
    "groningen-stad": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Helpman", "Coevorden",
        "Gravenburg", "Westerkwartier", "Lewenborg", "Selwerd", "Paddepoel", "Zernike"
    ],
    "arnhem": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Jonkersvaart", "Sonsbeek",
        "Klarendal", "Vredenburg", "Kronenburg", "De Laar", "Elden", "Elzenveld"
    ],
    "nijmegen": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Wijchen", "Neerbosch",
        "Hatert", "Heijendaal", "Nassau", "Biezen", "Graftermeer", "Lankhorst"
    ],
    "maastricht": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Wittevrouwenveld", "Brusselseweg",
        "Céramique", "Belvédère", "Jekerkwartier", "Sint-Maartenspoort", "Wyck"
    ],
    "zwolle": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Diezerpoort", "Wipstrik",
        "Assendorp", "Holtenbroek", "Berkum", "Vechtlanden", "Stadshagen"
    ],
    "enschede": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Lasonder", "Zuidwest",
        "Boddenkampsingel", "Wesselerbrink", "Stadsveld", "T Harler"
    ],
    "apeldoorn": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Berg en Bos", "Vulcania",
        "De Mheen", "Osseveld", "Zevenhuizen", "Het Loo", "Ugchelen"
    ],
    "haarlemmermeer": [
        "Hoofddorp", "Nieuw-Vennep", "Badhoevedorp", "Schiphol", "Zwanenburg",
        "Oude Meer", "Rijsenhout", "Lijnden", "Boesingheliede", "Kuinderbos"
    ],
    "almere": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Almere-Buiten", "Almere-Haven",
        "Almere-Stad", "Almere-Oost", "Almere-West", "Almere-Pampus", "Gooisekant"
    ],
    "leiden": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Stationsdistrict", "De Waard",
        "Morgenster", "Bilderberg", "Sassenheim", "Valkenburg", "Zoeterwoude"
    ],
    "delft": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Westplantsoen", "Korvezeedijk",
        "Tanthof", "Wippolder", "Abtswoude", "Schieweg"
    ],
    "dordrecht": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Krabbendam", "Krispijn",
        "Zuidhoven", "Sterrenburg", " Wielwijk", "Oranjewijk", "Klein Dubbels"
    ],
    "'s-hertogenbosch": [
        "Centrum", "Noord", "Zuid", "Oost", "West", "Borgstede", "Muntel",
        "Vughterst", "Sparrendal", "De Gestel", "Geertgen", "Zaltbommel"
    ],
    "zeeland": [
        "Middelburg", "Vlissingen", "Goes", "Terneuzen", "Zierikzee", "Hulst", "Veere"
    ]
};

export async function getCities(options?: { limit?: number; q?: string }) {
    const limit = clamp(options?.limit ?? 200, 1, 500);
    const q = normalize(options?.q);

    try {
        // Try to get cities from database first
        const dbCities = await prisma.city.findMany({
            where: q
                ? {
                    name: {
                        contains: q,
                        mode: "insensitive",
                    },
                }
                : undefined,
            orderBy: { name: "asc" },
            take: limit,
            include: {
                _count: {
                    select: { neighborhoods: true },
                },
            },
        });

        // If we have database cities, return them
        if (dbCities.length > 0) {
            return dbCities;
        }

        // Fallback to static data from netherlands-data.ts
        const staticCities = getAllCities();
        const filteredCities = q
            ? staticCities.filter(city =>
                city.name.toLowerCase().includes(q.toLowerCase())
            )
            : staticCities;

        return filteredCities.slice(0, limit).map(city => ({
            id: city.slug,
            name: city.name,
            slug: city.slug,
            province: city.province,
            _count: { neighborhoods: STATIC_NEIGHBORHOODS[city.slug]?.length || 0 }
        }));
    } catch (error) {
        console.error("Failed to fetch cities:", error);
        // Fallback to static data on error
        const staticCities = getAllCities();
        const q = normalize(options?.q);
        const filteredCities = q
            ? staticCities.filter(city =>
                city.name.toLowerCase().includes(q.toLowerCase())
            )
            : staticCities;

        return filteredCities.slice(0, limit).map(city => ({
            id: city.slug,
            name: city.name,
            slug: city.slug,
            province: city.province,
            _count: { neighborhoods: STATIC_NEIGHBORHOODS[city.slug]?.length || 0 }
        }));
    }
}

export async function getCityBySlug(slug: string) {
    const normalized = normalize(slug)?.toLowerCase();
    if (!normalized) return null;

    try {
        return await prisma.city.findUnique({
            where: { slug: normalized },
            include: {
                _count: {
                    select: { neighborhoods: true },
                },
            },
        });
    } catch (error) {
        console.error("Failed to fetch city by slug:", error);
        return null;
    }
}

export async function getNeighborhoodsByCitySlug(
    slug: string,
    options?: { limit?: number; q?: string }
) {
    const normalized = normalize(slug)?.toLowerCase();
    if (!normalized) return { city: null, neighborhoods: [] as { id: string; name: string; slug: string }[] };

    const limit = clamp(options?.limit ?? 300, 1, 1000);
    const q = normalize(options?.q);

    try {
        const city = await prisma.city.findUnique({
            where: { slug: normalized },
            select: { id: true, name: true, slug: true },
        });

        if (!city) {
            // Try to find city from static data
            const staticCities = getAllCities();
            const staticCity = staticCities.find(c => c.slug === normalized);

            if (staticCity) {
                const staticNeighborhoods = STATIC_NEIGHBORHOODS[normalized] || [];
                let filtered = staticNeighborhoods;

                if (q) {
                    filtered = staticNeighborhoods.filter(n =>
                        n.toLowerCase().includes(q.toLowerCase())
                    );
                }

                return {
                    city: { id: normalized, name: staticCity.name, slug: normalized },
                    neighborhoods: filtered.slice(0, limit).map((name, idx) => ({
                        id: `${normalized}-${idx}`,
                        name,
                        slug: name.toLowerCase().replace(/\s+/g, '-')
                    }))
                };
            }

            return { city: null, neighborhoods: [] as { id: string; name: string; slug: string }[] };
        }

        const neighborhoods = await prisma.neighborhood.findMany({
            where: {
                cityId: city.id,
                ...(q
                    ? {
                        name: {
                            contains: q,
                            mode: "insensitive",
                        },
                    }
                    : {}),
            },
            orderBy: { name: "asc" },
            take: limit,
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        // If no neighborhoods in DB, use static data
        if (neighborhoods.length === 0 && STATIC_NEIGHBORHOODS[normalized]) {
            const staticNeighborhoods = STATIC_NEIGHBORHOODS[normalized];
            let filtered = staticNeighborhoods;

            if (q) {
                filtered = staticNeighborhoods.filter(n =>
                    n.toLowerCase().includes(q.toLowerCase())
                );
            }

            return {
                city,
                neighborhoods: filtered.slice(0, limit).map((name, idx) => ({
                    id: `${city.id}-${idx}`,
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-')
                }))
            };
        }

        return { city, neighborhoods };
    } catch (error) {
        console.error("Failed to fetch neighborhoods:", error);

        // Fallback to static data on error
        const staticCities = getAllCities();
        const staticCity = staticCities.find(c => c.slug === normalized);

        if (staticCity) {
            const staticNeighborhoods = STATIC_NEIGHBORHOODS[normalized] || [];
            let filtered = staticNeighborhoods;

            if (q) {
                filtered = staticNeighborhoods.filter(n =>
                    n.toLowerCase().includes(q.toLowerCase())
                );
            }

            return {
                city: { id: normalized, name: staticCity.name, slug: normalized },
                neighborhoods: filtered.slice(0, limit).map((name, idx) => ({
                    id: `${normalized}-${idx}`,
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-')
                }))
            };
        }

        throw new Error("Failed to fetch neighborhoods");
    }
}
