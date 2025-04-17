// imports
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaSearch } from "react-icons/fa";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// Type-safe Leaflet icon configuration (because we a using typescript)
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Component to handle map view changes
function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

// props for infering location
interface Location {
  lat: number;
  lng: number;
  name: string;
}

const MapWithSearch = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("Location not found");
      }

      const firstResult = data[0];
      setLocation({
        lat: parseFloat(firstResult.lat),
        lng: parseFloat(firstResult.lon),
        name: firstResult.display_name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "Your current location",
          });
        },
        (error) => {
          console.error("Failed to retrieve location: ", error);
          setError("Unable to retrieve your location");
        }
      );
    }
  };

  return (
    <div className="h-screen flex flex-col space-y-6">
      {/* Search Header */}
      <div className="p-4 bg-gray-50 border-b rounded-lg">
        <form
          onSubmit={handleSearch}
          className="lg:flex lg:flex-row flex flex-col gap-2 text-background">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a location..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="flex gap-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {isLoading ? "Searching..." : "Search"}
            <FaSearch />
          </Button>
          <Button
            type="button"
            onClick={locateUser}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            📍 My Location
          </Button>
        </form>
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </div>

      {/* Map Container */}
      <div className="flex-1">
        <MapContainer
          center={[9.082, 8.6753]} // Default center coordinate (Nigeria)
          zoom={6}
          className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {location && (
            <>
              <ChangeMapView coords={[location.lat, location.lng]} />
              <Marker position={[location.lat, location.lng]}>
                <Popup className="text-sm font-medium max-w-[200px]">
                  {location.name}
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapWithSearch;
