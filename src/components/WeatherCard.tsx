import { Card } from "@/components/ui/card";
import { Cloud, Sun, Thermometer, Droplets } from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  location: string;
}

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-16 h-16 text-accent animate-float" />;
      case 'cloudy':
        return <Cloud className="w-16 h-16 text-primary animate-float" />;
      default:
        return <Sun className="w-16 h-16 text-accent animate-float" />;
    }
  };

  return (
    <Card className="gradient-card shadow-weather border-0 p-8 text-center transition-smooth hover:scale-105">
      <div className="space-y-6">
        <div className="flex justify-center">
          {getWeatherIcon(weather.condition)}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-card-foreground">{weather.location}</h2>
          <div className="flex items-center justify-center space-x-2">
            <Thermometer className="w-6 h-6 text-primary" />
            <span className="text-5xl font-bold text-primary">{weather.temperature}°</span>
          </div>
          <p className="text-xl text-muted-foreground capitalize">{weather.condition}</p>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-4 border-t border-border">
          <Droplets className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground">Humidity: {weather.humidity}%</span>
        </div>
      </div>
    </Card>
  );
};