import { getStorageStats } from "@/lib/supabase/queries";
import { pluralize } from "@/utils/pluralize";

export default async function StoragePage() {
  const stats = await getStorageStats();

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          Storage Usage
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {stats.total.toLocaleString()}{" "}
          {pluralize(stats.total, "screenshot")} stored across your account.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-[15px] font-medium text-foreground/70">
          By category
        </h2>
        <div className="space-y-2 rounded-xl border border-border bg-card p-5">
          {stats.byCategory.map(({ category, count }) => (
            <div
              key={category}
              className="flex items-center justify-between text-[13.5px]"
            >
              <span className="text-foreground">{category}</span>
              <span className="text-muted-foreground">
                {count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {stats.byProject.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[15px] font-medium text-foreground/70">
            By project
          </h2>
          <div className="space-y-2 rounded-xl border border-border bg-card p-5">
            {stats.byProject.map(({ projectId, name, count }) => (
              <div
                key={projectId}
                className="flex items-center justify-between text-[13.5px]"
              >
                <span className="text-foreground">{name}</span>
                <span className="text-muted-foreground">
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
