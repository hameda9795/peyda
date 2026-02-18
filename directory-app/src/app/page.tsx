import "@/app/home.css";
import { NetherlandsMapSection } from "@/components/home/NetherlandsMapSection";
import { PopularBusinessesSection, CategoryScrollSection } from "@/components/home/CategoryScrollSection";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { BusinessPassportSection } from "@/components/home/BusinessPassportSection";
import { FaqSection } from "@/components/home/FaqSection";
import { PremiumFooter } from "@/components/layout/PremiumFooter";
import { getBusinessesByCategorySlug, getAllFeaturedBusinesses, getProvinceStats, getTopCitiesByBusinessCount, getTotalBusinessCount, getBusinessCountsByCity } from "@/lib/actions/business";
import { getCategories } from "@/lib/actions/categories";
import { CATEGORY_ICONS } from "@/lib/netherlands-data";

// Category icons mapping
const categoryIcons: Record<string, string> = {
  "eten-drinken": "🍽️",
  "beauty": "💅",
  "klussen": "🔧",
  "gezondheid": "🏥",
  "it-tech": "💻",
  "winkels": "🛍️",
  "financieel": "💰",
  "automotive": "🚗",
  "onderwijs": "📚",
  "sport": "⚽",
  "kunst": "🎨",
  "reizen": "✈️",
  "huisdieren": "🐕",
  "juridisch": "⚖️",
  "bouw": "🏗️",
  "media": "📺",
  "mode": "👗",
  "horeca": "🍺",
  "vastgoed": "🏠",
  "schoonmaak": "🧹",
  "beveiliging": "🔒",
  "entertainment": "🎭",
  "energie": "⚡",
  "transport": "🚚",
  "landbouw": "🌾",
  "telecom": "📱",
  "marketing": "📈",
  "consulting": "💼",
  "verzekeringen": "🛡️",
  "productie": "🏭",
};

// Gradient patterns for variety
const gradientPatterns = [
  "from-orange-50 via-amber-50 to-yellow-50",
  "from-emerald-50 via-teal-50 to-cyan-50",
  "from-slate-50 via-gray-50 to-zinc-100",
  "from-sky-50 via-cyan-50 to-teal-50",
  "from-amber-50 via-orange-50 to-rose-50",
  "from-emerald-50 via-lime-50 to-amber-50",
  "from-blue-50 via-sky-50 to-cyan-50",
  "from-amber-50 via-yellow-50 to-orange-50",
  "from-rose-50 via-orange-50 to-amber-50",
];

function getCleanSlug(slug: string): string {
  return slug
    .replace('/utrecht/', '')
    .replace('/nederland/', '')
    .replace('/', '')
    .toLowerCase();
}

function getCategoryIcon(slug: string): string {
  const cleanSlug = getCleanSlug(slug);
  return categoryIcons[cleanSlug] || CATEGORY_ICONS[cleanSlug] || "📁";
}

function getCategoryGradient(index: number): string {
  return gradientPatterns[index % gradientPatterns.length];
}

export default async function Home() {
  // Fetch all categories from database
  const allCategories = await getCategories();

  // Fetch businesses for each category
  const sectionData = await Promise.all(
    allCategories.map(async (category: any, index: number) => {
      const cleanSlug = getCleanSlug(category.slug);
      const businesses = await getBusinessesByCategorySlug(cleanSlug, 10);

      // Clean the category name
      const cleanName = category.name
        .replace(' in Utrecht', '')
        .replace(' in Nederland', '');

      return {
        slug: cleanSlug,
        title: cleanName,
        icon: getCategoryIcon(category.slug),
        gradient: getCategoryGradient(index),
        businesses,
        subcategoryCount: category._count?.subcategories || 0
      };
    })
  );

  const sectionsWithBusinesses = sectionData.filter(s => s.businesses.length > 0);

  const sectionsToShow = sectionsWithBusinesses
    .sort((a, b) => b.businesses.length - a.businesses.length)
    .slice(0, 8);

  // Fetch popular/most reviewed businesses
  const popularBusinesses = await getAllFeaturedBusinesses(10);

  // Fetch location data for Netherlands section
  const [provinceStats, topCities, totalBusinesses, cityCounts] = await Promise.all([
    getProvinceStats(),
    getTopCitiesByBusinessCount(6),
    getTotalBusinessCount(),
    getBusinessCountsByCity()
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Atlas Hero */}
      <WelcomeSection totalBusinesses={totalBusinesses} />

      {/* Business Passport */}
      <BusinessPassportSection />

      {/* Netherlands Map Section */}
      <NetherlandsMapSection
        provinces={provinceStats}
        topCities={topCities}
        totalBusinesses={totalBusinesses}
      />

      {/* Popular/Most Reviewed Section */}
      <PopularBusinessesSection businesses={popularBusinesses} />

      {/* All Category Sections */}
      {sectionsToShow.map((section, index) => (
        <CategoryScrollSection
          key={section.slug}
          title={section.title}
          icon={section.icon}
          businesses={section.businesses}
          categorySlug={section.slug}
          businessCount={section.businesses.length}
        />
      ))}

      {/* Statistics */}
      <StatsSection
        businessCount={totalBusinesses}
        categoryCount={allCategories.length}
        cityCount={cityCounts.length}
      />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FaqSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Premium Footer */}
      <PremiumFooter />
    </div>
  );
}
