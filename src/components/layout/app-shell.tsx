"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-[margin] duration-300 ease-out",
          collapsed ? "ml-[72px]" : "ml-[240px]",
        )}
      >
        <TopNav email={email} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1600px] px-8 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
