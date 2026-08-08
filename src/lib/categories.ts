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

export function categoryToSlug(category: ScreenshotCategory): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function categoryFromSlug(slug: string): ScreenshotCategory | undefined {
  return CATEGORIES.find((category) => categoryToSlug(category) === slug);
}
