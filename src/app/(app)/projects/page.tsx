import { ProjectCard } from "@/components/shared/project-card";
import { NewProjectDialog } from "@/components/shared/new-project-dialog";
import { getProjects, getProjectSummaries } from "@/lib/supabase/queries";
import { pluralize } from "@/utils/pluralize";

export default async function ProjectsPage() {
  const [projects, summaries] = await Promise.all([
    getProjects(),
    getProjectSummaries(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-[15px] text-muted-foreground">
            Screenshots grouped into folders. {projects.length}{" "}
            {pluralize(projects.length, "project")}.
          </p>
        </div>
        <NewProjectDialog />
      </div>

      {projects.length === 0 ? (
        <p className="text-[13.5px] text-muted-foreground">
          No projects yet. Create one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => {
            const summary = summaries.get(project.id);
            return (
              <ProjectCard
                key={project.id}
                project={{
                  id: project.id,
                  name: project.name,
                  updatedAt: project.updated_at,
                }}
                count={summary?.count ?? 0}
                coverImages={summary?.coverImages ?? []}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
