import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CategoryGrid } from "@/components/category-grid";
import { HeroSlider } from "@/components/hero-slider";
import { QuickAccess } from "@/components/quick-access";
import { TrendingSection } from "@/components/trending-section";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: async ({ context }) => {
    // Prefetch all active games for landing page
    await context.queryClient.ensureQueryData(
      orpc.game.getAll.queryOptions({ input: { activeOnly: true } })
    );
  },
});

function HomeComponent() {
  const gamesQuery = useSuspenseQuery(
    orpc.game.getAll.queryOptions({ input: { activeOnly: true } })
  );

  // Memoize games to prevent unnecessary re-renders of child components
  const games = useMemo(() => gamesQuery.data.data, [gamesQuery.data.data]);

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Hero Slider */}
      <section className="py-6">
        <HeroSlider />
      </section>

      {/* Quick Access Bar */}
      <QuickAccess />

      {/* Trending Section */}
      <TrendingSection games={games} />

      {/* Category Grid */}
      <CategoryGrid games={games} />
    </main>
  );
}
