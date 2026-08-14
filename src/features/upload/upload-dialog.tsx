"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadScreenshot } from "@/app/actions/screenshots";
import { createProject } from "@/app/actions/projects";
import type { ProjectRow } from "@/types/db";
import { CATEGORIES, type ScreenshotCategory } from "@/lib/categories";

type PendingFile = {
  file: File;
  title: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

function titleFromFilename(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

export function UploadDialog({ projects }: { projects: ProjectRow[] }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [category, setCategory] = useState<ScreenshotCategory>("Ideas");
  const [tags, setTags] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectList, setProjectList] = useState(projects);
  const [newProjectName, setNewProjectName] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).map((file) => ({
      file,
      title: titleFromFilename(file.name),
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...next]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTitle(index: number, title: string) {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, title } : f)));
  }

  async function handleCreateProject() {
    const name = newProjectName.trim();
    if (!name) return;
    const result = await createProject(name);
    if (result.data) {
      setProjectList((prev) => [result.data, ...prev]);
      setProjectId(result.data.id);
      setNewProjectName("");
    }
  }

  function handleUpload() {
    if (files.length === 0) return;

    startTransition(async () => {
      await Promise.all(
        files.map(async (item, i) => {
          setFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f)),
          );

          const dimensions = await readImageDimensions(item.file);

          const formData = new FormData();
          formData.set("file", item.file);
          formData.set("title", item.title || titleFromFilename(item.file.name));
          formData.set("category", category);
          formData.set("tags", tags);
          formData.set("projectId", projectId);
          formData.set("width", String(dimensions.width));
          formData.set("height", String(dimensions.height));

          const result = await uploadScreenshot(formData);

          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? result.error
                  ? { ...f, status: "error", error: result.error }
                  : { ...f, status: "done" }
                : f,
            ),
          );
        }),
      );
    });
  }

  function reset() {
    setFiles([]);
    setCategory("Ideas");
    setTags("");
    setProjectId("");
    setNewProjectName("");
  }

  const allDone = files.length > 0 && files.every((f) => f.status === "done");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button size="sm" className="gap-1.5 rounded-full" />}>
        <Upload className="h-[15px] w-[15px]" />
        Upload
      </DialogTrigger>
      <DialogContent showCloseButton className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload screenshots</DialogTitle>
          <DialogDescription>
            Add images to your library, optionally into a project.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-8 text-center transition-colors hover:border-foreground/25 hover:bg-muted/50"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground">
            Click to choose images
          </span>
        </button>

        {files.length > 0 && (
          <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto">
            {files.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item.title}
                  onChange={(e) => updateTitle(index, e.target.value)}
                  disabled={item.status !== "pending"}
                  className="flex-1"
                />
                {item.status === "uploading" && (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                )}
                {item.status === "done" && (
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                )}
                {item.status === "error" && (
                  <span className="shrink-0 text-[11px] text-destructive">
                    {item.error ?? "Failed"}
                  </span>
                )}
                {item.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label="Remove file"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="upload-category" className="text-[13px] font-medium text-foreground">
              Category
            </label>
            <select
              id="upload-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ScreenshotCategory)}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="upload-project" className="text-[13px] font-medium text-foreground">
              Project
            </label>
            <select
              id="upload-project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">No project</option>
              {projectList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">
              New project
            </label>
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleCreateProject}
            disabled={!newProjectName.trim()}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">
            Tags (comma separated)
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="React, Error"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            disabled={files.length === 0 || pending}
            onClick={allDone ? () => setOpen(false) : handleUpload}
          >
            {pending
              ? "Uploading..."
              : allDone
                ? "Done"
                : `Upload ${files.length || ""}`.trim()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return createImageBitmap(file).then((bitmap) => {
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  });
}
