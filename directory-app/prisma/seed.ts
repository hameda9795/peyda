import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORIES_CSV = `Hoofdcategorie (SEO),Subcategorieën (SEO),Voorbeelden (keywords),Aanbevolen URL-slug
Eten & Drinken in Utrecht,"Restaurants; Afhaal & bezorging; Cafés; Bakkerij; Patisserie; Catering; Lunchroom; Bars & lounges; Wereldkeukens (Iraans, Turks, Italiaans, etc.); Vegan/vegetarisch; Halal","restaurant, café, catering",/utrecht/eten-drinken
Winkels & Retail in Utrecht,Supermarkt; Slager; Groenteboer; Kledingwinkel; Schoenenwinkel; Drogist & cosmetica; Telefoon & computerwinkel; Huishoudelijk; Meubelwinkel; Speelgoed; Boekhandel & kantoorartikelen; Bloemist; Dierenwinkel; Fietswinkel,"winkel, supermarkt, fietsenwinkel",/utrecht/winkels
Beauty & Kappers in Utrecht,Kapper dames; Kapper heren/barbershop; Schoonheidssalon; Nagelstudio; Wimpers & wenkbrauwen; Huidkliniek; Waxen/epileren; Bruidsmake-up; PMU (permanente make-up); Zonnestudio,"kapper, schoonheidssalon",/utrecht/beauty
Gezondheid & Zorg in Utrecht,Huisarts; Tandarts; Fysiotherapie; Psycholoog; Diëtist; Apotheek; Kliniek; Acupunctuur; Therapeutische massage; Logopedie,"tandarts, fysiotherapie",/utrecht/gezondheid
Sport & Fitness in Utrecht,Sportschool; Personal trainer; Yoga; Pilates; Vechtsport; Zwemmen; Sportvereniging; Spinning/fietsen,"sportschool, yoga",/utrecht/sport
"Klussen, Reparatie & Onderhoud in Utrecht",Loodgieter; Elektricien; CV/verwarming; Airco; Timmerman; Schilder; Stukadoor; Vloeren; Glaszetter; Slotenmaker; Dakdekker; Isolatie; Allround klusbedrijf,"loodgieter, elektricien, klusbedrijf",/utrecht/klussen
Bouw & Renovatie in Utrecht,Aannemer; Woningrenovatie; Keuken; Badkamer; Gevel; Steigerbouw; Architect; Ingenieur/advies; Vergunningen,"aannemer, renovatie",/utrecht/bouw-renovatie
Schoonmaak & Huishoudelijke diensten in Utrecht,Schoonmaakbedrijf; Huishoudelijke hulp; Glazenwasser; Kantoor schoonmaak; Tapijt- & meubelreiniging; Ongediertebestrijding; Afval & opruimservice,"schoonmaakbedrijf, glazenwasser",/utrecht/schoonmaak
"Auto, Taxi & Vervoer in Utrecht",Autogarage; APK; Bandenservice; Carwash; Schadeherstel; Autoverhuur; Taxi; Pechhulp; Parkeren,"garage, taxi",/utrecht/auto-vervoer
Fiets & Micromobiliteit in Utrecht,Fietsenmaker; E-bike service; Onderhoud & reparatie; Accessoires; Accu/oplader; Fietssloten; Mobiele service; Scooter (reparatie/onderhoud),"fietsenmaker, e-bike",/utrecht/fiets
"IT, Telefoon & Tech in Utrecht",Telefoonreparatie; Laptopreparatie; Computerhulp; Netwerk & Wi‑Fi; Cybersecurity; Webdesign; Softwareontwikkeling; IT-support; Cloud & data; Printerservice,"telefoonreparatie, webdesign",/utrecht/it-tech
Zakelijke diensten (B2B) in Utrecht,Accountant; Boekhouder; Belastingadvies; Verzekeringen; Bedrijfsadvies; HR; Marketing/SEO; Juridisch; Notaris; Officiële vertaling,"accountant, marketingbureau",/utrecht/zakelijk
Onderwijs & Cursussen in Utrecht,Taalcursus; Bijles; Muziekles; Rijschool; IT-cursus; Coaching; Kinderactiviteiten; Examentraining,"taalschool, rijschool",/utrecht/onderwijs
Kind & Gezin in Utrecht,Kinderopvang; Gastouder; Babysitter; Kindercoach; Speelgroepen; Kinderfeestjes; Gezinscoaching,kinderopvang,/utrecht/kind-gezin
Huisdieren in Utrecht,Dierenarts; Trimsalon; Dierenpension; Hondentraining; Dierenwinkel; Vaccinatie & zorg,dierenarts,/utrecht/huisdieren
Wonen & Vastgoed in Utrecht,Makelaar; Huur & koop; Vastgoedbeheer; Hypotheekadvies; Taxatie; Interieuradvies,"makelaar, hypotheekadvies",/utrecht/wonen
Overnachten in Utrecht,Hotel; Hostel; B&B; Short-stay; Appartementverhuur,"hotel, b&b",/utrecht/overnachten
"Uitgaan, Vrije tijd & Toerisme in Utrecht",Musea; Attracties; City tours; Bioscoop; Evenementen; Escape room; Activiteiten,"museum, evenement",/utrecht/uitgaan
Bruiloft & Events in Utrecht,Trouwlocatie; DJ; Foto & video; Bloemen; Bruidsmode; Catering; Taarten; Eventplanner,"trouwlocatie, eventplanner",/utrecht/bruiloft-events
"Kunst, Media & Cultuur in Utrecht",Galerie; Kunstlessen; Theater; Muziek; Opnamestudio; Print & design,"studio, galerie",/utrecht/cultuur
Interieur & Woondecoratie in Utrecht,Raamdecoratie; Verlichting; Verf & behang; Meubels; Keukens; Slaapkamer; Decoratie,"interieur, woonwinkel",/utrecht/interieur
"Koerier, Verhuizen & Logistiek in Utrecht",Koerierdienst; Verhuisbedrijf; Transport; Opslag/warehouse; Verpakken,"koerier, verhuisbedrijf",/utrecht/logistiek
Juridisch & Administratief in Utrecht,Advocaat; Juridisch advies; Mediation; Immigratie; Bedrijfsregistratie; Administratiekantoor,"advocaat, administratie",/utrecht/juridisch
Financieel & Verzekeren in Utrecht,Financieel adviseur; Hypotheek; Leningen; Verzekeringskantoor; Schuldhulp; Budgetcoaching,"verzekeringen, financieel advies",/utrecht/financieel
Drukwerk & Reclame in Utrecht,Drukkerij; Sign/letters; Digital print; Visitekaartjes; Promotieartikelen; Grafisch ontwerp,"drukkerij, reclame",/utrecht/druk-reclame
"Productie, Werkplaats & Maatwerk in Utrecht",Houtbewerking; Metaalbewerking; Maatwerk; Industriële reparatie; Kunstwerkplaats,"werkplaats, maatwerk",/utrecht/productie
Duurzaam & Energie in Utrecht,Zonnepanelen; Isolatie; Warmtepomp; Energieadvies; Laadpaal EV,"zonnepanelen, warmtepomp",/utrecht/duurzaam
Lokaal & Buurtinitiatieven in Utrecht,Lokale producten; Buurtmarkten; Tuinieren; Gemeenschapsprojecten,lokaal initiatief,/utrecht/lokaal
Gemeenschap & Sociale organisaties in Utrecht,Verenigingen; Stichtingen; Vrijwilligerswerk; Buurtcentra; Religieuze centra,"stichting, vereniging",/utrecht/gemeenschap
Publieke diensten in Utrecht,Gemeente-informatie; Bibliotheken; Publieke loketten; Consumentenadvies,"gemeente, bibliotheek",/utrecht/diensten`

// Function to parse CSV line respecting quotes
function parseCSVLine(line: string): string[] {
    const parts: string[] = [];
    let currentPart = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            parts.push(currentPart.trim().replace(/^"|"$/g, ''));
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    parts.push(currentPart.trim().replace(/^"|"$/g, ''));
    return parts;
}

async function main() {
    console.log('Seeding categories...')
    const lines = CATEGORIES_CSV.split(/\r?\n/).slice(1);

    for (const line of lines) {
        if (!line.trim()) continue;

        const parts = parseCSVLine(line);

        if (parts.length >= 4) {
            const name = parts[0];
            const subcategories = parts[1].split(';').map(s => s.trim());
            const slug = parts[3];

            // Create Category
            const category = await prisma.category.upsert({
                where: { slug },
                update: { name },
                create: {
                    name,
                    slug,
                }
            });

            console.log(`Upserted category: ${name}`);

            // Create Subcategories
            for (const subName of subcategories) {
                if (!subName) continue;
                const subSlug = slug + '/' + subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                await prisma.subCategory.upsert({
                    where: { slug: subSlug },
                    update: { name: subName },
                    create: {
                        name: subName,
                        slug: subSlug,
                        categoryId: category.id
                    }
                });
            }
        }
    }
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
