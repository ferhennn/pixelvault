import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { getUser } from "@/lib/supabase/dal";

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Manage your account.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-1">
          <p className="text-[13px] font-medium text-muted-foreground">
            Email
          </p>
          <p className="text-[15px] text-foreground">{user?.email}</p>
        </div>

        <form action={logout}>
          <Button type="submit" variant="destructive">
            <LogOut />
            Log out
          </Button>
        </form>
      </div>
    </div>
  );
}
