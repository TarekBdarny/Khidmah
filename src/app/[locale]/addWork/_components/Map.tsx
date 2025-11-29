import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  Dispatch,
} from "react";
import {
  MapPin,
  Navigation,
  Search,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { JobPosting } from "../page";

const libraries: ("places" | "geometry")[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
};

const israelCenter = {
  lat: 32.0853,
  lng: 34.7818,
};

const mapOptions = {
  disableDefaultUI: false,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: true,
};

interface LocationData {
  lat: number; // Latitude
  lng: number; // Longitude
  address: string;
  city: string;
  link?: string;
}
type GoogleMapsLocationSelectorProps = {
  setFormData: React.Dispatch<React.SetStateAction<JobPosting>>;
};
const GoogleMapsLocationSelector = ({
  setFormData,
}: GoogleMapsLocationSelectorProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
    libraries,
    language: "he",
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    getUserLocation(map);
  }, []);
  const handleCopyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(generateGoogleMapsLink());

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const getUserLocation = (mapInstance: google.maps.Map) => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          mapInstance.setCenter(pos);
          mapInstance.setZoom(15);
          setMarkerPosition(pos);
          getAddressFromCoordinates(pos);
          setIsLocating(false);
        },
        (error) => {
          setIsLocating(false);
          console.log("Geolocation error:", error);
        }
      );
    } else {
      setIsLocating(false);
      console.log("Browser doesn't support geolocation");
    }
  };

  const getAddressFromCoordinates = (location: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        // Extract city name from address components
        let cityName = "";
        const addressComponents = results[0].address_components;

        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            cityName = component.long_name;
            break;
          }
          // Fallback to administrative_area_level_2 if locality not found
          if (
            !cityName &&
            component.types.includes("administrative_area_level_2")
          ) {
            cityName = component.long_name;
          }
        }

        setSelectedLocation({
          lat: location.lat,
          lng: location.lng,
          address: results[0].formatted_address,
          city: cityName,
          link: generateGoogleMapsLink(),
        });
      }
    });
  };

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(position);
      getAddressFromCoordinates(position);
    }
  }, []);

  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(position);
      getAddressFromCoordinates(position);
    }
  }, []);

  const onAutocompleteLoad = (
    autocompleteInstance: google.maps.places.Autocomplete
  ) => {
    setAutocomplete(autocompleteInstance);
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      location: {
        address: selectedLocation ? selectedLocation.address : "",
        lat: selectedLocation ? selectedLocation.lat : 0,
        lgn: selectedLocation ? selectedLocation.lng : 0,
        city: selectedLocation?.city,
        postalCode: prev.location.postalCode,
      },
      workSiteLink: generateGoogleMapsLink(),
    }));
  }, [selectedLocation]);
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        alert("לא נמצאו פרטים עבור מקום זה");
        return;
      }

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      let cityName = "";
      if (place.address_components) {
        for (const component of place.address_components) {
          if (component.types.includes("locality")) {
            cityName = component.long_name;
            break;
          }
          if (
            !cityName &&
            component.types.includes("administrative_area_level_2")
          ) {
            cityName = component.long_name;
          }
        }
      }

      setMarkerPosition(location);
      setSelectedLocation({
        ...location,
        address: place.formatted_address || place.name || "",
        city: cityName,
      });

      if (map) {
        map.setCenter(location);
        map.setZoom(15);
      }
    }
  };

  const removeMarker = () => {
    setMarkerPosition(null);
    setSelectedLocation(null);
  };

  const recenterToUserLocation = () => {
    if (map) {
      getUserLocation(map);
    }
  };

  const generateGoogleMapsLink = () => {
    if (!selectedLocation) return "";
    return `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
  };

  const openInGoogleMaps = () => {
    const link = generateGoogleMapsLink();
    if (link) {
      window.open(link, "_blank");
    }
  };

  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-red-600 text-center">
          שגיאה בטעינת מפות Google. אנא בדוק את מפתח ה-API.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">טוען מפה...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        בחר מיקום לאתר העבודה
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
              componentRestrictions: { country: "il" },
              fields: ["formatted_address", "geometry", "name"],
            }}
          >
            <input
              type="text"
              placeholder="חפש עיר או כתובת בישראל..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </Autocomplete>
          <Search
            className="absolute right-4 top-3.5 text-gray-400 pointer-events-none"
            size={20}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={recenterToUserLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          <Navigation size={18} />
          {isLocating ? "מאתר..." : "המיקום שלי"}
        </button>

        {markerPosition && (
          <button
            onClick={removeMarker}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            הסר סימון
          </button>
        )}
      </div>

      {/* Map Container */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={israelCenter}
          zoom={8}
          onLoad={onMapLoad}
          onClick={onMapClick}
          options={mapOptions}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
            />
          )}
        </GoogleMap>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            מיקום נבחר
          </h3>
          <p className="text-gray-700 mb-2" dir="rtl">
            {selectedLocation.address}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            קואורדינטות: {selectedLocation.lat.toFixed(6)},{" "}
            {selectedLocation.lng.toFixed(6)}
          </p>

          {/* Google Maps Route Link */}
          <div className="flex gap-2">
            <button
              onClick={openInGoogleMaps}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <ExternalLink size={18} />
              פתח ניווט ב-Google Maps
            </button>

            <Button
              variant={"outline"}
              onClick={handleCopyLink}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {isCopied ? (
                <>
                  <p>Link copied</p>
                  <Check size={18} className="text-primary" />
                </>
              ) : (
                <>
                  <p>Copy link</p>
                  <Copy size={18} />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2">הוראות שימוש:</h4>
        <ul className="text-sm text-gray-600 space-y-1" dir="rtl">
          <li>• לחץ על הכפתור "המיקום שלי" לאיתור אוטומטי</li>
          <li>• חפש עיר או כתובת בשורת החיפוש</li>
          <li>• לחץ על המפה כדי לסמן מיקום</li>
          <li>• גרור את הסמן לשינוי המיקום</li>
          <li>• השתמש בכפתור הניווט לפתיחת מסלול ב-Google Maps</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleMapsLocationSelector;
