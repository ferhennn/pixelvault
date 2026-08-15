import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/categories";
import type { ProjectRow, ScreenshotRow } from "@/types/db";
import type { Screenshot, ScreenshotCategory } from "@/types/screenshot";

function toScreenshot(
  row: ScreenshotRow,
  urlByPath: Map<string | null, string | null>,
): Screenshot {
  return {
    id: row.id,
    title: row.title,
    imageUrl: urlByPath.get(row.storage_path) ?? "",
    category: row.category,
    tags: row.tags,
    createdAt: row.created_at,
    aspectRatio: row.width / row.height,
    projectId: row.project_id ?? undefined,
    isFavorite: row.is_favorite,
  };
}

export const getProjects = cache(async (): Promise<ProjectRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
});

export async function getScreenshots(
  projectId?: string,
  category?: ScreenshotCategory,
  favoritesOnly?: boolean,
): Promise<Screenshot[]> {
  const supabase = await createClient();

  let query = supabase
    .from("screenshots")
    .select(
      "id, project_id, title, storage_path, category, tags, width, height, is_favorite, created_at",
    )
    .order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);
  if (category) query = query.eq("category", category);
  if (favoritesOnly) query = query.eq("is_favorite", true);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return [];

  const paths = data.map((row) => row.storage_path);
  const { data: signed, error: signError } = await supabase.storage
    .from("screenshots")
    .createSignedUrls(paths, 3600);

  if (signError) throw new Error(signError.message);

  const urlByPath = new Map(signed.map((s) => [s.path, s.signedUrl]));

  return data.map((row) => toScreenshot(row, urlByPath));
}

export type CoverSummary = { count: number; coverImages: string[] };

const MAX_COVER_IMAGES = 4;

/** Groups storage paths by key, signs up to MAX_COVER_IMAGES covers per group, without signing every screenshot in the account. */
async function summarizeByCover(
  pathsByKey: Map<string, string[]>,
): Promise<Map<string, CoverSummary>> {
  const supabase = await createClient();

  const coverPaths = [...pathsByKey.values()].flatMap((paths) =>
    paths.slice(0, MAX_COVER_IMAGES),
  );

  const { data: signed, error: signError } = coverPaths.length
    ? await supabase.storage.from("screenshots").createSignedUrls(coverPaths, 3600)
    : { data: [], error: null };

  if (signError) throw new Error(signError.message);

  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  const summaries = new Map<string, CoverSummary>();
  for (const [key, paths] of pathsByKey) {
    summaries.set(key, {
      count: paths.length,
      coverImages: paths.slice(0, MAX_COVER_IMAGES).map((p) => urlByPath.get(p) ?? ""),
    });
  }
  return summaries;
}

export type ProjectSummary = CoverSummary;

/** Per-project screenshot count + up to 4 cover thumbnails. */
export async function getProjectSummaries(): Promise<Map<string, ProjectSummary>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("screenshots")
    .select("project_id, storage_path")
    .not("project_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const pathsByProject = new Map<string, string[]>();
  for (const row of data ?? []) {
    const projectId = row.project_id as string;
    const paths = pathsByProject.get(projectId) ?? [];
    paths.push(row.storage_path);
    pathsByProject.set(projectId, paths);
  }

  return summarizeByCover(pathsByProject);
}

export type CategorySummary = CoverSummary;

/** Per-category screenshot count + up to 4 cover thumbnails. */
export async function getCategorySummaries(): Promise<Map<ScreenshotCategory, CategorySummary>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("screenshots")
    .select("category, storage_path")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const pathsByCategory = new Map<string, string[]>();
  for (const row of data ?? []) {
    const paths = pathsByCategory.get(row.category) ?? [];
    paths.push(row.storage_path);
    pathsByCategory.set(row.category, paths);
  }

  return summarizeByCover(pathsByCategory) as Promise<Map<ScreenshotCategory, CategorySummary>>;
}

export type DuplicateGroup = { key: string; screenshots: Screenshot[] };

/** Groups screenshots that share a title (case-insensitive) and pixel dimensions. */
export async function getDuplicateGroups(): Promise<DuplicateGroup[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("screenshots")
    .select(
      "id, project_id, title, storage_path, category, tags, width, height, is_favorite, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return [];

  const rowsByKey = new Map<string, ScreenshotRow[]>();
  for (const row of data) {
    const key = `${row.title.trim().toLowerCase()}::${row.width}x${row.height}`;
    const rows = rowsByKey.get(key) ?? [];
    rows.push(row);
    rowsByKey.set(key, rows);
  }

  const duplicates = [...rowsByKey.entries()]
    .filter(([, rows]) => rows.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  if (duplicates.length === 0) return [];

  const paths = duplicates.flatMap(([, rows]) => rows.map((r) => r.storage_path));
  const { data: signed, error: signError } = await supabase.storage
    .from("screenshots")
    .createSignedUrls(paths, 3600);

  if (signError) throw new Error(signError.message);

  const urlByPath = new Map(signed.map((s) => [s.path, s.signedUrl]));

  return duplicates.map(([key, rows]) => ({
    key,
    screenshots: rows.map((row) => toScreenshot(row, urlByPath)),
  }));
}

export type StorageStats = {
  total: number;
  byCategory: { category: ScreenshotCategory; count: number }[];
  byProject: { projectId: string; name: string; count: number }[];
};

/** Screenshot counts by category and project — no signed URLs, cheap to compute. */
export async function getStorageStats(): Promise<StorageStats> {
  const supabase = await createClient();

  const [{ data, error }, projects] = await Promise.all([
    supabase.from("screenshots").select("category, project_id"),
    getProjects(),
  ]);

  if (error) throw new Error(error.message);

  const countByCategory = new Map<string, number>();
  const countByProject = new Map<string, number>();
  for (const row of data ?? []) {
    countByCategory.set(row.category, (countByCategory.get(row.category) ?? 0) + 1);
    if (row.project_id) {
      countByProject.set(row.project_id, (countByProject.get(row.project_id) ?? 0) + 1);
    }
  }

  const nameByProjectId = new Map(projects.map((p) => [p.id, p.name]));

  return {
    total: data?.length ?? 0,
    byCategory: CATEGORIES.map((category) => ({
      category,
      count: countByCategory.get(category) ?? 0,
    })),
    byProject: [...countByProject.entries()]
      .map(([projectId, count]) => ({
        projectId,
        name: nameByProjectId.get(projectId) ?? "Untitled",
        count,
      }))
      .sort((a, b) => b.count - a.count),
  };
}
