import { SearchHero } from "@/features/search/search-hero";
import { QuickFilters } from "@/features/search/quick-filters";
import { MasonryGrid } from "@/components/shared/masonry-grid";
import { mockScreenshots } from "@/lib/mock-data";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Home() {
  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col items-center gap-10 pt-4 text-center">
        <div className="space-y-2">
          <h1 className="text-[44px] font-semibold tracking-tight text-foreground">
            {getGreeting()}, Farhan.
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {mockScreenshots.length.toLocaleString()} screenshots &middot;
            Everything is instantly searchable.
          </p>
        </div>

        <SearchHero />
        <QuickFilters />
      </section>

      <section className="space-y-5">
        <h2 className="text-[19px] font-semibold tracking-tight text-foreground">
          Recent Screenshots
        </h2>
        <MasonryGrid screenshots={mockScreenshots} />
      </section>
    </div>
  );
}
