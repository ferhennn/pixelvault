"use client";

import { useMemo, useState } from "react";
import { SearchHero } from "@/features/search/search-hero";
import { QuickFilters } from "@/features/search/quick-filters";
import { MasonryGrid } from "@/components/shared/masonry-grid";
import type { Screenshot } from "@/types/screenshot";
import type { ProjectRow } from "@/types/db";
import type { ScreenshotCategory } from "@/lib/categories";

export function HomeGallery({
  screenshots,
  projects,
}: {
  screenshots: Screenshot[];
  projects: ProjectRow[];
}) {
  const [category, setCategory] = useState<ScreenshotCategory | null>(null);

  const filtered = useMemo(
    () =>
      category
        ? screenshots.filter((s) => s.category === category)
        : screenshots,
    [screenshots, category],
  );

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col items-center gap-10 pt-4 text-center">
        <SearchHero />
        <QuickFilters active={category} onChange={setCategory} />
      </section>

      <section className="space-y-5">
        <h2 className="text-[19px] font-semibold tracking-tight text-foreground">
          Recent Screenshots
        </h2>
        {filtered.length > 0 ? (
          <MasonryGrid screenshots={filtered} projects={projects} />
        ) : (
          <p className="text-[13.5px] text-muted-foreground">
            {screenshots.length === 0
              ? "No screenshots yet. Upload your first one from the top bar."
              : "No screenshots match this filter."}
          </p>
        )}
      </section>
    </div>
  );
}
