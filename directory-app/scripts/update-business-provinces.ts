/**
 * Script to update existing businesses with province data
 * Run with: npx ts-node scripts/update-business-provinces.ts
 * Or: npx tsx scripts/update-business-provinces.ts
 */

import { PrismaClient } from '@prisma/client';

// Copy of NETHERLANDS_PROVINCES data for the script
const NETHERLANDS_PROVINCES = [
    {
        name: "Noord-Holland",
        slug: "noord-holland",
        cities: [
            { name: "Amsterdam", slug: "amsterdam" },
            { name: "Haarlem", slug: "haarlem" },
            { name: "Zaanstad", slug: "zaanstad" },
            { name: "Haarlemmermeer", slug: "haarlemmermeer" },
            { name: "Almere", slug: "almere" },
            { name: "Amstelveen", slug: "amstelveen" },
            { name: "Hilversum", slug: "hilversum" },
            { name: "Purmerend", slug: "purmerend" },
            { name: "Alkmaar", slug: "alkmaar" },
            { name: "Hoorn", slug: "hoorn" },
            { name: "Den Helder", slug: "den-helder" },
            { name: "Velsen", slug: "velsen" },
        ]
    },
    {
        name: "Zuid-Holland",
        slug: "zuid-holland",
        cities: [
            { name: "Rotterdam", slug: "rotterdam" },
            { name: "Den Haag", slug: "den-haag" },
            { name: "Leiden", slug: "leiden" },
            { name: "Dordrecht", slug: "dordrecht" },
            { name: "Zoetermeer", slug: "zoetermeer" },
            { name: "Delft", slug: "delft" },
            { name: "Schiedam", slug: "schiedam" },
            { name: "Vlaardingen", slug: "vlaardingen" },
            { name: "Gouda", slug: "gouda" },
            { name: "Alphen aan den Rijn", slug: "alphen-aan-den-rijn" },
            { name: "Spijkenisse", slug: "spijkenisse" },
            { name: "Katwijk", slug: "katwijk" },
        ]
    },
    {
        name: "Utrecht",
        slug: "utrecht",
        cities: [
            { name: "Utrecht", slug: "utrecht-stad" },
            { name: "Amersfoort", slug: "amersfoort" },
            { name: "Nieuwegein", slug: "nieuwegein" },
            { name: "Veenendaal", slug: "veenendaal" },
            { name: "Zeist", slug: "zeist" },
            { name: "Houten", slug: "houten" },
            { name: "IJsselstein", slug: "ijsselstein" },
            { name: "Woerden", slug: "woerden" },
            { name: "De Bilt", slug: "de-bilt" },
            { name: "Soest", slug: "soest" },
        ]
    },
    {
        name: "Noord-Brabant",
        slug: "noord-brabant",
        cities: [
            { name: "Eindhoven", slug: "eindhoven" },
            { name: "'s-Hertogenbosch", slug: "s-hertogenbosch" },
            { name: "Tilburg", slug: "tilburg" },
            { name: "Breda", slug: "breda" },
            { name: "Helmond", slug: "helmond" },
            { name: "Oss", slug: "oss" },
            { name: "Roosendaal", slug: "roosendaal" },
            { name: "Bergen op Zoom", slug: "bergen-op-zoom" },
            { name: "Waalwijk", slug: "waalwijk" },
            { name: "Veldhoven", slug: "veldhoven" },
        ]
    },
    {
        name: "Gelderland",
        slug: "gelderland",
        cities: [
            { name: "Nijmegen", slug: "nijmegen" },
            { name: "Arnhem", slug: "arnhem" },
            { name: "Apeldoorn", slug: "apeldoorn" },
            { name: "Ede", slug: "ede" },
            { name: "Doetinchem", slug: "doetinchem" },
            { name: "Harderwijk", slug: "harderwijk" },
            { name: "Zutphen", slug: "zutphen" },
            { name: "Tiel", slug: "tiel" },
            { name: "Wageningen", slug: "wageningen" },
            { name: "Barneveld", slug: "barneveld" },
        ]
    },
    {
        name: "Limburg",
        slug: "limburg",
        cities: [
            { name: "Maastricht", slug: "maastricht" },
            { name: "Venlo", slug: "venlo" },
            { name: "Sittard-Geleen", slug: "sittard-geleen" },
            { name: "Heerlen", slug: "heerlen" },
            { name: "Roermond", slug: "roermond" },
            { name: "Weert", slug: "weert" },
            { name: "Kerkrade", slug: "kerkrade" },
            { name: "Venray", slug: "venray" },
            { name: "Landgraaf", slug: "landgraaf" },
            { name: "Brunssum", slug: "brunssum" },
        ]
    },
    {
        name: "Overijssel",
        slug: "overijssel",
        cities: [
            { name: "Zwolle", slug: "zwolle" },
            { name: "Enschede", slug: "enschede" },
            { name: "Deventer", slug: "deventer" },
            { name: "Hengelo", slug: "hengelo" },
            { name: "Almelo", slug: "almelo" },
            { name: "Kampen", slug: "kampen" },
            { name: "Oldenzaal", slug: "oldenzaal" },
            { name: "Rijssen-Holten", slug: "rijssen-holten" },
            { name: "Hardenberg", slug: "hardenberg" },
            { name: "Raalte", slug: "raalte" },
        ]
    },
    {
        name: "Groningen",
        slug: "groningen",
        cities: [
            { name: "Groningen", slug: "groningen-stad" },
            { name: "Hoogezand-Sappemeer", slug: "hoogezand-sappemeer" },
            { name: "Veendam", slug: "veendam" },
            { name: "Stadskanaal", slug: "stadskanaal" },
            { name: "Winschoten", slug: "winschoten" },
            { name: "Delfzijl", slug: "delfzijl" },
            { name: "Leek", slug: "leek" },
            { name: "Appingedam", slug: "appingedam" },
        ]
    },
    {
        name: "Friesland",
        slug: "friesland",
        cities: [
            { name: "Leeuwarden", slug: "leeuwarden" },
            { name: "Súdwest-Fryslân", slug: "sudwest-fryslan" },
            { name: "Smallingerland", slug: "smallingerland" },
            { name: "Heerenveen", slug: "heerenveen" },
            { name: "Harlingen", slug: "harlingen" },
            { name: "Franeker", slug: "franeker" },
            { name: "Dokkum", slug: "dokkum" },
            { name: "Sneek", slug: "sneek" },
        ]
    },
    {
        name: "Drenthe",
        slug: "drenthe",
        cities: [
            { name: "Assen", slug: "assen" },
            { name: "Emmen", slug: "emmen" },
            { name: "Hoogeveen", slug: "hoogeveen" },
            { name: "Meppel", slug: "meppel" },
            { name: "Coevorden", slug: "coevorden" },
            { name: "Roden", slug: "roden" },
            { name: "Beilen", slug: "beilen" },
        ]
    },
    {
        name: "Flevoland",
        slug: "flevoland",
        cities: [
            { name: "Almere", slug: "almere" },
            { name: "Lelystad", slug: "lelystad" },
            { name: "Dronten", slug: "dronten" },
            { name: "Zeewolde", slug: "zeewolde" },
            { name: "Urk", slug: "urk" },
            { name: "Noordoostpolder", slug: "noordoostpolder" },
        ]
    },
    {
        name: "Zeeland",
        slug: "zeeland",
        cities: [
            { name: "Middelburg", slug: "middelburg" },
            { name: "Vlissingen", slug: "vlissingen" },
            { name: "Goes", slug: "goes" },
            { name: "Terneuzen", slug: "terneuzen" },
            { name: "Zierikzee", slug: "zierikzee" },
            { name: "Hulst", slug: "hulst" },
            { name: "Veere", slug: "veere" },
        ]
    }
];

function findProvinceByCity(cityName: string) {
    const lower = cityName.toLowerCase();
    for (const province of NETHERLANDS_PROVINCES) {
        const match = province.cities.find((city) => city.name.toLowerCase() === lower);
        if (match) return { province, city: match };
    }
    return null;
}

async function updateBusinessProvinces() {
    const prisma = new PrismaClient();

    try {
        console.log('Fetching businesses without province data...');

        // Get all businesses without province data
        const businesses = await prisma.business.findMany({
            where: {
                OR: [
                    { province: null },
                    { provinceSlug: null }
                ]
            },
            select: {
                id: true,
                name: true,
                city: true,
                province: true,
                provinceSlug: true
            }
        });

        console.log(`Found ${businesses.length} businesses to update`);

        let updated = 0;
        let skipped = 0;

        for (const business of businesses) {
            const locationData = findProvinceByCity(business.city || 'Utrecht');

            if (locationData) {
                await prisma.business.update({
                    where: { id: business.id },
                    data: {
                        province: locationData.province.name,
                        provinceSlug: locationData.province.slug
                    }
                });
                console.log(`Updated: ${business.name} -> ${locationData.province.name}`);
                updated++;
            } else {
                console.log(`Skipped (unknown city): ${business.name} - ${business.city}`);
                skipped++;
            }
        }

        console.log('\n--- Summary ---');
        console.log(`Updated: ${updated}`);
        console.log(`Skipped: ${skipped}`);
        console.log('Done!');

    } catch (error) {
        console.error('Error updating businesses:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateBusinessProvinces();
