"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  Trash2,
  ExternalLink,
  ClipboardCopy,
  Check,
  FolderInput,
  FolderMinus,
} from "lucide-react";
import type { Screenshot } from "@/types/screenshot";
import type { ProjectRow } from "@/types/db";
import { categoryGradients } from "@/lib/category-styles";
import { floatingIconButtonClass } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScreenshotLightbox } from "@/components/shared/screenshot-lightbox";
import { cn } from "@/lib/utils";
import { moveScreenshot, deleteScreenshot, setFavorite } from "@/app/actions/screenshots";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function ScreenshotCard({
  screenshot,
  projects = [],
}: {
  screenshot: Screenshot;
  projects?: ProjectRow[];
}) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleCopyLink() {
    await navigator.clipboard.writeText(screenshot.imageUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
  }

  function handleMove(projectId: string | null) {
    startTransition(async () => {
      await moveScreenshot(screenshot.id, projectId);
      router.refresh();
    });
  }

  function handleToggleFavorite() {
    startTransition(async () => {
      await setFavorite(screenshot.id, !screenshot.isFavorite);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteScreenshot(screenshot.id);
      setDeleteOpen(false);
      router.refresh();
    });
  }

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
          <QuickAction
            icon={Heart}
            label={screenshot.isFavorite ? "Unfavorite" : "Favorite"}
            onClick={handleToggleFavorite}
            iconClassName={cn(
              screenshot.isFavorite && "fill-red-500 text-red-500",
            )}
          />
          <QuickAction
            icon={linkCopied ? Check : ClipboardCopy}
            label="Copy image link"
            onClick={handleCopyLink}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Move to project"
                  onClick={(e) => e.stopPropagation()}
                  className={floatingIconButtonClass}
                />
              }
            >
              <FolderInput className="h-[13px] w-[13px]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              {screenshot.projectId && (
                <>
                  <DropdownMenuItem onClick={() => handleMove(null)}>
                    <FolderMinus className="h-4 w-4" />
                    Remove from project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {projects.length === 0 ? (
                <DropdownMenuItem disabled>No projects yet</DropdownMenuItem>
              ) : (
                projects.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    disabled={p.id === screenshot.projectId}
                    onClick={() => handleMove(p.id)}
                  >
                    {p.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <QuickAction
            icon={ExternalLink}
            label="Open"
            onClick={() => setLightboxOpen(true)}
          />
          <QuickAction
            icon={Trash2}
            label="Delete"
            onClick={() => setDeleteOpen(true)}
          />
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

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent
          showCloseButton
          className="sm:max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Delete this screenshot?</DialogTitle>
            <DialogDescription>
              &ldquo;{screenshot.title}&rdquo; will be permanently removed. This
              can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={handleDelete}
            >
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={floatingIconButtonClass}
    >
      <Icon className={cn("h-[13px] w-[13px]", iconClassName)} />
    </button>
  );
}
