import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/types/db";
import type { Screenshot } from "@/types/screenshot";

export async function getProjects(): Promise<ProjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getScreenshots(projectId?: string): Promise<Screenshot[]> {
  const supabase = await createClient();

  let query = supabase
    .from("screenshots")
    .select("id, project_id, title, storage_path, category, tags, width, height, created_at")
    .order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return [];

  const paths = data.map((row) => row.storage_path);
  const { data: signed, error: signError } = await supabase.storage
    .from("screenshots")
    .createSignedUrls(paths, 3600);

  if (signError) throw new Error(signError.message);

  const urlByPath = new Map(signed.map((s) => [s.path, s.signedUrl]));

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    imageUrl: urlByPath.get(row.storage_path) ?? "",
    category: row.category,
    tags: row.tags,
    createdAt: row.created_at,
    aspectRatio: row.width / row.height,
    projectId: row.project_id ?? undefined,
  }));
}
