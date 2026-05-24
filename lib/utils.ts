import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function normalizeBucket(bucket: string) {
  return bucket === "HAVENT_TRIED" ? "HAVENT_TRIED" : bucket;
}
