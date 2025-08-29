import { useState, useEffect } from "react";
import { WeatherCard } from "./WeatherCard";
import { CheckInCard } from "./CheckInCard";
import { WeatherSearch } from "./WeatherSearch";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  location: string;
}

export const WeatherApp = () => {
  const { signOut } = useAuth();
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 32,
    condition: "Sunny",
    humidity: 68,
    location: "Kaduna, Nigeria"
  });

  const getWeatherForLocation = (location: string) => {
    // Mock weather data based on location - in a real app, you'd fetch from a weather API
    const weatherData: { [key: string]: WeatherData } = {
      "Kaduna, Nigeria": { temperature: 32, condition: "Sunny", humidity: 68, location: "Kaduna, Nigeria" },
      "Lagos, Nigeria": { temperature: 29, condition: "Cloudy", humidity: 82, location: "Lagos, Nigeria" },
      "Abuja, Nigeria": { temperature: 30, condition: "Sunny", humidity: 72, location: "Abuja, Nigeria" },
      "London, UK": { temperature: 15, condition: "Cloudy", humidity: 78, location: "London, UK" },
      "New York, USA": { temperature: 22, condition: "Sunny", humidity: 65, location: "New York, USA" },
      "Tokyo, Japan": { temperature: 26, condition: "Cloudy", humidity: 71, location: "Tokyo, Japan" },
      "Dubai, UAE": { temperature: 38, condition: "Sunny", humidity: 45, location: "Dubai, UAE" }
    };

    return weatherData[location] || { 
      temperature: 25, 
      condition: "Sunny", 
      humidity: 60, 
      location: location 
    };
  };

  const handleLocationChange = (newLocation: string) => {
    const newWeather = getWeatherForLocation(newLocation);
    setWeather(newWeather);
  };

  // Set default location on mount
  useEffect(() => {
    const defaultWeather = getWeatherForLocation("Kaduna, Nigeria");
    setWeather(defaultWeather);
  }, []);

  return (
    <div className="min-h-screen gradient-sky p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        <div className="text-center mb-8 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="absolute right-0 top-0 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Weather</h1>
          <p className="text-muted-foreground">Check the weather and check in daily</p>
        </div>
        
        <WeatherSearch 
          onLocationChange={handleLocationChange} 
          currentLocation={weather.location}
        />
        
        <WeatherCard weather={weather} />
        
        <CheckInCard lastCheckIn="Yesterday, 9:30 AM" />
      </div>
    </div>
  );
};