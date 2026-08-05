import type { ScreenshotCategory } from "@/types/screenshot";

export const categoryGradients: Record<ScreenshotCategory, string> = {
  Code: "from-[#1d1d1f] to-[#3a3a3c]",
  Design: "from-[#ff6b8b] to-[#ff9f0a]",
  Errors: "from-[#ff453a] to-[#7d1f1a]",
  Documents: "from-[#6b7280] to-[#374151]",
  Receipts: "from-[#34c759] to-[#0a5f2a]",
  Ideas: "from-[#ffd60a] to-[#ff9f0a]",
  AI: "from-[#0071e3] to-[#5e2ced]",
  "UI Inspiration": "from-[#5e2ced] to-[#0071e3]",
};
