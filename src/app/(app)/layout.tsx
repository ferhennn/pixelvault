import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/supabase/dal";
import { getProjects } from "@/lib/supabase/queries";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, projects] = await Promise.all([requireUser(), getProjects()]);

  return (
    <AppShell email={user.email ?? ""} projects={projects}>
      {children}
    </AppShell>
  );
}
