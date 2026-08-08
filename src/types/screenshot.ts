import type { ScreenshotCategory } from "@/lib/categories";

export type { ScreenshotCategory };

export interface Screenshot {
  id: string;
  title: string;
  imageUrl: string;
  category: ScreenshotCategory;
  tags: string[];
  createdAt: string;
  aspectRatio: number;
  projectId?: string;
}
