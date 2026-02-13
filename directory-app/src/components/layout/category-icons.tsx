import {
    Utensils, ShoppingBag, Scissors, HeartPulse, Dumbbell,
    Hammer, HardHat, Sparkles, Car, Bike, Laptop, Briefcase,
    GraduationCap, Baby, PawPrint, Home, Bed, Ticket,
    PartyPopper, Palette, Sofa, Truck, Scale, PiggyBank,
    Printer, Factory, Leaf, HandHeart, Users, Building2,
    LucideIcon
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
    // Exact matches from CSV slugs or names
    '/utrecht/eten-drinken': Utensils,
    '/utrecht/winkels': ShoppingBag,
    '/utrecht/beauty': Scissors,
    '/utrecht/gezondheid': HeartPulse,
    '/utrecht/sport': Dumbbell,
    '/utrecht/klussen': Hammer,
    '/utrecht/bouw-renovatie': HardHat,
    '/utrecht/schoonmaak': Sparkles,
    '/utrecht/auto-vervoer': Car,
    '/utrecht/fiets': Bike,
    '/utrecht/it-tech': Laptop,
    '/utrecht/zakelijk': Briefcase,
    '/utrecht/onderwijs': GraduationCap,
    '/utrecht/kind-gezin': Baby,
    '/utrecht/huisdieren': PawPrint,
    '/utrecht/wonen': Home,
    '/utrecht/overnachten': Bed,
    '/utrecht/uitgaan': Ticket,
    '/utrecht/bruiloft-events': PartyPopper,
    '/utrecht/cultuur': Palette,
    '/utrecht/interieur': Sofa,
    '/utrecht/logistiek': Truck,
    '/utrecht/juridisch': Scale,
    '/utrecht/financieel': PiggyBank,
    '/utrecht/druk-reclame': Printer,
    '/utrecht/productie': Factory,
    '/utrecht/duurzaam': Leaf,
    '/utrecht/lokaal': HandHeart,
    '/utrecht/gemeenschap': Users,
    '/utrecht/diensten': Building2,

    // Fallback mapping if lookup by name is needed instead of slug
    'Eten & Drinken': Utensils,
    'Winkels & Retail': ShoppingBag,
    'Beauty & Kappers': Scissors,
    'Gezondheid & Zorg': HeartPulse,
    'Sport & Fitness': Dumbbell,
    'Klussen, Reparatie & Onderhoud': Hammer,
    'Bouw & Renovatie': HardHat,
    'Schoonmaak & Huishoudelijke diensten': Sparkles,
    'Auto, Taxi & Vervoer': Car,
    'Fiets & Micromobiliteit': Bike,
    'IT, Telefoon & Tech': Laptop,
    'Zakelijke diensten (B2B)': Briefcase,
    'Onderwijs & Cursussen': GraduationCap,
    'Kind & Gezin': Baby,
    'Huisdieren': PawPrint,
    'Wonen & Vastgoed': Home,
    'Overnachten': Bed,
    'Uitgaan, Vrije tijd & Toerisme': Ticket,
    'Bruiloft & Events': PartyPopper,
    'Kunst, Media & Cultuur': Palette,
    'Interieur & Woondecoratie': Sofa,
    'Koerier, Verhuizen & Logistiek': Truck,
    'Juridisch & Administratief': Scale,
    'Financieel & Verzekeren': PiggyBank,
    'Drukwerk & Reclame': Printer,
    'Productie, Werkplaats & Maatwerk': Factory,
    'Duurzaam & Energie': Leaf,
    'Lokaal & Buurtinitiatieven': HandHeart,
    'Gemeenschap & Sociale organisaties': Users,
    'Publieke diensten': Building2,
};

export const getCategoryIcon = (slugOrName: string): LucideIcon => {
    // Try precise match
    if (categoryIcons[slugOrName]) return categoryIcons[slugOrName];

    // Try removing ' in Utrecht' suffix for name matching
    const cleanName = slugOrName.replace(' in Utrecht', '');
    if (categoryIcons[cleanName]) return categoryIcons[cleanName];

    // Default icon
    return Building2;
};
