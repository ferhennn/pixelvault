"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ExternalLink, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Screenshot } from "@/types/screenshot";
import { formatRelativeDate } from "@/utils/format-date";
import { renameScreenshot } from "@/app/actions/screenshots";

export function ScreenshotLightbox({
  screenshot,
  open,
  onOpenChange,
}: {
  screenshot: Screenshot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState(screenshot.title);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = title.trim() !== screenshot.title && title.trim().length > 0;

  function handleSave() {
    startTransition(async () => {
      const result = await renameScreenshot(screenshot.id, title);
      if (!result.error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setTitle(screenshot.title);
      }}
    >
      <DialogContent showCloseButton className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{screenshot.title}</DialogTitle>
        </DialogHeader>

        <div className="relative max-h-[60vh] w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={screenshot.imageUrl}
            alt={screenshot.title}
            width={1200}
            height={Math.round(1200 / screenshot.aspectRatio)}
            className="h-auto max-h-[60vh] w-full object-contain"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={!dirty || pending}
            onClick={handleSave}
          >
            {saved ? <Check className="h-4 w-4" /> : pending ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className="rounded-full px-2 py-0 text-[11px] font-medium text-foreground/70"
          >
            {screenshot.category}
          </Badge>
          {screenshot.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full border-border px-2 py-0 text-[11px] font-normal text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[12px] text-muted-foreground">
            {formatRelativeDate(screenshot.createdAt)}
          </p>
          <a
            href={screenshot.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Open original
            <ExternalLink className="h-[13px] w-[13px]" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
