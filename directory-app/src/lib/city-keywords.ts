/**
 * City keywords and local content data for SEO
 * Used for generating city-specific content
 */

export const CITY_KEYWORDS: Record<string, {
  name: string;
  slug: string;
  province: string;
  primaryKeywords: string[];
  longTailKeywords: string[];
  relatedCities: string[];
  contentSections: {
    intro: string;
    history: string;
    economy: string;
    landmarks: string;
    localTips: string;
  };
}> = {
  "amsterdam": {
    name: "Amsterdam",
    slug: "amsterdam",
    province: "Noord-Holland",
    primaryKeywords: [
      "Amsterdam",
      "bedrijven Amsterdam",
      "zakelijke diensten Amsterdam",
      "ondernemers Amsterdam",
      "lokaal Amsterdam",
      "Amsterdam centrum",
      "Amsterdam Noord",
      "Amsterdam Zuid",
      "zakendoen in Amsterdam",
      "Amsterdam ondernemen"
    ],
    longTailKeywords: [
      "beste bedrijven in Amsterdam",
      "lokale winkels Amsterdam",
      "restaurants Amsterdam centrum",
      "zakelijke afspraken Amsterdam",
      "vergaderlocaties Amsterdam",
      "coworking Amsterdam",
      "startups Amsterdam",
      "creatieve sector Amsterdam",
      "fintech Amsterdam",
      "logistics Amsterdam"
    ],
    relatedCities: ["rotterdam", "den-haag", "utrecht", "haarlem", "almere"],
    contentSections: {
      intro: "Amsterdam, de hoofdstad van Nederland, is een bruisende metropool met een rijke geschiedenis en een divers bedrijvenlandschap. Van de historische grachtengordel tot het moderne Zuidas zakendistrict, de stad biedt talloze mogelijkheden voor ondernemers en consumenten.",
      history: "Amsterdam ontwikkelde zich in de 17e eeuw tot een wereldhandelscentrum. De VOC bracht welvaart en de grachtengordel getuigt van deze gouden eeuw. Nu is de stad een centrum voor financiën, creatieve industrie en technologie.",
      economy: "De economie van Amsterdam is divers met sterke sectoren in financiële diensten, creatieve industrie, toerisme en technologie. Zuidas is het belangrijkste zakendistrict met hoofdkantoren van multinationals.",
      landmarks: "Bekende bezienswaardigheden zijn het Rijksmuseum, Van Gogh Museum, Anne Frank Huis, de Dam en de grachtengordel. Het Vondelpark en het Amsterdamse Bos bieden groene rust in de drukke stad.",
      localTips: "Amsterdam is compact en goed bereikbaar met de fiets, tram en metro. Voor zakelijke bijeenkomsten zijn er talloze vergaderlocaties en coworking spaces. De binnenstad is krap, dus boek tijdig."
    }
  },

  "rotterdam": {
    name: "Rotterdam",
    slug: "rotterdam",
    province: "Zuid-Holland",
    primaryKeywords: [
      "Rotterdam",
      "bedrijven Rotterdam",
      "haven Rotterdam",
      "zakelijke diensten Rotterdam",
      "maritieme sector Rotterdam",
      "Rotterdam centrum",
      "ondernemen Rotterdam",
      "logistiek Rotterdam"
    ],
    longTailKeywords: [
      "beste bedrijven in Rotterdam",
      "havenbedrijven Rotterdam",
      "zakelijke evenementen Rotterdam",
      "vergaderlocaties Rotterdam",
      "startups Rotterdam",
      "architectuur Rotterdam",
      "cubus huizen Rotterdam",
      "markthal Rotterdam"
    ],
    relatedCities: ["den-haag", "amsterdam", "dordrecht", " Delft"],
    contentSections: {
      intro: "Rotterdam is de tweede stad van Nederland en een belangrijk economisch centrum met de grootste haven van Europa. De stad staat bekend als architecturale hoofdstad met revolutionaire moderne architectuur.",
      history: "Rotterdam werd in de Tweede Wereldoorlog grotendeels verwoest en daarna opnieuw opgebouwd. Dit maakte de stad een laboratorium voor moderne architectuur en stedenbouw.",
      economy: "De Rotterdamse haven is de grootste van Europa en vormt de ruggengraat van de economie. Daarnaast zijn er sterke sectoren in olieraffinaderij, chemie en logistiek.",
      landmarks: "De Euromast, Markthal, De Kuip, Kubuswoningen, Erasmusbrug en het futuristic Depot Boijmans Van Beuningen zijn karakteristiek voor het moderne stadsbeeld.",
      localTips: "Rotterdam is een echte wereldstad met een jong en dynamisch karakter. De OV-verbindingen zijn uitstekend. Bezoek de Markthal voor lokale producten en de Witte de Withstraat voor horeca."
    }
  },

  "den-haag": {
    name: "Den Haag",
    slug: "den-haag",
    province: "Zuid-Holland",
    primaryKeywords: [
      "Den Haag",
      "bedrijven Den Haag",
      "regeringsstad Den Haag",
      "internationaal recht Den Haag",
      "Diplomatieke sector Den Haag",
      "Den Haag centrum",
      "Scheveningen",
      "ondernemen Den Haag"
    ],
    longTailKeywords: [
      "beste bedrijven in Den Haag",
      "internationaal recht Den Haag",
      "diplomatieke missies Den Haag",
      "vergaderlocaties Den Haag",
      "strand Scheveningen",
      "bezienswaardigheden Den Haag",
      "Frederik Hendrikplein Den Haag"
    ],
    relatedCities: ["rotterdam", "amsterdam", "delft", "leiden"],
    contentSections: {
      intro: "Den Haag is de politieke hoofdstad van Nederland en zetelt de regering, het parliament en het Internationaal Gerechtshof. De stad combineert royalistische traditie met een moderne zakelijke sector.",
      history: "Als residentie van het koningshuis heeft Den Haag een bijzondere status. De stad groeide rond het Binnenhof en ontwikkelde zich tot centrum van politiek en diplomatie.",
      economy: "Naast de politieke sector zijn er sterke clusters in juridische diensten, consulting, cybersecurity en de creatieve industrie. De nabijheid van Delft en Rotterdam versterkt de kennisintensieve economie.",
      landmarks: "Het Binnenhof, Peace Palace, Mauritshuis, Madurodam en het strand van Scheveningen zijn de belangrijkste bezienswaardigheden.",
      localTips: "Den Haag heeft een elegant karakter met brede straten en chique winkels. De tram is het beste vervoermiddel. Het strand van Scheveningen is het hele jaar populair."
    }
  },

  "utrecht": {
    name: "Utrecht",
    slug: "utrecht",
    province: "Utrecht",
    primaryKeywords: [
      "Utrecht",
      "bedrijven Utrecht",
      "universiteit Utrecht",
      "zakelijke diensten Utrecht",
      "centrum Utrecht",
      "ondernemen Utrecht",
      "kennisstad Utrecht",
      "historie Utrecht"
    ],
    longTailKeywords: [
      "beste bedrijven in Utrecht",
      "startups Utrecht",
      "vergaderlocaties Utrecht",
      "De Uithof Utrecht",
      "Domtoren Utrecht",
      "winkelgebied Utrecht",
      "evenementen Utrecht"
    ],
    relatedCities: ["amsterdam", "rotterdam", "den-haag", "amersfoort"],
    contentSections: {
      intro: "Utrecht is de vierde stad van Nederland en een belangrijk kennis- en dienstencentrum. De stad combineert een rijke middeleeuwse geschiedenis met een moderne economie.",
      history: "Utrecht ontwikkelde zich rond de Dom en was een belangrijk religieus centrum. De grachtengordel met de unieke werven is karakteristiek voor het historische centrum.",
      economy: "De economie is gericht op diensten, onderwijs en gezondheidszorg. De Universiteit Utrecht en het UMC zijn belangrijke werkgevers. De stad trekt veel jonge professionals aan.",
      landmarks: "De Domtoren is het hoogste kerkgebouw van Nederland. Andere bezienswaardigheden zijn de grachtengordel, Rietveld Schröderhuis, Museum Speelklok en het Oudegracht.",
      localTips: "Utrecht is zeer bereikbaar met de fiets en het openbaar vervoer. Het centrum is compact en gezellig. De Uithof is het moderne kennis- en zakencentrum ten zuiden van de stad."
    }
  },

  "eindhoven": {
    name: "Eindhoven",
    slug: "eindhoven",
    province: "Noord-Brabant",
    primaryKeywords: [
      "Eindhoven",
      "bedrijven Eindhoven",
      "Philips Eindhoven",
      "high-tech Eindhoven",
      "Dutch Design Eindhoven",
      "ondernemen Eindhoven",
      "technology Eindhoven",
      "innovatie Eindhoven"
    ],
    longTailKeywords: [
      "beste bedrijven in Eindhoven",
      "high-tech sector Eindhoven",
      "design Eindhoven",
      "startups Eindhoven",
      " Philips Campus",
      "Van Abbemuseum Eindhoven",
      "lichtstad Eindhoven"
    ],
    relatedCities: ["tilburg", "s-hertogenbosch", "weert", "helmond"],
    contentSections: {
      intro: "Eindhoven is het centrum van de high-tech industrie in Nederland, ooit gebouwd rondom Philips en nu een创新的 hub voor technologie en design. De stad combineert industriële erfenis met cutting-edge innovatie.",
      history: "Eindhoven groeide uit van een klein dorp tot een industriële stad dankzij Philips en DAF. De stad werd zwaar beschadigd in de Tweede Wereldoorlog en daarna weer opgebouwd.",
      economy: "De economie draait om high-tech systems, semiconductors en design. ASML, Philips en tientallen spin-offs zijn belangrijke werkgevers. De Brainportregio is een van de meest innovatieve gebieden van Europa.",
      landmarks: "Het Van Abbemuseum, Philips Stadion, de Evoluon, Stratumseind (longest bar street van NL) en het historische centrum zijn de belangrijkste bezienswaardigheden.",
      localTips: "Eindhoven heeft een Jong en cosmopolitisch karakter. De stripwinkels en het Stratumseind zijn legendarisch. De Dutch Design Week trekt jaarlijks honderdduizenden bezoekers."
    }
  },

  "groningen": {
    name: "Groningen",
    slug: "groningen",
    province: "Groningen",
    primaryKeywords: [
      "Groningen",
      "bedrijven Groningen",
      "universiteit Groningen",
      "onderwijs Groningen",
      "innovatie Groningen",
      "noorden Groningen",
      "studentenstad Groningen",
      "energie Groningen"
    ],
    longTailKeywords: [
      "beste bedrijven in Groningen",
      "startups Groningen",
      "energie sector Groningen",
      "academisch ziekenhuis Groningen",
      "bezienswaardigheden Groningen",
      "Groningse ontzet",
      " Martini Tower Groningen"
    ],
    relatedCities: ["leeuwarden", "assen", "heerenveen", "drenthe"],
    contentSections: {
      intro: "Groningen is de hoofdstad van het noorden van Nederland en een belangrijk centrum voor onderwijs, onderzoek en innovatie. De stad heeft een jong en dynamisch karakter dankzij de grote studentenpopulatie.",
      history: "Groningen was een belangrijke handelsstad in de middeleeuwen. De Stadhouderlijke Kennis en het gewelfde fundament zijn historische getuigen van de rijke geschiedenis.",
      economy: "De economie is gebaseerd op onderwijs, gezondheidszorg en energie. De Rijksuniversiteit Groningen en het UMCG zijn belangrijke economische dragers.",
      landmarks: "De Martini Tower, het Groninger Museum, het Academiegebouw, de Der Aa-kerk en het Stadspark zijn de belangrijkste bezienswaardigheden.",
      localTips: "Groningen is de beste fietsstad van Nederland. Het nachtleven is bruisend en de binnenstad is compact. Het Groningse ontzet (3 oktober) is een belangrijk festival."
    }
  },

  "leiden": {
    name: "Leiden",
    slug: "leiden",
    province: "Zuid-Holland",
    primaryKeywords: [
      "Leiden",
      "bedrijven Leiden",
      "universiteit Leiden",
      "historische stad Leiden",
      "kennisstad Leiden",
      "ondernemen Leiden",
      "academisch Leiden",
      "Rijnland Leiden"
    ],
    longTailKeywords: [
      "beste bedrijven in Leiden",
      "startups Leiden",
      "bio science Leiden",
      "historische binnenstad Leiden",
      "bezienswaardigheden Leiden",
      "Leidsch Dagblad gebied",
      "LUMC Leiden"
    ],
    relatedCities: ["den-haag", "amsterdam", "delft", "katwoude"],
    contentSections: {
      intro: "Leiden is een prachtige historische universiteitsstad met een rijke academische traditie. De stad combineert middeleeuwse schoonheid met moderne kennisintensieve industrie.",
      history: "Leiden ontving stadsrechten in 1248 en was een belangrijk centrum voor de lakennijverheid. De universiteit, opgericht in 1575, is de oudste van Nederland.",
      economy: "De economie wordt gedomineerd door onderwijs, onderzoek en de zorg. De Leidse Bio Science Park is een van de belangrijkste biotechclusters van Europa.",
      landmarks: "De Pieterskerk, het Rijksmuseum van Oudheden, Hortus Botanicus, het windwaatje en de historische grachtengordel zijn karakteristiek.",
      localTips: "Leiden is compact en perfect te verkennen te voet of per fiets. De koningsdag viering is beroemd. Bezoek de Botanische Tuinen voor rust."
    }
  },

  "delft": {
    name: "Delft",
    slug: "delft",
    province: "Zuid-Holland",
    primaryKeywords: [
      "Delft",
      "bedrijven Delft",
      "TU Delft",
      "delfts blauw",
      "historische stad Delft",
      "ondernemen Delft",
      "technologie Delft",
      "innovatie Delft"
    ],
    longTailKeywords: [
      "beste bedrijven in Delft",
      "startups Delft",
      "TU Delft campus",
      "delfts blauw winkels",
      "bezienswaardigheden Delft",
      " historische binnenstad Delft",
      "technische universiteit Delft"
    ],
    relatedCities: ["den-haag", "rotterdam", "leiden", "den-hoorn"],
    contentSections: {
      intro: "Delft is een schilderachtige historische stad beroemd om zijn Delfts blauw keramiek en de technische universiteit. De stad combineert oude Hollandse sfeer met cutting-edge technologie.",
      history: "Delft ontwikkelde zich rond het 13e-eeuwse kasteel. De historische binnenstad met grachten en monumentale gebouwen is grotendeels bewaard gebleven.",
      economy: "De TU Delft is de grootste technische universiteit van Nederland en vormt de kern van de innovatieve economie. Veel spin-offs ontstaan uit onderzoek.",
      landmarks: "De Nieuwe Kerk met het Koninklijk Graf, het Oude Sint Ludenskerkhof, het science center Delft, de Markt en de grachten zijn de belangrijkste bezienswaardigheden.",
      localTips: "Delft is perfect voor een dagje uit. Bezoek de keramiekwinkels en het museum. De TU Delft campus is interessant voor techniekliefhebbers."
    }
  },

  "almere": {
    name: "Almere",
    slug: "almere",
    province: "Flevoland",
    primaryKeywords: [
      "Almere",
      "bedrijven Almere",
      "jonge stad Almere",
      "groeistad Almere",
      "ondernemen Almere",
      "goedkoop Almere",
      "Woonstad Almere",
      "ov Almere"
    ],
    longTailKeywords: [
      "beste bedrijven in Almere",
      "startups Almere",
      "winkelcentra Almere",
      "bezienswaardigheden Almere",
      "Almere Haven",
      "Weerwater Almere",
      "Stadspark Almere"
    ],
    relatedCities: ["amsterdam", "utrecht", "hilversum", "lelystad"],
    contentSections: {
      intro: "Almere is de jongste stad van Nederland en onderdeel van de metropoolregio Amsterdam. De stad groeide uit tot de grootste stad in Flevoland met een diverse economie.",
      history: "Almere is gebouwd op drooggelegd land van de Zuiderzee. De eerste bewoning begon in 1976 en de stad groeide snel uit tot een volwaardige stad.",
      economy: "De economie is divers met sterke sectoren in detailhandel, zakelijke diensten en de creatieve industrie. De stad trekt jonge gezinnen aan vanwege de betaalbare woningen.",
      landmarks: "Het Weerwater, het Stadhuis, Citymall Almere, de Forums en het Stadspark zijn de belangrijkste plekken. Almere Haven heeft een gezellige jachthaven.",
      localTips: "Almere is zeer bereikbaar met trein en auto. De woningen zijn betaalbaarder dan Amsterdam. De stad heeft goede voorzieningen en groene wijken."
    }
  },

  "tilburg": {
    name: "Tilburg",
    slug: "tilburg",
    province: "Noord-Brabant",
    primaryKeywords: [
      "Tilburg",
      "bedrijven Tilburg",
      "textielstad Tilburg",
      "onderwijs Tilburg",
      "ondernemen Tilburg",
      "eventen Tilburg",
      "popcultuur Tilburg",
      "kennisstad Tilburg"
    ],
    longTailKeywords: [
      "beste bedrijven in Tilburg",
      "startups Tilburg",
      "013 Tilburg",
      "universiteit Tilburg",
      "bezienswaardigheden Tilburg",
      "winkelgebied Tilburg",
      "fabrick Tilburg"
    ],
    relatedCities: ["eindhoven", "s-hertogenbosch", "breda", "waalwijk"],
    contentSections: {
      intro: "Tilburg is een belangrijke stad in Noord-Brabant met een rijke industriële geschiedenis in de textiel. Nu is de stad een centrum voor onderwijs, cultuur en innovatie.",
      history: "Tilburg groeide uit van een agrarische gemeenschap tot een industriële stad in de 19e eeuw. De textielindustrie verdween, maar de stad transformeerde succesvol.",
      economy: "De economie is divers met sterke sectoren in onderwijs, logistiek, automotive en creatieve industrie. De universiteit en hogeschool zijn belangrijke werkgevers.",
      landmarks: "De Heuvel, het 013 poppodium, het Textielmuseum, het Paleis-Raadhuis en de Pietersbasiliek zijn de belangrijkste bezienswaardigheden.",
      localTips: "Tilburg heeft een gezellige binnenstad met veel horeca. Het 013 is het belangrijkste poppodium van Nederland. De stad is goed bereikbaar."
    }
  },

  "amersfoort": {
    name: "Amersfoort",
    slug: "amersfoort",
    province: "Utrecht",
    primaryKeywords: [
      "Amersfoort",
      "bedrijven Amersfoort",
      "historische binnenstad Amersfoort",
      "ondernemen Amersfoort",
      "kop-van-het-land Amersfoort",
      "werkgelegenheid Amersfoort",
      "zakelijke diensten Amersfoort",
      "logistiek Amersfoort"
    ],
    longTailKeywords: [
      "beste bedrijven in Amersfoort",
      "startups Amersfoort",
      "historische binnenstad Amersfoort",
      "bezienswaardigheden Amersfoort",
      "winkelgebied Amersfoort",
      "evenementen Amersfoort",
      "Vliegbasis Amersfoort"
    ],
    relatedCities: ["utrecht", "amersfoort", "hilversum", "barneveld"],
    contentSections: {
      intro: "Amersfoort is een bruisende stad in de provincie Utrecht met een prachtige historische binnenstad. De stad staat bekend als het 'Kop van het Land' en biedt een perfecte mix van historische charm en moderne zakelijke kansen.",
      history: "Amersfoort ontwikkelde zich in de middeleeuwen tot een belangrijke handelsstad. De karakteristieke historische binnenstad met de Iconic Square en de Muurhuizen getuigt van deze rijke geschiedenis.",
      economy: "De economie van Amersfoort is divers met sterke sectoren in logistiek, zakelijke diensten en de creatieve industrie. De stad is een belangrijk regionaal centrum voor de omliggende provincies.",
      landmarks: "De historische binnenstad met de Iconic Square, het Kantorenpark A1, het Armando Museum en het Vliegbasis Amersfoort zijn de belangrijkste bezienswaardigheden.",
      localTips: "Amersfoort is zeer goed bereikbaar met de auto en het openbaar vervoer. De binnenstad is compact en perfect te verkennen te voet. Parkeerwijken zijn beschikbaar aan de rand van het centrum."
    }
  },

  "haarlem": {
    name: "Haarlem",
    slug: "haarlem",
    province: "Noord-Holland",
    primaryKeywords: [
      "Haarlem",
      "bedrijven Haarlem",
      "historische stad Haarlem",
      "bloemenstad Haarlem",
      "kunststad Haarlem",
      "ondernemen Haarlem",
      "zakelijke diensten Haarlem",
      "muziekstad Haarlem"
    ],
    longTailKeywords: [
      "beste bedrijven in Haarlem",
      "startups Haarlem",
      "historische binnenstad Haarlem",
      "bezienswaardigheden Haarlem",
      "bloemenmarkt Haarlem",
      "Frans Hals Museum Haarlem"
    ],
    relatedCities: ["amsterdam", "zandvoort", "bloemendaal", "heemstede"],
    contentSections: {
      intro: "Haarlem is de hoofdstad van Noord-Holland en staat bekend als de bloemenstad van Nederland. De historische binnenstad met prachtige monumenten en het bruisende culturele leven maken Haarlem tot een aantrekkelijke stad.",
      history: "Haarlem ontwikkelde zich in de middeleeuwen tot een belangrijk centrum voor handel en textiel. De stad was het centrum van de bloembollenhandel en herbergt vele historische gebouwen.",
      economy: "De economie is divers met sterke sectoren in toerisme, culturele diensten, zakelijke diensten en de bloembollenhandel. Haarlem trekt veel jonge professionals aan.",
      landmarks: "De Grote Markt, het Frans Hals Museum, de Teylers Hofjes, de Bloemenmarkt en het Historisch Museum Haarlem zijn de belangrijkste bezienswaardigheden.",
      localTips: "Haarlem is perfect te verkennen te voet of per fiets. De tram verbindt Haarlem met Amsterdam. Bezoek de bloemenmarkt voor verse bloemen en geniet van het gezellige terrasleven."
    }
  },

  "s-hertogenbosch": {
    name: "'s-Hertogenbosch",
    slug: "s-hertogenbosch",
    province: "Noord-Brabant",
    primaryKeywords: [
      "'s-Hertogenbosch",
      "bedrijven 's-Hertogenbosch",
      "Bouwwereld 's-Hertogenbosch",
      "ondernemen 's-Hertogenbosch",
      "historic 's-Hertogenbosch",
      "zakelijke diensten 's-Hertogenbosch",
      "festivals 's-Hertogenbosch",
      "cultuur 's-Hertogenbosch"
    ],
    longTailKeywords: [
      "beste bedrijven in 's-Hertogenbosch",
      "startups 's-Hertogenbosch",
      "Jeroen Bosch Festival",
      "bezienswaardigheden 's-Hertogenbosch",
      "Historische binnenstad 's-Hertogenbosch"
    ],
    relatedCities: ["eindhoven", "tilburg", "waalwijk", "oss"],
    contentSections: {
      intro: "'s-Hertogenbosch, ook wel Den Bosch genoemd, is de hoofdstad van Noord-Brabant. De stad combineert een rijke historie met een moderne economie en is beroemd om het Jeroen Bosch Festival en de prachtige historische binnenstad.",
      history: "De stad ontwikkelde zich rond het 12e-eeuwse kasteel. De historische binnenstad met de Sint-Janskathedraal is een van de mooiste van Nederland. Jheronimus Bosch was een beroemde inwoner.",
      economy: "De economie is gebaseerd op zakelijke diensten, onderwijs, cultuur en toerisme. De stad trekt veel bezoekers vanwege de festivals en het rijke culturele aanbod.",
      landmarks: "De Sint-Janskathedraal, de Binnendieze, het Jheronimus Bosch Museum, de Markt en het Historisch Museum zijn de belangrijkste bezienswaardigheden.",
      localTips: "'s-Hertogenbosch heeft een gezellige binnenstad met veel horeca. De Binnendieze (overdekte grachten) is een unieke ervaring. Boek tijdig tijdens het Jeroen Bosch Festival."
    }
  },

  "zwolle": {
    name: "Zwolle",
    slug: "zwolle",
    province: "Overijssel",
    primaryKeywords: [
      "Zwolle",
      "bedrijven Zwolle",
      "historische stad Zwolle",
      "ondernemen Zwolle",
      "zakelijke diensten Zwolle",
      "kennisstad Zwolle",
      "cultuur Zwolle",
      "logistiek Zwolle"
    ],
    longTailKeywords: [
      "beste bedrijven in Zwolle",
      "startups Zwolle",
      "historische binnenstad Zwolle",
      "bezienswaardigheden Zwolle",
      "Peperbus Zwolle"
    ],
    relatedCities: ["kampen", "meppel", "deventer", "apeldoorn"],
    contentSections: {
      intro: "Zwolle is een prachtige historische stad in Overijssel met een rijke middeleeuwse geschiedenis. De stad combineert historische charm met moderne zakelijke kansen en een bloeiend cultureel leven.",
      history: "Zwolle ontwikkelde zich in de middeleeuwen tot een belangrijk handelscentrum. De historische binnenstad met de iconische Peperbus (de nieuwe ofte bovenste kerk) is karakteristiek.",
      economy: "De economie is divers met sterke sectoren in zakelijke diensten, logistiek, onderwijs en cultuur. De centrale ligging maakt Zwolle een belangrijk knooppunt.",
      landmarks: "De Peperbus, het Museum de Fundatie, de Stadsmuseum Zwolle, de Sassenpoort en het historicische centrum zijn de belangrijkste bezienswaardigheden.",
      localTips: "Zwolle is zeer bereikbaar met de auto en trein. De binnenstad is compact en perfect te verkennen. Er zijn talloze gezellige terrassen en restaurants."
    }
  },

  "apeldoorn": {
    name: "Apeldoorn",
    slug: "apeldoorn",
    province: "Gelderland",
    primaryKeywords: [
      "Apeldoorn",
      "bedrijven Apeldoorn",
      "Koninklijk Paleis Apeldoorn",
      "ondernemen Apeldoorn",
      "bossen Apeldoorn",
      "zakelijke diensten Apeldoorn",
      "toerisme Apeldoorn",
      "kennisstad Apeldoorn"
    ],
    longTailKeywords: [
      "beste bedrijven in Apeldoorn",
      "startups Apeldoorn",
      "Paleis Het Loo Apeldoorn",
      "bezienswaardigheden Apeldoorn",
      "Apenheul Apeldoorn"
    ],
    relatedCities: ["zwolle", "arnhem", "deventer", "zutphen"],
    contentSections: {
      intro: "Apeldoorn is een groene stad in Gelderland, beroemd om Paleis Het Loo en de uitgestrekte bossen. De stad combineert natuurlijke schoonheid met moderne zakelijke kansen.",
      history: "Apeldoorn groeide uit rond het 8e eeuw. De komst van het koninklijk paleis in de 17e eeuw gaf de stad internationale bekendheid. Nu is het een belangrijk regionaal centrum.",
      economy: "De economie is gebaseerd op overheidsdiensten, toerisme, zakelijke diensten en de technologische sector. De bossen en het paleis trekken veel toeristen.",
      landmarks: "Paleis Het Loo, Apenheul, De Tuinen van Appeltern, de bossen rondom de stad en het Centraal Museum zijn de belangrijkste bezienswaardigheden.",
      localTips: "Apeldoorn is perfect voor natuurliefhebbers. De bossen zijn ideaal voor wandelingen en fietstochten. Bezoek Paleis Het Loo en Apenheul voor een dagje uit."
    }
  },

  "arnhem": {
    name: "Arnhem",
    slug: "arnhem",
    province: "Gelderland",
    primaryKeywords: [
      "Arnhem",
      "bedrijven Arnhem",
      "moderne stad Arnhem",
      "ondernemen Arnhem",
      "zakelijke diensten Arnhem",
      "modemuseum Arnhem",
      "kennisstad Arnhem",
      "toerisme Arnhem"
    ],
    longTailKeywords: [
      "beste bedrijven in Arnhem",
      "startups Arnhem",
      "ModeMuseum Arnhem",
      "bezienswaardigheden Arnhem",
      "Sonsbeek Arnhem"
    ],
    relatedCities: ["apeldoorn", "nijmegen", "zutphen", "doesburg"],
    contentSections: {
      intro: "Arnhem is de hoofdstad van Gelderland en een bruisende stad aan de Rijn. De stad combineert moderne architectuur met groene parken en een rijk cultureel aanbod.",
      history: "Arnhem werd tijdens de Tweede Wereldoorlog zwaar beschadigd maar is daarna prachtig hersteld. De stad heeft een jonge bevolking dankzij de universiteit.",
      economy: "De economie is divers met sterke sectoren in zakelijke diensten, onderwijs, creatieve industrie en toerisme. De Modevakschool en ArtEZ zijn belangrijke onderwijsinstellingen.",
      landmarks: "Het ModeMuseum, Park Sonsbeek, de Eusebiuskerk, het Airborne Museum en het Centraal Museum zijn de belangrijkste bezienswaardigheden.",
      localTips: "Arnhem heeft een levendige binnenstad met veel winkels en horeca. De film 'A Bridge Too Far' is hier opgenomen. Bezoek Sonsbeek Park voor rust en natuur."
    }
  },

  "nijmegen": {
    name: "Nijmegen",
    slug: "nijmegen",
    province: "Gelderland",
    primaryKeywords: [
      "Nijmegen",
      "bedrijven Nijmegen",
      "oudste stad Nijmegen",
      "universiteitsstad Nijmegen",
      "ondernemen Nijmegen",
      "studentenstad Nijmegen",
      "cultuur Nijmegen",
      "toerisme Nijmegen"
    ],
    longTailKeywords: [
      "beste bedrijven in Nijmegen",
      "startups Nijmegen",
      "Vierdaagsefeesten Nijmegen",
      "bezienswaardigheden Nijmegen",
      "historische binnenstad Nijmegen"
    ],
    relatedCities: ["arnhem", "kleve", "doesburg", "waalwijk"],
    contentSections: {
      intro: "Nijmegen is de oudste stad van Nederland en een bruisende universiteitsstad aan de Waal. De stad combineert een rijke Romeinse geschiedenis met een jong en dynamisch karakter.",
      history: "Nijmegen werd gesticht door de Romeinen en is daarmee de oudste stad van Nederland. De stad heeft een rijke geschiedenis als handelscentrum en universiteitsstad.",
      economy: "De economie wordt gedomineerd door de Radboud Universiteit en het ziekenhuis. Daarnaast zijn er sterke sectoren in zakelijke diensten en de creatieve industrie.",
      landmarks: "De historische binnenstad, het Kronenburgerpark, het Velorama Fietsmuseum, de Waalkade en de Waalbrug zijn de belangrijkste bezienswaardigheden.",
      localTips: "Nijmegen is de ideale fietsstad. De Vierdaagsefeesten in juli zijn wereldberoemd. De Waalkade is populair bij studenten en toeristen."
    }
  },

  "maastricht": {
    name: "Maastricht",
    slug: "maastricht",
    province: "Limburg",
    primaryKeywords: [
      "Maastricht",
      "bedrijven Maastricht",
      "zuidelijkste stad Maastricht",
      "historische stad Maastricht",
      "ondernemen Maastricht",
      "universiteitsstad Maastricht",
      "cultuur Maastricht",
      "toerisme Maastricht"
    ],
    longTailKeywords: [
      "beste bedrijven in Maastricht",
      "startups Maastricht",
      "historische binnenstad Maastricht",
      "bezienswaardigheden Maastricht",
      "Vrijthof Maastricht"
    ],
    relatedCities: ["aachen", "hasselt", "sittard", "venlo"],
    contentSections: {
      intro: "Maastricht is de zuidelijkste en een van de mooiste steden van Nederland. De stad combineert een rijke Romeinse geschiedenis met een mediterrane sfeer en een bloeiend cultureel leven.",
      history: "Maastricht werd gesticht door de Romeinen en is een van de oudste steden van Nederland. De stad heeft een unieke mix van Nederlandse, Duitse en Belgische invloeden.",
      economy: "De economie is gebaseerd op toerisme, onderwijs (Universiteit Maastricht), zakelijke diensten en de gezondheidszorg. De stad trekt veel internationale studenten.",
      landmarks: "Het Vrijthof, de Onze-Lieve-Vrouwekerk, het Vleteren Abdijbier, de Jekerstad en hetBonnefantenmuseum zijn de belangrijkste bezienswaardigheden.",
      localTips: "Maastricht heeft een gezellige sfeer met veel terrassen en restaurants. Het is de perfecte stad voor een weekendje weg. Bezoek de historische binnenstad en geniet van de Limburgse gastvrijheid."
    }
  },

  // Utrecht Province Cities
  nieuwegein: {
    slug: "nieuwegein",
    name: "Nieuwegein",
    province: "Utrecht",
    primaryKeywords: [
      "Nieuwegein",
      "bedrijven Nieuwegein",
      "winkelcentrum Nieuwegein",
      "ondernemen Nieuwegein",
      "zakelijk Nieuwegein",
      "Midden-Nederland Nieuwegein",
      "werk Nieuwegein"
    ],
    longTailKeywords: [
      "beste bedrijven in Nieuwegein",
      "winkelen Nieuwegein",
      "zakelijke diensten Nieuwegein",
      "werkgelegenheid Nieuwegein"
    ],
    relatedCities: ["utrecht", "veenendaal", "zeist", "houten"],
    contentSections: {
      intro: "Nieuwegein is een moderne stad in de provincie Utrecht, gelegen aan het Amsterdam-Rijnkanaal. De stad is ontstaan in de jaren '70 en staat bekend als een echte woon- en werkstad.",
      history: "Nieuwegein werd in 1968 gesticht als groeikern voor de groei van Utrecht. De stad groeide snel en heeft een moderne architectuur met veel groenvoorzieningen.",
      economy: "De economie van Nieuwegein is divers met een mix van retail, zakelijke diensten en light industry. Het stadshart biedt uitgebreide winkelmogelijkheden.",
      landmarks: "Het City Plaza winkelcentrum, het A2-park, het 19e-eeuwse fort bij Rijnauwen en de historische Boerderij de Vleteren zijn bezienswaardigheden.",
      localTips: "Nieuwegein is ideaal gelegen voor forensen die in Utrecht of Amsterdam werken. De stad heeft goede ov-verbindingen en veel recreatiemogelijkheden langs het water."
    }
  },

  veenendaal: {
    slug: "veenendaal",
    name: "Veenendaal",
    province: "Utrecht",
    primaryKeywords: [
      "Veenendaal",
      "bedrijven Veenendaal",
      "veengebied Veenendaal",
      "ondernemen Veenendaal",
      "zakelijk Veenendaal",
      " Gelderse Vallei Veenendaal",
      "werk Veenendaal"
    ],
    longTailKeywords: [
      "beste bedrijven in Veenendaal",
      "middelgrote bedrijven Veenendaal",
      "zakelijke diensten Veenendaal",
      "industrie Veenendaal"
    ],
    relatedCities: ["utrecht", "ede", "wageningen", "renswoude"],
    contentSections: {
      intro: "Veenendaal ligt in de Gelderse Vallei in de provincie Utrecht en is bekend als de grootste stedenbouwkundige eenheid die op veen is gebouwd. De stad heeft een bloeiende economie.",
      history: "Veenendaal ontstond in de middeleeuwen als veenontginningsplaats. De naam verwijst naar het veen dat hier werd gewonnen. De stad groeide uit tot een belangrijk centrum voor handel en nijverheid.",
      economy: "Veenendaal heeft een sterke economie met veel middenstandsbedrijven en industriële activiteit. De stad staat bekend als ondernemersstad met veel familiebedrijven.",
      landmarks: "Het Kasteel De Klomp, de historische veenmuseum, de Moermark en het winkelcentrum De Ellekoot zijn de belangrijkste bezienswaardigheden.",
      localTips: "Veenendaal is perfect voor wie op zoek is naar een stad met een dorps karakter maar alle voorzieningen. De omgeving biedt mooie wandel- en fietsroutes door het natuurgebied."
    }
  },

  zeist: {
    slug: "zeist",
    name: "Zeist",
    province: "Utrecht",
    primaryKeywords: [
      "Zeist",
      "bedrijven Zeist",
      "kasteel Zeist",
      "ondernemen Zeist",
      "zakelijk Zeist",
      "bossen Zeist",
      "werk Zeist"
    ],
    longTailKeywords: [
      "beste bedrijven in Zeist",
      "kasteel en bossen Zeist",
      "zakelijke diensten Zeist",
      "hoofdkantoren Zeist"
    ],
    relatedCities: ["utrecht", "de-bilt", "soest", "doorn"],
    contentSections: {
      intro: "Zeist is een prachtige stad in de provincie Utrecht, omgeven uitgestrekte bossen en met een rijk historisch erfgoed. De stad staat bekend om het indrukwekkende kasteel Zeist.",
      history: "Zeist ontwikkelde zich rond het 14e-eeuwse kasteel dat eigendom was van de graven van Holland. De stad groeide uit tot een belangrijk centrum voor de textielindustrie.",
      economy: "Zeist heeft een diverse economie met veel hoofdkantoren van nationale en internationale bedrijven. De zakelijke dienstverlening en zorgsector zijn belangrijke werkgevers.",
      landmarks: "Paleis Kasteel Zeist, de Slotlaan, de bossen van Zeist, de historische dorpskern en het 17e-eeuwse buiten Slot Zuylen zijn bezienswaardigheden.",
      localTips: "Zeist is ideaal voor wie houdt van natuur gecombineerd met stadse voorzieningen. De bossen bieden uitstekende mogelijkheden voor wandelen, mountainbiken en paardrijden."
    }
  },

  houten: {
    slug: "houten",
    name: "Houten",
    province: "Utrecht",
    primaryKeywords: [
      "Houten",
      "bedrijven Houten",
      "verkeersknooppunt Houten",
      "ondernemen Houten",
      "zakelijk Houten",
      "randstad Houten",
      "werk Houten"
    ],
    longTailKeywords: [
      "beste bedrijven in Houten",
      "woonstad Houten",
      "zakelijke diensten Houten",
      "logistiek Houten"
    ],
    relatedCities: ["utrecht", "nieuwegein", "veenendaal", "tilburg"],
    contentSections: {
      intro: "Houten is een moderne stad in de provincie Utrecht, strategisch gelegen aan de A27 en het Amsterdam-Rijnkanaal. De stad is bekend om zijn uitstekende infrastructuur.",
      history: "Houten ontwikkelde zich van een klein agrarisch dorp tot een moderne forensenstad. De oude dorpskern met de monumentale kerk is bewaard gebleven.",
      economy: "Houten heeft een sterke economie gericht op logistiek, transport en zakelijke diensten. De strategische ligging maakt het een aantrekkelijke vestigingsplaats voor bedrijven.",
      landmarks: "Het Oude Dorp met de Sint-Lambertuskerk, het Kasteel Houten, de Schout bij Nacht en de nieuwe woonwijken met moderne architectuur zijn bezienswaardigheden.",
      localTips: "Houten is perfect voor forennen die in Utrecht of Amsterdam werken. De stad heeft goede treinen bussen en autosnelwegen. Het watergebied biedt recreatiemogelijkheden."
    }
  },

  ijsselstein: {
    slug: "ijsselstein",
    name: "IJsselstein",
    province: "Utrecht",
    primaryKeywords: [
      "IJsselstein",
      "bedrijven IJsselstein",
      "toren IJsselstein",
      "ondernemen IJsselstein",
      "zakelijk IJsselstein",
      "randstad IJsselstein",
      "werk IJsselstein"
    ],
    longTailKeywords: [
      "beste bedrijven in IJsselstein",
      "gotische toren IJsselstein",
      "zakelijke diensten IJsselstein",
      "woonstad IJsselstein"
    ],
    relatedCities: ["utrecht", "nieuwegein", "houten", "vianen"],
    contentSections: {
      intro: "IJsselstein is een historische stad in de provincie Utrecht, gelegen aan de rivier de IJssel. De stad staat bekend om zijn middeleeuwse karakter en de imposante Gotische toren.",
      history: "IJsselstein ontwikkelde zich rond het kasteel dat in de 13e eeuw werd gebouwd. De stad kreeg stadsrechten in 1335 en heeft een rijk historisch erfgoed.",
      economy: "IJsselstein heeft een diverse economie met een mix van lokale middenstand en zakelijke dienstverlening. De stad fungeert ook als slaapstad voor forensen.",
      landmarks: "De Gotische toren van IJsselstein is het symbool van de stad, het historische stadhuis, de Grote Kerk, het kasteelterrein en de vestingwallen zijn bezienswaardigheden.",
      localTips: "IJsselstein is ideaal voor wie houdt van historische sfeer gecombineerd met moderne voorzieningen. De stad heeft goede verbindingen met Utrecht en Amsterdam."
    }
  },

  woerden: {
    slug: "woerden",
    name: "Woerden",
    province: "Utrecht",
    primaryKeywords: [
      "Woerden",
      "bedrijven Woerden",
      "historische stad Woerden",
      "ondernemen Woerden",
      "zakelijk Woerden",
      "randstad Woerden",
      "werk Woerden"
    ],
    longTailKeywords: [
      "beste bedrijven in Woerden",
      "historische binnenstad Woerden",
      "zakelijke diensten Woerden",
      "landbouw Woerden"
    ],
    relatedCities: ["utrecht", "amersfoort", "oudenrijn", "vianen"],
    contentSections: {
      intro: "Woerden is een historische stad in het groene hart van Nederland, gelegen aan de rivier de Rijn. De stad combineert een rijk verleden met een levendig heden.",
      history: "Woerden werd gesticht door de Romeinen en ontwikkelde zich tot een belangrijk handelscentrum. De stad heeft een goed bewaarde historische binnenstad met karakteristieke grachten.",
      economy: "Woerden heeft een diverse economie met sterke sectoren in landbouw, zakelijke diensten en retail. De stad fungeert als regionaal centrum voor het omliggende platteland.",
      landmarks: "De historische binnenstad met grachten, het Stadsmuseum, de Nicolaaskerk, het kasteel en de wekelijkse markt zijn bezienswaardigheden.",
      localTips: "Woerden is perfect voor wie houdt van historische sfeer en groene omgeving. De stad heeft goede OV-verbindingen en ligt centraal in Nederland."
    }
  },

  "de-bilt": {
    slug: "de-bilt",
    name: "De Bilt",
    province: "Utrecht",
    primaryKeywords: [
      "De Bilt",
      "bedrijven De Bilt",
      "groene long De Bilt",
      "ondernemen De Bilt",
      "zakelijk De Bilt",
      "KNMI De Bilt",
      "werk De Bilt"
    ],
    longTailKeywords: [
      "beste bedrijven in De Bilt",
      "groene woonomgeving De Bilt",
      "zakelijke diensten De Bilt",
      "hoofdkantoren De Bilt"
    ],
    relatedCities: ["utrecht", "zeist", "bilthoven", "maarn"],
    contentSections: {
      intro: "De Bilt is een groene forensenstad in de provincie Utrecht, bekend als de groene long van Utrecht. De stad biedt een hoge levenskwaliteit met veel groen en rust.",
      history: "De Bilt ontwikkelde zich als landgoederenstad met veel buitenplaatsen in de 17e en 18e eeuw. Het KNMI is hier gevestigd vanwege de centrale ligging.",
      economy: "De Bilt heeft een economie gericht op zakelijke diensten en kennisintensieve bedrijven. Veel hoofdkantoren zijn hier gevestigd vanwege de rustige locatie nabij Utrecht.",
      landmarks: "De landgoederen, het KNMI, de groene lanen, het dorpscentrum, de historische boerderijen en de bossen zijn bezienswaardigheden.",
      localTips: "De Bilt is ideaal voor wie rust en groen zoekt maar toch dichtbij Utrecht wil wonen. Uitstekende fiets- en wandelroutes door de bosrijke omgeving."
    }
  },

  soest: {
    slug: "soest",
    name: "Soest",
    province: "Utrecht",
    primaryKeywords: [
      "Soest",
      "bedrijven Soest",
      "bossen Soest",
      "ondernemen Soest",
      "zakelijk Soest",
      "Heuvelrug Soest",
      "werk Soest"
    ],
    longTailKeywords: [
      "beste bedrijven in Soest",
      "bossen en heide Soest",
      "zakelijke diensten Soest",
      "woonstad Soest"
    ],
    relatedCities: ["utrecht", "baarn", "zeist", "amersfoort"],
    contentSections: {
      intro: "Soest ligt aan de rand van de Utrechtse Heuvelrug en is omgeven door uitgestrekte bossen en heidevelden. De stad biedt een unieke combinatie van natuur en bereikbaarheid.",
      history: "Soest ontwikkelde zich van een agrarisch dorp tot een forensenstad. De stad heeft een rijke historie met middeleeuwse roots en veel oude boerderijen.",
      economy: "Soest heeft een diverse economie met een mix van lokale middenstand, zakelijke diensten en recreatieve sector. De nabijheid van natuur trekt veel bezoekers.",
      landmarks: "De Soesterduinen, het landgoed Pijnenburg, de historische dorpskern, de vuurtoren en de bossen zijn bezienswaardigheden.",
      localTips: "Soest is perfect voor natuurliefhebbers. De Soesterduinen bieden uitstekende mogelijkheden voor wandelen, mountainbiken en paardrijden. Goede verbindingen met Utrecht."
    }
  }
};

/**
 * Get city keywords by slug
 */
export function getCityKeywords(slug: string) {
  const normalizedSlug = stripSeoSlug(slug);
  return CITY_KEYWORDS[normalizedSlug] || null;
}

/**
 * Helper function to strip SEO slug prefix
 */
function stripSeoSlug(slug: string): string {
  // Remove common prefixes
  const prefixes = ['nederland/', 'utrecht/', 'amsterdam/', 'rotterdam/', 'den-haag/'];
  let normalized = slug;
  for (const prefix of prefixes) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.slice(prefix.length);
    }
  }
  return normalized.replace(/[^a-z0-9-]/gi, '');
}
