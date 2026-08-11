"use client";

import { Search, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions/auth";
import { UploadDialog } from "@/features/upload/upload-dialog";
import type { ProjectRow } from "@/types/db";

export function TopNav({
  email,
  projects,
}: {
  email: string;
  projects: ProjectRow[];
}) {
  const initial = email.charAt(0).toUpperCase();
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex flex-1 justify-center">
        <button className="group flex w-full max-w-[420px] items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-left text-[13.5px] text-muted-foreground transition-colors hover:border-foreground/15">
          <Search className="h-[15px] w-[15px] shrink-0" />
          <span className="flex-1">Search screenshots...</span>
          <kbd className="hidden rounded-md border border-border bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <UploadDialog projects={projects} />
        <Button
          size="icon"
          variant="ghost"
          aria-label="Notifications"
          className="rounded-full text-muted-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-accent text-[13px] font-medium">
                {initial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
