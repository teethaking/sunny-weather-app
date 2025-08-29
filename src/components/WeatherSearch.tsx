import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherSearchProps {
  onLocationChange: (location: string) => void;
  currentLocation: string;
}

export const WeatherSearch = ({ onLocationChange, currentLocation }: WeatherSearchProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onLocationChange(searchInput.trim());
      setSearchInput("");
    }
  };

  const popularLocations = [
    "Lagos, Nigeria",
    "Abuja, Nigeria", 
    "London, UK",
    "New York, USA",
    "Tokyo, Japan",
    "Dubai, UAE"
  ];

  return (
    <Card className="gradient-card shadow-card border-0 p-4 transition-smooth">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Current: {currentLocation}</span>
        </div>
        
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search city, country..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="default" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Popular locations:</p>
          <div className="flex flex-wrap gap-2">
            {popularLocations.map((location) => (
              <Button
                key={location}
                variant="secondary"
                size="sm"
                onClick={() => onLocationChange(location)}
                className="text-xs"
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
      </form>
    </Card>
  );
};