"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Folder, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatRelativeDate } from "@/utils/format-date";
import { pluralize } from "@/utils/pluralize";
import { floatingIconButtonClass } from "@/lib/utils";
import {
  useProjectActions,
  ProjectActionDialogs,
} from "@/components/shared/project-actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const emptyGradient = "from-[#8e8e93] to-[#48484a]";

export function ProjectCard({
  project,
  count,
  coverImages = [],
}: {
  project: { id: string; name: string; updatedAt: string };
  count: number;
  coverImages?: string[];
}) {
  const actions = useProjectActions(project);

  return (
    <>
      <Link href={`/projects/${project.id}`}>
        <motion.article
          className="group relative overflow-hidden rounded-2xl border border-border bg-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute right-2.5 top-2.5 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Project options"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={floatingIconButtonClass}
                  />
                }
              >
                <MoreHorizontal className="h-[15px] w-[15px]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <DropdownMenuItem onClick={actions.openRename}>
                  <Pencil className="h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={actions.openDelete}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ProjectCover images={coverImages} />

          <div className="space-y-1 p-3.5">
            <h3 className="line-clamp-1 text-[13.5px] font-medium leading-snug text-foreground">
              {project.name}
            </h3>
            <p className="text-[12px] text-muted-foreground">
              {count} {pluralize(count, "screenshot")} &middot; Updated{" "}
              {formatRelativeDate(project.updatedAt)}
            </p>
          </div>
        </motion.article>
      </Link>

      <ProjectActionDialogs projectName={project.name} actions={actions} />
    </>
  );
}

function ProjectCover({ images }: { images: string[] }) {
  if (images.length === 0) {
    return (
      <div
        className={`relative flex h-32 w-full items-center justify-center bg-gradient-to-br ${emptyGradient}`}
      >
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
        <Folder className="h-10 w-10 text-white/90" strokeWidth={1.5} />
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
