import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MasonryGrid } from "@/components/shared/masonry-grid";
import { getProjects, getScreenshots } from "@/lib/supabase/queries";
import { categoryFromSlug } from "@/lib/categories";
import { pluralize } from "@/utils/pluralize";

export default async function CollectionDetailPage(
  props: PageProps<"/collections/[category]">,
) {
  const { category: slug } = await props.params;
  const category = categoryFromSlug(slug);

  if (!category) notFound();

  const [projects, screenshots] = await Promise.all([
    getProjects(),
    getScreenshots(undefined, category),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-[14px] w-[14px]" />
          Collections
        </Link>
        <div className="space-y-2">
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
            {category}
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {screenshots.length.toLocaleString()}{" "}
            {pluralize(screenshots.length, "screenshot")}
          </p>
        </div>
      </div>

      {screenshots.length > 0 ? (
        <MasonryGrid screenshots={screenshots} projects={projects} />
      ) : (
        <p className="text-[13.5px] text-muted-foreground">
          No screenshots in this collection yet.
        </p>
      )}
    </div>
  );
}
