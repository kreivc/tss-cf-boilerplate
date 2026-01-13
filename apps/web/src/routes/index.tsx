import { createFileRoute } from "@tanstack/react-router";
import { CategoryGrid } from "@/components/category-grid";
import { HeroSlider } from "@/components/hero-slider";
import { QuickAccess } from "@/components/quick-access";
import { TrendingSection } from "@/components/trending-section";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Hero Slider */}
      <section className="py-6">
        <HeroSlider />
      </section>

      {/* Quick Access Bar */}
      <QuickAccess />

      {/* Trending Section */}
      <TrendingSection />

      {/* Category Grid */}
      <CategoryGrid />
    </main>
  );
}
