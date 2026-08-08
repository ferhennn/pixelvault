import { CollectionCard } from "@/components/shared/collection-card";
import { getCategorySummaries } from "@/lib/supabase/queries";
import { CATEGORIES } from "@/lib/categories";

export default async function CollectionsPage() {
  const summaries = await getCategorySummaries();

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          Collections
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Screenshots grouped automatically by category.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATEGORIES.map((category) => {
          const summary = summaries.get(category);
          return (
            <CollectionCard
              key={category}
              category={category}
              count={summary?.count ?? 0}
              coverImages={summary?.coverImages ?? []}
            />
          );
        })}
      </div>
    </div>
  );
}
