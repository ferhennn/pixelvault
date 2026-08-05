"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import type { ScreenshotCategory } from "@/types/screenshot";

const CATEGORIES: ScreenshotCategory[] = [
  "Code",
  "Design",
  "Errors",
  "Documents",
  "Receipts",
  "Ideas",
  "AI",
  "UI Inspiration",
];

export type UploadResult = { error?: string };

export async function uploadScreenshot(formData: FormData): Promise<UploadResult> {
  const user = await requireUser();

  const file = formData.get("file");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");
  const projectId = formData.get("projectId");
  const width = Number(formData.get("width"));
  const height = Number(formData.get("height"));

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided." };
  }
  if (!title) return { error: "Title is required." };
  if (!CATEGORIES.includes(category as ScreenshotCategory)) {
    return { error: "Invalid category." };
  }
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { error: "Invalid image dimensions." };
  }

  const tags = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("screenshots")
    .upload(path, file, { contentType: file.type || "image/png" });

  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("screenshots").insert({
    user_id: user.id,
    project_id: projectId ? String(projectId) : null,
    title,
    storage_path: path,
    category,
    tags,
    width,
    height,
  });

  if (insertError) {
    await supabase.storage.from("screenshots").remove([path]);
    return { error: insertError.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  return {};
}

export async function renameScreenshot(
  id: string,
  title: string,
): Promise<{ error?: string }> {
  const user = await requireUser();
  const trimmed = title.trim();
  if (!trimmed) return { error: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("screenshots")
    .update({ title: trimmed })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/projects");
  return {};
}
