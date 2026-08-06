import { SearchHero } from "@/features/search/search-hero";
import { QuickFilters } from "@/features/search/quick-filters";
import { MasonryGrid } from "@/components/shared/masonry-grid";
import { getScreenshots, getProjects } from "@/lib/supabase/queries";
import { getUser } from "@/lib/supabase/dal";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default async function Home() {
  const [screenshots, projects, user] = await Promise.all([
    getScreenshots(),
    getProjects(),
    getUser(),
  ]);
  const name = user?.email?.split("@")[0] ?? "";

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col items-center gap-10 pt-4 text-center">
        <div className="space-y-2">
          <h1 className="text-[44px] font-semibold tracking-tight text-foreground">
            {getGreeting()}{name && `, ${name}`}.
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {screenshots.length.toLocaleString()} screenshot
            {screenshots.length === 1 ? "" : "s"} &middot; Everything is
            instantly searchable.
          </p>
        </div>

        <SearchHero />
        <QuickFilters />
      </section>

      <section className="space-y-5">
        <h2 className="text-[19px] font-semibold tracking-tight text-foreground">
          Recent Screenshots
        </h2>
        {screenshots.length > 0 ? (
          <MasonryGrid screenshots={screenshots} projects={projects} />
        ) : (
          <p className="text-[13.5px] text-muted-foreground">
            No screenshots yet. Upload your first one from the top bar.
          </p>
        )}
      </section>
    </div>
  );
}
