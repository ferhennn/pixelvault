import { SearchPage } from "@/features/search/search-page";
import { getProjects, getScreenshots } from "@/lib/supabase/queries";

export default async function AiSearch() {
  const [screenshots, projects] = await Promise.all([
    getScreenshots(),
    getProjects(),
  ]);

  return <SearchPage screenshots={screenshots} projects={projects} aiCopy />;
}
