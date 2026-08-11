"use client";

import { cn } from "@/lib/utils";
import { CATEGORIES, type ScreenshotCategory } from "@/lib/categories";

export function QuickFilters({
  active,
  onChange,
}: {
  active: ScreenshotCategory | null;
  onChange: (category: ScreenshotCategory | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {CATEGORIES.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(active === filter ? null : filter)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors",
            active === filter
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground/70 hover:border-foreground/20 hover:text-foreground",
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
