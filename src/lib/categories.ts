export const CATEGORIES = [
  "Code",
  "Design",
  "Errors",
  "Documents",
  "Receipts",
  "Ideas",
  "AI",
  "UI Inspiration",
] as const;

export type ScreenshotCategory = (typeof CATEGORIES)[number];
