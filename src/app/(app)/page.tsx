import { HomeGallery } from "@/features/search/home-gallery";
import { getScreenshots, getProjects } from "@/lib/supabase/queries";
import { getUser } from "@/lib/supabase/dal";
import { pluralize } from "@/utils/pluralize";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default async function Home() {
  const [screenshots, projects, user] = await Promise.all([
    getScreenshots(),
    getProjects(),
    getUser(),
  ]);
  const name = user?.email?.split("@")[0] ?? "";

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2 pt-4 text-center">
        <h1 className="text-[44px] font-semibold tracking-tight text-foreground">
          {getGreeting()}{name && `, ${name}`}.
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {screenshots.length.toLocaleString()}{" "}
          {pluralize(screenshots.length, "screenshot")} &middot; Everything is
          instantly searchable.
        </p>
      </div>

      <HomeGallery screenshots={screenshots} projects={projects} />
    </div>
  );
}
