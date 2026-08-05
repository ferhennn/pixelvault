"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { quickFilters } from "@/lib/mock-data";

export function QuickFilters() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {quickFilters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActive((v) => (v === filter ? null : filter))}
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
