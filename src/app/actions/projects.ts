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
