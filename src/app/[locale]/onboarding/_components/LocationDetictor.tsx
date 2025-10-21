// types/city.ts

// components/SmartCitySelector.tsx
"use client";
interface City {
  name: string;
  code: string;
  lat: number;
  lng: number;
  englishName?: string;
  arabicName?: string;
}
import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Search,
  X,
  Check,
  Loader2,
  ChevronsUpDown,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
type WantedCityDispatcher = React.Dispatch<
  React.SetStateAction<{ city: string; phoneNumber: string; age: number }>
>;
interface SmartCitySelectorProps {
  onCitySelect?: (city: City) => void;
  initialCity?: string;
  wantedCityDispatcher: WantedCityDispatcher;
  phoneNumber: string;
  age: number;
}

interface City {
  name: string;
  code: string;
  lat: number;
  lng: number;
}

export function SmartCitySelector({
  onCitySelect,
  initialCity,
  wantedCityDispatcher,
  phoneNumber,
  age,
}: SmartCitySelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [detectedCity, setDetectedCity] = useState<City | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || "");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities");
        const data = await response.json();

        if (data.success) {
          // Map cities with coordinates (you'll need to add coordinates to your API)
          // For now, using mock coordinates
          const citiesWithCoords: City[] = data.cities.map((city: any) => ({
            name: city.name,
            code: city.code,
            lat: 32.0853, // Mock - replace with actual coordinates
            lng: 34.7818, // Mock - replace with actual coordinates
          }));
          setCities(citiesWithCoords);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        // Fallback to mock data
        const mockCities: City[] = [
          { name: "תל אביב-יפו", code: "5000", lat: 32.0853, lng: 34.7818 },
          { name: "ירושלים", code: "3000", lat: 31.7683, lng: 35.2137 },
          { name: "חיפה", code: "4000", lat: 32.794, lng: 34.9896 },
          { name: "ראשון לציון", code: "8300", lat: 31.973, lng: 34.7925 },
          { name: "פתח תקווה", code: "7900", lat: 32.0878, lng: 34.8875 },
          { name: "אשדוד", code: "70", lat: 31.8044, lng: 34.6553 },
          { name: "נתניה", code: "9400", lat: 32.3215, lng: 34.8532 },
          { name: "באר שבע", code: "9000", lat: 31.2518, lng: 34.7913 },
          { name: "בני ברק", code: "6100", lat: 32.0809, lng: 34.8338 },
          { name: "חולון", code: "6200", lat: 32.0117, lng: 34.7742 },
        ];
        setCities(mockCities);
      }
    };

    fetchCities();
  }, []);

  // Check localStorage for saved city
  useEffect(() => {
    const savedCity = localStorage.getItem("userCity");
    if (savedCity && !initialCity) {
      setSelectedCity(savedCity);
      setValue(savedCity);
    }
  }, [initialCity]);

  // Auto-detect user location
  const detectLocation = async (): Promise<void> => {
    setIsDetecting(true);
    setError("");

    if (!navigator.geolocation) {
      setError("הדפדפן שלך לא תומך בזיהוי מיקום");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;

        // Find nearest city
        const nearest = findNearestCity(latitude, longitude);
        if (nearest) {
          setDetectedCity(nearest);
          setSelectedCity(nearest.name);
        }
        setIsDetecting(false);
      },
      (error: GeolocationPositionError) => {
        setError("לא הצלחנו לזהות את המיקום שלך. אנא בחר עיר ידנית.");
        setIsDetecting(false);
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestCity = (lat: number, lng: number): City | null => {
    if (cities.length === 0) return null;

    let nearest = cities[0];
    let minDistance = Infinity;

    cities.forEach((city) => {
      const distance = calculateDistance(lat, lng, city.lat, city.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = city;
      }
    });

    return nearest;
  };
  // Filter cities based on search
  const filteredCities: City[] = cities
    .filter((city) => city.name.includes(searchTerm))
    .slice(0, 5); // Show max 5 results

  const handleCitySelect = (city: City): void => {
    setSelectedCity(city.name);
    wantedCityDispatcher({ city: city.name, phoneNumber, age });
    setSearchTerm("");
    setShowAutocomplete(false);
    setDetectedCity(null);

    // Save to localStorage
    localStorage.setItem("userCity", city.name);

    // Callback to parent
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  const handleConfirmDetected = (): void => {
    if (detectedCity) {
      localStorage.setItem("userCity", detectedCity.name);
      if (onCitySelect) {
        onCitySelect(detectedCity);
      }
      setValue(detectedCity.name);
      wantedCityDispatcher({
        city: detectedCity.name,
        phoneNumber,
        age,
      });
    }
    setDetectedCity(null);
  };

  const handleClearSelection = (): void => {
    setSelectedCity("");
    setSearchTerm("");
    wantedCityDispatcher({ city: "", phoneNumber, age });
    setValue("");
    localStorage.removeItem("userCity");
  };

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      <div>
        <FieldGroup className="flex flex-row items-end ">
          <Field className="flex-1 relative ">
            <FieldLabel>עיר</FieldLabel>
            <FieldContent>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className=" justify-between flex-1"
                  >
                    {value ? value : "Select City"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 flex-1" align="start">
                  <Command className="">
                    <CommandInput
                      onClick={() => setShowAutocomplete(true)}
                      className="h-9"
                      onValueChange={(value) => {
                        setSearchTerm(value);
                        setShowAutocomplete(value.length > 0);
                      }}
                      placeholder="Search City"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No results found for {searchTerm}
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredCities.map((city) => (
                          <CommandItem
                            key={city.name}
                            value={city.name}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              handleCitySelect(city);
                              setOpen(false);
                            }}
                          >
                            {city.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === city.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedCity && !detectedCity && (
                <div className="mt-2 p-4 border-1  border-primary rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-muted-foreground">
                        עיר נבחרה:
                      </span>
                      <span>{selectedCity}</span>
                    </div>
                    <Button
                      variant={"ghost"}
                      onClick={handleClearSelection}
                      className="text-red-500 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
            </FieldContent>
          </Field>
          {!selectedCity && (
            <div>
              <Button
                variant={"action"}
                onClick={detectLocation}
                disabled={isDetecting}
                className=""
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>מזהה מיקום...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    <span>זהה את המיקום שלי אוטומטית</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </FieldGroup>
        {detectedCity && (
          <div className="mt-6 p-4  border-2 border-green-500 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-muted-foreground">
                  זיהינו שאתה נמצא ב
                </span>
                <span>{detectedCity.name}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant={"action"}
                onClick={handleConfirmDetected}
                className="flex-1 "
              >
                <Check className="w-4 h-4" />
                <span>נכון</span>
              </Button>
              <Button
                variant={"outline"}
                onClick={() => {
                  setDetectedCity(null);
                  setValue("");
                }}
                className="flex-1"
              >
                <X className="w-4 h-4" />
                <span>לא נכון</span>
              </Button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartCitySelector;
