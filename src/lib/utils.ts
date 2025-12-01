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
export function formatDate(dateInput: Date | string | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
type AddressComponentType =
  | "street_number"
  | "route"
  | "locality"
  | "administrative_area_level_1"
  | "administrative_area_level_2"
  | "country"
  | "postal_code"
  | "postal_code_suffix"
  | "neighborhood"
  | "sublocality"
  | "sublocality_level_1"
  | "sublocality_level_2"
  | "premise"
  | "subpremise"
  | "political";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: AddressComponentType[];
}

interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface Geometry {
  location: Location;
  location_type:
    | "ROOFTOP"
    | "RANGE_INTERPOLATED"
    | "GEOMETRIC_CENTER"
    | "APPROXIMATE";
  viewport: Viewport;
  bounds?: Viewport;
}

interface PlusCode {
  compound_code?: string;
  global_code: string;
}

interface GeocodeResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: PlusCode;
  types: string[];
}

interface GeocodingResponse {
  results: GeocodeResult[];
  status:
    | "OK"
    | "ZERO_RESULTS"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "INVALID_REQUEST"
    | "UNKNOWN_ERROR";
  error_message?: string;
}

// Return type for your function
interface LocationData {
  formattedAddress: string;
  city: string | undefined;
}

// Updated function with proper types
export async function getLocationInLanguage(
  lat: number,
  lng: number,
  language: "he" | "ar" | "en"
): Promise<LocationData | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=${language}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url);
  const data: GeocodingResponse = await response.json();

  if (data.status === "OK" && data.results[0]) {
    return {
      formattedAddress: data.results[0].formatted_address,
      city: data.results[0].address_components.find((c) =>
        c.types.includes("locality")
      )?.long_name,
    };
  }

  return null;
}
