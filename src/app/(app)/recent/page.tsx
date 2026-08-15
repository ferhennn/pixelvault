import { MasonryGrid } from "@/components/shared/masonry-grid";
import { getProjects, getScreenshots } from "@/lib/supabase/queries";
import { pluralize } from "@/utils/pluralize";

const RECENT_LIMIT = 60;

export default async function RecentPage() {
  const [projects, screenshots] = await Promise.all([
    getProjects(),
    getScreenshots(),
  ]);
  const recent = screenshots.slice(0, RECENT_LIMIT);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          Recent
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Your {recent.length.toLocaleString()} most recently added{" "}
          {pluralize(recent.length, "screenshot")}.
        </p>
      </div>

      {recent.length > 0 ? (
        <MasonryGrid screenshots={recent} projects={projects} />
      ) : (
        <p className="text-[13.5px] text-muted-foreground">
          No screenshots yet. Upload your first one from the top bar.
        </p>
      )}
    </div>
  );
}
