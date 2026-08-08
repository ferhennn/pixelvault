import type { ScreenshotCategory } from "@/types/screenshot";

export interface ProjectRow {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ScreenshotRow {
  id: string;
  project_id: string | null;
  title: string;
  storage_path: string;
  category: ScreenshotCategory;
  tags: string[];
  width: number;
  height: number;
  is_favorite: boolean;
  created_at: string;
}
