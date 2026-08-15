import { MasonryGrid } from "@/components/shared/masonry-grid";
import { getDuplicateGroups, getProjects } from "@/lib/supabase/queries";
import { pluralize } from "@/utils/pluralize";

export default async function DuplicatesPage() {
  const [projects, groups] = await Promise.all([
    getProjects(),
    getDuplicateGroups(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          Duplicates
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Screenshots that share the same title and dimensions. {groups.length}{" "}
          {pluralize(groups.length, "group")} found.
        </p>
      </div>

      {groups.length > 0 ? (
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <div key={group.key} className="space-y-3">
              <h2 className="text-[15px] font-medium text-foreground/70">
                {group.screenshots[0].title} &middot; {group.screenshots.length}{" "}
                {group.screenshots.length === 1 ? "copy" : "copies"}
              </h2>
              <MasonryGrid screenshots={group.screenshots} projects={projects} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13.5px] text-muted-foreground">
          No duplicates found. Screenshots are grouped by matching title and
          dimensions.
        </p>
      )}
    </div>
  );
}
