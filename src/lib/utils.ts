import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const floatingIconButtonClass =
  "flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#111] backdrop-blur-sm transition-colors hover:bg-white"
