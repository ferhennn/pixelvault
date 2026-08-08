import { MasonryGrid } from "@/components/shared/masonry-grid";
import { getProjects, getScreenshots } from "@/lib/supabase/queries";
import { pluralize } from "@/utils/pluralize";

export default async function FavoritesPage() {
  const [projects, screenshots] = await Promise.all([
    getProjects(),
    getScreenshots(undefined, undefined, true),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          Favorites
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {screenshots.length.toLocaleString()}{" "}
          {pluralize(screenshots.length, "screenshot")}
        </p>
      </div>

      {screenshots.length > 0 ? (
        <MasonryGrid screenshots={screenshots} projects={projects} />
      ) : (
        <p className="text-[13.5px] text-muted-foreground">
          No favorites yet. Tap the heart on a screenshot to save it here.
        </p>
      )}
    </div>
  );
}
