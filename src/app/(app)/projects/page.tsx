import { ProjectCard } from "@/components/shared/project-card";
import { getProjects, getScreenshots } from "@/lib/supabase/queries";

export default async function ProjectsPage() {
  const [projects, screenshots] = await Promise.all([
    getProjects(),
    getScreenshots(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Screenshots grouped into folders. {projects.length} project
          {projects.length === 1 ? "" : "s"}.
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="text-[13.5px] text-muted-foreground">
          No projects yet. Create one from the upload dialog.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => {
            const inProject = screenshots.filter(
              (s) => s.projectId === project.id,
            );
            return (
              <ProjectCard
                key={project.id}
                project={{
                  id: project.id,
                  name: project.name,
                  updatedAt: project.updated_at,
                }}
                count={inProject.length}
                coverCategory={inProject[0]?.category}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
