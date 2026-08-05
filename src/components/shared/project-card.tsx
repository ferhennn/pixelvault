"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Folder } from "lucide-react";
import type { ScreenshotCategory } from "@/types/screenshot";
import { categoryGradients } from "@/lib/category-styles";
import { formatRelativeDate } from "@/utils/format-date";

const emptyGradient = "from-[#8e8e93] to-[#48484a]";

export function ProjectCard({
  project,
  count,
  coverCategory,
}: {
  project: { id: string; name: string; updatedAt: string };
  count: number;
  coverCategory?: ScreenshotCategory;
}) {
  return (
    <Link href={`/projects/${project.id}`}>
      <motion.article
        className="group overflow-hidden rounded-2xl border border-border bg-card"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`relative flex h-32 w-full items-center justify-center bg-gradient-to-br ${coverCategory ? categoryGradients[coverCategory] : emptyGradient}`}
        >
          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
          <Folder className="h-10 w-10 text-white/90" strokeWidth={1.5} />
        </div>

        <div className="space-y-1 p-3.5">
          <h3 className="line-clamp-1 text-[13.5px] font-medium leading-snug text-foreground">
            {project.name}
          </h3>
          <p className="text-[12px] text-muted-foreground">
            {count} screenshot{count === 1 ? "" : "s"} &middot; Updated{" "}
            {formatRelativeDate(project.updatedAt)}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}
