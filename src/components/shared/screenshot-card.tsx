"use client";

import { motion } from "framer-motion";
import { Heart, Trash2, ExternalLink, ClipboardCopy } from "lucide-react";
import type { Screenshot } from "@/types/screenshot";
import { categoryGradients } from "@/lib/category-styles";
import { formatRelativeDate } from "@/utils/format-date";
import { Badge } from "@/components/ui/badge";

export function ScreenshotCard({ screenshot }: { screenshot: Screenshot }) {
  return (
    <motion.article
      className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`relative flex w-full items-end bg-gradient-to-br ${categoryGradients[screenshot.category]}`}
        style={{ aspectRatio: screenshot.aspectRatio }}
      >
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/25" />

        <div className="absolute right-2.5 top-2.5 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <QuickAction icon={Heart} label="Favorite" />
          <QuickAction icon={ClipboardCopy} label="Copy OCR" />
          <QuickAction icon={ExternalLink} label="Open" />
          <QuickAction icon={Trash2} label="Delete" />
        </div>
      </div>

      <div className="space-y-2 p-3.5">
        <h3 className="line-clamp-2 text-[13.5px] font-medium leading-snug text-foreground">
          {screenshot.title}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className="rounded-full px-2 py-0 text-[11px] font-medium text-foreground/70"
          >
            {screenshot.category}
          </Badge>
          {screenshot.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full border-border px-2 py-0 text-[11px] font-normal text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-[12px] text-muted-foreground">
          {formatRelativeDate(screenshot.createdAt)}
        </p>
      </div>
    </motion.article>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#111] backdrop-blur-sm transition-colors hover:bg-white"
    >
      <Icon className="h-[13px] w-[13px]" />
    </button>
  );
}
