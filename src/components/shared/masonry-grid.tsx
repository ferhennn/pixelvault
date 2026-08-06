import type { Screenshot } from "@/types/screenshot";
import type { ProjectRow } from "@/types/db";
import { ScreenshotCard } from "@/components/shared/screenshot-card";

export function MasonryGrid({
  screenshots,
  projects = [],
  currentProjectId,
}: {
  screenshots: Screenshot[];
  projects?: ProjectRow[];
  currentProjectId?: string;
}) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {screenshots.map((screenshot) => (
        <ScreenshotCard
          key={screenshot.id}
          screenshot={screenshot}
          projects={projects}
          currentProjectId={currentProjectId}
        />
      ))}
    </div>
  );
}
