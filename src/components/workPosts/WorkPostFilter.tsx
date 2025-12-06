"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Search, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce"; // I might not have this package, I'll implement debounce manually or use a simple timeout
import { toast } from "sonner";

export function WorkPostFilter({
  defaultMaxDistance = 50,
}: {
  defaultMaxDistance?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [useLocation, setUseLocation] = useState(!!searchParams.get("lat"));
  const [distance, setDistance] = useState([
    parseInt(searchParams.get("maxDistance") || defaultMaxDistance.toString()),
  ]);
  const [location, setLocation] = useState<{ lat: number; lgn: number } | null>(
    null
  );
  const [debouncedCategory] = useDebounce(category, 500);
  const [debouncedDistance] = useDebounce(distance, 500);

  useEffect(() => {
    if (useLocation && !location) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lgn: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location", error);
            toast.error(
              "Could not get your location. Please enable location services."
            );
            setUseLocation(false);
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
        setUseLocation(false);
      }
    }
  }, [useLocation, location]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedCategory) {
      params.set("category", debouncedCategory);
    } else {
      params.delete("category");
    }

    if (useLocation && location) {
      params.set("lat", location.lat.toString());
      params.set("lgn", location.lgn.toString());
      params.set("maxDistance", debouncedDistance[0].toString());
    } else {
      params.delete("lat");
      params.delete("lgn");
      params.delete("maxDistance");
    }

    // Reset page when filters change
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  }, [
    debouncedCategory,
    useLocation,
    location,
    debouncedDistance,
    router,
    searchParams,
  ]);

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="category" className="mb-2 block">
            Search Category
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="category"
              placeholder="e.g. Plumbing, Electrician..."
              className="pl-8"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="location-mode"
            checked={useLocation}
            onCheckedChange={setUseLocation}
          />
          <Label
            htmlFor="location-mode"
            className="flex items-center gap-2 cursor-pointer"
          >
            <MapPin className="h-4 w-4" />
            Filter by my location
          </Label>
        </div>

        {useLocation && (
          <div className="flex items-center gap-4 flex-1 max-w-xs ml-4">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Within {distance[0]} km
            </span>
            <Slider
              value={distance}
              onValueChange={setDistance}
              max={200}
              step={5}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
