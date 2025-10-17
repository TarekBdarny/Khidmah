import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertFileToKb(size: number) {
  return (size / 1024).toFixed(2);
}

export function convertFileToMb(size: number) {
  return (size / (1024 * 1024)).toFixed(2);
}
export function getExtension(fileName: string) {
  return fileName.split(".").pop();
}
