"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Folder, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { ScreenshotCategory } from "@/types/screenshot";
import { categoryGradients } from "@/lib/category-styles";
import { formatRelativeDate } from "@/utils/format-date";
import { renameProject, deleteProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  coverCategory,
  coverImages = [],
}: {
  project: { id: string; name: string; updatedAt: string };
  count: number;
  coverCategory?: ScreenshotCategory;
  coverImages?: string[];
}) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleRename() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError("");
    startTransition(async () => {
      const result = await renameProject(project.id, trimmed);
      if (result.error) {
        setError(result.error);
        return;
      }
      setRenameOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDeleteOpen(false);
      router.refresh();
    });
  }

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
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#111] backdrop-blur-sm transition-colors hover:bg-white"
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
                <DropdownMenuItem
                  onClick={() => {
                    setName(project.name);
                    setError("");
                    setRenameOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setError("");
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ProjectCover
            images={coverImages}
            coverCategory={coverCategory}
          />

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

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent showCloseButton className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Give this project a new name.</DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
            }}
            autoFocus
          />
          {error && <p className="text-[12.5px] text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              disabled={!name.trim() || pending}
              onClick={handleRename}
            >
              {pending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{project.name}&rdquo;?</DialogTitle>
            <DialogDescription>
              Screenshots inside stay in your library but leave this project.
              This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-[12.5px] text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={handleDelete}
            >
              {pending ? "Deleting..." : "Delete project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProjectCover({
  images,
  coverCategory,
}: {
  images: string[];
  coverCategory?: ScreenshotCategory;
}) {
  if (images.length === 0) {
    return (
      <div
        className={`relative flex h-32 w-full items-center justify-center bg-gradient-to-br ${coverCategory ? categoryGradients[coverCategory] : emptyGradient}`}
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
