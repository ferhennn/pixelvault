import type { Screenshot } from "@/types/screenshot";
import { ScreenshotCard } from "@/components/shared/screenshot-card";

export function MasonryGrid({ screenshots }: { screenshots: Screenshot[] }) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
      {screenshots.map((screenshot) => (
        <ScreenshotCard key={screenshot.id} screenshot={screenshot} />
      ))}
    </div>
  );
}
