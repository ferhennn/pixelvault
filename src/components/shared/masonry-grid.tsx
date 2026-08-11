import type { Screenshot } from "@/types/screenshot";
import type { ProjectRow } from "@/types/db";
import { ScreenshotCard } from "@/components/shared/screenshot-card";

export function MasonryGrid({
  screenshots,
  projects = [],
}: {
  screenshots: Screenshot[];
  projects?: ProjectRow[];
}) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {screenshots.map((screenshot) => (
        <ScreenshotCard
          key={screenshot.id}
          screenshot={screenshot}
          projects={projects}
        />
      ))}
    </div>
  );
}
