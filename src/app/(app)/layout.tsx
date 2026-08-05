import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/supabase/dal";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return <AppShell email={user.email ?? ""}>{children}</AppShell>;
}
