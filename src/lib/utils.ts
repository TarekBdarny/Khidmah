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
export function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.slice(0, 1).toUpperCase()}${lastName
    ?.slice(0, 1)
    .toUpperCase()}`;
}
export function timeAgo(date: Date | string | number): string {
  const now = new Date();
  const past = new Date(date);
  const secondsAgo = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Handle future dates
  if (secondsAgo < 0) {
    return "just now";
  }

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Less than a minute
  if (secondsAgo < 60) {
    return "just now";
  }

  // Minutes
  if (secondsAgo < intervals.hour) {
    const minutes = Math.floor(secondsAgo / intervals.minute);
    return `${minutes}m ago`;
  }

  // Hours
  if (secondsAgo < intervals.day) {
    const hours = Math.floor(secondsAgo / intervals.hour);
    return `${hours}h ago`;
  }

  // Days
  if (secondsAgo < intervals.week) {
    const days = Math.floor(secondsAgo / intervals.day);
    return `${days}d ago`;
  }

  // Weeks
  if (secondsAgo < intervals.month) {
    const weeks = Math.floor(secondsAgo / intervals.week);
    return `${weeks}w ago`;
  }

  // Months
  if (secondsAgo < intervals.year) {
    const months = Math.floor(secondsAgo / intervals.month);
    return `${months}mo ago`;
  }

  // Years
  const years = Math.floor(secondsAgo / intervals.year);
  return `${years}y ago`;
}
export const formatLastSeen = (date: Date | string | null | undefined) => {
  if (!date) return "Last seen recently";

  const lastSeenDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return lastSeenDate.toLocaleDateString();
};
