"use client";

import { useMemo, useState } from "react";
import { SearchHero } from "@/features/search/search-hero";
import { QuickFilters } from "@/features/search/quick-filters";
import { MasonryGrid } from "@/components/shared/masonry-grid";
import type { Screenshot } from "@/types/screenshot";
import type { ProjectRow } from "@/types/db";
import type { ScreenshotCategory } from "@/lib/categories";
import { pluralize } from "@/utils/pluralize";

export function SearchPage({
  screenshots,
  projects,
  aiCopy = false,
}: {
  screenshots: Screenshot[];
  projects: ProjectRow[];
  aiCopy?: boolean;
}) {
  const [category, setCategory] = useState<ScreenshotCategory | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return screenshots.filter((s) => {
      if (category && s.category !== category) return false;
      if (!needle) return true;
      return (
        s.title.toLowerCase().includes(needle) ||
        s.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [screenshots, category, query]);

  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-2 pt-4 text-center">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          {aiCopy ? "AI Search" : "Search"}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {aiCopy
            ? "Matches titles and tags today — smarter semantic search is on the way."
            : "Find screenshots by title or tag."}
        </p>
      </div>

      <section className="flex flex-col items-center gap-6">
        <SearchHero query={query} onQueryChange={setQuery} />
        <QuickFilters active={category} onChange={setCategory} />
      </section>

      <section className="space-y-5">
        <p className="text-[13.5px] text-muted-foreground">
          {filtered.length.toLocaleString()}{" "}
          {pluralize(filtered.length, "result")}
        </p>
        {filtered.length > 0 ? (
          <MasonryGrid screenshots={filtered} projects={projects} />
        ) : (
          <p className="text-[13.5px] text-muted-foreground">
            {screenshots.length === 0
              ? "No screenshots yet. Upload your first one from the top bar."
              : "No screenshots match this search."}
          </p>
        )}
      </section>
    </div>
  );
}
