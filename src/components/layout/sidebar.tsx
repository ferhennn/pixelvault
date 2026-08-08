"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  Search,
  Image as ImageIcon,
  Folder,
  FolderKanban,
  Heart,
  Clock,
  Copy,
  Sparkles,
  Settings,
  HardDrive,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/", label: "Library", icon: ImageIcon },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/collections", label: "Collections", icon: FolderKanban },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/recent", label: "Recent", icon: Clock },
  { href: "/duplicates", label: "Duplicates", icon: Copy },
  { href: "/ai-search", label: "AI Search", icon: Sparkles },
] as const;

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-border bg-sidebar transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[240px]",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2 px-5",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Camera className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="text-[15px] font-semibold tracking-tight">
            PixelVault
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="space-y-0.5 px-3 pb-3">
        <SidebarLink
          href="/settings"
          label="Settings"
          icon={Settings}
          collapsed={collapsed}
          active={pathname === "/settings"}
        />
        <SidebarLink
          href="/storage"
          label="Storage Usage"
          icon={HardDrive}
          collapsed={collapsed}
          active={pathname === "/storage"}
        />
      </div>

      <div className="border-t border-border p-3">
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-foreground/50 transition-colors hover:bg-accent hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="h-[18px] w-[18px]" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  collapsed,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
  active: boolean;
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground",
        active && "bg-accent text-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
