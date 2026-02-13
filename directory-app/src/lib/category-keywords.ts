// Category Keywords Data for Netherlands SEO
// Keywords are optimized for Dutch search queries

export interface CategoryKeywords {
  slug: string;
  name: string;
  primaryKeywords: string[];
  longTailKeywords: string[];
  relatedCategories: string[];
  cities: string[]; // Major cities to create city-specific pages
  contentSections: {
    intro: string;
    history: string;
    types: string;
    tips: string;
    local: string;
  };
}

export const CATEGORY_KEYWORDS: Record<string, CategoryKeywords> = {
  "eten-drinken": {
    slug: "eten-drinken",
    name: "Eten & Drinken",
    primaryKeywords: [
      "restaurant Utrecht",
      "eten en drinken Utrecht",
      "restaurants in Utrecht",
      "café Utrecht",
      "catering Utrecht",
      "afhaal Utrecht",
      "bezorgservice Utrecht"
    ],
    longTailKeywords: [
      "beste restaurant Utrecht centrum",
      "romantisch diner Utrecht",
      "restaurant met terras Utrecht",
      "veganistisch restaurant Utrecht",
      "biologisch restaurant Utrecht",
      "Iraans restaurant Utrecht",
      "Turks restaurant Utrecht",
      "Italiaans restaurant Utrecht",
      "Japans restaurant Utrecht",
      "chinees restaurant Utrecht",
      "restaurant aan de gracht Utrecht",
      "foodie Utrecht",
      "culinaire hotspots Utrecht",
      "Michelinsterren Utrecht"
    ],
    relatedCategories: ["winkels", "beauty", "sport"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "groningen", "maastricht"],
    contentSections: {
      intro: "Utrecht staat bekend als de culinaire parel van Nederland. De stad biedt een ongekende diversiteit aan eetgelegenheden, van gezellige bruine kroegen tot moderne ster-restaurants. Of je nu zin hebt in een klassiek Nederlands stamppot, verfijnde Franse cuisine of exotische smaken uit alle werelddelen, Utrecht heeft het allemaal.",
      history: "De Utrechtse horeca heeft een rijke geschiedenis die teruggaat tot de middeleeuwen. De grachten waren ooit de belangrijkste handelsroutes waar kooplieden uit heel Europa hun ingrediënten brachten. Deze internationale invloed is nog steeds zichtbaar in het diverse restaurantlandschap van vandaag.",
      types: "Utrecht kent verschillende soorten eetgelegenheden. Van fine dining restaurants met Michelin-sterren tot informele lunchrooms en gezellige koffiebars. De stad is ook bekend om zijn bruine kroegen, waar je kunt genieten van een goed biertje en een simpele maar smakelijke maaltijd. Vegetarische en veganistische opties zijn volop beschikbaar.",
      tips: "Reserveren is aanbevolen voor restaurants in het weekend. Veel restaurants bieden voordelige lunchmenu's. De beste wijk voor restaurants is de binnenstad rondom de Oudegracht. Check ook eens de horeca in de Twijnstraat en de Nicolaasstraat.",
      local: "Lokale specialiteiten in Utrecht zijn onder andere de Utrechtse uitsmijter en verse kaas uit de regio. De stad heeft ook een bloeiende koffiecultuur met diverse specialty coffee bars."
    }
  },

  "winkels": {
    slug: "winkels",
    name: "Winkels & Retail",
    primaryKeywords: [
      "winkels Utrecht",
      "winkelcentrum Utrecht",
      "winkelen Utrecht",
      "winkels in Utrecht",
      "koopzondag Utrecht",
      "winkelstraat Utrecht",
      "warenhuis Utrecht"
    ],
    longTailKeywords: [
      "beste winkels Utrecht centrum",
      "modewinkels Utrecht",
      "cadeauwinkels Utrecht",
      "antiek winkels Utrecht",
      "design winkels Utrecht",
      "boekenwinkel Utrecht",
      "winkelstraat Utrecht Oudegracht",
      "koopzondag winkels Utrecht",
      "duurzame winkels Utrecht"
    ],
    relatedCategories: ["interieur", "kleding", "beauty"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "maastricht", "leiden", "delft"],
    contentSections: {
      intro: "Utrecht is een paradijs voor shoppers. De stad heeft een gevarieerd winkelaanbod dat varieert van grote winkelcentra tot gezellige boetiekjes en karakteristieke markten. Of je nu op zoek bent naar de laatste modetrends, ambachtelijke producten of unique items, je vindt het allemaal in Utrecht.",
      history: "Handel heeft altijd een belangrijke rol gespeeld in Utrecht. Vanwege de centrale ligging aan de handelsroutes groeide de stad uit tot een belangrijk handelscentrum. De historische winkelpanden in het centrum getuigen nog steeds van deze rijke handelsgeschiedenis.",
      types: "Het winkelaanbod in Utrecht is zeer divers. Je vindt er grote warenhuis zoals De Bijenkorf, moderne winkelcentra zoals Hoog Catharijne, maar ook talloze kleine boetiekjes in de Steenweg en de Twijnstraat. Er zijn ook gespecialiseerde winkels voor antiek, design en ambachtelijke producten.",
      tips: "De beste winkeltijd is op zaterdag wanneer alle winkels geopend zijn. Maak ook gebruik van de koopzondagen die regelmatig gehouden worden. Parkeren kan goedkoop bij P+R locaties aan de rand van de stad.",
      local: "Lokale markten zijn een must-visit. De Jaarbeursplein markt op zaterdag en de biologische markt op de Oudegracht zijn erg populair. Voor unieke items zijn de winkels in de Twijnstraat en de Nicolaasstraat zeker een bezoek waard."
    }
  },

  "beauty": {
    slug: "beauty",
    name: "Beauty & Kappers",
    primaryKeywords: [
      "kapper Utrecht",
      "kapsalon Utrecht",
      "schoonheidssalon Utrecht",
      "nagelstudio Utrecht",
      "beauty salon Utrecht",
      "make-up Utrecht",
      "barbershop Utrecht"
    ],
    longTailKeywords: [
      "beste kapper Utrecht",
      "dames kapper Utrecht",
      "heren kapper Utrecht",
      "goedkope kapper Utrecht",
      "luxe kapsalon Utrecht",
      "nagelstudio Utrecht centrum",
      "schoonheidsbehandeling Utrecht",
      "bruidskapsels Utrecht",
      "permanent Utrecht",
      "hair botox Utrecht"
    ],
    relatedCategories: ["gezondheid", "winkels", "bruiloft-events"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "tilburg", "nijmegen"],
    contentSections: {
      intro: "Utrecht heeft een bloeiende beautysector met talrijke kapsalons, schoonheidssalons en gespecialiseerde studios. Of je nu een simpele knipbeurt wilt of een complete make-over, je vindt er professionele diensten voor elke behoefte.",
      history: "De kappersbranche in Nederland heeft zich ontwikkeld van eenvoudige kapperszaakjes tot moderne beautycentra. In Utrecht zijn er al generaties lang kapsalons gevestigd, waar ambachtelijke technieken worden gecombineerd met moderne trends.",
      types: "Van klassieke kapsalons tot trendy barbershops en luxe schoonheidsklinieken. Er zijn ook gespecialiseerde studios voor nagelstyling, wimper-extensions en permanente make-up. Voor elke beauty-behoefte is er een gespecialiseerde professional in Utrecht.",
      tips: "Boek je afspraak tijdig, vooral in het weekend en rond feestdagen. Veel salons bieden kortingen op doordeweekse dagen. Vraag ook naar pakketdeals als je meerdere behandelingen wilt combineren.",
      local: "Utrechtse kappers staan bekend om hun vakmanschap en oog voor detail. De stad heeft ook veelzijdig aanbod van betaalbare opties tot luxe beauty-salons."
    }
  },

  "gezondheid": {
    slug: "gezondheid",
    name: "Gezondheid & Zorg",
    primaryKeywords: [
      "huisarts Utrecht",
      "tandarts Utrecht",
      "fysiotherapie Utrecht",
      "ziekenhuis Utrecht",
      "apotheek Utrecht",
      "zorg Utrecht",
      "gezondheidszorg Utrecht"
    ],
    longTailKeywords: [
      "huisartspraktijk Utrecht centrum",
      "tandarts met spoed Utrecht",
      "fysiotherapeut Utrecht",
      "psycholoog Utrecht",
      "diëtist Utrecht",
      "klinieken Utrecht",
      "eerste hulp Utrecht",
      "geestelijke gezondheidszorg Utrecht"
    ],
    relatedCategories: ["beauty", "sport", "financieel"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "groningen", "maastricht", "leiden"],
    contentSections: {
      intro: "Utrecht beschikt over een uitgebreid gezondheidszorgsysteem met ziekenhuizen, huisartsenpraktijken, tandartsen en diverse paramedische diensten. De stad is ook de thuisbasis van het UMC Utrecht, een van de grootste ziekenhuizen van Nederland.",
      history: "Utrecht heeft een lange traditie in gezondheidszorg. Het UMC Utrecht is uitgegroeid tot een belangrijk academisch ziekenhuis met internationale faam. De stad heeft ook talrijke historische zorginstellingen die nog steeds actief zijn.",
      types: "Het zorgaanbod omvat ziekenhuizen, huisartsenposten, tandartspraktijken, fysiotherapiepraktijken, psychologiepraktijken, diëtisten en alternatieve genezers. Er zijn ook gespecialiseerde klinieken voor specifieke aandoeningen.",
      tips: "Voor niet-urgente zorg kun je eerst bij je huisarts terecht. Maak gebruik van de online afspraken systemen die veel praktijken aanbieden. Voor spoed is er een huisartsenpost buiten kantooruren.",
      local: "Het UMC Utrecht is een belangrijk academisch ziekenhuis met expertise in complexe behandelingen. De stad heeft ook veel gezondheidscentra waar verschillende zorgverleners samenwerken."
    }
  },

  "sport": {
    slug: "sport",
    name: "Sport & Fitness",
    primaryKeywords: [
      "sportschool Utrecht",
      "fitness Utrecht",
      "yoga Utrecht",
      "sport Utrecht",
      "gym Utrecht",
      "personal trainer Utrecht",
      "zwembad Utrecht"
    ],
    longTailKeywords: [
      "beste sportschool Utrecht",
      "24/7 fitness Utrecht",
      "yoga les Utrecht",
      "personal trainer Utrecht",
      "crossfit Utrecht",
      "zwembad Utrecht",
      "sportschool met zwembad Utrecht",
      "goedkope sportschool Utrecht"
    ],
    relatedCategories: ["gezondheid", "onderwijs", "winkels"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "utrecht", "zwolle"],
    contentSections: {
      intro: "Utrecht is een sportieve stad met talrijke sportscholen, fitnesscentra en sportfaciliteiten. Of je nu wilt afvallen, spieren opbouwen of ontspannen met yoga, er is voor elk wat wils.",
      history: "Sport en beweging hebben altijd een belangrijke rol gespeeld in de Nederlandse cultuur. Fietsen is de nationale sport, en Utrecht is een van de fietsvriendelijkste steden ter wereld. De stad heeft ook een rijke geschiedenis in team sporten.",
      types: "Van grote fitnessketens tot boutique fitness studios. Er zijn speciale studios voor yoga, pilates, crossfit en vechtsporten. Ook zijn er openbare zwembaden, sportvelden en atletiekbanen beschikbaar.",
      tips: "Veel sportscholen bieden een gratis proefles. Kijk ook naar de mogelijkheden voor groepslessen die vaak bij het abonnement zijn inbegrepen. Personal training kan helpen om sneller je doelen te bereiken.",
      local: "Utrecht heeft een actieve hardloopcommunity en veel mooie routes langs de grachten en door de parken. Deelfietsen zijn een populaire manier om de stad te verkennen."
    }
  },

  "klussen": {
    slug: "klussen",
    name: "Klussen, Reparatie & Onderhoud",
    primaryKeywords: [
      "loodgieter Utrecht",
      "elektricien Utrecht",
      "klusbedrijf Utrecht",
      "timmerman Utrecht",
      "schilder Utrecht",
      "cv monteur Utrecht",
      "klussen Utrecht"
    ],
    longTailKeywords: [
      "noodloodgieter Utrecht",
      "cv reparatie Utrecht",
      "elektricien 24/7 Utrecht",
      "schilderwerk Utrecht",
      "badkamer verbouwing Utrecht",
      "keuken montage Utrecht",
      "dakdekker Utrecht",
      "isolatie Utrecht"
    ],
    relatedCategories: ["bouw-renovatie", "schoonmaak", "auto-taxi-vervoer"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "almere", "zoetermeer", "hilversum"],
    contentSections: {
      intro: "Voor al je klus- en reparatiewerkzaamheden in en rondom het huis kun je in Utrecht terecht bij talrijke vakmensen. Van loodgieters tot elektriciens en timerlieden, de stad heeft een breed aanbod aan klusspecialisten.",
      history: "Amsterdam en Utrecht hebben een lange traditie van ambachtslieden. De historische panden in deze steden vereisen regelmatig onderhoud en renovatie, wat heeft geleid tot een bloeiende klussector.",
      types: "Het aanbod omvat loodgieters, elektriciens, timerlieden, schilders, stukadoors, glaszetters, slotenmakers en dakdekkers. Er zijn ook allround klusbedrijven die meerdere diensten aanbieden.",
      tips: "Vraag altijd om een offerte voordat je een klusser inschakelt. Controleer of de klusser gecertificeerd is en vraag naar referenties. Voor spoedreparaties zijn er 24/7 diensten beschikbaar.",
      local: "Veel Utrechtse klussers zijn gespecialiseerd in het werken met historische panden en kennen de specifieke uitdagingen van oude huizen."
    }
  },

  "bouw-renovatie": {
    slug: "bouw-renovatie",
    name: "Bouw & Renovatie",
    primaryKeywords: [
      "aannemer Utrecht",
      "bouwbedrijf Utrecht",
      "renovatie Utrecht",
      "verbouwing Utrecht",
      "architect Utrecht",
      "bouw Utrecht",
      "woningrenovatie Utrecht"
    ],
    longTailKeywords: [
      "beste aannemer Utrecht",
      "woning verbouwen Utrecht",
      "aanbouw Utrecht",
      "interieur bouw Utrecht",
      "badkamer renovatie Utrecht",
      "keuken renovatie Utrecht",
      "kosten verbouwing Utrecht"
    ],
    relatedCategories: ["klussen", "interieur", "vastgoed"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "leiden", "delft", "haarlem"],
    contentSections: {
      intro: "Utrecht en omgeving kennen een bloeiende bouwsector. Of je nu een nieuwe woning wilt bouwen, een verbouwing plant of je badkamer wilt renoveren, er zijn talrijke aannemers en bouwbedrijven die je kunnen helpen.",
      history: "De bouwsector in Utrecht heeft een rijke geschiedenis, vooral in de restauratie van historische panden. Veel bouwbedrijven zijn gespecialiseerd in het werken met oude bouwmaterialen en -technieken.",
      types: "Van grote aannemers tot gespecialiseerde renovatiebedrijven. Er zijn ook architecten, interieurontwerpers en projectontwikkelaars actief in de regio. Voor elke schaal van project is er een geschikte partner.",
      tips: "Laat meerdere offertes aanvragen voordat je een aannemer kiest. Controleer de referenties en bekijk eerdere projecten. Zorg voor een duidelijke contract met alle afspraken.",
      local: "Lokale aannemers kennen de specifieke regelgeving en vergunningseisen in Utrecht goed. Ze hebben ook vaak een netwerk van lokale onderaannemers."
    }
  },

  "schoonmaak": {
    slug: "schoonmaak",
    name: "Schoonmaak & Huishoudelijke diensten",
    primaryKeywords: [
      "schoonmaakbedrijf Utrecht",
      "schoonmaakster Utrecht",
      "huishoudelijke hulp Utrecht",
      "glazenwasser Utrecht",
      "kantoor schoonmaak Utrecht",
      "reiniging Utrecht",
      "parttime schoonmaak Utrecht"
    ],
    longTailKeywords: [
      "periodieke schoonmaak Utrecht",
      "schoonmaak na oplevering Utrecht",
      "kantoorschoonmaak Utrecht",
      "gevelreiniging Utrecht",
      "vloerreiniging Utrecht",
      "tapijtreiniging Utrecht",
      "goedkope schoonmaak Utrecht"
    ],
    relatedCategories: ["klussen", "vastgoed", "diensten"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "zoetermeer", "almere", "hilversum"],
    contentSections: {
      intro: "Voor een schoon en verzorgd huis of kantoor kun je in Utrecht terecht bij diverse schoonmaakbedrijven en particuliere schoonmakers. Van periodieke schoonmaak tot dieptereiniging en glasbewassing.",
      history: "De schoonmaakbranche is in Nederland sterk geprofessionaliseerd. Er zijnlandelijke ketens actief, maar ook veel lokale schoonmaakbedrijven die persoonlijke service bieden.",
      types: "Het aanbod omvat particuliere schoonmakers, schoonmaakbedrijven, gespecialiseerde reinigingsdiensten en glazenwassers. Er zijn ook diensten voor kantoorschoonmaak, gevelreiniging en vloeronderhoud.",
      tips: "Kijk naar de reviews en referenties van schoonmaakdiensten. Vraag naar het verzekeringsbewijs en of de medewerkers zijn gescreend. Voor regelmatige schoonmaak zijn er vaak voordelige abonnementsvormen.",
      local: "Lokale schoonmaakbedrijven kennen de wensen van klanten in de regio goed en bieden vaakflexibele service."
    }
  },

  "auto-taxi-vervoer": {
    slug: "auto-taxi-vervoer",
    name: "Auto, Taxi & Vervoer",
    primaryKeywords: [
      "autogarage Utrecht",
      "taxi Utrecht",
      "autoverhuur Utrecht",
      "carwash Utrecht",
      "APK Utrecht",
      "autoservice Utrecht",
      "vervoer Utrecht"
    ],
    longTailKeywords: [
      "beste garage Utrecht",
      "taxi Utrecht airport",
      "goedkope autoverhuur Utrecht",
      "carwash Utrecht centrum",
      "APK keuring Utrecht",
      "autoreparatie Utrecht",
      "pechhulp Utrecht"
    ],
    relatedCategories: ["fiets", "logistiek", "transport"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "schiphol", "eindhoven", "groningen"],
    contentSections: {
      intro: "Voor al je autogerelateerde zaken in Utrecht ben je aan het juiste adres. Van garages en carwashes tot taxidiensten en autoverhuur, de stad heeft een compleet aanbod aan voertuigdiensten.",
      history: "De auto-industrie in Nederland is sterk ontwikkeld. Utrecht, als centrale hub, heeft een lange traditie in autoservice en -onderhoud. Veel landelijke dealerketens hebben vestigingen in de stad.",
      types: "Het aanbod omvat autogarages, dealerbedrijven, carwashes, taxibedrijven, autoverhuurders en pechhulpdiensten. Er zijn ook gespecialiseerde services voor banden, accus en airco.",
      tips: "Vergelijk prijzen voor APK keuringen en reparaties. Veel garages bieden gratis APK checks. Voor taxivervoer naar Schiphol is reserveren aanbevolen.",
      local: "Lokale taxibedrijven kennen de beste routes en kunnen ook shuttlediensten aanbieden. Autoverhuurders hebben vaakflexibele huurvoorwaarden."
    }
  },

  "fiets": {
    slug: "fiets",
    name: "Fiets & Micromobiliteit",
    primaryKeywords: [
      "fietsenmaker Utrecht",
      "e-bike Utrecht",
      "fietswinkel Utrecht",
      "fietsreparatie Utrecht",
      "fietsverhuur Utrecht",
      "brommer Utrecht",
      "scooter Utrecht"
    ],
    longTailKeywords: [
      "beste fietsenmaker Utrecht",
      "e-bike kopen Utrecht",
      "fiets reparatie spoed Utrecht",
      "fietsverhuur Utrecht",
      "elektrische fiets Utrecht",
      "speed pedelec Utrecht",
      "fietsservice aan huis Utrecht"
    ],
    relatedCategories: ["auto-taxi-vervoer", "sport", "winkels"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "delft", "maastricht", "groningen"],
    contentSections: {
      intro: "Utrecht is de fietshoofdstad van Nederland en misschien wel de wereld. De stad heeft een bloeiende fietscultuur met talloze fietsenmakers, e-bike winkels en deelfietssystemen.",
      history: "Fietsen is al meer dan een eeuw de belangrijkste manier van vervoer in Nederland. Utrecht heeft de grootste fietsenstalling ter wereld en blijft investeren in fietsinfrastructuur.",
      types: "Van traditionele fietsenmakers tot moderne e-bike specialisten. Er zijn ook winkels voor brommers, scooters en andere vormen van micromobiliteit. Deelfietsen en e-scooters zijn volop beschikbaar.",
      tips: "Voor reparaties is het verstandig om vooraf een afspraak te maken. E-bikes vereisen regelmatig onderhoud. Koop een goede slot en verzekering voor je fiets.",
      local: "Utrecht heeft een uitgebreid netwerk van fietspaden en -straten. Deelfietsen van Donkey Republic zijn op veel plekken beschikbaar."
    }
  },

  "it-telefoon-tech": {
    slug: "it-telefoon-tech",
    name: "IT, Telefoon & Tech",
    primaryKeywords: [
      "computer reparatie Utrecht",
      "telefoon reparatie Utrecht",
      "IT support Utrecht",
      "webdesign Utrecht",
      "laptop reparatie Utrecht",
      "netwerk Utrecht",
      "tech winkel Utrecht"
    ],
    longTailKeywords: [
      "iPhone reparatie Utrecht",
      "laptop scherm reparatie Utrecht",
      "IT diensten Utrecht",
      "webdesign bureau Utrecht",
      "computerhulp aan huis Utrecht",
      "data recovery Utrecht",
      "wifi problemen Utrecht"
    ],
    relatedCategories: ["zakelijk", "winkels", "consulting"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "zwolle", "hilversum"],
    contentSections: {
      intro: "Utrecht is een belangrijk tech-centrum in Nederland met talrijke IT-bedrijven, reparatiewinkels en tech-dienstverleners. Van telefoonreparatie tot webdesign en IT-support.",
      history: "De tech-sector in Utrecht is sterk gegroeid de afgelopen decennia. De stad herbergt tech-startups en heeft een bloeiend ecosysteem voor innovatie en digitale diensten.",
      types: "Het aanbod omvat computer- en telefoonreparatie, IT-support, webdesign en -ontwikkeling, netwerkdiensten en cybersecurity. Er zijn ook gespecialiseerde dataherstel- en beveiligingsdiensten.",
      tips: "Voor reparaties is het verstandig om vooraf de prijs te vragen. IT-support op afstand kan vaak snel en goedkoop problemen oplossen. Regelmatige backups zijn essentieel.",
      local: "Lokale IT-bedrijven kennen de specifieke uitdagingen van bedrijven in de regio en bieden vaakpersoonlijke service."
    }
  },

  "zakelijk": {
    slug: "zakelijk",
    name: "Zakelijke diensten (B2B)",
    primaryKeywords: [
      "accountant Utrecht",
      "boekhouder Utrecht",
      "marketingbureau Utrecht",
      "juridisch advies Utrecht",
      "zakelijke diensten Utrecht",
      "HR diensten Utrecht",
      "bedrijfsadvies Utrecht"
    ],
    longTailKeywords: [
      "administratiekantoor Utrecht",
      "belastingadvies Utrecht",
      "marketing bureau Utrecht",
      "juridische hulp Utrecht",
      "HR consulting Utrecht",
      "startup adviseur Utrecht",
      "bedrijfsregistratie Utrecht"
    ],
    relatedCategories: ["juridisch", "financieel", "consulting"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "zwolle", "arnhem"],
    contentSections: {
      intro: "Utrecht biedt een breed scala aan zakelijke diensten voor ondernemers en bedrijven. Van accountants en juridisch adviseurs tot marketingbureaus en HR-consultants.",
      history: "Als één van de economische centra van Nederland heeft Utrecht een lange traditie in zakelijke dienstverlening. De stad herbergt het hoofdkantoor van veel grote bedrijven en overheidsinstellingen.",
      types: "Het aanbod omvat financiële diensten (accountancy, boekhouding, belastingadvies), juridische diensten, marketing en communicatie, HR en personeel, en strategisch bedrijfsadvies.",
      tips: "Kies een dienstverlener die past bij de fase van je bedrijf. Vraag om een vrijblijvende offerte en vergelijk prijzen. Een goede adviseur kan je helpen om kosten te besparen.",
      local: "Lokale adviseurs kennen de regionale economie en het ondernemersklimaat goed. Ze hebben ook vaak een netwerk van andere zakelijke dienstverleners."
    }
  },

  "onderwijs": {
    slug: "onderwijs",
    name: "Onderwijs & Cursussen",
    primaryKeywords: [
      "cursus Utrecht",
      "bijles Utrecht",
      "taalcursus Utrecht",
      "muziekles Utrecht",
      "rijschool Utrecht",
      "onderwijs Utrecht",
      "training Utrecht"
    ],
    longTailKeywords: [
      "Nederlandse les Utrecht",
      "Engelse cursus Utrecht",
      "bijles wiskunde Utrecht",
      "piano les Utrecht",
      "rijschool Utrecht",
      "IT cursus Utrecht",
      "kinderopvang met educatie Utrecht"
    ],
    relatedCategories: ["sport", "kunst", "zakelijk"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "leiden", "groningen", "maastricht"],
    contentSections: {
      intro: "Utrecht is een belangrijk onderwijscentrum met scholen, academies en talrijke cursusaanbieders. Van taallessen tot muziekles en van rijschool tot professionele training.",
      history: "Utrecht heeft één van de oudste universiteiten van Nederland, wat heeft bijgedragen aan een rijke onderwijstraditie. De stad is ook bekend om zijn talrijke gespecialiseerde onderwijsinstellingen.",
      types: "Het aanbod omvat basisonderwijs, voortgezet onderwijs, middelbaar beroepsonderwijs, universiteiten, maar ook talrijke particuliere cursusaanbieders voor taal, muziek, sport en professionele vaardigheden.",
      tips: "Voor taalcursussen zijn er subsidiemogelijkheden via het UWV of gemeentelijke regelingen. Vergelijk de prijzen van rijscholen en vraag naar slagingspercentages.",
      local: "De Universiteit Utrecht en Hogeschool Utrecht zijn grote werkgevers en opleidingscentra in de stad."
    }
  },

  "kind-gezin": {
    slug: "kind-gezin",
    name: "Kind & Gezin",
    primaryKeywords: [
      "kinderopvang Utrecht",
      "gastouder Utrecht",
      "babysitter Utrecht",
      "kindercoach Utrecht",
      "gezin Utrecht",
      "peuterspeelzaal Utrecht",
      "kinderactiviteiten Utrecht"
    ],
    longTailKeywords: [
      "goede kinderopvang Utrecht",
      "gastouder bureau Utrecht",
      "betrouwbare babysitter Utrecht",
      "kinderopvang met opvanguren Utrecht",
      "buitenschoolse opvang Utrecht",
      "kindermassage Utrecht",
      "gezinscoaching Utrecht"
    ],
    relatedCategories: ["onderwijs", "huisdieren", "winkels"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "amersfoort", "zoetermeer", "hilversum"],
    contentSections: {
      intro: "Utrecht biedt uitgebreide voorzieningen voor gezinnen met kinderen. Van kinderopvang en gastouderbureaus tot babysitters en kinderactiviteiten.",
      history: "Nederland heeft een uitgebreid systeem van kinderopvang en gezinsbegeleiding. Utrecht is koploper in innovatieve kindontwikkeling en gezinsondersteuning.",
      types: "Het aanbod omvat kinderdagverblijven, gastouderopvang, buitenschoolse opvang, gastouderbureaus, babysitters, kindertrainers en gezinscoaches. Er zijn ook gespecialiseerde therapeuten voor kinderen.",
      tips: "Wacht niet te lang met het aanvragen van kinderopvang in verband met wachtlijsten. Gastouderopvang kan een flexibeler alternatief zijn. Vraag naar de pedagogische aanpak.",
      local: "Utrecht heeft veel kindvriendelijke voorzieningen en activiteiten. De bibliotheek en musea organiseren regelmatig activiteiten voor kinderen."
    }
  },

  "huisdieren": {
    slug: "huisdieren",
    name: "Huisdieren",
    primaryKeywords: [
      "dierenarts Utrecht",
      "dierenwinkel Utrecht",
      "hondentraining Utrecht",
      "trimsalon Utrecht",
      "dierenpension Utrecht",
      "huisdier Utrecht",
      "dierenziekenhuis Utrecht"
    ],
    longTailKeywords: [
      "dierenarts 24/7 Utrecht",
      "hondentraining Utrecht",
      "trimsalon Utrecht",
      "dierenpension Utrecht",
      "hondenuitlaatservice Utrecht",
      "kattenpension Utrecht",
      "voedingsadvies huisdieren Utrecht"
    ],
    relatedCategories: ["kind-gezin", "winkels", "gezondheid"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "amersfoort", "zoetermeer", "leiden"],
    contentSections: {
      intro: "Voor al je huisdieren ben je in Utrecht aan het juiste adres. Van dierenartsen en trimsalons tot dierenwinkels en pensions, de stad heeft een compleet aanbod.",
      history: "De Nederlandse huisdiereconomie is sterk ontwikkeld. Utrecht herbergt enkele belangrijke dierenklinieken en academische veterinaire diensten.",
      types: "Het aanbod omvat dierenartsen (inclusief specialisten), trimsalons, dierenwinkels, pensions, hondenscholen, uitlaatservices en therapeuten voor huisdieren.",
      tips: "Kies een dierenarts bij je in de buurt voor noodgevallen. Reguliere vaccinaties en ontworming zijn belangrijk. Training kan gedragsproblemen voorkomen.",
      local: "Lokale dierenwinkels bieden vaak persoonlijk advies over voeding en verzorging. Er zijn ook veel hondenuitlaatgebieden in en rond Utrecht."
    }
  },

  "wonen": {
    slug: "wonen",
    name: "Wonen & Vastgoed",
    primaryKeywords: [
      "makelaar Utrecht",
      "woning Utrecht",
      "vastgoed Utrecht",
      "hypotheekadvies Utrecht",
      "huurwoning Utrecht",
      "koopwoning Utrecht",
      "taxatie Utrecht"
    ],
    longTailKeywords: [
      "beste makelaar Utrecht",
      "hypotheekadvies Utrecht",
      "woning taxatie Utrecht",
      "appartement kopen Utrecht",
      "huis huren Utrecht",
      "vastgoedbeheer Utrecht",
      "nieuwbouw Utrecht"
    ],
    relatedCategories: ["bouw-renovatie", "interieur", "financieel"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "amersfoort", "leiden", "delft"],
    contentSections: {
      intro: "De Utrechtse woningmarkt is dynamisch met talrijke makelaars, hypotheekadviseurs en vastgoedbeheerders. Of je nu wilt kopen, huren of verkopen, er is volop aanbod.",
      history: "De Utrechtse woningmarkt is al decennia in beweging. De stad groeit en ontwikkelt zich, met nieuwbouwprojecten en renovatie van bestaande wijken.",
      types: "Het aanbod omvat makelaars (koop en huur), hypotheekadviseurs, taxateurs, vastgoedbeheerders, projectontwikkelaars en interieuradviseurs. Er zijn ook gespecialiseerde bedrijven voor bedrijfsmatig vastgoed.",
      tips: "Werk met een gecertificeerde makelaar voor de beste resultaten. Vergelijk hypotheekadviseurs en let op de kosten. Een goede voorbereiding is essentieel bij het kopen van een woning.",
      local: "De Utrechtse woningmarkt is competitief. Lokale makelaars kennen de markt goed en kunnen helpen bij het vinden van geschikte woningen."
    }
  },

  "overnachten": {
    slug: "overnachten",
    name: "Overnachten",
    primaryKeywords: [
      "hotel Utrecht",
      "B&B Utrecht",
      "hostel Utrecht",
      "appartment huren Utrecht",
      "overnachting Utrecht",
      "accommodatie Utrecht",
      "boeken Utrecht"
    ],
    longTailKeywords: [
      "beste hotel Utrecht",
      "goedkope hotel Utrecht",
      "B&B Utrecht centrum",
      "hostel Utrecht",
      "appartment overnachten Utrecht",
      "luxe hotel Utrecht",
      "hotel met parkeren Utrecht"
    ],
    relatedCategories: ["uitgaan", "reizen", "restaurants"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "maastricht", "groningen", "eindhoven"],
    contentSections: {
      intro: "Utrecht heeft een uitgebreid aanbod aan accommodaties vanbudget hostels tot luxe hotels. Of je nu zakelijk reist of voor plezier, er is voor elk wat wils.",
      history: "De hotellerie in Utrecht heeft een lange geschiedenis, met verschillende historische hotels in het centrum. De stad is een belangrijke bestemming voor zakenreizigers en toeristen.",
      types: "Het aanbod omvat luxe hotels, business hotels, budget hotels, B&B's, hostels, vakantieappartementen en short-stay woningen. Er zijn ook accommodaties aan de rand van de stad met gratis parkeren.",
      tips: "Boek tijdig voor populaire periodes zoals Kerst en Koningsdag. Veel hotels bieden last-minute deals op doordeweekse dagen. Check de reviews op verschillende platforms.",
      local: "Lokale B&B's bieden vaak een persoonlijke ervaring en tips voor het ontdekken van Utrecht."
    }
  },

  "uitgaan": {
    slug: "uitgaan",
    name: "Uitgaan, Vrije tijd & Toerisme",
    primaryKeywords: [
      "uitgaan Utrecht",
      "musea Utrecht",
      "bioscoop Utrecht",
      "evenementen Utrecht",
      "toerisme Utrecht",
      "activiteiten Utrecht",
      "city tour Utrecht"
    ],
    longTailKeywords: [
      "musea in Utrecht",
      "bioscoop Utrecht",
      "concerten Utrecht",
      "evenementenkalender Utrecht",
      "city tour Utrecht",
      "leuke activiteiten Utrecht",
      "nachtleven Utrecht"
    ],
    relatedCategories: ["overnachten", "kunst", "bruiloft-events"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "maastricht", "groningen", "eindhoven"],
    contentSections: {
      intro: "Utrecht bruist van cultuur en vermaak. De stad heeft talrijke musea, theaters, bioscopen en een bruisend nachtleven. Of je nu van kunst, muziek of festivals houdt, er is altijd iets te beleven.",
      history: "Utrecht heeft een rijke culturele geschiedenis. De Dom, de grachten en de historische binnenstad zijn populair bij toeristen van over de hele wereld. De stad organiseert jaarlijks verschillende grote evenementen.",
      types: "Het aanbod omvat musea (Rijksmuseum, Centraal Museum), theaters, bioscopen, concertzalen, clubs, bars, festivals en toeristische attracties. Er zijn ook rondvaarten en fietstours.",
      tips: "Koop tickets online voor populaire evenementen om wachtrijen te vermijden. Veel musea hebben gratis toegang op bepaalde dagen. De Domtoren is een must-visit.",
      local: "Lokale evenementen zoals Koningsdag en het UIT-festival zijn hoogtepunten. De grachten zijn prachtig om per boot te verkennen."
    }
  },

  "bruiloft-events": {
    slug: "bruiloft-events",
    name: "Bruiloft & Events",
    primaryKeywords: [
      "bruiloft Utrecht",
      "trouwlocatie Utrecht",
      "bruidsfotograaf Utrecht",
      "catering bruiloft Utrecht",
      "eventplanner Utrecht",
      "bruidsjurk Utrecht",
      "wedding planner Utrecht"
    ],
    longTailKeywords: [
      "trouwlocatie Utrecht",
      "buiten bruiloft Utrecht",
      "bruidsfotograaf Utrecht",
      "bruiloft catering Utrecht",
      "wedding planner Utrecht",
      "bruidsmake-up Utrecht",
      "huwelijkslocatie Utrecht"
    ],
    relatedCategories: ["overnachten", "kunst", "catering"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "maastricht", "leiden", "delft"],
    contentSections: {
      intro: "Utrecht is een populaire bestemming voor bruiloften en evenementen. De stad biedt prachtige locaties, professionele wedding planners en talrijke dienstverleners voor je grote dag.",
      history: "De romantische grachten en historische gebouwen maken Utrecht tot een ideale locatie voor bruiloften. Veel stellen kiezen voor een ceremonie aan het water of in een historisch pand.",
      types: "Het aanbod omvat trouwlocaties (hotels, restaurants, boten), wedding planners, fotografen, bloemisten, cateraars, muzikanten, DJ's, bruidskleding en make-up artiesten. Er zijn ook gespecialiseerde bedrijven voor bedrijfsevenementen.",
      tips: "Boek je locatie en dienstverleners tijdig, vooral voor het hoogseizoen. Vergelijk offertes en vraag naar referenties. Een wedding planner kan veel stress besparen.",
      local: "Lokale leveranciers kennen de beste fotolocaties in Utrecht en kunnen helpen met het plannen van een onvergetelijke dag."
    }
  },

  "kunst": {
    slug: "kunst",
    name: "Kunst, Media & Cultuur",
    primaryKeywords: [
      "galerie Utrecht",
      "kunst Utrecht",
      "theater Utrecht",
      "muziek Utrecht",
      "cultuur Utrecht",
      "kunstenaar Utrecht",
      "atelier Utrecht"
    ],
    longTailKeywords: [
      "kunstgalerie Utrecht",
      "moderne kunst Utrecht",
      "theater Utrecht",
      "muziekschool Utrecht",
      "kunstles Utrecht",
      "opnamestudio Utrecht",
      "straatkunst Utrecht"
    ],
    relatedCategories: ["kunst", "interieur", "onderwijs"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "maastricht", "groningen", "eindhoven"],
    contentSections: {
      intro: "Utrecht bruist van kunst en cultuur. De stad heeft een bloeiende kunstscene met talrijke galleries, theaters en muziekvenues. Van klassieke schilderkunst tot moderne installaties.",
      history: "Utrecht heeft een rijke kunstgeschiedenis. De Utrechtse School van schilderkunst is wereldwijd bekend, en de stad herbergt belangrijke kunstmusea en culturele instellingen.",
      types: "Het aanbod omvat kunstgaleries, theaters, concertzalen, muziekscholen, kunstacademies, opnamestudio's en media bedrijven. Er zijn ook openbare kunstwerken en street art.",
      tips: "Bezoek de gratis galleries in het centrum op zaterdag wanneer veel galleries open zijn met exposities. Theater en concert kaarten zijn vaak vroeg uitverkocht.",
      local: "Het Centraal Museum en De Fundatie zijn must-visits voor kunstliefhebbers. De stad heeft ook een levendige street art scene."
    }
  },

  "interieur": {
    slug: "interieur",
    name: "Interieur & Woondecoratie",
    primaryKeywords: [
      "interieur Utrecht",
      "woonwinkel Utrecht",
      "meubels Utrecht",
      "woondecoratie Utrecht",
      "interieurontwerp Utrecht",
      "keuken Utrecht",
      "badkamer Utrecht"
    ],
    longTailKeywords: [
      "interieurontwerp Utrecht",
      "woonwinkel Utrecht",
      "meubelzaak Utrecht",
      "keuken showrooms Utrecht",
      "badkamer design Utrecht",
      "verlichting Utrecht",
      "raamdecoratie Utrecht"
    ],
    relatedCategories: ["winkels", "bouw-renovatie", "wonen"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "leiden", "delft", "zoetermeer"],
    contentSections: {
      intro: "Utrecht heeft een uitgebreid aanbod aan interieurwinkels en design studios. Van meubels en verlichting tot raamdecoratie en behang, je vindt er alles voor je droominterieur.",
      history: "Nederlands design heeft internationale faam, en Utrecht is een centrum voor innovatief interieurontwerp. De stad herbergt zowel grote meubelketens als kleinschalige design studios.",
      types: "Het aanbod omvat meubelwinkels, woonwinkels, interieurontwerpers, keuken- en badkamer showrooms, verlichtingswinkels, textiel winkels en behangzaken. Er zijn ook tweedehands meubelwinkels.",
      tips: "Bezoek verschillende showrooms om inspiratie op te doen. Laat je inspireren door de verschillende stijlen en vraag om advies bij het kiezen. Vergeet de verlichting niet.",
      local: "De binnenstad heeft leuke concept stores met unieke items. De grote meubelboulevards aan de rand van de stad bieden meer keuze en lagere prijzen."
    }
  },

  "logistiek": {
    slug: "logistiek",
    name: "Koerier, Verhuizen & Logistiek",
    primaryKeywords: [
      "verhuisbedrijf Utrecht",
      "koerier Utrecht",
      "transport Utrecht",
      "opslag Utrecht",
      "verhuisservice Utrecht",
      "logistiek Utrecht",
      "verpakking Utrecht"
    ],
    longTailKeywords: [
      "goedkoop verhuisbedrijf Utrecht",
      "internationale verhuizing Utrecht",
      "koeriersdienst Utrecht",
      "opslagruimte Utrecht",
      "verpakking verhuizing Utrecht",
      "zakelijke transport Utrecht"
    ],
    relatedCategories: ["auto-taxi-vervoer", "transport", "zakelijk"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "zwolle", "arnhem"],
    contentSections: {
      intro: "Voor al je verhuis- en transportbehoeften kun je in Utrecht terecht bij talrijke verhuisbedrijven en koeriersdiensten. Van particuliere verhuizingen tot zakelijke logistiek.",
      history: "Door de centrale ligging van Utrecht is de stad een belangrijk knooppunt voor transport en logistiek. Veel landelijke transportbedrijven hebben hier hun hoofdkantoor.",
      types: "Het aanbod omvat verhuisbedrijven, koeriersdiensten, transportbedrijven, opslagfaciliteiten, verpakkingsmateriaal winkels en logistieke dienstverleners. Er zijn ook gespecialiseerde bedrijven voor verhuizingen naar het buitenland.",
      tips: "Vraag tijdig offertes aan voor verhuizingen, vooral in de zomermaanden. Vergelijk prijzen en let op wat wel en niet is inbegrepen. Een goede voorbereiding bespaart kosten.",
      local: "Lokale verhuizers kennen de straten en parkeermogelijkheden in Utrecht goed, wat het verhuisproces soepeler maakt."
    }
  },

  "juridisch": {
    slug: "juridisch",
    name: "Juridisch & Administratief",
    primaryKeywords: [
      "advocaat Utrecht",
      "juridisch advies Utrecht",
      "notaris Utrecht",
      "administratiekantoor Utrecht",
      "juridische hulp Utrecht",
      "mediation Utrecht",
      "immigratie Utrecht"
    ],
    longTailKeywords: [
      "arbeidsrecht advocaat Utrecht",
      "familierecht advocaat Utrecht",
      "notaris Utrecht",
      "administratiekantoor Utrecht",
      "juridische hulp ondernemers Utrecht",
      "immigratie advies Utrecht",
      "contract opstellen Utrecht"
    ],
    relatedCategories: ["zakelijk", "financieel", "overheid"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "leiden", "maastricht", "arnhem"],
    contentSections: {
      intro: "Utrecht biedt een breed scala aan juridische diensten van advocaten en notarissen tot administratiekantoren. Voor al je juridische en administratieve vragen ben je hier aan het juiste adres.",
      history: "Als stad met een belangrijke rechtbank en universiteit heeft Utrecht een sterke traditie in juridische dienstverlening. Veel grote Advocatenkantoren hebben hier vestigingen.",
      types: "Het aanbod omvat Advocaten (gespecialiseerd in verschillende rechtsgebieden), notarissen, administratiekantoren, mediators, immigratieadviseurs en juridische loketten. Er zijn ook gespecialiseerde bedrijven voor ondernemers.",
      tips: "Kies een specialist die past bij je specifieke vraag. Vraag vooraf naar de kosten en eventuele vergoedingen via rechtsbijstandverzekering. Een eerste gesprek is vaak gratis.",
      local: "Lokale juridische dienstverleners kennen de regionale wet- en regelgeving goed en hebben vaak korte lijnen met de rechtbank en overheidsinstanties."
    }
  },

  "financieel": {
    slug: "financieel",
    name: "Financieel & Verzekeren",
    primaryKeywords: [
      "financieel adviseur Utrecht",
      "hypotheek Utrecht",
      "verzekering Utrecht",
      "bank Utrecht",
      "investeringen Utrecht",
      "lening Utrecht",
      "financieel advies Utrecht"
    ],
    longTailKeywords: [
      "hypotheekadvies Utrecht",
      "onafhankelijk financieel adviseur Utrecht",
      "verzekering vergelijken Utrecht",
      "investeringsadvies Utrecht",
      "lening aanvragen Utrecht",
      "pensioenadvies Utrecht",
      "schuldhulp Utrecht"
    ],
    relatedCategories: ["wonen", "zakelijk", "juridisch"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "groningen", "maastricht"],
    contentSections: {
      intro: "Utrecht heeft een uitgebreid financieel dienstverleningslandschap met banken, verzekeraars en onafhankelijke adviseurs. Van hypotheekadvies tot vermogensbeheer.",
      history: "Nederland heeft een sterke financiële sector, en Utrecht herbergt het hoofdkantoor van verschillende banken en verzekeraars. De stad is ook een centrum voor fintech innovatie.",
      types: "Het aanbod omvat banken, verzekeraars, hypotheekadviseurs, onafhankelijke financieel adviseurs, pensioenadviseurs, investeringsmaatschappijen en schuldhulpverleners. Er zijn ook gespecialiseerde adviseurs voor ondernemers.",
      tips: "Vergelijk altijd meerdere adviseurs voordat je een keuze maakt. Let op de kosten en wat wel en niet is inbegrepen. Onafhankelijke adviseurs kunnen objectief adviseren.",
      local: "Lokale adviseurs kennen de regionale woningmarkt goed en kunnen helpen met het vinden van de beste hypotheekvoorwaarden."
    }
  },

  "drukwerk-reclame": {
    slug: "drukwerk-reclame",
    name: "Drukwerk & Reclame",
    primaryKeywords: [
      "drukkerij Utrecht",
      "reclamebureau Utrecht",
      "grafisch ontwerp Utrecht",
      "drukwerk Utrecht",
      "visitekaartjes Utrecht",
      "reclame Utrecht",
      "print Utrecht"
    ],
    longTailKeywords: [
      "drukkerij Utrecht centrum",
      "groot formaat druk Utrecht",
      "reclamebureau Utrecht",
      "grafisch ontwerp Utrecht",
      "flyers drukken Utrecht",
      "banner drukken Utrecht",
      "promotiemateriaal Utrecht"
    ],
    relatedCategories: ["zakelijk", "kunst", "marketing"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "zwolle", "hilversum"],
    contentSections: {
      intro: "Voor al je drukwerk en reclamebehoeften ben je in Utrecht aan het juiste adres. Van visitekaartjes tot groot formaat banners en complete reclamecampagnes.",
      history: "De Nederlandse grafische industrie heeft een lange traditie. Utrecht herbergt zowel traditionele drukkerijen als moderne digitale drukkers.",
      types: "Het aanbod omvat drukkerijen (offset en digitaal), reclamebureaus, grafisch ontwerpers, zeefdrukkers, signmakers en promotiemateriaal leveranciers. Er zijn ook gespecialiseerde bedrijven voor verpakkingsdruk.",
      tips: "Vraag monsters op van verschillende drukkers om de kwaliteit te vergelijken. Digitale drukkers zijn vaak goedkoper voor kleine oplages. Let op de levertijden.",
      local: "Lokale drukkers kunnen vaak snel leveren en bieden persoonlijke service. Ze kennen ook de beste papierleveranciers."
    }
  },

  "productie": {
    slug: "productie",
    name: "Productie, Werkplaats & Maatwerk",
    primaryKeywords: [
      "werkplaats Utrecht",
      "maatwerk Utrecht",
      "metaalbewerking Utrecht",
      "houtbewerking Utrecht",
      "prototypen Utrecht",
      "productie Utrecht",
      "fabriek Utrecht"
    ],
    longTailKeywords: [
      " CNC frezen Utrecht",
      "metaal bewerking Utrecht",
      "houtwerkplaats Utrecht",
                      "maatwerk meubels Utrecht",
      "prototypen maken Utrecht",
      "industriële productie Utrecht",
      "laser snijden Utrecht"
    ],
    relatedCategories: ["bouw-renovatie", "auto-taxi-vervoer", "zakelijk"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "zwolle", "arnhem"],
    contentSections: {
      intro: "Utrecht en omgeving hebben een bloeiende maakindustrie met talrijke werkplaatsen en productiebedrijven. Van houtbewerking tot metaal en van prototypen tot serieproductie.",
      history: "Nederland heeft een sterke maaktraditie. Utrecht herbergt zowel ambachtelijke werkplaatsen als moderne industriële productiebedrijven.",
      types: "Het aanbod omvat metaalbewerkingsbedrijven, houtbewerkingsateliers, CNC-bewerking, laswerkplaatsen, prototypebouwers en serieproductiebedrijven. Er zijn ook gespecialiseerde bedrijven voor kunst- en designproductie.",
      tips: "Vraag naar de mogelijkheden voor prototyping voordat je aan serieproductie begint. Vergelijk prijzen voor verschillende productiemethoden. Kwaliteit en levertijd zijn belangrijk.",
      local: "Lokale werkplaatsen bieden vaakflexibele service en kunnen snel schakelen. Ze hebben ook vaak een netwerk van toeleveranciers."
    }
  },

  "duurzaam": {
    slug: "duurzaam",
    name: "Duurzaam & Energie",
    primaryKeywords: [
      "zonnepanelen Utrecht",
      "energieadvies Utrecht",
      "isolatie Utrecht",
      "warmtepomp Utrecht",
      "duurzaam Utrecht",
      "energiebesparing Utrecht",
      "groene energie Utrecht"
    ],
    longTailKeywords: [
      "zonnepanelen installeren Utrecht",
      "warmtepomp Utrecht",
      "spouwmuurisolatie Utrecht",
      "energieadvies huiseigenaren Utrecht",
      "laadpaal elektrisch Utrecht",
      "duurzame verbouwing Utrecht",
      "energiebesparende maatregelen Utrecht"
    ],
    relatedCategories: ["bouw-renovatie", "klussen", "wonen"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "groningen", "leiden"],
    contentSections: {
      intro: "Duurzaamheid wordt steeds belangrijker, en Utrecht is koploper in groene energie. Van zonnepanelen tot isolatie en van warmtepompen tot laadpalen, er zijn talrijke specialisten.",
      history: "Nederland is een koploper in duurzame energie, en Utrecht loopt voorop in energiebesparing. De stad heeft ambitieuze plannen om CO2-neutraal te worden.",
      types: "Het aanbod omvat zonnepanelen leveranciers, isolatiebedrijven, warmtepomp specialisten, energieadviseurs, laadpaal installateurs en duurzame bouwbedrijven. Er zijn ook subsidiemogelijkheden beschikbaar.",
      tips: "Laat eerst een energieadvies uitvoeren om te zien waar de grootste besparingen mogelijk zijn. Er zijn landelijke en regionale subsidies beschikbaar voor duurzame maatregelen. Vergelijk offertes.",
      local: "Lokale installateurs kennen de specifieke uitdagingen van woningen in Utrecht en kunnen adviseren over de beste oplossingen."
    }
  },

  "lokaal": {
    slug: "lokaal",
    name: "Lokaal & Buurtinitiatieven",
    primaryKeywords: [
      "buurtmarkten Utrecht",
      "lokaal Utrecht",
      "buurtinitiatief Utrecht",
      "gemeenschap Utrecht",
      "buurtvereniging Utrecht",
      "lokale producten Utrecht",
      "duurzaam Utrecht"
    ],
    longTailKeywords: [
      "weekmarkt Utrecht",
      "boerenmarkt Utrecht",
      "buurtbarbecue Utrecht",
      "lokaal initiatief Utrecht",
      "burgerinitiatief Utrecht",
      "gemeenschapsproject Utrecht"
    ],
    relatedCategories: ["gemeenschap", "eten-drinken", "winkels"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "groningen", "maastricht", "eindhoven"],
    contentSections: {
      intro: "Utrecht kent een rijk verenigingsleven met talrijke buurtinitiatieven en lokale markten. Van weekmarkten tot buurtbarbecues en van verenigingen tot gemeenschapsprojecten.",
      history: "Nederland heeft een sterke traditie van verenigingsleven en burgerinitiatieven. Utrecht is koploper in burgerparticipatie en lokale ontwikkeling.",
      types: "Het aanbod omvat buurtmarkten, verenigingen, stichtingen, gemeenschapscentra, lokale ondernemersverenigingen en burgerinitiatieven. Er zijn ook subsidies beschikbaar voor lokale projecten.",
      tips: "Bezoek de lokale markten om de sfeer te proeven en lokale producten te ontdekken. Word lid van een vereniging om deel te nemen aan activiteiten. Veel initiatieven zoeken vrijwilligers.",
      local: "De verschillende wijken in Utrecht hebben elk hun eigen karakter en initiatieven. Van de gezellige Oudegracht tot de bruisende Lombok."
    }
  },

  "gemeenschap": {
    slug: "gemeenschap",
    name: "Gemeenschap & Sociale organisaties",
    primaryKeywords: [
      "vereniging Utrecht",
      "stichting Utrecht",
      "vrijwilligerswerk Utrecht",
      "buurtcentrum Utrecht",
      "religieuze centra Utrecht",
      "gemeenschap Utrecht",
      "sociale dienst Utrecht"
    ],
    longTailKeywords: [
      "vrijwilligerswerk Utrecht",
      "buurtcentrum Utrecht",
      "sportvereniging Utrecht",
      "culturele vereniging Utrecht",
      "religieuze gemeenschap Utrecht",
      "welzijnsorganisatie Utrecht"
    ],
    relatedCategories: ["lokaal", "onderwijs", "sport"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "groningen", "maastricht", "eindhoven"],
    contentSections: {
      intro: "Utrecht heeft een rijk verenigingsleven met honderden verenigingen, stichtingen en welzijnsorganisaties. Van sportverenigingen tot culturele clubs en van religieuze gemeenschappen tot vrijwilligersorganisaties.",
      history: "Het verenigingsleven in Nederland is een belangrijk onderdeel van de samenleving. Utrecht herbergt een grote diversiteit aan organisaties voor alle leeftijden en interesses.",
      types: "Het aanbod omvat sportverenigingen, culturele verenigingen, religieuze gemeenschappen, welzijnsorganisaties, vrijwilligerscentrales en buurtcentra. Er zijn ook gespecialiseerde organisaties voor specifieke doelgroepen.",
      tips: "Word lid van een vereniging om nieuwe mensen te ontmoeten en actief te zijn. Vrijwilligerswerk is een goede manier om de gemeenschap te helpen en ervaring op te doen. Veel organisaties zoeken actief leden en vrijwilligers.",
      local: "De verschillende wijken in Utrecht hebben eigen buurtcentra en verenigingen die activiteiten organiseren voor residents."
    }
  },

  "publieke-diensten": {
    slug: "publieke-diensten",
    name: "Publieke diensten",
    primaryKeywords: [
      "gemeente Utrecht",
      "bibliotheek Utrecht",
      "publieke dienst Utrecht",
      "gemeentehuis Utrecht",
      "burgerzaken Utrecht",
      "postkantoor Utrecht",
      "informatie Utrecht"
    ],
    longTailKeywords: [
      "gemeente Utrecht contact",
      "bibliotheek Utrecht openingstijden",
      "paspoort aanvragen Utrecht",
      "vergunning aanvragen Utrecht",
      "postNL Utrecht",
      "gemeentelijk loket Utrecht"
    ],
    relatedCategories: ["juridisch", "overheid", "lokaal"],
    cities: ["amsterdam", "rotterdam", "den-haag", "utrecht", "almere", "zoetermeer", "haarlem"],
    contentSections: {
      intro: "Utrecht biedt uitgebreide publieke diensten voor haar inhabitants. Van gemeentelijke diensten tot bibliotheken en van postdiensten tot overheidsloketten.",
      history: "De publieke dienstverlening in Nederland is efficiënt en toegankelijk. Utrecht is koploper in digitale dienstverlening en burgerparticipatie.",
      types: "Het aanbod omvat gemeentelijke diensten (burgerzaken, vergunningen, wonen), bibliotheken, postdiensten, overheidsinstanties, kredietbanken en adviesloketten. Er zijn ook digitale diensten beschikbaar.",
      tips: "Veel diensten zijn online beschikbaar en kunnen sneller worden afgehandeld. Maak een afspraak voor bezoeken aan het gemeentelijk loket om wachttijd te vermijden. De bibliotheek biedt meer dan alleen boeken.",
      local: "De nieuwe stadsbibliotheek in Utrecht is een architectonisch hoogtepunt en biedt tal van digitale diensten en werkplekken."
    }
  }
};

// Helper function to get keywords by slug
export function getCategoryKeywords(slug: string): CategoryKeywords | undefined {
  return CATEGORY_KEYWORDS[slug];
}

// Helper function to get all cities
export function getAllCities(): string[] {
  const citiesSet = new Set<string>();
  for (const category of Object.values(CATEGORY_KEYWORDS)) {
    for (const city of category.cities) {
      citiesSet.add(city);
    }
  }
  return Array.from(citiesSet);
}

// Helper function to generate city + category combinations
export function getCityCategoryCombinations(): { city: string; category: string; keywords: string[] }[] {
  const combinations: { city: string; category: string; keywords: string[] }[] = [];

  for (const [categorySlug, category] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const city of category.cities) {
      const cityKeywords = [
        `${category.name} ${city}`,
        `${category.name} in ${city}`,
        ...category.primaryKeywords.map(k => `${k} ${city}`)
      ];
      combinations.push({ city, category: categorySlug, keywords: cityKeywords });
    }
  }

  return combinations;
}
