"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function ProjectHeaderActions({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const router = useRouter();
  const actions = useProjectActions(
    { id: projectId, name: projectName },
    { onDeleted: () => router.push("/projects") },
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="icon-sm" aria-label="Project options" />}
        >
          <MoreHorizontal className="h-[15px] w-[15px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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

      <ProjectActionDialogs projectName={projectName} actions={actions} />
    </>
  );
}
