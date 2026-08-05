"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const examples = [
  "Supabase auth",
  "Landing page",
  "404 error",
  "Tailwind animation",
];

export function SearchHero() {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search screenshots..."
          className="w-full rounded-full border border-border bg-card py-4 pl-12 pr-5 text-[16px] shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus:shadow-md focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => setQuery(example)}
            className="rounded-full border border-border px-3.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
