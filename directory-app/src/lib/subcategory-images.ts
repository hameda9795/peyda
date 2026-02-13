
// Verified High-Reliability Images
const IMAGES = {
    food: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop", // Restaurant generic
    cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop", // Coffee
    shop: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop", // Shop generic
    beauty: "https://images.unsplash.com/photo-1560066984-12186d30b93c?q=80&w=600&auto=format&fit=crop", // Salon
    health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop", // Doctor
    sport: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop", // Gym
    construction: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&auto=format&fit=crop", // Tools
    cleaning: "https://images.unsplash.com/photo-1581578731117-104f2a412727?q=80&w=600&auto=format&fit=crop", // Cleaning
    auto: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop", // Car
    tech: "https://images.unsplash.com/photo-1517430816045-df4b7de8db2b?q=80&w=600&auto=format&fit=crop", // Laptop
    business: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop", // Office
    kids: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&auto=format&fit=crop", // Kids
    pets: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop", // Dog
    events: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop", // Party
    housing: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop", // House keys
    logistic: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop", // Boxes
    print: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=600&auto=format&fit=crop", // Print
};

export const subcategoryImages: Record<string, string> = {
    // Eten & Drinken
    "/utrecht/eten-drinken/restaurants": IMAGES.food,
    "/utrecht/eten-drinken/afhaal & bezorging": "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop", // Pizza
    "/utrecht/eten-drinken/cafés": IMAGES.cafe,
    "/utrecht/eten-drinken/bakkerij": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
    "/utrecht/eten-drinken/patisserie": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
    "/utrecht/eten-drinken/catering": IMAGES.food,
    "/utrecht/eten-drinken/lunchroom": IMAGES.cafe,
    "/utrecht/eten-drinken/bars & lounges": IMAGES.cafe,
    "/utrecht/eten-drinken/wereldkeukens (iraans, turks, italiaans, etc.)": IMAGES.food,
    "/utrecht/eten-drinken/vegan/vegetarisch": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
    "/utrecht/eten-drinken/halal": IMAGES.food,

    // Winkels
    "/utrecht/winkels/supermarkt": "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop",
    "/utrecht/winkels/slager": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=600&auto=format&fit=crop",
    "/utrecht/winkels/groenteboer": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=600&auto=format&fit=crop",
    "/utrecht/winkels/kledingwinkel": IMAGES.shop,
    "/utrecht/winkels/schoenenwinkel": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    "/utrecht/winkels/drogist & cosmetica": IMAGES.shop,
    "/utrecht/winkels/telefoon & computerwinkel": IMAGES.tech,
    "/utrecht/winkels/huishoudelijk": IMAGES.shop,
    "/utrecht/winkels/meubelwinkel": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
    "/utrecht/winkels/speelgoed": IMAGES.kids,
    "/utrecht/winkels/boekhandel & kantoorartikelen": IMAGES.shop,
    "/utrecht/winkels/bloemist": "https://images.unsplash.com/photo-1596726650634-11883556af36?q=80&w=600&auto=format&fit=crop",
    "/utrecht/winkels/dierenwinkel": IMAGES.pets,
    "/utrecht/winkels/fietswinkel": "https://images.unsplash.com/photo-1532298229144-0ec0c57e3356?q=80&w=600&auto=format&fit=crop",

    // Beauty
    "/utrecht/beauty/kapper dames": "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop",
    "/utrecht/beauty/kapper heren/barbershop": "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600&auto=format&fit=crop",
    "/utrecht/beauty/schoonheidssalon": IMAGES.beauty,
    "/utrecht/beauty/nagelstudio": "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop",
    "/utrecht/beauty/wimpers & wenkbrauwen": IMAGES.beauty,
    "/utrecht/beauty/huidkliniek": IMAGES.beauty,
    "/utrecht/beauty/waxen/epileren": IMAGES.beauty,
    "/utrecht/beauty/bruidsmake-up": IMAGES.beauty,
    "/utrecht/beauty/pmu (permanente make-up)": IMAGES.beauty,
    "/utrecht/beauty/zonnestudio": IMAGES.beauty,

    // Gezondheid
    "/utrecht/gezondheid/huisarts": IMAGES.health,
    "/utrecht/gezondheid/tandarts": "https://images.unsplash.com/photo-1445527697940-617d00387222?q=80&w=600&auto=format&fit=crop",
    "/utrecht/gezondheid/fysiotherapie": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/gezondheid/psycholoog": IMAGES.health,
    "/utrecht/gezondheid/diëtist": IMAGES.health,
    "/utrecht/gezondheid/apotheek": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=600&auto=format&fit=crop",
    "/utrecht/gezondheid/kliniek": IMAGES.health,
    "/utrecht/gezondheid/acupunctuur": IMAGES.health,
    "/utrecht/gezondheid/therapeutische massage": IMAGES.beauty,
    "/utrecht/gezondheid/logopedie": IMAGES.health,

    // Sport
    "/utrecht/sport/sportschool": IMAGES.sport,
    "/utrecht/sport/personal trainer": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",
    "/utrecht/sport/yoga": "https://images.unsplash.com/photo-1599447421405-075115d6e300?q=80&w=600&auto=format&fit=crop",
    "/utrecht/sport/pilates": IMAGES.sport,
    "/utrecht/sport/vechtsport": IMAGES.sport,
    "/utrecht/sport/zwemmen": "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=600&auto=format&fit=crop",
    "/utrecht/sport/sportvereniging": IMAGES.sport,
    "/utrecht/sport/spinning/fietsen": "https://images.unsplash.com/photo-1534853867591-1331d663e373?q=80&w=600&auto=format&fit=crop",

    // Klussen
    "/utrecht/klussen/loodgieter": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop",
    "/utrecht/klussen/elektricien": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
    "/utrecht/klussen/cv/verwarming": IMAGES.construction,
    "/utrecht/klussen/airco": IMAGES.construction,
    "/utrecht/klussen/timmerman": IMAGES.construction,
    "/utrecht/klussen/schilder": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    "/utrecht/klussen/stukadoor": IMAGES.construction,
    "/utrecht/klussen/vloeren": IMAGES.construction,
    "/utrecht/klussen/glaszetter": IMAGES.construction,
    "/utrecht/klussen/slotenmaker": "https://images.unsplash.com/photo-1558227691-41ea78d1f631?q=80&w=600&auto=format&fit=crop",
    "/utrecht/klussen/dakdekker": IMAGES.construction,
    "/utrecht/klussen/isolatie": IMAGES.construction,
    "/utrecht/klussen/allround klusbedrijf": IMAGES.construction,

    // Bouw
    "/utrecht/bouw-renovatie/aannemer": IMAGES.construction,
    "/utrecht/bouw-renovatie/woningrenovatie": IMAGES.construction,
    "/utrecht/bouw-renovatie/keuken": "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=600&auto=format&fit=crop",
    "/utrecht/bouw-renovatie/badkamer": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop",
    "/utrecht/bouw-renovatie/gevel": IMAGES.construction,
    "/utrecht/bouw-renovatie/steigerbouw": IMAGES.construction,
    "/utrecht/bouw-renovatie/architect": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop",
    "/utrecht/bouw-renovatie/ingenieur/advies": IMAGES.construction,
    "/utrecht/bouw-renovatie/vergunningen": IMAGES.business,

    // Schoonmaak
    "/utrecht/schoonmaak/schoonmaakbedrijf": IMAGES.cleaning,
    "/utrecht/schoonmaak/huishoudelijke hulp": IMAGES.cleaning,
    "/utrecht/schoonmaak/glazenwasser": IMAGES.cleaning,
    "/utrecht/schoonmaak/kantoor schoonmaak": IMAGES.cleaning,
    "/utrecht/schoonmaak/tapijt- & meubelreiniging": IMAGES.cleaning,
    "/utrecht/schoonmaak/ongediertebestrijding": IMAGES.cleaning,
    "/utrecht/schoonmaak/afval & opruimservice": IMAGES.cleaning,

    // Auto
    "/utrecht/auto-vervoer/autogarage": IMAGES.auto,
    "/utrecht/auto-vervoer/apk": IMAGES.auto,
    "/utrecht/auto-vervoer/bandenservice": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop",
    "/utrecht/auto-vervoer/carwash": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600&auto=format&fit=crop",
    "/utrecht/auto-vervoer/schadeherstel": IMAGES.auto,
    "/utrecht/auto-vervoer/autoverhuur": IMAGES.auto,
    "/utrecht/auto-vervoer/taxi": "https://images.unsplash.com/photo-1512402927289-543168868ba8?q=80&w=600&auto=format&fit=crop",
    "/utrecht/auto-vervoer/pechhulp": IMAGES.auto,
    "/utrecht/auto-vervoer/parkeren": IMAGES.auto,

    // Fiets
    "/utrecht/fiets/fietsenmaker": "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/fiets/e-bike service": "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/fiets/onderhoud & reparatie": "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/fiets/accessoires": "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=600&auto=format&fit=crop",
    "/utrecht/fiets/accu/oplader": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600&auto=format&fit=crop",
    "/utrecht/fiets/fietssloten": "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=600&auto=format&fit=crop",
    "/utrecht/fiets/mobiele service": "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/fiets/scooter (reparatie/onderhoud)": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop",

    // IT
    "/utrecht/it-tech/telefoonreparatie": IMAGES.tech,
    "/utrecht/it-tech/laptopreparatie": IMAGES.tech,
    "/utrecht/it-tech/computerhulp": IMAGES.tech,
    "/utrecht/it-tech/netwerk & wi‑fi": IMAGES.tech,
    "/utrecht/it-tech/cybersecurity": IMAGES.tech,
    "/utrecht/it-tech/webdesign": IMAGES.tech,
    "/utrecht/it-tech/softwareontwikkeling": IMAGES.tech,
    "/utrecht/it-tech/it-support": IMAGES.tech,
    "/utrecht/it-tech/cloud & data": IMAGES.tech,
    "/utrecht/it-tech/printerservice": IMAGES.tech,

    // Zakelijk
    "/utrecht/zakelijk/accountant": IMAGES.business,
    "/utrecht/zakelijk/boekhouder": IMAGES.business,
    "/utrecht/zakelijk/belastingadvies": IMAGES.business,
    "/utrecht/zakelijk/verzekeringen": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop",
    "/utrecht/zakelijk/bedrijfsadvies": IMAGES.business,
    "/utrecht/zakelijk/hr": IMAGES.business,
    "/utrecht/zakelijk/marketing/seo": IMAGES.business,
    "/utrecht/zakelijk/juridisch": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
    "/utrecht/zakelijk/notaris": "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=600&auto=format&fit=crop",
    "/utrecht/zakelijk/officiële vertaling": IMAGES.business,

    // Onderwijs
    "/utrecht/onderwijs/taalcursus": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/onderwijs/bijles": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
    "/utrecht/onderwijs/muziekles": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/onderwijs/rijschool": "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600&auto=format&fit=crop",
    "/utrecht/onderwijs/it-cursus": "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop",
    "/utrecht/onderwijs/coaching": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    "/utrecht/onderwijs/kinderactiviteiten": IMAGES.kids,
    "/utrecht/onderwijs/examentraining": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",

    // Kind
    "/utrecht/kind-gezin/kinderopvang": IMAGES.kids,
    "/utrecht/kind-gezin/gastouder": IMAGES.kids,
    "/utrecht/kind-gezin/babysitter": IMAGES.kids,
    "/utrecht/kind-gezin/kindercoach": IMAGES.kids,
    "/utrecht/kind-gezin/speelgroepen": IMAGES.kids,
    "/utrecht/kind-gezin/kinderfeestjes": IMAGES.kids,
    "/utrecht/kind-gezin/gezinscoaching": IMAGES.kids,

    // Huisdieren
    "/utrecht/huisdieren/dierenarts": IMAGES.pets,
    "/utrecht/huisdieren/trimsalon": IMAGES.pets,
    "/utrecht/huisdieren/dierenpension": IMAGES.pets,
    "/utrecht/huisdieren/hondentraining": IMAGES.pets,
    "/utrecht/huisdieren/dierenwinkel": IMAGES.pets,
    "/utrecht/huisdieren/vaccinatie & zorg": IMAGES.pets,

    // Wonen
    "/utrecht/wonen/makelaar": IMAGES.housing,
    "/utrecht/wonen/huur & koop": IMAGES.housing,
    "/utrecht/wonen/vastgoedbeheer": IMAGES.housing,
    "/utrecht/wonen/hypotheekadvies": IMAGES.housing,
    "/utrecht/wonen/taxatie": IMAGES.housing,
    "/utrecht/wonen/interieuradvies": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop",

    // Overnachten
    "/utrecht/overnachten/hotel": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
    "/utrecht/overnachten/hostel": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop",
    "/utrecht/overnachten/b&b": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop",
    "/utrecht/overnachten/short-stay": IMAGES.housing,
    "/utrecht/overnachten/appartementverhuur": IMAGES.housing,

    // Uitgaan
    "/utrecht/uitgaan/musea": "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=600&auto=format&fit=crop",
    "/utrecht/uitgaan/attracties": "https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=600&auto=format&fit=crop",
    "/utrecht/uitgaan/city tours": "https://images.unsplash.com/photo-1588667876887-f2735d468249?q=80&w=600&auto=format&fit=crop",
    "/utrecht/uitgaan/bioscoop": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    "/utrecht/uitgaan/evenementen": IMAGES.events,
    "/utrecht/uitgaan/escape room": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop",
    "/utrecht/uitgaan/activiteiten": IMAGES.events,

    // Bruiloft
    "/utrecht/bruiloft-events/trouwlocatie": IMAGES.events,
    "/utrecht/bruiloft-events/dj": IMAGES.events,
    "/utrecht/bruiloft-events/foto & video": IMAGES.events,
    "/utrecht/bruiloft-events/bloemen": "https://images.unsplash.com/photo-1525258946800-98cf74d15872?q=80&w=600&auto=format&fit=crop",
    "/utrecht/bruiloft-events/bruidsmode": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=600&auto=format&fit=crop",
    "/utrecht/bruiloft-events/catering": IMAGES.food,
    "/utrecht/bruiloft-events/taarten": "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/bruiloft-events/eventplanner": IMAGES.events,

    // Cultuur
    "/utrecht/cultuur/galerie": "https://images.unsplash.com/photo-1573588546598-a59e933e46c6?q=80&w=600&auto=format&fit=crop",
    "/utrecht/cultuur/kunstlessen": "https://images.unsplash.com/photo-1460661631741-dfa21d8d21c9?q=80&w=600&auto=format&fit=crop",
    "/utrecht/cultuur/theater": "https://images.unsplash.com/photo-1503095392269-275ff084081c?q=80&w=600&auto=format&fit=crop",
    "/utrecht/cultuur/muziek": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/cultuur/opnamestudio": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop",
    "/utrecht/cultuur/print & design": IMAGES.print,

    // Interieur
    "/utrecht/interieur/raamdecoratie": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
    "/utrecht/interieur/verlichting": "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=600&auto=format&fit=crop",
    "/utrecht/interieur/verf & behang": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    "/utrecht/interieur/meubels": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
    "/utrecht/interieur/keukens": "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=600&auto=format&fit=crop",
    "/utrecht/interieur/slaapkamer": "https://images.unsplash.com/photo-1505693416388-50808aae611d?q=80&w=600&auto=format&fit=crop",
    "/utrecht/interieur/decoratie": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop",

    // Logistiek
    "/utrecht/logistiek/koerierdienst": IMAGES.logistic,
    "/utrecht/logistiek/verhuisbedrijf": IMAGES.logistic,
    "/utrecht/logistiek/transport": IMAGES.logistic,
    "/utrecht/logistiek/opslag/warehouse": IMAGES.logistic,
    "/utrecht/logistiek/verpakken": IMAGES.logistic,

    // Juridisch
    "/utrecht/juridisch/advocaat": IMAGES.business,
    "/utrecht/juridisch/juridisch advies": IMAGES.business,
    "/utrecht/juridisch/mediation": IMAGES.business,
    "/utrecht/juridisch/immigratie": IMAGES.business,
    "/utrecht/juridisch/bedrijfsregistratie": IMAGES.business,
    "/utrecht/juridisch/administratiekantoor": IMAGES.business,

    // Financieel
    "/utrecht/financieel/financieel adviseur": IMAGES.business,
    "/utrecht/financieel/hypotheek": IMAGES.housing,
    "/utrecht/financieel/leningen": IMAGES.business,
    "/utrecht/financieel/verzekeringskantoor": IMAGES.business,
    "/utrecht/financieel/schuldhulp": IMAGES.business,
    "/utrecht/financieel/budgetcoaching": IMAGES.business,

    // Druk
    "/utrecht/druk-reclame/drukkerij": IMAGES.print,
    "/utrecht/druk-reclame/sign/letters": IMAGES.print,
    "/utrecht/druk-reclame/digital print": IMAGES.print,
    "/utrecht/druk-reclame/visitekaartjes": IMAGES.print,
    "/utrecht/druk-reclame/promotieartikelen": IMAGES.print,
    "/utrecht/druk-reclame/grafisch ontwerp": IMAGES.print,

    // Productie
    "/utrecht/productie/houtbewerking": "https://images.unsplash.com/photo-1601614946401-49727dc0f1ee?q=80&w=600&auto=format&fit=crop",
    "/utrecht/productie/metaalbewerking": IMAGES.construction,
    "/utrecht/productie/maatwerk": IMAGES.construction,
    "/utrecht/productie/industriële reparatie": IMAGES.construction,
    "/utrecht/productie/kunstwerkplaats": IMAGES.construction,

    // Duurzaam
    "/utrecht/duurzaam/zonnepanelen": "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop",
    "/utrecht/duurzaam/isolatie": IMAGES.construction,
    "/utrecht/duurzaam/warmtepomp": "https://images.unsplash.com/photo-1510563800743-aed236490d08?q=80&w=600&auto=format&fit=crop",
    "/utrecht/duurzaam/energieadvies": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop",
    "/utrecht/duurzaam/laadpaal ev": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600&auto=format&fit=crop",

    // Lokaal
    "/utrecht/lokaal/lokale producten": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop",
    "/utrecht/lokaal/buurtmarkten": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop",
    "/utrecht/lokaal/tuinieren": "https://images.unsplash.com/photo-1416879525881-1d639e5d3436?q=80&w=600&auto=format&fit=crop",
    "/utrecht/lokaal/gemeenschapsprojecten": "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&auto=format&fit=crop",

    // Gemeenschap
    "/utrecht/gemeenschap/verenigingen": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop",
    "/utrecht/gemeenschap/stichtingen": "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop",
    "/utrecht/gemeenschap/vrijwilligerswerk": "https://images.unsplash.com/photo-1559027615-cd1803d36cd0?q=80&w=600&auto=format&fit=crop",
    "/utrecht/gemeenschap/buurtcentra": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
    "/utrecht/gemeenschap/religieuze centra": "https://images.unsplash.com/photo-1548625361-b8d46dbb321a?q=80&w=600&auto=format&fit=crop",

    // Diensten
    "/utrecht/diensten/gemeente-informatie": IMAGES.business,
    "/utrecht/diensten/bibliotheken": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop",
    "/utrecht/diensten/publieke loketten": IMAGES.business,
    "/utrecht/diensten/consumentenadvies": IMAGES.business,
};

export const getSubcategoryImage = (categorySlug: string, subcategoryName: string): string => {
    // Normalize keys
    const cleanCategory = categorySlug.replace(/\/$/, '').toLowerCase();
    const cleanSub = subcategoryName.trim().toLowerCase();
    const key = `${cleanCategory}/${cleanSub}`;

    // 1. Try exact match
    if (subcategoryImages[key]) {
        return subcategoryImages[key];
    }

    // 2. Fallback to placeholder if still missing
    return `https://placehold.co/600x400/f3f4f6/4f46e5?text=${encodeURIComponent(cleanSub)}`;
};
