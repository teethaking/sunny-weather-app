import { useState, useEffect } from "react";
import { WeatherCard } from "./WeatherCard";
import { CheckInCard } from "./CheckInCard";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  location: string;
}

export const WeatherApp = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 24,
    condition: "Sunny",
    humidity: 65,
    location: "San Francisco"
  });

  // Mock weather data - in a real app, you'd fetch from a weather API
  useEffect(() => {
    const mockWeatherData = [
      { temperature: 24, condition: "Sunny", humidity: 65, location: "San Francisco" },
      { temperature: 18, condition: "Cloudy", humidity: 78, location: "Seattle" },
      { temperature: 28, condition: "Sunny", humidity: 45, location: "Los Angeles" }
    ];
    
    // Simulate API call
    const randomWeather = mockWeatherData[Math.floor(Math.random() * mockWeatherData.length)];
    setWeather(randomWeather);
  }, []);

  return (
    <div className="min-h-screen gradient-sky p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Weather</h1>
          <p className="text-muted-foreground">Check the weather and check in daily</p>
        </div>
        
        <WeatherCard weather={weather} />
        
        <CheckInCard lastCheckIn="Yesterday, 9:30 AM" />
      </div>
    </div>
  );
};