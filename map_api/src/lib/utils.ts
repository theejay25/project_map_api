import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// used for dynamic/conditional classNames in tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
