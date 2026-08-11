import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MasonryGrid } from "@/components/shared/masonry-grid";
import { ProjectHeaderActions } from "@/components/shared/project-header-actions";
import { getProjects, getScreenshots } from "@/lib/supabase/queries";
import { pluralize } from "@/utils/pluralize";

export default async function ProjectDetailPage(
  props: PageProps<"/projects/[projectId]">,
) {
  const { projectId } = await props.params;
  const [projects, screenshots] = await Promise.all([
    getProjects(),
    getScreenshots(projectId),
  ]);
  const project = projects.find((p) => p.id === projectId);

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-[14px] w-[14px]" />
          Projects
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
              {project.name}
            </h1>
            <p className="text-[15px] text-muted-foreground">
              {screenshots.length.toLocaleString()}{" "}
              {pluralize(screenshots.length, "screenshot")}
            </p>
          </div>
          <ProjectHeaderActions projectId={project.id} projectName={project.name} />
        </div>
      </div>

      {screenshots.length > 0 ? (
        <MasonryGrid screenshots={screenshots} projects={projects} />
      ) : (
        <p className="text-[13.5px] text-muted-foreground">
          No screenshots in this project yet.
        </p>
      )}
    </div>
  );
}
