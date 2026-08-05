export type ScreenshotCategory =
  | "Code"
  | "Design"
  | "Errors"
  | "Documents"
  | "Receipts"
  | "Ideas"
  | "AI"
  | "UI Inspiration";

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
