"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

export function useProjectActions(
  project: { id: string; name: string },
  options?: { onDeleted?: () => void },
) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function openRename() {
    setName(project.name);
    setError("");
    setRenameOpen(true);
  }

  function openDelete() {
    setError("");
    setDeleteOpen(true);
  }

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
      options?.onDeleted?.();
      router.refresh();
    });
  }

  return {
    renameOpen,
    setRenameOpen,
    deleteOpen,
    setDeleteOpen,
    name,
    setName,
    error,
    pending,
    openRename,
    openDelete,
    handleRename,
    handleDelete,
  };
}

export type ProjectActions = ReturnType<typeof useProjectActions>;

export function ProjectActionDialogs({
  projectName,
  actions,
}: {
  projectName: string;
  actions: ProjectActions;
}) {
  return (
    <>
      <Dialog open={actions.renameOpen} onOpenChange={actions.setRenameOpen}>
        <DialogContent showCloseButton className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Give this project a new name.</DialogDescription>
          </DialogHeader>
          <Input
            value={actions.name}
            onChange={(e) => actions.setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") actions.handleRename();
            }}
            autoFocus
          />
          {actions.error && (
            <p role="alert" className="text-[12.5px] text-destructive">
              {actions.error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              disabled={!actions.name.trim() || actions.pending}
              onClick={actions.handleRename}
            >
              {actions.pending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actions.deleteOpen} onOpenChange={actions.setDeleteOpen}>
        <DialogContent showCloseButton className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
            <DialogDescription>
              Screenshots inside stay in your library but leave this project.
              This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          {actions.error && (
            <p role="alert" className="text-[12.5px] text-destructive">
              {actions.error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              disabled={actions.pending}
              onClick={actions.handleDelete}
            >
              {actions.pending ? "Deleting..." : "Delete project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
