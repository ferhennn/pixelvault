"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Code,
  Palette,
  AlertTriangle,
  FileText,
  Receipt,
  Lightbulb,
  Sparkles,
  LayoutTemplate,
  type LucideIcon,
} from "lucide-react";
import { pluralize } from "@/utils/pluralize";
import { categoryToSlug, type ScreenshotCategory } from "@/lib/categories";

const categoryIcons: Record<ScreenshotCategory, LucideIcon> = {
  Code: Code,
  Design: Palette,
  Errors: AlertTriangle,
  Documents: FileText,
  Receipts: Receipt,
  Ideas: Lightbulb,
  AI: Sparkles,
  "UI Inspiration": LayoutTemplate,
};

const emptyGradient = "from-[#8e8e93] to-[#48484a]";

export function CollectionCard({
  category,
  count,
  coverImages = [],
}: {
  category: ScreenshotCategory;
  count: number;
  coverImages?: string[];
}) {
  const Icon = categoryIcons[category];

  return (
    <Link href={`/collections/${categoryToSlug(category)}`}>
      <motion.article
        className="group relative overflow-hidden rounded-2xl border border-border bg-card"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <CollectionCover images={coverImages} icon={Icon} />

        <div className="space-y-1 p-3.5">
          <h3 className="line-clamp-1 text-[13.5px] font-medium leading-snug text-foreground">
            {category}
          </h3>
          <p className="text-[12px] text-muted-foreground">
            {count} {pluralize(count, "screenshot")}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

function CollectionCover({
  images,
  icon: Icon,
}: {
  images: string[];
  icon: LucideIcon;
}) {
  if (images.length === 0) {
    return (
      <div
        className={`relative flex h-32 w-full items-center justify-center bg-gradient-to-br ${emptyGradient}`}
      >
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
        <Icon className="h-10 w-10 text-white/90" strokeWidth={1.5} />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative h-32 w-full bg-muted">
        <Image src={images[0]} alt="" fill sizes="300px" className="object-cover" />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
      </div>
    );
  }

  return (
    <div className="relative grid h-32 w-full grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden bg-border">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="relative bg-muted">
          {images[i] && (
            <Image src={images[i]} alt="" fill sizes="150px" className="object-cover" />
          )}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
    </div>
  );
}
