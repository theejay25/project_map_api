import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaSearch } from "react-icons/fa";
import { ClockLoader } from "react-spinners";

// Simple icon setup for Location
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function SimpleMapWithSearch() {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [locationName, setLocationName] = useState("London");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const newPos: [number, number] = [
          parseFloat(data[0].lat),
          parseFloat(data[0].lon),
        ];
        setPosition(newPos);
        setLocationName(data[0].display_name);
      }
      console.log(data);
      console.log(data[0].display_name);
    } catch (error) {
      console.error("Search failed:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen space-y-6">
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <form
          onSubmit={handleSearch}
          className="md:flex md:flex-row flex flex-col gap-2 text-background">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search location..."
            className="flex-1 p-2 border rounded text-black"
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isLoading}>
            {isLoading ? <ClockLoader size={23} color="white" /> : "Search"}
            <FaSearch />
          </Button>
        </form>
        {locationName && (
          <p className="flex flex-col text-lg mt-4 text-black font-bold">
            Current Location: {locationName}
          </p>
        )}
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer center={position} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView center={position} />
          <Marker position={position}>
            <Popup>{locationName}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
