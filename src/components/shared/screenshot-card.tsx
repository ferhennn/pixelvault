"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Trash2, ExternalLink, ClipboardCopy } from "lucide-react";
import type { Screenshot } from "@/types/screenshot";
import { categoryGradients } from "@/lib/category-styles";
import { Badge } from "@/components/ui/badge";
import { ScreenshotLightbox } from "@/components/shared/screenshot-lightbox";

export function ScreenshotCard({ screenshot }: { screenshot: Screenshot }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <motion.article
      className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setLightboxOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setLightboxOpen(true);
        }}
        className={`relative flex w-full cursor-pointer items-end bg-gradient-to-br ${categoryGradients[screenshot.category]}`}
        style={{ aspectRatio: screenshot.aspectRatio }}
      >
        {screenshot.imageUrl && (
          <Image
            src={screenshot.imageUrl}
            alt={screenshot.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 transition-opacity duration-200 group-hover:from-black/80" />

        <div className="absolute right-2.5 top-2.5 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <QuickAction icon={Heart} label="Favorite" />
          <QuickAction icon={ClipboardCopy} label="Copy OCR" />
          <QuickAction
            icon={ExternalLink}
            label="Open"
            onClick={() => setLightboxOpen(true)}
          />
          <QuickAction icon={Trash2} label="Delete" />
        </div>

        {screenshot.tags.length > 0 && (
          <div className="relative flex w-full flex-wrap items-center gap-1.5 p-3">
            {screenshot.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-white/20 bg-black/30 px-2 py-0 text-[11px] font-normal text-white backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {screenshot.imageUrl && (
        <ScreenshotLightbox
          screenshot={screenshot}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      )}
    </motion.article>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#111] backdrop-blur-sm transition-colors hover:bg-white"
    >
      <Icon className="h-[13px] w-[13px]" />
    </button>
  );
}
