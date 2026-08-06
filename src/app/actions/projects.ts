"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import type { ProjectRow } from "@/types/db";

export async function createProject(name: string): Promise<
  { data: ProjectRow; error?: undefined } | { data?: undefined; error: string }
> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Project name is required." };

  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: user.id, name: trimmed })
    .select("id, name, created_at, updated_at")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/projects");
  return { data };
}

export async function renameProject(
  id: string,
  name: string,
): Promise<{ error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Project name is required." };

  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ name: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return {};
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/projects");
  return {};
}
